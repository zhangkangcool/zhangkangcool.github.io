<h1 align="center">Register def</h1>


https://reviews.llvm.org/D86269#change-xkvgJ0GEdUTo   `CSKYRegisterInfo.td`

https://www.javatt.com/p/43476   // 中文





# Base class

`Target.td`中所寄存器的各种信息

```c++
//===----------------------------------------------------------------------===//
// Register file description - These classes are used to fill in the target
// description classes.

class RegisterClass; // Forward def

class HwMode<string FS> {
  // A string representing subtarget features that turn on this HW mode.
  // For example, "+feat1,-feat2" will indicate that the mode is active
  // when "feat1" is enabled and "feat2" is disabled at the same time.
  // Any other features are not checked.
  // When multiple modes are used, they should be mutually exclusive,
  // otherwise the results are unpredictable.
  string Features = FS;
}

// A special mode recognized by tablegen. This mode is considered active
// when no other mode is active. For targets that do not use specific hw
// modes, this is the only mode.
def DefaultMode : HwMode<"">;

// A class used to associate objects with HW modes. It is only intended to
// be used as a base class, where the derived class should contain a member
// "Objects", which is a list of the same length as the list of modes.
// The n-th element on the Objects list will be associated with the n-th
// element on the Modes list.
class HwModeSelect<list<HwMode> Ms> {
  list<HwMode> Modes = Ms;
}

// A common class that implements a counterpart of ValueType, which is
// dependent on a HW mode. This class inherits from ValueType itself,
// which makes it possible to use objects of this class where ValueType
// objects could be used. This is specifically applicable to selection
// patterns.
class ValueTypeByHwMode<list<HwMode> Ms, list<ValueType> Ts>
    : HwModeSelect<Ms>, ValueType<0, 0> {
  // The length of this list must be the same as the length of Ms.
  list<ValueType> Objects = Ts;
}

// A class representing the register size, spill size and spill alignment
// in bits of a register.
class RegInfo<int RS, int SS, int SA> {
  int RegSize = RS;         // Register size in bits.
  int SpillSize = SS;       // Spill slot size in bits.
  int SpillAlignment = SA;  // Spill slot alignment in bits.
}

// The register size/alignment information, parameterized by a HW mode.
class RegInfoByHwMode<list<HwMode> Ms = [], list<RegInfo> Ts = []>
    : HwModeSelect<Ms> {
  // The length of this list must be the same as the length of Ms.
  list<RegInfo> Objects = Ts;
}

// SubRegIndex - Use instances of SubRegIndex to identify subregisters.
class SubRegIndex<int size, int offset = 0> {
  string Namespace = "";

  // Size - Size (in bits) of the sub-registers represented by this index.
  int Size = size;

  // Offset - Offset of the first bit that is part of this sub-register index.
  // Set it to -1 if the same index is used to represent sub-registers that can
  // be at different offsets (for example when using an index to access an
  // element in a register tuple).
  int Offset = offset;

  // ComposedOf - A list of two SubRegIndex instances, [A, B].
  // This indicates that this SubRegIndex is the result of composing A and B.
  // See ComposedSubRegIndex.
  list<SubRegIndex> ComposedOf = [];

  // CoveringSubRegIndices - A list of two or more sub-register indexes that
  // cover this sub-register.
  //
  // This field should normally be left blank as TableGen can infer it.
  //
  // TableGen automatically detects sub-registers that straddle the registers
  // in the SubRegs field of a Register definition. For example:
  //
  //   Q0    = dsub_0 -> D0, dsub_1 -> D1
  //   Q1    = dsub_0 -> D2, dsub_1 -> D3
  //   D1_D2 = dsub_0 -> D1, dsub_1 -> D2
  //   QQ0   = qsub_0 -> Q0, qsub_1 -> Q1
  //
  // TableGen will infer that D1_D2 is a sub-register of QQ0. It will be given
  // the synthetic index dsub_1_dsub_2 unless some SubRegIndex is defined with
  // CoveringSubRegIndices = [dsub_1, dsub_2].
  list<SubRegIndex> CoveringSubRegIndices = [];
}

// ComposedSubRegIndex - A sub-register that is the result of composing A and B.
// Offset is set to the sum of A and B's Offsets. Size is set to B's Size.
class ComposedSubRegIndex<SubRegIndex A, SubRegIndex B>
  : SubRegIndex<B.Size, !if(!eq(A.Offset, -1), -1,
                        !if(!eq(B.Offset, -1), -1,
                            !add(A.Offset, B.Offset)))> {
  // See SubRegIndex.
  let ComposedOf = [A, B];
}

// RegAltNameIndex - The alternate name set to use for register operands of
// this register class when printing.
class RegAltNameIndex {
  string Namespace = "";

  // A set to be used if the name for a register is not defined in this set.
  // This allows creating name sets with only a few alternative names.
  RegAltNameIndex FallbackRegAltNameIndex = ?;
}
def NoRegAltName : RegAltNameIndex;

// Register - You should define one instance of this class for each register
// in the target machine.  String n will become the "name" of the register.
class Register<string n, list<string> altNames = []> {
  string Namespace = "";
  string AsmName = n;
  list<string> AltNames = altNames;

  // Aliases - A list of registers that this register overlaps with.  A read or
  // modification of this register can potentially read or modify the aliased
  // registers.
  list<Register> Aliases = [];

  // SubRegs - A list of registers that are parts of this register. Note these
  // are "immediate" sub-registers and the registers within the list do not
  // themselves overlap. e.g. For X86, EAX's SubRegs list contains only [AX],
  // not [AX, AH, AL].
  list<Register> SubRegs = [];

  // SubRegIndices - For each register in SubRegs, specify the SubRegIndex used
  // to address it. Sub-sub-register indices are automatically inherited from
  // SubRegs.
  list<SubRegIndex> SubRegIndices = [];

  // RegAltNameIndices - The alternate name indices which are valid for this
  // register.
  list<RegAltNameIndex> RegAltNameIndices = [];

  // DwarfNumbers - Numbers used internally by gcc/gdb to identify the register.
  // These values can be determined by locating the <target>.h file in the
  // directory llvmgcc/gcc/config/<target>/ and looking for REGISTER_NAMES.  The
  // order of these names correspond to the enumeration used by gcc.  A value of
  // -1 indicates that the gcc number is undefined and -2 that register number
  // is invalid for this mode/flavour.
  list<int> DwarfNumbers = [];

  // CostPerUse - Additional cost of instructions using this register compared
  // to other registers in its class. The register allocator will try to
  // minimize the number of instructions using a register with a CostPerUse.
  // This is used by the ARC target, by the ARM Thumb and x86-64 targets, where
  // some registers require larger instruction encodings, by the RISC-V target,
  // where some registers preclude using some C instructions.
  int CostPerUse = 0;

  // CoveredBySubRegs - When this bit is set, the value of this register is
  // completely determined by the value of its sub-registers.  For example, the
  // x86 register AX is covered by its sub-registers AL and AH, but EAX is not
  // covered by its sub-register AX.
  bit CoveredBySubRegs = 0;

  // HWEncoding - The target specific hardware encoding for this register.
  bits<16> HWEncoding = 0;

  bit isArtificial = 0;
}

// RegisterWithSubRegs - This can be used to define instances of Register which
// need to specify sub-registers.
// List "subregs" specifies which registers are sub-registers to this one. This
// is used to populate the SubRegs and AliasSet fields of TargetRegisterDesc.
// This allows the code generator to be careful not to put two values with
// overlapping live ranges into registers which alias.
class RegisterWithSubRegs<string n, list<Register> subregs> : Register<n> {
  let SubRegs = subregs;
}

// DAGOperand - An empty base class that unifies RegisterClass's and other forms
// of Operand's that are legal as type qualifiers in DAG patterns.  This should
// only ever be used for defining multiclasses that are polymorphic over both
// RegisterClass's and other Operand's.
class DAGOperand {
  string OperandNamespace = "MCOI";
  string DecoderMethod = "";
}

// RegisterClass - Now that all of the registers are defined, and aliases
// between registers are defined, specify which registers belong to which
// register classes.  This also defines the default allocation order of
// registers by register allocators.
//
class RegisterClass<string namespace, list<ValueType> regTypes, int alignment,
                    dag regList, RegAltNameIndex idx = NoRegAltName>
  : DAGOperand {
  string Namespace = namespace;

  // The register size/alignment information, parameterized by a HW mode.
  RegInfoByHwMode RegInfos;

  // RegType - Specify the list ValueType of the registers in this register
  // class.  Note that all registers in a register class must have the same
  // ValueTypes.  This is a list because some targets permit storing different
  // types in same register, for example vector values with 128-bit total size,
  // but different count/size of items, like SSE on x86.
  //
  list<ValueType> RegTypes = regTypes;

  // Size - Specify the spill size in bits of the registers.  A default value of
  // zero lets tablegen pick an appropriate size.
  int Size = 0;

  // Alignment - Specify the alignment required of the registers when they are
  // stored or loaded to memory.
  //
  int Alignment = alignment;

  // CopyCost - This value is used to specify the cost of copying a value
  // between two registers in this register class. The default value is one
  // meaning it takes a single instruction to perform the copying. A negative
  // value means copying is extremely expensive or impossible.
  int CopyCost = 1;

  // MemberList - Specify which registers are in this class.  If the
  // allocation_order_* method are not specified, this also defines the order of
  // allocation used by the register allocator.
  //
  dag MemberList = regList;

  // AltNameIndex - The alternate register name to use when printing operands
  // of this register class. Every register in the register class must have
  // a valid alternate name for the given index.
  RegAltNameIndex altNameIndex = idx;

  // isAllocatable - Specify that the register class can be used for virtual
  // registers and register allocation.  Some register classes are only used to
  // model instruction operand constraints, and should have isAllocatable = 0.
  bit isAllocatable = 1;

  // AltOrders - List of alternative allocation orders. The default order is
  // MemberList itself, and that is good enough for most targets since the
  // register allocators automatically remove reserved registers and move
  // callee-saved registers to the end.
  list<dag> AltOrders = [];

  // AltOrderSelect - The body of a function that selects the allocation order
  // to use in a given machine function. The code will be inserted in a
  // function like this:
  //
  //   static inline unsigned f(const MachineFunction &MF) { ... }
  //
  // The function should return 0 to select the default order defined by
  // MemberList, 1 to select the first AltOrders entry and so on.
  code AltOrderSelect = [{}];

  // Specify allocation priority for register allocators using a greedy
  // heuristic. Classes with higher priority values are assigned first. This is
  // useful as it is sometimes beneficial to assign registers to highly
  // constrained classes first. The value has to be in the range [0,63].
  int AllocationPriority = 0;

  // Generate register pressure set for this register class and any class
  // synthesized from it. Set to 0 to inhibit unneeded pressure sets.
  bit GeneratePressureSet = 1;

  // Weight override for register pressure calculation. This is the value
  // TargetRegisterClass::getRegClassWeight() will return. The weight is in
  // units of pressure for this register class. If unset tablegen will
  // calculate a weight based on a number of register units in this register
  // class registers. The weight is per register.
  int Weight = ?;

  // The diagnostic type to present when referencing this operand in a match
  // failure error message. If this is empty, the default Match_InvalidOperand
  // diagnostic type will be used. If this is "<name>", a Match_<name> enum
  // value will be generated and used for this operand type. The target
  // assembly parser is responsible for converting this into a user-facing
  // diagnostic message.
  string DiagnosticType = "";

  // A diagnostic message to emit when an invalid value is provided for this
  // register class when it is being used an an assembly operand. If this is
  // non-empty, an anonymous diagnostic type enum value will be generated, and
  // the assembly matcher will provide a function to map from diagnostic types
  // to message strings.
  string DiagnosticString = "";
}

// The memberList in a RegisterClass is a dag of set operations. TableGen
// evaluates these set operations and expand them into register lists. These
// are the most common operation, see test/TableGen/SetTheory.td for more
// examples of what is possible:
//
// (add R0, R1, R2) - Set Union. Each argument can be an individual register, a
// register class, or a sub-expression. This is also the way to simply list
// registers.
//
// (sub GPR, SP) - Set difference. Subtract the last arguments from the first.
//
// (and GPR, CSR) - Set intersection. All registers from the first set that are
// also in the second set.
//
// (sequence "R%u", 0, 15) -> [R0, R1, ..., R15]. Generate a sequence of
// numbered registers.  Takes an optional 4th operand which is a stride to use
// when generating the sequence.
//
// (shl GPR, 4) - Remove the first N elements.
//
// (trunc GPR, 4) - Truncate after the first N elements.
//
// (rotl GPR, 1) - Rotate N places to the left.
//
// (rotr GPR, 1) - Rotate N places to the right.
//
// (decimate GPR, 2) - Pick every N'th element, starting with the first.
//
// (interleave A, B, ...) - Interleave the elements from each argument list.
//
// All of these operators work on ordered sets, not lists. That means
// duplicates are removed from sub-expressions.

// Set operators. The rest is defined in TargetSelectionDAG.td.
def sequence;
def decimate;
def interleave;

// RegisterTuples - Automatically generate super-registers by forming tuples of
// sub-registers. This is useful for modeling register sequence constraints
// with pseudo-registers that are larger than the architectural registers.
//
// The sub-register lists are zipped together:
//
//   def EvenOdd : RegisterTuples<[sube, subo], [(add R0, R2), (add R1, R3)]>;
//
// Generates the same registers as:
//
//   let SubRegIndices = [sube, subo] in {
//     def R0_R1 : RegisterWithSubRegs<"", [R0, R1]>;
//     def R2_R3 : RegisterWithSubRegs<"", [R2, R3]>;
//   }
//
// The generated pseudo-registers inherit super-classes and fields from their
// first sub-register. Most fields from the Register class are inferred, and
// the AsmName and Dwarf numbers are cleared.
//
// RegisterTuples instances can be used in other set operations to form
// register classes and so on. This is the only way of using the generated
// registers.
//
// RegNames may be specified to supply asm names for the generated tuples.
// If used must have the same size as the list of produced registers.
class RegisterTuples<list<SubRegIndex> Indices, list<dag> Regs,
                     list<string> RegNames = []> {
  // SubRegs - N lists of registers to be zipped up. Super-registers are
  // synthesized from the first element of each SubRegs list, the second
  // element and so on.
  list<dag> SubRegs = Regs;

  // SubRegIndices - N SubRegIndex instances. This provides the names of the
  // sub-registers in the synthesized super-registers.
  list<SubRegIndex> SubRegIndices = Indices;

  // List of asm names for the generated tuple registers.
  list<string> RegAsmNames = RegNames;
}


//===----------------------------------------------------------------------===//
// DwarfRegNum - This class provides a mapping of the llvm register enumeration
// to the register numbering used by gcc and gdb.  These values are used by a
// debug information writer to describe where values may be located during
// execution.
class DwarfRegNum<list<int> Numbers> {
  // DwarfNumbers - Numbers used internally by gcc/gdb to identify the register.
  // These values can be determined by locating the <target>.h file in the
  // directory llvmgcc/gcc/config/<target>/ and looking for REGISTER_NAMES.  The
  // order of these names correspond to the enumeration used by gcc.  A value of
  // -1 indicates that the gcc number is undefined and -2 that register number
  // is invalid for this mode/flavour.
  list<int> DwarfNumbers = Numbers;
}

// DwarfRegAlias - This class declares that a given register uses the same dwarf
// numbers as another one. This is useful for making it clear that the two
// registers do have the same number. It also lets us build a mapping
// from dwarf register number to llvm register.
class DwarfRegAlias<Register reg> {
      Register DwarfAlias = reg;
}
```

