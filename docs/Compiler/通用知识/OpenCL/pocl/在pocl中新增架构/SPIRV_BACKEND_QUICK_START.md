# 快速入门：使用现有 SPIR-V 编译器添加 GPU 支持

**适用场景：** 你已有一个可以将 SPIR-V 转换为 GPU 二进制的编译器

**优势：** 无需修改 LLVM，只需集成你的编译器到 PoCL

---

## ✅ 答案：不需要修改 PoCL 编译器部分！

PoCL 已经内置了 SPIR-V 生成能力，你只需要：
1. 实现基本的设备驱动接口
2. 调用你的 SPIR-V → GPU 编译器
3. 加载和执行编译后的二进制

---

## 📊 架构流程

```
用户程序 (OpenCL C)
    ↓
PoCL 前端 (自动处理)
    ↓
LLVM IR (自动生成)
    ↓
SPIR-V (自动生成，使用 llvm-spirv)
    ↓
[你的编译器] ← 这里是你需要集成的部分
    ↓
GPU 二进制
    ↓
[你的 GPU 运行时] ← 加载和执行
```

---

## 🚀 最小化实现（3 个关键文件）

### 文件 1: `lib/CL/devices/mygpu/pocl-mygpu.h`

```c
#ifndef POCL_MYGPU_H
#define POCL_MYGPU_H

#include "pocl_cl.h"
#include "config.h"

// 包含你的 GPU SDK 头文件
// #include <mygpu_runtime.h>

#include "prototypes.inc"
GEN_PROTOTYPES (mygpu)

#endif
```

### 文件 2: `lib/CL/devices/mygpu/pocl-mygpu.c`

这是核心文件，包含最少必需的实现：

