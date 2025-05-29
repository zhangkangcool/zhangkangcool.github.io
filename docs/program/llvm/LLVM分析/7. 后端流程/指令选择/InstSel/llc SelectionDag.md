https://people.cs.nctu.edu.tw/~chenwj/dokuwiki/doku.php?id=llvm

# Print the SelectionDAG graph

```
[ken@lep824e1v:~/wyvern/add_64unsigned]$ llc -help-hidden | grep view | grep dags
  -filter-view-dags=<string>                        - Only display the basic block whose name matches this for all view-*-dags options
  -view-block-freq-propagation-dags                 - Pop up a window to show a dag displaying how block frequencies propagation through the CFG.
  -view-dag-combine-lt-dags                         - Pop up a window to show dags before the post legalize types dag combine pass
  -view-dag-combine1-dags                           - Pop up a window to show dags before the first dag combine pass
  -view-dag-combine2-dags                           - Pop up a window to show dags before the second dag combine pass
  -view-isel-dags                                   - Pop up a window to show isel dags as they are selected
  -view-legalize-dags                               - Pop up a window to show dags before legalize
  -view-legalize-types-dags                         - Pop up a window to show dags before legalize types
  -view-machine-block-freq-propagation-dags         - Pop up a window to show a dag displaying how machine block frequencies propagate through the CFG.
  -view-misched-dags                                - Pop up a window to show MISched dags after they are processed
  -view-sched-dags                                  - Pop up a window to show sched dags as they are processed
  -view-sunit-dags                                  - Pop up a window to show SUnit dags after they are processed

```

The order:
```
  -view-dag-combine1-dags                           - Pop up a window to show dags before the first dag combine pass
  -view-legalize-types-dags                         - Pop up a window to show dags before legalize types
  -view-dag-combine-lt-dags                         - Pop up a window to show dags before the post legalize types dag combine pass
  -view-legalize-dags                               - Pop up a window to show dags before legalize
  -view-dag-combine2-dags                           - Pop up a window to show dags before the second dag combine pass
  -view-isel-dags                                   - Pop up a window to show isel dags as they are selected
  -view-sched-dags                                  - Pop up a window to show sched dags as they are processed
  -view-sunit-dags                                  - Pop up a window to show SUnit dags after they are processed
```

SDNode 之間有 data 或 control (chain, 簡寫 ch) dependency。上圖中黑色箭頭代表 data dependency，藍色箭頭代表 control dependency (注意它指向節點中的 ch 欄位)，紅色箭頭代表兩個節點之間是 glue 的關係 (和 ch 相比，glue 之間不能插入其它節點)。EntryToken 和 TokenFactor 負責 control dependency。GraphRoot 代表 SelectionDAG 的最底層。每個節點中間一欄代表其 operator (ISD::NodeType)，上面一欄代表其輸入，下面一欄代表其輸出。

SelectionDAG 主要有底下幾個流程 (SelectionDAGISel::CodeGenAndEmitDAG()):

- 1 Lower: 將 LLVM IR 轉換成 SelectionDAG (SelectionDAGISel::SelectAllBasicBlocks)。
```
# Pop up a window to show dags before the first dag combine pass
$ llc -view-dag-combine1-dags sum.ll
```
- 2 Combine: 將若干 SDNode 合成一個 SDNode (SelectionDAG::Combine())。
```
# Pop up a window to show dags before legalize types
$ llc -view-legalize-types-dags sum.ll
```

- 3 Legalize Type: 將目標平台不支援的型別轉換成支援的型別 (SelectionDAG::LegalizeTypes())。
```
# Pop up a window to show dags before the post legalize types dag combine pass
$ llc -view-dag-combine-lt-dags sum.ll
```

- 4 Legalize Vector: 將目標平台不支援的向量型別轉換成支援的型別。
```
# Pop up a window to show dags before legalize
$ llc -view-legalize-dags sum.ll
```

