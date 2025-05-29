# P1. 可被删除的库

### 1.1 具体架构相关的库

```asm
LLVMAMDGPUDisassembler
LLVMAMDGPUAsmParser
LLVMAMDGPUDesc
LLVMAMDGPUUtils
LLVMAMDGPUCodeGen
LLVMAMDGPUInfo
```

可以用 `-DLLVM_TARGETS_TO_BUILD="" `不要设置任何架构，这样就不会编译与架构相关的库。



### 1.2 汇编反汇编相关的库

```asm
LLVMAsmPrinter         # 输出汇编 
LLVMMCDisassembler     # 反汇编
```





### 1.3 指令选择相关的库

```asm
LLVMGlobalISel       # 新的全局指令选择方式
LLVMSelectionDAG     # 旧的指令选择
```



### 1.4 MIR相关的库

```asm
LLVMMIRParser    # LLVM中间过程读取MIR文件   
```





### 1.5 可直接在LLVMBuild.txt和CMakeLists.txt中删除的库

```asm
LLVMObjectYAML  # 处理YAML格式的CodeView Debug Info
LLVMLineEditor
```

在`llvm/lib/CMakeLists.txt`和`llvm/lib/LLVMBuild.txt`中删除`ObjectYAML`,可以参考[Remove ObjectYAML](http://172.18.110.26:3000/xsw/OpenCL_Compiler/commit/ba9ca4bf2782983e1ab99b88eea347a1afe6e04a)。



### 1. 6 调试信息相关的库

```
LLVMDebugInfoDWARF
LLVMDebugInfoGSYM
LLVMDebugInfoCodeView
LLVMDebugInfoMSF
LLVMSymbolize
```





### 1.7 LLVMWindowsManifest



### 1.8 JIT相关

```
LLVMOrcJIT
LLVMJITLink
LLVMMCJIT
```





### 1.9 其它

```
LLVMMCA
LLVMRuntimeDyld
LLVMExecutionEngine
LLVMInterpreter
LLVMLibDriver
LLVMDlltoolDriver
```