-----

## CSKY

#### define the `CSKYReg`

```c++
let Namespace = "CSKY" in {
  class CSKYReg<bits<6> Enc, string n, list<string> alt = []> : Register<n> {
    let HWEncoding{5 - 0} = Enc;
    let AltNames = alt;
  }
  def ABIRegAltName : RegAltNameIndex;
} // Namespace = "CSKY" 
```



`ABIRegAltName`用于在汇编中显示，一般是没有这个的, AltNames是别名



### Use the `CSKYReg`

`[a0]`等用于在汇编中进行显示，一般是没有这个的。

```c++
let RegAltNameIndices = [ABIRegAltName] in {
  def R0 : CSKYReg<0, "r0", ["a0"]>, DwarfRegNum<[0]>;
  def R1 : CSKYReg<1, "r1", ["a1"]>, DwarfRegNum<[1]>;
  def R2 : CSKYReg<2, "r2", ["a2"]>, DwarfRegNum<[2]>;
  def R3 : CSKYReg<3, "r3", ["a3"]>, DwarfRegNum<[3]>;
  def R4 : CSKYReg<4, "r4", ["l0"]>, DwarfRegNum<[4]>;
  def R5 : CSKYReg<5, "r5", ["l1"]>, DwarfRegNum<[5]>;
  def R6 : CSKYReg<6, "r6", ["l2"]>, DwarfRegNum<[6]>;
  def R7 : CSKYReg<7, "r7", ["l3"]>, DwarfRegNum<[7]>;
  def R8 : CSKYReg<8, "r8", ["l4"]>, DwarfRegNum<[8]>;
  def R9 : CSKYReg<9, "r9", ["l5"]>, DwarfRegNum<[9]>;
  def R10 : CSKYReg<10, "r10", ["l6"]>, DwarfRegNum<[10]>;
  def R11 : CSKYReg<11, "r11", ["l7"]>, DwarfRegNum<[11]>;
  def R12 : CSKYReg<12, "r12", ["t0"]>, DwarfRegNum<[12]>;
  def R13 : CSKYReg<13, "r13", ["t1"]>, DwarfRegNum<[13]>;
  def R14 : CSKYReg<14, "r14", ["sp"]>, DwarfRegNum<[14]>;
  def R15 : CSKYReg<15, "r15", ["lr"]>, DwarfRegNum<[15]>;
  def R16 : CSKYReg<16, "r16", ["l8"]>, DwarfRegNum<[16]>;
  def R17 : CSKYReg<17, "r17", ["l9"]>, DwarfRegNum<[17]>;
  def R18 : CSKYReg<18, "r18", ["t2"]>, DwarfRegNum<[18]>;
  def R19 : CSKYReg<19, "r19", ["t3"]>, DwarfRegNum<[19]>;
  def R20 : CSKYReg<20, "r20", ["t4"]>, DwarfRegNum<[20]>;
  def R21 : CSKYReg<21, "r21", ["t5"]>, DwarfRegNum<[21]>;
  def R22 : CSKYReg<22, "r22", ["t6"]>, DwarfRegNum<[22]>;
  def R23 : CSKYReg<23, "r23", ["t7"]>, DwarfRegNum<[23]>;
  def R24 : CSKYReg<24, "r24", ["t8"]>, DwarfRegNum<[24]>;
  def R25 : CSKYReg<25, "r25", ["t9"]>, DwarfRegNum<[25]>;
  def R26 : CSKYReg<26, "r26", ["r26"]>, DwarfRegNum<[26]>;
  def R27 : CSKYReg<27, "r27", ["r27"]>, DwarfRegNum<[27]>;
  def R28 : CSKYReg<28, "r28", ["rgb"]>, DwarfRegNum<[28]>;
  def R29 : CSKYReg<29, "r29", ["rtb"]>, DwarfRegNum<[29]>;
  def R30 : CSKYReg<30, "r30", ["svbr"]>, DwarfRegNum<[30]>;
  def R31 : CSKYReg<31, "r31", ["tls"]>, DwarfRegNum<[31]>;
  def CR0 : CSKYReg<33, "cr0", ["psr"]>;
  def HI : CSKYReg<34, "hi", ["hi"]>, DwarfRegNum<[36]>;
  def LO : CSKYReg<35, "lo", ["lo"]>, DwarfRegNum<[37]>;

  let Aliases = [R14] in def SP : CSKYReg<14, "r14", ["sp"]>, DwarfRegNum<[14]>;
  let Aliases = [R15] in def LR : CSKYReg<15, "r15", ["lr"]>, DwarfRegNum<[15]>;
  let Aliases = [R28] in def GP : CSKYReg<28, "r28", ["rgb"]>,
      DwarfRegNum<[28]>;
}
```





