<h1 align="center">mir</h1>
Create & use mir command

```shell
Start-after start-before吃mir文件，得到最终的机器asm
Stop-after stop-before吃ll文件，得到mir文件
Run-pass 吃mir 文件，得到运行了某些优化之后的mir文件
llc -start-after ppc-mi-peepholes -ppc-late-peephole convert-simplify.mir -o asm.s
llc -stop-before ppc-mi-peepholes -ppc-convert-rr-to-ri convert.ll -o stop-before.mir


llc run-pass ppc-mi-peepholes -ppc-convert-rr-to-ri  -o run-pass.mir convert-simplify.mir

llc -start-before ppc-mi-peepholes -ppc-late-peephole convert-simplify.mir -o start-before.s


llc -start-before ppc-mi-peepholes -ppc-late-peephole convert.mir -o convert.s -mcpu=pwr9

```



#### 吃mir文件时不能使用`<`

```shell
llc -run-pass=ppc-early-ret test.mir -o - | FileCheck test.mir
```



下面的方法是错的

```shell
llc -run-pass=ppc-early-ret < test.mir | FileCheck test.mir
expected top-level entity
--- |
^
```





## mir Example

```shell
# RUN: llc -run-pass ppc-mi-peepholes -ppc-convert-rr-to-ri %s -o - | FileCheck %s
# RUN: llc -start-after ppc-mi-peepholes -ppc-late-peephole %s -o - | FileCheck %s --check-prefix=CHECK-LATE

--- |
  ; ModuleID = 'convert-rr-to-ri-instrs.ll'
  source_filename = "convert-rr-to-ri-instrs.c"
  target datalayout = "e-m:e-i64:64-n32:64"
  target triple = "powerpc64le-unknown-linux-gnu"


  ; Function Attrs: norecurse nounwind readonly
  define double @testLXSDX(double* nocapture readonly %ptr, i32 zeroext %idx) local_unnamed_addr #1 {
  entry:
    %add = add i32 %idx, 1
    %idxprom = zext i32 %add to i64
    %arrayidx = getelementptr inbounds double, double* %ptr, i64 %idxprom
    %0 = load double, double* %arrayidx, align 8, !tbaa !12
    %add1 = add i32 %idx, 2
    %idxprom2 = zext i32 %add1 to i64
    %arrayidx3 = getelementptr inbounds double, double* %ptr, i64 %idxprom2
    %1 = load double, double* %arrayidx3, align 8, !tbaa !12
    %add4 = fadd double %0, %1
    ret double %add4
  }
 

  attributes #0 = { norecurse nounwind readnone "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "less-precise-fpmad"="false" "no-frame-pointer-elim"="false" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="pwr9" "target-features"="+altivec,+bpermd,+crypto,+direct-move,+extdiv,+htm,+power8-vector,+power9-vector,+vsx,-qpx" "unsafe-fp-math"="false" "use-soft-float"="false" }
  attributes #1 = { norecurse nounwind readonly "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "less-precise-fpmad"="false" "no-frame-pointer-elim"="false" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="pwr9" "target-features"="+altivec,+bpermd,+crypto,+direct-move,+extdiv,+htm,+power8-vector,+power9-vector,+vsx,-qpx" "unsafe-fp-math"="false" "use-soft-float"="false" }
  attributes #2 = { norecurse nounwind readonly "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "less-precise-fpmad"="false" "no-frame-pointer-elim"="false" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="pwr9" "target-features"="+altivec,+bpermd,+crypto,+direct-move,+extdiv,+htm,+power8-vector,+power9-vector,-vsx,-qpx" "unsafe-fp-math"="false" "use-soft-float"="false" }
  attributes #3 = { norecurse nounwind "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "less-precise-fpmad"="false" "no-frame-pointer-elim"="false" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="pwr9" "target-features"="+altivec,+bpermd,+crypto,+direct-move,+extdiv,+htm,+power8-vector,+power9-vector,+vsx,-qpx" "unsafe-fp-math"="false" "use-soft-float"="false" }

  !llvm.module.flags = !{!0, !1}
  !llvm.ident = !{!2}

  !0 = !{i32 1, !"wchar_size", i32 4}
  !1 = !{i32 7, !"PIC Level", i32 2}
  !2 = !{!"clang version 6.0.0 (trunk 316067)"}
  !3 = !{!4, !4, i64 0}
  !4 = !{!"omnipotent char", !5, i64 0}
  !5 = !{!"Simple C/C++ TBAA"}
  !6 = !{!7, !7, i64 0}
  !7 = !{!"short", !4, i64 0}
  !8 = !{!9, !9, i64 0}
  !9 = !{!"int", !4, i64 0}
  !10 = !{!11, !11, i64 0}
  !11 = !{!"long long", !4, i64 0}
  !12 = !{!13, !13, i64 0}
  !13 = !{!"double", !4, i64 0}
  !14 = !{!15, !15, i64 0}
  !15 = !{!"float", !4, i64 0}

...
---
name:            testLXSDX
# CHECK-ALL: name: testLXSDX
alignment:       4
exposesReturnsTwice: false
legalized:       false
regBankSelected: false
selected:        false
tracksRegLiveness: true
registers:
  - { id: 0, class: g8rc_and_g8rc_nox0, preferred-register: '' }
  - { id: 1, class: g8rc, preferred-register: '' }
  - { id: 2, class: gprc_and_gprc_nor0, preferred-register: '' }
  - { id: 3, class: gprc, preferred-register: '' }
  - { id: 4, class: g8rc, preferred-register: '' }
  - { id: 5, class: g8rc, preferred-register: '' }
  - { id: 6, class: g8rc, preferred-register: '' }
  - { id: 7, class: vsfrc, preferred-register: '' }
  - { id: 8, class: gprc, preferred-register: '' }
  - { id: 9, class: g8rc, preferred-register: '' }
  - { id: 10, class: g8rc, preferred-register: '' }
  - { id: 11, class: g8rc, preferred-register: '' }
  - { id: 12, class: vsfrc, preferred-register: '' }
  - { id: 13, class: vsfrc, preferred-register: '' }
liveins:
  - { reg: '$x3', virtual-reg: '%0' }
  - { reg: '$x4', virtual-reg: '%1' }
frameInfo:
  isFrameAddressTaken: false
  isReturnAddressTaken: false
  hasStackMap:     false
  hasPatchPoint:   false
  stackSize:       0
  offsetAdjustment: 0
  maxAlignment:    0
  adjustsStack:    false
  hasCalls:        false
  stackProtector:  ''
  maxCallFrameSize: 4294967295
  hasOpaqueSPAdjustment: false
  hasVAStart:      false
  hasMustTailInVarArgFunc: false
  savePoint:       ''
  restorePoint:    ''
fixedStack:
stack:
constants:
body:             |
  bb.0.entry:
    liveins: $x3, $x4

    %1 = COPY $x4
    %0 = COPY $x3
    %2 = COPY %1.sub_32
    %3 = ADDI %2, 1
    %5 = IMPLICIT_DEF
    %4 = INSERT_SUBREG %5, killed %3, 1
    %6 = LI8 100
    %7 = LXSDX %0, killed %6, implicit $rm :: (load 8 from %ir.arrayidx, !tbaa !12)
    ; CHECK: DFLOADf64 100, %0
    ; CHECK-LATE: lfd 0, 100(3)
    %8 = ADDI %2, 2
    %10 = IMPLICIT_DEF
    %9 = INSERT_SUBREG %10, killed %8, 1
    %11 = LI8 -120
    %12 = LXSDX %0, killed %11, implicit $rm :: (load 8 from %ir.arrayidx3, !tbaa !12)
    ; CHECK: DFLOADf64 -120, %0
    ; CHECK-LATE: lfd 1, -120(3)
    %13 = XSADDDP killed %7, killed %12, implicit $rm
    $f1 = COPY %13
    BLR8 implicit $lr8, implicit $rm, implicit $f1

...

吃mir文件，得到最终的机器汇编文件
llc -start-after ppc-mi-peepholes -ppc-late-peephole convert-simplify.mir -o asm.s
Asm.s:
	.text
	.abiversion 2
	.file	"convert-rr-to-ri-instrs.c"
	.globl	testLXSDX               # -- Begin function testLXSDX
	.p2align	4
	.type	testLXSDX,@function
testLXSDX:                              # @testLXSDX
.Lfunc_begin0:
# %bb.0:                                # %entry
	lfd 0, 100(3)
	lfd 1, -120(3)
	xsadddp 1, 0, 1
	blr
	.long	0
	.quad	0
.Lfunc_end0:
	.size	testLXSDX, .Lfunc_end0-.Lfunc_begin0
                                        # -- End function

	.ident	"clang version 6.0.0 (trunk 316067)"
	.section	".note.GNU-stack","",@progbits


吃mir文件，得到另一种mir文件，该mir运行了ppc-mi-peepholes -ppc-convert-rr-to-ri.
llc -run-pass ppc-mi-peepholes -ppc-convert-rr-to-ri  -o run-pass.mir convert-simplify.mir
Run-pass.mir
--- |
  ; ModuleID = 'convert-simplify.mir'
  source_filename = "convert-rr-to-ri-instrs.c"
  target datalayout = "e-m:e-i64:64-n32:64"
  target triple = "powerpc64le-unknown-linux-gnu"

  ; Function Attrs: norecurse nounwind readonly
  define double @testLXSDX(double* nocapture readonly %ptr, i32 zeroext %idx) local_unnamed_addr #0 {
  entry:
    %add = add i32 %idx, 1
    %idxprom = zext i32 %add to i64
    %arrayidx = getelementptr inbounds double, double* %ptr, i64 %idxprom
    %0 = load double, double* %arrayidx, align 8, !tbaa !3
    %add1 = add i32 %idx, 2
    %idxprom2 = zext i32 %add1 to i64
    %arrayidx3 = getelementptr inbounds double, double* %ptr, i64 %idxprom2
    %1 = load double, double* %arrayidx3, align 8, !tbaa !3
    %add4 = fadd double %0, %1
    ret double %add4
  }

  attributes #0 = { norecurse nounwind readonly "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "less-precise-fpmad"="false" "no-frame-pointer-elim"="false" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="pwr9" "target-features"="+altivec,+bpermd,+crypto,+direct-move,+extdiv,+htm,+power8-vector,+power9-vector,+vsx,-qpx" "unsafe-fp-math"="false" "use-soft-float"="false" }

  !llvm.module.flags = !{!0, !1}
  !llvm.ident = !{!2}

  !0 = !{i32 1, !"wchar_size", i32 4}
  !1 = !{i32 7, !"PIC Level", i32 2}
  !2 = !{!"clang version 6.0.0 (trunk 316067)"}
  !3 = !{!4, !4, i64 0}
  !4 = !{!"double", !5, i64 0}
  !5 = !{!"omnipotent char", !6, i64 0}
  !6 = !{!"Simple C/C++ TBAA"}

...
---
name:            testLXSDX
alignment:       4
exposesReturnsTwice: false
legalized:       false
regBankSelected: false
selected:        false
failedISel:      false
tracksRegLiveness: true
hasWinCFI:       false
registers:
  - { id: 0, class: g8rc_and_g8rc_nox0, preferred-register: '' }
  - { id: 1, class: g8rc, preferred-register: '' }
  - { id: 2, class: gprc_and_gprc_nor0, preferred-register: '' }
  - { id: 3, class: gprc, preferred-register: '' }
  - { id: 4, class: g8rc, preferred-register: '' }
  - { id: 5, class: g8rc, preferred-register: '' }
  - { id: 6, class: g8rc, preferred-register: '' }
  - { id: 7, class: vsfrc, preferred-register: '' }
  - { id: 8, class: gprc, preferred-register: '' }
  - { id: 9, class: g8rc, preferred-register: '' }
  - { id: 10, class: g8rc, preferred-register: '' }
  - { id: 11, class: g8rc, preferred-register: '' }
  - { id: 12, class: vsfrc, preferred-register: '' }
  - { id: 13, class: vsfrc, preferred-register: '' }
liveins:
  - { reg: '$x3', virtual-reg: '%0' }
  - { reg: '$x4', virtual-reg: '%1' }
frameInfo:
  isFrameAddressTaken: false
  isReturnAddressTaken: false
  hasStackMap:     false
  hasPatchPoint:   false
  stackSize:       0
  offsetAdjustment: 0
  maxAlignment:    0
  adjustsStack:    false
  hasCalls:        false
  stackProtector:  ''
  maxCallFrameSize: 4294967295
  cvBytesO
fCalleeSavedRegisters: 0
  hasOpaqueSPAdjustment: false
  hasVAStart:      false
  hasMustTailInVarArgFunc: false
  localFrameSize:  0
  savePoint:       ''
  restorePoint:    ''
fixedStack:      []
stack:           []
constants:       []
body:             |
  bb.0.entry:
    liveins: $x3, $x4

    %1:g8rc = COPY $x4
    %0:g8rc_and_g8rc_nox0 = COPY $x3
    %2:gprc_and_gprc_nor0 = COPY %1.sub_32
    %3:gprc = ADDI %2, 1
    %5:g8rc = IMPLICIT_DEF
    %4:g8rc = INSERT_SUBREG %5, killed %3, %subreg.sub_32
    %6:g8rc = LI8 100
    %7:vsfrc = DFLOADf64 100, %0, implicit $rm :: (load 8 from %ir.arrayidx, !tbaa !3)
    %8:gprc = ADDI %2, 2
    %10:g8rc = IMPLICIT_DEF
    %9:g8rc = INSERT_SUBREG %10, killed %8, %subreg.sub_32
    %11:g8rc = LI8 -120
    %12:vsfrc = DFLOADf64 -120, %0, implicit $rm :: (load 8 from %ir.arrayidx3, !tbaa !3)
    %13:vsfrc = XSADDDP killed %7, killed %12, implicit $rm
    $f1 = COPY %13
    BLR8 implicit $lr8, implicit $rm, implicit $f1

...

```



