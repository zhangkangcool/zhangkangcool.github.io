

# 1. SSA Reg

```c++
  MachineRegisterInfo *MRI = &MI.getParent()->getParent()->getRegInfo();
  const TargetRegisterInfo *TRI = &getRegisterInfo();

DefMI = MRI->getVRegDef(TrueReg);

```



```c++
/// getVRegDef - Return the machine instr that defines the specified virtual
/// register or null if none is found.  This assumes that the code is in SSA
/// form, so there should only be one definition.
MachineInstr *MachineRegisterInfo::getVRegDef(Register Reg) const {
  // Since we are in SSA form, we can use the first definition.
  def_instr_iterator I = def_instr_begin(Reg);
  assert((I.atEnd() || std::next(I) == def_instr_end()) &&
         "getVRegDef assumes a single definition or no definition");
  return !I.atEnd() ? &*I : nullptr;
}

/// getUniqueVRegDef - Return the unique machine instr that defines the
/// specified virtual register or null if none is found.  If there are
/// multiple definitions or no definition, return null.
MachineInstr *MachineRegisterInfo::getUniqueVRegDef(Register Reg) const {
  if (def_empty(Reg)) return nullptr;
  def_instr_iterator I = def_instr_begin(Reg);
  if (std::next(I) != def_instr_end())
    return nullptr;
  return &*I;
}
```







```c++
MachineRegisterInfo *MRI = &MI.getParent()->getParent()->getRegInfo();

MachineInstr *PPCInstrInfo::getForwardingDefMI(
  MachineInstr &MI,
  unsigned &OpNoForForwarding,
  bool &SeenIntermediateUse) const {
  OpNoForForwarding = ~0U;
  MachineInstr *DefMI = nullptr;
  MachineRegisterInfo *MRI = &MI.getParent()->getParent()->getRegInfo();
  const TargetRegisterInfo *TRI = &getRegisterInfo();
  // If we're in SSA, get the defs through the MRI. Otherwise, only look
  // within the basic block to see if the register is defined using an
  // LI/LI8/ADDI/ADDI8.
  if (MRI->isSSA()) {
    for (int i = 1, e = MI.getNumOperands(); i < e; i++) {
      if (!MI.getOperand(i).isReg())
        continue;
      Register Reg = MI.getOperand(i).getReg();
      if (!Register::isVirtualRegister(Reg))
        continue;
      unsigned TrueReg = TRI->lookThruCopyLike(Reg, MRI);
      if (Register::isVirtualRegister(TrueReg)) {
        DefMI = MRI->getVRegDef(TrueReg);
        if (DefMI->getOpcode() == PPC::LI || DefMI->getOpcode() == PPC::LI8 ||
            DefMI->getOpcode() == PPC::ADDI ||
            DefMI->getOpcode() == PPC::ADDI8) {
          OpNoForForwarding = i;
          // The ADDI and LI operand maybe exist in one instruction at same
          // time. we prefer to fold LI operand as LI only has one Imm operand
          // and is more possible to be converted. So if current DefMI is
          // ADDI/ADDI8, we continue to find possible LI/LI8.
          if (DefMI->getOpcode() == PPC::LI || DefMI->getOpcode() == PPC::LI8)
            break;
        }
      }
    }
  } else {
```





```c++
void MachineRegisterInfo::clearKillFlags(Register Reg) const {
  for (MachineOperand &MO : use_operands(Reg))
    MO.setIsKill(false);
}

PPCBoolRetToInt: Skip translation if there is ConstantExpr
```



```c++
bool OnlyOneUse = MRI->hasOneNonDBGUse(Reg);
175     MachineInstr *DefMI = MRI->getVRegDef(Reg);

MRI->use_nodbg_empty(SrcReg)
  MRI.hasOneNonDBGUse(Reg) && MRI.hasOneDef(Reg) &
```





```c++
MachineInstr *MachineRegisterInfo::getVRegDef(Register Reg) const {
  // Since we are in SSA form, we can use the first definition.
  def_instr_iterator I = def_instr_begin(Reg);
  assert((I.atEnd() || std::next(I) == def_instr_end()) &&
         "getVRegDef assumes a single definition or no definition");
  return !I.atEnd() ? &*I : nullptr;
}

/// getUniqueVRegDef - Return the unique machine instr that defines the
/// specified virtual register or null if none is found.  If there are
/// multiple definitions or no definition, return null.
MachineInstr *MachineRegisterInfo::getUniqueVRegDef(Register Reg) const {
  if (def_empty(Reg)) return nullptr;
  def_instr_iterator I = def_instr_begin(Reg);
  if (std::next(I) != def_instr_end())
    return nullptr;
  return &*I;
}
```





