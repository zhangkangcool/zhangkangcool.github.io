<h1 align="center">PassConfig</h1>


各种Pass

https://llvm.org/docs/Passes.html





### 得到具体做了哪些优化

`lib/CodeGen/TargetPassConfig.cpp`

```cpp
 514 void TargetPassConfig::addPass(Pass *P, bool verifyAfter, bool printAfter) {
     ...
 528     std::string Banner;
 529     dbgs() << "\n" << __LINE__ << " zhangkang " << std::string(P->getPassName());
 530     // Construct banner message before PM->add() as that may delete the pass.
 531     if (AddingMachinePasses && (printAfter || verifyAfter))
 532       Banner = std::string("After ") + std::string(P->getPassName());
 533     PM->add(P);
 534     dbgs() << "\n" << __LINE__ << " zhangkang " << Banner;
 535     if (AddingMachinePasses) {
 536       if (printAfter)
 537         addPrintPass(Banner);
 538       if (verifyAfter)
 539         addVerifyPass(Banner);
 540     }
     }
```





下面是其中的一个调用线索，其它的pass可能有其它的调用线索

`LLVMTargetMachine::addPassesToEmitFile -> addPassesToGenerateCode -> TargetPassConfig::addMachinePasses` 



`addPassesToEmitFile`被多个地方使用，比如`llc.cpp`。



LLVMTargetMachine.cpp

```c++
bool LLVMTargetMachine::addPassesToEmitFile(PassManagerBase &PM,
                                            raw_pwrite_stream &Out,
                                            raw_pwrite_stream *DwoOut,
                                            CodeGenFileType FileType,
                                            bool DisableVerify,
                                            MachineModuleInfo *MMI) {
  // Add common CodeGen passes.
  if (!MMI)
    MMI = new MachineModuleInfo(this);
  TargetPassConfig *PassConfig =
      addPassesToGenerateCode(*this, PM, DisableVerify, *MMI);  // 往下看
  if (!PassConfig)
    return true;

  if (!TargetPassConfig::willCompleteCodeGenPipeline()) {
    if (this->getTargetTriple().isOSAIX()) {
      // On AIX, we might manifest MCSymbols during SDAG lowering. For MIR
      // testing to be meaningful, we need to ensure that the symbols created
      // are MCSymbolXCOFF variants, which requires that
      // the TargetLoweringObjectFile instance has been initialized.
      MCContext &Ctx = MMI->getContext();
      const_cast<TargetLoweringObjectFile &>(*this->getObjFileLowering())
          .Initialize(Ctx, *this);
    }
    PM.add(createPrintMIRPass(Out));
  } else if (addAsmPrinter(PM, Out, DwoOut, FileType, MMI->getContext()))
    return true;

  PM.add(createFreeMachineFunctionPass());
  return false;
}
```



LLVMTargetMachine.cpp

```c++
static TargetPassConfig *
addPassesToGenerateCode(LLVMTargetMachine &TM, PassManagerBase &PM,
                        bool DisableVerify, MachineModuleInfo &MMI) {
  // Targets may override createPassConfig to provide a target-specific
  // subclass.
  TargetPassConfig *PassConfig = TM.createPassConfig(PM);
  // Set PassConfig options provided by TargetMachine.
  PassConfig->setDisableVerify(DisableVerify);
  PM.add(PassConfig);
  PM.add(&MMI);

  if (PassConfig->addISelPasses())
    return nullptr;
  PassConfig->addMachinePasses();   --> 添加MachinePass
  PassConfig->setInitialized();
  return PassConfig;
}
```





`addMachinePasses`中可以看到所有MachinePass的添加执行顺序

`TargetPassConfig.cpp`

```cpp
 861 void TargetPassConfig::addMachinePasses() {
 862   AddingMachinePasses = true;
 863
 864   // Insert a machine instr printer pass after the specified pass.
 865   StringRef PrintMachineInstrsPassName = PrintMachineInstrs.getValue();
 866   if (!PrintMachineInstrsPassName.equals("") &&
 867       !PrintMachineInstrsPassName.equals("option-unspecified")) {
 868     if (const PassInfo *TPI = getPassInfo(PrintMachineInstrsPassName)) {
 869       const PassRegistry *PR = PassRegistry::getPassRegistry();
 870       const PassInfo *IPI = PR->getPassInfo(StringRef("machineinstr-printer"));
 871       assert(IPI && "failed to get \"machineinstr-printer\" PassInfo!");
 872       const char *TID = (const char *)(TPI->getTypeInfo());
 873       const char *IID = (const char *)(IPI->getTypeInfo());
 874       insertPass(TID, IID);
 875     }
 876   }
 877
 878   // Print the instruction selected machine code...
 879   printAndVerify("After Instruction Selection");
 880
 881   // Expand pseudo-instructions emitted by ISel.
 882   addPass(&ExpandISelPseudosID);
 883
 884   // Add passes that optimize machine instructions in SSA form.
 885   if (getOptLevel() != CodeGenOpt::None) {
 886     addMachineSSAOptimization();
 887   } else {
 888     // If the target requests it, assign local variables to stack slots relative
 889     // to one another and simplify frame index references where possible.
 890     addPass(&LocalStackSlotAllocationID, false);
 891   }
     ...
 958   addPreEmitPass();
     ...
```





