<h1 align="center">glue & chain side effect</h1>
### NOTE: Side Effects

这里提到的side effects不是td文件中描述机器指令的hasSideEffects中的。td文件中的hasSideEffects是机器指令属性，他可以在ABI中查找，每个指令后面的有`Special Registers Altered`表明某条指令是否有side effects。那些`Special Registers Altered`是空的指令,如`VEXTRACTUB`的hasSideEffects应该为false。

这时所说的side effects是ISD的指令上的，不是机器指令的。必须注意。

cat `include/llvm/CodeGen/ISDOpcodes.h`

```shell
   /// RESULT = INTRINSIC_WO_CHAIN(INTRINSICID, arg1, arg2, ...)
 146     /// This node represents a target intrinsic function with no side effects.
 147     /// The first operand is the ID number of the intrinsic from the
 148     /// llvm::Intrinsic namespace.  The operands to the intrinsic follow.  The
 149     /// node returns the result of the intrinsic.
 150     INTRINSIC_WO_CHAIN,
 151   LowerINTRINSIC_WO_CHAIN
 152     /// RESULT,OUTCHAIN = INTRINSIC_W_CHAIN(INCHAIN, INTRINSICID, arg1, ...)
 153     /// This node represents a target intrinsic function with side effects that
 154     /// returns a result.  The first operand is a chain pointer.  The second is
 155     /// the ID number of the intrinsic from the llvm::Intrinsic namespace.  The
 156     /// operands to the intrinsic follow.  The node has two results, the result
 157     /// of the intrinsic and an output chain.
 158     INTRINSIC_W_CHAIN,
 159  LowerINTRINSIC_W_CHAIN
 160     /// OUTCHAIN = INTRINSIC_VOID(INCHAIN, INTRINSICID, arg1, arg2, ...)
 161     /// This node represents a target intrinsic function with side effects that
 162     /// does not return a result.  The first operand is a chain pointer.  The
 163     /// second is the ID number of the intrinsic from the llvm::Intrinsic
 164     /// namespace.  The operands to the intrinsic follow.
 165     INTRINSIC_VOID,
 166  LowerINTRINSIC_VOID
```

这里`INTRINSIC_WO_CHAIN`没有副作用，只有一个返回结果

`INTRINSIC_W_CHAIN`有副作用，有两个返回结果，第二个`chain`表示的就是副作用。

`INTRINSI_VOID`有副作用，返回`chian`表示副作用。	





https://stackoverflow.com/questions/33005061/what-are-glue-and-chain-dependencies-in-an-llvm-dag

https://people.cs.nctu.edu.tw/~chenwj/dokuwiki/doku.php?id=llvm

http://lists.llvm.org/pipermail/llvm-dev/2014-June/074046.html


SDNode 之間有 data 或 control (chain, 簡寫 ch) dependency。上圖中黑色箭頭代表 data dependency，藍色箭頭代表 control dependency (注意它指向節點中的 ch 欄位)，紅色箭頭代表兩個節點之間是 glue 的關係 (和 ch 相比，glue 之間不能插入其它節點)。EntryToken 和 TokenFactor 負責 control dependency。GraphRoot 代表 SelectionDAG 的最底層。


一個 DAG 基本對應一個 BasicBlock，DAG 中的每一個節點 (SDNode) 基本對應一條 LLVM IR。TargetSelectionDAG.td 定義了 LLVM IR 對應的 SDNode。SDNode 之間是 producer-consumer 的關係，producer 產生 SDValue 給 consumer。SDValue 有底下三種型別:
```asm
        concrete value type: 對映黑色實線。
        Other: 對映藍色虛線ch。
        Glue: 對映紅色實線。
```

### Side Effect(glue & chain都是用来处理side effects)的

如果输出只取决于输入，则为no side effect.
使用隐匿REG或内存等则有side effect.

### Dependencies as edges

- Data
- Order (“chain”)
- Scheduling (“glue”)

### Chain调度时防止有负作用的结果乱序（修改、使用隐含reg等）

如使用隐式reg,如果是使用显示的寄存器，llvm知道他们之间会有读写关系。

`Chain` dependencies prevent nodes with side effects (including `memory operations` and `explicit register operations`) from being scheduled out of order relative to each other.
- `memory operations` 
- `explicit register operations` 

