<h1 align="center">ISD</h1>
# ./lib/CodeGen/TargetLoweringBase.cpp

http://llvm.org/doxygen/namespacellvm_1_1ISD.html

此文件中有IR Opcode到ISD的转换
```c++
1446 int TargetLoweringBase::InstructionOpcodeToISD(unsigned Opcode) const {
1447   enum InstructionOpcodes {
1448 #define HANDLE_INST(NUM, OPCODE, CLASS) OPCODE = NUM,
1449 #define LAST_OTHER_INST(NUM) InstructionOpcodesCount = NUM
1450 #include "llvm/IR/Instruction.def"
1451   };
1452   switch (static_cast<InstructionOpcodes>(Opcode)) {
1453   case Ret:            return 0;
...
1492   case Trunc:          return ISD::TRUNCATE;
1493   case ZExt:           return ISD::ZERO_EXTEND;
1494   case SExt:           return ISD::SIGN_EXTEND;
1495   case FPToUI:         return ISD::FP_TO_UINT;
1496   case FPToSI:         return ISD::FP_TO_SINT;
1497   case UIToFP:         return ISD::UINT_TO_FP;
1498   case SIToFP:         return ISD::SINT_TO_FP;
1499   case FPTrunc:        return ISD::FP_ROUND;
1500   case FPExt:          return ISD::FP_EXTEND;
1501   case PtrToInt:       return ISD::BITCAST;
1502   case IntToPtr:       return ISD::BITCAST;
1503   case BitCast:        return ISD::BITCAST;
1504   case AddrSpaceCast:  return ISD::ADDRSPACECAST;
```

# ./include/llvm/Target/TargetSelectionDAG.td
```c++
124 def SDTIntBinHiLoOp : SDTypeProfile<2, 2, [ // mulhi, mullo, sdivrem, udivrem
 125   SDTCisSameAs<0, 1>, SDTCisSameAs<0, 2>, SDTCisSameAs<0, 3>,SDTCisInt<0>
 126 ]>;

352 def sdiv       : SDNode<"ISD::SDIV"      , SDTIntBinOp>;
 353 def udiv       : SDNode<"ISD::UDIV"      , SDTIntBinOp>;
 354 def srem       : SDNode<"ISD::SREM"      , SDTIntBinOp>;
 355 def urem       : SDNode<"ISD::UREM"      , SDTIntBinOp>;
 356 def sdivrem    : SDNode<"ISD::SDIVREM"   , SDTIntBinHiLoOp>;
```



# ISD instruction

### VECTOR

####  1 VECTOR_SHUFFLE

```
VECTOR_SHUFFLE(VEC1, VEC2) - Returns a vector, of the same type as VEC1/VEC2.

A VECTOR_SHUFFLE node also contains an array of constant int values that indicate which value (or undef) each result element will get. These constant ints are accessible through the ShuffleVectorSDNode class. This is quite similar to the Altivec 'vperm' instruction, except that the indices must be constants and are in terms of the element size of VEC1/VEC2, not in terms of bytes.
```

将VEC1与VEC2进行连接，然后选取VEC1_VEC2中的元素组成新的VEC，会根据MASK进行选择。



MASK可以是任意的长度。



```shell
t10: v4f32 = vector_shuffle<5,0,2,7> t9, t4

t9 = <1.0, 2.0, 3.0, 4.0>
t4 = <5.0, 6.0, 7.0, 8.0>
mask = <5, 0, 2, 7>
t9_t4 = <1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0>
vector_shuffle<5,0,2,7> t9, t4 = <6.0, 1.0, 3.0, 8.0>
```



#### 对就的IR是

```assembly
<result> = shufflevector<4 x i32>%v1, <4 x i32>%v2, <4 x i32><i32 0, i32 4, i32 1, i32 5>
<result> = shufflevector v1, v2, MASK
```



```shell
define void @VMRGLW_xx(<16 x i8>* %A) {
entry:
  %tmp = load <16 x i8>, <16 x i8>* %A, align 16
  %tmp2 = shufflevector <16 x i8> %tmp, <16 x i8> %tmp, <16 x i32> <i32 0, i32 1, i32 2, i32 3, i32 0, i32 1, i32 2, i32 3, i32 4, i32 5, i32 6, i32 7, i32 4, i32 5, i32 6, i32 7>
  store <16 x i8> %tmp2, <16 x i8>* %A, align 16
  ret void
}

tmp = <0到15>
tmp2=<0, 1, 2, 3, 0, 1, 2, 3, 4, 5, 6, 7, 4, 5, 6, 7> ==> vmrglw
```