```c
#include "config.h"
#include "pocl-mygpu.h"
#include "common.h"
#include "common_driver.h"
#include "devices.h"
#include "pocl_cache.h"
#include "pocl_file_util.h"

#include <string.h>

// ============================================================================
// 数据结构
// ============================================================================

typedef struct pocl_mygpu_device_data_s {
    // TODO: 你的 GPU 设备句柄
    // mygpu_device_t device;
    // mygpu_context_t context;
    cl_bool available;
} pocl_mygpu_device_data_t;

typedef struct pocl_mygpu_program_data_s {
    char *binary_path;  // 编译后的 GPU 二进制路径
    // TODO: 加载后的模块句柄
    // mygpu_module_t module;
} pocl_mygpu_program_data_t;

typedef struct pocl_mygpu_kernel_data_s {
    // TODO: 内核句柄
    // mygpu_kernel_t kernel;
} pocl_mygpu_kernel_data_t;

// ============================================================================
// 设备操作初始化（告诉 PoCL 使用哪些函数）
// ============================================================================

void
pocl_mygpu_init_device_ops (struct pocl_device_ops *ops)
{
    ops->device_name = "mygpu";
    
    // 核心：设备生命周期
    ops->probe = pocl_mygpu_probe;
    ops->init = pocl_mygpu_init;
    ops->uninit = pocl_mygpu_uninit;
    ops->reinit = NULL;
    
    // 内存管理
    ops->alloc_mem_obj = pocl_mygpu_alloc_mem_obj;
    ops->free = pocl_mygpu_free;
    
    // 命令提交
    ops->submit = pocl_mygpu_submit;
    ops->join = pocl_mygpu_join;
    ops->flush = pocl_mygpu_flush;
    
    // 事件管理（可以先用占位实现）
    ops->notify = pocl_mygpu_notify;
    ops->broadcast = pocl_broadcast;
    ops->wait_event = pocl_mygpu_wait_event;
    ops->update_event = pocl_mygpu_update_event;
    ops->free_event_data = pocl_mygpu_free_event_data;
    
    // ⭐ 关键：使用 PoCL 通用编译流程（自动生成 SPIR-V）
    ops->build_source = pocl_driver_build_source;
    ops->link_program = pocl_driver_link_program;
    ops->build_binary = pocl_driver_build_binary;
    ops->setup_metadata = pocl_driver_setup_metadata;
    ops->supports_binary = pocl_driver_supports_binary;
    ops->build_poclbinary = pocl_driver_build_poclbinary;
    
    // ⭐ 在这里调用你的 SPIR-V 编译器
    ops->post_build_program = pocl_mygpu_post_build_program;
    ops->free_program = pocl_mygpu_free_program;
    
    // 内核管理
    ops->compile_kernel = NULL;  // 不需要，用 post_build
    ops->create_kernel = pocl_mygpu_create_kernel;
    ops->free_kernel = pocl_mygpu_free_kernel;
    
    ops->build_hash = pocl_mygpu_build_hash;
    ops->init_build = pocl_mygpu_init_build;
    
    // 数据传输（可设为 NULL，让 submit 处理）
    ops->read = NULL;
    ops->write = NULL;
    ops->copy = NULL;
    ops->map_mem = NULL;
    ops->unmap_mem = NULL;
    ops->run = NULL;
}

// ============================================================================
// 设备探测和初始化
// ============================================================================

unsigned int
pocl_mygpu_probe (struct pocl_device_ops *ops)
{
    int num_devices = 0;
    
    // TODO: 调用你的 GPU API 获取设备数量
    // mygpu_get_device_count(&num_devices);
    
    // 临时：返回 1 用于测试
    num_devices = 1;
    
    return num_devices;
}

cl_int
pocl_mygpu_init (unsigned j, cl_device_id dev, const char *parameters)
{
    pocl_init_default_device_infos(dev);
    
    // ⭐ 关键设置：告诉 PoCL 使用 SPIR-V
    dev->llvm_target_triplet = "spir64";      // 使用 SPIR-V 64位
    dev->kernellib_name = "kernel-spir64";    // 使用 SPIR-V 内核库
    dev->kernellib_subdir = "spir64";
    
    // 设备基本属性
    dev->type = CL_DEVICE_TYPE_GPU;
    dev->vendor = "MyGPU Vendor";
    dev->vendor_id = 0x9999;  // TODO: 你的 PCI vendor ID
    dev->address_bits = 64;
    dev->spmd = CL_TRUE;
    
    // 启用编译器（PoCL 会生成 SPIR-V）
    dev->compiler_available = CL_TRUE;
    dev->linker_available = CL_TRUE;
    
    // 不需要运行 workgroup pass（SPIR-V 已处理）
    dev->run_workgroup_pass = CL_FALSE;
    
    // OpenCL 版本
    SETUP_DEVICE_CL_VERSION(3, 0);
    
    // 分配设备数据
    pocl_mygpu_device_data_t *data = calloc(1, sizeof(pocl_mygpu_device_data_t));
    dev->data = data;
    
    // TODO: 初始化你的 GPU 设备
    // mygpu_init_device(&data->device, j);
    // mygpu_create_context(&data->context, data->device);
    
    // TODO: 查询设备属性并设置
    // dev->max_compute_units = ...;
    // dev->global_mem_size = ...;
    // dev->local_mem_size = ...;
    // dev->max_work_group_size = ...;
    
    // 临时设置（用于测试）
    dev->max_compute_units = 16;
    dev->global_mem_size = 4UL * 1024 * 1024 * 1024;  // 4GB
    dev->local_mem_size = 64 * 1024;  // 64KB
    dev->max_work_group_size = 1024;
    dev->max_work_item_sizes[0] = 1024;
    dev->max_work_item_sizes[1] = 1024;
    dev->max_work_item_sizes[2] = 1024;
    
    // 设备名称
    char *name = strdup("MyGPU Device");
    dev->long_name = dev->short_name = name;
    
    data->available = CL_TRUE;
    
    return CL_SUCCESS;
}

cl_int
pocl_mygpu_uninit (unsigned j, cl_device_id device)
{
    pocl_mygpu_device_data_t *data = device->data;
    
    if (data) {
        // TODO: 清理 GPU 资源
        // mygpu_destroy_context(data->context);
        
        free(data);
        device->data = NULL;
    }
    
    return CL_SUCCESS;
}

// ============================================================================
// ⭐⭐⭐ 最关键的部分：调用你的 SPIR-V 编译器 ⭐⭐⭐
// ============================================================================

int
pocl_mygpu_post_build_program (cl_program program, cl_uint device_i)
{
    char spirv_path[POCL_MAX_PATHNAME_LENGTH];
    char binary_path[POCL_MAX_PATHNAME_LENGTH];
    char cmd[4096];
    
    POCL_MSG_PRINT_INFO("MyGPU: post_build_program called\n");
    
    // 1. 获取 PoCL 自动生成的 SPIR-V 文件路径
    //    PoCL 已经完成了 OpenCL C → LLVM IR → SPIR-V 的转换
    pocl_cache_program_bc_path(spirv_path, program, device_i);
    
    // SPIR-V 文件的标准位置
    snprintf(spirv_path + strlen(spirv_path),
             POCL_MAX_PATHNAME_LENGTH - strlen(spirv_path),
             "/parallel.bc.spv");
    
    // 检查 SPIR-V 文件是否存在
    if (!pocl_exists(spirv_path)) {
        POCL_MSG_ERR("MyGPU: SPIR-V file not found: %s\n", spirv_path);
        return CL_BUILD_PROGRAM_FAILURE;
    }
    
    POCL_MSG_PRINT_INFO("MyGPU: Found SPIR-V at: %s\n", spirv_path);
    
    // 2. 准备输出路径（编译后的 GPU 二进制）
    pocl_cache_program_path(binary_path, program, device_i);
    snprintf(binary_path + strlen(binary_path),
             POCL_MAX_PATHNAME_LENGTH - strlen(binary_path),
             "/mygpu_kernel.bin");
    
    // 3. ⭐ 调用你的 SPIR-V → GPU 二进制编译器
    //    TODO: 替换为你的实际编译器路径和参数
    snprintf(cmd, sizeof(cmd),
             "%s --input %s --output %s",
             "/path/to/your/spirv-to-gpu-compiler",  // 你的编译器
             spirv_path,
             binary_path);
    
    POCL_MSG_PRINT_INFO("MyGPU: Compiling: %s\n", cmd);
    
    int ret = system(cmd);
    if (ret != 0) {
        POCL_MSG_ERR("MyGPU: Compilation failed with code %d\n", ret);
        return CL_BUILD_PROGRAM_FAILURE;
    }
    
    // 验证输出文件
    if (!pocl_exists(binary_path)) {
        POCL_MSG_ERR("MyGPU: Binary not created: %s\n", binary_path);
        return CL_BUILD_PROGRAM_FAILURE;
    }
    
    POCL_MSG_PRINT_INFO("MyGPU: Binary created: %s\n", binary_path);
    
    // 4. 保存二进制路径
    pocl_mygpu_program_data_t *pdata = 
        (pocl_mygpu_program_data_t *)program->data[device_i];
    if (pdata == NULL) {
        pdata = calloc(1, sizeof(pocl_mygpu_program_data_t));
        program->data[device_i] = pdata;
    }
    pdata->binary_path = strdup(binary_path);
    
    return CL_SUCCESS;
}

// ============================================================================
// 内核创建（加载编译后的二进制）
// ============================================================================

int
pocl_mygpu_create_kernel (cl_device_id device, cl_program program,
                          cl_kernel kernel, unsigned device_i)
{
    pocl_mygpu_program_data_t *pdata = 
        (pocl_mygpu_program_data_t *)program->data[device_i];
    
    if (pdata == NULL || pdata->binary_path == NULL) {
        POCL_MSG_ERR("MyGPU: No binary available for kernel\n");
        return CL_INVALID_PROGRAM;
    }
    
    // TODO: 从二进制加载内核
    // mygpu_kernel_t gpu_kernel;
    // mygpu_load_kernel_from_binary(pdata->binary_path, 
    //                               kernel->name, 
    //                               &gpu_kernel);
    
    // 保存内核数据
    pocl_mygpu_kernel_data_t *kdata = 
        calloc(1, sizeof(pocl_mygpu_kernel_data_t));
    kernel->data[device_i] = kdata;
    // kdata->kernel = gpu_kernel;
    
    POCL_MSG_PRINT_INFO("MyGPU: Kernel '%s' created\n", kernel->name);
    
    return CL_SUCCESS;
}

// ============================================================================
// 内存管理
// ============================================================================

cl_int
pocl_mygpu_alloc_mem_obj (cl_device_id device, cl_mem mem_obj, void *host_ptr)
{
    // TODO: 在 GPU 上分配内存
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

// ============================================================================
// 命令提交和执行
// ============================================================================

void
pocl_mygpu_submit (_cl_command_node *node, cl_command_queue cq)
{
    // TODO: 根据命令类型执行操作
    switch (node->type) {
        case CL_COMMAND_NDRANGE_KERNEL:
            POCL_MSG_PRINT_INFO("MyGPU: Executing kernel\n");
            // TODO: 启动内核
            // mygpu_launch_kernel(...);
            break;
        case CL_COMMAND_READ_BUFFER:
            POCL_MSG_PRINT_INFO("MyGPU: Reading buffer\n");
            // TODO: GPU -> Host 传输
            break;
        case CL_COMMAND_WRITE_BUFFER:
            POCL_MSG_PRINT_INFO("MyGPU: Writing buffer\n");
            // TODO: Host -> GPU 传输
            break;
        default:
            POCL_MSG_WARN("MyGPU: Unsupported command type %d\n", node->type);
    }
    
    // 标记命令完成
    pocl_update_event_running(node->sync.event.event);
    pocl_update_event_complete(node->sync.event.event);
}

// ============================================================================
// 占位实现（最简版本）
// ============================================================================

void pocl_mygpu_join (cl_device_id device, cl_command_queue cq) {}
void pocl_mygpu_flush (cl_device_id device, cl_command_queue cq) {}
void pocl_mygpu_notify (cl_device_id device, cl_event event, cl_event finished) {}
void pocl_mygpu_wait_event (cl_device_id device, cl_event event) {}
void pocl_mygpu_update_event (cl_device_id device, cl_event event) {}
void pocl_mygpu_free_event_data (cl_event event) {}

int pocl_mygpu_free_program (cl_device_id device, cl_program program, 
                             unsigned device_i) 
{
    pocl_mygpu_program_data_t *pdata = program->data[device_i];
    if (pdata) {
        free(pdata->binary_path);
        free(pdata);
        program->data[device_i] = NULL;
    }
    return 0;
}

int pocl_mygpu_free_kernel (cl_device_id device, cl_program p, 
                           cl_kernel k, unsigned device_i) 
{
    pocl_mygpu_kernel_data_t *kdata = k->data[device_i];
    if (kdata) {
        // TODO: 释放 GPU 内核
        free(kdata);
        k->data[device_i] = NULL;
    }
    return 0;
}

char *pocl_mygpu_build_hash (cl_device_id device) 
{
    return strdup("mygpu-spirv-v1.0");
}

char *pocl_mygpu_init_build (void *data) 
{
    return strdup("");
}
```