定义`GPR`

```c++
def GPR : RegisterClass<"CSKY", [i32], 32,
                        (add(sequence "R%u", 0, 3), (sequence "R%u", 12, 13),
                         (sequence "R%u", 18, 25), LR, (sequence "R%u", 4, 11),
                         (sequence "R%u", 16, 17), (sequence "R%u", 26, 27), GP,
                         (sequence "R%u", 29, 30), SP, R31)> {
  let Size = 32;
}
```

`(sequence "R%u", 18, 25)`表示`R18, R19 ... R25`



可以在`CSKYGenRegisterInfo.inc`中看到GPR的定义

```
// GPR MCPhysReg GPR[] = {
  CSKY::RO, CSKY::R1, CSKY::R2, CSKY::R3, CSKY::R12....
}
```

这里的顺序也是分配`GPR`寄存器时的顺序。



```c++
def AL : Register<"AL">, DwarfRegNum<[0, 0, 0]>;
定义了寄存器AL并给它赋值（用DwarfRegNum）以用于gcc、gdb或者一个调试信息输入来标识一个寄存器。对于寄存器AL，DwarfRegNum携带三个值的数组表示三种不同的模式：第一个元素用来表示X86-64，第二个用来在X86-32上的异常处理（EH），第三个是一般用途。-1是个表示gcc数字没有定义，-2表示该模式下寄存器号无效。 
  
// DwarfRegNum是用在gcc/gdb中的
  
  
def D0 : Rd< 0, "F0", [F0, F1]>, DwarfRegNum<[32]>;
def D1 : Rd< 2, "F2", [F2, F3]>, DwarfRegNum<[34]>;
上面所示的最后两个寄存器（D0和D1）都是双精度浮点寄存器作为一双单精度浮点数子寄存器的别名。其他的别名，已经定义的寄存器的子寄存器与父寄存器的关系都在寄存器的TargetRegisterDesc的字段中。
```



