<h1 align="center">TableGen</h1>
## 1. llvm-tblgen



TableGen的核心部分包括了解析文件，实例化声明，把结果输出给特殊领域的TableGen后端(backend)来处理。

TableGen文件由两个关键部分组成：分别是类(classes)和定义(definitions)，两种都可以认为是记录信息的方式和记录一个信息的关键字，类似C++中的类。

TableGen的记录(records)都有一个唯一的名字，包含了一系列的值和父类(superclasses)。这一系列的值是每条目标记录的主要数据，保存着相关的信息。通过指定的TableGen backend来解析这些数据，而Tablegen只负责检查数据组织的规则，不管信息的正确性与否。TableGen definitions是records的具体的形式，他们通常不包含任何未定义的数值，用关键字def标识。TableGen classes是用来描述和构建其他记录的抽象记录的关键字。

这些’classes’用于用户描述的目标抽象的信息，并且实现批量产生有相同特点的记录。TableGen用来建立definition的classes的关系，因此backend可以找到任意一个具体class的定义，例如”Instruction”。

TableGen的复合类(multiclasses)是一组抽象记录的集合，他们将会被一起实例化。每个实例化将会产生多个TableGen definitions，如果一个multiclass继承另外一个multiclass，在子复合类(sub—multiclass)中的defmitions将会成为当前multiclass的一部分，跟它们在当前multiclass声明的效果一样。并且TableGen有个重要的特点是支持用户自定义抽象类，用于描述他们自己的需要的有用信息。

TableGen支持BCPL风格的`//`注释方法，从该注释符开始到行尾都为注释，也支持可嵌套的`/*  */`的注释风格。对于一个代码生成器来说，每一条指令都需要提供大量的信息。如果全部手动指定这些信息，将缺少维护性，很容易导致bugs产生，而且非常令人疲倦。若我们用TableGen，全部的信息都可以用definition一次性生成。每一条`def record`都有一个特殊的入口(entry)叫`NAME` ，这是该Clef的名字。通常下，一个def的name的可以有多种类别的字符表达式组成，最后的值是根据所有表达式求得。用户可以在任何地方引用该def的名字，而且该名字不能再被定义，以免冲突。



## 2. Type

当不能描述时，可以添加新的数据结构进来。

##### TableGen包含了下述类型：

- `bit`: 表示的是boolean值，可以保存0或者1。
- `int`: int表示一个简单的32位整型，比如5。
- `string`: string类型可以表示任意长度的字符串序列
- `bits(n)`：任意确定长度的bit类型，整型会被分割成独立的比特位。
- `list(ty)`：这种类型表示其他类型的列表类型，其他类型可以是任意类型。这种列表类型也可以作为一种类型组成一种新的列表类型。
- `Class`：Class名字可以通过跟在class后面文本指定．这个类型和list类型配合起来非常好用，比如，为了限制list成员都继承一个相同的base类。
- `dag`：这种类型表示一个可嵌套的有向图。
- `code`：这个类型用来表达大块的文本。这中类型与string类型不同是他不需要用双引号把文本括起来。



##### 目前支持的表达式和值有一下几种

- `?`：未初始化的域。
- `0b1001011`：二进制整型。
- `07654321`：八进制整型(以0开始)。
- `7`：十进制整数。
- `0x7F`：十六进制整型。
- `"foo"`：字符串值。
- `[(．．．)]`：代码片段。
- `[X，Y，Z]<type>`：列表值，<够pe>是列表成员的类型，这个可以不被指定。在少数的case中，TableGen不能自动检z出成员的类型，那么type就需要被指定。
- `{a, b, c}`：初始化类型为bits<3>的值。
- `value`：对value的引用。
- `value{17)`：访问value中的某一位。
- `value{15—17)`：访问value中的多个位。
- `DEF`：引用一个记录的定义。
- `CLASS<val list>`：通过指定模板的参数来引用一个新的匿名class定义
- `X.Y`：引用value的一个子域。
- `list[4—7，17，2—3]`：一个list的片段，包括4，5，6，7，17，2和3号成员，成员可能被重复包含。
- `foreach <var> = <list> in { <body> )`。
- `foreach <var> = <list> in <def>`：复制body和def，用list中每个值赋给变量var，并且根据该变量实例化每个def。
- `(DEF a, b)`：一个dag的值，第一个成员需要是个record定义，剩下的成员可以任意的值，包括嵌套的dag值。





