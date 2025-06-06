<h1 align="center">frame</h1>




xla是tensorflow自带的一个可以支持llvm自定义后端的编译器。





nvvm IR是NVDIA在LLVM IR上做的built-in扩展，CPU和GPU两个target处理应该走了不同的分支，GPU优化时生成了llvm.fma.intrinsic。

```asm
https://llvm.org/docs/NVPTXUsage.html

declare i32 @llvm.nvvm.read.ptx.sreg.tid.x()
declare i32 @llvm.nvvm.read.ptx.sreg.tid.y()
declare i32 @llvm.nvvm.read.ptx.sreg.tid.z()
declare i32 @llvm.nvvm.read.ptx.sreg.ntid.x()
declare i32 @llvm.nvvm.read.ptx.sreg.ntid.y()
declare i32 @llvm.nvvm.read.ptx.sreg.ntid.z()
declare i32 @llvm.nvvm.read.ptx.sreg.ctaid.x()
declare i32 @llvm.nvvm.read.ptx.sreg.ctaid.y()
declare i32 @llvm.nvvm.read.ptx.sreg.ctaid.z()
declare i32 @llvm.nvvm.read.ptx.sreg.nctaid.x()
declare i32 @llvm.nvvm.read.ptx.sreg.nctaid.y()
declare i32 @llvm.nvvm.read.ptx.sreg.nctaid.z()
declare i32 @llvm.nvvm.read.ptx.sreg.warpsize()
```



GPU版本的CPU版本的target不同，一个是X86，另一个是NVDIA-CUDA。CPU版本用的是正常的IR，而GPU版本使用了llvm.nvvm.read.ptx.sreg.ctaid.x等built-in函数。（tensorflow的XLA编译器（相当于clang），根据不同的选项/target，生成了不同的LLVM IR，我们是否也要进行到这一步）





我们是不是也是用XLA生成某些特殊的IR，如llvm.nvvm.read.ptx.sreg.ctaid.x等built-in函数，在后端再对其进行处理。





nvvm IR是NVDIA在LLVM IR上做的built-in扩展

NVCC是cuda提供的C/C++编译器。



https://zhuanlan.zhihu.com/p/91334380

CUDA Toolkit由以下组件组成：

- **Compiler**: CUDA-C和CUDA-C++编译器`NVCC`位于`bin/`目录中。它建立在`NVVM`优化器之上，而`NVVM`优化器本身构建在`LLVM`编译器基础结构之上。因此开发人员可以使用`nvm/`目录下的Compiler SDK来直接针对NVVM进行开发。

```asm
这个在前面已经介绍了，nvcc其实就是CUDA的编译器,可以从CUDA Toolkit的/bin目录中获取,类似于gcc就是c语言的编译器。由于程序是要经过编译器编程成可执行的二进制文件，而cuda程序有两种代码，一种是运行在cpu上的host代码，一种是运行在gpu上的device代码，所以nvcc编译器要保证两部分代码能够编译成二进制文件在不同的机器上执行。nvcc涉及到的文件后缀及相关意义如下表
```