### 吃mir文件，得到最终的机器汇编文件

`llc -start-after ppc-mi-peepholes -ppc-late-peephole convert-simplify.mir -o asm.s`

```asm
Asm.s:
	.text
	.abiversion 2
	.file	"convert-rr-to-ri-instrs.c"
	.globl	testLXSDX               # -- Begin function testLXSDX
	.p2align	4
	.type	testLXSDX,@function
testLXSDX:                              # @testLXSDX
.Lfunc_begin0:
# %bb.0:                                # %entry
	lfd 0, 100(3)
	lfd 1, -120(3)
	xsadddp 1, 0, 1
	blr
	.long	0
	.quad	0
.Lfunc_end0:
	.size	testLXSDX, .Lfunc_end0-.Lfunc_begin0
                                        # -- End function

	.ident	"clang version 6.0.0 (trunk 316067)"
	.section	".note.GNU-stack","",@progbits

```



### 吃mir文件，得到另一mir文件 run-pass

`llc -run-pass ppc-mi-peepholes -ppc-convert-rr-to-ri  -o run-pass.mir convert-simplify.mir`

```asm
Run-pass.mir
--- |
  ; ModuleID = 'convert-simplify.mir'
  source_filename = "convert-rr-to-ri-instrs.c"
  target datalayout = "e-m:e-i64:64-n32:64"
  target triple = "powerpc64le-unknown-linux-gnu"

  ; Function Attrs: norecurse nounwind readonly
  define double @testLXSDX(double* nocapture readonly %ptr, i32 zeroext %idx) local_unnamed_addr #0 {
  entry:
    %add = add i32 %idx, 1
    %idxprom = zext i32 %add to i64
    %arrayidx = getelementptr inbounds double, double* %ptr, i64 %idxprom
    %0 = load double, double* %arrayidx, align 8, !tbaa !3
    %add1 = add i32 %idx, 2
    %idxprom2 = zext i32 %add1 to i64
    %arrayidx3 = getelementptr inbounds double, double* %ptr, i64 %idxprom2
    %1 = load double, double* %arrayidx3, align 8, !tbaa !3
    %add4 = fadd double %0, %1
    ret double %add4
  }

  attributes #0 = { norecurse nounwind readonly "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "less-precise-fpmad"="false" "no-frame-pointer-elim"="false" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="pwr9" "target-features"="+altivec,+bpermd,+crypto,+direct-move,+extdiv,+htm,+power8-vector,+power9-vector,+vsx,-qpx" "unsafe-fp-math"="false" "use-soft-float"="false" }

  !llvm.module.flags = !{!0, !1}
  !llvm.ident = !{!2}

  !0 = !{i32 1, !"wchar_size", i32 4}
  !1 = !{i32 7, !"PIC Level", i32 2}
  !2 = !{!"clang version 6.0.0 (trunk 316067)"}
  !3 = !{!4, !4, i64 0}
  !4 = !{!"double", !5, i64 0}
  !5 = !{!"omnipotent char", !6, i64 0}
  !6 = !{!"Simple C/C++ TBAA"}

...
---
name:            testLXSDX
alignment:       4
exposesReturnsTwice: false
legalized:       false
regBankSelected: false
selected:        false
failedISel:      false
tracksRegLiveness: true
hasWinCFI:       false
registers:
  - { id: 0, class: g8rc_and_g8rc_nox0, preferred-register: '' }
  - { id: 1, class: g8rc, preferred-register: '' }
  - { id: 2, class: gprc_and_gprc_nor0, preferred-register: '' }
  - { id: 3, class: gprc, preferred-register: '' }
  - { id: 4, class: g8rc, preferred-register: '' }
  - { id: 5, class: g8rc, preferred-register: '' }
  - { id: 6, class: g8rc, preferred-register: '' }
  - { id: 7, class: vsfrc, preferred-register: '' }
  - { id: 8, class: gprc, preferred-register: '' }
  - { id: 9, class: g8rc, preferred-register: '' }
  - { id: 10, class: g8rc, preferred-register: '' }
  - { id: 11, class: g8rc, preferred-register: '' }
  - { id: 12, class: vsfrc, preferred-register: '' }
  - { id: 13, class: vsfrc, preferred-register: '' }
liveins:
  - { reg: '$x3', virtual-reg: '%0' }
  - { reg: '$x4', virtual-reg: '%1' }
frameInfo:
  isFrameAddressTaken: false
  isReturnAddressTaken: false
  hasStackMap:     false
  hasPatchPoint:   false
  stackSize:       0
  offsetAdjustment: 0
  maxAlignment:    0
  adjustsStack:    false
  hasCalls:        false
  stackProtector:  ''
  maxCallFrameSize: 4294967295
  cvBytesO
fCalleeSavedRegisters: 0
  hasOpaqueSPAdjustment: false
  hasVAStart:      false
  hasMustTailInVarArgFunc: false
  localFrameSize:  0
  savePoint:       ''
  restorePoint:    ''
fixedStack:      []
stack:           []
constants:       []
body:             |
  bb.0.entry:
    liveins: $x3, $x4

    %1:g8rc = COPY $x4
    %0:g8rc_and_g8rc_nox0 = COPY $x3
    %2:gprc_and_gprc_nor0 = COPY %1.sub_32
    %3:gprc = ADDI %2, 1
    %5:g8rc = IMPLICIT_DEF
    %4:g8rc = INSERT_SUBREG %5, killed %3, %subreg.sub_32
    %6:g8rc = LI8 100
    %7:vsfrc = DFLOADf64 100, %0, implicit $rm :: (load 8 from %ir.arrayidx, !tbaa !3)
    %8:gprc = ADDI %2, 2
    %10:g8rc = IMPLICIT_DEF
    %9:g8rc = INSERT_SUBREG %10, killed %8, %subreg.sub_32
    %11:g8rc = LI8 -120
    %12:vsfrc = DFLOADf64 -120, %0, implicit $rm :: (load 8 from %ir.arrayidx3, !tbaa !3)
    %13:vsfrc = XSADDDP killed %7, killed %12, implicit $rm
    $f1 = COPY %13
    BLR8 implicit $lr8, implicit $rm, implicit $f1

...

```





