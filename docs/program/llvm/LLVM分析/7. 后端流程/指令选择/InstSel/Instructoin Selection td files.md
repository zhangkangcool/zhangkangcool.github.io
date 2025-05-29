

# PPCInstrFormats.td

在此文件中，会定义class I和class I2,各种Form都会继承这2个类。这两个类中可以设置各个Form的默认属性。

只有class I和class I2继承自class Instructoin。

```c++
class I<bits<6> opcode, dag OOL, dag IOL, string asmstr, InstrItinClass itin>
        : Instruction {
  field bits<32> Inst;
  ...
}

// Two joined instructions; used to emit two adjacent instructions as one.
// The itinerary from the first instruction is used for scheduling and
// classification.
class I2<bits<6> opcode1, bits<6> opcode2, dag OOL, dag IOL, string asmstr,
         InstrItinClass itin>
        : Instruction {
  field bits<64> Inst;
  field bits<64> SoftFail = 0;
  ...
}

// Pseudo-instructions for alternate assembly syntax (never used by codegen).
// These are aliases that require C++ handling to convert to the target
// instruction, while InstAliases can be handled directly by tblgen.
class PPCAsmPseudo<string asm, dag iops>
  : Instruction {
  let Namespace = "PPC";
  bit PPC64 = 0;  // Default value, override with isPPC64

  let OutOperandList = (outs);
  let InOperandList = iops;
  let Pattern = [];
  let AsmString = asm;
  let isAsmParserOnly = 1;
  let isPseudo = 1;
  let hasNoSchedulingInfo = 1;
}

```



大量指令Form从class I继承来。

```c++
class BForm_2<bits<6> opcode, bits<5> bo, bits<5> bi, bit aa, bit lk,
              dag OOL, dag IOL, string asmstr>
  : I<opcode, OOL, IOL, asmstr, IIC_BrB> {
  bits<14> BD;

  let Inst{6-10}  = bo;
  let Inst{11-15} = bi;
  let Inst{16-29} = BD;
  let Inst{30}    = aa;
  let Inst{31}    = lk;
}
```

 如果要加指令描述，可以参考`PPC970_Single` 

` bit RC = 0;`,RC是指令中的一个位。会用来匹配指令。

指令位和指令属性是不一样的。

```shell
会出现在指令定义的尖括号之外
517 // PowerPC Flag Definitions.
 518
 519 class isPPC64 { bit PPC64 = 1; }
 520 class isDOT   { bit RC = 1; }
 521
 522 class RegConstraint<string C> {
 523   string Constraints = C;
 524 }
 525 class NoEncode<string E> {
 526   string DisableEncoding = E;
 527 }
```





```shell
268 class DForm_2<bits<6> opcode, dag OOL, dag IOL, string asmstr,
 269               InstrItinClass itin, list<dag> pattern>
 270   : DForm_base<opcode, OOL, IOL, asmstr, itin, pattern> {
 271
 272   // Even though ADDICo does not really have an RC bit, provide
 273   // the declaration of one here so that isDOT has something to set.
 274   bit RC = 0;
 275 }
 
 2344 def ADDIC  : DForm_2<12, (outs gprc:$rD), (ins gprc:$rA, s16imm:$imm),
2345                      "addic $rD, $rA, $imm", IIC_IntGeneral,
2346                      [(set i32:$rD, (addc i32:$rA, imm32SExt16:$imm))]>,
2347                      RecFormRel, PPC970_DGroup_Cracked;
2348 let Defs = [CARRY, CR0] in
2349 def ADDICo : DForm_2<13, (outs gprc:$rD), (ins gprc:$rA, s16imm:$imm),
2350                      "addic. $rD, $rA, $imm", IIC_IntGeneral,
2351                      []>, isDOT, RecFormRel;
2352 }
```



------

##  指令描述类提供获得指令属性的方法

`./include/llvm/MC/MCInstrDesc.h`

```
class MCInstrDesc {
  isSelect();
  mayLoad();
  mayStrore();
}
```

#### Usage

