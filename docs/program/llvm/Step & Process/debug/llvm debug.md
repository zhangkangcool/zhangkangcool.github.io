# GDB
### print I.dump()



# llvm 

```shell
#include "llvm/Support/Debug.h"

dbgs() << __LINE__ << " zhangkang\n";
```



# print in clang & llvm

```CPP
#include "llvm/Support/Debug.h"
#include "llvm/Support/raw_ostream.h"
```









llvm::dbgs() << "test\n";
```
Value *val
llvm::dbgs() << *Val;
Val->dump();
```
```
CallExpr *E
E->dump();
dbgs() << *E();   //Error
errs() << "test";
```





不同层次的缩进表示可执行的顺序，同一层次的缩进可以相互调换顺序。

```c++
SelectionDAG has 23 nodes:
  t0: ch = EntryToken
            t2: f64,ch = CopyFromReg t0, Register:f64 %0
            t4: f64,ch = CopyFromReg t0, Register:f64 %1
          t16: i64 = setcc nnan ninf nsz arcp contract afn reassoc t2, t4, seteq:ch
        t17: v2i64 = scalar_to_vector t16
            t6: f64,ch = CopyFromReg t0, Register:f64 %2
          t27: v2f64 = scalar_to_vector t6
        t28: v2f64 = vector_shuffle<u,0> t27, undef:v2f64
            t8: f64,ch = CopyFromReg t0, Register:f64 %3
          t24: v2f64 = scalar_to_vector t8
        t26: v2f64 = vector_shuffle<u,0> t24, undef:v2f64
      t21: v2f64 = vselect nnan ninf nsz arcp contract afn reassoc t17, t28, t26
    t23: f64 = extract_vector_elt t21, Constant:i32<0>
  t13: ch,glue = CopyToReg t0, Register:f64 $f1, t23
  t14: ch = PPCISD::RET_FLAG t13, Register:f64 $f1, t13:1
```





##Clang and llvm use.

### llvm::errs()





## Print Reg

```
MCPhysReg LiveInReg;
dbgs() << TRI->getName(LiveInReg);



unsigned Reg = Register::index2VirtReg(i);
dbgs() << "Reg: " << printReg(Reg) << "\n";

MCPhysReg PReg
printReg(PReg, TRI)


Register Reg
dbgs() << " " << printReg(Reg, TRI);
dbgs() << printReg(Reg);
```





### Debug the specify func

```c++
   bool runOnMachineFunction(MachineFunction &MF) override {
      if (MF.getName() != "_ZN9benchmark8internal17BenchmarkFamilies14FindBenchmarksERKNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEPSt6vectorINS0_9Benchmark8InstanceESaISC_EEPSo")
        return false;
      dbgs() << __LINE__ << "zhangkang\n";
      MF.dump();

```

