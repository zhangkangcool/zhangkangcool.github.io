<h1 align="center">PPC llvm register</h1>
# PPCGenRegisterInfo.inc

可在对应的inc文件中看到详细的寄存器定义

/home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenRegisterInfo.inc

```asm
1333 namespace {     // Register classes...
1334   // VSSRC Register Class...
1335   const MCPhysReg VSSRC[] = {
1336     PPC::F0, PPC::F1, PPC::F2, PPC::F3, PPC::F4, PPC::F5, PPC::F6, PPC::F7, PPC::F8, PPC::F9, PPC::F10, PPC::F11,      PPC::F12, PPC::F13, PPC::F31, PPC::F30, PPC::F29, PPC::F28, PPC::F27, PPC::F26, PPC::F25, PPC::F24, PPC::F23, PP     C::F22, PPC::F21, PPC::F20, PPC::F19, PPC::F18, PPC::F17, PPC::F16, PPC::F15, PPC::F14, PPC::VF2, PPC::VF3, PPC::     VF4, PPC::VF5, PPC::VF0, PPC::VF1, PPC::VF6, PPC::VF7, PPC::VF8, PPC::VF9, PPC::VF10, PPC::VF11, PPC::VF12, PPC::     VF13, PPC::VF14, PPC::VF15, PPC::VF16, PPC::VF17, PPC::VF18, PPC::VF19, PPC::VF31, PPC::VF30, PPC::VF29, PPC::VF2     8, PPC::VF27, PPC::VF26, PPC::VF25, PPC::VF24, PPC::VF23, PPC::VF22, PPC::VF21, PPC::VF20,
1337   };
1338
1339   // VSSRC Bit set.
1340   const uint8_t VSSRCBits[] = {
1341     0x00, 0x00, 0xe0, 0xff, 0xff, 0xff, 0x1f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0     x00, 0x00, 0x00, 0x00, 0x80, 0xff, 0xff, 0xff, 0x7f,
1342   };
1343
1344   // GPRC Register Class...
1345   const MCPhysReg GPRC[] = {
1346     PPC::R2, PPC::R3, PPC::R4, PPC::R5, PPC::R6, PPC::R7, PPC::R8, PPC::R9, PPC::R10, PPC::R11, PPC::R12, PPC::R3     0, PPC::R29, PPC::R28, PPC::R27, PPC::R26, PPC::R25, PPC::R24, PPC::R23, PPC::R22, PPC::R21, PPC::R20, PPC::R19,      PPC::R18, PPC::R17, PPC::R16, PPC::R15, PPC::R14, PPC::R13, PPC::R31, PPC::R0, PPC::R1, PPC::FP, PPC::BP,
1347   };
1348
1349   // GPRC Bit set.
1350   const uint8_t GPRCBits[] = {
1351     0x12, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xff, 0xff, 0xff, 0x7f,
1352   };
1353
1354   // GPRC_NOR0 Register Class...
1355   const MCPhysReg GPRC_NOR0[] = {
1356     PPC::R2, PPC::R3, PPC::R4, PPC::R5, PPC::R6, PPC::R7, PPC::R8, PPC::R9, PPC::R10, PPC::R11, PPC::R12, PPC::R3     0, PPC::R29, PPC::R28, PPC::R27, PPC::R26, PPC::R25, PPC::R24, PPC::R23, PPC::R22, PPC::R21, PPC::R20, PPC::R19,      PPC::R18, PPC::R17, PPC::R16, PPC::R15, PPC::R14, PPC::R13, PPC::R31, PPC::R1, PPC::FP, PPC::BP, PPC::ZERO,
1357   };
1358
1359   // GPRC_NOR0 Bit set.
1360   const uint8_t GPRC_NOR0Bits[] = {
1361     0x12, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x7f,
1362   };
1363
1364   // GPRC_and_GPRC_NOR0 Register Class...
1365   const MCPhysReg GPRC_and_GPRC_NOR0[] = {
1366     PPC::R2, PPC::R3, PPC::R4, PPC::R5, PPC::R6, PPC::R7, PPC::R8, PPC::R9, PPC::R10, PPC::R11, PPC::R12, PPC::R3     0, PPC::R29, PPC::R28, PPC::R27, PPC::R26, PPC::R25, PPC::R24, PPC::R23, PPC::R22, PPC::R21, PPC::R20, PPC::R19,      PPC::R18, PPC::R17, PPC::R16, PPC::R15, PPC::R14, PPC::R13, PPC::R31, PPC::R1, PPC::FP, PPC::BP,
1367   };

1374   // CRBITRC Register Class...
1375   const MCPhysReg CRBITRC[] = {
1376     PPC::CR2LT, PPC::CR2GT, PPC::CR2EQ, PPC::CR2UN, PPC::CR3LT, PPC::CR3GT, PPC::CR3EQ, PPC::CR3UN, PPC::CR4LT, P     PC::CR4GT, PPC::CR4EQ, PPC::CR4UN, PPC::CR5LT, PPC::CR5GT, PPC::CR5EQ, PPC::CR5UN, PPC::CR6LT, PPC::CR6GT, PPC::C     R6EQ, PPC::CR6UN, PPC::CR7LT, PPC::CR7GT, PPC::CR7EQ, PPC::CR7UN, PPC::CR1LT, PPC::CR1GT, PPC::CR1EQ, PPC::CR1UN,      PPC::CR0LT, PPC::CR0GT, PPC::CR0EQ, PPC::CR0UN,
1377   };
1378
1379   // CRBITRC Bit set.
1380   const uint8_t CRBITRCBits[] = {
1381     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0     x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,      0x00, 0x00, 0xff, 0xff, 0xff, 0xff,
1382   };
1383
1384   // F4RC Register Class...
1385   const MCPhysReg F4RC[] = {
1386     PPC::F0, PPC::F1, PPC::F2, PPC::F3, PPC::F4, PPC::F5, PPC::F6, PPC::F7, PPC::F8, PPC::F9, PPC::F10, PPC::F11,      PPC::F12, PPC::F13, PPC::F31, PPC::F30, PPC::F29, PPC::F28, PPC::F27, PPC::F26, PPC::F25, PPC::F24, PPC::F23, PP     C::F22, PPC::F21, PPC::F20, PPC::F19, PPC::F18, PPC::F17, PPC::F16, PPC::F15, PPC::F14,
1387   };
1388
1389   // F4RC Bit set.
1390   const uint8_t F4RCBits[] = {
1391     0x00, 0x00, 0xe0, 0xff, 0xff, 0xff, 0x1f,
1392   };
1393
1394   // CRRC Register Class...
1395   const MCPhysReg CRRC[] = {
1396     PPC::CR0, PPC::CR1, PPC::CR5, PPC::CR6, PPC::CR7, PPC::CR2, PPC::CR3, PPC::CR4,
1397   };

1445   const MCPhysReg VSFRC[] = {
1446     PPC::F0, PPC::F1, PPC::F2, PPC::F3, PPC::F4, PPC::F5, PPC::F6, PPC::F7, PPC::F8, PPC::F9, PPC:     :F10, PPC::F11, PPC::F12, PPC::F13, PPC::F31, PPC::F30, PPC::F29, PPC::F28, PPC::F27, PPC::F26, PP     C::F25, PPC::F24, PPC::F23, PPC::F22, PPC::F21, PPC::F20, PPC::F19, PPC::F18, PPC::F17, PPC::F16,      PPC::F15, PPC::F14, PPC::VF2, PPC::VF3, PPC::VF4, PPC::VF5, PPC::VF0, PPC::VF1, PPC::VF6, PPC::VF7     , PPC::VF8, PPC::VF9, PPC::VF10, PPC::VF11, PPC::VF12, PPC::VF13, PPC::VF14, PPC::VF15, PPC::VF16,      PPC::VF17, PPC::VF18, PPC::VF19, PPC::VF31, PPC::VF30, PPC::VF29, PPC::VF28, PPC::VF27, PPC::VF26     , PPC::VF25, PPC::VF24, PPC::VF23, PPC::VF22, PPC::VF21, PPC::VF20,
1447   };
1448
1449   // VSFRC Bit set.
1450   const uint8_t VSFRCBits[] = {
1451     0x00, 0x00, 0xe0, 0xff, 0xff, 0xff, 0x1f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00     , 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xff, 0xff, 0xff, 0x7f,
1452   };
```