### 文件 3: `lib/CL/devices/mygpu/CMakeLists.txt`

```cmake
# 创建设备库
add_pocl_device_library("pocl-devices-mygpu" 
    pocl-mygpu.c 
    pocl-mygpu.h
)

# 如果使用可加载驱动，链接必要的库
if(ENABLE_LOADABLE_DRIVERS)
    target_link_libraries(pocl-devices-mygpu 
        PRIVATE 
        ${PTHREAD_LIBRARY}
    )
endif()
```

---

## 🔧 构建系统集成（3 个修改）

### 修改 1: `/CMakeLists.txt`（添加选项）

在约 220 行附近添加：

```cmake
option(ENABLE_MYGPU "Enable the MyGPU device driver" OFF)
```

在约 1800 行附近添加：

```cmake
if(ENABLE_MYGPU)
    set(BUILD_MYGPU 1)
    message(STATUS "MyGPU support enabled")
endif()
```

### 修改 2: `/lib/CL/devices/CMakeLists.txt`（添加子目录）

在适当位置添加：

```cmake
if(ENABLE_MYGPU)
  add_subdirectory("mygpu")
  if(NOT ENABLE_LOADABLE_DRIVERS)
    set(POCL_DEVICES_OBJS "${POCL_DEVICES_OBJS}"
      "$<TARGET_OBJECTS:pocl-devices-mygpu>")
  endif()
endif()
```

