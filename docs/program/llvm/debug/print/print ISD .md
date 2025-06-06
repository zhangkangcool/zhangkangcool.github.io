<h1 align="center">print ISD </h1>


输出机器相关ISD

```c++
DAG.getMachineFunct.ion().getFunction().dump();
```



机器相关REG

```asm
17510 bb.0 (%ir-block.2):                                                                                            |  17606 bb.0 (%ir-block.2):
  17511   successors: %bb.15(0x006cdd21), %bb.1(0x7f9322df); %bb.15(0.33%), %bb.1(99.67%)                              |  17607   successors: %bb.17(0x006cdd21), %bb.1(0x7f9322df); %bb.17(0.33%), %bb.1(99.67%)
  17512   LIFETIME_START %stack.2                                                                                      |  17608   LIFETIME_START %stack.2
  17513   ADJCALLSTACKDOWN 32, 0, implicit-def dead $r1, implicit $r1                                                  |  17609   ADJCALLSTACKDOWN 32, 0, implicit-def dead $r1, implicit $r1
  17514   %32:g8rc = ADDI8 %stack.2, 0                                                                                 |  17610   %63:g8rc = ADDI8 %stack.2, 0
  17515   $x3 = COPY %30:g8rc                                                                                          |  17611   $x3 = COPY %61:g8rc
  17516   $x4 = COPY %31:g8rc                                                                                          |  17612   $x4 = COPY %62:g8rc
  17517   $x5 = COPY %32:g8rc                                                                                          |  17613   $x5 = COPY %63:g8rc
  17518   BL8 @MAIN_parseCommandLine, <regmask $cr2 $cr3 $cr4 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f|  17614   BL8 @MAIN_parseCommandLine, <regmask $cr2 $cr3 $cr4 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $
  17519   ADJCALLSTACKUP 32, 0, implicit-def dead $r1, implicit $r1                                                    |  17615   ADJCALLSTACKUP 32, 0, implicit-def dead $r1, implicit $r1
  17520   LIFETIME_START %stack.0                                                                                      |  17616   LIFETIME_START %stack.0
  17521   ADJCALLSTACKDOWN 32, 0, implicit-def dead $r
```





输出机器无关ISD

```c++
DAG.getMachineFunction().dump();
```

机器无关REG

```asm
18039 define dso_local signext i32 @main(i32 signext %0, i8** nocapture readonly %1) local_unnamed_addr       #11 !prof !105 !section_prefix !96 {
18040   %3 = alloca [3 x [32 x i8]], align 1
18041   %4 = alloca [3 x [32 x i8]], align 1
18042   %5 = alloca %struct.MAIN_Param, align 8
18043   %6 = bitcast %struct.MAIN_Param* %5 to i8*
18044   call void @llvm.lifetime.start.p0i8(i64 32, i8* nonnull %6) #12
18045   call fastcc void @MAIN_parseCommandLine(i32 signext %0, i8** %1, %struct.MAIN_Param* nonnull %5      )
18046   %7 = bitcast [3 x [32 x i8]]* %3 to i8*
18047   call void @llvm.lifetime.start.p0i8(i64 96, i8* nonnull %7) #12
18048   call void @llvm.memcpy.p0i8.p0i8.i64(i8* nonnull align 1 dereferenceable(96) %7, i8* nonnull al      ign 1 dereferenceable(96) getelementptr inbounds ([3 x [32 x i8]], [3 x [32 x i8]]* @__const.MAIN      _printInfo.actionString, i64 0, i64 0, i64 0), i64 96, i1 false) #12
18049   %8 = bitcast [3 x [32 x i8]]* %4 to i8*
```

