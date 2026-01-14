<h1 align="center">SPRIV demo</h1>



## 1. 示例程序

```c++
/**
 * PoCL SPIR-V 编译路径对比示例
 * 
 * 展示三种不同的程序创建方式：
 * 1. 从 OpenCL C 源代码
 * 2. 从 LLVM IR (SPIR)
 * 3. 从 SPIR-V 二进制
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <CL/opencl.h>

// OpenCL C 内核源代码
const char *kernel_source =
"__kernel void vector_add(__global const float *A,\n"
"                         __global const float *B,\n"
"                         __global float *C,\n"
"                         const unsigned int n)\n"
"{\n"
"    int i = get_global_id(0);\n"
"    if (i < n) {\n"
"        C[i] = A[i] + B[i];\n"
"    }\n"
"}\n";

void print_compilation_path(const char *method) {
    printf("\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    printf("编译方法: %s\n", method);
    printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

int main(void) {
    cl_platform_id platform;
    cl_device_id device;
    cl_context context;
    cl_int err;
    
    // 获取平台和设备
    clGetPlatformIDs(1, &platform, NULL);
    clGetDeviceIDs(platform, CL_DEVICE_TYPE_DEFAULT, 1, &device, NULL);
    context = clCreateContext(NULL, 1, &device, NULL, NULL, &err);
    
    // 检查设备扩展
    char extensions[4096];
    clGetDeviceInfo(device, CL_DEVICE_EXTENSIONS, sizeof(extensions), extensions, NULL);
    
    printf("\n");
    printf("═══════════════════════════════════════════════════\n");
    printf("  PoCL 编译路径对比示例\n");
    printf("═══════════════════════════════════════════════════\n");
    
    int supports_spir = strstr(extensions, "cl_khr_spir") != NULL;
    int supports_il = strstr(extensions, "cl_khr_il_program") != NULL;
    
    printf("\n设备支持情况:\n");
    printf("  ✓ OpenCL C 源代码编译\n");
    printf("  %s SPIR (LLVM IR) 二进制\n", supports_spir ? "✓" : "✗");
    printf("  %s SPIR-V 中间语言 (IL)\n", supports_il ? "✓" : "✗");
    
    // ================================================================
    // 方法 1: 从 OpenCL C 源代码创建 (最常用)
    // ================================================================
    print_compilation_path("方法 1: clCreateProgramWithSource (OpenCL C)");
    
    printf("\n编译流程:\n");
    printf("  OpenCL C Source\n");
    printf("       ↓ [Clang 前端]\n");
    printf("  LLVM IR (program.bc)\n");
    printf("       ↓ [LLVM 优化 Pass]\n");
    printf("  LLVM IR (优化后)\n");
    printf("       ↓ [LLVM 后端代码生成]\n");
    printf("  Native Code (kernel.so)\n");
    printf("       ↓ [dlopen/dlsym]\n");
    printf("  执行\n");
    
    cl_program program1 = clCreateProgramWithSource(
        context, 1, &kernel_source, NULL, &err);
    
    if (err == CL_SUCCESS) {
        printf("\n✓ 程序创建成功\n");
        printf("  - 使用 OpenCL C 源代码\n");
        printf("  - 编译时生成 LLVM IR\n");
        printf("  - 针对 x86-64 优化\n");
        
        // 编译
        err = clBuildProgram(program1, 1, &device, NULL, NULL, NULL);
        if (err == CL_SUCCESS) {
            printf("✓ 编译成功\n");
            printf("  - 生成的文件在: ~/.cache/pocl/kcache/\n");
            printf("  - program.bc: LLVM 位码\n");
            printf("  - kernel.so: x86-64 机器码\n");
        }
        clReleaseProgram(program1);
    }
    
    // ================================================================
    // 方法 2: 从 SPIR-V 创建 (OpenCL 2.1+, 如果支持)
    // ================================================================
    if (supports_il) {
        print_compilation_path("方法 2: clCreateProgramWithIL (SPIR-V)");
        
        printf("\n编译流程:\n");
        printf("  SPIR-V Binary (.spv)\n");
        printf("       ↓ [llvm-spirv -r 反向转换]\n");
        printf("  LLVM IR (program.bc)\n");
        printf("       ↓ [LLVM 优化 Pass]\n");
        printf("  LLVM IR (优化后)\n");
        printf("       ↓ [LLVM 后端代码生成]\n");
        printf("  Native Code (kernel.so)\n");
        printf("       ↓ [dlopen/dlsym]\n");
        printf("  执行\n");
        
        printf("\n注意事项:\n");
        printf("  - 需要预先生成 SPIR-V 文件\n");
        printf("  - 使用 llvm-spirv 工具转换\n");
        printf("  - 支持特化常量 (Specialization Constants)\n");
        printf("  - 适合跨平台二进制分发\n");
        
        printf("\n离线生成 SPIR-V 的步骤:\n");
        printf("  $ clang -cl-std=CL2.0 -emit-llvm -c kernel.cl -o kernel.bc\n");
        printf("  $ llvm-spirv kernel.bc -o kernel.spv\n");
        printf("  # 然后在程序中:\n");
        printf("  # cl_program prog = clCreateProgramWithIL(ctx, spirv_data, size, &err);\n");
    }
    
    // ================================================================
    // 显示实际的缓存路径
    // ================================================================
    printf("\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    printf("编译产物缓存位置\n");
    printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    printf("\n目录结构:\n");
    printf("  ~/.cache/pocl/kcache/\n");
    printf("  └── {HASH}/                    # 程序构建哈希\n");
    printf("      ├── program.bc             # LLVM IR (从源或SPIR-V转换)\n");
    printf("      ├── program.spv            # SPIR-V (如使用IL)\n");
    printf("      ├── last_accessed          # 访问时间戳\n");
    printf("      └── {kernel_name}/         # 各个内核\n");
    printf("          └── {specialization}/  # 工作组配置\n");
    printf("              └── kernel.so      # 最终机器码\n");
    
    printf("\n文件格式说明:\n");
    printf("  program.bc  - LLVM 位码 (可用 llvm-dis 反汇编)\n");
    printf("  program.spv - SPIR-V 二进制 (可用 spirv-dis 反汇编)\n");
    printf("  kernel.so   - ELF 共享库 (可用 objdump 查看)\n");
    
    // ================================================================
    // 工具链说明
    // ================================================================
    printf("\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    printf("相关工具\n");
    printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    printf("\nLLVM/Clang 工具:\n");
    printf("  clang        - OpenCL C 编译器\n");
    printf("  llvm-dis     - LLVM IR 反汇编器\n");
    printf("  llvm-as      - LLVM IR 汇编器\n");
    printf("  opt          - LLVM 优化器\n");
    printf("  llc          - LLVM 静态编译器\n");
    
    printf("\nSPIR-V 工具:\n");
    printf("  llvm-spirv   - LLVM IR ↔ SPIR-V 转换器\n");
    printf("  spirv-dis    - SPIR-V 反汇编器\n");
    printf("  spirv-as     - SPIR-V 汇编器\n");
    printf("  spirv-val    - SPIR-V 验证器\n");
    printf("  spirv-opt    - SPIR-V 优化器\n");
    
    printf("\n调试命令示例:\n");
    printf("  # 查看 LLVM IR\n");
    printf("  $ llvm-dis ~/.cache/pocl/kcache/.../program.bc\n");
    printf("\n");
    printf("  # 转换 LLVM IR → SPIR-V\n");
    printf("  $ llvm-spirv program.bc -o program.spv\n");
    printf("\n");
    printf("  # 转换 SPIR-V → LLVM IR\n");
    printf("  $ llvm-spirv -r program.spv -o program.bc\n");
    printf("\n");
    printf("  # 查看 SPIR-V\n");
    printf("  $ spirv-dis program.spv\n");
    printf("\n");
    printf("  # 查看内核符号\n");
    printf("  $ nm ~/.cache/pocl/kcache/.../kernel.so\n");
    printf("\n");
    printf("  # 反汇编内核代码\n");
    printf("  $ objdump -d ~/.cache/pocl/kcache/.../kernel.so\n");
    
    // ================================================================
    // 性能和适用场景对比
    // ================================================================
    printf("\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    printf("使用场景对比\n");
    printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    printf("\n┌────────────┬─────────────┬─────────────┬──────────────┐\n");
    printf("│ 特性       │ OpenCL C    │ SPIR (IR)   │ SPIR-V       │\n");
    printf("├────────────┼─────────────┼─────────────┼──────────────┤\n");
    printf("│ 首次编译   │ 较慢        │ 快          │ 中等         │\n");
    printf("│ 运行时性能 │ 最佳        │ 最佳        │ 最佳         │\n");
    printf("│ 可移植性   │ 最佳        │ 一般        │ 很好         │\n");
    printf("│ 二进制大小 │ N/A         │ 中等        │ 较小         │\n");
    printf("│ 调试难度   │ 容易        │ 中等        │ 较难         │\n");
    printf("│ 知识产权   │ 源码可见    │ 部分保护    │ 较好保护     │\n");
    printf("│ 特化常量   │ ✗           │ ✗           │ ✓            │\n");
    printf("│ 跨驱动     │ ✓           │ 限制        │ ✓            │\n");
    printf("└────────────┴─────────────┴─────────────┴──────────────┘\n");
    
    printf("\n推荐使用场景:\n");
    printf("  OpenCL C:  开发调试、性能调优、简单应用\n");
    printf("  SPIR:      PoCL 内部使用、特定平台优化\n");
    printf("  SPIR-V:    产品发布、跨平台分发、知识产权保护\n");
    
    printf("\n");
    printf("═══════════════════════════════════════════════════\n");
    printf("  程序结束\n");
    printf("═══════════════════════════════════════════════════\n");
    printf("\n");
    
    clReleaseContext(context);
    return 0;
}
```





