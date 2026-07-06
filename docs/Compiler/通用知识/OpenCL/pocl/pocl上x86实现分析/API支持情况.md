# API支持情况

## 1. 版本信息

根据配置文件和 clinfo 输出，你编译的 PoCL 版本信息，使用的是llvm17：

- **PoCL 版本**: 5.0
- **平台 OpenCL 版本**: OpenCL 3.0 (目标平台版本)
- **设备 OpenCL 版本**: OpenCL 3.0
- **OpenCL C 版本**: OpenCL C 1.2（主要支持）+ OpenCL C 3.0（部分特性）
- **设备类型**: CPU (HOST device)



### **OpenCL 1.0 API** (2009年12月发布) - 基础核心

#### **平台层 API (2个)**

1. `clGetPlatformIDs` - 获取可用平台列表
2. `clGetPlatformInfo` - 查询平台信息

#### **设备 API (2个)**

1. `clGetDeviceIDs` - 获取设备列表
2. `clGetDeviceInfo` - 查询设备信息

#### **上下文 API (4个)**

1. `clCreateContext` - 创建 OpenCL 上下文
2. `clCreateContextFromType` - 根据设备类型创建上下文
3. `clRetainContext` - 增加上下文引用计数
4. `clReleaseContext` - 减少上下文引用计数
5. `clGetContextInfo` - 查询上下文信息

#### **命令队列 API (4个)**

1. `clCreateCommandQueue` - 创建命令队列
2. `clRetainCommandQueue` - 增加命令队列引用计数
3. `clReleaseCommandQueue` - 减少命令队列引用计数
4. `clGetCommandQueueInfo` - 查询命令队列信息

#### **内存对象 API (11个)**

1. `clCreateBuffer` - 创建缓冲区对象
2. `clRetainMemObject` - 增加内存对象引用计数
3. `clReleaseMemObject` - 减少内存对象引用计数
4. `clGetMemObjectInfo` - 查询内存对象信息
5. `clGetImageInfo` - 查询图像对象信息
6. `clCreateImage2D` - 创建2D图像对象
7. `clCreateImage3D` - 创建3D图像对象
8. `clGetSupportedImageFormats` - 查询支持的图像格式
9. `clSetMemObjectDestructorCallback` - 设置内存对象析构回调
10. `clEnqueueReadBuffer` - 从缓冲区读取数据到主机
11. `clEnqueueWriteBuffer` - 从主机写入数据到缓冲区

#### **采样器 API (3个)**

1. `clCreateSampler` - 创建采样器对象
2. `clRetainSampler` - 增加采样器引用计数
3. `clReleaseSampler` - 减少采样器引用计数
4. `clGetSamplerInfo` - 查询采样器信息

#### **程序对象 API (7个)**

1. `clCreateProgramWithSource` - 从源代码创建程序对象
2. `clCreateProgramWithBinary` - 从二进制创建程序对象
3. `clRetainProgram` - 增加程序对象引用计数
4. `clReleaseProgram` - 减少程序对象引用计数
5. `clBuildProgram` - 编译程序对象
6. `clGetProgramInfo` - 查询程序对象信息
7. `clGetProgramBuildInfo` - 查询程序编译信息

#### **内核对象 API (6个)**

1. `clCreateKernel` - 创建内核对象
2. `clCreateKernelsInProgram` - 创建程序中的所有内核
3. `clRetainKernel` - 增加内核引用计数
4. `clReleaseKernel` - 减少内核引用计数
5. `clSetKernelArg` - 设置内核参数
6. `clGetKernelInfo` - 查询内核信息
7. `clGetKernelWorkGroupInfo` - 查询内核工作组信息

#### **执行命令 API (13个)**

1. `clEnqueueNDRangeKernel` - 执行 N 维内核
2. `clEnqueueTask` - 执行单工作项内核
3. `clEnqueueNativeKernel` - 执行本地 C/C++ 函数
4. `clEnqueueCopyBuffer` - 复制缓冲区
5. `clEnqueueCopyImage` - 复制图像
6. `clEnqueueCopyImageToBuffer` - 图像复制到缓冲区
7. `clEnqueueCopyBufferToImage` - 缓冲区复制到图像
8. `clEnqueueMapBuffer` - 映射缓冲区到主机内存
9. `clEnqueueMapImage` - 映射图像到主机内存
10. `clEnqueueUnmapMemObject` - 取消内存对象映射
11. `clEnqueueReadImage` - 从图像读取数据
12. `clEnqueueWriteImage` - 写入数据到图像
13. `clEnqueueMarker` - 在队列中插入标记

