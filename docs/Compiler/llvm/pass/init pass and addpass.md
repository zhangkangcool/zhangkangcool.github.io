<h1 align="center">init pass and addpass</h1>
# Init the pass

`./include/llvm/PassSupport.h`

通过下面的宏定义来生成 所需要的`initializePPCEarlyReturnPass`函数。

```c++
207 INITIALIZE_PASS(PPCEarlyReturn, DEBUG_TYPE,
208                 "PowerPC Early-Return Creation", false, false)
```





```shell
 35 #define INITIALIZE_PASS(passName, arg, name, cfg, analysis)                    \
 36   static void *initialize##passName##PassOnce(PassRegistry &Registry) {        \
 37     PassInfo *PI = new PassInfo(                                               \
 38         name, arg, &passName::ID,                                              \
 39         PassInfo::NormalCtor_t(callDefaultCtor<passName>), cfg, analysis);     \
 40     dbgs() << "name = " << name << " PassSupport1\n";                           \
 41     Registry.registerPass(*PI, true);                                          \
 42     return PI;                                                                 \
 43   }                                                                            \
 44   static llvm::once_flag Initialize##passName##PassFlag;                       \
 45   void llvm::initialize##passName##Pass(PassRegistry &Registry) {              \
 46     dbgs() << "name = " << name << " PassSupport2\n";                           \
 47     llvm::call_once(Initialize##passName##PassFlag,                            \
 48                     initialize##passName##PassOnce, std::ref(Registry));       \
 49   }
```

初始化会注册pass的信息，比如用于调度等stop-afeer=passname



initialize用于注册pass，后面可以使用create类似的方法，通过 addPass进行添加执行。



### CodeGen Pass

在`./include/llvm/InitializePasses.h`中声明init函数。通过`INITIALIZE_PASS`宏进行实现

```c++
155 void initializeEarlyCSEMemSSALegacyPassPass(PassRegistry&);
156 void initializeEarlyIfConverterPass(PassRegistry&);
157 void initializeEarlyIfPredicatorPass(PassRegistry &);
158 void initializeEarlyMachineLICMPass(PassRegistry&);
159 void initializeEarlyTailDuplicatePass(PassRegistry&);
160 void initializeEdgeBundlesPass(PassRegistry&);
161 void initializeEliminateAvailableExternallyLegacyPassPass(PassRegistry&);
162 void initializeEntryExitInstrumenterPass(PassRegistry&);
```



在`./lib/CodeGen/CodeGen.cpp`中调用init函数对pass进行初始化

```c++
 21 void llvm::initializeCodeGen(PassRegistry &Registry) {
       这些init系列函数是通过调用INITIALIZE_PASS来生成的b 
 22   initializeAtomicExpandPass(Registry);
 23   initializeBranchFolderPassPass(Registry);
 24   initializeBranchRelaxationPass(Registry);
 25   initializeCFGuardLongjmpPass(Registry);
 26   initializeCFIInstrInserterPass(Registry);
 27   initializeCodeGenPreparePass(Registry);
 28   initializeDeadMachineInstructionElimPass(Registry);
 29   initializeDetectDeadLanesPass(Registry);
 30   initializeDwarfEHPreparePass(Registry);
 31   initializeEarlyIfConverterPass(Registry);
 32   initializeEarlyIfPredicatorPass(Registry);
 33   initializeEarlyMachineLICMPass(Registry);
 34   initializeEarlyTailDuplicatePass(Registry);
 ...
}
```





## PPC pass

`lib/Target/PowerPC/PPCEarlyReturn.cpp`

```cpp
207 INITIALIZE_PASS(PPCEarlyReturn, DEBUG_TYPE,
208                 "PowerPC Early-Return Creation", false, false)
209
210 char PPCEarlyReturn::ID = 0;
211 FunctionPass*
212 llvm::createPPCEarlyReturnPass() { return new PPCEarlyReturn(); }
```



```cpp
49     PPCEarlyReturn() : MachineFunctionPass(ID) {
 50       dbgs() << "initializePPCEarlyReturnPass\n";
 51       initializePPCEarlyReturnPass(*PassRegistry::getPassRegistry());
 52     }
```



