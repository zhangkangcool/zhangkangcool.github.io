## 基本概念

### LLVM IR

- 两个基本原则

  - 静态单赋值形式（SSA）表示和无限寄存器让优化能够快速执行
  - 整个程序的IR存储到磁盘让链接时优化易于实现

- 三种格式

  - `.ll`扩展名，类似汇编，人可读

    `clang -emit-llvm -S hello.c -o hello.ll`

    `-S`：Only run preprocess and compilation steps

  - `.bc`扩展名，，不可读二进制

    `clang -emit-llvm -c hello.c -o hello.bc`

    `-c`：Only run preprocess, compile, and assemble steps

  - 内存格式，只保存在内存中，llvm编译快的原因


### LLVM子工程

> 参考：[llvm-project目录结构](https://llvm.org/docs/GettingStarted.html#directory-layout)

- clang：LLVM项目原生编译器前端，驱动整个编译器的流程

- lld：LLVM Linker

- LLDB：基于LLVM和Clang，作为调试器

- libc++：C++标准库的实现

- libclc：OpenCL标准库的实现

  

## 构建

*尝试构建LLVM & 构建Clang子项目*

>  参考：[官网构建教程](https://llvm.org/docs/GettingStarted.html#getting-the-source-code-and-building-llvm) / [cmake参数表](https://llvm.org/docs/CMake.html)

- **stand-alone方式**：

  ```bash
  #!/bin/sh
  
  build_llvm=`pwd`/build-llvm
  build_clang=`pwd`/build-clang
  installprefix=`pwd`/install
  llvm=`pwd`/llvm-project
  mkdir -p $build_llvm
  mkdir -p $installprefix
  mkdir -p $build_clang
  
  cmake -G Ninja -S $llvm/llvm -B $build_llvm \
        -DLLVM_INSTALL_UTILS=ON \
        -DCMAKE_INSTALL_PREFIX=$installprefix \
        -DCMAKE_BUILD_TYPE=Release \
        -DLLVM_TARGETS_TO_BUILD="host" \
        -DLLVM_INCLUDE_TESTS=ON
  
  ninja -C $build_llvm install
  
  # 可能需要指定LLVM_DIR
  export LLVM_DIR=/Users/xiangtiange/Program/LLVMWork/install/lib/cmake
  
  cmake -G Ninja -S $llvm/clang -B $build_clang \
        -DLLVM_ROOT=$installprefix \
        -DCMAKE_BUILD_TYPE=Release \
        -DLLVM_TARGETS_TO_BUILD="host"\
        -DLLVM_INCLUDE_TESTS=ON
  
  ninja -C $build_clang
  ```

  - 说明
    - 在非`llvm-project/`目录下执行此bash脚本
    - Ninja：build system generators，构建工具，默认使用多处理器并行构建
    - `CMAKE_BUILD_TYPE`，Release模式减少内存开销
    - `LLVM_TARGETS_TO_BUILD`，目标架构，"host"指代当前主机架构
    - `CMAKE_INSTALL_PREFIX`， LLVM库与工具安装的绝对路径，默认为 `/usr/local`
    - `LLVM_PARALLEL_LINK_JOBS`，执行链接任务的并行进程数
    - `ninja install` / `make install` ，Installs LLVM header files, libraries, tools, and documentation in a hierarchy under `$PREFIX`, specified with `CMAKE_INSTALL_PREFIX`


- 同时构建：

  ```bash
  mkdir build_latest && cd build_latest
  
  cmake -G Ninja \
  			-DLLVM_ENABLE_PROJECTS="clang" \
  			-DCMAKE_BUILD_TYPE=Debug \
  			-DLLVM_TARGETS_TO_BUILD="host" \
  			-DLLVM_INCLUDE_TESTS=OFF \
  			../llvm-project/llvm
  
  cmake --build .
  ```



## 测试

### 三类测试

> 参考：[三类测试官网描述](https://llvm.org/docs/TestingGuide.html#llvm-testing-infrastructure-organization)

- Unit Test：
  - 代码位于`llvm/unittests/`目录下，针对llvm所支持库与通用数据结构的测试
  - 在`build/`目录下执行`ninja check-llvm-unit`
  - 单独执行某一部分的测试`llvm-lit build/test/CodeGen/ARM`
- Regression Test：
  - 代码位于`llvm/test`目录下，针对llvm具体功能的测试（例如IR的转换与分析），使用[Lit](https://llvm.org/docs/CommandGuide/lit.html)工具驱动。
  - 在`build/`目录下执行`ninja check-llvm`
- test-suit：类似于端到端测试，[代码仓库](https://github.com/llvm/llvm-test-suite.git)，针对llvm输出与性能的测试。



## 基础架构

![img](https://pic1.zhimg.com/v2-e93d22914f2939017db6c6ff463cc2d8_r.jpg)

### 三大部分

- 前端：将计算机编程语言（例如C，C++，Objective-C）翻译为LLVM编译器IR。包含词法分析器，语法解析器，语义分析器，和LLVM IR代码生成器。Clang项目实现了全部前端相关的步骤，同时提供了插件接口和一个单独的静态分析器工具，用于深度分析。
- IR：LLVM IR既有人类可读形式，又有二进制编码形式。很多工具和程序库提供了用于构建、汇编、反汇编IR的接口。LLVM优化器也操作IR，大部分优化在此发生。
- 后端：这是负责代码生成的编译阶段。它将LLVM IR变换为机器特定的汇编代码或目标代码二进制。寄存器分配、循环转换、窥孔优化、机器特定的优化/转换等属于后端。

### 高层工具 vs 底层工具

<u>任何由这样的高层工具完成的任务，都可分解成一连串低层工具，达到相同的结果。</u>

Clang能够开展全部编译过程，而不仅仅是类似底层工具如opt和llc的工作。这解释了为什么在静态编译下，Clang可执行文件经常是最大的，因为它链接并运行整个LLVM生态系统。

clang——编译器驱动器，隐式地调用所有其它的工具，从前端到链接器。

### LLVM插件式Pass接口

Pass是一种转换分析或优化。在程序编译生命期的不同阶段，可以通过LLVM API注册任意Pass。Pass管理器用以注册Pass、调度Pass、声明Pass之间的依赖关系。在不同的编译阶段到处都可获得PassManager类的实例。

直接把Pass理解为中间件。



## LLDB使用

> [参考视频](https://www.youtube.com/watch?v=2GV0K9Y2MKA) / [官方文档](https://lldb.llvm.org/use/tutorial.html)

### 常用命令

- Clang编译生成可执行文件

  `clang -g hello.c -o hello`：`-g`：Generate debug information.记录代码的

- LLDB打开可执行文件：
  - 方法一：直接执行`lldb ./hello`
  - 方法二：先执行`lldb`进入调试器，在执行`file ./hello`设置可执行文件
  - 携带命令行参数：`lldb -- ./hello arg1`
  
- 手册查询：`help`

- 调试相关：
  - `b <filename>:<linenum> / <func name>`: 设置断点
  - `run`: Launch the executable
  - `continue`: 只在用户设置的断点出停止
  - `next`: Source level single step, <u>stepping over</u> calls.
  - `step`: Source level single step, <u>stepping into</u> calls.
  - `frame variable`: 显示当前函数调用栈最顶部的函数中的变量
  - `bt`: Show the current thread's call stack. <u>backtrace</u>

### 概念区分我

- **Continue**: Debugger executes the program and <u>“breaks” only on user-defined breakpoints</u>
- **Step Over**: Debugger executes the program statement by statement <u>within the current execution context (scope).</u>
- **Step Into**: Debugger executes the program statement by statement. <u>The debugger will execute the function body if the statement is a function call (a new execution context appears in the “call stack” tab).</u> Otherwise, the debugger will continue to the following statement, just like the “Step Over” action.
- **Step Out**: If the debugger is within a nested scope, this action proceeds until the function returns <u>(exits the current execution context).</u> In case the debugger is within the global scope, this action executes the program to the end. 



## 文件解释

- `.o`为目标文件，相当于windows中的`.obj`文件。
- `.so`为共享库，即shared object，用于动态连接的，相当于windows下的`.dll`。
- `.a`为静态库，用于静态连接，相当于windows下的`.lib`。

























