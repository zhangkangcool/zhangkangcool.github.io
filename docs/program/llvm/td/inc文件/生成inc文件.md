



在`build.ninja`种直接所有inc的文件名，可以找到编译命令。

```
#############################################
# Phony custom command for lib/Target/LJMicro/CMakeFiles/LJMicroCommonTableGen

build lib/Target/LJMicro/CMakeFiles/LJMicroCommonTableGen | ${cmake_ninja_workdir}lib/Target/LJMicro/CMakeFiles/LJMicroCommonTableGen: phony lib/Target/LJMicro/LJMicroGenAsmMatcher.inc lib/Target/LJMicro/LJMicroGenAsmWriter.inc lib/Target/LJMicro/LJMicroGenInstrInfo.inc lib/Target/LJMicro/LJMicroGenMCCodeEmitter.inc lib/Target/LJMicro/LJMicroGenRegisterInfo.inc || bin/llvm-tblgen include/llvm/IR/intrinsics_gen lib/libLLVMDemangle.a lib/libLLVMSupport.a lib/libLLVMTableGen.a

                                                                                                                                                                                                                   
#############################################
# Custom command for lib/Target/LJMicro/LJMicroGenAsmMatcher.inc

build lib/Target/LJMicro/LJMicroGenAsmMatcher.inc | ${cmake_ninja_workdir}lib/Target/LJMicro/LJMicroGenAsmMatcher.inc: CUSTOM_COMMAND bin/llvm-tblgen bin/llvm-tblgen /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td || bin/llvm-tblgen include/llvm/IR/intrinsics_gen lib/libLLVMDemangle.a lib/libLLVMSupport.a lib/libLLVMTableGen.a
  COMMAND = cd /home/ken/workspace/OpenCL_Compiler/build && /home/ken/workspace/OpenCL_Compiler/build/bin/llvm-tblgen -gen-asm-matcher -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro -I /home/ken/workspace/OpenCL_Compiler/llvm/include -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td -o lib/Target/LJMicro/LJMicroGenAsmMatcher.inc -d lib/Target/LJMicro/LJMicroGenAsmMatcher.inc.d
  DESC = Building LJMicroGenAsmMatcher.inc...
  depfile = /home/ken/workspace/OpenCL_Compiler/build/lib/Target/LJMicro/LJMicroGenAsmMatcher.inc.d
  restat = 1

#############################################
# Custom command for lib/Target/LJMicro/LJMicroGenAsmWriter.inc                                                                                                                                                    

build lib/Target/LJMicro/LJMicroGenAsmWriter.inc | ${cmake_ninja_workdir}lib/Target/LJMicro/LJMicroGenAsmWriter.inc: CUSTOM_COMMAND bin/llvm-tblgen bin/llvm-tblgen /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td || bin/llvm-tblgen include/llvm/IR/intrinsics_gen lib/libLLVMDemangle.a lib/libLLVMSupport.a lib/libLLVMTableGen.a
  COMMAND = cd /home/ken/workspace/OpenCL_Compiler/build && /home/ken/workspace/OpenCL_Compiler/build/bin/llvm-tblgen -gen-asm-writer -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro -I /home/ken/workspace/OpenCL_Compiler/llvm/include -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td -o lib/Target/LJMicro/LJMicroGenAsmWriter.inc -d lib/Target/LJMicro/LJMicroGenAsmWriter.inc.d
  DESC = Building LJMicroGenAsmWriter.inc...
  depfile = /home/ken/workspace/OpenCL_Compiler/build/lib/Target/LJMicro/LJMicroGenAsmWriter.inc.d
  restat = 1


#############################################
# Custom command for lib/Target/LJMicro/LJMicroGenInstrInfo.inc

build lib/Target/LJMicro/LJMicroGenInstrInfo.inc | ${cmake_ninja_workdir}lib/Target/LJMicro/LJMicroGenInstrInfo.inc: CUSTOM_COMMAND bin/llvm-tblgen bin/llvm-tblgen /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td || bin/llvm-tblgen include/llvm/IR/intrinsics_gen lib/libLLVMDemangle.a lib/libLLVMSupport.a lib/libLLVMTableGen.a
  COMMAND = cd /home/ken/workspace/OpenCL_Compiler/build && /home/ken/workspace/OpenCL_Compiler/build/bin/llvm-tblgen -gen-instr-info -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro -I /home/ken/workspace/OpenCL_Compiler/llvm/include -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td -o lib/Target/LJMicro/LJMicroGenInstrInfo.inc -d lib/Target/LJMicro/LJMicroGenInstrInfo.inc.d
  DESC = Building LJMicroGenInstrInfo.inc...
  depfile = /home/ken/workspace/OpenCL_Compiler/build/lib/Target/LJMicro/LJMicroGenInstrInfo.inc.d
  restat = 1

#############################################
# Custom command for lib/Target/LJMicro/LJMicroGenMCCodeEmitter.inc

build lib/Target/LJMicro/LJMicroGenMCCodeEmitter.inc | ${cmake_ninja_workdir}lib/Target/LJMicro/LJMicroGenMCCodeEmitter.inc: CUSTOM_COMMAND bin/llvm-tblgen bin/llvm-tblgen /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td || bin/llvm-tblgen include/llvm/IR/intrinsics_gen lib/libLLVMDemangle.a lib/libLLVMSupport.a lib/libLLVMTableGen.a
  COMMAND = cd /home/ken/workspace/OpenCL_Compiler/build && /home/ken/workspace/OpenCL_Compiler/build/bin/llvm-tblgen -gen-emitter -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro -I /home/ken/workspace/OpenCL_Compiler/llvm/include -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td -o lib/Target/LJMicro/LJMicroGenMCCodeEmitter.inc -d lib/Target/LJMicro/LJMicroGenMCCodeEmitter.inc.d
  DESC = Building LJMicroGenMCCodeEmitter.inc...
  depfile = /home/ken/workspace/OpenCL_Compiler/build/lib/Target/LJMicro/LJMicroGenMCCodeEmitter.inc.d
  restat = 1


#############################################
# Custom command for lib/Target/LJMicro/LJMicroGenRegisterInfo.inc

build lib/Target/LJMicro/LJMicroGenRegisterInfo.inc | ${cmake_ninja_workdir}lib/Target/LJMicro/LJMicroGenRegisterInfo.inc: CUSTOM_COMMAND bin/llvm-tblgen bin/llvm-tblgen /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td || bin/llvm-tblgen include/llvm/IR/intrinsics_gen lib/libLLVMDemangle.a lib/libLLVMSupport.a lib/libLLVMTableGen.a
  COMMAND = cd /home/ken/workspace/OpenCL_Compiler/build && /home/ken/workspace/OpenCL_Compiler/build/bin/llvm-tblgen -gen-register-info -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro -I /home/ken/workspace/OpenCL_Compiler/llvm/include -I /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target /home/ken/workspace/OpenCL_Compiler/llvm/lib/Target/LJMicro/LJMicro.td -o lib/Target/LJMicro/LJMicroGenRegisterInfo.inc -d lib/Target/LJMicro/LJMicroGenRegisterInfo.inc.d
  DESC = Building LJMicroGenRegisterInfo.inc...
  depfile = /home/ken/workspace/OpenCL_Compiler/build/lib/Target/LJMicro/LJMicroGenRegisterInfo.inc.d
  restat = 1

```