### TargetPassconfig

Pass由`TargetPassConfig`类进行管理

`./include/llvm/CodeGen/TargetPassConfig.h`

下面的这些Virtual空方法，子类在需要时对其进行覆盖。基类会在`addMaachinePasses`对这些Virtual方法进行调用，以擦Pass的添加顺序及流程。

```cpp
 78 /// Target-Independent Code Generator Pass Configuration Options.
 79 ///
 80 /// This is an ImmutablePass solely for the purpose of exposing CodeGen options
 81 /// to the internals of other CodeGen passes.
 82 class TargetPassConfig : public ImmutablePass {
 83 private:
 84   PassManagerBase *PM = nullptr;
     
 347   /// All passes added here should preserve the MachineDominatorTree,
348   /// MachineLoopInfo, and MachineTraceMetrics analyses.
349   virtual bool addILPOpts() {
350     return false;
351   }
352
353   /// This method may be implemented by targets that want to run passes
354   /// immediately before register allocation.
355   virtual void addPreRegAlloc() { }
356
357   /// createTargetRegisterAllocator - Create the register allocator pass for
358   /// this target at the current optimization level.
359   virtual FunctionPass *createTargetRegisterAllocator(bool Optimized);
360
361   /// addFastRegAlloc - Add the minimum set of target-independent passes that
362   /// are required for fast register allocation.
363   virtual void addFastRegAlloc(FunctionPass *RegAllocPass);
364
365   /// addOptimizedRegAlloc - Add passes related to register allocation.
366   /// LLVMTargetMachine provides standard regalloc passes for most targets.
367   virtual void addOptimizedRegAlloc(FunctionPass *RegAllocPass);
368
369   /// addPreRewrite - Add passes to the optimized register allocation pipeline
370   /// after register allocation is complete, but before virtual registers are
371   /// rewritten to physical registers.
372   ///
373   /// These passes must preserve VirtRegMap and LiveIntervals, and when running
374   /// after RABasic or RAGreedy, they should take advantage of LiveRegMatrix.
375   /// When these passes run, VirtRegMap contains legal physreg assignments for
376   /// all virtual registers.
377   virtual bool addPreRewrite() {
378     return false;
379   }
380
381   /// This method may be implemented by targets that want to run passes after
382   /// register allocation pass pipeline but before prolog-epilog insertion.
383   virtual void addPostRegAlloc() { }
384
385   /// Add passes that optimize machine instructions after register allocation.
386   virtual void addMachineLateOptimization();
387
388   /// This method may be implemented by targets that want to run passes after
389   /// prolog-epilog insertion and before the second instruction scheduling pass.
390   virtual void addPreSched2() { }
391
392   /// addGCPasses - Add late codegen passes that analyze code for garbage
393   /// collection. This should return true if GC info should be printed after
394   /// these passes.
395   virtual bool addGCPasses();
396
397   /// Add standard basic block placement passes.
398   virtual void addBlockPlacement();
399
400   /// This pass may be implemented by targets that want to run passes
401   /// immediately before machine code is emitted.
402   virtual void addPreEmitPass() { }
403
404   /// Targets may add passes immediately before machine code is emitted in this
405   /// callback. This is called even later than `addPreEmitPass`.
406   // FIXME: Rename `addPreEmitPass` to something more sensible given its actual
407   // position and remove the `2` suffix here as this callback is what
408   // `addPreEmitPass` *should* be but in reality isn't.
409   virtual void addPreEmitPass2() {}
```



每个`arch`可以再继续出自己的`TargetPassConfg`对一些和`arch`的Pass进行管理

`./lib/Target/PowerPC/PPCTargetMachine.cpp`

```cpp
310 /// PPC Code Generator Pass Configuration Options.
311 class PPCPassConfig : public TargetPassConfig {
312 public:
313   PPCPassConfig(PPCTargetMachine &TM, PassManagerBase &PM)
314     : TargetPassConfig(TM, PM) {
315     // At any optimization level above -O0 we use the Machine Scheduler and not
316     // the default Post RA List Scheduler.
317     if (TM.getOptLevel() != CodeGenOpt::None)
318       substitutePass(&PostRASchedulerID, &PostMachineSchedulerID);
319   }
320
321   PPCTargetMachine &getPPCTargetMachine() const {
322     return getTM<PPCTargetMachine>();
323   }
324
325   void addIRPasses() override;
326   bool addPreISel() override;
327   bool addILPOpts() override;
328   bool addInstSelector() override;
329   void addMachineSSAOptimization() override;
330   void addPreRegAlloc() override;
331   void addPreSched2() override;
332   void addPreEmitPass() override;
333 };
```

上述的几个add函数是基类中的方法，对其进行覆盖。

