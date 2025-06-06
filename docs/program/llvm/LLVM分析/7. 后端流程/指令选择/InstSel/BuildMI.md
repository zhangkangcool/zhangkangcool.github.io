<h1 align="center">BuildMI</h1>
https://releases.llvm.org/1.3/docs/CodeGenerator.html



# BuildMI

Implicit operands必须在explicit operands之后。

```c++
/// addOperand - Add the specified operand to the instruction.  If it is an
/// implicit operand, it is added to the end of the operand list.  If it is
/// an explicit operand it is added at the end of the explicit operand list
/// (before the first implicit operand).
void MachineInstr::addOperand(MachineFunction &MF, const MachineOperand &Op) {}
```





Some of `buildMI`

```c++
/// Builder interface. Specify how to create the initial instruction itself.
inline MachineInstrBuilder BuildMI(MachineFunction &MF, const DebugLoc &DL,
                                   const MCInstrDesc &MCID) {
  return MachineInstrBuilder(MF, MF.CreateMachineInstr(MCID, DL));
}

/// This version of the builder sets up the first operand as a
/// destination virtual register.
inline MachineInstrBuilder BuildMI(MachineFunction &MF, const DebugLoc &DL,
                                   const MCInstrDesc &MCID, Register DestReg) {
  return MachineInstrBuilder(MF, MF.CreateMachineInstr(MCID, DL))
           .addReg(DestReg, RegState::Define);
}

/// This version of the builder inserts the newly-built instruction before
/// the given position in the given MachineBasicBlock, and sets up the first
/// operand as a destination virtual register.
在I之前插入
inline MachineInstrBuilder BuildMI(MachineBasicBlock &BB,
                                   MachineBasicBlock::iterator I,
                                   const DebugLoc &DL, const MCInstrDesc &MCID,
                                   Register DestReg) {
  MachineFunction &MF = *BB.getParent();
  MachineInstr *MI = MF.CreateMachineInstr(MCID, DL);
  BB.insert(I, MI);
  return MachineInstrBuilder(MF, MI).addReg(DestReg, RegState::Define);
}


  /// Create a MachineInstrBuilder for manipulating an existing instruction.
  /// F must be the machine function that was used to allocate I.
  MachineInstrBuilder(MachineFunction &F, MachineInstr *I) : MF(&F), MI(I) {}
  MachineInstrBuilder(MachineFunction &F, MachineBasicBlock::iterator I)
      : MF(&F), MI(&*I) {}
```

`MachineInstrBuilder`会调用`MachineInstr`的ctor方法，该方法可传入参数来决定是否需要copy implicit。



```c++
void MachineInstr::addImplicitDefUseOperands(MachineFunction &MF) {
  if (MCID->ImplicitDefs)
    for (const MCPhysReg *ImpDefs = MCID->getImplicitDefs(); *ImpDefs;
           ++ImpDefs)
      addOperand(MF, MachineOperand::CreateReg(*ImpDefs, true, true));
  if (MCID->ImplicitUses)
    for (const MCPhysReg *ImpUses = MCID->getImplicitUses(); *ImpUses;
           ++ImpUses)
      addOperand(MF, MachineOperand::CreateReg(*ImpUses, false, true));
}



/// MachineInstr ctor - This constructor creates a MachineInstr and adds the
/// implicit operands. It reserves space for the number of operands specified by
/// the MCInstrDesc.
MachineInstr::MachineInstr(MachineFunction &MF, const MCInstrDesc &tid,
                           DebugLoc dl, bool NoImp)
    : MCID(&tid), debugLoc(std::move(dl)) {
  assert(debugLoc.hasTrivialDestructor() && "Expected trivial destructor");

  // Reserve space for the expected number of operands.
  if (unsigned NumOps = MCID->getNumOperands() +
    MCID->getNumImplicitDefs() + MCID->getNumImplicitUses()) {
    CapOperands = OperandCapacity::get(NumOps);
    Operands = MF.allocateOperandArray(CapOperands);
  }

  if (!NoImp)
    addImplicitDefUseOperands(MF);
}
```





### Using the `MachineInstrBuilder.h` function

`MachineInstr *Copy = BuildMI`, `auto Copy = BuildMI` `Copy->dump()`