### 生成inc的命令行

在`build.ninja`中可以找到所有inc的命令行，直接搜索inc文件







## 3. Option

所有的选项都必须以下面的格式使用

```asm
cd /home/ken/workspace/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -I /home/ken/workspace/llvm/llvm/lib/Target/PowerPC -I/home/ken/workspace/llvm/build/include -I/home/ken/workspace/llvm/llvm/include -I /home/ken/workspace/llvm/llvm/lib/Target /home/ken/workspace/llvm/llvm/lib/Target/PowerPC/PPC.td -YOUROPTION


cd /home/ken/workspace/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -I /home/ken/workspace/llvm/llvm/lib/Target/PowerPC -I/home/ken/workspace/llvm/build/include -I/home/ken/workspace/llvm/llvm/include -I /home/ken/workspace/llvm/llvm/lib/Target /home/ken/workspace/llvm/llvm/lib/Target/PowerPC/PPC.td -gen-asm-matcher --write-if-changed -o /home/ken/workspace/llvm/build/lib/Target/PowerPC/PPCGenAsmMatcher.inc                                              
```



### `-print-enums -class=XXX` (必须接 -class=XXX, 否则会报错)

`class`可以是`Register`，`Instruction`或任何在td文件中定义的class，如指令格式`BForm_4`, `SubtargetFeature`, `InstrInfo`等。`Target.td`或是`PowerPC`目录下的td文件。

```asm
cd /home/ken/workspace/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -I /home/ken/workspace/llvm/llvm/lib/Target/PowerPC -I/home/ken/workspace/llvm/build/include -I/home/ken/workspace/llvm/llvm/include -I /home/ken/workspace/llvm/llvm/lib/Target /home/ken/workspace/llvm/llvm/lib/Target/PowerPC/PPC.td -print-enums -class=Register
  
ACC0, ACC1, ACC2, ACC3, ACC4, ACC5, ACC6, ACC7, BP, BP8, CARRY, CR0, CR0EQ, CR0GT, CR0LT, CR0UN, CR1, CR1EQ, CR1GT, CR1LT, CR1UN, CR2, CR2EQ, CR2GT, CR2LT, CR2UN, CR3, CR3EQ, CR3GT, CR3LT, CR3UN, CR4, CR4EQ, CR4GT, CR4LT, CR4UN, CR5, CR5EQ, CR5GT, CR5LT, CR5UN, CR6, CR6EQ, CR6GT, CR6LT, CR6UN, CR7, CR7EQ, CR7GT, CR7LT, CR7UN, CTR, CTR8, F0, F1, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F2, F20, F21, F22, F23, F24, F25, F26, F27, F28, F29, F3, F30, F31, F4, F5, F6, F7, F8, F9, FP, FP8, LR, LR8, R0, R1, R10, R11, R12, R13, R14, R15, R16, R17, R18, R19, R2, R20, R21, R22, R23, R24, R25, R26, R27, R28, R29, R3, R30, R31, R4, R5, R6, R7, R8, R9, RM, S0, S1, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S2, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S3, S30, S31, S4, S5, S6, S7, S8, S9, SPEFSCR, UACC0, UACC1, UACC2, UACC3, UACC4, UACC5, UACC6, UACC7, V0, V1, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19, V2, V20, V21, V22, V23, V24, V25, V26, V27, V28, V29, V3, V30, V31, V4, V5, V6, V7, V8, V9, VF0, VF1, VF10, VF11, VF12, VF13, VF14, VF15, VF16, VF17, VF18, VF19, VF2, VF20, VF21, VF22, VF23, VF24, VF25, VF26, VF27, VF28, VF29, VF3, VF30, VF31, VF4, VF5, VF6, VF7, VF8, VF9, VRSAVE, VSL0, VSL1, VSL10, VSL11, VSL12, VSL13, VSL14, VSL15, VSL16, VSL17, VSL18, VSL19, VSL2, VSL20, VSL21, VSL22, VSL23, VSL24, VSL25, VSL26, VSL27, VSL28, VSL29, VSL3, VSL30, VSL31, VSL4, VSL5, VSL6, VSL7, VSL8, VSL9, VSRp0, VSRp1, VSRp10, VSRp11, VSRp12, VSRp13, VSRp14, VSRp15, VSRp16, VSRp17, VSRp18, VSRp19, VSRp2, VSRp20, VSRp21, VSRp22, VSRp23, VSRp24, VSRp25, VSRp26, VSRp27, VSRp28, VSRp29, VSRp3, VSRp30, VSRp31, VSRp4, VSRp5, VSRp6, VSRp7, VSRp8, VSRp9, VSX32, VSX33, VSX34, VSX35, VSX36, VSX37, VSX38, VSX39, VSX40, VSX41, VSX42, VSX43, VSX44, VSX45, VSX46, VSX47, VSX48, VSX49, VSX50, VSX51, VSX52, VSX53, VSX54, VSX55, VSX56, VSX57, VSX58, VSX59, VSX60, VSX61, VSX62, VSX63, X0, X1, X10, X11, X12, X13, X14, X15, X16, X17, X18, X19, X2, X20, X21, X22, X23, X24, X25, X26, X27, X28, X29, X3, X30, X31, X4, X5, X6, X7, X8, X9, XER, ZERO, ZERO8,
```



