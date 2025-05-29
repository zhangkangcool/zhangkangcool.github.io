CodeGen/TargetPassConfig.cpp



```
addVerifyPass
```





IBM的pass是否都未加verify



`CodeGen/TargetPassConfig.cpp`

```c++
589 void TargetPassConfig::printAndVerify(const std::string &Banner) {
 590   addPrintPass(Banner);
 591   addVerifyPass(Banner);
 592 }
 593
...
 599 void TargetPassConfig::addVerifyPass(const std::string &Banner) {
 600   bool Verify = VerifyMachineCode == cl::BOU_TRUE;
 601 #ifdef EXPENSIVE_CHECKS
 602   if (VerifyMachineCode == cl::BOU_UNSET)
 603     Verify = TM->isMachineVerifierClean();
 604 #endif
 605   if (Verify)
 606     PM->add(createMachineVerifierPass(Banner));
 607 }
 608
```



```c++
519 void TargetPassConfig::addPass(Pass *P, bool verifyAfter, bool printAfter) {
...
 532   if (Started && !Stopped) {
 533     std::string Banner;
 534     // Construct banner message before PM->add() as that may delete the pass.
 535     if (AddingMachinePasses && (printAfter || verifyAfter))
 536       Banner = std::string("After ") + std::string(P->getPassName());
 537     PM->add(P);
 538     if (AddingMachinePasses) {
 539       if (printAfter)
 540         addPrintPass(Banner);
 541       if (verifyAfter)
 542         addVerifyPass(Banner);
 543     }
 544
 545     // Add the passes after the pass P if there is any.
 546     for (auto IP : Impl->InsertedPasses) {
 547       if (IP.TargetPassID == PassID)
 548         addPass(IP.getInsertedPass(), IP.VerifyAfter, IP.PrintAfter);
 549     }
 550   } else {
 551     delete P;
 552   }
...
 561 }
```





https://github.ibm.com/compiler/llvm-project/commit/941f20c3bd22f2b55815c6d5aa7914d9385fb3b3#diff-61e4aba3093b149da345f0c67c8e6b1e

https://reviews.llvm.org/rL228079

```
 // The machine code verifier is enabled from LLVMTargetMachine.cpp with the
 // command-line option -verify-machineinstrs, or by defining the environment
 // variable LLVM_VERIFY_MACHINEINSTRS to the name of a file that will receive
 // the verifier errors.


https://github.ibm.com/compiler/llvm-project/commit/941f20c3bd22f2b55815c6d5aa7914d9385fb3b3#diff-61e4aba3093b149da345f0c67c8e6b1e
在这个patch里，原来有的宏`LLVM_VERIFY_MACHINEINSTRS`被删除了，这个patch是2020.01.27的。

在2015年的patch: https://reviews.llvm.org/rL228079 ， 可以设置系统环境变量`LLVM_ENABLE_MACHINE_VERIFIER` ，这样调用llc的时候，就会自动给llc 加上-verify-machineinstrs ，不管你是否在case上加 了-verify-machineinstrs  这个选项，都会调用 verification。

export LLVM_ENABLE_MACHINE_VERIFIER=1
./CMakeCache.txt:LLVM_ENABLE_EXPENSIVE_CHECKS:BOOL=OFF
```



```
export LLVM_ENABLE_MACHINE_VERIFIER=1
cd ~/issue_test/6378_verify/log/all_enable_macrho_277/277
./two_address.py
```





`CodeGen/LLVMTargetMachine.cpp`

