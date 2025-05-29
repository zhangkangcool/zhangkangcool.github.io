https://www.jianshu.com/p/96058bf1ecc2
https://blog.csdn.net/snsn1984/article/details/41077763

clang提供了一些命令,让我们可以对编译的过程进行一些配置和查看,下面我们就对一些常用的指令进行一个基本的介绍.
常用指令

##### All clang option official mannual

http://releases.llvm.org/7.0.1/tools/clang/docs/UsersManual.html#id39
## 查看编译的步骤

`clang -ccc-print-phases main.m`

输出结果

```
0: input, “main.m”, objective-c
1: preprocessor, {0}, objective-c-cpp-output
2: compiler, {1}, ir
3: backend, {2}, assembler
4: assembler, {3}, object
5: linker, {4}, image
6: bind-arch, “x86_64”, {5}, image
```

------------

## 查看编译结果 : clang -rewrite-objc main.m

查看操作内部命令，可以使用 -### 命令，只输出会运行哪些命令，不会真正执行。
```shell
clang -### main.m -o main


clang version 12.0.0 (https://github.com/llvm/llvm-project.git 154860af338f7b0c82cb04e91d6f199aa72cfdff)
Target: x86_64-unknown-linux-gnu
Thread model: posix
InstalledDir: /home/ken/workspace/llvm/build/bin
 "/home/ken/workspace/llvm/build/bin/clang-12" "-cc1" "-triple" "x86_64-unknown-linux-gnu" "-emit-obj" "-mrelax-all" "--mrelax-relocations" "-disable-free" "-main-file-name" "test.c" "-mrelocation-model" "static" "-mframe-pointer=all" "-fmath-errno" "-fno-rounding-math" "-mconstructor-aliases" "-munwind-tables" "-target-cpu" "x86-64" "-tune-cpu" "generic" "-fno-split-dwarf-inlining" "-debugger-tuning=gdb" "-resource-dir" "/home/ken/workspace/llvm/build/lib/clang/12.0.0" "-internal-isystem" "/usr/local/include" "-internal-isystem" "/home/ken/workspace/llvm/build/lib/clang/12.0.0/include" "-internal-externc-isystem" "/usr/include/x86_64-linux-gnu" "-internal-externc-isystem" "/include" "-internal-externc-isystem" "/usr/include" "-fdebug-compilation-dir" "/home/ken/test/int_compiler" "-ferror-limit" "19" "-fgnuc-version=4.2.1" "-fcolor-diagnostics" "-faddrsig" "-o" "/tmp/test-dd0586.o" "-x" "c" "test.c"
 "/usr/bin/ld" "-z" "relro" "--hash-style=gnu" "--eh-frame-hdr" "-m" "elf_x86_64" "-dynamic-linker" "/lib64/ld-linux-x86-64.so.2" "-o" "test" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crt1.o" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crti.o" "/usr/lib/gcc/x86_64-linux-gnu/9/crtbegin.o" "-L/usr/lib/gcc/x86_64-linux-gnu/9" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../../../lib64" "-L/lib/x86_64-linux-gnu" "-L/lib/../lib64" "-L/usr/lib/x86_64-linux-gnu" "-L/usr/lib/../lib64" "-L/usr/lib/x86_64-linux-gnu/../../lib64" "-L/usr/lib/gcc/x86_64-linux-gnu/9/../../.." "-L/home/ken/workspace/llvm/build/bin/../lib" "-L/lib" "-L/usr/lib" "/tmp/test-dd0586.o" "-lgcc" "--as-needed" "-lgcc_s" "--no-as-needed" "-lc" "-lgcc" "--as-needed" "-lgcc_s" "--no-as-needed" "/usr/lib/gcc/x86_64-linux-gnu/9/crtend.o" "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crtn.o"

```

想看清clang的全部过程，可以先通过-E查看clang在预编译处理这步做了什么。宏展开

```
clang -E -o test.e test.c
宏定义会被去掉，不再依赖于相对位置的头文件。
```

--------------

## clang基本语法介绍

针对下面会用到的语法进行分析
```
    -fmodules
    允许modules的语言特性

    -fsyntax-only
    防止编译器生成代码,只是语法级别的说明和修改

    -Xclang <arg>
    向clang编译器传递参数

    -dump-tokens
    运行预处理器,拆分内部代码段为各种token

    -ast-dump
    构建抽象语法树AST,然后对其进行拆解和调试

    -S
    只运行预处理和编译步骤

    -fobjc-arc
    为OC对象生成retain和release的调用

    -emit-llvm
    使用LLVM描述汇编和对象文件

    -o <file>
    输出到目标文件

    -mllvm llvm-opt
     后面的选项是给llc使用的如： -mllvm -debug

    -c
    只运行预处理,编译和汇编步骤
    
    ## -mllvm -debug
Enable debug output
`-mllvm`: Additional arguments to forward to LLVM's option processing
```


```
clang -O3 -mllvm -debug test.c -S -emit-llvm > debug.log 2>&1
llc clang_O3.ll -debug > llc.log 2>&1
clang 17.c -c  -mllvm -debug > 17.log 2>&1
```





```
    -v
    编译，并输出编译时所使用的命令行
```
其余的就不多赘述了, 查看更多的clang使用方法可以在终端输入`clang --hep`查看,也可以点击如下链接: clang options



-------



### clang -O3 -emit-llvm -S
`clang`将调用`opt`做机器无关优化
`opt`只会做机器无关优化

### clang --cc1
The Clang compiler front-end has several additional Clang specific features which are not exposed through the GCC compatibility driver interface. The -cc1 argument indicates that the compiler front-end is to be used, and not the driver. The clang -cc1 functionality implements the core compiler functionality.
So, simply speaking. If you do not give -cc1 then you can expect the "look&feel" of standard GCC. That is the vast majority of compiler flags work just like you would expect them to work with GCC. If you pass the option "-cc1" then you get the Clang compiler flag set. Thus, there might be differences to GCC.

If you use `cc1`, you should not use `-S`, `-cc1 -S` will give you the machine assembly.

clang is the driver compatible with GCC. And the `clang -cc1` is core compiler functionality. When you use clang to build program, it will call `clang -cc1`, you can use `-v` option to check the real command.

Notice `clang -cc1 -emit-llvm` is different with `clang -S -emit-llvm`. 

```
/home/ken/llvm/build/bin/clang -cc1 -internal-isystem /home/ken/llvm/build/lib/clang/8.0.0/include -nostdsysteminc -target-feature +altivec -target-feature +htm -triple powerpc64-unknown-unknown -emit-llvm /home/ken/llvm/clang/test/CodeGen/builtins-ppc-htm.c -o -
```



```shell
clang -S -emit-llvm test.c -o test.ll
is equal to
clang -cc1 -emit-llvm test.c -o test.ll
```





--------------

### Get the assembly form the source code

```
clang -S add.c -o clang.s -O3
```

### NOTICE
If you use the `clang` with O0 or none opt option, it will add `optnone` in the function arrtibutes, so you will can't to use the opt to optimize the ll file.
You should do it like this, it will remove the `optnone` attribute and `noinline`.
```
clang -O1 -mllvm -disable-llvm-optzns -mllvm -disable-llvm-passes sum.c -S -emit-llvm
```



-----

# -mllvm

后面根传给llc的选项，如`-mllvm -debug`。

 ### -mllvm —stats

输出l,./ 统计信息

Note that in order to use the ‘`-stats`’ option, LLVM must be compiled with assertions enabled.





