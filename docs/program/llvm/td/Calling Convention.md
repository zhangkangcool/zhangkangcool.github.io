<h1 align="center">Calling Convention</h1>






## PPC ELF Calling Convention

`CCPromoteToType`会提升到64位

#### `def CC_`传参

```c++
127 // Simple calling convention for 64-bit ELF PowerPC fast isel.
128 // Only handle ints and floats.  All ints are promoted to i64.
129 // Vector types and quadword ints are not handled.
130 let Entry = 1 in
131 def CC_PPC64_ELF_FIS : CallingConv<[
132   CCIfCC<"CallingConv::AnyReg", CCDelegateTo<CC_PPC64_AnyReg>>,
133
134   CCIfType<[i1],  CCPromoteToType<i64>>,
135   CCIfType<[i8],  CCPromoteToType<i64>>,
136   CCIfType<[i16], CCPromoteToType<i64>>,
137   CCIfType<[i32], CCPromoteToType<i64>>,
138   CCIfType<[i64], CCAssignToReg<[X3, X4, X5, X6, X7, X8, X9, X10]>>,
139   CCIfType<[f32, f64], CCAssignToReg<[F1, F2, F3, F4, F5, F6, F7, F8]>>
140 ]>;
```



#### `def RetCC`传返回值

```c++
142 // Simple return-value convention for 64-bit ELF PowerPC fast isel.
143 // All small ints are promoted to i64.  Vector types, quadword ints,
144 // and multiple register returns are "supported" to avoid compile
145 // errors, but none are handled by the fast selector.
146 let Entry = 1 in
147 def RetCC_PPC64_ELF_FIS : CallingConv<[
148   CCIfCC<"CallingConv::AnyReg", CCDelegateTo<RetCC_PPC64_AnyReg>>,
149
150   CCIfType<[i1],   CCPromoteToType<i64>>,
151   CCIfType<[i8],   CCPromoteToType<i64>>,
152   CCIfType<[i16],  CCPromoteToType<i64>>,
153   CCIfType<[i32],  CCPromoteToType<i64>>,
154   CCIfType<[i64],  CCAssignToReg<[X3, X4, X5, X6]>>,
155   CCIfType<[i128], CCAssignToReg<[X3, X4, X5, X6]>>,
156   CCIfType<[f32],  CCAssignToReg<[F1, F2, F3, F4, F5, F6, F7, F8]>>,
157   CCIfType<[f64],  CCAssignToReg<[F1, F2, F3, F4, F5, F6, F7, F8]>>,
158   CCIfType<[f128],
159            CCIfSubtarget<"hasP9Vector()",
160            CCAssignToReg<[V2, V3, V4, V5, V6, V7, V8, V9]>>>,
161   CCIfType<[v4f64, v4f32, v4i1],
162            CCIfSubtarget<"hasQPX()", CCAssignToReg<[QF1, QF2]>>>,
163   CCIfType<[v16i8, v8i16, v4i32, v2i64, v1i128, v4f32, v2f64],
164            CCIfSubtarget<"hasAltivec()",
165            CCAssignToReg<[V2, V3, V4, V5, V6, V7, V8, V9]>>>
166 ]>;
```



-----------------

## CSR register

可在`PPCCallingConv.td`中看到CSR寄存器的信息。继承自`CalleeSavedRegs`

```c++
283 def CSR_Altivec : CalleeSavedRegs<(add V20, V21, V22, V23, V24, V25, V26, V27,
284                                        V28, V29, V30, V31)>;
285
286 def CSR_Darwin32 : CalleeSavedRegs<(add R13, R14, R15, R16, R17, R18, R19, R20,
287                                         R21, R22, R23, R24, R25, R26, R27, R28,
288                                         R29, R30, R31, F14, F15, F16, F17, F18,
289                                         F19, F20, F21, F22, F23, F24, F25, F26,
290                                         F27, F28, F29, F30, F31, CR2, CR3, CR4
291                                    )>;
292
293 def CSR_Darwin32_Altivec : CalleeSavedRegs<(add CSR_Darwin32, CSR_Altivec)>;
294
295 // SPE does not use FPRs, so break out the common register set as base.
296 def CSR_SVR432_COMM : CalleeSavedRegs<(add R14, R15, R16, R17, R18, R19, R20,
297                                           R21, R22, R23, R24, R25, R26, R27,
298                                           R28, R29, R30, R31, CR2, CR3, CR4
299                                       )>;
300 def CSR_SVR432 :  CalleeSavedRegs<(add CSR_SVR432_COMM, F14, F15, F16, F17, F18,
301                                         F19, F20, F21, F22, F23, F24, F25, F26,
302                                         F27, F28, F29, F30, F31
303                                    )>;
304 def CSR_SPE : CalleeSavedRegs<(add S14, S15, S16, S17, S18, S19, S20, S21, S22,
305                                    S23, S24, S25, S26, S27, S28, S29, S30, S31
306                               )>;
307
308 def CSR_SVR432_Altivec : CalleeSavedRegs<(add CSR_SVR432, CSR_Altivec)>;
309
310 def CSR_SVR432_SPE : CalleeSavedRegs<(add CSR_SVR432_COMM, CSR_SPE)>;
311
312 def CSR_AIX32 : CalleeSavedRegs<(add R13, R14, R15, R16, R17, R18, R19, R20,
313                                      R21, R22, R23, R24, R25, R26, R27, R28,
314                                      R29, R30, R31, F14, F15, F16, F17, F18,
315                                      F19, F20, F21, F22, F23, F24, F25, F26,
316                                      F27, F28, F29, F30, F31, CR2, CR3, CR4
317                                 )>;
318
319 def CSR_Darwin64 : CalleeSavedRegs<(add X13, X14, X15, X16, X17, X18, X19, X20,
320                                         X21, X22, X23, X24, X25, X26, X27, X28,
321                                         X29, X30, X31, F14, F15, F16, F17, F18,
322                                         F19, F20, F21, F22, F23, F24, F25, F26,
323                                         F27, F28, F29, F30, F31, CR2, CR3, CR4
324                                    )>;
```





