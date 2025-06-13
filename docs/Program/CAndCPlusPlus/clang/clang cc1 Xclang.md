<h1 align="center">clang cc1 Xclang</h1>


命令行使用的“clang”其实并不是前端Clang，而是指的是Clang driver；

Clang driver不仅仅调用了前端Clang，同时还调用了LLVM Core，在编译的最后阶段，还调用了linker。

在命令行使用的“clang cc1”也指的不是前端Clang，而指的是Clang编译器，这其中不仅包含了前端Clang，还包含了LLVM Core部分等。



## 1 clang driver

先调用CC1，再调用linker

```
[ken@LAPTOP-LLNBQ850:~/test]$ clang -###  test.c
clang version 12.0.0 (https://github.com/llvm/llvm-project.git 154860af338f7b0c82cb04e91d6f199aa72cfdff)
Target: x86_64-unknown-linux-gnu
Thread model: posix
InstalledDir: /home/ken/workspace/llvm/build/bin
 "/home/ken/workspace/llvm/build/bin/clang-12" "-cc1" "-triple" "x86_64-unknown-linux-gnu" "-emit-obj" "-mrelax-all" "--mrelax-relocations" "-disable-free" "-main-file-name" "test.c" "-mrelocation-model" "static" "-mframe-pointer=all" "-fmath-errno" "-fno-rounding-math" "-mconstructor-aliases" "-munwind-tables" "-target-cpu" "x86-64" "-tune-cpu" "generic" "-fno-split-dwarf-inlining" "-debugger-tuning=gdb" "-resource-dir" "/home/ken/workspace/llvm/build/lib/clang/12.0.0" "-internal-isystem" "/usr/local/include" "-internal-isystem" "/home/ken/workspace/llvm/build/lib/clang/12.0.0/include" "-internal-externc-isystem" "/usr/include/x86_64-linux-gnu" "-internal-externc-isystem" "/include" "-internal-externc-isystem" "/usr/include" "-fdebug-compilation-dir" "/home/ken/test" "-ferror-limit" "19" "-fgnuc-version=4.2.1" "-fcolor-diagnostics" "-faddrsig" "-o" "/tmp/test-62e4c9.o" "-x" "c" "test.c"
 "/usr/bin/ld" "-z" "relro" "--hash-style=gnu" "--eh-frame-hdr" "-m" "elf_x86_64" "-dynamic-linker" "/lib64/ld-linux-x86-64.so.2" "-o" "a.out" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crt1.o" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crti.o" "/usr/lib/gcc/x86_64-linux-gnu/9/crtbegin.o" "-L/usr/lib/gcc/x86_64-linux-gnu/9" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../../../lib64" "-L/lib/x86_64-linux-gnu" "-L/lib/../lib64" "-L/usr/lib/x86_64-linux-gnu" "-L/usr/lib/../lib64" "-L/usr/lib/x86_64-linux-gnu/../../lib64" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../.." "-L/home/ken/workspace/llvm/build/bin/../lib" "-L/lib" "-L/usr/lib" "/tmp/test-62e4c9.o" "-lgcc" "--as-needed" "-lgcc_s" "--no-as-needed" "-lc" "-lgcc" "--as-needed" "-lgcc_s" "--no-as-needed" "/usr/lib/gcc/x86_64-linux-gnu/9/crtend.o" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crtn.o"
```



## 2 Xclang

`-XClang`会把其后使用的参数传给`cc1`，但仍会调用linker。只会传递一个。