```c++
 96 /// addPassesToX helper drives creation and initialization of TargetPassConfig.
 97 static TargetPassConfig *
 98 addPassesToGenerateCode(LLVMTargetMachine &TM, PassManagerBase &PM,
 99                         bool DisableVerify,
100                         MachineModuleInfoWrapperPass &MMIWP) {
101   // Targets may override createPassConfig to provide a target-specific
102   // subclass.
103   TargetPassConfig *PassConfig = TM.createPassConfig(PM);
104   // Set PassConfig options provided by TargetMachine.
105   PassConfig->setDisableVerify(DisableVerify);
106   PM.add(PassConfig);
107   PM.add(&MMIWP);
108
109   if (PassConfig->addISelPasses())
110     return nullptr;
111   PassConfig->addMachinePasses();
112   PassConfig->setInitialized();
113   return PassConfig;
114 }
115
```





`./include/llvm/CodeGen/TargetPassConfig.h`

```c++
426   /// Add a CodeGen pass at this point in the pipeline after checking overrides.
427   /// Return the pass that was added, or zero if no pass was added.
428   /// @p printAfter    if true and adding a machine function pass add an extra
429   ///                  machine printer pass afterwards
430   /// @p verifyAfter   if true and adding a machine function pass add an extra
431   ///                  machine verification pass afterwards.
432   AnalysisID addPass(AnalysisID PassID, bool verifyAfter = true,
433                      bool printAfter = true);
434
435   /// Add a pass to the PassManager if that pass is supposed to be run, as
436   /// determined by the StartAfter and StopAfter options. Takes ownership of the
437   /// pass.
438   /// @p printAfter    if true and adding a machine function pass add an extra
439   ///                  machine printer pass afterwards
440   /// @p verifyAfter   if true and adding a machine function pass add an extra
441   ///                  machine verification pass afterwards.
442   void addPass(Pass *P, bool verifyAfter = true, bool printAfter = true);
```





 `addISelPasses`                              

​                  | call

`addCoreISelPasses`

​                  | call

`printAndVerify` --call--> `addVerifyPass` --call--> `createMachineVerifierPass`

​                  |                                       / call           

​                  |                 `addPass`

​                  |                   /                    

​                  |              /                          

​          `addPrintPass`       











`addISelPasses`                              

​                  | call

`addCoreISelPasses`                    `addPass`

​                  | call                                             | call

`printAndVerify` --call--> `addVerifyPass` --call--> `createMachineVerifierPass`

​        

CHECK是不是我的这个选项没开，直接测isverify变量。



   



lib/CodeGen/TargetPassConfig.cpp

Codegen

```
CodeGen/TargetPassConfig.cpp:    addPass(&LocalStackSlotAllocationID, false);
CodeGen/TargetPassConfig.cpp:      addPass(createGCInfoPrinter(dbgs()), false, false);
CodeGen/TargetPassConfig.cpp:  addPass(&FEntryInserterID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&XRayInstrumentationID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&PatchableFunctionID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&FuncletLayoutID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&StackMapLivenessID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&LiveDebugValuesID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&OptimizePHIsID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&StackColoringID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&LocalStackSlotAllocationID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&EarlyMachineLICMID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&MachineCSEID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&PHIEliminationID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&TwoAddressInstructionPassID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&DetectDeadLanesID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&ProcessImplicitDefsID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&LiveVariablesID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&MachineLoopInfoID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&PHIEliminationID, false);
CodeGen/TargetPassConfig.cpp:    addPass(&LiveIntervalsID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&TwoAddressInstructionPassID, false);
CodeGen/TargetPassConfig.cpp:  addPass(&GCMachineCodeAnalysisID, false);
```



Other arch

