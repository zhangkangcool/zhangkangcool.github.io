

```
CCDelegateTo尝试找到一个指定的子调用约定，如果找到匹配的，它将被唤醒。
CCIfCC是一个尝试匹配给定的名称和当下调用约定的接口。
CCIf<predicate，action>：如果判定匹配，运用这个操作。
CCIflnReg<action>：如果参数有“inreg’’属性，运用这个操作。
CCIfNest<action>：如果参数有“nest”属性，运用这个操作。
CCIfNotVarArg<action>：如果当前的函数不接受可变数的参数，那么运用这个操作。
CCAssignToRegWithShadow<registerList．shadowList>：．跟CCAssignToReg相似，但有是用于影子寄存器列表。
CCPassByVal<size，align>：将最小的指定的size和alignment赋值给stack slot 
CCPromoteToType<type>：将当前值推送到指定的类型。
CallingConv<[actions]>一Define each calling convention that is supposed．定义每个支持的调用约定。
```





# 1. 通常情况

## 1. 定义CallingConv使用规则



### 1.1 XCoreCallingConv.td

```c++
 12 // XCore Return Value Calling Convention
 13 //===----------------------------------------------------------------------===//
 14 def RetCC_XCore : CallingConv<[
 15   // i32 are returned in registers R0, R1, R2, R3
 16   CCIfType<[i32], CCAssignToReg<[R0, R1, R2, R3]>>,
 17
 18   // Integer values get stored in stack slots that are 4 bytes in
 19   // size and 4-byte aligned.
 20   CCIfType<[i32], CCAssignToStack<4, 4>>
 21 ]>;
 22
 23 //===----------------------------------------------------------------------===//
 24 // XCore Argument Calling Conventions
 25 //===----------------------------------------------------------------------===//
 26 def CC_XCore : CallingConv<[
 27   // Promote i8/i16 arguments to i32.
 28   CCIfType<[i8, i16], CCPromoteToType<i32>>,
 29
 30   // The 'nest' parameter, if any, is passed in R11.
 31   CCIfNest<CCAssignToReg<[R11]>>,
 32
 33   // The first 4 integer arguments are passed in integer registers.
 34   CCIfType<[i32], CCAssignToReg<[R0, R1, R2, R3]>>,
 35
 36   // Integer values get stored in stack slots that are 4 bytes in
 37   // size and 4-byte aligned.
 38   CCIfType<[i32], CCAssignToStack<4, 4>>
 39 ]>;

```



### 1.2 XCoreGenCallingConv.inc

上述`td`文件会产生以下`inc`文件。以下代码中可以具体查看`CallingConv`是如何运作的。

```c++
  9 static bool CC_XCore(unsigned ValNo, MVT ValVT,
 10                      MVT LocVT, CCValAssign::LocInfo LocInfo,
 11                      ISD::ArgFlagsTy ArgFlags, CCState &State);
 12 static bool RetCC_XCore(unsigned ValNo, MVT ValVT,
 13                         MVT LocVT, CCValAssign::LocInfo LocInfo,
 14                         ISD::ArgFlagsTy ArgFlags, CCState &State);

...
  
 59 static bool RetCC_XCore(unsigned ValNo, MVT ValVT,
 60                         MVT LocVT, CCValAssign::LocInfo LocInfo,
 61                         ISD::ArgFlagsTy ArgFlags, CCState &State) {
 62
 63   if (LocVT == MVT::i32) {
 64     static const MCPhysReg RegList1[] = {
 65       XCore::R0, XCore::R1, XCore::R2, XCore::R3
 66     };
 67     if (unsigned Reg = State.AllocateReg(RegList1)) {
 68       State.addLoc(CCValAssign::getReg(ValNo, ValVT, Reg, LocVT, LocInfo));
 69       return false;
 70     }
 71   }
 72
 73   if (LocVT == MVT::i32) {
 74     unsigned Offset2 = State.AllocateStack(4, Align(4));
 75     State.addLoc(CCValAssign::getMem(ValNo, ValVT, Offset2, LocVT, LocInfo));
 76     return false;
 77   }
 78
 79   return true;  // CC didn't match.
 80 }
```



## 2. 使用CallingConv规则

