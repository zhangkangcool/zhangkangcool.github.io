





```shell
要想使用LLVM_DEBUG,需要include "llvm/Support/Debug.h"

并且在文件开头定义 
#define DUBUG_TYPE "mydebug"

参照CSKYAsmParser.cpp

编译时使用 -debug -debug-only=mydebug
或者 -debug-only=mydebug

clang -S -emit-llvm -o opt.ll -O0 -mllvm -debug-only=ir
```

