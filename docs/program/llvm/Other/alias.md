### 汇编级别的

PPCAsmPseudo定义汇编级别的alias指令，不会出来在Codegen中。



```c++
4429 // Pseudo-instructions for alternate assembly syntax (never used by codegen).
4430 // These are aliases that require C++ handling to convert to the target
4431 // instruction, while InstAliases can be handled directly by tblgen.
4432 class PPCAsmPseudo<string asm, dag iops>
4433   : Instruction {
4434   let Namespace = "PPC";
4435   bit PPC64 = 0;  // Default value, override with isPPC64
4436
4437   let OutOperandList = (outs);
4438   let InOperandList = iops;
4439   let Pattern = [];
4440   let AsmString = asm;
4441   let isAsmParserOnly = 1;
4442   let isPseudo = 1;
4443   let hasNoSchedulingInfo = 1;
4444 }
```



`PPCAsmPseudo`用于定义`InstAlias`无法实现的alias定义，例如

```shell
// 有非常量，PPCAsmPseudo和PPCInstrInfo.td一起实现
srwi ra, rs,n (n<32)  <==> rlwinm ra, rs, 32-n, n, 31

// 全部是常量，在td中用InstAlias实现即可以
clrlwi ra, rs,n (n<32)  <==> rlwinm ra, rs, 0, n, 31
```



 第3，4个Op相加要等于32，这种条件在`InstAlias`定义是无法实现的，因为InstAlias要求所有的量都是常量。此时只能用`def SRWI : PPCAsmPseudo`定义一个原型。然后在`AsmParser/PPCAsmParser.cpp`中为`SRWI`来作alias关系。相对的例子是`clrlwi`是在td中可以实现alias的，因为它不涉及到非常量。

`PPCInstrInfo.td`中定义alias原型，但不写具体的alias规则。编译td文件，即可以得到匹配规则。

```c++
4681 def SRWI : PPCAsmPseudo<"srwi $rA, $rS, $n",
4682                         (ins gprc:$rA, gprc:$rS, u5imm:$n)>;
4683 def SRWI_rec : PPCAsmPseudo<"srwi. $rA, $rS, $n",
4684                          (ins gprc:$rA, gprc:$rS, u5imm:$n)>;
```



`PPCAsmPseudo`和`PPCAsmParser.cpp`是用于反汇编的

`AsmParser/PPCAsmParser.cpp`为`SRWI`写具体的alias规则。CPP文件只有在程序编译时才能知道最终的alias。

```c++
 909   case PPC::SRWI:
 910   case PPC::SRWI_rec: {
 911   dbgs() << __LINE__ << " zhangkang\n";
 912     MCInst TmpInst;
 913     int64_t N = Inst.getOperand(2).getImm();
 914     TmpInst.setOpcode(Opcode == PPC::SRWI ? PPC::RLWINM : PPC::RLWINM_rec);
 915     TmpInst.addOperand(Inst.getOperand(0));
 916     TmpInst.addOperand(Inst.getOperand(1));
 917     TmpInst.addOperand(MCOperand::createImm(32 - N));
 918     TmpInst.addOperand(MCOperand::createImm(N));
 919     TmpInst.addOperand(MCOperand::createImm(31));
 920     Inst = TmpInst;
 921     break;
 922   }
```



```asm
97   // Check for slwi/srwi mnemonics.
 98   if (MI->getOpcode() == PPC::RLWINM) {
 99     unsigned char SH = MI->getOperand(2).getImm();
100     unsigned char MB = MI->getOperand(3).getImm();
101     unsigned char ME = MI->getOperand(4).getImm();
102     bool useSubstituteMnemonic = false;
103     if (SH <= 31 && MB == 0 && ME == (31-SH)) {
104       O << "\tslwi "; useSubstituteMnemonic = true;
105     }
106     if (SH <= 31 && MB == (32-SH) && ME == 31) {
107       O << "\tsrwi "; useSubstituteMnemonic = true;
108       SH = 32-SH;
109     }
```





 使用InstAlias的指令可以在`./lib/Target/PowerPC/PPCGenAsmMatcher.inc`中找到alias定义，使用`PPCAsmPseudo`的指令无法在该文件中找到类似alias定义。

```c++
// 出现rlwinm
5329   { 2964 /* clrlwi */, PPC::RLWINM, Convert__RegGPRC1_0__RegGPRC1_1__imm_95_0__U5Imm1_2__imm_95_31     , AMFBS_None, { MCK_RegGPRC, MCK_RegGPRC, MCK_U5Imm }, },
5330   { 2964 /* clrlwi */, PPC::RLWINM_rec, Convert__RegGPRC1_1__RegGPRC1_2__imm_95_0__U5Imm1_3__imm_9     5_31, AMFBS_None, { MCK__DOT_, MCK_RegGPRC, MCK_RegGPRC, MCK_U5Imm }, },

// 未出现rlwinm
6443   { 9503 /* srwi */, PPC::SRWI, Convert__RegGPRC1_0__RegGPRC1_1__U5Imm1_2, AMFBS_None, { MCK_RegGP     RC, MCK_RegGPRC, MCK_U5Imm }, },
6444   { 9503 /* srwi */, PPC::SRWI_rec, Convert__RegGPRC1_1__RegGPRC1_2__U5Imm1_3, AMFBS_None, { MCK__     DOT_, MCK_RegGPRC, MCK_RegGPRC, MCK_U5Imm }, },
```









