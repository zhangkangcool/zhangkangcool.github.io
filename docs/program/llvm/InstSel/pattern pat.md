<h1 align="center">pattern pat</h1>
# 1. Simple Pat<



#### ISD::SETCC

`SETCC`目前没有出现在中括号里如（ISD::SELECT），出现在了Pat<中,然后会继续去选择。如继续选择`PPC::EXTRACT_SUBREG`和`ISD::FCMPUS`

```asm
def : Pat<(ISD::Node), (TargetOpcode::Node)>
def : Pat<(PPCISD::Node), (PPC::Node)>
```





```asm
let Predicates = [HasFPU] in {
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETOLT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_lt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETLT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_lt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETOGT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_gt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETGT)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_gt)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETOEQ)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_eq)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETEQ)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_eq)>;
def : Pat<(i1 (setcc f32:$s1, f32:$s2, SETUO)),
          (EXTRACT_SUBREG (FCMPUS $s1, $s2), sub_un)>;
```





#### How to use Pat<

`Pat<ISD::, PPC::>`

Example: How to select `isd::extract_vector_elt`

```asm
ISEL: Starting selection on root node: t26: i32 = extract_vector_elt t104, Constant:i64<0>
 6332 ISEL: Starting pattern match
 6333   Initial Opcode index to 34955
 6334   Skipped scope entry (due to false predicate) at index 34959, continuing at 35627
 6335   TypeSwitch[i32] from 35631 to 35741
 6336   Skipped scope entry (due to false predicate) at index 35748, continuing at 35780
 6337   Skipped scope entry (due to false predicate) at index 35781, continuing at 35812
 6338   Created node: t227: i64 = LI8 TargetConstant:i64<0>
 6339 Creating new machine node: t229: i64 = VEXTUWLX t227, t104
 6340   Created node: t229: i64 = VEXTUWLX t227, t104
 6341   Morphed node: t26: i32 = EXTRACT_SUBREG t229, TargetConstant:i32<1>
 6342 ISEL: Match complete!

```



```asm
 def : Pat<(i32 (vector_extract v4i32:$S, 0)),
            (i32 (EXTRACT_SUBREG (VEXTUWLX (LI8 0), $S), sub_32))>;
```





------



# 2. ComplexPattern

指令定义时中括号匹配规则中所使用的复杂操作数，利用C++函数进行各种逻辑判断。

基于` ComplexPattern `的操作数匹配。利用 `ComplexPattern`，可以支持复杂的操作数模式，但需编写 C++实现的模式匹配函数。需在`ISelDAGToDAG.cpp`中实现对应的函数。

模式匹配函数返回的一定是`bool`类型，说明什么以条件可以匹配到这个pattern。



#### 2.1 X86

以下  `selectLEA64_32Addr`的代码`X86`

```c++

// Define X86-specific addressing mode.
// 定义复杂pattern对应的
def addr      : ComplexPattern<iPTR, 5, "selectAddr", [], [SDNPWantParent]>;
def lea32addr : ComplexPattern<i32, 5, "selectLEAAddr",
                               [add, sub, mul, X86mul_imm, shl, or, frameindex],
                               []>;
// In 64-bit mode 32-bit LEAs can use RIP-relative addressing.
def lea64_32addr : ComplexPattern<i32, 5, "selectLEA64_32Addr",
                                  [add, sub, mul, X86mul_imm, shl, or,
                                   frameindex, X86WrapperRIP],
                                  []>;

// 匹配复杂pattern
def LEA64_32r : I<0x8D, MRMSrcMem,
                  (outs GR32:$dst), (ins lea64_32mem:$src),
                  "lea{l}\t{$src|$dst}, {$dst|$src}",
                  [(set GR32:$dst, lea64_32addr:$src)]>,
                  OpSize32, Requires<[In64BitMode]>;
```



```c++
bool X86DAGToDAGISel::selectLEA64_32Addr(SDValue N, SDValue &Base,
                                         SDValue &Scale, SDValue &Index,
                                         SDValue &Disp, SDValue &Segment) {
  ...                                        
}
```





#### 2.2 PowerPC

```c++
1031 // Define PowerPC specific addressing mode.
1032
1033 // d-form
1034 def iaddr    : ComplexPattern<iPTR, 2, "SelectAddrImm",     [], []>;  // "stb"
1035 // ds-form
1036 def iaddrX4  : ComplexPattern<iPTR, 2, "SelectAddrImmX4",   [], []>;  // "std"
1037 // dq-form
1038 def iaddrX16 : ComplexPattern<iPTR, 2, "SelectAddrImmX16",  [], []>;  // "stxv"
1039
1040 // Below forms are all x-form addressing mode, use three different ones so we
1041 // can make a accurate check for x-form instructions in ISEL.
1042 // x-form addressing mode whose associated displacement form is D.
1043 def xaddr  : ComplexPattern<iPTR, 2, "SelectAddrIdx",     [], []>;    // "stbx"
1044 // x-form addressing mode whose associated displacement form is DS.
1045 def xaddrX4 : ComplexPattern<iPTR, 2, "SelectAddrIdxX4",    [], []>;  // "stdx"
1046 // x-form addressing mode whose associated displacement form is DQ.
1047 def xaddrX16 : ComplexPattern<iPTR, 2, "SelectAddrIdxX16",   [], []>; // "stxvx"
1048
1049 def xoaddr : ComplexPattern<iPTR, 2, "SelectAddrIdxOnly",[], []>;
1050
1051 // The address in a single register. This is used with the SjLj
1052 // pseudo-instructions.
1053 def addr   : ComplexPattern<iPTR, 1, "SelectAddr",[], []>;
1054
1055 /// This is just the offset part of iaddr, used for preinc.
1056 def iaddroff : ComplexPattern<iPTR, 1, "SelectAddrImmOffs", [], []>;
1057
1058 // PC Relative Address
1059 def pcreladdr : ComplexPattern<iPTR, 1, "SelectAddrPCRel", [], []>;
```