------------

# PPCRegisterInfo.td(可以看到PPC所有支持的寄存器)

`XER` `CARRY` `RM`

```c++
235 def XER: SPR<1, "xer">, DwarfRegNum<[76]>;
236
237 // Carry bit.  In the architecture this is really bit 0 of the XER register
238 // (which really is SPR register 1);  this is the only bit interesting to a
239 // compiler.
240 def CARRY: SPR<1, "xer">, DwarfRegNum<[76]> {
241   let Aliases = [XER];
242 }
243
244 // FP rounding mode:  bits 30 and 31 of the FP status and control register
245 // This is not allocated as a normal register; it appears only in
246 // Uses and Defs.  The ABI says it needs to be preserved by a function,
247 // but this is not achieved by saving and restoring it as with
248 // most registers, it has to be done in code; to make this work all the
249 // return and call instructions are described as Uses of RM, so instructions
250 // that do nothing but change RM will not get deleted.
251 def RM: PPCReg<"**ROUNDING MODE**">;
```



向量寄存器只支持128(个数 * 位数)位

VSFRC包括F8RC和VFRC

```asm
// Allocate volatiles first, then non-volatiles in reverse order. With the SVR4
// ABI the size of the Floating-point register save area is determined by the
// allocated non-volatile register with the lowest register number, as FP
// register N is spilled to offset 8 * (32 - N) below the back chain word of the
// previous stack frame. By allocating non-volatiles in reverse order we make
// sure that the Floating-point register save area is always as small as
// possible because there aren't any unused spill slots.
def F8RC : RegisterClass<"PPC", [f64], 64, (add (sequence "F%u", 0, 13),
                                                (sequence "F%u", 31, 14))>;
def F4RC : RegisterClass<"PPC", [f32], 32, (add F8RC)>;

def VRRC : RegisterClass<"PPC",
                         [v16i8,v8i16,v4i32,v2i64,v1i128,v4f32,v2f64, f128],
                         128,
                         (add V2, V3, V4, V5, V0, V1, V6, V7, V8, V9, V10, V11,
                             V12, V13, V14, V15, V16, V17, V18, V19, V31, V30,
                             V29, V28, V27, V26, V25, V24, V23, V22, V21, V20)>;

// VSX register classes (the allocation order mirrors that of the corresponding
// subregister classes).
def VSLRC : RegisterClass<"PPC", [v4i32,v4f32,v2f64,v2i64], 128,
                          (add (sequence "VSL%u", 0, 13),
                               (sequence "VSL%u", 31, 14))>;
def VSRC  : RegisterClass<"PPC", [v4i32,v4f32,v2f64,v2i64], 128,
                          (add VSLRC, VRRC)>;

// Register classes for the 64-bit "scalar" VSX subregisters.
def VFRC :  RegisterClass<"PPC", [f64], 64,
                          (add VF2, VF3, VF4, VF5, VF0, VF1, VF6, VF7,
                               VF8, VF9, VF10, VF11, VF12, VF13, VF14,
                               VF15, VF16, VF17, VF18, VF19, VF31, VF30,
                               VF29, VF28, VF27, VF26, VF25, VF24, VF23,
                               VF22, VF21, VF20)>;
def VSFRC : RegisterClass<"PPC", [f64], 64, (add F8RC, VFRC)>;

// Allow spilling GPR's into caller-saved VSR's.
def SPILLTOVSRRC : RegisterClass<"PPC", [i64, f64], 64, (add G8RC, (sub VSFRC,
                (sequence "VF%u", 31, 20),
                (sequence "F%u", 31, 14)))>;

// Register class for single precision scalars in VSX registers
def VSSRC : RegisterClass<"PPC", [f32], 32, (add VSFRC)>;


```