## 2. 输出结果

```shell
$ ./spirv_demo 

═══════════════════════════════════════════════════
  PoCL 编译路径对比示例
═══════════════════════════════════════════════════

设备支持情况:
  ✓ OpenCL C 源代码编译
  ✓ SPIR (LLVM IR) 二进制
  ✓ SPIR-V 中间语言 (IL)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
编译方法: 方法 1: clCreateProgramWithSource (OpenCL C)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

编译流程:
  OpenCL C Source
       ↓ [Clang 前端]
  LLVM IR (program.bc)
       ↓ [LLVM 优化 Pass]
  LLVM IR (优化后)
       ↓ [LLVM 后端代码生成]
  Native Code (kernel.so)
       ↓ [dlopen/dlsym]
  执行

✓ 程序创建成功
  - 使用 OpenCL C 源代码
  - 编译时生成 LLVM IR
  - 针对 x86-64 优化
✓ 编译成功
  - 生成的文件在: ~/.cache/pocl/kcache/
  - program.bc: LLVM 位码
  - kernel.so: x86-64 机器码

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
编译方法: 方法 2: clCreateProgramWithIL (SPIR-V)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

编译流程:
  SPIR-V Binary (.spv)
       ↓ [llvm-spirv -r 反向转换]
  LLVM IR (program.bc)
       ↓ [LLVM 优化 Pass]
  LLVM IR (优化后)
       ↓ [LLVM 后端代码生成]
  Native Code (kernel.so)
       ↓ [dlopen/dlsym]
  执行

注意事项:
  - 需要预先生成 SPIR-V 文件
  - 使用 llvm-spirv 工具转换
  - 支持特化常量 (Specialization Constants)
  - 适合跨平台二进制分发

离线生成 SPIR-V 的步骤:
  $ clang -cl-std=CL2.0 -emit-llvm -c kernel.cl -o kernel.bc
  $ llvm-spirv kernel.bc -o kernel.spv
  # 然后在程序中:
  # cl_program prog = clCreateProgramWithIL(ctx, spirv_data, size, &err);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
编译产物缓存位置
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

目录结构:
  ~/.cache/pocl/kcache/
  └── {HASH}/                    # 程序构建哈希
      ├── program.bc             # LLVM IR (从源或SPIR-V转换)
      ├── program.spv            # SPIR-V (如使用IL)
      ├── last_accessed          # 访问时间戳
      └── {kernel_name}/         # 各个内核
          └── {specialization}/  # 工作组配置
              └── kernel.so      # 最终机器码

文件格式说明:
  program.bc  - LLVM 位码 (可用 llvm-dis 反汇编)
  program.spv - SPIR-V 二进制 (可用 spirv-dis 反汇编)
  kernel.so   - ELF 共享库 (可用 objdump 查看)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
相关工具
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LLVM/Clang 工具:
  clang        - OpenCL C 编译器
  llvm-dis     - LLVM IR 反汇编器
  llvm-as      - LLVM IR 汇编器
  opt          - LLVM 优化器
  llc          - LLVM 静态编译器

SPIR-V 工具:
  llvm-spirv   - LLVM IR ↔ SPIR-V 转换器
  spirv-dis    - SPIR-V 反汇编器
  spirv-as     - SPIR-V 汇编器
  spirv-val    - SPIR-V 验证器
  spirv-opt    - SPIR-V 优化器

调试命令示例:
  # 查看 LLVM IR
  $ llvm-dis ~/.cache/pocl/kcache/.../program.bc

  # 转换 LLVM IR → SPIR-V
  $ llvm-spirv program.bc -o program.spv

  # 转换 SPIR-V → LLVM IR
  $ llvm-spirv -r program.spv -o program.bc

  # 查看 SPIR-V
  $ spirv-dis program.spv

  # 查看内核符号
  $ nm ~/.cache/pocl/kcache/.../kernel.so

  # 反汇编内核代码
  $ objdump -d ~/.cache/pocl/kcache/.../kernel.so

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
使用场景对比
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────┬─────────────┬─────────────┬──────────────┐
│ 特性       │ OpenCL C    │ SPIR (IR)   │ SPIR-V       │
├────────────┼─────────────┼─────────────┼──────────────┤
│ 首次编译   │ 较慢        │ 快          │ 中等         │
│ 运行时性能 │ 最佳        │ 最佳        │ 最佳         │
│ 可移植性   │ 最佳        │ 一般        │ 很好         │
│ 二进制大小 │ N/A         │ 中等        │ 较小         │
│ 调试难度   │ 容易        │ 中等        │ 较难         │
│ 知识产权   │ 源码可见    │ 部分保护    │ 较好保护     │
│ 特化常量   │ ✗           │ ✗           │ ✓            │
│ 跨驱动     │ ✓           │ 限制        │ ✓            │
└────────────┴─────────────┴─────────────┴──────────────┘

推荐使用场景:
  OpenCL C:  开发调试、性能调优、简单应用
  SPIR:      PoCL 内部使用、特定平台优化
  SPIR-V:    产品发布、跨平台分发、知识产权保护

═══════════════════════════════════════════════════
  程序结束
═══════════════════════════════════════════════════

```



