

# 新设备驱动实现 clCreateBuffer 指南



## 📋 概览

当你要为新硬件架构（如新的 GPU、DSP、FPGA 等）实现 PoCL 设备驱动时，`clCreateBuffer()` 的大部分逻辑已经由 PoCL 核心框架实现。你只需要实现**设备特定的内存分配**部分。

---

## 🎯 核心原则: 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│  应用层 (用户代码)                                            │
│  clCreateBuffer(context, flags, size, host_ptr, &err)      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  PoCL 核心层 (lib/CL/clCreateBuffer.c)                      │
│  ✅ 已实现:                                                  │
│  - 参数验证 (flags, size, host_ptr 合法性)                  │
│  - cl_mem 对象分配和初始化                                   │
│  - 标志位处理逻辑 (USE_HOST_PTR, COPY_HOST_PTR 等)          │
│  - 引用计数管理                                             │
│  - 版本追踪                                                 │
│  - Context 管理                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  设备驱动层 (lib/CL/devices/yourdevice/)                    │
│  ⚠️ 需要你实现:                                              │
│  - alloc_mem_obj()  ← 设备内存分配                          │
│  - free()           ← 设备内存释放                          │
│  - (可选) 其他内存操作                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  硬件层 (你的设备)                                           │
│  GPU / DSP / FPGA / 自定义加速器                            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ PoCL 核心已经帮你做的事情

### 1️⃣ 完整的参数验证

**文件**: `lib/CL/clCreateBuffer.c:33` (pocl_create_memobject)

```c
// ✅ 已实现: 所有这些检查都不需要你写
POCL_GOTO_ERROR_COND((size == 0), CL_INVALID_BUFFER_SIZE);
POCL_GOTO_ERROR_COND((!IS_CL_OBJECT_VALID(context)), CL_INVALID_CONTEXT);

// 标志位冲突检查
POCL_GOTO_ERROR_ON(
    ((flags & CL_MEM_READ_WRITE) && 
     (flags & CL_MEM_WRITE_ONLY || flags & CL_MEM_READ_ONLY)),
    CL_INVALID_VALUE, "...");

// host_ptr 有效性检查
if (host_ptr == NULL) {
    POCL_GOTO_ERROR_ON(
        ((flags & CL_MEM_USE_HOST_PTR) || (flags & CL_MEM_COPY_HOST_PTR)),
        CL_INVALID_HOST_PTR, "...");
}

// 大小检查
POCL_GOTO_ERROR_ON((size > context->max_mem_alloc_size),
                    CL_INVALID_BUFFER_SIZE, "...");
```

**你不需要做**: 任何参数验证，PoCL 核心已经全部处理。

---

### 2️⃣ cl_mem 对象管理

**文件**: `lib/CL/clCreateBuffer.c:119`

```c
// ✅ 已实现: cl_mem 结构体分配和初始化
mem = (cl_mem)calloc(1, sizeof(struct _cl_mem));
POCL_INIT_OBJECT(mem);

mem->type = CL_MEM_OBJECT_BUFFER;
mem->flags = flags;
mem->size = size;
mem->context = context;

// ✅ 已实现: 为所有设备分配 device_ptrs 数组
mem->device_ptrs = (pocl_mem_identifier *)calloc(
    pocl_num_devices, sizeof(pocl_mem_identifier));
```

**你不需要做**: 分配 `cl_mem` 结构体，PoCL 核心已经处理。

---

### 3️⃣ 标志位处理逻辑

**文件**: `lib/CL/clCreateBuffer.c:146-220`

```c
// ✅ 已实现: CL_MEM_USE_HOST_PTR 处理
if (flags & CL_MEM_USE_HOST_PTR) {
    mem->mem_host_ptr = host_ptr;
    mem->mem_host_ptr_version = 1;
    mem->mem_host_ptr_refcount = 1;
}

// ✅ 已实现: CL_MEM_COPY_HOST_PTR 处理
if ((flags & CL_MEM_COPY_HOST_PTR) && (mem->mem_host_ptr_version == 0)) {
    pocl_alloc_or_retain_mem_host_ptr(mem);
    memcpy(mem->mem_host_ptr, host_ptr, size);
}

// ✅ 已实现: CL_MEM_ALLOC_HOST_PTR 处理
if (flags & CL_MEM_ALLOC_HOST_PTR) {
    // 遍历所有设备，调用你的 alloc_mem_obj()
    for (i = 0; i < context->num_devices; ++i) {
        dev->ops->alloc_mem_obj(dev, mem, host_ptr);  // ← 调用你的实现
    }
}
```

