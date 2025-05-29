https://reviews.llvm.org/D59403  clang

https://reviews.llvm.org/D59405 llvm



## 1 clang

`clang/include/clang/Basic/BuiltinsPPC.def`

````c++
// Set the floating point rounding mode
BUILTIN(__builtin_setrnd, "di", "")

````



`clang/lib/CodeGen/CGBuiltin.cpp`中做一些类型检测等（非必须的步骤）

```c++
 1645 RValue CodeGenFunction::EmitBuiltinExpr(const GlobalDecl GD, unsigned BuiltinID,
 1646                                         const CallExpr *E,
 1647                                         ReturnValueSlot ReturnValue) {
 2354   case Builtin::BI__builtin_trap:
 2355     return RValue::get(EmitTrapCall(Intrinsic::trap));
   ...
 2857   case Builtin::BI__builtin_eh_return: {
 2858     Value *Int = EmitScalarExpr(E->getArg(0));
 2859     Value *Ptr = EmitScalarExpr(E->getArg(1));
 2860
 2861     llvm::IntegerType *IntTy = cast<llvm::IntegerType>(Int->getType());
 2862     assert((IntTy->getBitWidth() == 32 || IntTy->getBitWidth() == 64) &&
 2863            "LLVM's __builtin_eh_return only supports 32- and 64-bit variants");
 2864     Function *F =
 2865         CGM.getIntrinsic(IntTy->getBitWidth() == 32 ? Intrinsic::eh_return_i32
 2866                                                     : Intrinsic::eh_return_i64);
 2867     Builder.CreateCall(F, {Int, Ptr});
 2868     Builder.CreateUnreachable();
 2869
 2870     // We do need to preserve an insertion point.
 2871     EmitBlock(createBasicBlock("builtin_eh_return.cont"));
 2872
 2873     return RValue::get(nullptr);
 2874   } 
   
```





Then, you can use the builtin `__builtin_setrnd` like this:

```c++
void test_builtin_ppc_setrnd() {
  volatile double res;
  volatile int x = 100;
  
  // CHECK: call double @llvm.ppc.setrnd(i32 2)
  res = __builtin_setrnd(2);

  // CHECK: call double @llvm.ppc.setrnd(i32 100)
  res = __builtin_setrnd(100);

  // CHECK: call double @llvm.ppc.setrnd(i32 %2)
  res = __builtin_setrnd(x);
}
```



In the `ll file`, you can see `call double @llvm.ppc.setrnd(i32 2)`.





## 2 llvm

builtin函数，选择Intrinsic，指令选择阶段选择SETRNDi伪指令，最后对伪指令进行Lowering，选择真正的机器指令。

`llvm/include/llvm/IR/IntrinsicsPowerPC.td`

`__builtin_setrnd`  --> `int_ppc_setrnd`

```c++
// PowerPC set FPSCR Intrinsic Definitions.
def int_ppc_setrnd : GCCBuiltin<"__builtin_setrnd">,
      Intrinsic<[llvm_double_ty], [llvm_i32_ty], []>;
```



`llvm/lib/Target/PowerPC/PPCInstrInfo.td`

```c++
// Set the float rounding mode.
let Uses = [RM], Defs = [RM] in { 
def SETRNDi : PPCCustomInserterPseudo<(outs f8rc:$FRT), (ins u2imm:$RND),
                    "#SETRNDi", [(set f64:$FRT, (int_ppc_setrnd (i32 imm:$RND)))]>;

def SETRND : PPCCustomInserterPseudo<(outs f8rc:$FRT), (ins gprc:$in),
                    "#SETRND", [(set f64:$FRT, (int_ppc_setrnd gprc :$in))]>;
}

```





```c++
11356 MachineBasicBlock *
11357 PPCTargetLowering::EmitInstrWithCustomInserter(MachineInstr &MI,
11358                                                MachineBasicBlock *BB) const {
... 
11987   } else if (MI.getOpcode() == PPC::SETRNDi) {
11988     DebugLoc dl = MI.getDebugLoc();
11989     Register OldFPSCRReg = MI.getOperand(0).getReg();
11990
11991     // Save FPSCR value.
11992     BuildMI(*BB, MI, dl, TII->get(PPC::MFFS), OldFPSCRReg);
11993
11994     // The floating point rounding mode is in the bits 62:63 of FPCSR, and has
11995     // the following settings:
11996     //   00 Round to nearest
11997     //   01 Round to 0
11998     //   10 Round to +inf
11999     //   11 Round to -inf
12000
12001     // When the operand is immediate, using the two least significant bits of
12002     // the immediate to set the bits 62:63 of FPSCR.
12003     unsigned Mode = MI.getOperand(1).getImm();
12004     BuildMI(*BB, MI, dl, TII->get((Mode & 1) ? PPC::MTFSB1 : PPC::MTFSB0))
12005         .addImm(31)
12006         .addReg(PPC::RM, RegState::ImplicitDefine);
12007
12008     BuildMI(*BB, MI, dl, TII->get((Mode & 2) ? PPC::MTFSB1 : PPC::MTFSB0))
12009         .addImm(30)
12010         .addReg(PPC::RM, RegState::ImplicitDefine);
12011   } else if (MI.getOpcode() == PPC::SETRND) {
...

```