```shell
MC/PowerPC/ppc64-encoding-ext.s

# CHECK-BE: addic 2, 3, -128                # encoding: [0x30,0x43,0xff,0x80]
# CHECK-LE: addic 2, 3, -128                # encoding: [0x80,0xff,0x43,0x30]
            subic 2, 3, 128
            
AsmParser/PPCAsmParser.cpp:  case PPC::SUBIC: {
AsmParser/PPCAsmParser.cpp:  case PPC::SUBIC_rec: {
PPCInstrInfo.td:def SUBIC : PPCAsmPseudo<"subic $rA, $rB, $imm",
PPCInstrInfo.td:def SUBIC_rec : PPCAsmPseudo<"subic. $rA, $rB, $imm",
```





# InstAlias

InstAlias<def LA中的`la $rD, $sym($rA)`, (def ADDI中的addi $rD, $rA, $imm加上类型)>

```shell
def LA     : DForm_2<14, (outs gprc:$rD), (ins gprc_nor0:$rA, s16imm:$sym),
                     "la $rD, $sym($rA)", IIC_IntGeneral,
                     [(set i32:$rD, (add i32:$rA,
                                          (PPClo tglobaladdr:$sym, 0)))]>;

def ADDI   : DForm_2<14, (outs gprc:$rD), (ins gprc_nor0:$rA, s16imm:$imm),
                     "addi $rD, $rA, $imm", IIC_IntSimple,
                     [(set i32:$rD, (add i32:$rA, imm32SExt16:$imm))]>;
                     
def : InstAlias<"li $rD, $imm", (ADDI gprc:$rD, ZERO, s16imm:$imm)>;
def : InstAlias<"la $rD, $mm($rA)", (ADDI gprc:$rD, gprc_nor0:$rA, s16imm:$imm)>;                                          
```





常量时不能有类型

```
def : InstAlias<"nop", (ORI8 X0, X0, 0)>;
def : InstAlias<"nop", (ORI R0, R0, 0)>;
```



SH + MB = 32

0 <= MB <= 31  ==>  1<= SH <= 32



n < 32 

MB can't be 32, but SH can be 32. If MB = 0, then SH = 32

两个都不能是32



范围只能是1到31，而不是0到31







../llvm/lib/Target/PowerPC/MCTargetDesc/PPCInstPrinter.cpp `MCInst --> asm`

```
PPCInstPrinter.cpp - Convert PPC MCInst to assembly syntax
This class prints an PPC MCInst to a .s file.
```

影响`MC/PowerPC/ppc64-encoding-ext.s`和各种ll文件



--------------------

AsmParser/PPCAsmParser.cpp                 `asm --> MCInst`

```c++
PPCAsmParser.cpp - Parse PowerPC asm to MCInst instructions

909   case PPC::SRWI:
 910   case PPC::SRWI_rec: {
 911     MCInst TmpInst;
 912     int64_t N = Inst.getOperand(2).getImm();
 913     TmpInst.setOpcode(Opcode == PPC::SRWI ? PPC::RLWINM : PPC::RLWINM_rec);
 914     TmpInst.addOperand(Inst.getOperand(0));
 915     TmpInst.addOperand(Inst.getOperand(1));
 916     TmpInst.addOperand(MCOperand::createImm(32 - N));
 917     TmpInst.addOperand(MCOperand::createImm(N));
 918     TmpInst.addOperand(MCOperand::createImm(31));
 919     Inst = TmpInst;
 920     break;
 921   }
```

只影响`MC/PowerPC/ppc64-encoding-ext.s`中的case



`../llvm/lib/Target/PowerPC/PPCInstrInfo.td`

```
4677 def SRWI : PPCAsmPseudo<"srwi $rA, $rS, $n",
4678                         (ins gprc:$rA, gprc:$rS, u5imm:$n)>;
4679 def SRWI_rec : PPCAsmPseudo<"srwi. $rA, $rS, $n",
4680                          (ins gprc:$rA, gprc:$rS, u5imm:$n)>;
```



--------------

### `ppc64-encoding-ext.s`中的流程： llvm-mc

`srwi 2, 3, 4` --->

​             `PPCInstrInfo.td: def SRWI : PPCAsmPseudo` -->

​                                                                  `PPCAsmParser.cpp  : case SRWI` to PPC::RLWINM

​                                                                                  --> `PPCInstPrinter.cpp:printInst()`可能会有alias