`./lib/Target/PowerPC/PPCTargetMachine.cpp`

注意`PPCEarlyReturnPass`未使用PassID,不存在`PPCEarlyReturnPass`,注册pass时使用`addPass(createPPCEarlyReturnPass(), false);`。



```c++
./lib/Target/PowerPC/PPCEarlyReturn.cpp:char PPCEarlyReturn::ID = 0;
```

没有类似下面的赋值,只是初始化为0，未对ID进行任何引用。

```c++
./lib/CodeGen/EarlyIfConversion.cpp:char &llvm::EarlyIfConverterID = EarlyIfConverter::ID;
```



# Add the pass

`PPCTargetMachine.cpp`

```c++
97 extern "C" void LLVMInitializePowerPCTarget() {
 98   // Register the targets
 99   RegisterTargetMachine<PPCTargetMachine> A(getThePPC32Target());
100   RegisterTargetMachine<PPCTargetMachine> B(getThePPC64Target());
101   RegisterTargetMachine<PPCTargetMachine> C(getThePPC64LETarget());
102
103   PassRegistry &PR = *PassRegistry::getPassRegistry();
104 #ifndef NDEBUG
105   initializePPCCTRLoopsVerifyPass(PR);
106 #endif
107   initializePPCLoopInstrFormPrepPass(PR);
108   initializePPCTOCRegDepsPass(PR);
109   initializePPCEarlyReturnPass(PR);
110   initializePPCVSXCopyPass(PR);
111   initializePPCVSXFMAMutatePass(PR);
112   initializePPCVSXSwapRemovalPass(PR);
113   initializePPCReduceCRLogicalsPass(PR);
114   initializePPCBSelPass(PR);
115   initializePPCBranchCoalescingPass(PR);
116   initializePPCQPXLoadSplatPass(PR);
117   initializePPCBoolRetToIntPass(PR);
118   initializePPCExpandISELPass(PR);
119   initializePPCPreEmitPeepholePass(PR);
120   initializePPCTLSDynamicCallPass(PR);
121   initializePPCMIPeepholePass(PR);
122   initializePPCLowerMASSVEntriesPass(PR);
123 }


522 void PPCPassConfig::addPreEmitPass() {
523   addPass(createPPCPreEmitPeepholePass());
524   addPass(createPPCExpandISELPass());
525
526   if (getOptLevel() != CodeGenOpt::None)
  ****************************************
527     addPass(createPPCEarlyReturnPass(), false);
    ****************************************
528   // Must run branch selection immediately preceding the asm printer.
529   addPass(createPPCBranchSelectionPass(), false);
530 }
531
```





PassID用于添加Pass时

```C++
./include/llvm/CodeGen/Passes.h:  extern char &EarlyIfConverterID;
./lib/Target/PowerPC/PPCTargetMachine.cpp:  addPass(&EarlyIfConverterID);
./lib/Target/X86/X86TargetMachine.cpp:  addPass(&EarlyIfConverterID);
./lib/Target/AMDGPU/AMDGPUTargetMachine.cpp:    addPass(&EarlyIfConverterID);
./lib/Target/SystemZ/SystemZTargetMachine.cpp:  addPass(&EarlyIfConverterID);
./lib/Target/AArch64/AArch64TargetMachine.cpp:    addPass(&EarlyIfConverterID);
./lib/CodeGen/EarlyIfConversion.cpp:char &llvm::EarlyIfConverterID = EarlyIfConverter::ID;
./lib/CodeGen/TargetPassConfig.cpp:  if (StandardID == &EarlyIfConverterID)
```



对于未add进pass，是不会运行到的。但我们依然可以使用`run-pass`强行让只运行某个pass。如`early-if-predicator` pass.

```
/home/shkzhang/llvm/build/bin/llc -march=hexagon -run-pass early-if-predicator /home/shkzhang/llvm/llvm/test/CodeGen/Hexagon/early-if-predicator.mir -o - -verify-machineinstrs | /home/shkzhang/llvm/build/bin/FileCheck /home/shkzhang/llvm/llvm/test/CodeGen/Hexagon/early-if-predicator.mir
```

