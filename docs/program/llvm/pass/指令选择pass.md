<h1 align="center">指令选择pass</h1>




### 1. TargetPassConfig.h

```c++
  /// High level function that adds all passes necessary to go from llvm IR
  /// representation to the MI representation.
  /// Adds IR based lowering and target specific optimization passes and finally
  /// the core instruction selection passes.
  /// \returns true if an error occurred, false otherwise.
  bool addISelPasses();
```





### 2. LLVMTargetMachine.cpp

```c++
/// addPassesToX helper drives creation and initialization of TargetPassConfig.
static TargetPassConfig *
addPassesToGenerateCode(LLVMTargetMachine &TM, PassManagerBase &PM,
                        bool DisableVerify,
                        MachineModuleInfoWrapperPass &MMIWP) {
  // Targets may override createPassConfig to provide a target-specific
  // subclass.
  TargetPassConfig *PassConfig = TM.createPassConfig(PM);
  // Set PassConfig options provided by TargetMachine.
  PassConfig->setDisableVerify(DisableVerify);
  PM.add(PassConfig);
  PM.add(&MMIWP);
z
  if (PassConfig->addISelPasses())   // 添加此pass
    return nullptr;
  PassConfig->addMachinePasses();
  PassConfig->setInitialized();
  return PassConfig;
}
```



`addPassesToGenerateCode`会在需要的地方被调用



### 3. TargetPassConfig.cpp

```c++
bool TargetPassConfig::addISelPasses() {
  if (TM->useEmulatedTLS())
    addPass(createLowerEmuTLSPass());

  addPass(createPreISelIntrinsicLoweringPass());
  PM->add(createTargetTransformInfoWrapperPass(TM->getTargetIRAnalysis()));
  addPass(createExpandLargeDivRemPass());
  addPass(createExpandLargeFpConvertPass());
  addIRPasses();
  addCodeGenPrepare();
  addPassesToHandleExceptions();
  addISelPrepare();

  return addCoreISelPasses();
}
```

