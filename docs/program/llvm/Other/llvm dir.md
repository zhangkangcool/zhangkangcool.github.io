<h1 align="center">llvm dir</h1>


https://blog.csdn.net/dongjideyu/article/details/16805355?%3E



以下是一个简短的介绍代码布局：

- ## llvm/examples

  这个目录包含一些简单的示例,这些演示如何使用LLVM IR和JIT。

- ## llvm/include

  - ### llvm/include/llvm

    这个目录包含所有的LLVM特定头文件。这个目录的子目录也有不同部分的LLVM:Analysis,CodeGen,Target,Transforms, 等。。。

  - ### llvm/include/llvm/Support

    这个目录包含,LLVM提供的泛型支持库但不一定是特定于LLVM。例如，一些c++ STL utilities和一个命令行选项处理库头文件存储在这里

  - ### llvm/include/llvm/Config

    这个目录包含头文件配置的配置脚本。这里包装了“标准的”UNIX和C头文件。源码可以包含这些头文件，这些头文件能自动考虑到条件句 #includes 并且配置脚本生成。

- ## llvm/lib系统的

  这个目录包含大部分的LLVM的系统的源文件。在LLVM中，几乎所有的代码存在于libraries，这样使在不同的tools中共享代码是很容易的。

  - ### llvm/lib/VMCore/

    此目录保存着核心LLVM源文件, 这些文件实现了核心的类 比如Instruction 和BasicBlock。

  - ### llvm/lib/AsmParser/

    此目录保存着LLVM汇编语言解析器库的源代码。

  - ### llvm/lib/BitCode/

    此目录保存着读写LLVM bitcode的源代码。

  - ### llvm/lib/Analysis/

    这个目录包含各种不同的程序分析，例如 Dominator 信息，Call Graphs，Induction Variables，IntervalIdentification，Natural Loop Identification 等。

  - ### llvm/lib/Transforms/

    此目录包含了 从LLVM 到LLVM程序转换的源代码，例如Aggressive Dead Code Elimination，Sparse Conditional Constant Propagation，Inlining，Loop Invariant Code Motion，Dead Global Elimination等。

  - ### llvm/lib/Target/

    这个目录包含的文件描述了各种目标架构的代码生成。例如llvm/lib/Target/X86目录 是 X86机器的描述，而llvm/lib/Target/ARM 实现的是ARM 的后端。

  - ### llvm/lib/CodeGen/

    这个目录包含了主要部分的代码生成器：InstructionSelector，Instruction Scheduling 和Register Allocation

  - ### llvm/lib/MC/

  - ### llvm/lib/Debugger/

    这个目录包含源代码级调试器库，它使LLVM program 成为一个工具，当程序执行的时候，Debugger 可以识别源代码的位置。

  - ### llvm/lib/ExecutionEngine/

    这个目录包含了在运行时解释和JIT编译的形式直接执行LLVM字节码的库。

  - ### llvm/lib/Support/

    这个目录包含llvm/include/ADT/和llvm/include/Support/头文件相对应的源代码。

- ## llvm/projects

  这个目录包含的projects 不是严格意义上的llvm的部分，但是是LLVM附带的。这个应该是你创建自己的基于llvm项目的目录。参见lvm/projects/sample ,如何建立自己的项目。

- ## llvm/runtime

  这个目录包含库的编译成LLVM bitcode的库，这些库在用clang 前端链接程序的时候被使用。大部分的库是真实库的精简版；例如，libc是一个精简版本的glibc。
  与其他的LLVM套件不同，这个目录需要LLVM GCC前端编译。

- ## llvm/test

  这个目录包含功能和回归测试和其他LLVM infrastructure的正常的检查。这些旨在快速运行和覆盖大量的区域而不是详尽的。

- ## test-suite

  在通常的llvm模块里，这不是一个目录；它是一个一定要被取出的单独Subversion模块（通常在projects/test-suite）

