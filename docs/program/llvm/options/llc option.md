```
llc sum.bc -o sum.s
llc sum.ll -o sum.s
llc sum.bc -filetype=obj -o sum.o
llc sum.bc -march=mips -filetype=obj -o sum.o
```


# debug option
### -print-after-all
Print IR after each pass
```
llc -debug -print-after-all 32.ll > llc.log
```

### -debug

https://www.cnblogs.com/NBSTAR/archive/2012/12/20/2827288.html
Enablu debug output, you will get the backend output
```
llc clang_O3.ll -debug > llc.log 2>&1
clang 17.c -c  -mllvm -debug > 17.log 2>&1
```

### -O level

```
https://llvm.org/docs/CommandGuide/llc.html
```

```
Optimization level. [-O0, -O1, -O2, or -O3] (default = '-O2')
-O=uint

    Generate code at different optimization levels. These correspond to the -O0, -O1, -O2, and -O3 optimization levels used by clang.

```











----------------

# Bitcode

### llvm-as

```shell
llvm-as -o hello.bc hello.ll

llc sum.bc -o sum.s
llc sum.bc -filetype=obj -o sum.o
llc sum.bc -march=mips -filetype=obj -o sum.o
```



### llvm-dis

```shell
llvm-dis hello.bc -o hello.ll
```



### lli 直接运行LLVM的二进制文件

```shell
lli hello.bc
```



Llvm-diff对方ll文件和二进制文件

```shell
llvm-diff output.bc output.ll
```