也可匹配正常的非`PPCAsmParser`指令。



----------



Why: `~/llvm/llvm/test/MC/PowerPC/ppc64-encoding-ext.s`

```
3389 # CHECK-BE: srwi 2, 3, 4                    # encoding: [0x54,0x62,0xe1,0x3e]
3390 # CHECK-LE: srwi 2, 3, 4                    # encoding: [0x3e,0xe1,0x62,0x54]
3391             srwi 2, 3, 4
3392 # CHECK-BE: rlwinm. 2, 3, 28, 4, 31         # encoding: [0x54,0x62,0xe1,0x3f]
3393 # CHECK-LE: rlwinm. 2, 3, 28, 4, 31         # encoding: [0x3f,0xe1,0x62,0x54]
3394             srwi. 2, 3, 4
```

```
  1 Args: /home/shkzhang/llvm/build/bin/llvm-mc -triple powerpc64-unknown-unknown --show-encoding srwi.    s -debug
  2 AsmMatcher: found 2 encodings with mnemonic 'srwi'
  3 Trying to match opcode SRWI
  4   Matching formal operand class MCK_RegGPRC against actual operand at index 1 (2): match success us    ing generic matcher
  5   Matching formal operand class MCK_RegGPRC against actual operand at index 2 (3): match success us    ing generic matcher
  6   Matching formal operand class MCK_U5Imm against actual operand at index 3 (4): match success usin    g generic matcher
  7   Matching formal operand class InvalidMatchClass against actual operand at index 4: actual operand     index out of range Opcode result: complete match, selecting this opcode
  8   .text
  9   srwi 2, 3, 28                   # encoding: [0x54,0x62,0x27,0x3e]
```



```
  1 Args: /home/shkzhang/llvm/build/bin/llvm-mc -triple powerpc64-unknown-unknown --show-encoding srwid    ot.s -debug
  2 AsmMatcher: found 2 encodings with mnemonic 'srwi'
  3 Trying to match opcode SRWI
  4   Matching formal operand class MCK_RegGPRC against actual operand at index 1 ('.'): Opcode result:     multiple operand mismatches, ignoring this opcode
  5 Trying to match opcode SRWI_rec
  6   Matching formal operand class MCK__DOT_ against actual operand at index 1 ('.'): match success us    ing generic matcher
  7   Matching formal operand class MCK_RegGPRC against actual operand at index 2 (2): match success us    ing generic matcher
  8   Matching formal operand class MCK_RegGPRC against actual operand at index 3 (3): match success us    ing generic matcher
  9   Matching formal operand class MCK_U5Imm against actual operand at index 4 (4): match success usin    g generic matcher
 10   Matching formal operand class InvalidMatchClass against actual operand at index 5: actual operand     index out of range Opcode result: complete match, selecting this opcode
 11   .text
 12   rlwinm. 2, 3, 4, 28, 31         # encoding: [0x54,0x62,0x27,0x3f]
```







Inslwi

```shell
SH = 32 -b, ME = b + n - 1     b = MB
MB = 32 - SH, ME = 31 - SH + n 


0 < n = ME + SH - 31 <= 31    ===>    31 < ME +SH <= 62
0 < n = ME - MB + 1 <= 31     ===>   -1 <   ME - MB < 31
```



insrwi

```
SH = 32 - B - N,  MB =B,  ME = B + N - 1
SH + ME = 31,   SH = 32 - MB - N, N = 32 - MB - SH

0 < N = 32 - MB - SH <= 31    ==> MB + SH < 32


SH = 1, MB =0, ME = 30
B = 0, N = 31
```

Clrlsldi

```
SH = N, MB = B - N, B = MB + SH
n <= b < 64

sh <= MB + SH < 64
```





## rldicl

```
extrdi ra,rs,n,b (n > 0)  <==> rldicl ra,rs,b+n,64-n
SH = B + N;  MB = 64 - N
0 < N = 64 - MB 
0 <= B = SH - N = SH + MB - 64   ==> SH + MB > 63   0 < SH < 64    MB < 64
```



```
rotrdi ra,rs,n     <===>  rldicl ra,rs,64-n,0
MB = 0    0 < SH < 64
SH = 64 - N  ===> N = 64 - SH 
```



```
srdi ra,rs,n (n < 64)    <=====> rldicl ra,rs,64-n,n
SH = 64 - N   MB = N
SH + MB = 64,   0 < SH < 64    N 同样
```



```
insrdi ra,rs,n,b (n > 0)
rldimi ra,rs,64-(b+n),b

SH = 64 - B - N;  B = MB
N = 64 - MB - SH > 0
MB + SH < 64
```





Bug:

- 没有`RLWIMI8_rec`,
- 没有`RLDIC_rec`，`RLDIC8`, `RLDIC8_rec`

- RLWIMI 5个Op变6个的问题
- `RLDICL_rec`未看到定义，却能找到使用