- ## llvm/tools

  tools 目录包含了，由libraries 构建生成的可执行文件，这构成了用户借口的主要部分。你通常可以通过 输入 工具名 -help 的方式获得相应的帮助。一下是对重要工具的简短的介绍。更多的细节信息在[Command Guide](http://llvm.org/docs/CommandGuide/index.html)

  - ### bugpoint

    bugpoint用于debug优化的passes或是代码生成的后端，通过引发问题的最小数量的passes或是指令不管是一个崩溃还是误编译来缩小给定的测试用例。见[HowToSubmitABug.html](http://llvm.org/docs/HowToSubmitABug.html)更多关于使用 bugpoint 的信息。

  - ### llvm-ar

    这个归档器生成一个关于LLVM bitcode 文件的存档，可选地与一个索引用于快速查找。

  - ### llvm-as

    汇编器将人可读的LLVM 装配成LLVM bitcode.

  - ### llvm-dis

    反汇编器将 LLVM bitcode 转换成 人可都的LLVMllvm-link

  - ### llvm-link,

    没什么惊奇的，就是将多个LLVM模块到一个单独的程序。lli是LLVM 的解释器，可以直接执行LLVM bitcode(尽管很慢)。对于架构，它自持（现在是x86,Sparc 和PowerPC）,默认，lli 将会当作一个 Just-In - time 的编译器运行(如果这个功能被编译了的),并将执行比解释器快得多。

  - ### llc

    llc 是LLVM 后端编译器。它会将LLVM bitcode 转换成一个本地代码汇编文件或是C代码文件（用 -march=C 的选项）。

  - ### opt

    opt 读取LLVM bitcode,应用一系列的LLVM 到LLVM transformations(在命令行中指定)，然后生成 合成的bitcode。“opt - help '命令是一个很好的方式在LLVM中获得一组可用的程序转换。
    opt 也可以用于运行特定的analysis 在输入的LLVM bitcode 文件并且打印输出运行结果。它主要用于调试分析，或是熟悉分析做什么。

- ## llvm/utils

  - ### codegen-diff

    codegen-diff是一个脚本,用于发现LLC和LLI产生代码的差异。这是一个有用的工具如果你调试其中之一,假设其他产生正确的输出。获取完整的用户手册,运行‘perldoc codegen-diff’。

  - ### emacs/

    emacs目录包含语法高亮文件，他将会与Emacs和XEmacs editors一起起作用。为LLVMassembly 文件和TableGen描述文件提供语法高亮支持。关于如何使用语法文件请查阅目录里的README文件。

  - ### getsrcs.sh

    getsrcs.sh脚本找到并输出所有非生成的源文件。这是有用的如果一个人想要做很多跨目录的项目。一种方式使用它是运行，例如：xemacs`utils/getsources.sh` 在您顶层的LLVM源代码树。

  - ### llvmgrep

    这个小工具执行egrep -H -n在LLVM 中的每个源文件 并传递给llvmprep 的命令行提供的正则表达式。

  - ### makellvm

    makellvm 脚本编译当前目录的所有文件并且编译链接第一个参数的tool。例如，假定您在目录llvm/lib/Target/Sparc，如果makellvm是在您的路径，简单地运行makellvm llC 将会构建当前的目录，切换到llvm/tools/llc 目录并且构建它，然后会引发重新链接LLC。

  - ### TableGen/

    TableGen 目录包含这样的工具，它用于产生寄存器描述，指令集描述，甚至是有关常见的TableGen描述的汇编程序。

  

  - ### vim/

    vim目录包含文件的语法高亮现实文件，他将伴随vim编辑器的使用。为LLVMassembly 文件和TableGen描述文件提供语法高亮支持。关于如何使用语法文件请查阅目录里的README文件。

    

  -------

  ### 1. 使用llvm vim插件

  根据utils/vim/README文件，可知，运用如下cmd将vim目录下的内容全部复制到`.vim`，执行此操作前最好检测下`.vim`目录是否为空，以免覆盖了该目录下其它需要的文件。

  ```asm
  cp ~/workspace/llvm/llvm/utils/vim ~/.vim
  ```

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  