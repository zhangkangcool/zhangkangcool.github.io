<h1 align="center">clBuildProgram实现分析</h1>



## 1. 调用关系

```c++
<h1 align="center">调试选项</h1>
```



实际执行流程（你的 vector_add 程序）

```c++
1. clBuildProgram() 被调用
   ↓
2. 计算程序哈希: KKILOIDNDGMMLILKELBBFGLPCBNNGOPGKKBPB
   ↓
3. 检查缓存: ~/.cache/pocl/kcache/LF/KKILOIDNDGMMLILKELBBFGLPCBNNGOPGKKBPB/
   ↓
4. 缓存不存在 → 开始编译
   ↓
5. Clang 编译 OpenCL C → LLVM IR
   源代码: __kernel void vector_add(...)
   输出: program.bc (LLVM 位码)
   ↓
6. 保存 program.bc 到缓存
   ↓
7. clEnqueueNDRangeKernel() 被调用时:
   ↓
8. 计算内核哈希 + 工作组配置
   ↓
9. 编译 program.bc → vector_add.so
   - 应用工作组专用化
   - 生成 x86-64 机器码
   - 输出 ELF 共享库
   ↓
10. dlopen() 加载 vector_add.so
    ↓
11. dlsym() 查找 "_pocl_kernel_vector_add_workgroup"
    ↓
12. pthread 调度器执行内核
    - 创建工作线程
    - 每个线程调用内核函数
    - 并行处理工作组
```





## 2. 详细步骤

#### **1. clBuildProgram 入口** ([clBuildProgram.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html))

```c++
CL_API_ENTRY cl_int CL_API_CALL
POname(clBuildProgram)(cl_program program,
                       cl_uint num_devices,
                       const cl_device_id *device_list,
                       const char *options,
                       void (CL_CALLBACK *pfn_notify)(...),
                       void *user_data)
{
  // 调用统一的编译和链接函数
  return compile_and_link_program(
      1,              // compile_program = 1
      1,              // link_program = 1
      program,
      num_devices, device_list, options,
      0, NULL, NULL, 0, NULL,
      pfn_notify, user_data);
}
```



#### **2. 核心编译函数** ([lib/CL/pocl_build.c:612](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html))

```c++
int compile_and_link_program(...)
{
  // 1. 解析编译选项
  process_options(options, ...);
  
  // 2. 为每个设备编译
  for (device_i = 0; device_i < program->num_devices; ++device_i)
    {
      cl_device_id device = program->devices[device_i];
      
      // 3. 从源代码编译
      if (program->source) {
        error = device->ops->build_source(
            program, device_i, 
            num_input_headers, input_headers,
            header_include_names, link_program);
      }
      
      // 4. 或从二进制/SPIR-V编译
      else {
        error = device->ops->build_binary(...);
      }
    }
    
  // 5. 设置内核元数据
  setup_kernel_metadata(program);
  setup_device_kernel_hashes(program);
  
  return CL_SUCCESS;
}
```



#### **3. 驱动层编译** ([common_driver.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html))

```c++
int pocl_driver_build_source(cl_program program, cl_uint device_i, ...)
{
  // 调用 LLVM 编译管线
  return pocl_llvm_build_program(program, device_i,
                                  num_input_headers,
                                  input_headers,
                                  header_include_names,
                                  link_builtin_lib);
}
```



#### **4. LLVM 编译管线** ([pocl_llvm_build.cc](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html))

