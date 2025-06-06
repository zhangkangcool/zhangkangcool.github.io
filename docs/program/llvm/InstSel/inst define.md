<h1 align="center">inst define</h1>


# Independent instruction property

`InstrInfoEmitter.cpp`

```c++
  // Emit all of the target independent flags...
  if (Inst.isPseudo)           OS << "|(1ULL<<MCID::Pseudo)";
  if (Inst.isReturn)           OS << "|(1ULL<<MCID::Return)";
  if (Inst.isEHScopeReturn)    OS << "|(1ULL<<MCID::EHScopeReturn)";
  if (Inst.isBranch)           OS << "|(1ULL<<MCID::Branch)";
  if (Inst.isIndirectBranch)   OS << "|(1ULL<<MCID::IndirectBranch)";
  if (Inst.isCompare)          OS << "|(1ULL<<MCID::Compare)";
  if (Inst.isMoveImm)          OS << "|(1ULL<<MCID::MoveImm)";
  if (Inst.isMoveReg)          OS << "|(1ULL<<MCID::MoveReg)";
  if (Inst.isBitcast)          OS << "|(1ULL<<MCID::Bitcast)";
  if (Inst.isAdd)              OS << "|(1ULL<<MCID::Add)";
  if (Inst.isTrap)             OS << "|(1ULL<<MCID::Trap)";
  if (Inst.isSelect)           OS << "|(1ULL<<MCID::Select)";
  if (Inst.isBarrier)          OS << "|(1ULL<<MCID::Barrier)";
  if (Inst.hasDelaySlot)       OS << "|(1ULL<<MCID::DelaySlot)";
  if (Inst.isCall)             OS << "|(1ULL<<MCID::Call)";
  if (Inst.canFoldAsLoad)      OS << "|(1ULL<<MCID::FoldableAsLoad)";
  if (Inst.mayLoad)            OS << "|(1ULL<<MCID::MayLoad)";
  if (Inst.mayStore)           OS << "|(1ULL<<MCID::MayStore)";
  if (Inst.isPredicable)       OS << "|(1ULL<<MCID::Predicable)";
  if (Inst.isConvertibleToThreeAddress) OS << "|(1ULL<<MCID::ConvertibleTo3Addr)";
  if (Inst.isCommutable)       OS << "|(1ULL<<MCID::Commutable)";
  if (Inst.isTerminator)       OS << "|(1ULL<<MCID::Terminator)";
  if (Inst.isReMaterializable) OS << "|(1ULL<<MCID::Rematerializable)";
  if (Inst.isNotDuplicable)    OS << "|(1ULL<<MCID::NotDuplicable)";
  if (Inst.Operands.hasOptionalDef) OS << "|(1ULL<<MCID::HasOptionalDef)";
  if (Inst.usesCustomInserter) OS << "|(1ULL<<MCID::UsesCustomInserter)";
  if (Inst.hasPostISelHook)    OS << "|(1ULL<<MCID::HasPostISelHook)";
  if (Inst.Operands.isVariadic)OS << "|(1ULL<<MCID::Variadic)";
  if (Inst.hasSideEffects)     OS << "|(1ULL<<MCID::UnmodeledSideEffects)";
  if (Inst.isAsCheapAsAMove)   OS << "|(1ULL<<MCID::CheapAsAMove)";
  if (!Target.getAllowRegisterRenaming() || Inst.hasExtraSrcRegAllocReq)
    OS << "|(1ULL<<MCID::ExtraSrcRegAllocReq)";
  if (!Target.getAllowRegisterRenaming() || Inst.hasExtraDefRegAllocReq)
    OS << "|(1ULL<<MCID::ExtraDefRegAllocReq)";
  if (Inst.isRegSequence) OS << "|(1ULL<<MCID::RegSequence)";
  if (Inst.isExtractSubreg) OS << "|(1ULL<<MCID::ExtractSubreg)";
  if (Inst.isInsertSubreg) OS << "|(1ULL<<MCID::InsertSubreg)";
  if (Inst.isConvergent) OS << "|(1ULL<<MCID::Convergent)";
  if (Inst.variadicOpsAreDefs) OS << "|(1ULL<<MCID::VariadicOpsAreDefs)";

```