```c++
Machine instructions are created by using the BuildMI functions, located in the include/llvm/CodeGen/MachineInstrBuilder.h file. The BuildMI functions make it easy to build arbitrary machine instructions. Usage of the BuildMI functions look like this:

  // Create a 'DestReg = mov 42' (rendered in X86 assembly as 'mov DestReg, 42')
  // instruction.  The '1' specifies how many operands will be added.
  // 第一个参数不是MBB,产生指令但不进行插入
  MachineInstr *MI = BuildMI(X86::MOV32ri, 1, DestReg).addImm(42);

  // Create the same instr, but insert it at the end of a basic block.
  // 产生指令，并插入到最后
  MachineBasicBlock &MBB = ...
  BuildMI(MBB, X86::MOV32ri, 1, DestReg).addImm(42);

  // Create the same instr, but insert it before a specified iterator point.
  // 产生指令，并插在MBBI之前
  MachineBasicBlock::iterator MBBI = ...
  BuildMI(MBB, MBBI, X86::MOV32ri, 1, DestReg).addImm(42);

  // Create a 'cmp Reg, 0' instruction, no destination reg.
  // 产生指令，未使用结果REG
  MI = BuildMI(X86::CMP32ri, 2).addReg(Reg).addImm(0);

  // Create an 'sahf' instruction which takes no operands and stores nothing.
  MI = BuildMI(X86::SAHF, 0);

  // Create a self looping branch instruction.
  BuildMI(MBB, X86::JNE, 1).addMBB(&MBB);

The key thing to remember with the BuildMI functions is that you have to specify the number of operands that the machine instruction will take (allowing efficient memory allocation). Also, if operands default to be uses of values, not definitions. If you need to add a definition operand (other than the optional destination register), you must explicitly mark it as such.

```

#### `BuildMI()` will add the implicit register automaticlly

```c++
Source MI
BLR8 implicit $lr8, implicit $rm, implicit killed $x3

80               BuildMI(**PI, J, J->getDebugLoc(), TII->get(I->getOpcode()))
81                   .copyImplicitOps(*I);
We will get
BLR8 implicit $lr8, implicit $rm, implicit $lr8, implicit $rm, implicit killed $x3
```



```c++
80               BuildMI(**PI, J, J->getDebugLoc(), TII->get(I->getOpcode()))
We will get
BLR8 implicit $lr8, implicit $rm 
Below is the def of `BLCR`

1405     def BCLR  : XLForm_2_br2<19, 16, 12, 0, (outs), (ins crbitrc:$bi),
1406                              "bclr 12, $bi, 0", IIC_BrB, []>;
```



# MachineInstrBuilder

This function will be called by `BuildMi()`.  Modify the existed instruction.

```c++
  /// Create a MachineInstrBuilder for manipulating an existing instruction.

  /// F must be the machine function that was used to allocate I.

  MachineInstrBuilder(MachineFunction &F, MachineInstr *I) : MF(&F), MI(I) {}
```



Example:

```c++
I.dump(); 
MachineInstr *MI = MF.CloneMachineInstr(&I);
1453       MI.dump();
1455       Pred[1].dump();
1456       MI.setDesc(get(PPC::BCLR));
           BB.insert(J, MI);
1457       MachineInstrBuilder(*MI.getParent()->getParent(), MI).add(Pred[1]);
1458       MI.dump();
```

Below is the output

```asm
I      : BLR8 implicit $lr8, implicit $rm
MI     : BLR8 implicit $lr8, implicit $rm
Pred[1]: undef renamable $cr5lt
MI     : BCLR undef renamable $cr5lt, implicit $lr8, implicit $rm
```





BuildMI最终会调用MachineInstr构建MI,会加上implicit operands

```c++
/// MachineInstr ctor - This constructor creates a MachineInstr and adds the
/// implicit operands. It reserves space for the number of operands specified by
/// the MCInstrDesc.
MachineInstr::MachineInstr(MachineFunction &MF, const MCInstrDesc &tid,
                           DebugLoc dl, bool NoImp)
    : MCID(&tid), debugLoc(std::move(dl)) {
  assert(debugLoc.hasTrivialDestructor() && "Expected trivial destructor");

  // Reserve space for the expected number of operands.
  if (unsigned NumOps = MCID->getNumOperands() +
    MCID->getNumImplicitDefs() + MCID->getNumImplicitUses()) {
    CapOperands = OperandCapacity::get(NumOps);
    Operands = MF.allocateOperandArray(CapOperands);
  }

  if (!NoImp)
    addImplicitDefUseOperands(MF);
}
```