**你不需要做**: 标志位逻辑判断，PoCL 会在合适的时机调用你的设备驱动函数。

---

### 4️⃣ 引用计数和版本管理

**文件**: `lib/CL/pocl_util.c:1349`

```c
// ✅ 已实现: 引用计数管理
int pocl_alloc_or_retain_mem_host_ptr(cl_mem mem) {
    if (mem->mem_host_ptr == NULL) {
        mem->mem_host_ptr = pocl_aligned_malloc(align, mem->size);
        mem->mem_host_ptr_refcount = 0;
    }
    ++mem->mem_host_ptr_refcount;
    return 0;
}

// ✅ 已实现: 版本追踪
// mem->mem_host_ptr_version
// mem->device_ptrs[i].version
```

**你不需要做**: 引用计数和版本追踪，PoCL 核心自动管理。

---

## ⚠️ 你必须实现的部分

### 核心函数: `alloc_mem_obj()`

这是唯一**必须**实现的函数，用于在你的设备上分配内存。

**函数签名**:
```c
cl_int your_device_alloc_mem_obj(cl_device_id device, 
                                  cl_mem mem, 
                                  void *host_ptr);
```

**参数说明**:
- `device`: 你的设备对象
- `mem`: PoCL 核心已经分配并初始化的 cl_mem 对象
- `host_ptr`: 用户提供的主机指针 (可能为 NULL)

**返回值**:
- `CL_SUCCESS`: 分配成功
- `CL_OUT_OF_RESOURCES`: 设备内存不足
- `CL_MEM_OBJECT_ALLOCATION_FAILURE`: 其他分配失败

---

## 📚 实现参考: 三种典型设备

### 案例 1: CPU 设备 (统一地址空间)

**适用场景**: CPU、某些 ARM SoC、集成 GPU

**文件**: `lib/CL/devices/common_driver.c:400`

```c
cl_int
pocl_driver_alloc_mem_obj(cl_device_id device, cl_mem mem, void *host_ptr)
{
    pocl_mem_identifier *p = &mem->device_ptrs[device->global_mem_id];
    
    // 1️⃣ 如果是 ALLOC_HOST_PTR 但还没分配，返回失败
    //    让 PoCL 核心使用 pocl_alloc_or_retain_mem_host_ptr() 分配
    if ((mem->flags & CL_MEM_ALLOC_HOST_PTR) && (mem->mem_host_ptr == NULL))
        return CL_MEM_OBJECT_ALLOCATION_FAILURE;
    
    // 2️⃣ 确保 mem_host_ptr 已分配 (USE_HOST_PTR 或 COPY_HOST_PTR 可能已分配)
    pocl_alloc_or_retain_mem_host_ptr(mem);
    
    // 3️⃣ SVM 设备注册 (如果需要)
    cl_device_id svm_dev = mem->context->svm_allocdev;
    if (svm_dev && svm_dev->global_mem_id == 0 && svm_dev->ops->svm_register)
        svm_dev->ops->svm_register(svm_dev, mem->mem_host_ptr, mem->size);
    
    // 4️⃣ 关键: 设置设备指针
    //    CPU 设备统一地址空间: 设备地址 = 主机地址
    p->version = mem->mem_host_ptr_version;
    p->mem_ptr = mem->mem_host_ptr;        // ← 设备内存指针
    p->device_addr = p->mem_ptr;           // ← 设备地址 (CPU: 与 mem_ptr 相同)
    
    if (mem->is_device_pinned)
        p->is_pinned = 1;
    
    POCL_MSG_PRINT_MEMORY("Basic device ALLOC %p / size %zu \n", 
                         p->mem_ptr, mem->size);
    
    return CL_SUCCESS;
}
```