PPC不支持的类型如`v2i32`不会出现在td文件中。

 如果想处理的类型不是支持的最基本类型，必须将结果做Lowering（Type Legalize）

不支持的类型，在指令选择时是无法使用的，这些类型不会出现在指令选择的td文件中。

如： `setOperationAction(ISD::VECREDUCE_ADD, MVT::v2i32, Custom);`

void PPCTargetLowering::ReplaceNodeResults()

setOperationAction(ISD::VECREDUCE_ADD, MVT::v2i32, Custom);

----------------------

### `VRRC`, `VSRC` & `VSFRC`区别

`./lib/Target/PowerPC/PPCRegisterInfo.td`

```asm
// 只用于整数向量
def VRRC : RegisterClass<"PPC",
                         [v16i8,v8i16,v4i32,v2i64,v1i128,v4f32,v2f64, f128],
                         128,
                         (add V2, V3, V4, V5, V0, V1, V6, V7, V8, V9, V10, V11,
                             V12, V13, V14, V15, V16, V17, V18, V19, V31, V30,
                             V29, V28, V27, V26, V25, V24, V23, V22, V21, V20)>;

// 用于Int和Vevtor,
def VSRC  : RegisterClass<"PPC", [v4i32,v4f32,v2f64,v2i64], 128,
                          (add VSLRC, VRRC)>;

// 只用于FP向量
// Register classes for the 64-bit "scalar" VSX subregisters.
def VFRC :  RegisterClass<"PPC", [f64], 64,
                          (add VF2, VF3, VF4, VF5, VF0, VF1, VF6, VF7,
                               VF8, VF9, VF10, VF11, VF12, VF13, VF14,
                               VF15, VF16, VF17, VF18, VF19, VF31, VF30,
                               VF29, VF28, VF27, VF26, VF25, VF24, VF23,
                               VF22, VF21, VF20)>;

// 用于Fp和Vevtor,
def VSFRC : RegisterClass<"PPC", [f64], 64, (add F8RC, VFRC)>;


你说的是真的把类型转换成向量，而不是通过 

直接insert，然后patter
有新指令的话，pattern认insert
insert->(pattern insert)

```





VSX 是新的

AltiVector是老的