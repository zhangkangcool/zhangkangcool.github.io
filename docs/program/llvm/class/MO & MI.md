

```c++
for (unsigned i = getDesc().getNumOperands(), e = getNumOperands(); i!= e; ++i)
  MachineOperand &MO = getOperand(i);
  
for (unsigned i = Desc.getNumOperands(), e = OldMI.getNumOperands();

  

for (const MachineOperand &MO : MI->operands())
for (const MachineOperand &MO : MI.implicit_operands())
for (MachineOperand &MO : MI.explicit_operands())
for (MachineOperand &MO : reverse(MI.explicit_uses()))
for (const MachineOperand &MO : MI->defs())
for (MachineOperand &MO : MI.uses())
for (const MachineBasicBlock &MBB : MF) 
for (const MachineBasicBlock *Succ : MBB->successors())
for (const MachineBasicBlock *Pred : MBB->predecessors()) 

MachineFunction::const_iterator MBBI = std::next(MBB->getIterator());


```





`llvm/llvm/lib/CodeGen/LiveVariables.cpp`

`llvm-lit -a ~/llvm/llvm/test/CodeGen/PowerPC/test_call_aix.ll`

```c++
    if (MO.isRegMask()) {
      MI.dump();
      //   BL_NOP <mcsymbol .foo>, <regmask $cr2 $cr3 $cr4 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f25 $f26 $f27 $f28 $f29 $f30 $f31 $r13 $r14 $r15 $r16 $r17 $r18 $r19 $r20 $r21 $r22 $r23 $r24 and 19 more...>, implicit-def dead $lr, implicit $rm, implicit $r2, implicit-def $r1

      dbgs() << "MI.Desc().getNumOperands: " << MI.getDesc().getNumOperands() << "\n";
      // MI.Desc().getNumOperands: 1

      dbgs() << "MI.getNumOperands: " << MI.getNumOperands() << "\n";
      // MI.getNumOperands: 6

      for (const MachineOperand &MO : MI.operands())
        MO.dump();
        // <mcsymbol .foo>
        // <regmask $cr2 $cr3 $cr4 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f25 $f26 $f27 $f28 $f29 $f30 $f31 $r13 $r14 $r15 $r16 $r17 $r18 $r19 $r20 $r21 $r22 $r23 $r24 and 19 more...>
        // implicit-def dead $lr
        // implicit $rm
        // implicit $r2
        // implicit-def $r1

      for (const MachineOperand &MO : MI.implicit_operands())
        MO.dump();
      // <regmask $cr2 $cr3 $cr4 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f25 $f26 $f27 $f28 $f29 $f30 $f31 $r13 $r14 $r15 $r16 $r17 $r18 $r19 $r20 $r21 $r22 $r23 $r24 and 19 more...>
      // implicit-def dead $lr
      // implicit $rm
      // implicit $r2
      // implicit-def $r1

      for (const MachineOperand &MO : MI.explicit_operands())
        MO.dump();
      // <mcsymbol .foo>

      MO.dump();
      // <regmask $cr2 $cr3 $cr4 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f25 $f26 $f27 $f28 $f29 $f30 $f31 $r13 $r14 $r15 $r16 $r17 $r18 $r19 $r20 $r21 $r22 $r23 $r24 and 19 more...>
      assert(false);
      RegMasks.push_back(i);
      continue;
    }
```





```
MI.getDesc().getNumOperands() 不包括implicit OP,只有explicit op
MI.getNumOperands() 包括所有的op
implicit包括regMask
```





Regmask是在CALL指令上用的，比如：

regmask表示foo函数会用哪些reg，基本上是一些CSR reg。

```
BL_NOP <mcsymbol .foo>, <regmask $cr2 $cr3 $cr4 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f25 $f26 $f27 $f28 $f29 $f30 $f31 $r13 $r14 $r15 $r16 $r17 $r18 $r19 $r20 $r21 $r22 $r23 $r24 and 19 more...>, implicit-def dead $lr, implicit $rm, implicit $r2, implicit-def $r1
```




