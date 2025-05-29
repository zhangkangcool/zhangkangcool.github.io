https://blog.csdn.net/snsn1984/article/details/41077763



### 词法分析

```shell
clang -cc1 -dump-tokens min.c
clang -Xclang -dump-tokens min.c

`clang -### -Xclang -dump-tokens min.c`  查看运行的命令，但不运行
```



### 语法分析

```shell
`-cc1`与`-Xclang`一个意思
clang -cc1 -fsyntax-only -ast-dump min.c
clang -fsyntax-only -Xclang -ast-dump min.c

`clang -### -fsyntax-only -Xclang -ast-dump min.c` 查看运行的命令，但不运行
```





### dump ast

https://blog.csdn.net/qq_23599965/article/details/90637188

```shell
clang -Xclang -ast-dump -fsyntax-only test.cc
```









```shell
clang -cc1 --help | grep dump
  -analyzer-dump-egraph <value>
  -ast-dump-all=<value>   Build ASTs and then debug dump them in the specified format, forcing deserialization. Supported formats include: default, json
  -ast-dump-all           Build ASTs and then debug dump them, forcing deserialization
  -ast-dump-decl-types    Include declaration types in AST dumps
  -ast-dump-filter <dump_filter>
                          Use with -ast-dump or -ast-print to dump/print only AST declaration nodes having a certain substring in a qualified name. Use -ast-list to list all filterable declaration node names.
  -ast-dump-lookups       Build ASTs and then debug dump their name lookup tables
  -ast-dump=<value>       Build ASTs and then debug dump them in the specified format. Supported formats include: default, json
  -ast-dump               Build ASTs and then debug dump them
  -compiler-options-dump  Dump the compiler configuration options
  -dump-coverage-mapping  Dump the coverage mapping records, for testing
  -dump-deserialized-decls
  -dump-raw-tokens        Lex file in raw mode and dump raw tokens
  -dump-tokens            Run preprocessor, dump internal rep of tokens
  -fdump-record-layouts-simple
  -fdump-record-layouts   Dump record layout information
  -fdump-vtable-layouts   Dump the layouts of all vtables that will be emitted in a translation unit
                          Directory to dump module dependencies to
  -templight-dump         Dump templight information to stdout
```





```
 /home/shkzhang/llvm/build/bin/clang++ -DHAVE_POSIX_REGEX -DHAVE_STD_REGEX -DHAVE_STEADY_CLOCK -DNDEBUG -I/home/shkzhang/llvm_test_script/llvm-test-suite/MicroBenchmarks/libs/benchmark-1.3.0/include -I/home/shkzhang/llvm_test_script/llvm-test-suite/MicroBenchmarks/libs/benchmark-1.3.0/src -I/home/shkzhang/llvm_test_script/llvm-test-suite/MicroBenchmarks/libs/benchmark-1.3.0/src/../include -std=c++11 -Wall -Wextra -Wshadow -pedantic -pedantic-errors -Wshorten-64-to-32 -Wfloat-equal -fstrict-aliasing -Wzero-as-null-pointer-constant -Wstrict-aliasing -Wthread-safety -O3 -DNDEBUG -Werror -w -Werror=date-time -ffp-contract=off -std=gnu++11  -c /home/shkzhang/llvm_test_script/llvm-test-suite/MicroBenchmarks/libs/benchmark-1.3.0/src/benchmark_register.cc -mllvm -debug -mllvm -stop-before=ppc-pre-emit-peephole > before.mir
```







### TARGET & ARCH相关

```shell
`-cc1`与`-Xclang`一个意思
clang -cc1 -fsyntax-only -ast-dump min.c
clang -fsyntax-only -Xclang -ast-dump min.c

`clang -### -fsyntax-only -Xclang -ast-dump min.c` 查看运行的命令，但不运行
```





```shell
clang sim.c -target powerpc-unknown-unknown -c
clang sim.c --target=ppc32 -c
```



```
Driver/x86-target-features.c:// RUN: %clang -target i386-unknown-linux-gnu -march=i386 -mno-lzcnt -mno-popcnt -mno-tbm -mno-fma -mno-fma4 %s -### -o %t.o 2>&1 | FileCheck -check-prefix=NO-FMA %s
Driver/x86-target-features.c:// RUN: %clang -target i386-unknown-linux-gnu -march=i386 -mxop -mf16c -mrtm -mprfchw -mrdseed %s -### -o %t.o 2>&1 | FileCheck -check-prefix=XOP %s
Driver/x86-target-features.c:// RUN: %clang -target i386-unknown-linux-gnu -march=i386 -mno-xop -mno-f16c -mno-rtm -mno-prfchw -mno-rdseed %s -### -o %t.o 2>&1 | FileCheck -check-prefix=NO-XOP %s
```