**关键点**:
- ✅ **简单**: 直接使用 `mem->mem_host_ptr`
- ✅ **零拷贝**: 主机和设备共享内存
- ✅ **适用**: pthread、basic、ARM CPU 等

---

### 案例 2: 独立显存 GPU (CUDA/ROCm 风格)

**适用场景**: NVIDIA GPU、AMD GPU、独立显存的加速器

**文件**: `lib/CL/devices/cuda/cuda.c` (参考)

```c
cl_int
pocl_cuda_alloc_mem_obj(cl_device_id device, cl_mem mem, void *host_ptr)
{
    pocl_mem_identifier *p = &mem->device_ptrs[device->global_mem_id];
    pocl_cuda_device_data_t *d = (pocl_cuda_device_data_t *)device->data;
    
    void *device_ptr = NULL;
    size_t size = mem->size;
    
    // 1️⃣ 在设备上分配显存
    cuMemAlloc((CUdeviceptr *)&device_ptr, size);
    if (device_ptr == NULL) {
        POCL_MSG_ERR("CUDA: Failed to allocate %zu bytes\n", size);
        return CL_OUT_OF_RESOURCES;
    }
    
    POCL_MSG_PRINT_MEMORY("CUDA: Allocated device memory %p, size %zu\n",
                         device_ptr, size);
    
    // 2️⃣ 设置设备指针
    p->mem_ptr = device_ptr;              // ← GPU 显存地址
    p->device_addr = device_ptr;          // ← 设备地址
    p->version = 0;                       // ← 初始版本
    
    // 3️⃣ 如果需要主机端缓冲区 (用于数据传输)
    if (mem->flags & CL_MEM_ALLOC_HOST_PTR) {
        pocl_alloc_or_retain_mem_host_ptr(mem);
        p->version = mem->mem_host_ptr_version;
    }
    
    // 4️⃣ 如果是 USE_HOST_PTR，可能需要 pinned memory
    if (mem->flags & CL_MEM_USE_HOST_PTR) {
        // CUDA: 使用 cuMemHostRegister() 固定用户内存
        cuMemHostRegister(host_ptr, size, CU_MEMHOSTREGISTER_DEVICEMAP);
        
        // 获取设备可访问的地址
        CUdeviceptr mapped_ptr;
        cuMemHostGetDevicePointer(&mapped_ptr, host_ptr, 0);
        p->device_addr = (void*)mapped_ptr;
    }
    
    // 5️⃣ 如果是 COPY_HOST_PTR，立即传输数据
    if ((mem->flags & CL_MEM_COPY_HOST_PTR) && host_ptr) {
        cuMemcpyHtoD((CUdeviceptr)device_ptr, host_ptr, size);
        p->version = 1;
    }
    
    return CL_SUCCESS;
}
```

**关键点**:
- 🔹 **显存分配**: `cuMemAlloc()` 或类似 API
- 🔹 **数据传输**: 需要显式 H2D 拷贝
- 🔹 **版本管理**: 追踪主机和设备数据是否同步
- 🔹 **Pinned Memory**: 优化传输性能

---

### 案例 3: 远程设备 (网络/PCIe 设备)

**适用场景**: 远程 OpenCL 节点、FPGA、专用加速卡

**文件**: `lib/CL/devices/remote/remote.c` (参考)

