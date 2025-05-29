



最新的代码使用在CMakeLists.txt中使用`add_llvm_component_library`来替换额外的LLVMBuild.txt文件。

目前已找不到LLVMBuild.txt文件。CSKY的第1个patch和第二个patch间作了该调整





```CMAKE
add_llvm_component_group(CSKY)
set(LLVM_TARGET_DEFINITIONS CSKY.td)
tablegen(LLVM CSKYGenRegisterInfo.inc -gen-register-info)
tablegen(LLVM CSKYGenInstrInfo.inc -gen-instr-info)
tablegen(LLVM CSKYGenMCCodeEmitter.inc -gen-emitter)
add_public_tablegen_target(CSKYCommonTableGen)
add_llvm_target(CSKYCodeGen
  CSKYTargetMachine.cpp

  LINK_COMPONENTS
  Core
  CodeGen
  CSKYInfo
  Support
  Target

  ADD_TO_COMPONENT
  CSKY
  )
add_subdirectory(TargetInfo)
add_subdirectory(MCTargetDesc)
```

上述代码等价于以下代码



CMakeLists.txt

```cmake
set(LLVM_TARGET_DEFINITIONS CSKY.td)

tablegen(LLVM CSKYGenRegisterInfo.inc -gen-register-info)
tablegen(LLVM CSKYGenInstrInfo.inc -gen-instr-info)
tablegen(LLVM CSKYGenMCCodeEmitter.inc -gen-emitter)                                                                                                                                                            

add_public_tablegen_target(CSKYCommonTableGen)

add_llvm_target(CSKYCodeGen
  CSKYTargetMachine.cpp
  )

add_subdirectory(TargetInfo)
add_subdirectory(MCTargetDesc)
```



LLVMBuild.txt

```c++
;===- ./lib/Target/LJMicro/LLVMBuild.txt -------------------------*- Conf -*--===;
;
;                     The LLVM Compiler Infrastructure
;
; This file is distributed under the University of Illinois Open Source
; License. See LICENSE.TXT for details.
;
;===------------------------------------------------------------------------===;
;
; This is an LLVMBuild description file for the components in this subdirectory.
;
; For more information on the LLVMBuild system, please see:
;
;   http://llvm.org/docs/LLVMBuild.html
;
;===------------------------------------------------------------------------===;

[common]
subdirectories = TargetInfo M

[component_0]
type = TargetGroup
name = CSKY
parent = Target

[component_1]
type = Library
name = CSKYCodeGen
parent = CSKY
required_libraries = Core CodeGen CSKYInfo Support Target
add_to_library_groups = CSKY

```