`XCoreISelLowering.cpp`会包含上述`XCoreGenCallingConv.inc`文件，这样就可以调用`CC_XCore()`和`RetCC_XCore()`。

```c++
// XCoreISelLowering.cpp
1421 bool XCoreTargetLowering::
1422 CanLowerReturn(CallingConv::ID CallConv, MachineFunction &MF,
1423                bool isVarArg,
1424                const SmallVectorImpl<ISD::OutputArg> &Outs,
1425                LLVMContext &Context) const {
1426   SmallVector<CCValAssign, 16> RVLocs;
1427   CCState CCInfo(CallConv, isVarArg, MF, RVLocs, Context);
1428   if (!CCInfo.CheckReturn(Outs, RetCC_XCore))
1429     return false;
1430   if (CCInfo.getNextStackOffset() != 0 && isVarArg)
1431     return false;
1432   return true;
1433 }

```





在`ISelLowering.cpp`中的`LowerFormalArguments（）`和`LowerCall()`均会调用`CCAssignFnForCall`以处理参数调用问题。



以下代码来自`CSKY`:

```c++
CCAssignFn *CSKYTargetLowering::CCAssignFnForCall(CallingConv::ID CC,
                                                  bool IsVarArg) const {
  if (Subtarget.useSoftFloat())
    return CC_CSKY_ABIV2_SOFT;

  if (Subtarget.hasFPUv2DoubleFloat() || Subtarget.hasFPUv3DoubleFloat())
    return CC_CSKY_ABIV2_DF;
  if (Subtarget.hasFPUv2SingleFloat() || Subtarget.hasFPUv3SingleFloat())
    return CC_CSKY_ABIV2_SF;

  return CC_CSKY_ABIV2_SOFT;
}

CCAssignFn *CSKYTargetLowering::CCAssignFnForReturn(CallingConv::ID CC) const {
  if (Subtarget.useSoftFloat())
    return RetCC_CSKY_ABIV2_SOFT;

  if (Subtarget.hasFPUv2DoubleFloat() || Subtarget.hasFPUv3DoubleFloat())
    return RetCC_CSKY_ABIV2_DF;
  if (Subtarget.hasFPUv2SingleFloat() || Subtarget.hasFPUv3SingleFloat())
    	return RetCC_CSKY_ABIV2_SF;

  return RetCC_CSKY_ABIV2_SOFT;
}
```





在`ISelLowering.cpp`中的`LowerCallResult（）`、`LowerReturn()`和   `  CanLowerReturn`均会调用`CCAssignFnForReturn()`以处理返回数的问题。

------



# 2. 例外RISCV

`RISCV`的`CC_RISCV`和`RetCC_RISCV`没有在`RISCVCallingConv.td`中实现。而在`RISCVISelLowering.cpp`直接进行实现并使用。



```c++
// RISCVCallingConv.td
 13 // The RISC-V calling convention is handled with custom code in
 14 // RISCVISelLowering.cpp (CC_RISCV).

```



```c++
// RISCVISelLowering.cpp
1903 // FastCC has less than 1% performance improvement for some particular
1904 // benchmark. But theoretically, it may has benenfit for some cases.
1905 static bool CC_RISCV_FastCC(unsigned ValNo, MVT ValVT, MVT LocVT,
1906                             CCValAssign::LocInfo LocInfo,
1907                             ISD::ArgFlagsTy ArgFlags, CCState &State) {
}


1504 static bool CC_RISCVAssign2XLen(unsigned XLen, CCState &State, CCValAssign VA1,
1505                                 ISD::ArgFlagsTy ArgFlags1, unsigned ValNo2,
1506                                 MVT ValVT2, MVT LocVT2,
1507                                 ISD::ArgFlagsTy ArgFlags2) {
}



1541 // Implements the RISC-V calling convention. Returns true upon failure.
1542 static bool CC_RISCV(const DataLayout &DL, RISCVABI::ABI ABI, unsigned ValNo,
1543                      MVT ValVT, MVT LocVT, CCValAssign::LocInfo LocInfo,
1544                      ISD::ArgFlagsTy ArgFlags, CCState &State, bool IsFixed,
1545                      bool IsRet, Type *OrigTy) {
}
```



