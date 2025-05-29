

# Clang

### 1 clang/include/clang/Basic/Builtins.def

```c++
clang/include/clang/Basic/Builtins.def:BUILTIN(__builtin_return_address, "v*IUi", "n")
clang/include/clang/Basic/Builtins.def:BUILTIN(__builtin_extract_return_addr, "v*v*", "n")
clang/include/clang/Basic/Builtins.def:BUILTIN(__builtin_eh_return_data_regno, "iIi", "nc")
clang/include/clang/Basic/Builtins.def:BUILTIN(__builtin_eh_return, "vzv*", "r") // FIXME: Takes intptr_t, not size_t!
```





### 2 `clang/lib/CodeGen/CGBuiltin.cpp`中做一些类型检测等（非必须的步骤）

C中使用`__builtin_eh_return`，根据情况产生`Intrinsic::eh_return_i32`或是`Intrinsic::eh_return_i64`.

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



### 3 case

case from `llvm/clang/test/Sema/builtins.c`

```c++
int test13() {
  int i = 0;
  __builtin_eh_return(0, 0); // no warning, eh_return never returns.
  int volatile j = 1;
  return j;
}
```



we will get below ll:

```c++
; ModuleID = 'sim.c'
source_filename = "sim.c"
target datalayout = "e-m:e-i64:64-n32:64"
target triple = "powerpc64le-unknown-linux-gnu"

; Function Attrs: noinline nounwind optnone
define dso_local signext i32 @test13() #0 {
entry:
  %i = alloca i32, align 4
  %j = alloca i32, align 4
  store i32 0, i32* %i, align 4
  call void @llvm.eh.return.i64(i64 0, i8* null)
  unreachable
}

; Function Attrs: nounwind
declare void @llvm.eh.return.i64(i64, i8*) #1

attributes #0 = { noinline nounwind optnone "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="ppc64le" "target-features"="+altivec,+bpermd,+crypto,+direct-move,+extdiv,+htm,+power8-vector,+vsx,-power9-vector,-spe" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{!"clang version 12.0.0 (git@github.ibm.com:compiler/llvm-project.git 2abd07930adae08e5b0989325f3710b0c29fc80c)"}
```



---------



# llvm

`Intrinsic::eh_return_i64` -> `ISD::EH_RETURN` -> `LowerEH_RETURN` ->

```c++
void SelectionDAGBuilder::visitIntrinsicCall(const CallInst &I,
                                             unsigned Intrinsic) {
...
  case Intrinsic::eh_return_i32:
  case Intrinsic::eh_return_i64:
    DAG.getMachineFunction().setCallsEHReturn(true);
    DAG.setRoot(DAG.getNode(ISD::EH_RETURN, sdl,
                            MVT::Other,
                            getControlRoot(),
                            getValue(I.getArgOperand(0)),
                            getValue(I.getArgOperand(1))));
    return;
...
}
```



```c++
SDValue X86TargetLowering::LowerEH_RETURN(SDValue Op, SelectionDAG &DAG) const {
  SDValue Chain     = Op.getOperand(0);
  SDValue Offset    = Op.getOperand(1);
  SDValue Handler   = Op.getOperand(2);
  SDLoc dl      (Op);

  EVT PtrVT = getPointerTy(DAG.getDataLayout());
  const X86RegisterInfo *RegInfo = Subtarget.getRegisterInfo();
  Register FrameReg = RegInfo->getFrameRegister(DAG.getMachineFunction());
  assert(((FrameReg == X86::RBP && PtrVT == MVT::i64) ||
          (FrameReg == X86::EBP && PtrVT == MVT::i32)) &&
         "Invalid Frame Register!");
  SDValue Frame = DAG.getCopyFromReg(DAG.getEntryNode(), dl, FrameReg, PtrVT);
  Register StoreAddrReg = (PtrVT == MVT::i64) ? X86::RCX : X86::ECX;

  SDValue StoreAddr = DAG.getNode(ISD::ADD, dl, PtrVT, Frame,
                                 DAG.getIntPtrConstant(RegInfo->getSlotSize(),
                                                       dl));
  StoreAddr = DAG.getNode(ISD::ADD, dl, PtrVT, StoreAddr, Offset);
  Chain = DAG.getStore(Chain, dl, Handler, StoreAddr, MachinePointerInfo());
  Chain = DAG.getCopyToReg(Chain, dl, StoreAddrReg, StoreAddr);

  return DAG.getNode(X86ISD::EH_RETURN, dl, MVT::Other, Chain,
                     DAG.getRegister(StoreAddrReg, PtrVT));
}
```



