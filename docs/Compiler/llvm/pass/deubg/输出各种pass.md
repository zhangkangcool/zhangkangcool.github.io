<h1 align="center">输出各种pass</h1>


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



```shell
#define DEBUG_TYPE "shrink-wrap"

STATISTIC(NumFunc, "Number of functions");
STATISTIC(NumCandidates, "Number of shrink-wrapping candidates");
STATISTIC(NumCandidatesDropped,
          "Number of shrink-wrapping candidates dropped because of frequency");

static cl::opt<cl::boolOrDefault>
EnableShrinkWrapOpt("enable-shrink-wrap", cl::Hidden,
                    cl::desc("enable the shrink-wrapping pass"));
```

`shrink-wrap` in `DEBUG_TYPE` can use in `-debug-only=shrink-wrap`, or `-stop-after=shrink-wrap`

`-enable-shrink-wrap=false`

`-debug-only=isel` `-debug-only=pipeliner` `-debug-only=machine-scheduler` `debug-only=legalize-types` `-debug-only=legalize-types` `-debug-only=codegen`

One output

```asm
PassName = Convert i1 constants to i32/i64 if they are returned
PassName = PowerPC Expand ISEL Generation
PassName = PowerPC Pre-Emit Peephole
PassName = Assumption Cache Tracker
PassName = Dominator Tree Construction
PassName = Target Library Information
PassName = Basic Alias Analysis (stateless AA impl)
PassName = Inclusion-Based CFL Alias Analysis
PassName = Unification-Based CFL Alias Analysis
PassName = External Alias Analysis
PassName = CallGraph Construction
PassName = Globals Alias Analysis
PassName = ObjC-ARC-Based Alias Analysis
PassName = Natural Loop Information
PassName = Scalar Evolution Analysis
PassName = ScalarEvolution-based Alias Analysis
PassName = Scoped NoAlias Alias Analysis
PassName = Type-Based Alias Analysis
PassName = Function Alias Analysis Results
PassName = MachineDominator Tree Construction
PassName = Slot index numbering
PassName = Live Interval Analysis
PassName = PowerPC TLS Dynamic Call Fixup
PassName = PowerPC MI Peephole Optimization
PassName = Print module to stderr
PassName = Print function to stderr
PassName = Print BB to stderr
PassName = Safepoint IR Verifier
PassName = Module Verifier
PassName = Expand Atomic instructions
PassName = Control Flow Optimizer
PassName = Branch relaxation pass
PassName = Check CFA info and insert CFI instructions if needed
PassName = Profile summary info
PassName = Optimize for code generation
PassName = Remove dead machine instructions
PassName = Detect Dead Lanes
PassName = Target Pass Configuration
PassName = Target Transform Information
PassName = Prepare DWARF exceptions
PassName = Machine Branch Probability Analysis
PassName = Machine Natural Loop Construction
PassName = Machine Branch Probability Analysis
PassName = Machine Natural Loop Construction
PassName = Machine Trace Metrics
PassName = Early If Converter
PassName = Early Machine Loop Invariant Code Motion
PassName = Early Tail Duplication
PassName = Expand ISel Pseudo-instructions
PassName = Expand memcmp() to load/stores

PassName = Post-RA pseudo instruction expansion pass

PassName = Insert fentry calls
PassName = Finalize machine instruction bundles
PassName = Contiguously Lay Out Funclets
PassName = Analyze Machine Code For Garbage Collection
PassName = Create Garbage Collector Module Metadata
PassName = If Converter
PassName = Implicit null checks
PassName = Expand indirectbr instructions
PassName = Memory SSA
PassName = Combine interleaved loads into wide loads and shufflevector instructions
PassName = Lower interleaved memory accesses to target specific intrinsics
PassName = Live DEBUG_VALUE analysis
PassName = Debug Variable Analysis
PassName = Live Range Shrink Pass
PassName = Live Stack Slot Analysis
PassName = Remove unreachable machine basic blocks
PassName = Live Variable Analysis
PassName = Local Stack Slot Allocation
PassName = GC Lowering
PassName = Rename Register Operands Canonically
PassName = Machine Block Frequency Analysis
PassName = MachinePostDominator Tree Construction
PassName = Branch Probability Basic Block Placement
PassName = Basic Block Placement Stats
PassName = Machine Common Subexpression Elimination
PassName = Machine InstCombiner
PassName = Machine Copy Propagation Pass
PassName = Machine Function Printer
PassName = Machine Loop Invariant Code Motion
PassName = Machine Module Information
PassName = Lazy Machine Block Frequency Analysis
PassName = Machine Optimization Remark Emitter
PassName = Machine Function Outliner
PassName = Machine Optimization Remark Emitter
PassName = Machine Function Outliner
PassName = Modulo Software Pipelining
PassName = Machine Dominance Frontier Construction
PassName = Detect single entry single exit regions
PassName = Machine Instruction Scheduler
PassName = Machine code sinking
PassName = Verify generated machine code
PassName = Optimize machine instruction PHIs
PassName = Prologue/Epilogue Insertion & Frame Finalization
PassName = Eliminate PHI nodes for register allocation
PassName = Implement the 'patchable-function' attribute
PassName = Peephole Optimizations
PassName = PostRA Machine Instruction Scheduler
PassName = Post RA hazard recognizer
PassName = PostRA Machine Sink
PassName = Post RA top-down list latency scheduler
PassName = Pre-ISel Intrinsic Lowering
PassName = Process Implicit Definitions
PassName = Simple Register Coalescing
PassName = Virtual Register Map
PassName = Live Register Matrix
PassName = Basic Register Allocator
PassName = Bundle Machine CFG Edges
PassName = Spill Code Placement Analysis
PassName = Greedy Register Allocator
PassName = Fast Register Allocator
PassName = Register Usage Information Storage
PassName = Register Usage Information Collector
PassName = Register Usage Information Propagation
PassName = Rename Independent Subregisters
PassName = Safe Stack instrumentation pass
PassName = Scalarize unsupported masked memory intrinsics
PassName = Shrink Wrap Pass
PassName = Merge disjoint stack slots
PassName = StackMap Liveness Analysis
PassName = Insert stack protectors
PassName = Stack Slot Coloring

PassName = Tail Duplication

PassName = Two-Address instruction pass
PassName = Unpack machine instruction bundles
PassName = Remove unreachable blocks from the CFG
PassName = Unpack machine instruction bundles
PassName = Remove unreachable blocks from the CFG
PassName = Virtual Register Rewriter
PassName = Prepare WebAssembly exceptions
PassName = Prepare Windows exceptions
PassName = Insert XRay ops
PassName = Induction Variable Users
PassName = Canonicalize natural loops
PassName = Loop Strength Reduction
PassName = Instrument function entry/exit with calls to e.g. mcount() (pre inlining)
PassName = Instrument function entry/exit with calls to e.g. mcount() (post inlining)
PassName = Branch Probability Analysis
PassName = Block Frequency Analysis
PassName = Constant Hoisting
PassName = Post-Dominator Tree Construction
PassName = Aggressive Dead Code Elimination
PassName = Demanded bits analysis
PassName = Bit-Tracking Dead Code Elimination
PassName = Alignment from assumptions
PassName = Call-site splitting
PassName = Simple constant propagation
PassName = Lazy Value Information Analysis
PassName = Value Propagation
PassName = Dead Code Elimination
PassName = Dead Instruction Elimination
PassName = Hoist/decompose integer division and remainder
PassName = Scalarize vector operations
PassName = Phi Values Analysis
PassName = Memory Dependence Analysis
PassName = Dead Store Elimination
PassName = Widen guards
PassName = Widen guards (within a single loop, as a loop pass)
PassName = Lazy Branch Probability Analysis
PassName = Lazy Block Frequency Analysis
PassName = Optimization Remark Emitter
PassName = Global Value Numbering
PassName = Global Value Numbering
PassName = Early CSE
PassName = Early CSE w/ MemorySSA
PassName = Lower the guard intrinsic to explicit control flow form
PassName = Early GVN Hoisting of Expressions
PassName = Early GVN sinking of Expressions
PassName = Early GVN Hoisting of Expressions
PassName = Early GVN sinking of Expressions
PassName = Flatten the CFG
PassName = LCSSA Verifier
PassName = Loop-Closed SSA Form Pass
PassName = Inductive range check elimination
PassName = Induction Variable Simplification
PassName = Infer address spaces
PassName = Remove redundant instructions
PassName = Jump Threading
PassName = Loop Invariant Code Motion
PassName = Loop Sink
PassName = Loop Data Prefetch
PassName = Delete dead loops
PassName = Loop Access Analysis
PassName = Simplify instructions in loops
PassName = Dependence Analysis
PassName = Interchanges loops for cache reuse
PassName = Loop predication
PassName = Rotate Loops
PassName = Reroll loops
PassName = Unroll loops
PassName = Unroll and Jam loops
PassName = Legacy Divergence Analysis
PassName = Unswitch loops
PassName = Warn about non-applied transformations
PassName = Loop Versioning For LICM
PassName = Recognize loop idioms
PassName = Lower atomic intrinsics to non-atomic form
PassName = Lower 'expect' Intrinsics
PassName = Lower the guard intrinsic to normal control flow
PassName = Lower the widenable condition to default true value
PassName = MemCpy Optimization
PassName = Merge contiguous icmps into a memcmp
PassName = MergedLoadStoreMotion
PassName = Nary reassociation
PassName = Partially inline calls to library functions
PassName = Reassociate expressions
PassName = Break critical edges in CFG
PassName = Demote all values to stack slots
PassName = Make relocations explicit at statepoints
PassName = Sparse Conditional Constant Propagation
PassName = Scalar Replacement Of Aggregates
PassName = Simplify the CFG
PassName = Lower SwitchInst's to branches
PassName = Dominance Frontier Construction
PassName = Detect single entry single exit regions
PassName = Structurize the CFG
PassName = Simple unswitch loops
PassName = Code sinking
PassName = Tail Call Elimination
PassName = Split GEPs to a variadic base and a constant offset for better CSE
PassName = Speculatively execute instructions
PassName = Straight line strength reduction
PassName = Place Backedge Safepoints
PassName = Place Safepoints
PassName = Float to int
PassName = Loop Distribution
PassName = Loop Load Elimination
PassName = Simplify loop CFG
PassName = Loop Versioning
PassName = Loop Vectorization
PassName = SLP Vectorizer
PassName = Vectorize load and store instructions
PassName = Expand reduction intrinsics
PassName = Scavenge virtual registers inside basic blocks
```