### 修改 3: `/lib/CL/devices/devices.c`（注册设备）

在文件顶部添加：

```c
#ifdef BUILD_MYGPU
#include "mygpu/pocl-mygpu.h"
#endif
```

在设备初始化数组中添加：

```c
static init_device_ops pocl_devices_init_ops[] = {
    // ... 其他设备 ...
#ifdef BUILD_MYGPU
    INIT_DEV (mygpu),
#endif
};
```

在设备名称数组中添加：

```c
char pocl_device_types[POCL_NUM_DEVICE_TYPES][30] = {
    // ... 其他设备 ...
#ifdef BUILD_MYGPU
    "mygpu",
#endif
};
```

---

## 🚀 构建和测试

```bash
cd pocl
mkdir build && cd build

# 配置（确保 llvm-spirv 可用）
cmake .. \
    -DENABLE_MYGPU=ON \
    -DENABLE_SPIRV=ON \
    -DENABLE_TESTS=ON

# 编译
make -j$(nproc)

# 测试
export POCL_DEBUG=all
export POCL_DEVICES=mygpu
./examples/example1/example1
```

---

## 📝 关键要点

### ✅ 你需要实现的（~300-500 行代码）：

1. ✅ 设备探测和初始化
2. ✅ 在 `post_build_program` 中调用你的编译器
3. ✅ 加载编译后的二进制到内核
4. ✅ 内存分配/释放（调用你的 GPU API）
5. ✅ 命令执行（调用你的 GPU API）

