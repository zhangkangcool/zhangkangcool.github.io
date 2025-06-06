<h1 align="center">gdb 调试利器</h1>
https://blog.csdn.net/21cnbao/article/details/7385161
https://wizardforcel.gitbooks.io/100-gdb-tips/display-instruction-pc.html

http://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/gdb.html

GDB是一个由GNU开源组织发布的、UNIX/LINUX操作系统下的、基于命令行的、功能强大的程序调试工具。 对于一名Linux下工作的c++程序员，gdb是必不可少的工具；

## 1.1. 启动gdb
对C/C++程序的调试，需要在编译前就加上-g选项:
```
$g++ -g hello.cpp -o hello
```
调试可执行文件:
```
$gdb <program>
```
program也就是你的执行文件，一般在当前目录下。

调试core文件(core是程序非法执行后core dump后产生的文件):
```
$gdb <program> <core dump file>
$gdb program core.11127
```

调试服务程序:
```
$gdb <program> <PID>
$gdb hello 11127
```
如果你的程序是一个服务程序，那么你可以指定这个服务程序运行时的进程ID。gdb会自动attach上去，并调试他。program应该在PATH环境变量中搜索得到。

## 1.2. gdb交互命令
启动gdb后，进入到交互模式，通过以下命令完成对程序的调试；注意高频使用的命令一般都会有缩写，熟练使用这些缩写命令能提高调试的效率；

### 运行
- run：简记为 r ，其作用是运行程序，当遇到断点后，程序会在断点处停止运行，等待用户输入下一步的命令。
- continue （简写c ）：继续执行，到下一个断点处（或运行结束）
- next：（简写 n），单步跟踪程序，当遇到函数调用时，也不进入此函数体；此命令同 step 的主要区别是，step 遇到用户自定义的函数，将步进到函数中去运行，而 next 则直接调用函数，不会进入到函数体内。
- step （简写s）：单步调试如果有函数调用，则进入函数；与命令n不同，n是不进入调用的函数的
- until：当你厌倦了在一个循环体内单步跟踪时，这个命令可以运行程序直到退出循环体。
- until+行号： 运行至某行，不仅仅用来跳出循环
- finish： 运行程序，直到当前函数完成返回，并打印函数返回时的堆栈地址和返回值及参数值等信息。
- call 函数(参数)：调用程序中可见的函数，并传递“参数”，如：call gdb_test(55)
- quit：简记为 q ，退出gdb



https://blog.csdn.net/rubikchen/article/details/115718918

## 跳出

#### return

直接退出当前函数，该函数后面的代码行不会执行到。可能会影响程序逻辑，因为函数并未执行完。





### finish/fin

正常执行完当前函数后停止，即到上一层，函数调用的地方停止。不修改寄存器 变量等的话，不会影响程序逻辑。



### 设置断点
- break n （简写b n）:在第n行处设置断点
（可以带上代码路径和代码名称： b OAGUPDATE.cpp:578）
- break *0x1000c88(反汇编地址)
- b fn1 if a＞b：条件断点设置
break func（break缩写为b）：在函数func()的入口处设置断点，如：break cb_button
- delete 断点号n：删除第n个断点
- disable 断点号n：暂停第n个断点
- enable 断点号n：开启第n个断点
- clear 行号n：清除第n行的断点
- info b （info breakpoints） ：显示当前程序的断点设置情况
- delete breakpoints：清除所有断点：

### 查看源代码
- list ：简记为 l ，其作用就是列出程序的源代码，默认每次显示10行。
- list 行号：将显示当前文件以“行号”为中心的前后10行代码，如：list 12
- list 函数名：将显示“函数名”所在函数的源代码，如：list main
- list ：不带参数，将接着上一次 list 命令的，输出下边的内容。


## 显示当前将要执行的指令
```
display /i $pc
x/i $pc
```