```c
cl_int
pocl_remote_alloc_mem_obj(cl_device_id device, cl_mem mem, void *host_ptr)
{
    pocl_mem_identifier *p = &mem->device_ptrs[device->global_mem_id];
    pocl_remote_device_data_t *d = (pocl_remote_device_data_t *)device->data;
    
    // 1️⃣ 通过网络/总线向远程设备发送分配请求
    remote_request_t req;
    req.type = REMOTE_CMD_ALLOC_BUFFER;
    req.size = mem->size;
    req.flags = mem->flags;
    
    remote_response_t resp;
    send_request(d->socket, &req, &resp);
    
    if (resp.status != REMOTE_SUCCESS) {
        POCL_MSG_ERR("Remote device allocation failed\n");
        return CL_OUT_OF_RESOURCES;
    }
    
    // 2️⃣ 远程设备返回的地址 (可能是虚拟地址或 handle)
    uint64_t remote_addr = resp.device_address;
    
    // 3️⃣ 设置设备指针
    //    注意: mem_ptr 可能只是一个本地句柄，不是真实指针
    p->mem_ptr = (void*)remote_addr;      // ← 远程设备地址
    p->device_addr = (void*)remote_addr;  // ← 同上
    p->version = 0;
    
    // 4️⃣ 本地缓冲区 (用于批量传输)
    if (mem->flags & CL_MEM_ALLOC_HOST_PTR) {
        pocl_alloc_or_retain_mem_host_ptr(mem);
    }
    
    // 5️⃣ 初始数据传输
    if ((mem->flags & CL_MEM_COPY_HOST_PTR) && host_ptr) {
        // 通过网络/DMA 传输数据到远程设备
        remote_transfer_data(d->socket, remote_addr, host_ptr, mem->size);
        p->version = 1;
    }
    
    POCL_MSG_PRINT_MEMORY("Remote device allocated %p (handle 0x%lx)\n",
                         p->mem_ptr, remote_addr);
    
    return CL_SUCCESS;
}
```

**关键点**:
- 🌐 **网络通信**: 发送分配命令到远程节点
- 🔹 **地址映射**: `mem_ptr` 可能只是句柄，不是直接可访问的指针
- 🔹 **批量传输**: 使用本地缓冲区优化网络传输
- 🔹 **错误处理**: 处理网络超时、设备离线等

---

## 🛠️ 实现步骤指南

### 第 1 步: 创建设备驱动目录

```bash
cd /home/ken/workspace/pocl/lib/CL/devices
mkdir yourdevice
cd yourdevice
```

### 第 2 步: 创建驱动文件

**文件结构**:
```
lib/CL/devices/yourdevice/
├── yourdevice.c          # 主驱动实现
├── yourdevice.h          # 头文件
└── CMakeLists.txt        # 构建配置
```

### 第 3 步: 实现设备操作结构体

**yourdevice.c**:
```c
#include "yourdevice.h"
#include "common_driver.h"

void
pocl_yourdevice_init_device_ops(struct pocl_device_ops *ops)
{
    // 方法 1: 从 basic 驱动继承大部分功能
    pocl_basic_init_device_ops(ops);
    
    // 方法 2: 从 common_driver 继承 (更底层)
    // ops->read = pocl_driver_read;
    // ops->write = pocl_driver_write;
    // ...
    
    // 覆盖设备特定的操作
    ops->device_name = "yourdevice";
    ops->init = pocl_yourdevice_init;
    ops->uninit = pocl_yourdevice_uninit;
    
    // ⭐ 关键: 实现内存分配/释放
    ops->alloc_mem_obj = pocl_yourdevice_alloc_mem_obj;  // ← 必须实现
    ops->free = pocl_yourdevice_free;                     // ← 必须实现
    
    // 可选: 如果设备有特殊内存操作
    // ops->read = pocl_yourdevice_read;       // 设备→主机读取
    // ops->write = pocl_yourdevice_write;     // 主机→设备写入
    // ops->copy = pocl_yourdevice_copy;       // 设备内拷贝
    
    // 可选: 如果支持内存映射
    // ops->map_mem = pocl_yourdevice_map_mem;
    // ops->unmap_mem = pocl_yourdevice_unmap_mem;
}
```

### 第 4 步: 实现 alloc_mem_obj()

