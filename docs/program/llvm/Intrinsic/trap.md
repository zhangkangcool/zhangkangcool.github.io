



## 1 clang

`~/llvm/clang/include/clang/Basic/Builtins.def`

```c++
 576 BUILTIN(__builtin_trap, "v", "nr")
```





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
   post PR to Add compatibility check for PPC PLT stubs
```





## 2 llvm

`~/llvm/llvm/include/llvm/IR/Intrinsics.td`

```c++
1208 def int_trap : Intrinsic<[], [], [IntrNoReturn, IntrCold]>,
1209                GCCBuiltin<"__builtin_trap">;
```





下面在`SelectionDAGBuilde`中，调用`visitCall`，`visitCall`调用`visitIntrinsicCall`，`Intrinsic::trap`  变成了`ISD::TRAP`。`ISD::TRAP`在指令选择阶段会被选择成`PPC::TRAP`



`llvm/lib/CodeGen/SelectionDAG/SelectionDAGBuilder.cpp`

```c++
void SelectionDAGBuilder::visitCall(const CallInst &I) {
  // Handle inline assembly differently.
  if (I.isInlineAsm()) {
    visitInlineAsm(I);
    return;
  }

  if (Function *F = I.getCalledFunction()) {
    if (F->isDeclaration()) {
      // Is this an LLVM intrinsic or a target-specific intrinsic?
      unsigned IID = F->getIntrinsicID();
      if (!IID)
        if (const TargetIntrinsicInfo *II = TM.getIntrinsicInfo())
          IID = II->getIntrinsicID(F);

      if (IID) {
        visitIntrinsicCall(I, IID);
        return;
      }
    }
    ...
  }
```





```c++
/// Lower the call to the specified intrinsic function.
void SelectionDAGBuilder::visitIntrinsicCall(const CallInst &I,
                                             unsigned Intrinsic) {
  const TargetLowering &TLI = DAG.getTargetLoweringInfo();
  SDLoc sdl = getCurSDLoc();
  DebugLoc dl = getCurDebugLoc();
  SDValue Res;

  switch (Intrinsic) {
  default:
    // By default, turn this into a target intrinsic node.
    visitTargetIntrinsic(I, Intrinsic);
    return;
  case Intrinsic::vscale: {
    match(&I, m_VScale(DAG.getDataLayout()));
    EVT VT = TLI.getValueType(DAG.getDataLayout(), I.getType());
    setValue(&I,
             DAG.getVScale(getCurSDLoc(), VT, APInt(VT.getSizeInBits(), 1)));
    return;
  }
  case Intrinsic::vastart:  visitVAStart(I); return;
  case Intrinsic::vaend:    visitVAEnd(I); return;
  case Intrinsic::vacopy:   visitVACopy(I); return;
  ...    
  case Intrinsic::debugtrap:
  case Intrinsic::trap: {
    StringRef TrapFuncName =
        I.getAttributes()
            .getAttribute(AttributeList::FunctionIndex, "trap-func-name")
            .getValueAsString();
    if (TrapFuncName.empty()) {
      ISD::NodeType Op = (Intrinsic == Intrinsic::trap) ?
        ISD::TRAP : ISD::DEBUGTRAP;
      DAG.setRoot(DAG.getNode(Op, sdl,MVT::Other, getRoot()));
      return;
    }
    TargetLowering::ArgListTy Args;

    TargetLowering::CallLoweringInfo CLI(DAG);
    CLI.setDebugLoc(sdl).setChain(getRoot()).setLibCallee(
        CallingConv::C, I.getType(),
        DAG.getExternalSymbol(TrapFuncName.data(),
                              TLI.getPointerTy(DAG.getDataLayout())),
        std::move(Args));

    std::pair<SDValue, SDValue> Result = TLI.LowerCallTo(CLI);
    DAG.setRoot(Result.second);
    return;
  }
  ...
}
```



指令选择阶段`ISD::TRAP`(中括号内是选择的pattern)会被选择成`PPC::TRAP`。

```c++
2060 let isTerminator = 1, isBarrier = 1, hasCtrlDep = 1 in
2061 def TRAP  : XForm_24<31, 4, (outs), (ins), "trap", IIC_LdStLoad, [(trap)]>;
```





visit阶段新建立BB，参考visitCatchRet。多试几个这种指令，看是否会新建BB。

该指令已经被加入`HANDLE_TERM_INST  ( 9, CatchRet      , CatchReturnInst)`