```c++
const MCInstrDesc &MCID = DAG.TII->get(Opcode);

isLoad  = MCID.mayLoad();
isStore = MCID.mayStore();

```



​                                              

# Instruction

PPC指令一定是从class I或class I2继续而来。可以在`llvm/build/lib/Target/PowerPC/PPCGenInstrInfo.inc`检查某个符号是不是指令。

 定义在`/home/shkzhang/llvm/llvm/include/llvm/Target/Target.td`

```c++
408 class InstructionEncoding {
 409   // Size of encoded instruction.
 410   int Size;
 411
 412   // The "namespace" in which this instruction exists, on targets like ARM
 413   // which multiple ISA namespaces exist.
 414   string DecoderNamespace = "";
 415
 416   // List of predicates which will be turned into isel matching code.
 417   list<Predicate> Predicates = [];
 418
 419   string DecoderMethod = "";
 420
 421   // Is the instruction decoder method able to completely determine if the
 422   // given instruction is valid or not. If the TableGen definition of the
 423   // instruction specifies bitpattern A??B where A and B are static bits, the
 424   // hasCompleteDecoder flag says whether the decoder method fully handles the
 425   // ?? space, i.e. if it is a final arbiter for the instruction validity.
 426   // If not then the decoder attempts to continue decoding when the decoder
 427   // method fails.
 428   //
 429   // This allows to handle situations where the encoding is not fully
 430   // orthogonal. Example:
 431   // * InstA with bitpattern 0b0000????,
 432   // * InstB with bitpattern 0b000000?? but the associated decoder method
 433   //   DecodeInstB() returns Fail when ?? is 0b00 or 0b11.
 434   //
 435   // The decoder tries to decode a bitpattern that matches both InstA and
 436   // InstB bitpatterns first as InstB (because it is the most specific
 437   // encoding). In the default case (hasCompleteDecoder = 1), when
 438   // DecodeInstB() returns Fail the bitpattern gets rejected. By setting
 439   // hasCompleteDecoder = 0 in InstB, the decoder is informed that
 440   // DecodeInstB() is not able to determine if all possible values of ?? are
 441   // valid or not. If DecodeInstB() returns Fail the decoder will attempt to
 442   // decode the bitpattern as InstA too.
 443   bit hasCompleteDecoder = 1;
 444 }

455 //===----------------------------------------------------------------------===//
 456 // Instruction set description - These classes correspond to the C++ classes in
 457 // the Target/TargetInstrInfo.h file.
 458 //
 459 class Instruction : InstructionEncoding {
 460   string Namespace = "";
 461
 462   dag OutOperandList;       // An dag containing the MI def operand list.
 463   dag InOperandList;        // An dag containing the MI use operand list.
 464   string AsmString = "";    // The .s format to print the instruction with.
 465
 466   // Allows specifying a canonical InstructionEncoding by HwMode. If non-empty,
 467   // the Inst member of this Instruction is ignored.
 468   EncodingByHwMode EncodingInfos;
 469
 470   // Pattern - Set to the DAG pattern for this instruction, if we know of one,
 471   // otherwise, uninitialized.
 472   list<dag> Pattern;
 473
 474   // The follow state will eventually be inferred automatically from the
 475   // instruction pattern.
 476
 477   list<Register> Uses = []; // Default to using no non-operand registers
 478   list<Register> Defs = []; // Default to modifying no non-operand registers
 479
 480   // Predicates - List of predicates which will be turned into isel matching
 481   // code.
 482   list<Predicate> Predicates = [];
 483
 484   // Size - Size of encoded instruction, or zero if the size cannot be determined
 485   // from the opcode.
 486   int Size = 0;
 487
 488   // Code size, for instruction selection.
 489   // FIXME: What does this actually mean?
 490   int CodeSize = 0;
 491
 492   // Added complexity passed onto matching pattern.
 493   int AddedComplexity  = 0;
 494
 495   // Indicates if this is a pre-isel opcode that should be
 496   // legalized/regbankselected/selected.
 497   bit isPreISelOpcode = 0;
 498
 499   // These bits capture information about the high-level semantics of the
 500   // instruction.
 501   bit isReturn     = 0;     // Is this instruction a return instruction?
 502   bit isBranch     = 0;     // Is this instruction a branch instruction?
   ...
 }
```