```c++

  /// use_iterator/use_begin/use_end - Walk all uses of the specified register.
  using use_iterator =
      defusechain_iterator<true, false, false, true, false, false>;
  use_iterator use_begin(Register RegNo) const {
    return use_iterator(getRegUseDefListHead(RegNo));
  }
  static use_iterator use_end() { return use_iterator(nullptr); }

  inline iterator_range<use_iterator> use_operands(Register Reg) const {
    return make_range(use_begin(Reg), use_end());
  }

  /// use_instr_iterator/use_instr_begin/use_instr_end - Walk all uses of the
  /// specified register, stepping by MachineInstr.
  using use_instr_iterator =
      defusechain_instr_iterator<true, false, false, false, true, false>;
  use_instr_iterator use_instr_begin(Register RegNo) const {
    return use_instr_iterator(getRegUseDefListHead(RegNo));
  }
  static use_instr_iterator use_instr_end() {
    return use_instr_iterator(nullptr);
  }

  inline iterator_range<use_instr_iterator>
  use_instructions(Register Reg) const {
    return make_range(use_instr_begin(Reg), use_instr_end());
  }

  /// use_bundle_iterator/use_bundle_begin/use_bundle_end - Walk all uses of the
  /// specified register, stepping by bundle.
  using use_bundle_iterator =
      defusechain_instr_iterator<true, false, false, false, false, true>;
  use_bundle_iterator use_bundle_begin(Register RegNo) const {
    return use_bundle_iterator(getRegUseDefListHead(RegNo));
  }
  static use_bundle_iterator use_bundle_end() {
    return use_bundle_iterator(nullptr);
  }

  inline iterator_range<use_bundle_iterator> use_bundles(Register Reg) const {
    return make_range(use_bundle_begin(Reg), use_bundle_end());
  }

  /// use_empty - Return true if there are no instructions using the specified
  /// register.
  bool use_empty(Register RegNo) const { return use_begin(RegNo) == use_end(); }

  /// hasOneUse - Return true if there is exactly one instruction using the
  /// specified register.
  bool hasOneUse(Register RegNo) const {
    use_iterator UI = use_begin(RegNo);
    if (UI == use_end())
      return false;
    return ++UI == use_end();
  }

  /// use_nodbg_iterator/use_nodbg_begin/use_nodbg_end - Walk all uses of the
  /// specified register, skipping those marked as Debug.
  using use_nodbg_iterator =
      defusechain_iterator<true, false, true, true, false, false>;
  use_nodbg_iterator use_nodbg_begin(Register RegNo) const {
    return use_nodbg_iterator(getRegUseDefListHead(RegNo));
  }
  static use_nodbg_iterator use_nodbg_end() {
    return use_nodbg_iterator(nullptr);
  }

  inline iterator_range<use_nodbg_iterator>
  use_nodbg_operands(Register Reg) const {
    return make_range(use_nodbg_begin(Reg), use_nodbg_end());
  }

  /// use_instr_nodbg_iterator/use_instr_nodbg_begin/use_instr_nodbg_end - Walk
  /// all uses of the specified register, stepping by MachineInstr, skipping
  /// those marked as Debug.
  using use_instr_nodbg_iterator =
      defusechain_instr_iterator<true, false, true, false, true, false>;
  use_instr_nodbg_iterator use_instr_nodbg_begin(Register RegNo) const {
    return use_instr_nodbg_iterator(getRegUseDefListHead(RegNo));
  }
  static use_instr_nodbg_iterator use_instr_nodbg_end() {
    return use_instr_nodbg_iterator(nullptr);
  }

  inline iterator_range<use_instr_nodbg_iterator>
  use_nodbg_instructions(Register Reg) const {
    return make_range(use_instr_nodbg_begin(Reg), use_instr_nodbg_end());
  }

  /// use_bundle_nodbg_iterator/use_bundle_nodbg_begin/use_bundle_nodbg_end - Walk
  /// all uses of the specified register, stepping by bundle, skipping
  /// those marked as Debug.
  using use_bundle_nodbg_iterator =
      defusechain_instr_iterator<true, false, true, false, false, true>;
  use_bundle_nodbg_iterator use_bundle_nodbg_begin(Register RegNo) const {
    return use_bundle_nodbg_iterator(getRegUseDefListHead(RegNo));
  }
  static use_bundle_nodbg_iterator use_bundle_nodbg_end() {
    return use_bundle_nodbg_iterator(nullptr);
  }

  inline iterator_range<use_bundle_nodbg_iterator>
  use_nodbg_bundles(Register Reg) const {
    return make_range(use_bundle_nodbg_begin(Reg), use_bundle_nodbg_end());
  }

  /// use_nodbg_empty - Return true if there are no non-Debug instructions
  /// using the specified register.
  bool use_nodbg_empty(Register RegNo) const {
    return use_nodbg_begin(RegNo) == use_nodbg_end();
  }

  /// hasOneNonDBGUse - Return true if there is exactly one non-Debug
  /// use of the specified register.
  bool hasOneNonDBGUse(Register RegNo) const;

  /// hasOneNonDBGUse - Return true if there is exactly one non-Debug
  /// instruction using the specified register. Said instruction may have
  /// multiple uses.
  bool hasOneNonDBGUser(Register RegNo) const;

  /// replaceRegWith - Replace all instances of FromReg with ToReg in the
  /// machine function.  This is like llvm-level X->replaceAllUsesWith(Y),
  /// except that it also changes any definitions of the register as well.
  ///
  /// Note that it is usually necessary to first constrain ToReg's register
  /// class and register bank to match the FromReg constraints using one of the
  /// methods:
  ///
  ///   constrainRegClass(ToReg, getRegClass(FromReg))
  ///   constrainRegAttrs(ToReg, FromReg)
  ///   RegisterBankInfo::constrainGenericRegister(ToReg,
  ///       *MRI.getRegClass(FromReg), MRI)
  ///
  /// These functions will return a falsy result if the virtual registers have
  /// incompatible constraints.
  ///
  /// Note that if ToReg is a physical register the function will replace and
  /// apply sub registers to ToReg in order to obtain a final/proper physical
  /// register.
  void replaceRegWith(Register FromReg, Register ToReg);

  /// getVRegDef - Return the machine instr that defines the specified virtual
  /// register or null if none is found.  This assumes that the code is in SSA
  /// form, so there should only be one definition.
  MachineInstr *getVRegDef(Register Reg) const;

  /// getUniqueVRegDef - Return the unique machine instr that defines the
  /// specified virtual register or null if none is found.  If there are
  /// multiple definitions or no definition, return null.
  MachineInstr *getUniqueVRegDef(Register Reg) const;

  /// clearKillFlags - Iterate over all the uses of the given register and
  /// clear the kill flag from the MachineOperand. This function is used by
  /// optimization passes which extend register lifetimes and need only
  /// preserve conservative kill flag information.
  void clearKillFlags(Register Reg) const;

  void dumpUses(Register RegNo) const;
```