# One case do what pass

```asm
  -debug-pass=<value>                                            - Print PassManager debugging information
    =Disabled                                                    -   disable debug output
    =Arguments(line 4)                                            -   print pass arguments to pass to 'opt'
    =Structure                                                   -   print pass structure before run()
    =Executions                                                  -   print pass name before it is executed
    =Details(much info)                                          -   print pass details when it is executed
```



###  输出所使用的选项及经过的Pass

```shell
llc early-ret.ll -debug-pass=Structure -stop-after=ppc-early-ret
llc early-ret.ll  -debug-pass=Structure
```



## debug pass

使用`-debug -print-after-all`可以得到执行每个pass后的结果。



## Get pass name

```shell
llc test.c -O2 -debug -print-after-all > print-after-all.dbg
cat print-after-all.dbg | grep "IR Dump" > passname.dbg

[ken@lep824e1v:~/wyvern_write_test/shrink-wrap/2607_shrinkwrap/patch_D36504]$ llc -O3 early-exit-shrink-wrap.ll -debug-pass=Structure > pass-structure.dbg 2>&1
```





## 查看某个优化选项所经过的pass

```shell
grep -r "ModulePass Manager" .
./CodeGen/X86/O0-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./CodeGen/X86/O3-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./CodeGen/AArch64/O0-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./CodeGen/AArch64/O3-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./CodeGen/ARM/O3-pipeline.ll:; CHECK:       ModulePass Manager
./Other/opt-O3-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./Other/opt-O0-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./Other/opt-O2-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./Other/opt-Os-pipeline.ll:; CHECK-NEXT:   ModulePass Manager
./Other/pass-pipelines.ll:; CHECK-O2: ModulePass Manager
```



