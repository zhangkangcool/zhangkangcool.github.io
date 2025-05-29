https://zh.wikipedia.org/wiki/NaN



**NaN**（**N**ot **a** **N**umber，非数）是[计算机科学](https://zh.wikipedia.org/wiki/计算机科学)中数值[数据类型](https://zh.wikipedia.org/wiki/數據類型)的一类值，表示未定义或不可表示的值。常在[浮点数](https://zh.wikipedia.org/wiki/浮点数)运算中使用。首次引入NaN的是1985年的[IEEE 754](https://zh.wikipedia.org/wiki/IEEE_754)浮点数标准。

## 目录



- 1浮点数
  - [1.1返回NaN的运算](https://zh.wikipedia.org/wiki/NaN#返回NaN的运算)
- [2整数的NaN](https://zh.wikipedia.org/wiki/NaN#整数的NaN)
- [3注释](https://zh.wikipedia.org/wiki/NaN#注释)
- [4参考文献](https://zh.wikipedia.org/wiki/NaN#参考文献)
- [5外部链接](https://zh.wikipedia.org/wiki/NaN#外部链接)

## 浮点数[[编辑](https://zh.wikipedia.org/w/index.php?title=NaN&action=edit&section=1)]

在浮点数运算中，NaN与[无穷大](https://zh.wikipedia.org/wiki/无穷)的概念不同，尽管两者均是以浮点数表示实数时的特殊值。无效操作（Invalid Operation）同样也不同于[算术溢出](https://zh.wikipedia.org/wiki/算術溢出)（可能返回无穷大）和算术下溢出（可能返回最小的一般数值、特殊数值、零等）。

[IEEE 754-1985](https://zh.wikipedia.org/w/index.php?title=IEEE_754-1985&action=edit&redlink=1)中，用指数部分全为1、小数部分非零表示NaN。以32位IEEE单精度浮点数的NaN为例，按位表示即：S111 1111 1AXX XXXX XXXX XXXX XXXX XXXX，**S为符号位，符号位S的取值无关紧要**；A是小数部分的最高位（the most significant bit of the significand），其取值表示了NaN的类型：X不能全为0，并被称为NaN的payload；[[注 1\]](https://zh.wikipedia.org/wiki/NaN#cite_note-1)

- 大多数处理器，包括[Intel](https://zh.wikipedia.org/wiki/Intel)与[AMD](https://zh.wikipedia.org/wiki/AMD)的[x86](https://zh.wikipedia.org/wiki/X86)系列、[Motorola](https://zh.wikipedia.org/wiki/Motorola) [68000系列](https://zh.wikipedia.org/w/index.php?title=68000系列&action=edit&redlink=1)、[AIM](https://zh.wikipedia.org/wiki/AIM联盟) [PowerPC](https://zh.wikipedia.org/wiki/PowerPC)系列、[ARM](https://zh.wikipedia.org/wiki/ARM架構)系列、[Sun](https://zh.wikipedia.org/wiki/昇陽電腦) [SPARC](https://zh.wikipedia.org/wiki/SPARC)系列，采取了A为'is_quiet'标记位。即，如果A = 1，则该数是quiet NaN（QNaN）；如果A为零、其余X部分非零，则是signaling NaN（SNaN）。**IEEE 754-2008**标准采纳了这一方案。

- [PA-RISC](https://zh.wikipedia.org/wiki/PA-RISC)与[MIPS](https://zh.wikipedia.org/wiki/MIPS架構)处理器，采取了A为'is_signaling'标记位。恰与上述相反。

  SNaN会设异常寄存器。

### 返回NaN的运算[[编辑](https://zh.wikipedia.org/w/index.php?title=NaN&action=edit&section=2)]

返回NaN的运算有如下三种[[1\]](https://zh.wikipedia.org/wiki/NaN#cite_note-2)：

- 至少有一个[参数](https://zh.wikipedia.org/wiki/参数)是NaN的运算

- 不定式

  - 下列[除法](https://zh.wikipedia.org/wiki/除法)运算：0/0、[∞](https://zh.wikipedia.org/wiki/∞)/∞、∞/(−∞)、(−∞)/∞、(−∞)/(−∞)
  - 下列[乘法](https://zh.wikipedia.org/wiki/乘法)运算：0×∞、0×−∞
  - 下列[加法](https://zh.wikipedia.org/wiki/加法)运算：∞ + (−∞)、(−∞) + ∞
  - 下列[减法](https://zh.wikipedia.org/wiki/减法)运算：∞ - ∞、(−∞) - (−∞)
  - 下列[指数](https://zh.wikipedia.org/wiki/指数)运算：0^0、∞^0、1^∞、∞^(−∞)

- 产生

  复数

  结果的实数运算。例如：

  - 对[负数](https://zh.wikipedia.org/wiki/负数)进行[开偶次方](https://zh.wikipedia.org/wiki/開方)的运算
  - 对负数（包含−∞）进行[对数](https://zh.wikipedia.org/wiki/对数)运算
  - 对[正弦](https://zh.wikipedia.org/wiki/正弦)或[余弦](https://zh.wikipedia.org/wiki/餘弦)[到达域](https://zh.wikipedia.org/wiki/到达域)以外的数进行[反正弦](https://zh.wikipedia.org/wiki/反正弦)或[反余弦](https://zh.wikipedia.org/wiki/反餘弦)运算



```
For single-precision values:

Positive infinity is represented by the bit pattern 7F800000
Negative infinity is represented by the bit pattern FF800000
A signalling NaN (NANS) is represented by any bit pattern
between 7F800001 and 7FBFFFFF or between FF800001 and FFBFFFFF

A quiet NaN (QNaN) is represented by any bit pattern
between 7FC00000 and 7FFFFFFF or between FFC00000 and FFFFFFFF
For double-precision values:

Positive infinity is represented by the bit pattern 7FF0000000000000
Negative infinity is represented by the bit pattern FFF0000000000000
A signalling NaN is represented by any bit pattern
between 7FF0000000000001 and 7FF7FFFFFFFFFFFF or
between FFF0000000000001 and FFF7FFFFFFFFFFFF

A quiet NaN is represented by any bit pattern
between 7FF8000000000000 and 7FFFFFFFFFFFFFFF or
between FFF8000000000000 and FFFFFFFFFFFFFFFF
```





## Canonical-NaN



https://webassembly.github.io/spec/core/syntax/values.html

A *canonical NaN* is a floating-point value ±[𝗇𝖺𝗇](https://webassembly.github.io/spec/core/syntax/values.html#syntax-float)([canon](https://webassembly.github.io/spec/core/syntax/values.html#aux-canon)N)±nan(canon<sub>N</sub>) where canon<sub>N</sub>is a payload whose most significant bit is 11 while all others are 00:

canon<sub>N</sub>=2<sup>signif(N)−1</sup>

An *arithmetic NaN* is a floating-point value ±[𝗇𝖺𝗇](https://webassembly.github.io/spec/core/syntax/values.html#syntax-float)(n)±nan(n) with n≥[canon](https://webassembly.github.io/spec/core/syntax/values.html#aux-canon)Nn≥canonN, such that the most significant bit is 11 while all others are arbitrary. QNaN.



https://blog.csdn.net/weixin_33898233/article/details/86023108

Risc-V架构规定，如果浮点运算的结果是一个NaN数，那么使用一个固定的NaN数，将之命名为Canonical-NaN。单精度浮点对应的Canonical-NaN数值为0x7fc00000,双精度浮点对应Canonical-NaN数值为0x7ff80000_00000000

```
0x7fc00000 = 0111 1111 1111 11       00 0000 0000 0000 0000 0000 
```