```
 if (!MRI->hasOneUse(SrcMI->getOperand(1).getReg())) {
    // FIXME: Set the kill/dead flag when there are more than 1 use.
    for (MachineRegisterInfo::use_instr_iterator I = MRI->use_instr_begin(SrcMI->getOperand(1).getReg()),
                                                 E = MRI->use_instr_end();
         I != E; ++I) {
      I->dump();
    }

    SrcMI->getOperand(1).setIsKill(false);
    dbgs() << __LINE__ << " zhangkang\n";
  } else if (SrcMI->getParent() == MI.getParent()) {
```



# 2. PostRA(not SSA)

`PPCInstrInfo`提供`getDefMIPostRA()`方法。

```c++
  // In PostRA phase, try to find instruction defines \p Reg before \p MI.
  // \p SeenIntermediate is set to true if uses between DefMI and \p MI exist.
MachineInstr *PPCInstrInfo::getDefMIPostRA(unsigned Reg, MachineInstr &MI,
                                           bool &SeenIntermediateUse) const {
  assert(!MI.getParent()->getParent()->getRegInfo().isSSA() &&
         "Should be called after register allocation.");
  const TargetRegisterInfo *TRI = &getRegisterInfo();
  MachineBasicBlock::reverse_iterator E = MI.getParent()->rend(), It = MI;
  It++;
  SeenIntermediateUse = false;
  for (; It != E; ++It) {
    if (It->modifiesRegister(Reg, TRI))
      return &*It;
    if (It->readsRegister(Reg, TRI))
      SeenIntermediateUse = true;
  }
  return nullptr;
}
```