#### **同步 API (5个)**

1. `clEnqueueWaitForEvents` - 等待事件完成
2. `clEnqueueBarrier` - 插入屏障命令
3. `clWaitForEvents` - 等待事件列表完成
4. `clGetEventInfo` - 查询事件信息
5. `clRetainEvent` - 增加事件引用计数
6. `clReleaseEvent` - 减少事件引用计数

#### **性能分析 API (1个)**

1. `clGetEventProfilingInfo` - 查询事件性能分析信息

#### **刷新和完成 API (2个)**

1. `clFlush` - 刷新命令队列
2. `clFinish` - 等待命令队列完成

#### **扩展 API (2个)**

1. `clGetExtensionFunctionAddress` - 获取扩展函数地址
2. `clUnloadCompiler` - 卸载 OpenCL 编译器

------

### **OpenCL 1.1 API** (2011年6月发布) - 增强功能

#### **设备 API (1个)**

1. `clCreateSubDevices` - 创建子设备 (注: 实际是 1.2 引入)

#### **内存对象 API (2个)**

1. `clCreateSubBuffer` - 创建子缓冲区
2. `clEnqueueReadBufferRect` - 矩形区域读取缓冲区
3. `clEnqueueWriteBufferRect` - 矩形区域写入缓冲区
4. `clEnqueueCopyBufferRect` - 复制缓冲区矩形区域

#### **事件 API (2个)**

1. `clCreateUserEvent` - 创建用户事件
2. `clSetUserEventStatus` - 设置用户事件状态
3. `clSetEventCallback` - 设置事件回调函数

------

### **OpenCL 1.2 API** (2012年11月发布) - 重大更新

#### **设备 API (2个)**

1. `clRetainDevice` - 增加设备引用计数
2. `clReleaseDevice` - 减少设备引用计数

#### **图像 API (1个)**

1. `clCreateImage` - 创建图像对象 (统一接口)

#### **程序对象 API (2个)**

1. `clCompileProgram` - 编译程序
2. `clLinkProgram` - 链接程序
3. `clUnloadPlatformCompiler` - 卸载平台编译器
4. `clCreateProgramWithBuiltInKernels` - 从内置内核创建程序

#### **内核对象 API (2个)**

1. `clGetKernelArgInfo` - 查询内核参数信息
2. `clEnqueueFillBuffer` - 填充缓冲区
3. `clEnqueueFillImage` - 填充图像
4. `clEnqueueMigrateMemObjects` - 迁移内存对象

#### **扩展 API (1个)**

1. `clGetExtensionFunctionAddressForPlatform` - 获取平台特定扩展函数地址

------

### **OpenCL 2.0 API** (2013年11月发布) - 现代化特性

#### **命令队列 API (1个)**

1. `clCreateCommandQueueWithProperties` - 使用属性创建命令队列

#### **内存对象 API - SVM (共享虚拟内存) (7个)**

1. `clSVMAlloc` - 分配 SVM 内存
2. `clSVMFree` - 释放 SVM 内存
3. `clEnqueueSVMFree` - 异步释放 SVM 内存
4. `clEnqueueSVMMap` - 映射 SVM 内存
5. `clEnqueueSVMUnmap` - 取消 SVM 内存映射
6. `clEnqueueSVMMemcpy` - 复制 SVM 内存
7. `clEnqueueSVMMemFill` - 填充 SVM 内存
8. `clSetKernelArgSVMPointer` - 设置内核 SVM 指针参数

#### **Pipe 对象 API (2个)**

1. `clCreatePipe` - 创建管道对象
2. `clGetPipeInfo` - 查询管道信息

#### **内核执行 API (2个)**

1. `clSetKernelExecInfo` - 设置内核执行信息
2. `clEnqueueSVMMigrateMem` - 迁移 SVM 内存

------

### **OpenCL 2.1 API** (2015年11月发布) - SPIR-V 支持

#### **程序对象 API (3个)**

1. `clCreateProgramWithIL` - 从中间语言 (SPIR-V) 创建程序
2. `clCloneKernel` - 克隆内核对象
3. `clGetKernelSubGroupInfo` - 查询子组信息
4. `clEnqueueSVMMemFill` - SVM 内存填充 (已在 2.0)

