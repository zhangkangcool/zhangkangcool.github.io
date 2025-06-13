<h1 align="center">traverse</h1>
http://coyee.com/article/10594-llvm-programmer-s-manual-llvm-4-0-documentation


## 通过`MachineFunction`遍历指令
```c++
  for (MachineFunction::const_iterator MFI = MF.begin(), MFE = MF.end();
       MFI!=MFE; ++MFI) {

    for (MachineBasicBlock::const_instr_iterator MBBI = MFI->instr_begin(),
           MBBE = MFI->instr_end(); MBBI != MBBE; ++MBBI) {
      dbgs() << __LINE__ << " " << *MBBI;
    }
  }
```


## 通过 `Function遍历BasicBlock`
您需要遍历构成Function的所有BasicBlocks。 以下是打印BasicBlock的名称及其包含的Instructions个数的示例:
```c++
// func is a pointer to a Function instance
for (Function::iterator i = func->begin(), e = func->end(); i != e; ++i)
  // Print out the name of the basic block if it has one, and then the
  // number of instructions that it contains
  errs() << "Basic block (name=" << i->getName() << ") has "
             << i->size() << " instructions.\n";
```

## 通过某一BasicBlock遍历所有BasicBlock
遍历所有前驱
```c++
#include "llvm/Support/CFG.h"
BasicBlock *BB = ...;

for (pred_iterator PI = pred_begin(BB), E = pred_end(BB); PI != E; ++PI) {
  BasicBlock *Pred = *PI;
  // ...
}
```
同样，为了迭代继承者，使用succ_iterator/succ_begin/succ_end。

# 遍历指令
## 在BasicBlock中迭代指令

```c++
// blk是一个指向BasicBlock实例的指针
for (BasicBlock::iterator i = blk->begin(), e = blk->end(); i != e; ++i)
   // 下一个语句工作，因为运算符<<（ostream＆，...）重载了指令&
   errs() << *i << "\n";
   
```



## 在BasicBlock中迭代指令

```c++
 for (const MachineInstr &MI : MBB.instrs()) {
```





## 迭代函数中的指令

```c++
#include "llvm/IR/InstIterator.h"

Function *F;
// F是一个指向Function实例的指针
for (inst_iterator I = inst_begin(F), E = inst_end(F); I != E; ++I)
  errs() << *I << "\n";
```



# 遍历所有后继

```c++
for (auto I = CmpBB->succ_begin(), E = CmpBB->succ_end(); I != E; ++I)
```



```c++
MachineFunction::iterator MBBIter = ++MBB->getIterator();
```



# iteration & value

```c++
MachineBasicBlock::pred_iterator PI
(*PI)->getParent();

MachineBasicBlock *MBPtr = *PI;
普陀山
```



# 遍历的对象不能修改

#### `-DLLVM_ENABLE_EXPENSIVE_CHECKS=On`用此选项进行检测

```shell
-          for (MachineBasicBlock::pred_iterator PI = TBB->pred_begin(),
-               PE = TBB->pred_end(); PI != PE; PI++)
-            (*PI)->ReplaceUsesOfBlockWith(TBB, ChainBB);

+          while (!TBB->pred_empty()) {
+            MachineBasicBlock *Pred = *(TBB->pred_end()-1);
+            Pred->ReplaceUsesOfBlockWith(TBB, ChainBB);
+          }

          ChainBB->removeSuccessor(TBB);
// jump to self
          // Update the CFG.
          while (!TBB->pred_empty()) {
            MachineBasicBlock *Pred = *(TBB->pred_end() - 1);
            Pred->ReplaceUsesOfBlockWith(TBB, ChainBB);
          }

          while (!TBB->succ_empty()) {
            MachineBasicBlock *Succ = *(TBB->succ_end() - 1);
            ChainBB->addSuccessor(Succ, MBPI->getEdgeProbability(TBB, Succ));
            TBB->removeSuccessor(Succ);
          }
```



```c++
431  BasicBlock *BeginBB;
     BeginBB->getTerminator() 的类型型是 Instruction *
     BeginBB->getTerminator()->dump();
432   auto LoopSet = std::prev(BeginBB->getTerminator()->getIterator());
```



```c++
  MachineBasicBlock::iterator I(MI);
  removeDeadCode(I, std::next(I));
```





### 迭代mi.operands

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





### Calculate the liveness

```c++
做一个pass,计算并修正liveness
#include "llvm/CodeGen/LivePhysRegs.h"  
  
bool runOnMachineFunction(MachineFunction &MF) override {
  LivePhysRegs LPR;
  for (MachineFunction::reverse_iterator MFI = MF.rbegin(), MFE = MF.rend();
       MFI!=MFE; ++MFI) {
    MFI->clearLiveIns();
    computeAndAddLiveIns(LPR, *MFI);
  //  MFI->dump();
  }
  dbgs() << __LINE__ << " zhangkang\n";
  MF.dump();
  assert(false);
  return false;
}


bool runOnMachineFunction(MachineFunction &MF) override {
  LivePhysRegs LPR;
  for (MachineBasicBlock &MBB : make_range(MF.rbegin(), MF.rend())) {
    MBB.clearLiveIns();
    computeAndAddLiveIns(LPR, MBB);
  //  MFI->dump();
  }
  dbgs() << __LINE__ << " zhangkang\n";
  MF.dump();
  assert(false);
  return false;
}

for (MachineBasicBlock &MBB : make_range(MF.rbegin(), MF.rend())) {
```





```c++
void LiveVariables::analyzePHINodes(const MachineFunction& Fn) {
  for (const auto &MBB : Fn)
    for (const auto &BBI : MBB) {
      if (!BBI.isPHI())
        break;
      for (unsigned i = 1, e = BBI.getNumOperands(); i != e; i += 2)
        if (BBI.getOperand(i).readsReg())
          PHIVarInfo[BBI.getOperand(i + 1).getMBB()->getNumber()]
            .push_back(BBI.getOperand(i).getReg());
    }
}
```





```c++
for (const MachineInstr &MI : MBB.instrs()) 
```







```c++
for (SpecsTy::reverse_iterator I = Specs.rbegin(), E = Specs.rend();
for (auto MI = MBB.rbegin(), E = MBB.rend(); MI != E; ++MI) {
```







```c++
#include "llvm/Support/CFG.h"
BasicBlock *BB = ...;
 
for (pred_iterator PI = pred_begin(BB), E = pred_end(BB); PI != E; ++PI) {
  BasicBlock *Pred = *PI;
  // ...
}

```







```c++
 LI = &getAnalysis<LoopInfoWrapperPass>().getLoopInfo();
```





```c++
237   for (LoopInfo::iterator I = LI->begin(), E = LI->end(); I != E; ++I) {
238     Loop *L = *I;
239     if (!L->getParentLoop())
240       TryConvertLoop(L);
241   }
242


375   BasicBlock *Header = L->getHeader();
376   BasicBlock *Latch = L->getLoopLatch(); // only one latch
377
378   // The loop has only one BasicBlock.
379   if (Latch && Latch == Header) {
380    for (auto &I : *Header) {
381      I.dump();
382    }
383   }
384 }
385
```

