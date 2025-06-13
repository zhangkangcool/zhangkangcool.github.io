<h1 align="center">RISCV</h1>






```c++
git log --author="Alex Bradbury" > ~/git.log  找此人的提交
```





```c++
D23557 b6e784a240 [RISCV 1/10] Recognise riscv32 and riscv64 in triple parsing code
D23558 1524f62b97 [RISCV 2/10] Add RISC-V ELF defines
acf6c82de2c5a4c3f [RISCV] Add missing RISCV.def
D23560 1524f62b97 [RISCV 3/10] Add stub backend
D23561 24d9b13b36 [RISCV 4/10] Add basic RISCV{InstrFormats,InstrInfo,RegisterInfo,}.td
D23562 6b2cca7f8f [RISCV 5/10] Add bare-bones RISC-V MCTargetDesc
d36e04cb6c2f308d6 [RISCV] Fix unused variable in RISCVMCTargetDesc. NFC
6be16fbfb8107dcc7 [RISCV] Pseudo instructions are isCodeGenOnly, have blank asmstr
e4f731b81308274ab [RISCV] Fix RV32 datalayout string and ensure initAsmInfo is called
D23563 1a4272914d [RISCV 6/10] Add basic RISCVAsmParser(另一个提交04f06d922f9e，两个提交一起完成)
6b34069ab702672c5 [RISCV] Fix warning about unused getSubtargetFeatureName()
f1af56c26a5fc47d0 Remove RISCV from LLVM_ALL_TARGETS in CMakeLists.txt 默认不要编译RISCV
D23564 2fee9ead7e [RISCV 7/10] Add RISCVInstPrinter and basic MC assembler tests
D23566 6758ecb98c [RISCV 8/10] Add support for all RV32I instructions
D23567 8ab4a9696a [RISCV 9/10] Add support for disassembly
D23568 9d3f12501a [RISCV 10/10] Add common fixups and relocations
ee7c7ecd0366214d6 [RISCV] Prepare for the use of variable-sized register classes
3c941e7ed92a5043d [RISCV] RISCVAsmParser: early exit if RISCVOperand isn't immediate as expecte
D29933 8971842f43 [RISCV 11/n] Initial codegen support for ALU operations
D39101 0f0e1b54f0 [RISCV] Codegen support for materializing constants
D29934 cfa6291bb1 [RISCV 12/n] Codegen support for memory operations
D39103 ec8aa91305 [RISCV] Codegen support for memory operations on global addresses
D29935 74913e1c70 [RISCV 13/n] Codegen for conditional branches
D29936 a337675cdb [RISCV] Initial support for function calls
... 根据git.log继续进行提取
```