简化的MIR文件，只包括必须的name和body,若`CHECK`在`---`内，必须与bb1:等对齐。`bb.1`等块后不能再有名字

```asm
[shkzhang@recycler:~/llvm/llvm/test/CodeGen/PowerPC]$ cat ifcvt-diamond-ret.mir
# RUN: llc -mtriple=powerpc64le-unknown-linux-gnu -run-pass=if-converter %s -o - | FileCheck %s
---
name:           foo
body:           |
  bb.0:
  liveins: $x0, $x3
  successors: %bb.1(0x40000000), %bb.2(0x40000000)

  dead renamable $x3 = ANDI8_rec killed renamable $x3, 1, implicit-def dead $cr0, implicit-def $cr0gt
  $cr2lt = CROR $cr0gt, $cr0gt
  BCn killed renamable $cr2lt, %bb.2
  B %bb.1

  bb.1:
    renamable $x3 = LIS8 4096
    MTLR8 $x0, implicit-def $lr8
    BLR8 implicit $lr8, implicit $rm, implicit $x3

  bb.2:
    renamable $x3 = LIS8 4096
    MTLR8 $x0, implicit-def $lr8
    BLR8 implicit $lr8, implicit $rm, implicit $x3
...

# Diamond testcase with equivalent branches terminating in returns.

# CHECK: body:             |
# CHECK:  bb.0:
# CHECK:    dead renamable $x3 = ANDI8_rec killed renamable $x3, 1, implicit-def dead $cr0, implicit-def $cr0gt
# CHECK:    $cr2lt = CROR $cr0gt, $cr0gt
# CHECK:    renamable $x3 = LIS8 4096
# CHECK:    MTLR8 $x0, implicit-def $lr8
# CHECK:    BLR8 implicit $lr8, implicit $rm, implicit $x3
```





