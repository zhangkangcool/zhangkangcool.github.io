clang的使用有两种方式，一种是通过driver里的clang应用程序，用命令行来执行操作，实现基于clang的前端，该方式要理清driver实现的路径，并基于其调用顺序来实现自己的前端处理流程。另一种是通过库调用的方式，直接调用clang核心模块中的接口来实现相关功能。

# 1. clang driver模式

### 1.1 设计模式

下面对driver的实现方式进行分析，clang driver的设计模型如图所示：

![img](clang两种模式.assets\clip_image002.png)



这张图的橘色部分除了代表图片左上角提及的Input / Output，还代表了Clang Driver里面的具体数据结构；绿色部分除了代表 Driver Functions，也代表了Driver的具体走向流程；蓝紫色部分则是一些重要的辅助类。

##### 1. Parse

Parse的作用是选项解析，负责把用户传入过来的命令行选项解析成一个一个的参数，放入到Arg实例中。

##### 2. Pipeline

Pipeline的作用则是根据具体的编译选项，构建不同的Compiler Action。在Clang Driver处理中，处理的对象是一个又一个的Action。在Clang的Pipeline过程中，大部分Action都是对应实际发生的行为，如预编译，编译等，但是有两个特别的Action：InputAction和BindArchAction，前者用于辅助实际发生Action，例如预编译时用户需要输入文件进来，那么会用到InputAction。而BindArchAction则是用于InputAction的绑定机器架构，BindArchAction一个常见应用是同时创建一个库，既支持32位，也支持64位，通过编译链接两次，产生了两个平台下的库，并将其打包到一起，这样这个库就能既在32位也能在64位平台下运行。

##### 3. Bind

Bind的作用在于Tool与Filename的选择提供，在我们创建一系列Action进行的时候，Bind则是为我们提供具体的Tool来进行这一系列的实际运行，而在实际运行时则是一个一个的子进程。例如我们有Assemble Action，需要有实际的Assembler来完成这个任务，Assembler可以是系统自带的，也可以是第三方的，Bind的工作就是将要执行的Action和要使用的Tool进行绑定。而负责选择Tool工作的则是ToolChain，每一个架构、平台、操作系统都有一个ToolChain，而Bind则是与ToolChain打交道，ToolChain负责选择具体的Tool来完成一系列Action。

##### 4. Translate

Translate的作用是处理工具的选项参数翻译，同一个编译选项在不同的平台上有不同的表示方式，如同样要编译动态库，在Linxu下需要加-shared选项，而在Mac上是-dylib，Translate需要将用户的输入翻译成对应平台上的参数。

##### 5. Execute

Execute接收翻译过后的参数，执行整个编译过程，从词法分析、语法分析、语义分析、IR生成、后端优化一直到目标代码生成。



### 1.2 从代码层面上对调用流程进行分析

Driver模式下编译器整个的调用流程如图 5所示

![img](clang两种模式.assets\clip_image004.png)

clang可执行文件运行的起始入口为clang/tools/driver/driver.cpp中的main函数

main函数主要调用流程如下：

1. InitializeAllTargets初始化所有的target信息。

2. 调用BuildCompilation函数创建compilation对象，该函数的功能主要是解析命令行中生成的参数，并根据参数构建特定的action，编译器前端的操作都是通过抽象的action来完成，action可以决定编译器要运行到哪个阶段，比如传入-emit-llvm参数则编译器只要运行到IR生成的阶段，不会执行后续的link操作。基于action会再封装成Job对象供后续调用。

3. 调用ExecuteCompilation函数执行创建的compilation, 依次进入到ExecuteJobs、ExecuteCommand、Execute、ExecuteAndWait; 然后调用posix_spawn启动一个新的clang进程，在使用gdb调试时，需要使用set-follow-fork-mode child命令来进入子进程。

4. 新的进程依旧从同一个main函数开始，但函数流程不同，会进入clang真正的前端执行流程ExecuteCC1Tool,紧接着调用cc1_main函数。

5. 在cc1_main函数中首先会创建和调试引擎相关的对象，如DiagnosticOptions（调试选项），TextDiagnosticBuffer（存放调试信息的缓冲区），DiagnosticEngine（调试引擎），并关联到complerInstance对象中去。

6. 创建CompilerInstance对象，该对象负责维护整个编译过程需要的所有资源，然后会创建CompilerInvocation对象，该对象用来保存各种启动编译需要的各种必要信息，包括各种模块的option，文件包含目录，标志位，参数解析等。

7. 调用ExecuteCompilerInvocation, 并执行CompilerInstance->ExecuteAction, 会根据传入的action类型来选择不同的处理流程。

8. 在ExecuteAciton中首先会校验各种传入参数、检查前置状态是否完成设置，然后调用Act->Execute，Execute中会调用ExecuteAction，ExecuteAction函数是虚函数，会根据action对象的不同进入不同的处理函数，如PreprocessorFrontendAction只需做预处理即可，CodeGenAction则需要一直执行到IR的生成。

9. 对于本项目来说，只需要执行到IR的生成阶段即可，Execute向下执行会最终进入到关键函数ParseAST中, ParseAST完成前端的词法、语法、语义、抽象语法树生成等工作。

综上所述clang driver的执行流程包括两趟，第一趟任务主要目的是解析各种输入的参数，初始化各种状态，并且将用户预期的操作抽象出action,并封装成Job，最终组成一个compilation对象，然后启动新的进程进行执行。

第二趟任务进入真正的clang前端处理流程ExecuteCC1Tool，创建必要的对象并拿到第一趟封装的action，并进入相关的执行流程 。

cc1_main的主要函数调用过程如下图所示：

![img](clang两种模式.assets\clip_image006.png)

 ```c++
 cc1_main -> ExecuteCompilerInvocation -> CompilerInstance::ExecuteAction -> FrontendAction::Execute -> ExecuteAction(虚函数,根据不同的action调用)
 ```





### 2  clang lib模式

该模式下直接包含clang的头文件，并链接相关的实现库，通过直接调用内部接口的方式实现对源码的预处理、词法分析、语法分析、语义分析、IR生成。链接clang库时，给前端输入的各种参数不像上一个方式有很多的解析流程，复杂的是确认不同的编译目标下的必要参数，然后从创建CompilerInstance开始，后续步骤会模仿driver层的实现，并根据要编译的语言和输出目标进行流程的精简和不相关代码的裁剪。