ch is the last Node in result, and it's the first Node in the input Operand.
```asm
Legalizing: t7: f64,ch = PPCISD::MFFS t0
Legal node: nothing to do
Legalized selection DAG: %bb.0 'test_setrnd_imm1:entry'
SelectionDAG has 9 nodes:
      t9: ch = PPCISD::MTFSB0 t7:1, Constant:i32<31>
    t11: ch = PPCISD::MTFSB1 t9, Constant:i32<30>
  t5: ch,glue = CopyToReg t11, Register:f64 $f1, t7
    t0: ch = EntryToken
  t7: f64,ch = PPCISD::MFFS t0
  t6: ch = PPCISD::RET_FLAG t5, Register:f64 $f1, t5:1
```
Here `t5 == t5:0 == ch`, `t5:1 == glue`
对于任何Node, `t:0 == t`
PPCISD::CALL is chained node
```asm
lib/Target/PowerPC/PPCInstrInfo.td


26781 /* 64292*/  /*SwitchOpcode*/ 85, TARGET_VAL(PPCISD::CALL),// ->64380
26782 /* 64295*/    OPC_RecordNode, // #0 = 'PPCcall' chained node
26783 /* 64296*/    OPC_CaptureGlueInput,
26784 /* 64297*/    OPC_RecordChild1, // #1 = $func
26785 /* 64298*/    OPC_MoveChild1,
26786 /* 64299*/    OPC_SwitchOpcode /*3 cases */, 26, TARGET_VAL(ISD::Constant),// ->64329
26787 /* 64303*/      OPC_SwitchType /*2 cases */, 10, MVT::i32,// ->64316
26788 /* 64306*/        OPC_MoveParent,
26789 /* 64307*/        OPC_EmitMergeInputChains1_0,
26790 /* 64308*/        OPC_EmitConvertToTarget, 1,
```

访问内存并且或使用特定隐式寄存器的指令需要输入Chain，并返回Chain。

### Glue
Glue bind the two nodes together.
`Glue` prevents the two nodes from being broken up during scheduling. It's actually more subtle than that [1], but most of the time you don't need to worry about it. (If you're implementing your own backend that requires two instructions to be adjacent to each other, you really want to be using a pseudoinstruction instead, and expand that after scheduling happens.)

```asm
Black arrows mean data flow dependency
Red arrows mean glue dependency
Blue dashed arrows mean chain dependency
```

### IR Property
- input a chain, output a chain.
- glue is created as the result.
```asm
=== test6
Creating constant: t1: i64 = TargetConstant<5089>
Creating new node: t2: i64,ch = llvm.ppc.get.texasr t0, TargetConstant:i64<5089>
Creating new node: t4: ch,glue = CopyToReg t2:1, Register:i64 $x3, t2
Creating new node: t5: ch = PPCISD::RET_FLAG t4, Register:i64 $x3, t4:1
Initial selection DAG: %bb.0 'test6:entry'
SelectionDAG has 6 nodes:
    t0: ch = EntryToken
  t2: i64,ch = llvm.ppc.get.texasr t0, TargetConstant:i64<5089>
  t4: ch,glue = CopyToReg t2:1, Register:i64 $x3, t2
  t5: ch = PPCISD::RET_FLAG t4, Register:i64 $x3, t4:1
```

For below case:
```asm
 208 SelectionDAG has 9 nodes:
 209         t0: ch = EntryToken
 210       t9: ch,glue = PPCISD::MTFSB0 t0, Constant:i32<31>
 211     t11: ch,glue = PPCISD::MTFSB1 t9, Constant:i32<30>
 212   t5: ch,glue = CopyToReg t11, Register:f64 $f1, PPCISD::MFFS:f64,glue
 213   t6: ch = PPCISD::RET_FLAG t5, Register:f64 $f1, t5:1
```
`213`: `t5:1` is the `glue`, `t5:0` is the `ch`. `t5:0` is equal `t5`, so 
below code is equal
```asm
 211     t11: ch,glue = PPCISD::MTFSB1 t9, Constant:i32<30>
 211     t11: ch,glue = PPCISD::MTFSB1 t9:0, Constant:i32<30>
```

The in glue operand `SDNPOptInGlue` must be in the last, and the in glue operand must be in the first.

# SDNode must has result
/home/shkzhang/llvm/llvm/utils/TableGen/DAGISelMatcherGen.cpp
SDNode必须有结果，或者是Operand，或者是Glue或Chain.
```asm
907   assert((!ResultVTs.empty() || TreeHasOutGlue || NodeHasChain) &&
908          "Node has no result");
```







