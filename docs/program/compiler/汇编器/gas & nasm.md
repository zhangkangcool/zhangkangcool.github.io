

<h1 align="center">gas & nasm</h1>



https://blog.csdn.net/luhao19980909/article/details/103691295	

```c++
.s 基于AT&T指令，采用GAS编译
.asm 基于intel指令，采用NASM编译
.o 链接文件，win下是obj文件
.a 静态链接，多个.o打包而成
.so 动态链接，多个.o打包而成

GAS汇编：基于AT&T指令，.s后缀
NASM汇编：基于intel指令，.asm后缀
```





```C++
GAS和NASM汇编器对比
GAS: GNU Assembler
NASM: Netwide Assembler

汇编格式对比：(linux64位下)
GAS编译 hello.s
as hello.s -o hello.o

NASM编译 hello.asm
nasm -f elf64 hello.asm -o hello.o
(elf64/elf32指定64/32位机器)

链接部分一致：
ld hello.o -o hello
(生成hello可执行文件)
```