cat `test/CodeGen/X86/O0-pipeline.ll`

```shell
; When EXPENSIVE_CHECKS are enabled, the machine verifier appears between each
; pass. Ignore it with 'grep -v'.
; RUN: llc -mtriple=x86_64-- -O0 -debug-pass=Structure < %s -o /dev/null 2>&1 \
; RUN:   | grep -v 'Verify generated machine code' | FileCheck %s

; REQUIRES: asserts
```



对任意存在文件，可以用以下得到O0作了哪些优化。

```shell
llc -mcpu=pwr9  -mtriple=powerpc64le-unknown-unknown -O0 -debug-pass=Structure neg.ll
```





# 所有的passname

可以找help中的`print-before`或`print-after`。

```asm
llc --help-hidden 
1155   --print-after=<value>                                           - Print IR after specified passe     s
1156     =CFGuardLongjmp                                               -   Insert symbols at valid long     jmp targets for /guard:cf
1157     =RegUsageInfoCollector                                        -   Register Usage Information C     ollector
1158     =X86CondBrFolding                                             -   X86CondBrFolding
1159     =aa                                                           -   Function Alias Analysis Resu     lts
1160     =aarch64-a57-fp-load-balancing                                -   AArch64 A57 FP Load-Balancin     g
1161     =aarch64-branch-targets                                       -   AArch64 Branch Targets
1162     =aarch64-ccmp                                                 -   AArch64 CCMP Pass
1163     =aarch64-collect-loh                                          -   AArch64 Collect Linker Optim     ization Hint (LOH)
1164     =aarch64-condopt                                              -   AArch64 CondOpt Pass
1165     =aarch64-copyelim                                             -   AArch64 redundant copy elimi     nation pass
1166     =aarch64-dead-defs                                            -   AArch64 Dead register defini     tions
1167     =aarch64-expand-pseudo                                        -   AArch64 pseudo instruction e     xpansion pass
1168     =aarch64-fix-cortex-a53-835769-pass                           -   AArch64 fix for A53 erratum      835769
1169     =aarch64-jump-tables                                          -   AArch64 compress jump tables      pass
1170     =aarch64-ldst-opt                                             -   AArch64 load / store optimiz     ation pass
1171     =aarch64-local-dynamic-tls-cleanup                            -   AArch64 Local Dynamic TLS Ac     cess Clean-up
1172     =aarch64-prelegalizer-combiner                                -   Combine AArch64 machine inst     rs before legalization
1173     =aarch64-promote-const                                        -   AArch64 Promote Constant Pas     s
1174     =aarch64-simd-scalar                                          -   AdvSIMD Scalar Operation Opt     imization
1175     =aarch64-simdinstr-opt                                        -   AArch64 SIMD instructions op     timization pass
1176     =aarch64-speculation-hardening                                -   AArch64 speculation hardenin     g pass
1177     =aarch64-stack-tagging-pre-ra                                 -   AArch64 Stack Tagging PreRA      Pass
1178     =aarch64-stp-suppress                                         -   AArch64 Store Pair Suppressi     on
1179     =adce                                                         -   Aggressive Dead Code Elimina     tion
```