**yourdevice.c**:
```c
cl_int
pocl_yourdevice_alloc_mem_obj(cl_device_id device, cl_mem mem, void *host_ptr)
{
    pocl_mem_identifier *p = &mem->device_ptrs[device->global_mem_id];
    yourdevice_data_t *d = (yourdevice_data_t *)device->data;
    
    // ==================== 决策树 ====================
    
    // 1️⃣ 判断是否需要设备内存
    int needs_device_memory = 1;
    
    if (device->has_unified_memory) {
        // 统一地址空间: 使用主机内存即可
        needs_device_memory = 0;
    }
    
    // 2️⃣ 分配设备内存 (如果需要)
    void *device_ptr = NULL;
    if (needs_device_memory) {
        // 调用你的设备 API 分配内存
        device_ptr = yourdevice_malloc(d->device_handle, mem->size);
        
        if (device_ptr == NULL) {
            POCL_MSG_ERR("YourDevice: Failed to allocate %zu bytes\n", mem->size);
            return CL_OUT_OF_RESOURCES;
        }
        
        POCL_MSG_PRINT_MEMORY("YourDevice: Allocated %p, size %zu\n",
                             device_ptr, mem->size);
    } else {
        // 统一地址空间: 确保主机内存已分配
        if ((mem->flags & CL_MEM_ALLOC_HOST_PTR) && (mem->mem_host_ptr == NULL))
            return CL_MEM_OBJECT_ALLOCATION_FAILURE;
        
        pocl_alloc_or_retain_mem_host_ptr(mem);
        device_ptr = mem->mem_host_ptr;
    }
    
    // 3️⃣ 设置设备指针
    p->mem_ptr = device_ptr;
    p->device_addr = device_ptr;
    p->version = 0;
    
    // 4️⃣ 处理特殊标志
    
    // CL_MEM_USE_HOST_PTR: 用户提供的指针
    if (mem->flags & CL_MEM_USE_HOST_PTR) {
        if (device->can_map_host_memory) {
            // 方案 A: 设备可以直接访问主机内存
            yourdevice_map_host_memory(d->device_handle, host_ptr, mem->size);
            p->device_addr = host_ptr;  // 映射后的地址
        } else {
            // 方案 B: 需要拷贝到设备内存
            // (数据传输在 clEnqueueWriteBuffer 时进行，这里只标记)
            p->version = 0;  // 标记需要同步
        }
    }
    
    // CL_MEM_COPY_HOST_PTR: 立即拷贝数据
    if ((mem->flags & CL_MEM_COPY_HOST_PTR) && host_ptr && needs_device_memory) {
        yourdevice_memcpy_h2d(d->device_handle, device_ptr, host_ptr, mem->size);
        p->version = 1;  // 数据已同步
    }
    
    // CL_MEM_ALLOC_HOST_PTR: 分配主机端缓冲
    if (mem->flags & CL_MEM_ALLOC_HOST_PTR) {
        pocl_alloc_or_retain_mem_host_ptr(mem);
        p->version = mem->mem_host_ptr_version;
    }
    
    // 5️⃣ 固定内存
    if (mem->is_device_pinned) {
        p->is_pinned = 1;
        // 可选: 设备特定的固定内存处理
        // yourdevice_pin_memory(d->device_handle, device_ptr, mem->size);
    }
    
    return CL_SUCCESS;
}
```

### 第 5 步: 实现 free()

```c
void
pocl_yourdevice_free(cl_device_id device, cl_mem mem)
{
    pocl_mem_identifier *p = &mem->device_ptrs[device->global_mem_id];
    yourdevice_data_t *d = (yourdevice_data_t *)device->data;
    
    if (p->mem_ptr == NULL)
        return;
    
    // 1️⃣ 释放设备内存
    if (device->has_unified_memory) {
        // 统一地址空间: 减少引用计数
        pocl_release_mem_host_ptr(mem);
    } else {
        // 独立显存: 调用设备 API 释放
        yourdevice_free_memory(d->device_handle, p->mem_ptr);
        
        POCL_MSG_PRINT_MEMORY("YourDevice: Freed %p\n", p->mem_ptr);
    }
    
    // 2️⃣ 清空指针
    p->mem_ptr = NULL;
    p->device_addr = NULL;
    p->version = 0;
}
```

---

## 🔍 关键决策点

### 决策 1: 统一地址空间 vs 独立内存

| 设备类型 | 地址空间 | 实现策略 |
|---------|---------|---------|
| CPU | 统一 | 直接使用 `mem->mem_host_ptr` |
| 集成 GPU (Intel UHD) | 统一 | 同上 |
| 独立 GPU (NVIDIA) | 独立 | 分配显存 + H2D/D2H 传输 |
| FPGA | 独立 | DMA 传输 |
| 远程设备 | 独立 | 网络传输 |