```
(gdb) display /i $pc
3: x/i $pc
=> 0x10000604 <main+20>:        lis     r3,-26506
(gdb) x/i $pc
=> 0x10000604 <main+20>:        lis     r3,-26506

```

## 显示寄存器的值
```
i reg
info reg
info registers
info registers r1
info reg $vs0

```
以上输出不包括浮点寄存器和向量寄存器的内容。使用`i all-registers`命令，可以输出所有寄存器的内容：
```
i all-registers
```

```
print $eax
p/x $r1
```





## set命令修改寄存器或内存

- 修改寄存器
```
(gdb) set $v0 = 0x004000000
(gdb) set $epc = 0xbfc00000 
```

- 修改内存
```
(gdb) set {unsigned int}0x8048a51=0x0
```

```
(gdb) set {unsigned int}0x100000f2e=0x0       
(gdb) x/10cb 0x100000f2e
0x100000f2e:	0 '\0'	0 '\0'	0 '\0'	0 '\0'	111 'o'	32 ' '	119 'w'	111 'o'
0x100000f36:	114 'r'	108 'l'
(gdb) p c
$10 = 0x100000f2e ""
```

## 查询运行信息

- where/bt ：当前运行的堆栈列表；
- bt backtrace 显示当前调用堆栈
- up/down 改变堆栈显示的深度
- set args 参数:指定运行时的参数
- show args：查看设置好的参数
- info program： 来查看程序的是否在运行，进程号，被暂停的原因。

## 分割窗口，显示更多信息
- layout：用于分割窗口，可以一边查看代码，一边测试：
- layout src：显示源代码窗口
- layout asm：显示反汇编窗口
- layout regs：显示源代码/反汇编和CPU寄存器窗口
- layout split：显示源代码和反汇编窗口
- Ctrl + L：刷新窗口

- 查看窗口信息
```
(gdb) info win
        ASM     (21 lines)
        REGS    (20 lines)  <has focus>
        CMD   
```

- 切换窗口
Usage: focus {<win> | next | prev}
```
(gdb) focus next
Focus set to REGS window.
(gdb) focus prev
Focus set to ASM window.
(gdb) focus next
Focus set to REGS window.
(gdb) focus next
Focus set to CMD window.

(gdb) focus REGS
Focus set to REGS window.


focus REGS | ASM | CMD
```





### 汇编

可使用`disas`和`layout`

```asm
Breakpoint 1, 0x0000000010000ae0 in test(int __vector(4)) ()
(gdb) disas
Dump of assembler code for function _Z4testDv4_i:
=> 0x0000000010000ae0 <+0>:	xxlxor  vs35,vs35,vs35
   0x0000000010000ae4 <+4>:	vsumsws v2,v2,v3
   0x0000000010000ae8 <+8>:	xxswapd vs0,vs34
   0x0000000010000aec <+12>:	mffprwz r3,f0
   0x0000000010000af0 <+16>:	blr
   0x0000000010000af4 <+20>:	.long 0x0
   0x0000000010000af8 <+24>:	.long 0x0
   0x0000000010000afc <+28>:	.long 0x0
End of assembler dump.
(gdb) nexti
0x0000000010000ae4 in test(int __vector(4)) ()
(gdb) disas
Dump of assembler code for function _Z4testDv4_i:
   0x0000000010000ae0 <+0>:	xxlxor  vs35,vs35,vs35
=> 0x0000000010000ae4 <+4>:	vsumsws v2,v2,v3
   0x0000000010000ae8 <+8>:	xxswapd vs0,vs34
   0x0000000010000aec <+12>:	mffprwz r3,f0
   0x0000000010000af0 <+16>:	blr
   0x0000000010000af4 <+20>:	.long 0x0
   0x0000000010000af8 <+24>:	.long 0x0
   0x0000000010000afc <+28>:	.long 0x0
End of assembler dump.
```

```asm
info reg vs35 
不能用 info reg v3
```

