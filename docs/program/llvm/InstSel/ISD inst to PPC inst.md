

# td中定义的指令

中括号中PPCISD指令需要满足的pattern。

```c++
2407 def ADDI   : DForm_2<14, (outs gprc:$rD), (ins gprc_nor0:$rA, s16imm:$imm),
2408                      "addi $rD, $rA, $imm", IIC_IntSimple,
2409                      [(set i32:$rD, (add i32:$rA, imm32SExt16:$imm))]>;

def Inst : Form <some number,
                 (outs type:$rD), (ints type:$rA, ...),
                 "asm_inst $rD, $rA, ...",
                 [PPCISD pattern]>;
```







# 1.自定义的PPCISD -> PPC指令

```c++
 156 // Extract FPSCR (not modeled at the DAG level).
 157 def PPCmffs   : SDNode<"PPCISD::MFFS",
 158                        SDTypeProfile<1, 0, [SDTCisVT<0, f64>]>,
 159                        [SDNPHasChain]>;
 
 
2937   def MFFS   : XForm_42<63, 583, (outs f8rc:$rT), (ins),
2938                          "mffs $rT", IIC_IntMFFS,
2939                          [(set f64:$rT, (PPCmffs))]>,
2940                PPC970_DGroup_Single, PPC970_Unit_FPU;
2941
```





# 2. Target ISD -> PPC/TargetOp指令







# 3. 伪指令

如果选择的是一条`PPCCustomInserterPseudo`定义的PPC伪指令的话，需要在`Lowering::EmitInstrWithCustomInserter`中进一步处理成PPC支持的指令。如 [setrnd](https://github.com/llvm/llvm-project/commit/05f78b35ae82e371bfa478d02c482c6825c5fd80)



### 3.1 PPC::SETRND/PPC::SETRNDi

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



`./PPCISelLowering.cpp` 用`PPCCustomInserterPseudo`定义的伪指令，必须在`EmitInstrWithCustomInserter`中进行Lowering，未处理的伪指令会报错。

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



### 3.2 PPC::SELECT_I4

`ISD::SELECT`会在指令选择中被匹配成`PPC::SELECT_I4`系列伪指令，然后对`PPC::SELECT_I4`进行Lowering，使用实际所支持的PPC指令。

中括号是匹配规则，其中的select是指的ISD::SELECT。(中括号表明如何从`ISD/PPCISD::->PPC::`)

```asm
  // SELECT_* pseudo instructions, like SELECT_CC_* but taking condition
  // register bit directly.
  def SELECT_I4 : PPCCustomInserterPseudo<(outs gprc:$dst), (ins crbitrc:$cond,
                          gprc_nor0:$T, gprc_nor0:$F), "#SELECT_I4",
                          [(set i32:$dst, (select i1:$cond, i32:$T, i32:$F))]>;
  def SELECT_I8 : PPCCustomInserterPseudo<(outs g8rc:$dst), (ins crbitrc:$cond,
                          g8rc_nox0:$T, g8rc_nox0:$F), "#SELECT_I8",
                          [(set i64:$dst, (select i1:$cond, i64:$T, i64:$F))]>;
```





