# 如何在 PoCL 中添加新的 GPU 架构支持

本指南详细说明如何在 PoCL 中添加一个新的 GPU 架构驱动。

---

## 🚀 快速决策：我该走哪条路？

### 情况 1: ✅ **你已有 SPIR-V → GPU 二进制编译器**（最简单）

**你需要做的：**
- ✅ 实现设备驱动接口（~500-1000 行代码）
- ✅ 在 `post_build_program` 中调用你的编译器
- ❌ **不需要** 修改 LLVM
- ❌ **不需要** 实现复杂的代码生成器

**编译流程：**
```
OpenCL C → LLVM IR → SPIR-V → [你的编译器] → GPU 二进制
  (PoCL)    (PoCL)   (PoCL)      (外部调用)      (加载执行)
```

**开发时间：** 1-2 周  
**参考实现：** Vulkan 驱动 (`/lib/CL/devices/vulkan/`)  
**跳转到：** [步骤 3.1 - SPIR-V 方案](#31-spir-v-gpu)

---

### 情况 2: 你有 LLVM 后端

**你需要做的：**
- ✅ 实现设备驱动接口
- ✅ 集成 LLVM 目标机器 (TargetMachine)
- ✅ 可能需要自定义 LLVM passes

**编译流程：**
```
OpenCL C → LLVM IR → [LLVM后端] → GPU 代码
  (PoCL)    (PoCL)     (集成)
```

**开发时间：** 2-4 周  
**参考实现：** CUDA 驱动 (`/lib/CL/devices/cuda/`)  
**跳转到：** [步骤 3.2 - LLVM 后端方案](#32-gpu-llvm)

---

### 情况 3: 什么都没有（需要从头实现）

**你需要做的：**
- ✅ 实现设备驱动接口
- ✅ 实现 LLVM IR → GPU 代码转换器
- ✅ 或使用 SPIR-V 并实现 SPIR-V → GPU 转换器

**开发时间：** 1-3 个月  
**建议：** 使用 SPIR-V 路径（情况 1）+ 开发 SPIR-V 编译器

---

## 📋 总体流程概述

添加新 GPU 架构需要以下主要步骤：

1. 创建设备驱动目录和基础文件
2. 实现设备操作接口 (device operations)
3. 实现编译器后端（LLVM IR → GPU 代码）
4. 实现内核库 (kernel library)
5. 修改构建系统
6. 注册新设备到 PoCL
7. 测试和优化

---

## 🏗️ 推荐参考的架构

根据复杂度和相似性选择参考：

### 1. **CUDA 驱动** (最完整，推荐作为主要参考)
- 路径: `/lib/CL/devices/cuda/`
- 适合: NVIDIA-like GPU，基于 LLVM PTX 后端
- 特点: 完整功能，包括内置内核、SVM、异步执行

### 2. **Vulkan 驱动** (适合通用 GPU API)
- 路径: `/lib/CL/devices/vulkan/`
- 适合: 通过通用 GPU API 访问的设备
- 特点: 使用 SPIR-V，不依赖特定硬件 API

### 3. **HSA 驱动** (适合 AMD GPU)
- 路径: `/lib/CL/devices/hsa/`
- 适合: AMD-like GPU，HSA 运行时
- 特点: HSAIL/GCN 代码生成

### 4. **Level Zero 驱动** (Intel GPU)
- 路径: `/lib/CL/devices/level0/`
- 适合: Intel GPU
- 特点: 使用 Level Zero API

---

## 📁 步骤 1: 创建设备驱动目录结构

假设我们要添加一个名为 "mygpu" 的新 GPU 架构。

### 1.1 创建目录
```bash
mkdir -p lib/CL/devices/mygpu
```

### 1.2 创建必需的基础文件

#### `lib/CL/devices/mygpu/pocl-mygpu.h`
```c
/* pocl-mygpu.h - declarations for MyGPU driver */

#ifndef POCL_MYGPU_H
#define POCL_MYGPU_H

#include "pocl_cl.h"
#include "config.h"

// 包含你的 GPU SDK 头文件
// #include <mygpu_api.h>

#include "prototypes.inc"
GEN_PROTOTYPES (mygpu)

#endif /* POCL_MYGPU_H */
```

**说明**: `GEN_PROTOTYPES` 宏会自动生成所有需要的函数原型。

#### `lib/CL/devices/mygpu/pocl-mygpu.c`
```c
/* pocl-mygpu.c - driver for MyGPU devices */

#include "config.h"
#include "pocl-mygpu.h"
#include "common.h"
#include "common_driver.h"
#include "devices.h"
#include "pocl.h"
#include "pocl_cache.h"
#include "pocl_file_util.h"
#include "pocl_llvm.h"
#include "pocl_mem_management.h"
#include "pocl_util.h"

#include <string.h>

// 设备数据结构
typedef struct pocl_mygpu_device_data_s {
    // GPU 设备句柄
    // mygpu_device_t device;
    // mygpu_context_t context;
    
    cl_bool available;
    // 其他设备特定数据
} pocl_mygpu_device_data_t;

// 队列数据结构
typedef struct pocl_mygpu_queue_data_s {
    // mygpu_queue_t queue;
    // 其他队列相关数据
} pocl_mygpu_queue_data_t;

// 事件数据结构
typedef struct pocl_mygpu_event_data_s {
    // mygpu_event_t event;
    // 时间戳等
} pocl_mygpu_event_data_t;

// 内核数据结构
typedef struct pocl_mygpu_kernel_data_s {
    // mygpu_kernel_t kernel;
    // 参数对齐信息等
} pocl_mygpu_kernel_data_t;

// 程序数据结构
typedef struct pocl_mygpu_program_data_s {
    // mygpu_module_t module;
    // 编译后的二进制
} pocl_mygpu_program_data_t;

//=============================================================================
// 核心函数实现
//=============================================================================

void
pocl_mygpu_init_device_ops (struct pocl_device_ops *ops)
{
    // 设备名称
    ops->device_name = "mygpu";
    
    // 核心设备管理
    ops->probe = pocl_mygpu_probe;
    ops->uninit = pocl_mygpu_uninit;
    ops->reinit = NULL;  // 可选
    ops->init = pocl_mygpu_init;
    
    // 队列管理
    ops->init_queue = pocl_mygpu_init_queue;
    ops->free_queue = pocl_mygpu_free_queue;
    
    // 内存管理
    ops->alloc_mem_obj = pocl_mygpu_alloc_mem_obj;
    ops->free = pocl_mygpu_free;
    
    // 命令提交和同步
    ops->submit = pocl_mygpu_submit;
    ops->join = pocl_mygpu_join;
    ops->flush = pocl_mygpu_flush;
    ops->notify = pocl_mygpu_notify;
    ops->broadcast = pocl_broadcast;  // 使用通用实现
    ops->wait_event = pocl_mygpu_wait_event;
    ops->update_event = pocl_mygpu_update_event;
    ops->free_event_data = pocl_mygpu_free_event_data;
    
    // 程序和内核管理
    ops->build_source = pocl_driver_build_source;  // 使用通用实现
    ops->link_program = pocl_driver_link_program;   // 使用通用实现
    ops->build_binary = pocl_driver_build_binary;   // 使用通用实现
    ops->setup_metadata = pocl_driver_setup_metadata;
    ops->supports_binary = pocl_driver_supports_binary;
    ops->build_poclbinary = pocl_driver_build_poclbinary;
    ops->post_build_program = pocl_mygpu_post_build_program;
    ops->free_program = pocl_mygpu_free_program;
    ops->compile_kernel = pocl_mygpu_compile_kernel;
    ops->create_kernel = pocl_mygpu_create_kernel;
    ops->free_kernel = pocl_mygpu_free_kernel;
    ops->build_hash = pocl_mygpu_build_hash;
    ops->init_build = pocl_mygpu_init_build;
    
    // 内存操作（如果 GPU 可以直接访问，设为 NULL 让 submit 处理）
    ops->read = NULL;
    ops->read_rect = NULL;
    ops->write = NULL;
    ops->write_rect = NULL;
    ops->copy = NULL;
    ops->copy_rect = NULL;
    ops->map_mem = NULL;
    ops->unmap_mem = NULL;
    ops->run = NULL;
    
    // 可选：SVM 支持
    ops->svm_alloc = pocl_mygpu_svm_alloc;
    ops->svm_free = pocl_mygpu_svm_free;
    ops->svm_map = NULL;
    ops->svm_unmap = NULL;
    ops->svm_copy = pocl_mygpu_svm_copy;
    ops->svm_fill = pocl_mygpu_svm_fill;
    
    // 设备间迁移（可选）
    ops->can_migrate_d2d = pocl_mygpu_can_migrate_d2d;
    ops->migrate_d2d = NULL;
}

//=============================================================================
// 设备探测和初始化
//=============================================================================

unsigned int
pocl_mygpu_probe (struct pocl_device_ops *ops)
{
    int num_devices = 0;
    
    // TODO: 调用你的 GPU API 获取设备数量
    // mygpu_get_device_count(&num_devices);
    
    return num_devices;
}

cl_int
pocl_mygpu_init (unsigned j, cl_device_id dev, const char *parameters)
{
    pocl_init_default_device_infos (dev);
    
    // 基本设备属性
    dev->type = CL_DEVICE_TYPE_GPU;
    dev->vendor = "MyGPU Vendor";
    dev->vendor_id = 0x????;  // PCI Vendor ID
    dev->address_bits = 64;
    
    // LLVM 目标三元组（根据你的 GPU 架构）
    dev->llvm_target_triplet = "mygpu64";  // 或其他 LLVM 支持的目标
    dev->llvm_cpu = "";  // GPU 特定型号
    
    // 内核库名称
    dev->kernellib_name = "kernel-mygpu64";
    dev->kernellib_subdir = "mygpu";
    
    // OpenCL 特性
    dev->spmd = CL_TRUE;  // GPU 通常是 SPMD
    dev->execution_capabilities = CL_EXEC_KERNEL;
    dev->extensions = "cl_khr_byte_addressable_store cl_khr_global_int32_base_atomics ...";
    
    // 地址空间 ID（根据你的 GPU）
    dev->global_as_id = 1;
    dev->local_as_id = 3;
    dev->constant_as_id = 2;
    
    // 分配设备私有数据
    pocl_mygpu_device_data_t *data = calloc(1, sizeof(pocl_mygpu_device_data_t));
    dev->data = data;
    
    // TODO: 初始化 GPU 设备
    // mygpu_init_device(&data->device, j);
    // mygpu_create_context(&data->context, data->device);
    
    // 获取设备属性
    // TODO: 从 GPU API 查询并设置：
    // - dev->max_compute_units
    // - dev->max_clock_frequency
    // - dev->global_mem_size
    // - dev->local_mem_size
    // - dev->max_work_group_size
    // - dev->max_work_item_dimensions
    // - dev->max_work_item_sizes
    // - etc.
    
    // 获取设备名称
    char *name = calloc(256, sizeof(char));
    // TODO: 从 GPU 获取名称
    // mygpu_get_device_name(data->device, name, 256);
    snprintf(name, 255, "MyGPU Device #%d", j);
    dev->long_name = dev->short_name = name;
    
    // 设置 OpenCL 版本
    SETUP_DEVICE_CL_VERSION(3, 0);  // OpenCL 3.0
    
    data->available = CL_TRUE;
    
    return CL_SUCCESS;
}

cl_int
pocl_mygpu_uninit (unsigned j, cl_device_id device)
{
    pocl_mygpu_device_data_t *data = (pocl_mygpu_device_data_t *)device->data;
    
    if (data) {
        // TODO: 清理 GPU 资源
        // mygpu_destroy_context(data->context);
        // mygpu_uninit_device(data->device);
        
        free(data);
        device->data = NULL;
    }
    
    return CL_SUCCESS;
}

//=============================================================================
// 队列管理
//=============================================================================

int
pocl_mygpu_init_queue (cl_device_id device, cl_command_queue queue)
{
    pocl_mygpu_queue_data_t *queue_data = calloc(1, sizeof(pocl_mygpu_queue_data_t));
    queue->data = queue_data;
    
    // TODO: 创建 GPU 命令队列
    // pocl_mygpu_device_data_t *dev_data = device->data;
    // mygpu_create_queue(&queue_data->queue, dev_data->context);
    
    return CL_SUCCESS;
}

int
pocl_mygpu_free_queue (cl_device_id device, cl_command_queue queue)
{
    pocl_mygpu_queue_data_t *queue_data = queue->data;
    
    if (queue_data) {
        // TODO: 销毁 GPU 队列
        // mygpu_destroy_queue(queue_data->queue);
        
        free(queue_data);
        queue->data = NULL;
    }
    
    return CL_SUCCESS;
}

//=============================================================================
// 内存管理
//=============================================================================

cl_int
pocl_mygpu_alloc_mem_obj (cl_device_id device, cl_mem mem_obj, void *host_ptr)
{
    // TODO: 在 GPU 上分配内存
    // pocl_mygpu_device_data_t *data = device->data;
    // void *device_ptr = NULL;
    // mygpu_malloc(&device_ptr, mem_obj->size);
    
    // 保存设备指针
    // pocl_mem_identifier *p = &mem_obj->device_ptrs[device->dev_id];
    // p->mem_ptr = device_ptr;
    
    return CL_SUCCESS;
}

void
pocl_mygpu_free (cl_device_id device, cl_mem mem_obj)
{
    // TODO: 释放 GPU 内存
    // pocl_mem_identifier *p = &mem_obj->device_ptrs[device->dev_id];
    // if (p->mem_ptr) {
    //     mygpu_free(p->mem_ptr);
    //     p->mem_ptr = NULL;
    // }
}

//=============================================================================
// 命令提交（最核心的函数）
//=============================================================================

void
pocl_mygpu_submit (_cl_command_node *node, cl_command_queue cq)
{
    // TODO: 根据命令类型分发到不同的处理函数
    switch (node->type) {
        case CL_COMMAND_NDRANGE_KERNEL:
            // 执行内核
            pocl_mygpu_run_kernel(node, cq);
            break;
        case CL_COMMAND_READ_BUFFER:
            // GPU -> Host 数据传输
            pocl_mygpu_read_buffer(node, cq);
            break;
        case CL_COMMAND_WRITE_BUFFER:
            // Host -> GPU 数据传输
            pocl_mygpu_write_buffer(node, cq);
            break;
        case CL_COMMAND_COPY_BUFFER:
            // GPU 内部拷贝
            pocl_mygpu_copy_buffer(node, cq);
            break;
        // ... 其他命令类型
        default:
            POCL_ABORT("Unsupported command type");
    }
}

//=============================================================================
// 编译器相关（关键部分）
//=============================================================================

char *
pocl_mygpu_build_hash (cl_device_id device)
{
    // 返回一个唯一标识此设备/编译器配置的哈希
    // 用于缓存编译结果
    return strdup("mygpu-v1.0");
}

char *
pocl_mygpu_init_build (void *data)
{
    // 返回 LLVM 编译器标志
    // 用于将 OpenCL C -> LLVM IR
    return strdup("");
}

void
pocl_mygpu_compile_kernel (_cl_command_node *cmd, cl_kernel kernel,
                            cl_device_id device, int specialize)
{
    // TODO: 编译内核
    // 1. 从缓存加载或编译 LLVM IR -> GPU 代码
    // 2. 保存编译结果
    
    // 参考 CUDA 的 pocl-ptx-gen.cc 实现
}

// ... 其他函数实现 ...

//=============================================================================
// 占位实现（可以先返回未实现错误）
//=============================================================================

void pocl_mygpu_join (cl_device_id device, cl_command_queue cq) {}
void pocl_mygpu_flush (cl_device_id device, cl_command_queue cq) {}
void pocl_mygpu_notify (cl_device_id device, cl_event event, cl_event finished) {}
void pocl_mygpu_wait_event (cl_device_id device, cl_event event) {}
void pocl_mygpu_update_event (cl_device_id device, cl_event event) {}
void pocl_mygpu_free_event_data (cl_event event) {}
int pocl_mygpu_post_build_program (cl_program program, cl_uint device_i) { return 0; }
int pocl_mygpu_free_program (cl_device_id device, cl_program program, unsigned device_i) { return 0; }
int pocl_mygpu_create_kernel (cl_device_id device, cl_program p, cl_kernel k, unsigned device_i) { return 0; }
int pocl_mygpu_free_kernel (cl_device_id device, cl_program p, cl_kernel k, unsigned device_i) { return 0; }
void *pocl_mygpu_svm_alloc (cl_device_id dev, cl_svm_mem_flags flags, size_t size) { return NULL; }
void pocl_mygpu_svm_free (cl_device_id dev, void *svm_ptr) {}
void pocl_mygpu_svm_copy (cl_device_id dev, void *dst, const void *src, size_t size) {}
void pocl_mygpu_svm_fill (cl_device_id dev, void *svm_ptr, size_t size, void *pattern, size_t pattern_size) {}
int pocl_mygpu_can_migrate_d2d (cl_device_id dest, cl_device_id source) { return 0; }
```

#### `lib/CL/devices/mygpu/CMakeLists.txt`
```cmake
#=============================================================================
#   CMake build system files for MyGPU device
#=============================================================================

# 查找 GPU SDK
# find_package(MyGPUSDK REQUIRED)

# 设置包含目录
# include_directories(${MYGPU_INCLUDE_DIRS})

# 如果需要使用 LLVM
include_directories(${LLVM_INCLUDE_DIRS})

# 创建设备库
add_pocl_device_library("pocl-devices-mygpu" 
    pocl-mygpu.c 
    pocl-mygpu.h
)

# 如果使用可加载驱动，链接必要的库
if(ENABLE_LOADABLE_DRIVERS)
    target_link_libraries(pocl-devices-mygpu 
        PRIVATE 
        # ${MYGPU_LIBRARIES}
        ${POCL_LLVM_LIBS}
        ${PTHREAD_LIBRARY}
    )
endif()

# 安装内核库文件（如果有预编译的）
# install(FILES "builtins.bc"
#         DESTINATION "${POCL_INSTALL_PRIVATE_DATADIR}/mygpu" 
#         COMPONENT "lib")
```

---

## 📝 步骤 2: 修改核心构建文件

### 2.1 修改 `/CMakeLists.txt`

在设备选项部分添加（约 220 行附近）:
```cmake
option(ENABLE_MYGPU "Enable the MyGPU device driver" OFF)
```

在架构检测部分之后添加 MyGPU 配置（约 1800 行附近）:
```cmake
if(ENABLE_MYGPU)
    # 查找 MyGPU SDK
    # find_package(MyGPUSDK)
    # if(NOT MyGPUSDK_FOUND)
    #     message(FATAL_ERROR "MyGPU SDK not found")
    # endif()
    
    set(BUILD_MYGPU 1)
    message(STATUS "MyGPU support enabled")
endif()
```

### 2.2 修改 `/lib/CL/devices/CMakeLists.txt`

在适当位置添加（约 140 行附近）:
```cmake
if(ENABLE_MYGPU)
  add_subdirectory("mygpu")
  if(NOT ENABLE_LOADABLE_DRIVERS)
    set(POCL_DEVICES_OBJS "${POCL_DEVICES_OBJS}"
      "$<TARGET_OBJECTS:pocl-devices-mygpu>")
    # 如果需要链接额外的库
    # list(APPEND POCL_DEVICES_LINK_LIST ${MYGPU_LIBRARIES})
  endif()
endif()
```

### 2.3 修改 `/lib/CL/devices/devices.c`

在文件顶部添加包含（约 80 行附近）:
```c
#ifdef BUILD_MYGPU
#include "mygpu/pocl-mygpu.h"
#endif
```

在设备初始化数组中添加（约 143 行附近）:
```c
static init_device_ops pocl_devices_init_ops[] = {
    // ... 其他设备 ...
#ifdef BUILD_MYGPU
    INIT_DEV (mygpu),
#endif
    // ...
};
```

在设备类型名称数组中添加（约 180 行附近）:
```c
char pocl_device_types[POCL_NUM_DEVICE_TYPES][30] = {
    // ... 其他设备 ...
#ifdef BUILD_MYGPU
    "mygpu",
#endif
    // ...
};
```

---

## 🔧 步骤 3: 实现编译器后端

这是最复杂的部分，需要将 LLVM IR 转换为 GPU 代码。

### 3.1 ✨ **如果你已有 SPIR-V → GPU 二进制编译器**（推荐路径）

**好消息！** 这种情况下你**不需要**修改 PoCL 的编译器部分，可以直接使用 PoCL 现有的 SPIR-V 生成能力！

#### 编译流程：
```
OpenCL C → LLVM IR → SPIR-V → [你的编译器] → GPU 二进制
  (PoCL)    (PoCL)   (PoCL)      (外部工具)
```

#### 实现方案（类似 Vulkan 驱动）：

**步骤 A: 配置设备使用 SPIR-V**

在 `pocl_mygpu_init()` 中设置：

```c
cl_int pocl_mygpu_init (unsigned j, cl_device_id dev, const char *parameters)
{
    // ... 基本初始化 ...
    
    // 关键：告诉 PoCL 使用 SPIR-V 而不是原生后端
    dev->llvm_target_triplet = "spir64";  // 或 "spir" for 32-bit
    dev->kernellib_name = "kernel-spir64";
    
    // 禁用编译器直接生成（我们会在 post_build 处理）
    dev->compiler_available = CL_TRUE;
    dev->linker_available = CL_TRUE;
    
    // 不需要 LLVM workgroup pass（SPIR-V 已处理）
    dev->run_workgroup_pass = CL_FALSE;
    dev->spmd = CL_TRUE;
    
    // ... 其他设置 ...
}
```

**步骤 B: 实现 post_build_program（调用你的编译器）**

```c
int
pocl_mygpu_post_build_program (cl_program program, cl_uint device_i)
{
    char spirv_path[POCL_MAX_PATHNAME_LENGTH];
    char binary_path[POCL_MAX_PATHNAME_LENGTH];
    char cmd[4096];
    
    // 1. 获取 PoCL 生成的 SPIR-V 文件路径
    //    PoCL 已经自动将 OpenCL C → LLVM IR → SPIR-V
    pocl_cache_program_bc_path(spirv_path, program, device_i);
    
    // SPIR-V 文件位于: <cache>/<hash>/parallel.bc.spv
    snprintf(spirv_path + strlen(spirv_path), 
             POCL_MAX_PATHNAME_LENGTH - strlen(spirv_path),
             "/parallel.bc.spv");
    
    if (!pocl_exists(spirv_path)) {
        POCL_MSG_ERR("SPIR-V file not found: %s\n", spirv_path);
        return CL_BUILD_PROGRAM_FAILURE;
    }
    
    // 2. 准备输出路径
    pocl_cache_program_path(binary_path, program, device_i);
    snprintf(binary_path + strlen(binary_path),
             POCL_MAX_PATHNAME_LENGTH - strlen(binary_path),
             "/mygpu_kernel.bin");
    
    // 3. 调用你的 SPIR-V → GPU 二进制编译器
    snprintf(cmd, sizeof(cmd), 
             "%s -o %s %s",
             "/path/to/your/compiler",  // 你的编译器路径
             binary_path,
             spirv_path);
    
    POCL_MSG_PRINT_INFO("Compiling with MyGPU compiler: %s\n", cmd);
    
    int ret = system(cmd);
    if (ret != 0) {
        POCL_MSG_ERR("MyGPU compilation failed\n");
        return CL_BUILD_PROGRAM_FAILURE;
    }
    
    // 4. 保存二进制路径到程序数据
    pocl_mygpu_program_data_t *pdata = 
        (pocl_mygpu_program_data_t *)program->data[device_i];
    if (pdata == NULL) {
        pdata = calloc(1, sizeof(pocl_mygpu_program_data_t));
        program->data[device_i] = pdata;
    }
    pdata->binary_path = strdup(binary_path);
    
    return CL_SUCCESS;
}
```

**步骤 C: 在内核创建时加载二进制**

```c
int
pocl_mygpu_create_kernel (cl_device_id device, cl_program program,
                          cl_kernel kernel, unsigned device_i)
{
    pocl_mygpu_program_data_t *pdata = 
        (pocl_mygpu_program_data_t *)program->data[device_i];
    
    // 从你的编译器生成的二进制加载内核
    // TODO: 调用你的 GPU API 加载模块
    // mygpu_load_binary(pdata->binary_path, &kernel_handle);
    
    // 保存内核句柄
    pocl_mygpu_kernel_data_t *kdata = 
        calloc(1, sizeof(pocl_mygpu_kernel_data_t));
    kernel->data[device_i] = kdata;
    // kdata->kernel_handle = kernel_handle;
    
    return CL_SUCCESS;
}
```

**步骤 D: 禁用不需要的编译器函数**

```c
void
pocl_mygpu_init_device_ops (struct pocl_device_ops *ops)
{
    // ... 其他设置 ...
    
    // 使用通用的 SPIR-V 构建流程
    ops->build_source = pocl_driver_build_source;
    ops->link_program = pocl_driver_link_program;
    ops->build_binary = pocl_driver_build_binary;
    
    // 在这里调用你的编译器
    ops->post_build_program = pocl_mygpu_post_build_program;
    
    // 不需要自定义编译内核（使用 post_build）
    ops->compile_kernel = NULL;
    
    // ... 其他设置 ...
}
```

#### 优点：

✅ **极简实现** - 只需几百行代码  
✅ **无需修改 LLVM** - 完全使用 PoCL 现有基础设施  
✅ **标准 SPIR-V** - 使用 Khronos 标准格式  
✅ **易于调试** - 可以单独测试你的编译器  
✅ **快速开发** - 几天就能跑起来基本功能  

#### 需要的依赖：

1. **llvm-spirv** - PoCL 用它生成 SPIR-V（通常已包含）
2. **你的 SPIR-V → GPU 编译器** - 必须支持计算着色器

#### 参考实现：

参考 **Vulkan 驱动** 的实现：
- `/lib/CL/devices/vulkan/pocl-vulkan.c` (特别是 `post_build_program` 部分)
- Vulkan 使用 `clspv` 将 LLVM IR → SPIR-V，然后传递给 Vulkan

---

### 3.2 如果你的 GPU 有 LLVM 后端（传统方式）

参考 CUDA 的实现 (`lib/CL/devices/cuda/pocl-ptx-gen.cc`):

```cpp
// pocl-mygpu-codegen.cc
#include "pocl-mygpu-codegen.h"
#include "pocl_llvm.h"

#include <llvm/IR/Module.h>
#include <llvm/Target/TargetMachine.h>
#include <llvm/IR/LegacyPassManager.h>

int pocl_mygpu_generate_code(llvm::Module *module, 
                              const char *output_file,
                              cl_device_id device) {
    // 1. 设置目标机器
    llvm::TargetMachine *target_machine = ...;
    
    // 2. 运行优化 passes
    llvm::legacy::PassManager pm;
    // 添加你的 GPU 特定优化
    
    // 3. 生成代码
    std::error_code EC;
    llvm::raw_fd_ostream dest(output_file, EC);
    target_machine->addPassesToEmitFile(pm, dest, nullptr, 
                                       llvm::CGFT_ObjectFile);
    pm.run(*module);
    
    return 0;
}
```

### 3.3 如果没有任何后端（自定义编译器）

你需要：
1. 使用 SPIR-V 作为中间表示（参考上面 3.1）
2. 或实现自定义的 LLVM IR → GPU 代码转换器

---

## 📚 步骤 4: 创建内核库

在 `/lib/kernel/` 下创建 GPU 特定的内核库。

### 4.1 创建目录
```bash
mkdir -p lib/kernel/mygpu
```

### 4.2 创建 `lib/kernel/mygpu/CMakeLists.txt`

```cmake
# 设置 GPU 特定的编译标志
set(CLANG_FLAGS "-target" "mygpu64" ...)
set(LLC_FLAGS "-mcpu=mygpu" ...)

# 定义内核源文件
set(KERNEL_SOURCES
    ../host/add_sat.cl
    ../host/sub_sat.cl
    # ... 其他内核 ...
)

# 编译内核库
make_kernel_bc(KERNEL_BC "mygpu64" "mygpu" 0 0 0 ${KERNEL_SOURCES})

# 添加构建目标
add_custom_target("kernel_mygpu" DEPENDS ${KERNEL_BC})

list(APPEND KERNEL_TARGET_LIST "kernel_mygpu")
set(KERNEL_TARGET_LIST "${KERNEL_TARGET_LIST}" PARENT_SCOPE)

# 安装内核库
install(FILES "${KERNEL_BC}"
        DESTINATION "${POCL_INSTALL_PRIVATE_DATADIR}"
        COMPONENT "lib")
```

### 4.3 修改 `/lib/kernel/CMakeLists.txt`

添加:
```cmake
if(ENABLE_MYGPU)
    add_subdirectory("mygpu")
endif()
```

---

## 🧪 步骤 5: 测试

### 5.1 编译 PoCL
```bash
cd pocl/build
cmake .. -DENABLE_MYGPU=ON \
         -DENABLE_TESTS=ON
make -j$(nproc)
```

### 5.2 运行基础测试
```bash
# 列出设备
./examples/example1/example1

# 运行简单测试
ctest -R mygpu
```

### 5.3 调试
使用环境变量启用调试输出:
```bash
export POCL_DEBUG=all
export POCL_DEVICES=mygpu
./your_test_program
```

---

## ✅ 关键实现检查清单

### 必须实现的函数
- [ ] `pocl_mygpu_probe` - 设备探测
- [ ] `pocl_mygpu_init` - 设备初始化
- [ ] `pocl_mygpu_uninit` - 设备清理
- [ ] `pocl_mygpu_init_device_ops` - 注册设备操作
- [ ] `pocl_mygpu_submit` - 提交命令
- [ ] `pocl_mygpu_compile_kernel` - 编译内核
- [ ] `pocl_mygpu_alloc_mem_obj` - 分配内存
- [ ] `pocl_mygpu_free` - 释放内存

### 建议实现的函数
- [ ] `pocl_mygpu_init_queue` / `pocl_mygpu_free_queue`
- [ ] `pocl_mygpu_wait_event` / `pocl_mygpu_update_event`
- [ ] `pocl_mygpu_create_kernel` / `pocl_mygpu_free_kernel`
- [ ] 数据传输函数（read/write/copy）

### 可选但推荐
- [ ] SVM 支持
- [ ] 内置内核 (built-in kernels)
- [ ] 设备间内存迁移
- [ ] 异步执行和事件管理
- [ ] 性能计数器

---

## 📖 重要提示和最佳实践

### 1. **使用通用驱动函数**
很多操作可以使用 `pocl_driver_*` 前缀的通用实现:
- `pocl_driver_build_source`
- `pocl_driver_link_program`
- `pocl_driver_alloc_mem_obj`（如果适用）

### 2. **错误处理**
- 使用 `POCL_MSG_ERR` 输出错误
- 使用 `POCL_ABORT` 处理致命错误
- 返回适当的 OpenCL 错误码

### 3. **内存管理**
- 注意主机和设备内存的同步
- 实现适当的缓存机制
- 处理 `CL_MEM_USE_HOST_PTR` 等标志

### 4. **线程安全**
- 使用 `pocl_lock_t` 进行同步
- 考虑多队列并发

### 5. **性能优化**
- 实现异步执行
- 批处理小的传输操作
- 使用 GPU 的 DMA 引擎

---

## 📚 推荐阅读

1. **PoCL 文档**: http://portablecl.org/docs/html/
2. **LLVM 文档**: https://llvm.org/docs/
3. **OpenCL 规范**: https://www.khronos.org/opencl/
4. **参考实现**:
   - CUDA: `/lib/CL/devices/cuda/`
   - Vulkan: `/lib/CL/devices/vulkan/`
   - HSA: `/lib/CL/devices/hsa/`

---

## 🆘 常见问题

### Q: 我的 GPU 没有 LLVM 后端怎么办？
A: 使用 SPIR-V 作为中间表示，参考 Vulkan 驱动的实现。

### Q: 如何调试编译问题？
A: 设置 `POCL_DEBUG=llvm,cuda` (换成你的驱动名) 查看详细日志。

### Q: 需要支持哪些 OpenCL 功能？
A: 最少需要支持基本的缓冲区操作和内核执行。图像、SVM 等可以逐步添加。

### Q: 如何处理不同的 GPU 型号？
A: 在 `probe` 函数中检测，在 `init` 函数中设置型号特定的属性。

---

## 📧 获取帮助

- PoCL 邮件列表: https://lists.sourceforge.net/lists/listinfo/pocl-devel
- GitHub Issues: https://github.com/pocl/pocl/issues
- IRC: #pocl on OFTC

---

**祝你成功添加新的 GPU 架构支持！** 🚀