------------------

### PPCISD

定义在PPCInstrInfo.td中



------------

## ISD Node

#### SELECT/SETCC/SELECT_CC/VSELECT

- SELECT(CC, TRUEVAL, FALSEVAL).

  If the type of the boolean COND is not i1 then the high bits must conform to getBooleanContents.

  ```assembly
  ret: i64 = select seteq:ch t0, t1
  ```

  

- SELECT_CC(Cond, LHS, RHS, TrueEval, FalseEval, CC)

  ```assembly
  ret: i64 = select_cc  t0, t1, t2, t3, seteq:ch
  ```

- SETCC(LHS, RHS, CC)

  ```assembly
  ret: i1 = setcc  t0, t1, seteq:ch
  ```

  

##### FP_EXEND

```assembly
488 ISEL: Starting selection on root node: t17: f64 = fp_extend t4
 489 ISEL: Starting pattern match
 490   Initial Opcode index to 99638
 491   TypeSwitch[f64] from 99639 to 99642
 492 Creating constant: t26: i32 = TargetConstant<11>
 493   Morphed node: t17: f64 = COPY_TO_REGCLASS t4, TargetConstant:i32<11>
 494 ISEL: Match complete!
```

FP_EXTEND会变成`COPY_TO_REGCLASS`，fp32变为fp64，不需要加任何指令。





### 	insert_vector_elt & scalar_to_vector

```assembly
Legalizing: t19: v2i64 = insert_vector_elt undef:v2i64, t16, Constant:i32<0>
Trying to expand node
Creating new node: t27: v2i64 = scalar_to_vector t16
Successfully expanded node
 ... replacing: t19: v2i64 = insert_vector_elt undef:v2i64, t16, Constant:i32<0>
     with:      t27: v2i64 = scalar_to_vector t16
```



### XXPERMDI XT, XA, XB, DM

从XA,XB中各取一个元素

XA中选一个要求DMbit[0]选一个元素作为XT.dword[0]，

XB中选一个要求DMbit[1]选一个元素作为XT.dword[1]。



DM = 0xnm

DMbit[0] = 0，则 XT.dword[0] = XA.dword[0]，否则XT.dword[0] = XA.dword[1].

DMbit[1] = 0，则 XT.dword[1] = XB.dword[0]，否则XT.dword[1] = XB.dword[1].

```assembly
src1 = VSR[XA]
 --------------------------------
|  dword[0] = a  |  dword[1] = b |
 --------------------------------


src1 = VSR[XB]
 --------------------------------
|  dword[0] = c  |  dword[1] = d |
 --------------------------------



tgt = VSR[XT]
 --------------------------------
|  dword[0]      |  dword[1]     |
 --------------------------------

XA: ab
XB: cd

xxspltd T, A, 0  <===> xxpermdi T, A, A, 0b00 ==> aa
xxspltd T, A, 1  <===> xxpermdi T, A, A, 0b11 ==> bb
xxmghd  T, A, B  <===> xxpermdi T, A, B, 0b00 ==> ac
xxmgld  T, A, B  <===> xxpermdi T, A, B, 0b11 ==> bd
xxswapd T, A     <===> xxpermdi T, A, A, 0b10 ==> ad （交换dword[1]）
```



```assembly
SDValue Ef64 = DAG.getNode(ISD::UNDEF, dl, MVT::f64);
SDValue TVVec = DAG.getNode(ISD::BUILD_VECTOR, dl, MVT::v2f64, Ef64, TV);

===> 使用t43中低位向量2次，组成新向量
t28: v2f64 = XXPERMDI t43, t43, TargetConstant:i32<0>
```



### 类型转换FPEXTEND

fp32->fp64，不会产生任何指令，fp64->fp128会产生一条`sxcvdpqp`指令。

```assembly
  def : Pat<(f64 (fpextend f32:$src)),
            (COPY_TO_REGCLASS $src, VSFRC)>;
            
// Convert DP -> QP
  def XSCVDPQP  : X_VT5_XO5_VB5_TyVB<63, 22, 836, "xscvdpqp", vfrc,
                                     [(set f128:$vT, (fpextend f64:$vB))]>;
                                     
```

