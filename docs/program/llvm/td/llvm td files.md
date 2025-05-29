# 1 include/llvm/IR/IntrinsicsPowerPC.td

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
include/llvm/CodeGen/ISDOpcodes.h
- INTRINSIC_WO_CHAIN
```
RESULT = INTRINSIC_WO_CHAIN(INTRINSICID, arg1, arg2,...)，
```
表示没有副作用的目标机器固有函数。第一个操作数是来自llvm::Intrinsic名字空间的该固有函数的ID号，后跟该固有函数的操作数。该节点返回该固有函数的结果。

When you def the Intrinsic, you use the flag `IntrNoMem`:
```
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
```
RESULT, OUTCHAIN = INTRINSIC_W_CHAIN(INCHAIN,INTRINSICID, arg1, ...)
```
表示返回一个结果的有副作用的目标机器固有函数。第一个操作数是链指针，第二个是来自llvm::Intrinsic名字空间的该固有函数的ID号，后跟该固有函数的操作数。该节点返回两个结果，该固有函数的结果与输出链。

When you def the Intrinsic which has return vaule, and not use the flag `IntrNoMem`
```
1158 // Extended mnemonics
1159 def int_ppc_tendall : GCCBuiltin<"__builtin_tendall">,
1160       Intrinsic<[llvm_i32_ty], [], []>;
1161 def int_ppc_tresume : GCCBuiltin<"__builtin_tresume">,
1162       Intrinsic<[llvm_i32_ty], [], []>;
1163 def int_ppc_tsuspend : GCCBuiltin<"__builtin_tsuspend">,
1164       Intrinsic<[llvm_i32_ty], [], []>;
```

- INTRINSIC_VOID
```
OUTCHAIN = INTRINSIC_VOID(INCHAIN, INTRINSICID, arg1,arg2, ...)
```
表示不返回值、有副作用的目标机器固有函数。第一个操作数是链指针，第二个是来自llvm::Intrinsic名字空间的该固有函数的ID号，后跟该固有函数的操作数。

使用上述三个类型封装固有函数调用，无疑将极大地简化对固有函数的处理，除非必要，我们都无需操心固有函数的语义。因此，这里我们无需它们生成对应的SDNodeInfo对象，而是要记住它们的Record对象，因为它们是什么，我们很清楚。
When you def the Intrinsic which has return vaule, and not use the flag `IntrNoMem`
```
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

```
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

# 2 lib/Target/PowerPC/PPCInstrInfo.td
https://www.smwenku.com/a/5b8387032b71776c51e3752f/zh-cn/

https://blog.csdn.net/wuhui_gdnt/article/details/65629125

XXXInstrInfo.td文件中定义的是目标机的指令格式。这种td文件会被TableGen自动生成c++类型文件。下面主要是要讨论该文件中的代码含义。
/home/ken/llvm/build/lib/Target/PowerPC/PPCGenDAGISel.inc
```c++
38154 /* 95846*/  /*SwitchOpcode*/ 8, TARGET_VAL(PPCISD::MFFS),// ->95857
38155 /* 95849*/    OPC_CheckPatternPredicate, 7, // (PPCSubTarget->hasFPU())
38156 /* 95851*/    OPC_MorphNodeTo1, TARGET_VAL(PPC::MFFS), 0,
38157                   MVT::f64, 0/*#Ops*/,
38158               // Src: (PPCmffs:{ *:[f64] }) - Complexity = 3
38159               // Dst: (MFFS:{ *:[f64] })
```

`MTCTR`结点有3个输入，Chain, f64, glue(`OPFL_Chain|OPFL_GlueInput|OPFL_GlueOutput`)

```c++
27904 /* 66393*/  /*SwitchOpcode*/ 27, TARGET_VAL(PPCISD::MTCTR),// ->66423
27905 /* 66396*/    OPC_RecordNode, // #0 = 'PPCmtctr' chained node
27906 /* 66397*/    OPC_CaptureGlueInput,
27907 /* 66398*/    OPC_RecordChild1, // #1 = $rS
27908 /* 66399*/    OPC_Scope, 10, /*->66411*/ // 2 children in Scope
27909 /* 66401*/      OPC_CheckChild1Type, MVT::i32,
27910 /* 66403*/      OPC_EmitMergeInputChains1_0,
27911 /* 66404*/      OPC_MorphNodeTo1, TARGET_VAL(PPC::MTCTR), 0|OPFL_Chain|OPFL_GlueInput|OPFL_GlueOutput,
27912                     MVT::i32, 1/*#Ops*/, 1,
27913                 // Src: (PPCmtctr i32:{ *:[i32] }:$rS) - Complexity = 3
27914                 // Dst: (MTCTR:{ *:[i32] } i32:{ *:[i32] }:$rS)
27915 /* 66411*/    /*Scope*/ 10, /*->66422*/
```



C++类SDNode是构成LLVM的指令选择器所使用的DAG的节点。在Tablegen根据TD文件为指令选择生成的代码中，其核心函数SelectCode就具有原型：SDNode*SelectCode(SDNode *N)，参数N是要进行指令选择的IR形式的DAG，返回值也是SDNode类型，即选中的指令。

TableGen不能直接使用C++类，与之对应，它也有自己的SDNode定义。它主要作为dag值的操作符，描述这个dag所代表的操作、操作数，SDNode派生自TD类SDPatternOperator（这是一个空类）。（在LLVM里，SDNode的定义出现在两处：一是在SelectDAGNodes.h里，是一个C++类。另一处在TargetSelectionDAG.td。每个SelectionDAG节点类型都有一个对应的SDNode定义）。

./include/llvm/Target/TargetSelectionDAG.td







### SDNodeProperty
```
276      classSDNodeProperty;