- 5 Legalize Op: 將目標平台不支援的運算轉換成支援的運算。
```
# Pop up a window to show dags before the second dag combine pass
$ llc -view-dag-combine2-dags sum.ll
```

- 6 Combine: 將若干 SDNode 合成一個 SDNode。
```
# Pop up a window to show isel dags as they are selected
$ llc -view-isel-dags sum.ll
```

- 7 Select: SDNode (平台無關) → SDNode (平台相關)。
```
# Pop up a window to show sched dags as they are processed
$ llc -view-sched-dags sum.ll
```

- 8 Schedule: 完成指令調度。
```
# Pop up a window to show SUnit dags after they are processed
$ llc -view-sunit-dags sum.ll
```

# using the dot tool
windows: graph install and use
https://blog.csdn.net/lanchunhui/article/details/49472949
```
dot D:\test\1.gv -Tpng -o image.png
```

# Selection Instruction flow
```C
Target/PowerPC/PPCISelDAGTODAG.cpp 
  class PPCDAGToDAGISel : public SelectionDAGISel
```

```C
CodeGen/SelectionDAG/SelectionDAGISel.cpp


  // Initial selection DAG
  CurDAG->dump();



```





```
SelectionDAGISel::runOnMachineFunction() ->
SelectAllBasicBlocks() ->
SelectBasicBlock() ->
CodeGenAndEmitDAG() ->
combine & legal
DoInstructionSelection() ->
Select()虚函数，具体架构中实现 ->
PPCDAGToDAGISel::Select()
PPCGenDAGISel.inc:SelectCode() // 定义在td文件所生成的inc文件中，用td文件自动进行选择的部分。
```





SelectionDAGISel.cpp: CodeGenAndEmitDAG

```C
  dag-combine1 input for: (view-dag-combine1-dags:before combine1)
  // Run the DAG combiner in pre-legalize mode.
  CurDAG->Combine(BeforeLegalizeTypes, AA, OptLevel);

  Optimized lowered selection DAG
  CurDAG->dump();
```

```C
  legalize-types input for: (-view-legalize-types-dags: before legalize types)
  changed = CurDAG->LegalizeTypes();
  Type-legalized selection DAG
  CurDAG->dump();


  if (Changed)
  {
    dag-combine-lt input for: (view-dag-combine-lt-dags: DAG Combining after legalize types)
    CurDAG->Combine(AfterLegalizeTypes, AA, OptLevel);
  }

  Optimized type-legalized selection DAG:
  CurDAG->dump();

  Vector Legalization
  Changed = CurDAG->LegalizeVectors();
  if (changed)
  {
    Vector-legalized selection DAG:
    CurDAG->dump();
    dag-combine-lv input for: ( view-dag-combin-lt-dags: DAG Combining after legalize vectors)
    CurDAG->Combine(AfterLegalizeTypes, AA, OptLevel);
  }

  Optimized type-legalized selection DAG:
  CurDAG->dump();

```

```C
  legalize input for: (view-legalize-dags: DAG Legalization)
  CurDAG->Legalize();
  CurDAG->dump());

  dag-combine2 input for (view-dag-combine2-dags: before the second dag combine pass)
  CurDAG->Combine(AfterLegalizeDAG, AA, OptLevel);
  CurDAG->dump();

  Instruction Selection (view-isel-dags: isel dags as they are selected) 
  DoInstructionSelection();
  CurDAG->dump());
  

    CurDAG->Combine(BeforeLegalizeTypes, AA, OptLevel);
```



```c++
/// This is the entry point for the file.
void SelectionDAG::Combine(CombineLevel Level, AliasAnalysis *AA,
                           CodeGenOpt::Level OptLevel) {
  /// This is the main entry point to this class.
  DAGCombiner(*this, AA, OptLevel).Run(Level);
}



void DAGCombiner::Run(CombineLevel AtLevel) {
   CombinedNodes.insert(N);
    for (const SDValue &ChildN : N->op_values())
      if (!CombinedNodes.count(ChildN.getNode()))
        AddToWorklist(ChildN.getNode());

    SDValue RV = combine(N);   // DAGCombiner::combine

    if (!RV.getNode())
      continue;

    ++NodesCombined;
}
```





