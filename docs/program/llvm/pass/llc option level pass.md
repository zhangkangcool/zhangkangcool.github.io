## Get the pass name

```shell
llc -O0 empty.ll -debug-pass=Structure > O0.log 2>&1
llc -O1 empty.ll -debug-pass=Structure > O1.log 2>&1
llc -O2 empty.ll -debug-pass=Structure > O2.log 2>&1
llc -O3 empty.ll -debug-pass=Structure > O3.log 2>&1

/gsa/tlbgsa/projects/x/xlcdl/shkzhang/llc_ppc_pipeline/O0.log
/gsa/tlbgsa/projects/x/xlcdl/shkzhang/llc_ppc_pipeline/O1.log
/gsa/tlbgsa/projects/x/xlcdl/shkzhang/llc_ppc_pipeline/O2.log
/gsa/tlbgsa/projects/x/xlcdl/shkzhang/llc_ppc_pipeline/O3.log


```



# O3.log

这里的选项如-targetlibinfo,可以在 --print-after=-targetlibinfo



```asm
Pass Arguments:  -targetlibinfo -targetpassconfig -machinemoduleinfo -tti -assumption-cache-tracker -tbaa -scoped-noalias -profile-summary-info -collector-metadata -machine-branch-prob -pre-isel-intrinsic-lowering -bool-ret-to-int -atomic-expand -ppc-lower-massv-entries -domtree -loops -scalar-evolution -separate-const-offset-from-gep -early-cse -basicaa -aa -memoryssa -loop-simplify -lcssa-verification -lcssa -scalar-evolution -licm -verify -iv-users -loop-reduce -basicaa -aa -mergeicmps -loops -lazy-branch-prob -lazy-block-freq -expandmemcmp -gc-lowering -shadow-stack-gc-lowering -lower-constant-intrinsics -unreachableblockelim -domtree -loops -postdomtree -branch-prob -block-freq -consthoist -partially-inline-libcalls -post-inline-ee-instrument -scalarize-masked-mem-intrin -expand-reductions -domtree -loops -codegenprepare -rewrite-symbols -domtree -dwarfehprepare -domtree -loops -scalar-evolution -ppc-loop-instr-form-prep -scalar-evolution -lazy-branch-prob -lazy-block-freq -opt-remark-emitter -hardware-loops -safe-stack -stack-protector -verify -domtree -basicaa -aa -loops -postdomtree -branch-prob -lazy-branch-prob -lazy-block-freq -amdgpu-isel -machinedomtree -ppc-ctr-loops-verify -ppc-vsx-copy -finalize-isel -machineverifier -lazy-machine-block-freq -early-tailduplication -machineverifier -opt-phis -machineverifier -slotindexes -stack-coloring -machineverifier -localstackalloc -machineverifier -dead-mi-elimination -machineverifier -machinedomtree -machine-loops -machine-trace-metrics -early-ifcvt -machineverifier -lazy-machine-block-freq -machine-combiner -machineverifier -early-machinelicm -machineverifier -machinedomtree -machine-block-freq -machine-cse -machineverifier -machinepostdomtree -machine-sink -machineverifier -peephole-opt -machineverifier -dead-mi-elimination -machineverifier -ppc-vsx-swaps -machineverifier -machinedomtree -ppc-reduce-cr-ops -machineverifier -machinedomtree -machinepostdomtree -machine-loops -machine-block-freq -ppc-mi-peepholes -machineverifier -dead-mi-elimination -machineverifier -ppc-toc-reg-deps -machineverifier -machinedomtree -machine-loops -slotindexes -liveintervals -lazy-machine-block-freq -machine-opt-remark-emitter -pipeliner -machineverifier -detect-dead-lanes -machineverifier -processimpdefs -machineverifier -unreachable-mbb-elimination -livevars -machineverifier -machinedomtree -machine-loops -machineverifier -phi-node-elimination -machineverifier -twoaddressinstruction -machineverifier -slotindexes -liveintervals -simple-register-coalescing -machineverifier -rename-independent-subregs -machineverifier -machine-scheduler -machineverifier -ppc-vsx-fma-mutate -machineverifier -machine-loops -machine-block-freq -livedebugvars -livestacks -virtregmap -liveregmatrix -edge-bundles -spill-code-placement -lazy-machine-block-freq -machine-opt-remark-emitter -greedy -machineverifier -virtregrewriter -machineverifier -stack-slot-coloring -machineverifier -machine-cp -machineverifier -machinelicm -machineverifier -fixup-statepoint-caller-saved -machineverifier -postra-machine-sink -machineverifier -machine-block-freq -machinedomtree -machinepostdomtree -lazy-machine-block-freq -machine-opt-remark-emitter -shrink-wrap -machineverifier -prologepilog -machineverifier -branch-folder -machineverifier -lazy-machine-block-freq -tailduplication -machineverifier -machine-cp -machineverifier -postrapseudos -machineverifier -machinedomtree -machine-loops -machine-block-freq -if-converter -machineverifier -ppc-qpx-load-splat -machineverifier -machinedomtree -machine-loops -postmisched -machineverifier -gc-analysis -machineverifier -machine-block-freq -machinepostdomtree -block-placement -machineverifier -fentry-insert -machineverifier -xray-instrumentation -machineverifier -patchable-function -machineverifier -ppc-pre-emit-peephole -machineverifier -ppc-expand-isel -machineverifier -ppc-early-ret -machineverifier -ppc-branch-select -machineverifier -funclet-layout -machineverifier -stackmap-liveness -machineverifier -livedebugvalues -machineverifier -lazy-machine-block-freq -machine-opt-remark-emitter
Target Library Information
Target Pass Configuration
Machine Module Information
Target Transform Information
Assumption Cache Tracker
Type-Based Alias Analysis
Scoped NoAlias Alias Analysis
Profile summary info
Create Garbage Collector Module Metadata
Machine Branch Probability Analysis
  ModulePass Manager
    Pre-ISel Intrinsic Lowering
    FunctionPass Manager
      Convert i1 constants to i32/i64 if they are returned
      Expand Atomic instructions
    PPC Lower MASS Entries
    FunctionPass Manager
      Dominator Tree Construction
      Natural Loop Information
      Scalar Evolution Analysis
      Split GEPs to a variadic base and a constant offset for better CSE
      Early CSE
      Basic Alias Analysis (stateless AA impl)
      Function Alias Analysis Results
      Memory SSA
      Canonicalize natural loops
      LCSSA Verifier
      Loop-Closed SSA Form Pass
      Scalar Evolution Analysis
      Loop Pass Manager
        Loop Invariant Code Motion
      Module Verifier
      Loop Pass Manager
        Induction Variable Users
        Loop Strength Reduction
      Basic Alias Analysis (stateless AA impl)
      Function Alias Analysis Results
      Merge contiguous icmps into a memcmp
      Natural Loop Information
      Lazy Branch Probability Analysis
      Lazy Block Frequency Analysis
      Expand memcmp() to load/stores
      Lower Garbage Collection Instructions
      Shadow Stack GC Lowering
      Lower constant intrinsics
      Remove unreachable blocks from the CFG
      Dominator Tree Construction
      Natural Loop Information
      Post-Dominator Tree Construction
      Branch Probability Analysis
      Block Frequency Analysis
      Constant Hoisting
      Partially inline calls to library functions
      Instrument function entry/exit with calls to e.g. mcount() (post inlining)
      Scalarize Masked Memory Intrinsics
      Expand reduction intrinsics
      Dominator Tree Construction
      Natural Loop Information
      CodeGen Prepare
    Rewrite Symbols
    FunctionPass Manager
      Dominator Tree Construction
      Exception handling preparation
      Dominator Tree Construction
      Natural Loop Information
      Scalar Evolution Analysis
      Prepare loop for ppc preferred instruction forms
      Scalar Evolution Analysis
      Lazy Branch Probability Analysis
      Lazy Block Frequency Analysis
      Optimization Remark Emitter
      Hardware Loop Insertion
      Safe Stack instrumentation pass
      Insert stack protectors
      Module Verifier
      Dominator Tree Construction
      Basic Alias Analysis (stateless AA impl)
      Function Alias Analysis Results
      Natural Loop Information
      Post-Dominator Tree Construction
      Branch Probability Analysis
      Lazy Branch Probability Analysis
      Lazy Block Frequency Analysis
*****************After Instruction Selection**************
      PowerPC DAG->DAG Pattern Instruction Selection
      MachineDominator Tree Construction
      PowerPC CTR Loops Verify
      PowerPC VSX Copy Legalization
      Finalize ISel and expand pseudo-instructions
      Verify generated machine code
      Lazy Machine Block Frequency Analysis
      Early Tail Duplication
      Verify generated machine code
      Optimize machine instruction PHIs
      Verify generated machine code
      Slot index numbering
      Merge disjoint stack slots
      Verify generated machine code
      Local Stack Slot Allocation
      Verify generated machine code
      Remove dead machine instructions
      Verify generated machine code
      MachineDominator Tree Construction
      Machine Natural Loop Construction
      Machine Trace Metrics
      Early If-Conversion
      Verify generated machine code
      Lazy Machine Block Frequency Analysis
      Machine InstCombiner
      Verify generated machine code
      Early Machine Loop Invariant Code Motion
      Verify generated machine code
      MachineDominator Tree Construction
      Machine Block Frequency Analysis
      Machine Common Subexpression Elimination
      Verify generated machine code
      MachinePostDominator Tree Construction
      Machine code sinking
      Verify generated machine code
      Peephole Optimizations
      Verify generated machine code
      Remove dead machine instructions
      Verify generated machine code
      PowerPC VSX Swap Removal
      Verify generated machine code
      MachineDominator Tree Construction
      PowerPC Reduce CR logical Operation
      Verify generated machine code
      MachineDominator Tree Construction
      MachinePostDominator Tree Construction
      Machine Natural Loop Construction
      Machine Block Frequency Analysis
      PowerPC MI Peephole Optimization
      Verify generated machine code
      Remove dead machine instructions
      Verify generated machine code
      PowerPC TOC Register Dependencies
      Verify generated machine code
      MachineDominator Tree Construction
      Machine Natural Loop Construction
      Slot index numbering
      Live Interval Analysis
      Lazy Machine Block Frequency Analysis
      Machine Optimization Remark Emitter
      Modulo Software Pipelining
      Verify generated machine code
      Detect Dead Lanes
      Verify generated machine code
      Process Implicit Definitions
      Verify generated machine code
      Remove unreachable machine basic blocks
      Live Variable Analysis
      Verify generated machine code
      MachineDominator Tree Construction
      Machine Natural Loop Construction
      Verify generated machine code
      Eliminate PHI nodes for register allocation
******************After Eliminate PHI nonSSA****************
      Verify generated machine code
      Two-Address instruction pass
      Verify generated machine code
      Slot index numbering
      Live Interval Analysis
      Simple Register Coalescing
      Verify generated machine code
      Rename Disconnected Subregister Components
      Verify generated machine code
      Machine Instruction Scheduler
      Verify generated machine code
      PowerPC VSX FMA Mutation
      Verify generated machine code
      Machine Natural Loop Construction
      Machine Block Frequency Analysis
      Debug Variable Analysis
      Live Stack Slot Analysis
      Virtual Register Map
      Live Register Matrix
      Bundle Machine CFG Edges
      Spill Code Placement Analysis
      Lazy Machine Block Frequency Analysis
      Machine Optimization Remark Emitter
      Greedy Register Allocator
************** After Register Allocator*****************
      Verify generated machine code
      Virtual Register Rewriter
      Verify generated machine code
      Stack Slot Coloring
      Verify generated machine code
      Machine Copy Propagation Pass
      Verify generated machine code
      Machine Loop Invariant Code Motion
      Verify generated machine code
      Fixup Statepoint Caller Saved
      Verify generated machine code
      PostRA Machine Sink
      Verify generated machine code
      Machine Block Frequency Analysis
      MachineDominator Tree Construction
      MachinePostDominator Tree Construction
      Lazy Machine Block Frequency Analysis
      Machine Optimization Remark Emitter
      Shrink Wrapping analysis
      Verify generated machine code
      Prologue/Epilogue Insertion & Frame Finalization
      Verify generated machine code
      Control Flow Optimizer
      Verify generated machine code
      Lazy Machine Block Frequency Analysis
      Tail Duplication
      Verify generated machine code
      Machine Copy Propagation Pass
      Verify generated machine code
      Post-RA pseudo instruction expansion pass
      Verify generated machine code
      MachineDominator Tree Construction
      Machine Natural Loop Construction
      Machine Block Frequency Analysis
      If Converter
      Verify generated machine code
      PowerPC QPX Load Splat Simplification
      Verify generated machine code
      MachineDominator Tree Construction
      Machine Natural Loop Construction
      PostRA Machine Instruction Scheduler
      Verify generated machine code
      Analyze Machine Code For Garbage Collection
      Verify generated machine code
      Machine Block Frequency Analysis
      MachinePostDominator Tree Construction
      Branch Probability Basic Block Placement
      Verify generated machine code
      Insert fentry calls
      Verify generated machine code
      Insert XRay ops
      Verify generated machine code
      Implement the 'patchable-function' attribute
      Verify generated machine code
      PowerPC Pre-Emit Peephole
      Verify generated machine code
      PowerPC Expand ISEL Generation
      Verify generated machine code
      PowerPC Early-Return Creation
      Verify generated machine code
      PowerPC Branch Selector
      Verify generated machine code
      Contiguously Lay Out Funclets
      Verify generated machine code
      StackMap Liveness Analysis
      Verify generated machine code
      Live DEBUG_VALUE analysis
      Verify generated machine code
      Lazy Machine Block Frequency Analysis
      Machine Optimization Remark Emitter
      Linux PPC Assembly Printer
      Free MachineFunction
```





# Opt pass

```
opt -O3 main.ll -S -o test.ll --debug-pass-manager > opt3.log 
```

