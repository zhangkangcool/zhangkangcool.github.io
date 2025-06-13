<h1 align="center">禁用pass</h1>




#  1. 以下是禁用llvm/lib/CodeGen下的pass



这里以 DisablePostRAMachineSink为例



以下代码来自于最新的llvm，在llvm9中未找到该函数，llvm9的对应代码在`overridePass()`中。

```c++
void llvm::registerCodeGenCallback(PassInstrumentationCallbacks &PIC,
                                   LLVMTargetMachine &LLVMTM) {

  // Register a callback for disabling passes.
  PIC.registerShouldRunOptionalPassCallback([](StringRef P, Any) {

#define DISABLE_PASS(Option, Name)                                             \
  if (Option && P.contains(#Name))                                             \
    return false;
    DISABLE_PASS(DisableBlockPlacement, MachineBlockPlacementPass)
    DISABLE_PASS(DisableBranchFold, BranchFolderPass)
    DISABLE_PASS(DisableCopyProp, MachineCopyPropagationPass)
    DISABLE_PASS(DisableEarlyIfConversion, EarlyIfConverterPass)
    DISABLE_PASS(DisableEarlyTailDup, EarlyTailDuplicatePass)
    DISABLE_PASS(DisableMachineCSE, MachineCSEPass)
    DISABLE_PASS(DisableMachineDCE, DeadMachineInstructionElimPass)
    DISABLE_PASS(DisableMachineLICM, EarlyMachineLICMPass)
    DISABLE_PASS(DisableMachineSink, MachineSinkingPass)
    DISABLE_PASS(DisablePostRAMachineLICM, MachineLICMPass)
    DISABLE_PASS(DisablePostRAMachineSink, PostRAMachineSinkingPass)
    DISABLE_PASS(DisablePostRASched, PostRASchedulerPass)
    DISABLE_PASS(DisableSSC, StackSlotColoringPass)
    DISABLE_PASS(DisableTailDuplicate, TailDuplicatePass)

    return true;
  });

  registerPartialPipelineCallback(PIC, LLVMTM);
}

```





定义选项

```c++
static cl::opt<bool> DisableEarlyIfConversion("disable-early-ifcvt", cl::Hidden,
    cl::desc("Disable Early If-conversion"));
static cl::opt<bool> DisableMachineLICM("disable-machine-licm", cl::Hidden,
    cl::desc("Disable Machine LICM"));
static cl::opt<bool> DisableMachineCSE("disable-machine-cse", cl::Hidden,
    cl::desc("Disable Machine Common Subexpression Elimination"));
static cl::opt<cl::boolOrDefault> OptimizeRegAlloc(
    "optimize-regalloc", cl::Hidden,
    cl::desc("Enable optimized register allocation compilation path."));
static cl::opt<bool> DisablePostRAMachineLICM("disable-postra-machine-licm",
    cl::Hidden,
    cl::desc("Disable Machine LICM"));
static cl::opt<bool> DisableMachineSink("disable-machine-sink", cl::Hidden,
    cl::desc("Disable Machine Sinking"));
static cl::opt<bool> DisablePostRAMachineSink("disable-postra-machine-sink",
    cl::Hidden,
    cl::desc("Disable PostRA Machine Sinking"));
```







# 2.  以下是禁用llvm/lib/Transforms下的pass





```c++
static cl::opt<bool> DisableSeparateConstOffsetFromGEP(
    "disable-separate-const-offset-from-gep", cl::init(false),
    cl::desc("Do not separate the constant offset from a GEP instruction"),
    cl::Hidden);
```





```c++
bool SeparateConstOffsetFromGEPLegacyPass::runOnFunction(Function &F) {
  if (skipFunction(F))
    return false;
  auto *DT = &getAnalysis<DominatorTreeWrapperPass>().getDomTree();
  auto *LI = &getAnalysis<LoopInfoWrapperPass>().getLoopInfo();
  auto *TLI = &getAnalysis<TargetLibraryInfoWrapperPass>().getTLI(F);
  auto GetTTI = [this](Function &F) -> TargetTransformInfo & {
    return this->getAnalysis<TargetTransformInfoWrapperPass>().getTTI(F);
  };
  SeparateConstOffsetFromGEP Impl(DT, LI, TLI, GetTTI, LowerGEP);
  return Impl.run(F);
}

bool SeparateConstOffsetFromGEP::run(Function &F) {
  if (DisableSeparateConstOffsetFromGEP)   // 这里直接跳过此函数
    return false;

  DL = &F.getParent()->getDataLayout();
  bool Changed = false;
  for (BasicBlock &B : F) {
    if (!DT->isReachableFromEntry(&B))
      continue;

    for (Instruction &I : llvm::make_early_inc_range(B))
      if (GetElementPtrInst *GEP = dyn_cast<GetElementPtrInst>(&I))
        Changed |= splitGEP(GEP);
    // No need to split GEP ConstantExprs because all its indices are constant
    // already.
  }

  Changed |= reuniteExts(F);

  if (VerifyNoDeadCode)
    verifyNoDeadCode(F);

  return Changed;
}
```

