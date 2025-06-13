<h1 align="center">ShrinkWarp.cpp</h1>
```shell
// This pass looks for safe point where the prologue and epilogue can be
// inserted.
// The safe point for the prologue (resp. epilogue) is called Save
// (resp. Restore).

A point is safe for prologue (resp. epilogue) if and only if
// it 1) dominates (resp. post-dominates) all the frame related operations and
// between 2) two executions of the Save (resp. Restore) point there is an
// execution of the Restore (resp. Save) point.
//
// For instance, the following points are safe:
// for (int i = 0; i < 10; ++i) {
//   Save
//   ...
//   Restore
// }
// Indeed, the execution looks like Save -> Restore -> Save -> Restore ...
// And the following points are not:
// for (int i = 0; i < 10; ++i) {
//   Save
//   ...
// }
// for (int i = 0; i < 10; ++i) {
//   ...
//   Restore
// }
// Indeed, the execution looks like Save -> Save -> ... -> Restore -> Restore.
//

// Property #1 is ensured via the use of MachineDominatorTree and
// MachinePostDominatorTree.
// Property #2 is ensured via property #1 and MachineLoopInfo, i.e., both
// points must be in the same loop.
// Property #3 is ensured via the MachineBlockFrequencyInfo.

this pass
/// does not rely on expensive data-flow analysis. Instead we use the
/// dominance properties and loop information to decide which point
/// are safe for such insertion.
```



不在开始，结束位置进行保存和恢复，而是推迟保存和提前恢复。

## pass progress

```shell
529 zhangkang PostRA Machine Sink
534 zhangkang After PostRA Machine Sink
529 zhangkang Shrink Wrapping analysis
534 zhangkang After Shrink Wrapping analysis
529 zhangkang Prologue/Epilogue Insertion & Frame Finalization
534 zhangkang After Prologue/Epilogue Insertion & Frame Finalization
```



```shell
498   savePoint:       ''                            |   498   savePoint:       '%bb.1'
499   restorePoint:    ''                            |   499   restorePoint:    '%bb.1'
```





### 自然循环(natural loops)就是只有单一入口的循环。(无goto)

两个自然循环要么完全不相交，要么嵌套。对于没有goto语句的语言，所有的循环都是自然循环。一般循环可能存在多个到循环体的入口，如通过goto语句直接跳转到一个循环的循环体中。如果一个控制流图仅通过如下T1和T2两种变换能化简为一个节点，则称该控制流图是可化简的(reducible)：

- 1: 如果节点n有唯一的前驱，那么将其和其前驱合并为一个节点

- 2: 如果节点存在到自身的边，那么将该边删除。

没有循环的控制流图都是可约简的，对存在循环的控制流图，当且仅当所有循环是自然循环时此图是可化简的。有一些程序分析算法只对可化简的控制流图有效(ShrinkWrap)。

Reduciable只有一个入口。



```asm
/// Check if \p MI uses or defines a callee-saved register or
  /// a frame index. If this is the case, this means \p MI must happen
  /// after Save and before Restore.
  bool useOrDefCSROrFI(const MachineInstr &MI, RegScavenger *RS) const;
```



### Save & Restore move out of the loop

```asm
 // For now, just push the restore/save points outside of loops.
 // FIXME: Refine the criteria to still find interesting cases
 // for loops.
```



通过dominate和post dominate和MFI来进行移动，找到Save & Restore.

https://reviews.llvm.org/D36504: Convert uncond. branch to return into a return to help with shrink-wrapping, do it in CGP, it's not a good place.



通过数据流方程来算Save或Restore(data-flow analysis).

鲸书中所使用的算法(LLVM ShrinkWrap的注释中有提到该方法)，可预见的地方插入Save,可用的地方插入Restore。

可预见(Anticipatable)：此点开始的每一条执行路径都包含该Reg的定义和使用(后面每条路径都会定义或使用Reg)。

可用的(Available)：到达那一点的每一条执行路径都包含该Reg的定义或使用(之前每条路径都会定义或使用Reg)。



MDT->addNewBlock(NewMBB, dominate);

NewMBB的直接domindte。



## Tobey new method

Story 28857

https://compjazz.torolab.ibm.com:9443/jazz/web/projects/XL%20Compilers#action=com.ibm.team.workitem.viewWorkItem&id=28857

Post Register Allocation Spill Code Optimization

Implement new shrinking wrapping algorithm

Task 111946



Llvm

https://lists.llvm.org/pipermail/llvm-dev/2017-August/116131.html



F. Chow. Minimizing register usage penalty at procedure

calls. In *Proceedings of Conference on Programming Lan-*

*guage Design and Implementation*, June 1988.

```asm
 /// Class to determine where the safe point to insert the
103 /// prologue and epilogue are.
104 /// Unlike the paper from Fred C. Chow, PLDI'88, that introduces the
105 /// shrink-wrapping term for prologue/epilogue placement, this pass
106 /// does not rely on expensive data-flow analysis. Instead we use the
107 /// dominance properties and loop information to decide which point
108 /// are safe for such insertion.
```