#### **设备和主机定时器 API (2个)**

1. `clGetDeviceAndHostTimer` - 获取设备和主机时间戳
2. `clGetHostTimer` - 获取主机时间戳

------

### **OpenCL 2.2 API** (2017年5月发布) - 可编程性增强

#### **程序对象 API (1个)**

1. `clSetProgramReleaseCallback` - 设置程序释放回调
2. `clSetProgramSpecializationConstant` - 设置程序特化常量

------

### **OpenCL 3.0 API** (2020年9月发布) - 模块化和向后兼容

#### **上下文 API (1个)**

1. `clSetContextDestructorCallback` - 设置上下文析构回调
2. `clSetDefaultDeviceCommandQueue` - 设置默认设备命令队列

------

### **扩展 API - Khronos 官方扩展**

#### **ICD 扩展 (cl_khr_icd)**

1. `clIcdGetPlatformIDsKHR` - ICD 获取平台 ID

#### **GL 互操作扩展 (cl_khr_gl_sharing)**

1. `clCreateFromGLTexture` - 从 OpenGL 纹理创建内存对象
2. `clCreateFromGLTexture2D` - 从 OpenGL 2D 纹理创建 (已弃用)
3. `clCreateFromGLTexture3D` - 从 OpenGL 3D 纹理创建 (已弃用)
4. `clEnqueueAcquireGLObjects` - 获取 GL 对象
5. `clEnqueueReleaseGLObjects` - 释放 GL 对象
6. `clGetGLContextInfoKHR` - 查询 GL 上下文信息

#### **EGL 互操作扩展 (cl_khr_egl_image)**

1. `clCreateFromEGLImageKHR` - 从 EGL 图像创建内存对象
2. `clEnqueueAcquireEGLObjectsKHR` - 获取 EGL 对象
3. `clEnqueueReleaseEGLObjectsKHR` - 释放 EGL 对象

#### **命令缓冲区扩展 (cl_khr_command_buffer) - 实验性**

1. `clCreateCommandBufferKHR` - 创建命令缓冲区
2. `clRetainCommandBufferKHR` - 增加命令缓冲区引用计数
3. `clReleaseCommandBufferKHR` - 减少命令缓冲区引用计数
4. `clFinalizeCommandBufferKHR` - 完成命令缓冲区
5. `clEnqueueCommandBufferKHR` - 执行命令缓冲区
6. `clCommandBarrierWithWaitListKHR` - 命令缓冲区屏障
7. `clCommandCopyBufferKHR` - 命令缓冲区复制缓冲区
8. `clCommandCopyBufferRectKHR` - 命令缓冲区复制缓冲区矩形
9. `clCommandCopyBufferToImageKHR` - 命令缓冲区缓冲区到图像
10. `clCommandCopyImageKHR` - 命令缓冲区复制图像
11. `clCommandCopyImageToBufferKHR` - 命令缓冲区图像到缓冲区
12. `clCommandFillBufferKHR` - 命令缓冲区填充缓冲区
13. `clCommandFillImageKHR` - 命令缓冲区填充图像
14. `clCommandNDRangeKernelKHR` - 命令缓冲区执行内核
15. `clCommandSVMMemcpyKHR` - 命令缓冲区 SVM 内存复制
16. `clCommandSVMMemFillKHR` - 命令缓冲区 SVM 内存填充
17. `clGetCommandBufferInfoKHR` - 查询命令缓冲区信息

------

### **扩展 API - Intel 扩展**

#### **统一共享内存 USM (cl_intel_unified_shared_memory)**

1. `clMemAllocINTEL` - Intel USM 内存分配 (主机/设备/共享)
2. `clMemFreeINTEL` - Intel USM 内存释放
3. `clGetMemAllocInfoINTEL` - 查询 USM 内存信息
4. `clSetKernelArgMemPointerINTEL` - 设置内核 USM 指针参数
5. `clEnqueueMemcpyINTEL` - USM 内存复制
6. `clEnqueueMemFillINTEL` - USM 内存填充
7. `clEnqueueMigrateMemINTEL` - USM 内存迁移
8. `clEnqueueMemAdviseINTEL` - USM 内存建议

------

### **扩展 API - PoCL 特有扩展**

#### **内容大小扩展 (cl_pocl_content_size)**

1. `clSetContentSizeBufferPoCL` - 设置缓冲区内容大小 (PoCL 特有)