### ❌ 你不需要实现：

1. ❌ OpenCL C → LLVM IR 转换（PoCL 自动处理）
2. ❌ LLVM IR → SPIR-V 转换（PoCL 使用 llvm-spirv）
3. ❌ 复杂的编译器集成（只需调用外部工具）
4. ❌ LLVM passes 和优化

---

## 🐛 调试技巧

### 查看 SPIR-V 输出

```bash
# PoCL 生成的 SPIR-V 位于缓存目录
ls ~/.cache/pocl/kcache/*/parallel.bc.spv

# 使用 spirv-dis 反汇编查看
spirv-dis ~/.cache/pocl/kcache/*/parallel.bc.spv
```

### 验证你的编译器

```bash
# 手动测试编译流程
/path/to/your/compiler \
    --input /path/to/parallel.bc.spv \
    --output /tmp/test.bin
```

### 启用详细日志

```bash
export POCL_DEBUG=all
export POCL_DEVICES=mygpu
export POCL_LEAVE_KERNEL_COMPILER_TEMP_FILES=1  # 保留中间文件
```

---

## 📚 参考资源

- **Vulkan 驱动实现**: `/lib/CL/devices/vulkan/pocl-vulkan.c`
- **SPIR-V 工具**: https://github.com/KhronosGroup/SPIRV-Tools
- **llvm-spirv**: https://github.com/KhronosGroup/SPIRV-LLVM-Translator
- **SPIR-V 规范**: https://www.khronos.org/registry/spir-v/

---

## 🎯 总结

你的情况是**最理想的**：

- ✅ **开发时间**：1-2 周即可有基本功能
- ✅ **代码量**：约 500 行核心代码
- ✅ **复杂度**：低（无需深入 LLVM）
- ✅ **可维护性**：高（使用标准 SPIR-V）

**核心工作**就是在 `post_build_program` 中调用你的编译器，然后在执行时加载结果！