**判断标准**:
```c
// 在设备初始化时设置
device->global_mem_id = 0;  // 0 = 与主机共享，非 0 = 独立
device->has_unified_memory = CL_TRUE;  // 统一地址空间
```

### 决策 2: 何时分配内存

| 标志位 | 分配时机 | 你的责任 |
|-------|---------|---------|
| 无标志 (默认) | 延迟分配 | 可以在这里分配，也可以延迟到首次使用 |
| `CL_MEM_ALLOC_HOST_PTR` | 立即分配 | 必须在这里分配 |
| `CL_MEM_PINNED` | 立即分配 | 必须在这里分配并固定 |
| `CL_MEM_USE_HOST_PTR` | 不分配 | 映射或标记即可 |
| `CL_MEM_COPY_HOST_PTR` | 立即分配 | 分配并拷贝数据 |

### 决策 3: 版本管理

**自动同步场景** (PoCL 核心会调用 read/write):
```c
// 场景 1: 用户调用 clEnqueueReadBuffer
if (p->version > mem->mem_host_ptr_version) {
    // PoCL 自动调用 device->ops->read()
    // 你只需实现 read() 函数
}

// 场景 2: 用户调用 clEnqueueWriteBuffer
if (mem->mem_host_ptr_version > p->version) {
    // PoCL 自动调用 device->ops->write()
}
```

**你需要做的**:
```c
// 在 alloc_mem_obj() 中正确设置初始版本
if (mem->flags & CL_MEM_COPY_HOST_PTR) {
    yourdevice_memcpy_h2d(...);
    p->version = 1;  // ← 数据已同步
}
```

---

## 📋 完整的设备驱动 Checklist

### 必须实现 ✅

- [ ] **alloc_mem_obj()** - 分配设备内存
- [ ] **free()** - 释放设备内存
- [ ] **init()** - 设备初始化
- [ ] **uninit()** - 设备清理

### 高优先级 (如果不是统一地址空间) 🔶

- [ ] **read()** - 设备→主机数据传输
- [ ] **write()** - 主机→设备数据传输
- [ ] **copy()** - 设备内部拷贝
- [ ] **memfill()** - 设备内存填充

### 中优先级 (性能优化) 🔸

- [ ] **map_mem()** - 映射设备内存到主机
- [ ] **unmap_mem()** - 解除映射
- [ ] **get_mapping_ptr()** - 获取映射地址
- [ ] **free_mapping_ptr()** - 释放映射

### 可选 (高级特性) ⚪

- [ ] **can_migrate_d2d()** - 设备间迁移支持检测
- [ ] **migrate_d2d()** - 设备间直接传输
- [ ] **svm_alloc()** - SVM 内存分配
- [ ] **svm_free()** - SVM 内存释放

---

## 🎯 实战示例: 简化的 CUDA 风格设备

```c
// ============================================================
// yourdevice.h
// ============================================================
#ifndef POCL_YOURDEVICE_H
#define POCL_YOURDEVICE_H

#include "pocl_cl.h"

typedef struct {
    void *device_handle;      // 设备句柄
    int has_unified_memory;   // 是否统一地址空间
} yourdevice_data_t;

void pocl_yourdevice_init_device_ops(struct pocl_device_ops *ops);

#endif

// ============================================================
// yourdevice.c
// ============================================================
#include "yourdevice.h"
#include "common_driver.h"

void
pocl_yourdevice_init_device_ops(struct pocl_device_ops *ops)
{
    // 继承通用驱动
    ops->read = pocl_driver_read;       // 如果不需要特殊处理
    ops->write = pocl_driver_write;
    ops->copy = pocl_driver_copy;
    ops->memfill = pocl_driver_memfill;
    
    // 设备特定
    ops->device_name = "yourdevice";
    ops->alloc_mem_obj = pocl_yourdevice_alloc_mem_obj;
    ops->free = pocl_yourdevice_free;
}

cl_int
pocl_yourdevice_alloc_mem_obj(cl_device_id device, cl_mem mem, void *host_ptr)
{
    pocl_mem_identifier *p = &mem->device_ptrs[device->global_mem_id];
    
    // 简化实现: 假设设备有独立显存
    void *device_ptr = yourdevice_malloc(mem->size);
    if (!device_ptr)
        return CL_OUT_OF_RESOURCES;
    
    p->mem_ptr = device_ptr;
    p->device_addr = device_ptr;
    p->version = 0;
    
    // 如果需要立即传输数据
    if ((mem->flags & CL_MEM_COPY_HOST_PTR) && host_ptr) {
        yourdevice_memcpy(device_ptr, host_ptr, mem->size, HOST_TO_DEVICE);
        p->version = 1;
    }
    
    return CL_SUCCESS;
}

void
pocl_yourdevice_free(cl_device_id device, cl_mem mem)
{
    pocl_mem_identifier *p = &mem->device_ptrs[device->global_mem_id];
    if (p->mem_ptr) {
        yourdevice_free_memory(p->mem_ptr);
        p->mem_ptr = NULL;
    }
}
```