```shell
cd /home/ken/workspace/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -I /home/ken/workspace/llvm/llvm/lib/Target/PowerPC -I/home/ken/workspace/llvm/build/include -I/home/ken/workspace/llvm/llvm/include -I /home/ken/workspace/llvm/llvm/lib/Target /home/ken/workspace/llvm/llvm/lib/Target/PowerPC/PPC.td -print-enums -class=BForm_4
BC, BCL, BCLn, BCn,
```



```shell
 cd /home/ken/workspace/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -I /home/ken/workspace/llvm/llvm/lib/Target/PowerPC -I/home/ken/workspace/llvm/build/include -I/home/ken/workspace/llvm/llvm/include -I /home/ken/workspace/llvm/llvm/lib/Target /home/ken/workspace/llvm/llvm/lib/Target/PowerPC/PPC.td -print-enums -class=RegisterOperand
acc, crbitrc, crrc, f4rc, f8rc, g8rc, g8rc_nox0, gprc, gprc_nor0, spe4rc, sperc, spilltovsrrc, uacc, vfrc, vrrc, vsfrc, vsrc, vsrpevenrc, vsrprc, vssrc,


 cd /home/ken/workspace/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -I /home/ken/workspace/llvm/llvm/lib/Target/PowerPC -I/home/ken/workspace/llvm/build/include -I/home/ken/workspace/llvm/llvm/include -I /home/ken/workspace/llvm/llvm/lib/Target /home/ken/workspace/llvm/llvm/lib/Target/PowerPC/PPC.td -print-enums -class=Operand
abscalltarget, abscondbrtarget, absdirectbrtarget, atimm, calltarget, condbrtarget, crbitm, directbrtarget, dispRI, dispRI34, dispRIX, dispRIX16, dispSPE2, dispSPE4, dispSPE8, f32imm, f64imm, i16imm, i1imm, i32imm, i64imm, i8imm, imm32SExt16, imm64SExt16, imm64ZExt32, immZero, memr, memri, memri34, memri34_pcrel, memrix, memrix16, memrr, pred, ptr_rc_idx, ptr_rc_nor0, ptype0, ptype1, ptype2, ptype3, ptype4, ptype5, s16imm, s16imm64, s17imm, s17imm64, s34imm, s34imm_pcrel, s5imm, spe2dis, spe4dis, spe8dis, tlscall, tlscall32, tlsgd, tlsgd32, tlsreg, tlsreg32, tocentry, tocentry32, type0, type1, type2, type3, type4, type5, u10imm, u12imm, u16imm, u16imm64, u1imm, u2imm, u3imm, u4imm, u5imm, u6imm, u7imm, u8imm, untyped_imm_0,

```