### Example: isBarrier

`llvm/CodeGen/MachineInstr.h`

```c++
/// Returns true if the specified instruction stops control flow
  /// from executing the instruction immediately following it.  Examples include
  /// unconditional branches and return instructions.
  bool isBarrier(QueryType Type = AnyInBundle) const {
    return hasProperty(MCID::Barrier, Type);
  }

```



If you don't really understand the `isBarrier` property, you can search this property `isBarrier` in `PPCInstrInfo.td`.  You can know which instruction will be set `isBarrier`.

```c++
let isBranch = 1, isTerminator = 1, hasCtrlDep = 1, PPC970_Unit = 7 in {
  let isBarrier = 1 in {
  def B   : IForm<18, 0, 0, (outs), (ins directbrtarget:$dst),
                  "b $dst", IIC_BrB,
                  [(br bb:$dst)]>;
  def BA  : IForm<18, 1, 0, (outs), (ins absdirectbrtarget:$dst),
                  "ba $dst", IIC_BrB, []>;
  }
}
```

`B` and `BLR` will has this `isBarrier` property.





# 1. 伪指令

```asm
//===----------------------------------------------------------------------===//
// EmitTimePseudo won't have encoding information for the [MC]CodeEmitter
// stuff
class PPCEmitTimePseudo<dag OOL, dag IOL, string asmstr, list<dag> pattern>
    : I<0, OOL, IOL, asmstr, NoItinerary> {
  let isCodeGenOnly = 1;
  let PPC64 = 0;
  let Pattern = pattern;
  let Inst{31-0} = 0;
  let hasNoSchedulingInfo = 1;
}

// Instruction that require custom insertion support
// a.k.a. ISelPseudos, however, these won't have isPseudo set
class PPCCustomInserterPseudo<dag OOL, dag IOL, string asmstr,
                              list<dag> pattern>
    : PPCEmitTimePseudo<OOL, IOL, asmstr, pattern> {
  let usesCustomInserter = 1;
}

// PostRAPseudo will be expanded in expandPostRAPseudo, isPseudo flag in td
// files is set only for PostRAPseudo
class PPCPostRAExpPseudo<dag OOL, dag IOL, string asmstr, list<dag> pattern>
    : PPCEmitTimePseudo<OOL, IOL, asmstr, pattern> {
  let isPseudo = 1;
}
```



1.1 `PPCEmitTimePseudo`

```
let Defs = [LR8] in
def MovePCtoLR8 : PPCEmitTimePseudo<(outs), (ins), "#MovePCtoLR8", []>,
                                     PPC970_Unit_BRU;
```

上述示例中的`MovePCtoLR8`在`PPCAsmPrinter::emitInstruction()`中进行了展开

不一定都在此处进行展开



###  1.2 `PPCCustomInserterPseudo`

如果选择的是一条`PPCCustomInserterPseudo`定义的PPC伪指令的话，必须在`Lowering::EmitInstrWithCustomInserter`中进一步处理成PPC支持的指令。未处理的伪指令会报错。如 [setrnd](https://github.com/llvm/llvm-project/commit/05f78b35ae82e371bfa478d02c482c6825c5fd80)

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



`./PPCISelLowering.cpp` 用`PPCCustomInserterPseudo`定义的伪指令，必须在`EmitInstrWithCustomInserter`中进行Lowering，

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

--------

### 1.3 `PPCPostRAExpPseudo`

`PPCPostRAExpPseudo`定义的伪指令必须在RA之后进行展开，如`SPILLTOVSR_STX`是在`PPCInstrInfo::expandPostRAPseudo`中进行展开的。





TD中定义的都是PPC/TargetOpcode Node，不是ISD::Node.