SelectionCode: CodeGen/SelectionDAG/SelectionDAGISel

```c++
  SelectionDAGISel::DoInstructionSelection() {
      ...
    Select() {  // Select\(SDNode虚函数，具体架构中实现，如PPCDAGToDAGISel::Select(SDNode *N);
       手动选择部分
       SelectCode() // 定义在td文件所生成的inc文件中，用td文件自动进行选择的部分。
    }  
  }
```

```C++
  scheduler input for (view-sched-dags: after Instruction Scheduling)
  Scheduler->Run(CurDAG, FuncInfo->MBB)

  view-sunit-dags show SUnit dags after they are processed
```

# Combine Lowering InstructionSelection

Combine是将多条指令进行合并操作

#### ./CodeGen/SelectionDAG/DAGCombiner.cpp

```C
SDValue DAGCombiner::combine(SDNode *N) {
...
  // visit() will call the visitABS() to do some generic combine().
  SDValue RV = visit(N);
  
  
      // call the virtual function to do the Machine combine.
      RV = TLI.PerformDAGCombine(N, DagCombineInfo);
     
}

SDValue DAGCombiner::visit(SDNode *N) {
  switch (N->getOpcode()) {
  default: break;
  case ISD::TokenFactor:        return visitTokenFactor(N);
  case ISD::MERGE_VALUES:       return visitMERGE_VALUES(N);
  case ISD::ADD:                return visitADD(N);
  case ISD::SUB:                return visitSUB(N);
  case ISD::SADDSAT:
  case ISD::UADDSAT:            return visitADDSAT(N);
  case ISD::SSUBSAT:
  case ISD::USUBSAT:            return visitSUBSAT(N);
  case ISD::ADDC:               return visitADDC(N)
...
}
```

#### ./CodeGen/SelectionDAG/TargetLowering.cpp
```C
virtual SDValue TargetLowering::PerformDAGCombine(SDNode *N,
                                          DAGCombinerInfo &DCI) const {
  // Default implementation: no optimization.
  return SDValue();
}
```

##### NOTICE: The combine is dispatch by the drived class PerformDAGCombine()
####PowerPC/PPCISelLowering.cpp(combine)

机器相关的优化可以加在这里。

```c++
DAGCombinerInfo中的成员
enum CombineLevel {
  BeforeLegalizeTypes,
  AfterLegalizeTypes,
  AfterLegalizeVectorOps,
  AfterLegalizeDAG
}

SDValue PPCTargetLowering::PerformDAGCombine(SDNode *N,
                                             DAGCombinerInfo &DCI) const {
  SelectionDAG &DAG = DCI.DAG;
  SDLoc dl(N);
  switch (N->getOpcode()) {
  default: break;
  case ISD::SHL:
    return combineSHL(N, DCI);
  case ISD::SRA:
    return combineSRA(N, DCI);
  ...
```



### PowerPC/PPCISelLowering.cpp(lower)

```c++
 /// LowerOperation - Provide custom lowering hooks for some operations.
///
SDValue PPCTargetLowering::LowerOperation(SDValue Op, SelectionDAG &DAG) const {
  switch (Op.getOpcode()) {
  default: llvm_unreachable("Wasn't expecting to be able to lower this!");
  case ISD::ConstantPool:       return LowerConstantPool(Op, DAG);
  case ISD::BlockAddress:       return LowerBlockAddress(Op, DAG);
  case ISD::GlobalAddress:      return LowerGlobalAddress(Op, DAG);
  case ISD::GlobalTLSAddress:   return LowerGlobalTLSAddress(Op, DAG);
  case ISD::JumpTable:          return LowerJumpTable(Op, DAG);
  case ISD::SETCC:              return LowerSETCC(Op, DAG);
  case ISD::INIT_TRAMPOLINE:    return LowerINIT_TRAMPOLINE(Op, DAG);
  case ISD::ADJUST_TRAMPOLINE:  return LowerADJUST_TRAMPOLINE(Op, DAG);
      
}
```