277      def SDNPCommutative:SDNodeProperty;   // X op Y == Y op X

278      def SDNPAssociative:SDNodeProperty;   // (X op Y) op Z == X op (Y op Z)

279      def SDNPHasChain:SDNodeProperty;   // R/W chain operand and result

280      def SDNPOutGlue:SDNodeProperty;   // Write a flag result

281      def SDNPInGlue: SDNodeProperty;   // Read a flagoperand

282      def SDNPOptInGlue:SDNodeProperty;   // Optionally read a flag operand

283      def SDNPMayStore:SDNodeProperty;   // May write to memory, sets 'mayStore'.

284      def SDNPMayLoad:SDNodeProperty;   // May read memory, sets 'mayLoad'.

285      def SDNPSideEffect:SDNodeProperty;   // Sets 'HasUnmodelledSideEffects'.

286      def SDNPMemOperand:SDNodeProperty;   // Touches memory, has assoc MemOperand

287      def SDNPVariadic:SDNodeProperty;   // Node has variable arguments.

288      def SDNPWantRoot:SDNodeProperty;   // ComplexPattern gets the root of match

289      defSDNPWantParent: SDNodeProperty;   // ComplexPattern gets the parent
--------------------- 
作者：wuhui_gdnt 
来源：CSDN 
原文：https://blog.csdn.net/wuhui_gdnt/article/details/65629125 
版权声明：本文为博主原创文章，转载请附上博文链接！
```

### 2.2 Def
#### 2.2.1 SDNode
```
def CPU0Ret               :    SDNode<"CPU0ISD::Ret", SDTNone, [SDNPHasChain,SDNoptInGlue,SDNPVariadic]>;
```
每个SelectionDAG节点类型都有一个对应的SDNode定义。该函数的原型在llvm/include/llvm/Target/TargetSelectionDAG.td中。
- 第一个参数"CPU0ISD::Ret"指的是这个Node结点的名称。
- 第二个参数是SDTypeProfile类型，它描述了该结点的一些类型要求，详细介绍见下一小节。上面的SDTNone指没有什么要求。
- 第三个参数指的是该结点所应该具有的属性。上面代码中SDNPHasChai的意思是R/W chain operand and result(具体含义自行理解）; SDNPVariadic的含义则是说该结点有可变参数。其余的属性都可以在TargetSelectioDAG.td中找到。上面这段代码应该是定义了一个返回类型的SDNode结点。

#### 2.2.2 SDTypeProfile
```
def  SDT_Cp0Ret        :    SDTypeProfile<0, 1, [SDTCisInt<0>]>;

// 每0个是返回值
// v4i32 = Inst v16i8, v4i32
 68 def SDT_PPCVecReduce4SBS : SDTypeProfile<1, 2, [ SDTCisVT<0,v4i32>,
  69   SDTCisVT<1,v16i8>, SDTCisVT<2,v4i32>
  71 ]>;
  
```
SDTypeProfile的原型也在TargetSelectionDAG.td中。
前两个参数是指有几个结果和几个操作数，因为一个SDNode结点里包括有这些内容。如果第二个参数为-1则说明该操作数个数不定。第三个参数是对操作数类型的约束。如这里的SDTCisInt就说明操作数应该是整型的，0则是代表约束的是第一个操作数。

#### 2.2.3 Operand<i32>
```
def simm8    ：    Operand<i32>{ let DecoderMethod = "DecodeSimm8"; }
```
Operand的原型在llvm/include/llvm/Target/Target.td中。
个人理解是把simm8这个标识当作一个32位的操作数。例如有个8位的数，但是该系统只支持32位的，所以就要进行扩展，这在LLVM中就是SelectionDAG的legalize。

#### 2.2.4 Operand<iPTR>
```
      def men    :    Operand<iPTR>{   

                            let PrintMethod = "printMemOperand";

                            let MIOperandInfo = (ops Cpu0Regs, simm8);

                            let EncoderMethod = "getMemEncoding"; }
