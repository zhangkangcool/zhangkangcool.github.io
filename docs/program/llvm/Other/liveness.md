



```
做一个pass,计算并修正liveness
要加在无依赖的pass，否则会先运行依赖pass
#include "llvm/CodeGen/LivePhysRegs.h"  
  
// remove const  
MachineFunction &MFNew = const_cast<MachineFunction&>(*MF);  
  
// MF不能是指针
bool runOnMachineFunction(MachineFunction &MF) override {
  LivePhysRegs LPR;
  for (MachineFunction::reverse_iterator MFI = MF.rbegin(), MFE = MF.rend();
       MFI != MFE; ++MFI) {
    MFI->clearLiveIns();
    computeAndAddLiveIns(LPR, *MFI);
  //  MFI->dump();
  }
  dbgs() << __LINE__ << " zhangkang\n";
  MF.dump();
  assert(false);
  return false;
}
```

