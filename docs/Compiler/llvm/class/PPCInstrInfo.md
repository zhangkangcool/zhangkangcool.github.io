<h1 align="center">PPCInstrInfo</h1>
## Definition

#### The definition of class PPCInstrInfo

`PPCInstrInfo.cpp`

```c++
113 class PPCSubtarget;
114 class PPCInstrInfo : public PPCGenInstrInfo {
115   PPCSubtarget &Subtarget;
116   const PPCRegisterInfo RI;
```



#### The definition of class PPCGenInstrInfo

`PPCGenInstrInfo.inc`

```c++
7910 #ifdef GET_INSTRINFO_HEADER
 7911 #undef GET_INSTRINFO_HEADER
 7912 namespace llvm {
 7913 struct PPCGenInstrInfo : public TargetInstrInfo {
 7914   explicit PPCGenInstrInfo(int CFSetupOpcode = -1, int CFDestroyOpcode = -1, int CatchRetOpcode =       -1, int ReturnOpcode = -1);
 7915   ~PPCGenInstrInfo() override = default;
 7916
 7917 };
 7918 } // end namespace llvm
 7919 #endif // GET_INSTRINFO_HEADER
```



`PPCInstrInfo -> PPCGenInstrInfo -> TargetInstrInfo`

----------

## Use

Most of member in `PPCInstrInfo` is from the `TargetInstrInfo`, you can see most of function has the `override`.

BUt there are a few member is only defined in `PPCInstrInfo`。

```SHELL
[shkzhang@recycler:~/llvm/llvm/lib/Target/PowerPC]$ grep -r "storeRegToStackSlotNoUpd"
PPCFrameLowering.cpp:          TII.storeRegToStackSlotNoUpd(MBB, MI, Reg, !IsLiveIn,
PPCInstrInfo.h:  void storeRegToStackSlotNoUpd(MachineBasicBlock &MBB,
PPCInstrInfo.cpp:void PPCInstrInfo::storeRegToStackSlotNoUpd(
PPCInstrInfo.cpp:  storeRegToStackSlotNoUpd(MBB, MI, SrcReg, isKill, FrameIdx, RC, TRI);
```



#### 1. Use TargetInstrInfo

Only use the member definited in `TargetInstrInfo`.

### Example: PPCBranchCoalescing.cpp

- Define

```c++
151   const TargetInstrInfo *TII;
152   MachineRegisterInfo *MRI;
```



- Use

```c++
217 void PPCBranchCoalescing::initialize(MachineFunction &MF) {
218   MDT = &getAnalysis<MachineDominatorTree>();
219   MPDT = &getAnalysis<MachinePostDominatorTree>();
220   TII = MF.getSubtarget().getInstrInfo();
221   MRI = &MF.getRegInfo();
222 }
```





## 2. Use PPCInstrInfo

Only use the member definited in `TargetInstrInfo`.

#### Example: PPCReduceCRLogicals.cpp

- definition

```c++
379   const PPCInstrInfo *TII = nullptr;
380   MachineFunction *MF = nullptr;
381   MachineRegisterInfo *MRI = nullptr;
382   const MachineBranchProbabilityInfo *MBPI = nullptr;
```



- Use

```c++
const TargetRegisterInfo *TRI = &TII->getRegisterInfo();

568 void PPCReduceCRLogicals::initialize(MachineFunction &MFParam) {
569   MF = &MFParam;
570   MRI = &MF->getRegInfo();
571   TII = MF->getSubtarget<PPCSubtarget>().getInstrInfo();
572   MBPI = &getAnalysis<MachineBranchProbabilityInfo>();
573
574   AllCRLogicalOps.clear();
575 }
```



 