# Create new instruction

```c++
   /// This enum indicates whether operations are valid for a target, and if not,
   /// what action should be used to make them valid.
   enum LegalizeAction : uint8_t {
     Legal,      // The target natively supports this operation.
     Promote,    // This operation should be executed in a larger type.
     Expand,     // Try to expand this to other ops, otherwise use a libcall.
     LibCall,    // Don't try to expand this to other ops, always use a libcall.
     Custom      // Use the LowerOperation hook to implement custom lowering.
   };
 
   /// This enum indicates whether a types are legal for a target, and if not,
   /// what action should be used to make them valid.
   enum LegalizeTypeAction : uint8_t {
     TypeLegal,           // The target natively supports this type.
     TypePromoteInteger,  // Replace this integer with a larger one.
     TypeExpandInteger,   // Split this integer into two of half the size.
     TypeSoftenFloat,     // Convert this float to a same size integer type.
     TypeExpandFloat,     // Split this float into two of half the size.
     TypeScalarizeVector, // Replace this one-element vector with its element.
     TypeSplitVector,     // Split this vector into two of half the size.
     TypeWidenVector,     // This vector should be widened into a larger vector.
     TypePromoteFloat     // Replace this float with a larger one.
   };
```



https://llvm.org/docs/WritingAnLLVMBackend.html#the-selectiondag-legalize-phase

https://blog.csdn.net/jinweifu/article/details/54132939



# ISD & PPCISD

combine & lower是在ISD/PPCISD上做的。

`llvm/llvm/include/llvm/CodeGen/ISDOpcodes.h`

`llvm/llvm/lib/Target/PowerPC/PPCISelLowering.h`



# 指令选择之后，得到的是TargetOpcode

`PPC::ANDIo`

Combine and Lowering is before the instruction selection.

`Lowering`

![image-20190613171953520](assets/image-20190613171953520.png)

![image-20190613172041808](assets/image-20190613172041808.png)



### Type Legalize

 如果想处理的类型不是支持的最基本类型，可以在Lowering中将其转化为合法的类型。

不支持的类型，在指令选择时是无法使用的，这些类型不会出现在指令选择的td文件中。

如： `setOperationAction(ISD::ATOMIC_CMP_SWAP, MVT::i32, Custom)`

void PPCTargetLowering::ReplaceNodeResults()

setOperationAction(ISD::VECREDUCE_ADD, MVT::v2i32, Custom);



------------------------

### 伪指令

