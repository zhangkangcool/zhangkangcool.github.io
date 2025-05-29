

 ## Writing an LLVM Backend

https://llvm.org/docs/WritingAnLLVMBackend.html



## ARC

一些Target添加代码后，并未启用。

```
llc -march=arc alu.ll  // llc: error: error: invalid target 'arc'.
参考 D23560进行
```



------



## RISCV



查看RISCV owner `asb`在`github llvm-project`上的所有patch。

https://github.com/llvm/llvm-project/commits?author=asb



The patch to add new backend.

```
https://reviews.llvm.org/people/revisions/475/
```



```c++
[RISCV 1/10] Recognise riscv32 and riscv64 in triple parsing code [Done] D23557
[RISCV 2/10] Add RISC-V ELF defines [Todo] D23558
[RISCV 3/10] Add stub backend [Todo] D23560   // llvm/CMakeLists.txt 加入LynGPU即可enable新的backend
[RISCV 4/10] Add basic RISCV{InstrFormats,InstrInfo,RegisterInfo,}.td [Todo] D23561
[RISCV 5/10] Add bare-bones RISC-V MCTargetDesc [Todo] D23562
[RISCV] Fix RV32 datalayout string and ensure initAsmInfo is called  https://reviews.llvm.org/rGe4f731b
[RISCV 6/10] Add basic RISCVAsmParser [Todo] D23563
[RISCV 7/10] Add RISCVInstPrinter and basic MC assembler tests [Todo] D23564
[RISCV 8/10] Add support for all RV32I instructions [Todo] D23566
[RISCV 9/10] Add support for disassembly [Todo] D23567  
[RISCV 11/n] Initial codegen support for ALU operations [Todo] D29933 添加RegisterInfo.cpp等文件
```



## clang add the support for RISCV

```c++
https://reviews.llvm.org/D39963    // [RISCV] Add initial RISC-V target and driver support
```



## Skip

```c++
D23563 
  1a427291 [RISCV] Add basic RISCVAsmParser
  04f06d92 [RISCV] Add basic RISCVAsmParser (missing files)
  
```





### Can get the asm

```
https://github.com/llvm/llvm-project/commit/60714f98 YES 2017.12.13
https://github.com/llvm/llvm-project/commit/e2f664e1 YES 2017.11.21
https://github.com/llvm/llvm-project/commit/a337675c YES 2017.11.08
https://github.com/llvm/llvm-project/commit/cfa6291b YES 2017.11.08

```





------

## CSKY

```
https://reviews.llvm.org/people/revisions/20647/   Zixuan
192.168.5.10: /home/zhangkang/CSKY



1673653 commit e1c38dd55d9dab332ccabb7c83a80ca92c373af0
1673654 Author: Zi Xuan Wu <zixuan.wu@linux.alibaba.com>
1673655 Date:   Tue Sep 29 12:31:36 2020 +0800
1673656
1673657     [CSKY 1/n] Add basic stub or infra of csky backend
1673658
1673659     This patch introduce files that just enough for lib/Target/CSKY to compile.
1673660     Notably a basic CSKYTargetMachine and CSKYTargetInfo.
1673661
1673662     Differential Revision: https://reviews.llvm.org/D88466



All zixuan patch
https://github.com/llvm/llvm-project/commits?author=zixuan-wu&after=1d4e857acdd93a659387b9799fa262cce2370fb0+34
```





----

## Use patches

```
D23564
```







```
# List of all targets to be built by default:
set(LLVM_ALL_TARGETS    # 默认全编译
  AArch64
  AMDGPU
  ARM
  AVR
  BPF
  Hexagon
  Lanai
  LoongArch
  Mips
  MSP430
  NVPTX
  PowerPC
  RISCV
  Sparc
  SystemZ
  VE
  WebAssembly
  X86
  XCore
  )

set(LLVM_ALL_EXPERIMENTAL_TARGETS  # 默认不编译
  ARC
  CSKY
  DirectX
  M68k
  SPIRV
  Xtensa
)
```







