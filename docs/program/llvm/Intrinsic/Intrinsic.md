

clang中使用的是`builtin`

llc中使用的是`intrinsic`



# 1 Target dependent

## include/llvm/IR/IntrinsicsPowerPC.td

http://www.voidcn.com/article/p-tnhyorey-bmq.html

### 1.1 Mem properties

./include/llvm/IR/Intrinsics.td
```c++
  23 // Intr*Mem - Memory properties.  If no property is set, the worst case
  24 // is assumed (it may read and write any memory it can get access to and it may
  25 // have other side effects).
  26
  27 // IntrNoMem - The intrinsic does not access memory or have any other side
  28 // effects.  It may be CSE'd deleted if dead, etc. （no memory, no ch, no gule）
  29 def IntrNoMem : IntrinsicProperty;
  30
  31 // IntrReadMem - This intrinsic only reads from memory. It does not write to
  32 // memory and has no other side effects. Therefore, it cannot be moved across
  33 // potentially aliasing stores. However, it can be reordered otherwise and can
  34 // be deleted if dead.
  35 def IntrReadMem : IntrinsicProperty;
  36
  37 // IntrWriteMem - This intrinsic only writes to memory, but does not read from
  38 // memory, and has no other side effects. This means dead stores before calls
  39 // to this intrinsics may be removed.
  40 def IntrWriteMem : IntrinsicProperty;
  41
  42 // IntrArgMemOnly - This intrinsic only accesses memory that its pointer-typed
  43 // argument(s) points to, but may access an unspecified amount. Other than
  44 // reads from and (possibly volatile) writes to memory, it has no side effects.
  45 def IntrArgMemOnly : IntrinsicProperty;
  46
  47 // IntrInaccessibleMemOnly -- This intrinsic only accesses memory that is not
  48 // accessible by the module being compiled. This is a weaker form of IntrNoMem.
  49 def IntrInaccessibleMemOnly : IntrinsicProperty;
  50
  51 // IntrInaccessibleMemOrArgMemOnly -- This intrinsic only accesses memory that
  52 // its pointer-typed arguments point to or memory that is not accessible
  53 // by the module being compiled. This is a weaker form of IntrArgMemOnly.
  54 def IntrInaccessibleMemOrArgMemOnly : IntrinsicProperty;
  55
  56 // Commutative - This intrinsic is commutative: X op Y == Y op X.
  57 def Commutative : IntrinsicProperty;
  58
  59 // Throws - This intrinsic can throw.
  60 def Throws : IntrinsicProperty;
  61
  62 // NoCapture - The specified argument pointer is not captured by the intrinsic.
  63 class NoCapture<int argNo> : IntrinsicProperty {
  64   int ArgNo = argNo;
  65 }
  66
  67 // Returned - The specified argument is always the return value of the
  68 // intrinsic.
  69 class Returned<int argNo> : IntrinsicProperty {
  70   int ArgNo = argNo;
  71 }
  72
  73 // ReadOnly - The specified argument pointer is not written to through the
  74 // pointer by the intrinsic.
  75 class ReadOnly<int argNo> : IntrinsicProperty {
  76   int ArgNo = argNo;
  77 }
  78
  79 // WriteOnly - The intrinsic does not read memory through the specified
  80 // argument pointer.
  81 class WriteOnly<int argNo> : IntrinsicProperty {
  82   int ArgNo = argNo;
  83 }
  84
  85 // ReadNone - The specified argument pointer is not dereferenced by the
  86 // intrinsic.
  87 class ReadNone<int argNo> : IntrinsicProperty {
  88   int ArgNo = argNo;
  89 }
  90
  91 def IntrNoReturn : IntrinsicProperty;
  92
  93 // IntrCold - Calls to this intrinsic are cold.
  94 // Parallels the cold attribute on LLVM IR functions.
  95 def IntrCold : IntrinsicProperty;
  96
  97 // IntrNoduplicate - Calls to this intrinsic cannot be duplicated.
  98 // Parallels the noduplicate attribute on LLVM IR functions.
  99 def IntrNoDuplicate : IntrinsicProperty;
 100
 101 // IntrConvergent - Calls to this intrinsic are convergent and may not be made
 102 // control-dependent on any additional values.
 103 // Parallels the convergent attribute on LLVM IR functions.
 104 def IntrConvergent : IntrinsicProperty;
 105
 106 // This property indicates that the intrinsic is safe to speculate.
 107 def IntrSpeculatable : IntrinsicProperty;
 108
 109 // This property can be used to override the 'has no other side effects'
 110 // language of the IntrNoMem, IntrReadMem, IntrWriteMem, and IntrArgMemOnly
 111 // intrinsic properties.  By default, intrinsics are assumed to have side
 112 // effects, so this property is only necessary if you have defined one of
 113 // the memory properties listed above.
 114 // For this property, 'side effects' has the same meaning as 'side effects'
 115 // defined by the hasSideEffects property of the TableGen Instruction class.
 116 def IntrHasSideEffects : IntrinsicProperty;
```
属性越具体越好
- If the intrinsic only is only one IR and use register and immediate, you can set it `IntrNoMem`.  No memory, no side effect(no chain, no glue), only data dep.

- If your builtin fuction use pointer parameter or ld store, you can not use this flag. 

- `X-Form` instruction must access the memory, for example `dcbtst`.

  

### 1.2 Three builtin type
`include/llvm/CodeGen/ISDOpcodes.h`

- INTRINSIC_WO_CHAIN
```c++
RESULT = INTRINSIC_WO_CHAIN(INTRINSICID, arg1, arg2,...)，
```
表示没有副作用的目标机器固有函数。第一个操作数是来自`llvm::Intrinsic`名字空间的该固有函数的ID号，后跟该固有函数的操作数。该节点返回该固有函数的结果。