-------



## RegisterInfo.cpp

#### 1 CSR register

#### `getCalleeSavedRegs`

```c++
const MCPhysReg *
CSKYRegisterInfo::getCalleeSavedRegs(const MachineFunction *MF) const {
  const CSKYSubtarget &STI = MF->getSubtarget<CSKYSubtarget>();
  if (STI.hasFPUv2DoubleFloat() || STI.hasFPUv3DoubleFloat())
    return CSR_GPR_FPR64_SaveList;
  if (STI.hasFPUv2SingleFloat() || STI.hasFPUv3SingleFloat())
    return CSR_GPR_FPR32_SaveList;
  return CSR_I32_SaveList;
}
```



在`CallingConv.td`中能看到

```
def CSR_I32: CallingSavedRegs<add LR, GP, (sequence "R%u, 4, 11"),
                               (sequence "R%u, 16, 17")>
```



`GenRegisterInfo.inc`中能看到

```
static const CSR_I32_SaveList[] = {CSKY::LR, CSKY::GP .. CSKY::R17}
```



### 2. getReservedRegs

```c++
BitVector CSKYRegisterInfo::getReservedRegs(const MachineFunction &MF) const {
  BitVector Reserved(getNumRegs());
  markSuperRegs(Reserved, CSKY::SP);
  markSuperRegs(Reserved, CSKY::R26);
  markSuperRegs(Reserved, CSKY::R27);
  markSuperRegs(Reserved, CSKY::GP);
  markSuperRegs(Reserved, CSKY::R29);
  markSuperRegs(Reserved, CSKY::R30);
  markSuperRegs(Reserved, CSKY::R31);
  // TODO: FP, BP
  assert(checkAllSuperRegsMarked(Reserved));
  return Reserved;
}
```