# 伪指令/伪结点 

只用于吃assembly syntax文件，然后映射到另外的指令，一般是用于alias。不会由codegen产生。不用关心其标志，但要设好，他映射到的指令的标志。

```asm
// Pseudo-instructions for alternate assembly syntax (never used by codegen).
// These are aliases that require C++ handling to convert to the target
// instruction, while InstAliases can be handled directly by tblgen.
class PPCAsmPseudo<string asm, dag iops>
  : Instruction {
  let Namespace = "PPC";
  bit PPC64 = 0;  // Default value, override with isPPC64

  let OutOperandList = (outs);
  let InOperandList = iops;
  let Pattern = [];
  let AsmString = asm;
  let isAsmParserOnly = 1;
  let isPseudo = 1;
  let hasNoSchedulingInfo = 1;

  // If an instruction doesn't set the hasSideEffects flag and doesn't have
  // match pattern, the llvm-tblgen will set its hasSideEffects flag as true. In
  // fact, most of instructions don't have SideEffects, it's better to set it as
  // false by default and explicit set it as true for the instruction which
  // really requires.
  bit hasSideEffects = 0;
}

2306 let Defs = [CARRY] in
2307 def ADDIC  : DForm_2<12, (outs gprc:$rD), (ins gprc:$rA, s16imm:$imm),
2308                      "addic $rD, $rA, $imm", IIC_IntGeneral,
2309                      [(set i32:$rD, (addc i32:$rA, imm32SExt16:$imm))]>,
2310                      RecFormRel, PPC970_DGroup_Cracked;
2311 let Defs = [CARRY, CR0] in
2312 def ADDICo : DForm_2<13, (outs gprc:$rD), (ins gprc:$rA, s16imm:$imm),
2313                      "addic. $rD, $rA, $imm", IIC_IntGeneral,
2314                      []>, isDOT, RecFormRel;
2315 }

def SUBIC : PPCAsmPseudo<"subic $rA, $rB, $imm",
                         (ins gprc:$rA, gprc:$rB, s16imm:$imm)>;
def SUBICo : PPCAsmPseudo<"subic. $rA, $rB, $imm",
                          (ins gprc:$rA, gprc:$rB, s16imm:$imm)>;
```









`./AsmParser/PPCAsmParser.cpp`

```c++
794   case PPC::SUBIC: {
 795     MCInst TmpInst;
 796     TmpInst.setOpcode(PPC::ADDIC);
 797     TmpInst.addOperand(Inst.getOperand(0));
 798     TmpInst.addOperand(Inst.getOperand(1));
 799     addNegOperand(TmpInst, Inst.getOperand(2), getContext());
 800     Inst = TmpInst;
 801     break;
 802   }
 803   case PPC::SUBICo: {
 804     MCInst TmpInst;
 805     TmpInst.setOpcode(PPC::ADDICo);
 806     TmpInst.addOperand(Inst.getOperand(0));
 807     TmpInst.addOperand(Inst.getOperand(1));
 808     addNegOperand(TmpInst, Inst.getOperand(2), getContext());
 809     Inst = TmpInst;
 810     break;
 811   }
```







# 函数

使用`!func_name()`在`td`文件中执行函数。

`strconcat()`函数用于连接，

`class StoreRetvalInst<> :  NVPTXInst<>;` 用于批量定义类似的指令，其实不用`class`，单独使用`def MyInst: NVPTXInst<>`也是可以的,`strconcat()`也可用于普通的指令中（非class）。



```c++
  class StoreRetvalInst<NVPTXRegClass regclass, string opstr> :
        NVPTXInst<(outs), (ins regclass:$val, i32imm:$a),
                  !strconcat("st.param", opstr, " \t[func_retval0+$a], $val;"),
                  []>;
```