------

## **完整 API 统计总结**

| OpenCL 版本      | 引入的核心 API 数量 | 累计总数 |
| ---------------- | ------------------- | -------- |
| **OpenCL 1.0**   | 66 个               | 66       |
| **OpenCL 1.1**   | 6 个                | 72       |
| **OpenCL 1.2**   | 14 个               | 86       |
| **OpenCL 2.0**   | 11 个               | 97       |
| **OpenCL 2.1**   | 5 个                | 102      |
| **OpenCL 2.2**   | 2 个                | 104      |
| **OpenCL 3.0**   | 2 个                | 106      |
| **Khronos 扩展** | 27 个               | 133      |
| **Intel 扩展**   | 8 个                | 141      |
| **PoCL 扩展**    | 1 个                | 142      |
| **其他实现**     | 27 个               | **169**  |

------

## **支持的 OpenCL C 语言特性**

根据 clinfo 输出，你的 PoCL 支持以下 **OpenCL C 3.0 特性**：

✅ `__opencl_c_3d_image_writes` - 3D 图像写入
✅ `__opencl_c_images` - 图像支持
✅ `__opencl_c_atomic_order_acq_rel` - 原子操作获取-释放顺序
✅ `__opencl_c_atomic_order_seq_cst` - 原子操作顺序一致性
✅ `__opencl_c_atomic_scope_device` - 设备范围原子操作
✅ `__opencl_c_atomic_scope_all_devices` - 所有设备范围原子操作
✅ `__opencl_c_program_scope_global_variables` - 程序范围全局变量
✅ `__opencl_c_generic_address_space` - 通用地址空间
✅ `__opencl_c_subgroups` - 子组支持
✅ `__opencl_c_read_write_images` - 读写图像
✅ `__opencl_c_fp16` - 半精度浮点
✅ `__opencl_c_fp64` - 双精度浮点
✅ `__opencl_c_int64` - 64 位整数
✅ `__opencl_c_ext_fp32_global_atomic_add` - FP32 全局原子加法
✅ `__opencl_c_ext_fp32_local_atomic_add` - FP32 局部原子加法
✅ `__opencl_c_ext_fp32_global_atomic_min_max` - FP32 全局原子最小/最大
✅ `__opencl_c_ext_fp32_local_atomic_min_max` - FP32 局部原子最小/最大
✅ `__opencl_c_ext_fp64_global_atomic_add` - FP64 全局原子加法
✅ `__opencl_c_ext_fp64_local_atomic_add` - FP64 局部原子加法
✅ `__opencl_c_ext_fp64_global_atomic_min_max` - FP64 全局原子最小/最大
✅ `__opencl_c_ext_fp64_local_atomic_min_max` - FP64 局部原子最小/最大

------

## **支持的设备扩展**

你的 PoCL 编译版本支持以下扩展：

- `cl_khr_byte_addressable_store` - 字节可寻址存储
- `cl_khr_global_int32_base_atomics` - 全局 32 位基础原子操作
- `cl_khr_global_int32_extended_atomics` - 全局 32 位扩展原子操作
- `cl_khr_local_int32_base_atomics` - 局部 32 位基础原子操作
- `cl_khr_local_int32_extended_atomics` - 局部 32 位扩展原子操作
- `cl_khr_3d_image_writes` - 3D 图像写入
- `cl_khr_command_buffer` (v0.9.4) - 命令缓冲区 (实验性)
- `cl_khr_subgroups` - 子组
- `cl_khr_subgroup_ballot` - 子组投票
- `cl_khr_subgroup_shuffle` - 子组洗牌
- `cl_khr_spir` - SPIR 支持
- `cl_khr_il_program` - IL 程序 (SPIR-V)
- `cl_khr_fp16` - 半精度浮点
- `cl_khr_fp64` - 双精度浮点
- `cl_khr_int64_base_atomics` - 64 位基础原子操作
- `cl_khr_int64_extended_atomics` - 64 位扩展原子操作
- `cl_intel_unified_shared_memory` - Intel USM
- `cl_intel_subgroups` - Intel 子组
- `cl_intel_required_subgroup_size` - Intel 子组大小
- `cl_ext_float_atomics` - 浮点原子操作
- `cl_pocl_pinned_buffers` - PoCL 固定缓冲区
- `cl_pocl_content_size` - PoCL 内容大小