---

## 🧪 测试你的实现

### 测试程序

```c
// test_yourdevice_buffer.c
#include <CL/cl.h>
#include <stdio.h>

int main() {
    cl_platform_id platform;
    cl_device_id device;
    cl_context context;
    cl_int err;
    
    clGetPlatformIDs(1, &platform, NULL);
    clGetDeviceIDs(platform, CL_DEVICE_TYPE_ALL, 1, &device, NULL);
    
    // 测试 1: 默认分配
    context = clCreateContext(NULL, 1, &device, NULL, NULL, &err);
    cl_mem buf1 = clCreateBuffer(context, CL_MEM_READ_WRITE, 4096, NULL, &err);
    printf("Test 1 (default): %s\n", err == CL_SUCCESS ? "✅ PASS" : "❌ FAIL");
    clReleaseMemObject(buf1);
    
    // 测试 2: COPY_HOST_PTR
    float data[1024];
    cl_mem buf2 = clCreateBuffer(context, CL_MEM_COPY_HOST_PTR, 
                                 sizeof(data), data, &err);
    printf("Test 2 (COPY_HOST_PTR): %s\n", err == CL_SUCCESS ? "✅ PASS" : "❌ FAIL");
    clReleaseMemObject(buf2);
    
    clReleaseContext(context);
    return 0;
}
```

### 调试技巧

```bash
# 启用内存调试
export POCL_DEBUG=memory,yourdevice

# 查看分配信息
./test_yourdevice_buffer
```

---

## 📚 总结

### 你需要做的 (核心)

1. **实现 `alloc_mem_obj()`** (~50 行代码)
   - 调用设备 API 分配内存
   - 设置 `p->mem_ptr` 和 `p->device_addr`
   - 处理特殊标志位

2. **实现 `free()`** (~10 行代码)
   - 调用设备 API 释放内存
   - 清空指针

### PoCL 已经做的 (不需要你管)

1. ✅ 所有参数验证
2. ✅ `cl_mem` 对象分配和管理
3. ✅ 标志位逻辑判断
4. ✅ 引用计数和版本追踪
5. ✅ Context 管理
6. ✅ 错误处理框架

### 代码量估算

| 组件 | 估计代码量 | 难度 |
|------|-----------|------|
| 核心 `alloc_mem_obj()` | 50-100 行 | ⭐⭐ |
| 核心 `free()` | 10-20 行 | ⭐ |
| 数据传输 (read/write/copy) | 100-200 行 | ⭐⭐⭐ |
| 内存映射 (map/unmap) | 50-100 行 | ⭐⭐ |
| **总计** | **200-400 行** | |

**对比**: PoCL 核心的 `clCreateBuffer` 实现是 **~350 行**，但你只需要写设备特定的 **~100 行**！

---

## 🚀 下一步

1. 查看参考实现: `lib/CL/devices/cuda/` 或 `lib/CL/devices/basic/`
2. 复制 basic 驱动作为模板
3. 逐步替换设备特定函数
4. 使用 `POCL_DEBUG=memory` 调试

需要我为你创建一个具体设备的模板代码吗？ 🎯
