<h1 align="center">log</h1>




在`CMakeCache.txt`中能看到各个选项的设置值以及默认值。



在`build/compile_commands.json`中可以看到每个文件的编译命令，不管是用`cmake`还是用`ninja`都可以。但在该文件中没有看到link命令。



可以通过 llvm-as.cpp.o找到所需要的编译命令行，和link使用链接命令行。



###  1. ninja

可以在build.ninja中看到所有的命令行，包括link命令行。

可以在`build/compiler_commands.json`和`build.ninja`中搜到`llvm-as.cpp.o`。



### 2. Cmake

搜索`llvm-as.cpp.o`可以知道link命令在Link.txt中，编译命令在`compiler_commands.json`中。

```shell
./tools/llvm-as/CMakeFiles/llvm-as.dir/link.txt
```

