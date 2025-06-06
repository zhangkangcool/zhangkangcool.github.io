<h1 align="center">debug pass</h1>
## `DEBUG_TYPE` & Options

`./lib/Target/PowerPC/PPCMIPeephole.cpp`

`DEBUG_TYPE` is the pass name for debug, and `opt<bool>` is the option to debug.

You can use:

```shell
llc run-pass ppc-mi-peepholes -ppc-convert-rr-to-ri  -o run-pass.mir convert-simplify.mir
llc run-pass ppc-mi-peepholes -ppc-convert-rr-to-ri=false  -o run-pass.mir convert-simplify.mir

llc  early-ret2.ll -enable-shrink-wrap=false -O1
```



某些pass受opt level和option共同控制，

```c++
452   if (EnableBranchCoalescing && getOptLevel() != CodeGenOpt::None)
453     addPass(createPPCBranchCoalescingPass());
454   TargetPassConfig::addMachineSSAOptimization();
```

`llc -enable-ppc-branch-coalesce -debug-pass=Structure -stop-before=ppc-branch-coalescing test.ll` 

同时用`-enable-ppc-branch-coalesce-stop-before=ppc-branch-coalescing `.





### INITIALIZE_PASS_BEGIN中使用的DEBUG_TYPE或者直接是名字，可以用来传给runpass等。

```c++
1645 INITIALIZE_PASS_BEGIN(PPCMIPeephole, DEBUG_TYPE,
1646                       "PowerPC MI Peephole Optimization", false, false)
  ./MIRCanonicalizerPass.cpp:INITIALIZE_PASS_BEGIN(MIRCanonicalizer, "mir-canonicalizer",
```





```c++
#define DEBUG_TYPE "ppc-mi-peepholes"

STATISTIC(RemoveTOCSave, "Number of TOC saves removed");
STATISTIC(MultiTOCSaves,
          "Number of functions with multiple TOC saves that must be kept");
STATISTIC(NumEliminatedSExt, "Number of eliminated sign-extensions");
STATISTIC(NumEliminatedZExt, "Number of eliminated zero-extensions");
STATISTIC(NumOptADDLIs, "Number of optimized ADD instruction fed by LI");
STATISTIC(NumConvertedToImmediateForm,
          "Number of instructions converted to their immediate form");
STATISTIC(NumFunctionsEnteredInMIPeephole,
          "Number of functions entered in PPC MI Peepholes");
STATISTIC(NumFixedPointIterations,
          "Number of fixed-point iterations converting reg-reg instructions "
          "to reg-imm ones");

static cl::opt<bool>
FixedPointRegToImm("ppc-reg-to-imm-fixed-point", cl::Hidden, cl::init(true),
                   cl::desc("Iterate to a fixed point when attempting to "
                            "convert reg-reg instructions to reg-imm"));

static cl::opt<bool>
ConvertRegReg("ppc-convert-rr-to-ri", cl::Hidden, cl::init(true),
              cl::desc("Convert eligible reg+reg instructions to reg+imm"));

static cl::opt<bool>
    EnableSExtElimination("ppc-eliminate-signext",
                          cl::desc("enable elimination of sign-extensions"),
                          cl::init(false), cl::Hidden);

static cl::opt<bool>
    EnableZExtElimination("ppc-eliminate-zeroext",
                          cl::desc("enable elimination of zero-extensions"),
                          cl::init(false), cl::Hidden);
```