When you def the Intrinsic, you use the flag `IntrNoMem`:
```c++
  46   // Intrinsics for [double]word extended forms of divide instructions
  47   def int_ppc_divwe : GCCBuiltin<"__builtin_divwe">,
  48                       Intrinsic<[llvm_i32_ty], [llvm_i32_ty, llvm_i32_ty],
  49                                 [IntrNoMem]>;
  50   def int_ppc_divweu : GCCBuiltin<"__builtin_divweu">,
  51                        Intrinsic<[llvm_i32_ty], [llvm_i32_ty, llvm_i32_ty],
  52                                  [IntrNoMem]>;
  53   def int_ppc_divde : GCCBuiltin<"__builtin_divde">,
  54                       Intrinsic<[llvm_i64_ty], [llvm_i64_ty, llvm_i64_ty],
  55                                 [IntrNoMem]>;
  56   def int_ppc_divdeu : GCCBuiltin<"__builtin_divdeu">,
  57                        Intrinsic<[llvm_i64_ty], [llvm_i64_ty, llvm_i64_ty],
  58                                  [IntrNoMem]>;
```



- INTRINSIC_W_CHAIN
```c++
RESULT, OUTCHAIN = INTRINSIC_W_CHAIN(INCHAIN,INTRINSICID, arg1, ...)
```
表示返回一个结果的有副作用的目标机器固有函数。第一个操作数是链指针，第二个是来自llvm::Intrinsic名字空间的该固有函数的ID号，后跟该固有函数的操作数。该节点返回两个结果，该固有函数的结果与输出链。

When you def the Intrinsic which has return vaule, and not use the flag `IntrNoMem`
```c++
1158 // Extended mnemonics
1159 def int_ppc_tendall : GCCBuiltin<"__builtin_tendall">,
1160       Intrinsic<[llvm_i32_ty], [], []>;
1161 def int_ppc_tresume : GCCBuiltin<"__builtin_tresume">,
1162       Intrinsic<[llvm_i32_ty], [], []>;
1163 def int_ppc_tsuspend : GCCBuiltin<"__builtin_tsuspend">,
1164       Intrinsic<[llvm_i32_ty], [], []>;
```



- INTRINSIC_VOID

```c++
OUTCHAIN = INTRINSIC_VOID(INCHAIN, INTRINSICID, arg1,arg2, ...)
```
表示不返回值、有副作用的目标机器固有函数。第一个操作数是链指针，第二个是来自llvm::Intrinsic名字空间的该固有函数的ID号，后跟该固有函数的操作数。

使用上述三个类型封装固有函数调用，无疑将极大地简化对固有函数的处理，除非必要，我们都无需操心固有函数的语义。因此，这里我们无需它们生成对应的SDNodeInfo对象，而是要记住它们的Record对象，因为它们是什么，我们很清楚。
When you def the Intrinsic which has return vaule, and not use the flag `IntrNoMem`
```c++
1149 def int_ppc_set_texasr : GCCBuiltin<"__builtin_set_texasr">,
1150       Intrinsic<[], [llvm_i64_ty], []>;
1151 def int_ppc_set_texasru : GCCBuiltin<"__builtin_set_texasru">,
1152       Intrinsic<[], [llvm_i64_ty], []>;
1153 def int_ppc_set_tfhar : GCCBuiltin<"__builtin_set_tfhar">,
1154       Intrinsic<[], [llvm_i64_ty], []>;
1155 def int_ppc_set_tfiar : GCCBuiltin<"__builtin_set_tfiar">,
1156       Intrinsic<[], [llvm_i64_ty], []>;
```

###  

1.3 Intrinsic Definitons

```c++
265 //===----------------------------------------------------------------------===//
 266 // Intrinsic Definitions.
 267 //===----------------------------------------------------------------------===//
 268
 269 // Intrinsic class - This is used to define one LLVM intrinsic.  The name of the
 270 // intrinsic definition should start with "int_", then match the LLVM intrinsic
 271 // name with the "llvm." prefix removed, and all "."s turned into "_"s.  For
 272 // example, llvm.bswap.i16 -> int_bswap_i16.
 273 //
 274 //  * RetTypes is a list containing the return types expected for the
 275 //    intrinsic.
 276 //  * ParamTypes is a list containing the parameter types expected for the
 277 //    intrinsic.
 278 //  * Properties can be set to describe the behavior of the intrinsic.
 279 //
 280 class Intrinsic<list<LLVMType> ret_types,
 281                 list<LLVMType> param_types = [],
 282                 list<IntrinsicProperty> intr_properties = [],
 283                 string name = "",
 284                 list<SDNodeProperty> sd_properties = []> : SDPatternOperator {
 285   string LLVMName = name;
 286   string TargetPrefix = "";   // Set to a prefix for target-specific intrinsics.
 287   list<LLVMType> RetTypes = ret_types;
 288   list<LLVMType> ParamTypes = param_types;
 289   list<IntrinsicProperty> IntrProperties = intr_properties;
 290   let Properties = sd_properties;
 291
 292   bit isTarget = 0;
 293 }
 294
 295 /// GCCBuiltin - If this intrinsic exactly corresponds to a GCC builtin, this
 296 /// specifies the name of the builtin.  This provides automatic CBE and CFE
 297 /// support.
 298 class GCCBuiltin<string name> {
 299   string GCCBuiltinName = name;
 300 }
```



大多数Intrinsic是有机器指令直接相对应的，如果不能对应的，按上面三种情况进行Lowering。如`Intrinsic::thread_pointer`。  也可能是利用libcall对其进行处理。



# 2 Target Independent



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

