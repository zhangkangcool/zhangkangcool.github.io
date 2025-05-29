



https://www.zhihu.com/question/315440674/answer/684957277

```
作者：狗肉 花与果
链接：https://www.zhihu.com/question/315440674/answer/684957277
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

lib/Target下找个相近的学习就行了。当然，你的架构要是特别特立独行，那还是得费些功夫的。一，先把xxxTargetMachine，xxxInstrInfo, xxxRegisterInfo, AsmParser，InstPrinter, Disassemble，MCTargetDesc等做了 就能实现汇编和反汇编了。当然relocation相关还得弄下linker。指令不太多，比如两三百条的，撑死一个人月能做完。二，实现基本的指令选择，LLVM大体分几步LLVM IR -> SelectionDAG -> MachineInstr DAG -> MCInst那么要做的就是1.xxxISelLowering定义IR到DAG的转换。这个复杂程度完全取决于你的指令集。自己写着玩玩的话，能legal就legal，不行就expand，实在不行才考虑custom。2.xxxISelDAGToDAG定义SelectionDAG到MachineInstr DAG的转换，也就是指令选择。能在xxxInstrInfo.td里用pattern表示的就直接写好了，不能就在Select函数里自己switch case吧。不考虑优化的话，其实就是个体力活。3. MachineInstr DAG 到MCInst更是体力活，MCInst是汇编器内部对指令的一种表示结构，跟MachineInstr之间的对应关系基本没啥可琢磨的了，照着指令集做就行了。三，然后是xxxFrameLowering和xxxCallingConv，负责调用约定相关。无外乎是参数传递，prelogue和epilogue，FrameIndex怎么计算等等。还有比如alloca怎么处理，栈是不是需要dynamic realign，什么时候用sp，什么时候用fp，怎么保存，恢复等等。都是细节，没难度就是杂乱，细心点，别写错了就行。再有寄存器分配可以用LLVM自带的，重载下比如寄存器如何spill/restore等函数就凑合了。scheduler看你自己需要了，典型List scheduling的话，LLVM框架也弄好了，自己弄个HazardRecognizer也能凑合了。到这一个提供基本支持的后端已经有了。我估摸着这种程度6个人月怎么也够了。当然，前提是你的指令集不是特别特立独行，能符合LLVM的预设。举个例子，LLVM默认汇编的第一个token是mnemonic。如果是，AsmParser写起来很简单。如果不是，那么从tablegen改起吧。如果汇编形式更特别一点，比如hexagon那样，恭喜你，整个自己写吧。类似的还有指令选择。最后，如果不是写着玩，而是要正经做个商用的，恭喜你，到这千里之行刚出门。
```