```shell
[ken@LAPTOP-LLNBQ850:~/test]$ clang -### -Xclang -dump-tokens test.c
clang version 12.0.0 (https://github.com/llvm/llvm-project.git 154860af338f7b0c82cb04e91d6f199aa72cfdff)
Target: x86_64-unknown-linux-gnu
Thread model: posix
InstalledDir: /home/ken/workspace/llvm/build/bin
 "/home/ken/workspace/llvm/build/bin/clang-12" "-cc1" "-triple" "x86_64-unknown-linux-gnu" "-emit-obj" "-mrelax-all" "--mrelax-relocations" "-disable-free" "-main-file-name" "test.c" "-mrelocation-model" "static" "-mframe-pointer=all" "-fmath-errno" "-fno-rounding-math" "-mconstructor-aliases" "-munwind-tables" "-target-cpu" "x86-64" "-tune-cpu" "generic" "-fno-split-dwarf-inlining" "-debugger-tuning=gdb" "-resource-dir" "/home/ken/workspace/llvm/build/lib/clang/12.0.0" "-internal-isystem" "/usr/local/include" "-internal-isystem" "/home/ken/workspace/llvm/build/lib/clang/12.0.0/include" "-internal-externc-isystem" "/usr/include/x86_64-linux-gnu" "-internal-externc-isystem" "/include" "-internal-externc-isystem" "/usr/include" "-fdebug-compilation-dir" "/home/ken/test" "-ferror-limit" "19" "-fgnuc-version=4.2.1" "-fcolor-diagnostics" "-dump-tokens" "-faddrsig" "-o" "/tmp/test-5c8819.o" "-x" "c" "test.c"
 "/usr/bin/ld" "-z" "relro" "--hash-style=gnu" "--eh-frame-hdr" "-m" "elf_x86_64" "-dynamic-linker" "/lib64/ld-linux-x86-64.so.2" "-o" "a.out" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crt1.o" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crti.o" "/usr/lib/gcc/x86_64-linux-gnu/9/crtbegin.o" "-L/usr/lib/gcc/x86_64-linux-gnu/9" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../../../lib64" "-L/lib/x86_64-linux-gnu" "-L/lib/../lib64" "-L/usr/lib/x86_64-linux-gnu" "-L/usr/lib/../lib64" "-L/usr/lib/x86_64-linux-gnu/../../lib64" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../.." "-L/home/ken/workspace/llvm/build/bin/../lib" "-L/lib" "-L/usr/lib" "/tmp/test-5c8819.o" "-lgcc" "--as-needed" "-lgcc_s" "--no-as-needed" "-lc" "-lgcc" "--as-needed" "-lgcc_s" "--no-as-needed" "/usr/lib/gcc/x86_64-linux-gnu/9/crtend.o" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crtn.o"
```



## 3 cc1

cc1与clang driver的不同在于不会调用linker，另外cc1会停在某一步后不再继续执行。使用cc1时，必须的其它对应的选项，否则会停在某一步，不再继续下去。

```
 clang -cc1 test.c  // 不会有任何输出
 clang -cc1 test.c -emit-llvm
 clang -cc1 test.c -emit-obj
```





## 4 Other

- 有些选项是cc1特有的，必须使用`cc1`或者是`clang -Xclang`进行调用。如下面的`dump-tokens`。

```shell
clang -cc1 -dump-tokens test.c
clang -Xclang -dump-tokens test.c
```



- 不过有些选项是`clang driver`和`clang -cc1`都提供的。如`-ffast-math`

```sh
 # test.o与test.xclang.o一模一样
 clang test.c -ffast-math -o test.o -c
 clang test.c -Xclang -ffast-math -o test.xclang.o -c 
 
 # test.cc1.o与test.o和test.xclang.o不同，test.cc1.o更简单，没有调整指针的操作
 clang -cc1 test.c -ffast-math -o test.cc1.o -emit-obj
```



#### test.o与test.xclang.o相同

```asm
 objdump -dS test.o

test.o:     file format elf64-x86-64


Disassembly of section .text:

0000000000000000 <foo>:
   0:   55                      push   %rbp
   1:   48 89 e5                mov    %rsp,%rbp
   4:   31 c0                   xor    %eax,%eax
   6:   5d                      pop    %rbp
   7:   c3                      retq

```





#### test.cc1.o

```asm
objdump -dS test.cc1.o

test.cc1.o:     file format elf64-x86-64


Disassembly of section .text:

0000000000000000 <foo>:
   0:   31 c0                   xor    %eax,%eax
   2:   c3                      retq

```