如果选择的是一条`PPCCustomInserterPseudo`定义的PPC伪指令的话，需要在`Lowering::EmitInstrWithCustomInserter`中进一步处理成PPC支持的指令。如 [setrnd](https://github.com/llvm/llvm-project/commit/05f78b35ae82e371bfa478d02c482c6825c5fd80)

```asm
// Set the float rounding mode.
let Uses = [RM], Defs = [RM] in { 
def SETRNDi : PPCCustomInserterPseudo<(outs f8rc:$FRT), (ins u2imm:$RND),
                    "#SETRNDi", [(set f64:$FRT, (int_ppc_setrnd (i32 imm:$RND)))]>;

def SETRND : PPCCustomInserterPseudo<(outs f8rc:$FRT), (ins gprc:$in),
                    "#SETRND", [(set f64:$FRT, (int_ppc_setrnd gprc :$in))]>;
}


 // SELECT_* pseudo instructions, like SELECT_CC_* but taking condition
  // register bit directly.
  def SELECT_I4 : PPCCustomInserterPseudo<(outs gprc:$dst), (ins crbitrc:$cond,
                          gprc_nor0:$T, gprc_nor0:$F), "#SELECT_I4",
                          [(set i32:$dst, (select i1:$cond, i32:$T, i32:$F))]>;
  def SELECT_I8 : PPCCustomInserterPseudo<(outs g8rc:$dst), (ins crbitrc:$cond,
                          g8rc_nox0:$T, g8rc_nox0:$F), "#SELECT_I8",
                          [(set i64:$dst, (select i1:$cond, i64:$T, i64:$F))]>;
```



`./PPCISelLowering.cpp` 用`PPCCustomInserterPseudo`定义的伪指令，必须在`EmitInstrWithCustomInserter`中进行Lowering，未处理的伪指令会报错。

```c++
MachineBasicBlock *
PPCTargetLowering::EmitInstrWithCustomInserter(MachineInstr &MI,
                                               MachineBasicBlock *BB) const {
     } else if (MI.getOpcode() == PPC::SETRNDi) {
    DebugLoc dl = MI.getDebugLoc();
    Register OldFPSCRReg = MI.getOperand(0).getReg();

    // Save FPSCR value.
    BuildMI(*BB, MI, dl, TII->get(PPC::MFFS), OldFPSCRReg);

    // The floating point rounding mode is in the bits 62:63 of FPCSR, and has
    // the following settings:
    //   00 Round to nearest
    //   01 Round to 0
    //   10 Round to +inf
    //   11 Round to -inf

    // When the operand is immediate, using the two least significant bits of
    // the immediate to set the bits 62:63 of FPSCR.
    unsigned Mode = MI.getOperand(1).getImm();
    BuildMI(*BB, MI, dl, TII->get((Mode & 1) ? PPC::MTFSB1 : PPC::MTFSB0))
      .addImm(31);

    BuildMI(*BB, MI, dl, TII->get((Mode & 2) ? PPC::MTFSB1 : PPC::MTFSB0))
      .addImm(30);
  } else if (MI.getOpcode() == PPC::SETRND) {
  
  }
}
```

------------

### Instruction

##### ISD::SELECT

`ISD::SELECT`会在指令选择中被匹配成`PPC::SELECT_I4`系列伪指令，然后对`PPC::SELECT_I4`进行Lowering，使用实际所支持的PPC指令。

中括号是匹配规则，其中的select是指的ISD::SELECT。

```asm
  // SELECT_* pseudo instructions, like SELECT_CC_* but taking condition
  // register bit directly.
  def SELECT_I4 : PPCCustomInserterPseudo<(outs gprc:$dst), (ins crbitrc:$cond,
                          gprc_nor0:$T, gprc_nor0:$F), "#SELECT_I4",
                          [(set i32:$dst, (select i1:$cond, i32:$T, i32:$F))]>;
  def SELECT_I8 : PPCCustomInserterPseudo<(outs g8rc:$dst), (ins crbitrc:$cond,
                          g8rc_nox0:$T, g8rc_nox0:$F), "#SELECT_I8",
                          [(set i64:$dst, (select i1:$cond, i64:$T, i64:$F))]>;
```



#### ISD::SETCC

`SETCC`目前没有出现在中括号里如（ISD::SELECT），出现在了Pat<中,然后会继续去选择。如继续选择`PPC::EXTRACT_SUBREG`和`ISD::FCMPUS`

```asm
def : Pat<(ISD::Node), (PPC::Node)>
```





```asm
let Predicates = [HasFPU] in {
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETOLT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_lt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETLT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_lt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETOGT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_gt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETGT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_gt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETOEQ)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_eq)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETEQ)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_eq)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETUO)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_un)>;
```



## TargetOpcode

./include/llvm/Support/TargetOpcodes.def

```
This file defines the target independent instruction opcodes.
```





#### EXTRACT_SUBREG

PPC::EXTRACT_SUBREG的处理是在CodeGen的代码中，其中有`TargetOpcode::EXTRACT_SUBREG`。会在`./SelectionDAG/SelectionDAG.cpp` 和`./SelectionDAG/InstrEmitter.cpp`中进行处理。





`LLVM IR -> ISD(ISD::/PPCISD::) -> MI(PPC::)`