```
Target/Hexagon/HexagonTargetMachine.cpp:  addPass(createHexagonPacketizer(NoOpt), false);
Target/Hexagon/HexagonTargetMachine.cpp:    addPass(createHexagonVectorPrint(), false);
Target/Hexagon/HexagonTargetMachine.cpp:  addPass(createHexagonCallFrameInformation(), false);
Target/NVPTX/NVPTXTargetMachine.cpp:  addPass(createNVPTXPrologEpilogPass(), false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(createAMDGPUISelDag(&getAMDGPUTargetMachine(), getOptLevel()), false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(createR600EmitClauseMarkers(), false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:    addPass(&IfConverterID, false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(createR600ClauseMergePass(), false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(createAMDGPUCFGStructurizerPass(), false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(createR600ExpandSpecialInstrsPass(), false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(&FinalizeMachineBundlesID, false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(createR600Packetizer(), false);
Target/AMDGPU/AMDGPUTargetMachine.cpp:  addPass(createR600ControlFlowFinalizer(), false);
Target/SystemZ/SystemZTargetMachine.cpp:    addPass(createSystemZShortenInstPass(getSystemZTargetMachine()), false);
Target/SystemZ/SystemZTargetMachine.cpp:    addPass(createSystemZElimComparePass(getSystemZTargetMachine()), false);
Target/MSP430/MSP430TargetMachine.cpp:  addPass(createMSP430BranchSelectionPass(), false);
Target/XCore/XCoreTargetMachine.cpp:  addPass(createXCoreFrameToArgsOffsetEliminationPass(), false);
```



分析pass是否一定是false







https://reviews.llvm.org/rL260806

https://reviews.llvm.org/rL7954

```
if (getPPCTargetMachine().getRelocationModel() == Reloc::PIC_) {
    // FIXME: LiveVariables should not be necessary here!
    // PPCTLSDYnamicCallPass uses LiveIntervals which previously dependet on
    // LiveVariables. This (unnecessary) dependency has been removed now,
    // however a stage-2 clang build fails without LiveVariables computed here.
    addPass(&LiveVariablesID, false);
    addPass(createPPCTLSDynamicCallPass());
  }
```





Enable all(don't use verify-machineinstrs)

```c++
 599 void TargetPassConfig::addVerifyPass(const std::string &Banner) {
 600   bool Verify = VerifyMachineCode == cl::BOU_TRUE;
 601 #ifdef EXPENSIVE_CHECKS
 602   if (VerifyMachineCode == cl::BOU_UNSET)
 603     Verify = TM->isMachineVerifierClean();
 604 #endif
 605 //  if (Verify)
 606     PM->add(createMachineVerifierPass(Banner));
 607 }
 608
```



利用`EXPENSIVE_CHECKS`来控制PPC，全对

```
./CMakeCache.txt:LLVM_ENABLE_EXPENSIVE_CHECKS:BOOL=OFF


// The machine code verifier is enabled from LLVMTargetMachine.cpp with the
 // command-line option -verify-machineinstrs, or by defining the environment
 // variable LLVM_VERIFY_MACHINEINSTRS to the name of a file that will receive
 // the verifier errors.


https://github.ibm.com/compiler/llvm-project/commit/941f20c3bd22f2b55815c6d5aa7914d9385fb3b3#diff-61e4aba3093b149da345f0c67c8e6b1e
在这个patch里，原来有的宏`LLVM_VERIFY_MACHINEINSTRS`被删除了，这个patch是2020.01.27的。

在2015年的patch: https://reviews.llvm.org/rL228079 ， 可以设置系统环境变量`LLVM_ENABLE_MACHINE_VERIFIER` ，这样调用llc的时候，就会自动给llc 加上-verify-machineinstrs ，不管你是否在case上加 了-verify-machineinstrs  这个选项，都会调用 verification。

export LLVM_ENABLE_MACHINE_VERIFIER=1
./CMakeCache.txt:LLVM_ENABLE_EXPENSIVE_CHECKS:BOOL=OFF
```



Comment need to fix`LLVM_VERIFY_MACHINEINSTRS`

Blow is the old method, hs been removed.

```
00066 static cl::opt<bool> VerifyMachineCode("verify-machineinstrs", cl::Hidden,
00067     cl::desc("Verify generated machine code"),
00068     cl::init(getenv("LLVM_VERIFY_MACHINEINSTRS")!=NULL));
```





~/llvm/llvm/lib/CodeGen/TargetPassConfig.cpp

```
commenting out the "#ifdef EXPENSIVE_CHECKS"
```