Td define

```c++
def X86ehret : SDNode<"X86ISD::EH_RETURN", SDT_X86EHRET,
                        [SDNPHasChain]>;
```





```c++
let SchedRW = [WriteSystem] in {
let isTerminator = 1, isReturn = 1, isBarrier = 1,
    hasCtrlDep = 1, isCodeGenOnly = 1 in {
def EH_RETURN   : I<0xC3, RawFrm, (outs), (ins GR32:$addr),
                    "ret\t#eh_return, addr: $addr",
                    [(X86ehret GR32:$addr)]>, Sched<[WriteJumpLd]>;

}

let isTerminator = 1, isReturn = 1, isBarrier = 1,
    hasCtrlDep = 1, isCodeGenOnly = 1 in {
def EH_RETURN64   : I<0xC3, RawFrm, (outs), (ins GR64:$addr),
                     "ret\t#eh_return, addr: $addr",
                     [(X86ehret GR64:$addr)]>, Sched<[WriteJumpLd]>;

}
```





### case

`cat CodeGen/X86/2008-08-31-EH_RETURN64.ll`

```c++
; Check that eh_return & unwind_init were properly lowered
; RUN: llc < %s -verify-machineinstrs | FileCheck %s

target datalayout = "e-p:64:64:64-i1:8:8-i8:8:8-i16:16:16-i32:32:32-i64:64:64-f32:32:32-f64:64:64-v64:64:64-v128:128:128-a0:0:64-s0:64:64-f80:128:128"
target triple = "x86_64-unknown-linux-gnu"

; CHECK: test
; CHECK: pushq %rbp
; CHECK: movq %rsp, %rbp
; CHECK: popq %rbp
; CHECK: movq %rcx, %rsp
; CHECK: retq # eh_return, addr: %rcx
define i8* @test(i64 %a, i8* %b)  {
entry:
  call void @llvm.eh.unwind.init()
  %foo   = alloca i32
  call void @llvm.eh.return.i64(i64 %a, i8* %b)
  unreachable
}

declare void @llvm.eh.return.i64(i64, i8*)
declare void @llvm.eh.unwind.init()

@b = common global i32 0, align 4
@a = common global i32 0, align 4

; PR14750
; This function contains a normal return as well as eh_return.
; CHECK: _Unwind_Resume_or_Rethrow
define i32 @_Unwind_Resume_or_Rethrow() nounwind uwtable ssp {
entry:
  %0 = load i32, i32* @b, align 4
  %tobool = icmp eq i32 %0, 0
  br i1 %tobool, label %if.end, label %if.then

if.then:                                          ; preds = %entry
  ret i32 0

if.end:                                           ; preds = %entry
  %call = tail call i32 (...) @_Unwind_ForcedUnwind_Phase2() nounwind
  store i32 %call, i32* @a, align 4
  %tobool1 = icmp eq i32 %call, 0
  br i1 %tobool1, label %cond.end, label %cond.true

cond.true:                                        ; preds = %if.end
  tail call void @abort() noreturn nounwind
  unreachable

cond.end:                                         ; preds = %if.end
  tail call void @llvm.eh.return.i64(i64 0, i8* null)
  unreachable
}

declare i32 @_Unwind_ForcedUnwind_Phase2(...)
declare void @abort() noreturn
```