```
这是定义了对内存的操作。（？？？）我推测MIOperandInfo定义的是一种寻址方式，如这里就是一个寄存器（CPURegs)加一个立即数（simm8）的方式。

#### 2.2.5 PatLeaf

```
def immSExt8    :    PatLeaf<(imm),[ return isInt<8>(N->getSExtValue()); }]>
```
原型在`TargetSelectionDAG.td`。(imm)是dag类型；N是一个操作数结点，后面就判断该N结点是否为8位的整型，是的话才返回。(但这个的含义也不懂）。给一个8位的立即操作数，之后返回一个常量结点。这样这个常量结点便可以代表这个8位立即数了。至于它是不是8位的立即数就得进行一下判断了。

#### 2.2.6 def addr
```
def addr    :    ComplexPattern<iPTR, 2, "SelectAddr", [frameindex],[SDNPWantParent]>
```
原型在TargetSelectionDAG.td。这应该是为了处理地址模式比较复杂的情况。2是指SelectAddr方法所返回的操作数个数。SelectAddr似乎定义在了XXXDAGToDAGISel。

# PPCRegisterInfo.td(可以看到PPC所有支持的寄存器)

向量寄存器只支持128(个数 * 位数)位

VSFRC包括f8rc和VFRC
```
// Allocate volatiles first, then non-volatiles in reverse order. With the SVR4
// ABI the size of the Floating-point register save area is determined by the
// allocated non-volatile register with the lowest register number, as FP
// register N is spilled to offset 8 * (32 - N) below the back chain word of the
// previous stack frame. By allocating non-volatiles in reverse order we make
// sure that the Floating-point register save area is always as small as
// possible because there aren't any unused spill slots.
def F8RC : RegisterClass<"PPC", [f64], 64, (add (sequence "F%u", 0, 13),
                                                (sequence "F%u", 31, 14))>;
def F4RC : RegisterClass<"PPC", [f32], 32, (add F8RC)>;

def VRRC : RegisterClass<"PPC",
                         [v16i8,v8i16,v4i32,v2i64,v1i128,v4f32,v2f64, f128],
                         128,
                         (add V2, V3, V4, V5, V0, V1, V6, V7, V8, V9, V10, V11,
                             V12, V13, V14, V15, V16, V17, V18, V19, V31, V30,
                             V29, V28, V27, V26, V25, V24, V23, V22, V21, V20)>;

// VSX register classes (the allocation order mirrors that of the corresponding
// subregister classes).
def VSLRC : RegisterClass<"PPC", [v4i32,v4f32,v2f64,v2i64], 128,
                          (add (sequence "VSL%u", 0, 13),
                               (sequence "VSL%u", 31, 14))>;
def VSRC  : RegisterClass<"PPC", [v4i32,v4f32,v2f64,v2i64], 128,
                          (add VSLRC, VRRC)>;

// Register classes for the 64-bit "scalar" VSX subregisters.
def VFRC :  RegisterClass<"PPC", [f64], 64,
                          (add VF2, VF3, VF4, VF5, VF0, VF1, VF6, VF7,
                               VF8, VF9, VF10, VF11, VF12, VF13, VF14,
                               VF15, VF16, VF17, VF18, VF19, VF31, VF30,
                               VF29, VF28, VF27, VF26, VF25, VF24, VF23,
                               VF22, VF21, VF20)>;
def VSFRC : RegisterClass<"PPC", [f64], 64, (add F8RC, VFRC)>;

// Allow spilling GPR's into caller-saved VSR's.
def SPILLTOVSRRC : RegisterClass<"PPC", [i64, f64], 64, (add G8RC, (sub VSFRC,
                (sequence "VF%u", 31, 20),
                (sequence "F%u", 31, 14)))>;

// Register class for single precision scalars in VSX registers
def VSSRC : RegisterClass<"PPC", [f32], 32, (add VSFRC)>;



1404   // CRBITRC Register Class...
1405   const MCPhysReg CRBITRC[] = {
1406     PPC::CR2LT, PPC::CR2GT, PPC::CR2EQ, PPC::CR2UN, PPC::CR3LT, PPC::CR3GT, PPC::CR3EQ, PPC::CR3UN     , PPC::CR4LT, PPC::CR4GT, PPC::CR4EQ, PPC::CR4UN, PPC::CR5LT, PPC::CR5GT, PPC::CR5EQ, PPC::CR5UN,      PPC::CR6LT, PPC::CR6GT, PPC::CR6EQ, PPC::CR6UN, PPC::CR7LT, PPC::CR7GT, PPC::CR7EQ, PPC::CR7UN, PP     C::CR1LT, PPC::CR1GT, PPC::CR1EQ, PPC::CR1UN, PPC::CR0LT, PPC::CR0GT, PPC::CR0EQ, PPC::CR0UN,
1407   };
```



PPC不支持的类型如`v2i32`不会出现在td文件中。

 如果想处理的类型不是支持的最基本类型，必须将结果做Lowering（Type Legalize）

不支持的类型，在指令选择时是无法使用的，这些类型不会出现在指令选择的td文件中。

如： `setOperationAction(ISD::VECREDUCE_ADD, MVT::v2i32, Custom);`

void PPCTargetLowering::ReplaceNodeResults()

setOperationAction(ISD::VECREDUCE_ADD, MVT::v2i32, Custom);



## hasSideEffects

td文件中的hasSideEffects是机器指令属性，他可以在ABI中查找，每个指令后面的有`Special Registers Altered`表明某条指令是否有side effects。那些`Special Registers Altered`是空的指令,如`VEXTRACTUB`的hasSideEffects应该为false。



