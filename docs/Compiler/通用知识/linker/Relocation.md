<h1 align="center">Relocation</h1>


```asm
0000000000000000 <foo>:
   0:	00 00 4c 3c 	addis   r2,r12,0
   4:	00 00 42 38 	addi    r2,r2,0
   8:	a1 ff 21 f8 	stdu    r1,-96(r1)
   c:	a6 02 08 7c 	mflr    r0
  10:	3d 00 e1 f7 	stxv    vs63,48(r1)
  14:	2d 00 c1 f7 	stxv    vs62,32(r1)
  18:	58 00 e1 db 	stfd    f31,88(r1)
  1c:	70 00 01 f8 	std     r0,112(r1)
  20:	50 00 e1 fb 	std     r31,80(r1)
  24:	48 00 c1 fb 	std     r30,72(r1)
  28:	00 00 e0 3b 	li      r31,0
  2c:	8c 03 01 10 	vspltisw v0,1
  30:	78 1b 7e 7c 	mr      r30,r3
  34:	d7 fc ff f3 	xxlxor  vs63,vs63,vs63
  38:	e3 03 c0 f3 	xvcvsxwdp vs62,vs32
  3c:	96 f4 fe f3 	xxlor   vs31,vs62,vs62
  40:	96 fc 3f f0 	xxlor   vs1,vs63,vs63
  44:	01 00 00 48 	bl      44 <foo+0x44>
  48:	00 00 00 60 	nop
  4c:	01 00 ff 3b 	addi    r31,r31,1
  50:	07 f1 ff f3 	xsadddp vs63,vs63,vs62
  54:	00 fc e1 f3 	xsmaxcdp vs31,vs1,vs31
  58:	00 f0 1f 7c 	cmpw    r31,r30
  5c:	e4 ff 80 41 	blt     40 <foo+0x40>
  60:	90 fc 3f f0 	xxlor   vs1,vs31,vs31
  64:	39 00 e1 f7 	lxv     vs63,48(r1)
  68:	29 00 c1 f7 	lxv     vs62,32(r1)
  6c:	70 00 01 e8 	ld      r0,112(r1)
  70:	50 00 e1 eb 	ld      r31,80(r1)
  74:	a6 03 08 7c 	mtlr    r0
  78:	48 00 c1 eb 	ld      r30,72(r1)
  7c:	58 00 e1 cb 	lfd     f31,88(r1)
  80:	60 00 21 38 	addi    r1,r1,96
  84:	20 00 80 4e 	blr
  88:	00 00 00 00 	.long 0x0
  8c:	00 00 22 01 	.long 0x1220000
  90:	81 02 00 00 	.long 0x281
  94:	88 00 00 00 	.long 0x88
```



Line 44 is a relocation.



```shell
readelf xlc.o -a
ELF 头：
  Magic：  7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00
  类别:                              ELF64
  数据:                              2 补码，小端序 (little endian)
  版本:                              1 (current)
  OS/ABI:                            UNIX - System V
  ABI 版本:                          0
  类型:                              REL (可重定位文件)
  系统架构:                          PowerPC64
  版本:                              0x1
  入口点地址：              0x0
  程序头起点：              0 (bytes into file)
  Start of section headers:          64 (bytes into file)
  标志：             0x2, abiv2
  本头的大小：       64 (字节)
  程序头大小：       0 (字节)
  Number of program headers:         0
  节头大小：         64 (字节)
  节头数量：         9
  字符串表索引节头： 1

节头：
  [号] 名称              类型             地址              偏移量
       大小              全体大小          旗标   链接   信息   对齐
  [ 0]                   NULL             0000000000000000  00000000
       0000000000000000  0000000000000000           0     0     0
  [ 1] .shstrtab         STRTAB           0000000000000000  00000640
       00000000000000cf  0000000000000000           0     0     0
  [ 2] .symtab           SYMTAB           0000000000000000  00000870
       0000000000000090  0000000000000018           3     3     0
  [ 3] .strtab           STRTAB           0000000000000000  00000900
       0000000000000025  0000000000000000           0     0     0
  [ 4] .text             PROGBITS         0000000000000000  00000780
       0000000000000098  0000000000000000  AX       0     0     32
  [ 5] .rela.text        RELA             0000000000000000  00000820
       0000000000000048  0000000000000018           2     4     8
  [ 6] .comment          PROGBITS         0000000000000000  00000720
       0000000000000043  0000000000000000           0     0     1
  [ 7] .eh_frame         PROGBITS         0000000000000000  00000930
       0000000000000060  0000000000000000  WA       0     0     8
  [ 8] .rela.eh_frame    RELA             0000000000000000  00000990
       0000000000000018  0000000000000018           2     7     8
Key to Flags:
  W (write), A (alloc), X (execute), M (merge), S (strings), I (info),
  L (link order), O (extra OS processing required), G (group), T (TLS),
  C (compressed), x (unknown), o (OS specific), E (exclude),
  p (processor specific)

There are no section groups in this file.

本文件中没有程序头。

重定位节 '.rela.text' 位于偏移量 0x820 含有 3 个条目：
  偏移量          信息           类型           符号值        符号名称 + 加数
000000000000  0004000000fc R_PPC64_REL16_HA  0000000000000000 .TOC. + 0
000000000004  0004000000fa R_PPC64_REL16_LO  0000000000000000 .TOC. + 4
000000000044  00050000000a R_PPC64_REL24     0000000000000000 __xl_sin + 0

重定位节 '.rela.eh_frame' 位于偏移量 0x990 含有 1 个条目：
  偏移量          信息           类型           符号值        符号名称 + 加数
000000000020  00020000002c R_PPC64_REL64     0000000000000000 .The_Code + 0

The decoding of unwind sections for machine type PowerPC64 is not currently supported.

Symbol table '.symtab' contains 6 entries:
   Num:    Value          Size Type    Bind   Vis      Ndx Name
     0: 0000000000000000     0 NOTYPE  LOCAL  DEFAULT  UND
     1: 0000000000000000     0 FILE    LOCAL  DEFAULT  ABS foo.c
     2: 0000000000000000   152 SECTION LOCAL  DEFAULT    4 .The_Code
     3: 0000000000000000   152 FUNC    GLOBAL DEFAULT [<localentry>: 8]     4 foo
     4: 0000000000000000     0 NOTYPE  GLOBAL DEFAULT  UND .TOC.
     5: 0000000000000000     0 FUNC    GLOBAL DEFAULT  UND __xl_sin

No version information found in this file.
```