```c++
int pocl_llvm_build_program(cl_program program, unsigned device_i, ...)
{
  // 1. 准备 Clang 编译器参数
  std::stringstream ss;
  ss << "-xcl ";                    // OpenCL C 语言
  ss << "-cl-kernel-arg-info ";     // 内核参数信息
  ss << "-D__OPENCL_VERSION__=" << device->version_as_int;
  ss << user_options;               // 用户选项
  
  // 2. 创建 Clang 编译器实例
  CompilerInstance CI;
  CompilerInvocation &pocl_build = CI.getInvocation();
  
  // 3. 将源代码写入临时文件
  pocl_cache_tempname(tempfile, ".cl", &fd);
  write(fd, program->source, strlen(program->source));
  
  // 4. 编译 OpenCL C → LLVM IR (.bc)
  EmitLLVMOnlyAction EmitLLVMAction(&llvm_ctx->Context);
  CI.ExecuteAction(EmitLLVMAction);
  
  // 5. 获取 LLVM Module
  mod = EmitLLVMAction.takeModule().release();
  
  // 6. 链接设备专用库（如 libclc）
  pocl_llvm_link_builtin_libs(program, device_i, mod);
  
  // 7. 运行优化 Pass
  pocl_llvm_optimize_program(mod, device);
  
  // 8. 保存 program.bc 到缓存
  pocl_cache_program_bc_path(program_bc_path, program, device_i);
  WriteBitcodeToFile(*mod, program_bc_path);
  
  return CL_SUCCESS;
}
```



## 3. **编译后的二进制存储位置**

### ### 3.1 *缓存目录结构**

```c++
~/.cache/pocl/kcache/
├── LF/                              # 哈希值的前2个字符
│   └── KKILOIDNDGMMLILKELBBFGLPCBNNGOPGKKBPB/  # 程序构建哈希 (SHA1)
│       ├── program.bc               # ← 编译后的 LLVM 位码
│       ├── last_accessed            # 最后访问时间
│       └── vector_add/              # 内核名称
│           └── 64-1-1-goffs0-smallgrid/  # 工作组配置
│               └── vector_add.so    # ← 最终的本地二进制！
```



#### **文件说明**

1. **program.bc** - LLVM 位码文件
   - 位置: `~/.cache/pocl/kcache/{HASH}/program.bc`
   - 内容: 从 OpenCL C 编译的 LLVM IR
   - 大小: ~36 KB（你的例子）
   - 格式: LLVM Bitcode
2. **vector_add.so** - 编译后的内核二进制
   - 位置: `~/.cache/pocl/kcache/{HASH}/vector_add/64-1-1-goffs0-smallgrid/vector_add.so`
   - 内容: x86-64 机器码共享库
   - 大小: ~14 KB
   - 格式: ELF 64-bit LSB shared object
   - 符号: `_pocl_kernel_vector_add`, `_pocl_kernel_vector_add_workgroup`



### **哈希值含义**

程序构建哈希 (Build Hash) 由以下因素计算：

```c++
// 来自 lib/CL/devices/basic/basic.c
char* pocl_basic_build_hash(cl_device_id device)
{
  char* res = calloc(1000, sizeof(char));
  snprintf(res, 1000, "cpu-minimal-%s-%s", 
           HOST_DEVICE_BUILD_HASH,  // 设备特征哈希
           device->llvm_cpu);        // CPU 型号
  return res;
}
```



哈希包含：

- 编译选项
- 设备特征（CPU 型号、指令集等）
- PoCL 版本
- LLVM 版本
- 内核库哈希

------

### **内核专用化**

目录名 `64-1-1-goffs0-smallgrid` 表示：

```c++
64-1-1           → 本地工作组大小 (local_size[0]=64, [1]=1, [2]=1)
goffs0           → 全局偏移量为0
smallgrid        → 小网格优化（max_grid_width < 设备限制）
```

这允许 PoCL 为不同的工作组配置生成优化的代码！



- ### **关键代码位置总结**

- | 功能             | 文件路径                                                     | 行数 |
  | ---------------- | ------------------------------------------------------------ | ---- |
  | **API 入口**     | [clBuildProgram.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) | 37   |
  | **编译协调**     | [pocl_build.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) | 612  |
  | **驱动接口**     | [common_driver.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) | 721  |
  | **LLVM 编译**    | [pocl_llvm_build.cc](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) | 209  |
  | **缓存管理**     | [pocl_cache.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) | 全文 |
  | **pthread 驱动** | [pthread.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) | 全文 |
  | **basic 驱动**   | [basic.c](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) | 全文 |

- 

- 