### llvm/test/CodeGen/PowerPC/ppcf128-freeze.mir

```asm
# RUN: llc -mtriple powerpc64le-unknown-linux-gnu -start-after=codegenprepare \
# RUN:   -o - %s -verify-machineinstrs | FileCheck %s

--- |
  define ppc_fp128 @freeze_select(ppc_fp128 %a, ppc_fp128 %b) {
    %sel.frozen = freeze ppc_fp128 %a
    %cmp = fcmp one ppc_fp128 %sel.frozen, 0xM00000000000000000000000000000000
    br i1 %cmp, label %select.end, label %select.false

  select.false:                                     ; preds = %0
    br label %select.end

  select.end:                                       ; preds = %0, %select.false
    %sel = phi ppc_fp128 [ %a, %0 ], [ %b, %select.false ]
    ret ppc_fp128 %sel
  }

  ; CHECK-LABEL: freeze_select
  ; CHECK:       # %bb.0:
  ; CHECK-NEXT:    xxlxor 0, 0, 0
  ; CHECK-NEXT:    fcmpu 5, 2, 2
  ; CHECK-NEXT:    fcmpu 1, 1, 1
  ; CHECK-NEXT:    fcmpu 6, 2, 0
  ; CHECK-NEXT:    fcmpu 0, 1, 0
  ; CHECK-NEXT:    crnor 20, 23, 26
  ; CHECK-NEXT:    crand 20, 2, 20
  ; CHECK-NEXT:    bclr 12, 20, 0
  ; CHECK-NEXT:  # %bb.1:
  ; CHECK-NEXT:    crnor 20, 7, 2
  ; CHECK-NEXT:    bclr 12, 20, 0
  ; CHECK-NEXT:  # %bb.2:                                # %select.false
  ; CHECK-NEXT:    fmr 1, 3
  ; CHECK-NEXT:    fmr 2, 4
  ; CHECK-NEXT:    blr
...
```