### 3.  eliminateCallFramePseudoInstr

LLVM 中间表示采用 ADJCALLSTACKDOWN 或 ADJCALLSTACKUP 虚拟指令描述堆栈指针的变化，而在最后生成汇编时，需用 C*Core 真实指令代替，即利用 C*Core的 ADDI 指令实现堆栈指针的调整。

```c++
MachineBasicBlock::iterator CSKYFrameLowering::eliminateCallFramePseudoInstr(
    MachineFunction &MF, MachineBasicBlock &MBB,
    MachineBasicBlock::iterator MI) const {
  const CSKYInstrInfo *TII = STI.getInstrInfo();
  DebugLoc DL = MI->getDebugLoc();

  if (!hasReservedCallFrame(MF)) {
    int64_t Amount = MI->getOperand(0).getImm();
    if (MI->getOpcode() == CSKY::ADJCALLSTACKDOWN)
      Amount = -Amount;

    // Adjust sp register
    emitSPAdj(MBB, MI, DL, TII, Amount);
  }
  return MBB.erase(MI);
}
```



### 4. eliminateFrameIndex

`CSKYRegisterInfo.cpp`

LLVM 中间表示利用虚拟栈帧索引管理函数调用时的栈空间。C*Core 则根据调用的函数是否调整堆栈空间或调用其它函数，决定了当前虚拟栈帧索引存放在堆栈指针寄存器 R0，抑或临时栈帧寄存器 R8。



