```shell
457 void PPCPassConfig::addPreEmitPass() {
458   addPass(createPPCPreEmitPeepholePass());
459   addPass(createPPCExpandISELPass());
460
461   if (getOptLevel() != CodeGenOpt::None)
462     addPass(createPPCEarlyReturnPass(), false);
463   // Must run branch selection immediately preceding the asm printer.
464   addPass(createPPCBranchSelectionPass(), false);
465 }
```



### Add the pass

##### 1 通过公有方法`addPass`对Pass进行添加。

`./lib/CodeGen/StackMapLivenessAnalysis.cpp`

```cpp
 49 class StackMapLiveness : public MachineFunctionPass {
 50   const TargetRegisterInfo *TRI;
 51   LivePhysRegs LiveRegs;
 52
 53 public:
 54   static char ID;
```



```cpp
./lib/CodeGen/TargetPassConfig.cpp:  addPass(&StackMapLivenessID, false);
```

所有的pass都有一`getPassName()`的函数。

````cpp
class FunctionPass : public Pass
class MachineFunctionPass : public FunctionPass
class ModulePass : public Pass
````



##### 2通过覆盖`virtual PPCPassConfig::add____`添加和arch相关的Pass

这些virtual方法中，还是会调用addPass()函数。

`lib/Target/PowerPC/PPCBranchSelector.cpp`

```cpp
 39 namespace {
 40   struct PPCBSel : public MachineFunctionPass {
 41     static char ID;
 42     PPCBSel() : MachineFunctionPass(ID) {
 43       initializePPCBSelPass(*PassRegistry::getPassRegistry());
 44     }
 45
 46     // The sizes of the basic blocks in the function (the first
 47     // element of the pair); the second element of the pair is the amount of the
 48     // size that is due to potential padding.
 49     std::vector<std::pair<unsigned, unsigned>> BlockSizes;
 50
 51     bool runOnMachineFunction(MachineFunction &Fn) override;
 52
 53     MachineFunctionProperties getRequiredProperties() const override {
 54       return MachineFunctionProperties().set(
 55           MachineFunctionProperties::Property::NoVRegs);
 56     }
 57
 58     StringRef getPassName() const override { return "PowerPC Branch Selector"; }
 59   };
 60   char PPCBSel::ID = 0;
 61 }
 62
 63 INITIALIZE_PASS(PPCBSel, "ppc-branch-select", "PowerPC Branch Selector",
 64                 false, false)
 65
 66 /// createPPCBranchSelectionPass - returns an instance of the Branch Selection
 67 /// Pass
 68 ///
 69 FunctionPass *llvm::createPPCBranchSelectionPass() {
 70   return new PPCBSel();
 71 }
 72
```

此处通过`createPPCBranchSelectionPass()`对`PPCBSel`进行了封装。

`./lib/Target/PowerPC/PPCTargetMachine.cpp`添加该Pass。

```cpp
457 void PPCPassConfig::addPreEmitPass() {
458   addPass(createPPCPreEmitPeepholePass());
459   addPass(createPPCExpandISELPass());
460
461   if (getOptLevel() != CodeGenOpt::None)
462     addPass(createPPCEarlyReturnPass(), false);
463   // Must run branch selection immediately preceding the asm printer.
464   addPass(createPPCBranchSelectionPass(), false);
465 }
```

addPass()是添加Pass时，必须调用的方法。所以，可以在里面输出所使用的Pass名字。



# 可用于debug的pass名字 stop-after等使用

`lib/IR/PassRegistry.cpp`

For one opt level, if your passname is not in below, you will get 

`LLVM ERROR: "ppc-early-ret" pass is not registered.`

You can use the PassName to get the `DEBYG_TYPE`, it the passname `stop-after` needed.

```cpp
#include "llvm/Support/Debug.h" 
19 #include "llvm/Support/raw_ostream.h"

 
 55 //===----------------------------------------------------------------------===//
 56 // Pass Registration mechanism
 57 //
 58
 59 void PassRegistry::registerPass(const PassInfo &PI, bool ShouldFree) {
 60   sys::SmartScopedWriter<true> Guard(Lock);
 61   bool Inserted =
 62       PassInfoMap.insert(std::make_pair(PI.getTypeInfo(), &PI)).second;
 63   assert(Inserted && "Pass registered multiple times!");
 64   (void)Inserted;
 65   PassInfoStringMap[PI.getPassArgument()] = &PI;
 66   dbgs() << "PassName = " << PI.getPassName() << "\n";
 67   // Notify any listeners.
 68   for (auto *Listener : Listeners)
 69     Listener->passRegistered(&PI);
 70
 71   if (ShouldFree)
 72     ToFree.push_back(std::unique_ptr<const PassInfo>(&PI));
 73 }
 74
```





## addPass

```shell
./lib/Transforms/IPO/PassManagerBuilder.cpp
Passes/PassBuilder.cpp
llvm/include/llvm/LinkAllPasses.h

./lib/Target/PowerPC/PPCTargetMachine.cpp

./lib/CodeGen/EarlyIfConversion.cpp:char &llvm::EarlyIfConverterID = EarlyIfConverter::ID;
./lib/Target/PowerPC/PPCTargetMachine.cpp:  addPass(&EarlyIfConverterID);
```



