<h1 align="center">Mesa-LLVM-Analysis</h1>

- [1. 核函数编译器总体设计方案](#1-核函数编译器总体设计方案)
- [2. Mesa OpenCL编译器分析](#2-mesa-opencl编译器分析)
  - [2.1 clover代码结构](#21-clover代码结构)
  - [2.2 重要数据结构](#22-重要数据结构)
  - [2.3 clover编译OpenCL流程](#23-clover编译opencl流程)
  - [2.4 复用clang处理OpenCL的实现原理](#24-复用clang处理opencl的实现原理)
    - [2.4.1 关键字的识别](#241-关键字的识别)
    - [2.4.2 内建函数的处理](#242-内建函数的处理)
  - [2.5 mesa在商卡上运行clover注意事项](#25-mesa在商卡上运行clover注意事项)
- [3. LLVM代码分析](#3-llvm代码分析)
  - [3.1 LLVM代码结构](#31-llvm代码结构)
  - [3.2 LLVM 前端](#32-llvm-前端)
    - [3.2.1 clang功能模块](#321-clang功能模块)
    - [3.2.2 clang 两种模式](#322-clang-两种模式)
      - [3.2.2.1 clang driver模式](#3221-clang-driver模式)
      - [3.2.2.2 clang lib模式](#3222-clang-lib模式)
    - [3.2.3 核心数据结构](#323-核心数据结构)
      - [3.2.3.1 CompilerInstance](#3231-compilerinstance)
      - [3.2.3.2 CompilerInvocation](#3232-compilerinvocation)
      - [3.2.3.3 FrontAction](#3233-frontaction)
      - [3.3.3.4 Diagnostics](#3334-diagnostics)
      - [3.3.3.5 SourceManager](#3335-sourcemanager)
    - [3.2.4 clang AST](#324-clang-ast)
      - [3.2.4.1 AST的基本结构](#3241-ast的基本结构)
      - [3.2.4.2 AST的生成](#3242-ast的生成)
        - [预处理](#预处理)
        - [词法分析](#词法分析)
        - [语法分析](#语法分析)
        - [语义分析](#语义分析)
        - [代码生成](#代码生成)
      - [3.2.4.3 AST的遍历](#3243-ast的遍历)
      - [3.2.4.4 AST序列化](#3244-ast序列化)
      - [3.2.4.5 ASTConsumer](#3245-astconsumer)
  - [3.3 LLVM后端](#33-llvm后端)
    - [3.3.1 LLVM后端基本流程](#331-llvm后端基本流程)
    - [3.3.2 自定义后端实现](#332-自定义后端实现)
    - [3.3.3 LLVM IR优化](#333-llvm-ir优化)
      - [3.3.3.1 LLVM Pass及常用子类](#3331-llvm-pass及常用子类)
      - [3.3.3.2 Pass管理器（Pass Manager)](#3332-pass管理器pass-manager)
- [4. 当前实现的OpenCL前端demo代码](#4-当前实现的opencl前端demo代码)

# 1. 核函数编译器总体设计方案
设计方案如下图所示:  
<center><img src="./img/总体方案图1.svg"></center>

核心思路是复用clang的前端实现对OpenCL核函数的编译，输出LLVM IR或者SPIR-V的标准中间格式，然后使用现有编译器的后端解析SPIR-V或者将SPIR-V转换为VIR，最终生成可供凌久GPU执行的二进制代码。  

目前clang在命令行(driver模式)是支持对OpenCL核函数的编译，但项目要求的编译器是一个运行时的代码，故需要通过调用clang内部接口的方式来完成整个前端的操作，整个编译器前端的实现会综合参考clang driver mode和mesa 编译器前端的实现流程，并在此基础上进行流程的精简和代码裁剪。
# 2. Mesa OpenCL编译器分析
mesa在gallium框架下实现了OpenCL驱动的前端clover，具体包括API的上层实现，并设计了和底层驱动相关的接口供设备厂商自行实现（可以理解为HAL层的代码），另外实现了OpenCL编译器的前端，提供了几个路径，包括编译成LLVM IR，spirv，和自己的NIR，后端代码需要厂商自行实现。整个OpenCL模块代码包含在clover文件夹中(mesa/src/gallium/frontends/clover)。
## 2.1 clover代码结构
如下图所示为clover代码目录结构，其中重点需要关注的是core、llvm、spirv目录的代码，其中core里面与编译器最为相关的两个对象为program和kernel,  llvm目录里封装了对llvm和clang调用的方法，在spirv里主要是封装了LLVM IR和SPIR-V互转的接口。 
<center> <img src="./img/clover.svg"></center>

## 2.2 重要数据结构
对于clover驱动来说，和编译器相关的主要是Program类和Kernel类，如下图所示为两个类的类图及相关成员功能说明  
<center> <img src="./img/program%20class.svg"></center>

## 2.3 clover编译OpenCL流程
如下图所示为clover模块编译OpenCL kernel的代码时序图，整个流程从OpenCL Driver调用编译API开始，经过一系列的对象数据封装和调用，调用LLVM和clang中的编译接口，最后将编译出的IR封装成clover::module结构，供clover driver后续调用。  
<center> <img src="img/clover%20compiler%20Sequence.svg"></center>

下面对其中的关键函数compile_program和compile_to_spirv进行流程分析，这两个函数的实现位于文件llvm/invocation.cpp中

 **compile_program**

（1）准备阶段  

1、创建LLVM的上下文 LLVMContext（ctx)    

2、设置诊断回调函数，通过ctx->setDiagnosticHandlerCallBack接口    

3、创建clang实例对象clang::CompilerInstance(c)  

4、创建诊断文本缓冲对象clang::TextDiagnosticBuffer  

5、创建诊断引擎clang::DiagnosticsEngine  

6、创建compilerInstance中的invocation对象，该对象用于保存前端各种编译选项  

7、给compiler instance设置target, language等信息,告诉前端目标代码的硬件相关信息，和要处理的语言信息  

8、将诊断引擎和clang::compilerInstance对象关联起来，具体是通过c->createDiagnostics接口  

（2）前端处理阶段  

1、添加OpenCL源码依赖的头文件，宏定义等，通过c.getHeaderSearchOpts().AddPath来添加包含路    径，通过c.getPreprocessorOpts().Includes.push_back来添加头文件名字,通过c.getPreprocessorOpts().addMacroDef来添加宏定义  

2、链接libclc生成的bitcode文件，通过c.getCodeGenOpts().LinkBitcodeFiles.emplace_back(F)来链接*.bc文件，其中F的类型为clang::CodeGenOptions::BitcodeFileToLink F；  

3、创建frontend action对象clang::EmitLLVMOnlyAction act(&ctx)  

4、启动action操作c.ExecuteAction(act)  

5、返回llvm::Module对象act.takeModule        

**compile_to_spirv**   

准备阶段和前端处理阶段流程和compile_to_program基本一致，区别在于不需要link  \*.bc文件, 在返回llvm::Module对象后，调用llvm::writeSpirv方法将module中的LLVM IR转换为SPIR-V数据并写到文件中去。  
## 2.4 复用clang处理OpenCL的实现原理
clang是处理C、C++、Objective C等类C语言的前端，OpenCL C是基于C99标准扩展而来编程语言，基本语法和C一致，另外有独属于自己的关键字和内建函数需要进行单独处理。
### 2.4.1 关键字的识别
在clang/lib/Sema/OpenCLBuiltins.td文件中定义了OpenCL关键字，使用tablegen工具将其生成语法树依赖，在创建相关上下文是，会作为外部语法源供clang调用，在Sema类中维护了一个ExternalSemaSource类型的指针，专门用来处理这种外部语法信息，clang通过解析外部语法信息具备处理OpenCL关键字的能力。
### 2.4.2 内建函数的处理
内建函数有两种处理方式  

第一种如果编译器前端要生成编译特定硬件的中间代码，则需要链接libclc模块，libclc模块中实现了主流硬件的内建函数的bitcode实现，libclc模块在编译时使用prepare_builtins工具将.cl文件处理成不同target对应的.bc文件，在启动编译前，通过LinkBitcodeFiles接口将.bc文件链接到CodeGenOpts中，这样当需要生成特定硬件生产LLVM IR时，在IR生成阶段会将对应的内建函数替换成bitcode的实现。  

第二种如果编译器前端要生成和硬件无关的SPRI-V时，无需链接libclc模块,这是因为spirv是和硬件无关的中间语言，能够自动的将内建定义处理成一个独立的符号，然后在编译器后端会自动根据自己的硬件实现将对应的符合进行decode，转换成可供硬件实现的相关指令。

## 2.5 mesa在商卡上运行clover注意事项
若使用安装库的方式运行clover，需要安装mesa-opencl-icd, opencl-headers, libclc即可   

若使用源码编译的方式运行clover，需要在meson命令参数中传入-Dgallium-drivers="radeonsi,swrast"，其中radeonsi对应AMD的卡，nouveau对应N卡，该参数会控制src/gallium/targets/pipe-loader目录下库的生成，会生成对应target的pipe-loader库，如radeonsi生成pipe_radeonsi.so，该库会查找对应的dri驱动。 

pipe-loader的调用发生在platform的构造函数中，隐式调用容易被忽略。

# 3. LLVM代码分析
## 3.1 LLVM代码结构
LLVM的工程关键目录及主要功能如下所示，非核心目录不包含在内，其中标红模块为OpenCL编译器构建的核心模块。
<center><img src="img/LLVM代码结构%201.svg"></center>

## 3.2 LLVM 前端
### 3.2.1 clang功能模块
clang的各个模块都是单独编译成库，主要核心库包括以下内容：
- libclangLex 用于预处理和词法分析、处理宏、令牌和pragma构造
-  libclangParse 用于使用词法分析阶段的结果进行逻辑解析,语法分析
- libclangAST 构建、操作和遍历抽象语法树
- libclangSema 用于语义分析，语义分析为AST验证提供操作
- libclangCodeGen 使用编译目标的信息来生成LLVM IR代码
- libclangAnalysis 包含用于静态分析的资源
- libclangRewrite 用于支持代码重构，并为构建代码重构工具提供基础架构
- libclangBasic 提供一组实用程序，包括文件缓存系统、内存分配抽象、源代码位置和故障诊断、目标机器抽象、语言抽象等
- clang驱动程序，应用程序，也是下文提及的driver

### 3.2.2 clang 两种模式
clang的使用有两种方式，一种是通过driver里的clang应用程序，用命令行来执行操作，实现基于clang的前端需要理清driver实现的路径，并基于其调用顺序来实现自己的前端处理流程。另一种是通过库调用的方式，直接调用clang核心模块中的接口来实现相关功能。
#### 3.2.2.1 clang driver模式
下面对driver的实现方式进行分析，clang driver的设计模型如下所示： 

<center><img src="./img/Pasted%20image%2020230306164203.png", withth="300", height="500"></center>  

这张图的橘色部分除了代表图片左上角提及的Input / Output，更是代表了Clang Driver里面的具体数据结构；绿色部分除了代表 Driver Functions，也代表了Driver的具体走向流程；蓝紫色部分则是一些重要的辅助类。   

第一个步骤Parse: Parse的作用是选项解析，负责把用户传入过来的命令行选项解析成一个一个的参数，放入到Arg实例中。 

第二个步骤Pipeline: Pipeline的作用则是根据具体的编译选项，构建不同的Compiler Action。在Clang Driver处理中，处理的对象是一个又一个的Action。在Clang的Pipeline过程中，大部分Action都是对应实际发生的行为，如预编译，编译等，但是有两个特别的Action：InputAction和BindArchAction，前者用于辅助实际发生Action，例如预编译时用户需要输入文件进来，那么InputAction就给你。而BindArchAction则是用于InputAction的绑定机器架构，BindArchAction一个常见应用是同时创建一个库，既支持32位，也支持64位，通过编译链接两次，产生了两个平台下的库，并将其打包到一起，这样这个库就能既在32位也能在64位平台下运行。

第三个步骤Bind：Bind的作用在于Tool与Filename的选择提供，在我们创建一系列Action进行的时候，Bind则是为我们提供具体的Tool来进行这一系列的实际运行，而在实际运行时则是一个一个的子进程。例如我们有Assemble Action，需要有实际的Assembler来完成这个任务，Assembler可以是系统自带的，也可以是第三方的，Bind的工作就是将要执行的Action和要使用的Tool进行绑定。而负责选择Tool工作的则是ToolChain，每一个架构、平台、操作系统都有一个ToolChain，而Bind则是与ToolChain打交道，ToolChain负责选择具体的Tool来完成一系列Action。  

第四个步骤Translate: Translate的作用是处理工具的选项参数翻译，同一个编译选项在不同的平台上有不同的表示方式，如同样要编译动态库，在Linxu下需要加-shared选项，而在Mac上是-dylib，Translate需要将用户的输入翻译成对应平台上的参数。

第五个步骤Execute：Execute接收翻译过后的参数，执行整个编译过程，从词法分析、语法分析、语义分析、IR生成、后端优化一直到目标代码生成。

**从代码层面上对调用流程进行分析**  
调用流程图如下图所示   

<center><img src="./img/clang%20driver流程图.svg"></center>  


clang可执行文件运行的起始入口为clang/tools/driver/driver.cpp中的main函数  
main函数主要调用流程如下：  

1、InitializeAllTargets初始化所有的target信息   

2、调用BuildCompilation函数创建compilation对象，该函数的功能主要是解析命令行中生成的参数，并根据参数构建特定的action，编译器前端的操作都是通过抽象的action来完成，action可以决定编译器要运行到哪个阶段，比如传入-emit-llvm参数则编译器只要运行到IR生成的阶段，不会执行后续的link操作。基于action会再封装成Job对象供后续调用  

3、调用ExecuteCompilation函数执行创建的compilation, 依次进入到ExecuteJobs、ExecuteCommand、Execute、ExecuteAndWait; 然后调用posix_spawn启动一个新的clang进程，在使用gdb调试时，需要使用set-follow-fork-mode child命令来进入子进程  

4、新的进程依旧从同一个main函数开始，但函数流程不同，会进入clang真正的前端执行流程ExecuteCC1Tool,紧接着调用cc1_main函数  

5、在cc1_main函数中首先会创建和调试引擎相关的对象，如DiagnosticOptions（调试选项），TextDiagnosticBuffer（存放调试信息的缓冲区），DiagnosticEngine（调试引擎），并关联到complerInstance对象中去  

6、创建CompilerInstance对象，该对象负责维护整个编译过程需要的所有资源，然后会创建CompilerInvocation对象，该对象用来保存各种启动编译需要的各种必要信息，包括各种模块的option，文件包含目录，标志位，参数解析等  

7、调用ExecuteCompilerInvocation, 并执行CompilerInstance->ExecuteAction, 会根据传入的action类型来选择不同的处理流程。  

8、在ExecuteAciton中首先会校验各种传入参数、检查前置状态是否完成设置，然后调用Act->Execute，Execute函数是虚函数，会根据action对象的不同进入不同的处理函数，如PreprocessorFrontendAction只需要做预处理即可，CodeGenAction则需要一直执行到IR的生成  。

9、对于本项目来说，只需要执行到IR的生成阶段即可，Execute向下执行会最终进入到关键函数ParseAST中, ParseAST完成前端的词法、语法、语义、抽象语法树生成等工作

综上所述clang driver的执行流程包括两趟，第一趟任务主要目的是解析各种输入的参数，初始化各种状态，并且将用户预期的操作抽象出action,并封装成Job，最终组成一个compilation对象，然后启动新的进程进行执行。  
第二趟任务进入真正的clang前端处理流程ExecuteCC1Tool，创建必要的对象并拿到第一趟封装的action，并进入相关的执行流程 。

**driver下的调试命令**  
使用driver编译OpenCL kernel时，需要加上一些必要的参数，如下所示，其中-c表示只执行编译，不链接，-x表示要编译的语言，-Xclang后面接要传入的参数， -finclude-default-header表示自动包含必要的头文件，否则内建函数会显示无定义。  
输出llvm IR：  
clang -c -target spir -x cl -emit-llvm -cl-std=CL2.0 -Xclang -finclude-default-header input.cl  
输出AST：  
clang -c -x cl -cl-std=CL2.0 -Xclang -ast-dump -Xclang -finclude-default-header input.cl 

#### 3.2.2.2 clang lib模式
该模式下直接包含clang的头文件，并链接相关的实现库，通过直接调用内部接口的方式实现对源码的预处理、词法分析、语法分析、语义分析、IR生成。链接clang库时，给前端输入的各种参数不像上一个方式有很多的解析流程，复杂的是确认不同的编译目标下的必要参数，然后从创建CompilerInstance开始，后续步骤会模仿driver层的实现，并根据要编译的语言和输出目标进行流程的精简和不相关代码的裁剪。

### 3.2.3 核心数据结构
注：由于LLVM中的类结构十分庞大，故所绘制的类图均只包含了感兴趣的成员和一些关键对象，详细的类结构代码需要参照源码
#### 3.2.3.1 CompilerInstance
CompilerInstance对象为编译器实例对象，管理着整个编译过程中需要用到的所有资源，在应用层通常new一个CompilerInstance对象，类图如下所示。
<center> <img src="./img/compilerInstance.svg"></center>

下面代码为该对象的构造函数，其中两个输入参数默认输入的都是空指针，构造函数主要任务就是分配了一个CompilerInvocation对象，其他重要的数据结构都是单独构造然后再和CompilerInstance对象关联起来的
```c++
CompilerInstance::CompilerInstance(
    std::shared_ptr<PCHContainerOperations> PCHContainerOps,
    MemoryBufferCache *SharedPCMCache)
    : ModuleLoader(/* BuildingModule = */ SharedPCMCache),
      Invocation(new CompilerInvocation()),
      PCMCache(SharedPCMCache ? SharedPCMCache : new MemoryBufferCache),
      ThePCHContainerOperations(std::move(PCHContainerOps)) {
  // Don't allow this to invalidate buffers in use by others.
  if (SharedPCMCache)
    getPCMCache().finalizeCurrentBuffers();
}
```
#### 3.2.3.2 CompilerInvocation
CompilerInvocation对象主要是维护编译过程中需要用的的各种option，在创建CompilerInstance实例时会初始化一个CompilerInvocation对象，该对象主要管理以下一些信息：  

**AnalyzerOptionsRef**  
管理一些代码分析过程中的选项，例如是否要忽略死代码，是否要对控制流图进行优化，是否要打印分析的函数、代码块等基本信息，是否把函数看做内联形式等。会影响编译器在对代码进行解析时的一些行为  

**CodeGenOptions**  
管理IR生成时的一些选项，如main函数所在的文件，需要链接的外部符号，多线程模型、输出的LLVM IR的形式、依赖库、链接选项等  

**DependencyOutputOptions**  
管理编译过程中的一些依赖信息，如头文件、目标平台依赖、系统标准库依赖以及一些以module形式存在的外部依赖  

**FrontendOptions**  
管理前端一些行为，如打印一些基本信息（如性能分析数据、各种符号表的dump开关、时间戳等），前端分析的输入输出文件  

**PreprocessorOutputOptions**  
管理预处理输出选项，如是否在输出中显示注释，#line等标识，是否打印包含的所有头文件，是否重写  import关键字等  

CompilerInvocation有一个重要的方法setLangDefaults，该方法会告知clang前端即将编译的语言类型，以及目标特征，编译的语言版本等，对于OpenCL来讲，语言类型是OpenCL，标准是3.0，类图如下所示  
<center><img src="./img/CompilerInvocation.svg"></center>

#### 3.2.3.3 FrontAction
clang用一个抽象基类FrontAction来表示前端的操作，如前面调用的CompilerInstance::ExecuteAction输入的对象就是FrontAction派生类，Action本身并没有执行什么特殊的操作，只是作为一种结构上的封装提供用户进入clang核心模块调用的入口，其中ExcuteAction是一个重要的虚函数，在不同的派生类都是通过这个方法来开启不同的操作。以下类图为在OpenCL编译过程中用到的一些Action操作，在生成LLVM IR的过程中主要是通过CodeGenAciton来与内部的实际编译动作关联起来。  
<center><img src="./img/FrontendAction.svg"></center>

#### 3.3.3.4 Diagnostics
DiagnosticsEngine是clang中用来维护调试信息的对象，在创建CompilerInstance时并不会创建DiagnosticsEngine，需要手动的创建DiagnosticsEngine，并调用compilerInstance的createDiagnostics方法将其于compilerInstance对象关联起来  

诊断引擎对象中的成员很多，其中有几个关键的对象：  
DiagnosticIDs       诊断引擎的ID，用以区分不同的诊断引擎对象  
DiagnosticOptions     诊断引擎的各种选项，包括诊断等级，如何处理warning等基本设置  
DiagnosticConsumer  诊断引擎的consumer，这是一个抽象基类，前端需要继承该类进行相关成员的实现，其主要功能是将诊断引擎中保存的信息存储，并以预期的格式进行输出  
在DiagnosticConsumer类中，有两个重要的方法  
BeginSourceFile(）标识对source file开始解析  
EndSourceFile() 标识结束对source file的解析  

相关的重要类图如下所示，用户操作频率最高的是DiagnosticsEngine和DiagnosticConsumer，一个是用来管理整个编译过程中所有和诊断相关的资源，一个是用来解析诊断引擎中储存的信息并以合适的格式输出出来，而用户需要输出哪些信息，以及以什么样的格式输出，则需要通过DiagnosticOptions类来传递相应的诊断参数。  
<center><img src="./img/DiagnosticConsumer%201.svg"></center>

#### 3.3.3.5 SourceManager
SourceManager是LLVM中对文件管理的最上层对象，通常都会在编译准备阶段创建该对象，并将要编译的源码写入到该对象中，SourceManager会和诊断引擎自动关联，为诊断引擎提供文件的位置，名字等信息，另外会在编译阶段提供对文件的操作方法。如下图所示为该类的关键成员和主要功能。 
<center><img src="./img/SourceManager.svg"></center>

### 3.2.4 clang AST
#### 3.2.4.1 AST的基本结构
首先用OpenCL的程序来展示下clang中语法树的结构，如下所示为要编译的OpenCL kernel
```c++
__kernel void add_kernel(global int *a, global int *b,global int *c)
{
    int i = get_global_id(0);
    c[i] = a[i] + b[i];
}
```
使用下面命令dump其语法树结构：
```shell
clang -c -target spir -x cl -cl-std=CL2.0 -Xclang -ast-dump -Xclang -finclude-default-header input.cl
```
语法树结构如下所示：
```assembly
TranslationUnitDecl 0x55ff6668d008 <<invalid sloc>> <invalid sloc>
|-TypedefDecl 0x55ff666aa1e8 <<invalid sloc>> <invalid sloc> implicit __NSConstantString 'struct __NSConstantString_tag'
| `-RecordType 0x55ff6668dfc0 'struct __NSConstantString_tag'
|   `-Record 0x55ff6668df48 '__NSConstantString_tag'
|-TypedefDecl 0x55ff666aa248 <<invalid sloc>> <invalid sloc> implicit referenced sampler_t 'sampler_t'
| `-BuiltinType 0x55ff6668dca0 'sampler_t'
|-TypedefDecl 0x55ff666aa2a8 <<invalid sloc>> <invalid sloc> implicit referenced event_t 'event_t'
| `-BuiltinType 0x55ff6668dcc0 'event_t'
...
...
-FunctionDecl 0x55ff66d4ee28 <input.cl:1:1, line:5:1> line:1:15 add_kernel 'void (__global int *, __global int *, __global int *)'
  |-ParmVarDecl 0x55ff66d4ec20 <col:26, col:38> col:38 used a '__global int *'
  |-ParmVarDecl 0x55ff66d4ec98 <col:41, col:53> col:53 used b '__global int *'
  |-ParmVarDecl 0x55ff66d4ed10 <col:55, col:67> col:67 used c '__global int *'
  |-CompoundStmt 0x55ff66d4f2d0 <line:2:1, line:5:1>
  | |-DeclStmt 0x55ff66d4f098 <line:3:5, col:29>
  | | `-VarDecl 0x55ff66d4ef30 <col:5, col:28> col:9 used i 'int' cinit
  | |   `-ImplicitCastExpr 0x55ff66d4f080 <col:13, col:28> 'int' <IntegralCast>
  | |     `-CallExpr 0x55ff66d4f040 <col:13, col:28> 'size_t':'unsigned int'
  | |       |-ImplicitCastExpr 0x55ff66d4f028 <col:13> 'size_t (*)(uint)' <FunctionToPointerDecay>
  | |       | `-DeclRefExpr 0x55ff66d4ef90 <col:13> 'size_t (uint)' Function 0x55ff6685b330 'get_global_id' 'size_t (uint)'
  | |       `-ImplicitCastExpr 0x55ff66d4f068 <col:27> 'uint':'unsigned int' <IntegralCast>
  | |         `-IntegerLiteral 0x55ff66d4efb0 <col:27> 'int' 0
  | `-BinaryOperator 0x55ff66d4f2b0 <line:4:5, col:22> 'int' '='
  |   |-ArraySubscriptExpr 0x55ff66d4f120 <col:5, col:8> '__global int' lvalue
  |   | |-ImplicitCastExpr 0x55ff66d4f0f0 <col:5> '__global int *' <LValueToRValue>
  |   | | `-DeclRefExpr 0x55ff66d4f0b0 <col:5> '__global int *' lvalue ParmVar 0x55ff66d4ed10 'c' '__global int *'
  |   | `-ImplicitCastExpr 0x55ff66d4f108 <col:7> 'int' <LValueToRValue>
  |   |   `-DeclRefExpr 0x55ff66d4f0d0 <col:7> 'int' lvalue Var 0x55ff66d4ef30 'i' 'int'
  |   `-BinaryOperator 0x55ff66d4f290 <col:12, col:22> 'int' '+'
  |     |-ImplicitCastExpr 0x55ff66d4f260 <col:12, col:15> 'int' <LValueToRValue>
  |     | `-ArraySubscriptExpr 0x55ff66d4f1b0 <col:12, col:15> '__global int' lvalue
  |     |   |-ImplicitCastExpr 0x55ff66d4f180 <col:12> '__global int *' <LValueToRValue>
  |     |   | `-DeclRefExpr 0x55ff66d4f140 <col:12> '__global int *' lvalue ParmVar 0x55ff66d4ec20 'a' '__global int *'
  |     |   `-ImplicitCastExpr 0x55ff66d4f198 <col:14> 'int' <LValueToRValue>
  |     |     `-DeclRefExpr 0x55ff66d4f160 <col:14> 'int' lvalue Var 0x55ff66d4ef30 'i' 'int'
  |     `-ImplicitCastExpr 0x55ff66d4f278 <col:19, col:22> 'int' <LValueToRValue>
  |       `-ArraySubscriptExpr 0x55ff66d4f240 <col:19, col:22> '__global int' lvalue
  |         |-ImplicitCastExpr 0x55ff66d4f210 <col:19> '__global int *' <LValueToRValue>
  |         | `-DeclRefExpr 0x55ff66d4f1d0 <col:19> '__global int *' lvalue ParmVar 0x55ff66d4ec98 'b' '__global int *'
  |         `-ImplicitCastExpr 0x55ff66d4f228 <col:21> 'int' <LValueToRValue>
  |           `-DeclRefExpr 0x55ff66d4f1f0 <col:21> 'int' lvalue Var 0x55ff66d4ef30 'i' 'int'
  `-OpenCLKernelAttr 0x55ff66d4eed8 <line:1:1>
```

从上可以看出，每一行包括AST node的类型，行号、列号以及类型的信息。最顶部一般是TranslationUnitDecl，一个Cpp文件以及那些#include包括的文件称为翻译单元（TranslaitonUnit）， 在上述代码中，FunctionDecl之前的语法树都是解析OpenCL头文件得来的，大多是一些typedef的声明，FunctionDecl表示的是kernel函数add_kernel，里面又嵌套函数参数（ParmVarDecl）、定义语句（DeclStmt）、变量声明（VarDecl)等结构。    

clang的AST和其他编译器的AST不同，例如LJMICRO的语法树有一个共同的node节点，其他node节点都是在这个父节点上继承而来，但clang的AST没有共同的节点，取而代之的是三个重要的基类，主要是分为Decl、Stmt、Type,其中Decl表示声明，如函数声明、变量声明、结构声明等都是基于Decl类继承而来，Stmt表示语句，语句中又有声明语句、实现语句、返回语句等，Type用来管理数据类型，包括标准数据类型和自定义的数据类型。另外有些特别的类不由这三种基类继承而来，如CXXBaseSpecifier单独用来表示C++中的基类。  

一个翻译单元生成的语法树的所有信息都保存在ASTContext对象中。ASTContext中有一个重要的成员函数getTranslationUnitDecl，获取TranslationUnitDecl（其父类是Decl，DeclContext），这是AST树的顶层（top level）结构，可以通过其decls_begin()/decls_end()遍历其保存的nodes。  

AST树的本地化存储和读入借助ASTWriter和ASTReader，Clang还提供了一些高层次的类ASTUnit，将AST树保存为二进制文件，也可以加载AST文件构建ASTContext。
```c++
 ASTUnit::LoadFromASTFile("input.ast",Diags,opts);
```
AST基类和派生的子类有一个关键的回调函数HandleTranslationUnit，该函数会在处理完一个翻译单元后每调用，不同的子类完成的任务不一样，其实现也不同，如ASTPrinter类，负责打印输出AST节点信息，其HandleTranslationUnit函数的功能是获取当前翻译单元声明，遍历并打印  
```c++
void HandleTranslationUnit(ASTContext &Context) override {
      TranslationUnitDecl *D = Context.getTranslationUnitDecl();
      if (FilterString.empty())
        return print(D);
      TraverseDecl(D);
    }
```
#### 3.2.4.2 AST的生成
AST的生成发生在clang::ParseAST函数中，其函数流程图如下所示： 

<center> <img src="./img/ParseAST.svg"></center>

从图中可以看出，词法分析、语法分析和语义分析都开始于Parser类，在编译过程中首先创建Parser类，检查其中的词法分析器、语法分析器、以及语义分析相关设置是否完备，然后进行初始化操作，在初始化的时候Parser会读入源码的第一个字符并进行解析，然后以是否到达文件末尾作为判断条件对整个源码文件进行完整解析并生成相应的抽象语法树，然后会调用HandleTranslationUnit回调函数，这个函数是用户自定义，用来在解析完一个翻译单元的时候执行相同的处理。  
##### 预处理
预处理操作依赖PreProcessor类，其核心成员如下图所示： 
<center> <img src="./img/preprocessor.svg"></center>

在clang中，预处理操作并未和词法分析彻底分开，在解析开始时，会根据token的种类来进入不同的处理分支，如token是#define,\#if 等需要进行预处理的语句会进入相应的预处理分支，对#关键字符的处理是通过方法HandleDirective来完成的，在Parser结构体中有一系列关于预处理操作相关的函数，如：
```c++
HandlePragmaUnused
HandlePragmaAttribute
HandlePragmaRedefineExtname
HandlePragmaOpenCLExtension
```
这些处理函数会分析各种宏定义、#开头的声明语句并进行相应的处理。
##### 词法分析
词法分析依赖Lexer类，其核心成员如下图所示：
<center><img src="./img/Lexer.svg"></center>

Lexer的三种特殊模式:  
raw mode:  该模式主要用于处理#if 0的代码块，在该模式下lexer会停止扫描符号，不处理任何事情，直到#if 0 代码块结束  
parsingFilename mode: 该模式主要用于处理#include的头文件，能够正确识别<符号  
ParsingPreprocessorDirective mode: 该模式主要用于处理#开头的语句 

词法分析发生在函数PreProcesser::Lex，最终调用到Lexer::Lex，Lexer::LexTokenInternal，对具体的字符进行分析，当处理到一些特殊字符如#，编译器会预取后面的字符判断是否是在include第三方文件，若是在include，会更新SouceLocation, SourceManager等信息，并进入新的文件从头开始解析，重复最开始的Lex操作。  

解析关键字时是通过查找IdentifierTable的内容进行匹配的，关键字的定义通过文件TokenKinds.def来维护要编译语言的关键字，比如以下代码：  
```assembly
KEYWORD(extern                      , KEYALL)
KEYWORD(float                       , KEYALL)
KEYWORD(for                         , KEYALL)
KEYWORD(goto                        , KEYALL)
KEYWORD(if                          , KEYALL)
KEYWORD(int                         , KEYALL)
KEYWORD(long                        , KEYALL)
...
```
要匹配一个完整的token，词法解析器会从开始的字符读到空格或者括号前的字符，并用FormTokenWithChars方法来更新整个token的长度，类型。
##### 语法分析
语法分析依赖Parser类来完成，其核心成员如下图所示：  
<center><img src="./img/Parser.svg"></center>

语法分析通过调用Parser的成员函数来实现，会完成了一个TopLevelDecl的词法分析后会进行调用，根据要分析语句的特征有一系列的解析函数，如：
```c++
ParseDeclarationOrFunctionDefinition
ParseExternalDeclaration
ParseLexedAttribute
ParseCXXInlineMethodDef
```
通过名字可以较为容易的知道其调用的场景，如解析声明、成员变量、内联方法等。
##### 语义分析
语义分析依赖Sema类来完成，其核心成员函数如下图所示：
<center><img src="./img/Sema.svg"></center>
常规的编译器语义分析是在完成所有的语法分析之后再进行分析，clang的做法不同，在生成AST节点的同时执行类型检查。语义分析的操作通过Parser类中的Actions成员提供的回调函数进行，在每一个语句完成语法分析后会根据语句的类型执行对应的action来进行语义分析。

##### 代码生成
在进行组合的解析和语义分析之后，ParseAST函数调用HandleTranslationUnit方法，这个回调函数由ASTConsumer来进行最终实现，在本项目中前端action为CodeGenAction,那么客户端就是BackendConusmer，客户端将遍历AST，同时生成LLVM IR代码，该代码能实现与树中所表示的代码完全相同的行为，具体的代码生成发生在CodeGenModule::EmitTopLevelDecl函数中，该函数为每个语法树节点生成中间代码。
#### 3.2.4.3 AST的遍历
遍历是通过RecursiveASTVisitor模板类来完成的，RecursiveASTVisitor按照深度优先的模式从最顶部一般是TranslationUnitDecl开始对语法树的每个节点进行遍历，可以以前序或者后序的方式进行遍历
该模板类主要实现三个任务  
1、遍历整个AST，通过Traverse\*()方法来完成，它是整个遍历过程中的入口函数  
2、对每个node节点，通过WalkUpFrom\*()方法来完成类的等级遍历，对于派生类，遍历时需要先遍历其父类，然后遍历派生类  
3、对给定的node节点，通过Visit\*()方法来执行真正的节点遍历  

其中上述三种方法都不是特指某一个方法，而是一个方法组，如Traverse\*包括TraverseDecl、TraverseStmt以及TranverseType等，WalkUpFrom和Visit方法同理，三种方法存在调用关系，最上层是Traverse，实现在不同node间的移动，中间是WalkUpFrom，对node的基础结构进行解析，存在父类需要先遍历父类，最底层是Visit方法，主要是对某一个实际的node进行遍历解析。
#### 3.2.4.4 AST序列化
可以讲clang AST序列化并保存在以PCH为扩展名的文件中，可以避免重复处理不同项目源文件中的相同头文件，从而加快编译速度，当选择使用PCH文件时，所有头文件都预编译为单个PCH文件，并且在编译一个翻译单元时，预编译头文件中的信息会被惰性获取(只用在用到时才获取)。
#### 3.2.4.5 ASTConsumer
ASTConsumer是一个抽象基类，功能是用来访问AST，可以将AST的生成和访问进行隔离  
基于该抽象类继承的子类主要有：  
BackendConsumer  
SemaConsumer  
AnalysisConsumer  
ModleConsumer  
...  
在进行每一个TopLevelDecl的解析后，都会调用Consumer中的方法，用来访问AST，不同的Consumer要实现的功能并不一致。  

## 3.3 LLVM后端
### 3.3.1 LLVM后端基本流程
LLVM后端有一组代码生成分析器和变换流程（pass)组成，这些流程将LLVM IR转换为目标代码或者汇编代码。从LLVM IR开始后端的处理流程如下图所示  
<center><img src="./img/llvm%20backend%20pipeline%201.svg"></center>

整个后端总共使用了四个不同层次的指令，分别是LLVM IR、SelectionDAG、MachineInstr和MCInst，下面围绕指令不同层次的变换来介绍各个变换过程  

1、 LLVM IR转换为 SelectionDAG  

该过程包含两个子过程，一个是LLVM IR转换为SelectionDAG，另一个过程是SelectionDAG的正规化和优化。  

首先，SelectionDAGBuilder遍历LLVM IR中的每一个function以及function中的每一个basic block，将其中的指令转成SDNode，整个function或basic block转成SelectionDAG。将IR转化为DAG很重要，因为这可以让代码生成器使用基于树的模式匹配指令选择算法。此时的SelectionDAG还与目标设备无关，但对于具体目标设备来说，有些指令可能不合法，因为不同目标设备支持的指令集不同，指令集中的指令与IR指令可能没有对应关系。例如，x86不支持sdiv而支持sdivrem。DAG中的每个节点SDNode会维护一个记录，其中记录了本节点对其它节点的各种依赖关系，这些依赖关系可能是数据依赖（本节点使用了被其它节点定义的值），也可能是控制流依赖（本节点的指令必须在其它节点的指令执行后才能执行，或称为chain）。这种依赖关系通过SDValue对象表示，对象中封装了指向关联节点的指针和被影响结果的序列号。  

其次，需要对SelectionDAG进行指令的合法化，做合法化的原因是SelectionDAGBuilder构造的SDNode中的指令操作数类型和操作不一定能被目标平台支持。目标平台一般不可能为所有支持的数据提供IR中所具有的全部指令，x86上没有 条件赋值（conditional moves） 指令，PowerPC也不支持从一个16-bit的内存上以符号扩展的方式读取整数。因此合法化 阶段要将这些不支持的指令按三种方式转换成平台支持的操作，主要有三种实现方式： 扩展(Expansion)，用一组操作来模拟一条操作； 提升(promotion) 将数据转换成更大的类型来支持操作；定制(Custom)，通过目标平台相关的Hook实现合法化。目标平台相关的信息通过TargetLowering接口传递给SelectionDAG。目标设备会实现这个接口以描述如何将LLVM IR指令用合法的SelectionDAG操作实现。  

2 、SelectionDAG转换为MachineInstr  

在DAG中，不存在相互依赖关系的指令间的执行顺序是不确定的，所以还需要通过指令调度将DAG转换为三地址指令形式，此时的指令调度发生在寄存器分配前，称之为前寄存器分配调度，其主要功能是在尽可能多地优化指令级并行度的同时对指令进行排序，指令调度器有三种类型：list scheduling algo, fast algo, vliew.  

3、MachineInstr转换为MCInst  

该转换过程包括三个子过程，分别是寄存器分配、后寄存器分配调度、代码输出
寄存器分配是将虚拟寄存器映射成特定于目标的有限寄存器集，在llvm IR的表示中，是假定有一组无限多的寄存器，这个阶段是将虚拟的无限寄存器和有限寄存器集进行转换，在寄存器资源不够的时候可能需要将寄存器spill到主存或者其他存储区域。映射分为直接映射和间接映射，直接映射利用TargetRegisterInfo和MachineOperand类获取load/store指令插入位置，以及从内容去除和存入的值。间接映射利用VirtRegMap类处理load/store指令。寄存器分配算法有4种：Basic Register Allocator、Fast Register Allocator、PBQP Register Allocato、Greedy Register Allocator。

后寄存器分配调度作用于MachineInstr，由于此时的寄存器信息都是实际的物理寄存器，可以根据寄存器资源的竞争关系和不同寄存器的访存延迟差异性进一步提升生成的代码质量。
代码输出阶段主要是将优化后的MachineInstr转换为MCinst， MCInst相比于MachineInstr是一种更适和用于汇编器和连接器的组织结构。

### 3.3.2 自定义后端实现
实现基于LLVM的后端，除开对LLVM框架的传统实现流程的调用外，另外还需要根据自定义目标机器特性主要实现以下一些定义：  

1、定义寄存器和寄存器集合  
在llvm中是以.td文件来定义寄存器和寄存器集合的，然后通过tablegen工具将.td文件转换为.inc文件，这些文件在cpp文件中用#include声明引入，从而使用其中定义的寄存器  

2、定义调用约定  
调用约定指的是指如何传递给函数以及如何从函数返回，主要是参数传递约定和返回值传递约定，其中参数传递约定定义参数是通过栈还是寄存器进行传递以及通过哪个寄存器传递，返回值传递约定定义返回值会如何传递以及通过哪个寄存器传递。 

3、定义指令集  
指令目标描述文件定义了3样内容：操作数、汇编字符串、指令格式。具体包括定义或输出列表，以及使用或输入列表。其中也有不同的操作类，如Register类、立即数，以及更复杂的register+imm操作数  

4、实现栈帧lowering  
在源码中的函数调用时，栈帧的实现和lowering操作  

5、实现指令选择  
定义DAG指令和特定目标机器指令的转换方式

### 3.3.3 LLVM IR优化
在LLVM中对IR的优化都是通过pass类来实现，LLVM将IR分解为不同的处理对象，并将其处理过程实现为单独的pass类型。在编译器初始化时，pass被实例化，并被添加到pass管理器中。pass管理器以流水线的方式将各个独立的pass衔接起来，然后以预定义顺序遍历每个pass，根据pass实例返回值启动、停止或重复运行不同pass。LLVM pass管理机制的主要模块包括pass、pass管理器、pass注册及相关模块，如PassRegistry、AnalysisUsage、AnalysisResolver等。  

#### 3.3.3.1 LLVM Pass及常用子类  
pass是一种编译器开发的结构化技术，用于完成编译对象（如IR）的转换、分析或优化等功能。pass的执行就是编译器对编译对象进行转换、分析和优化的过程，pass构建了这些过程所需要的分析结果。
LLVM Pass是LLVM系统的重要组成部分，定义在llvm\include\llvm\Pass.h中：  
```c++
class Pass {
  AnalysisResolver *Resolver = nullptr;  // Used to resolve analysis
  const void *PassID;
  PassKind Kind;
public:
  explicit Pass(PassKind K, char &pid) : PassID(&pid), Kind(K) {}
  Pass(const Pass &) = delete;
  Pass &operator=(const Pass &) = delete;
  virtual ~Pass();
……
}
```
LLVM提供的pass分为三类:Analysis pass、Transform pass和Utility pass。Analysis pass计算相关IR单元的高层信息，但不对其进行修改。这些信息可以被其他pass使用，或用于调试和程序可视化。简言之，Analysis pass提供其它pass需要查询的信息并提供查询接口。例如，basic-aa pass是基本别名分析（Basic Alias Analysis）pass，得到的别名分析结果可以用于后续的其它优化pass。Analysis pass不仅从IR中得到有用信息，还可以通过调用其它Analysis pass得到信息，并将这些信息结合起来，得到关于IR更有价值的信息。这些分析结果可以被缓存下来，直到分析的IR被修改，原有的分析结果当然也就失效了。  

Transform pass可以使用Analysis pass。Transform pass会检视IR，查询Analysis pass得到IR的高层信息，然后以某种方式改变和优化IR，并保证改变后的IR仍然合法有效。例如，adce pass是激进的死代码消除（Aggressive Dead Code Elimination）pass，会将死代码从原来的模块中删除。  

Utility pass是一些功能性的实用程序，既不属于Analysis pass，也不属于Transform pass。例如，extract-blocks pass将basic block从模块中提取出来供bugpoint使用，这个utility pass既不属于Analysis pass，也不属于Transform pass。当调用RegisterPass()注册自定义pass时，会要求指定是否为Analysis pass。通过RegisterPass()注册自定义pass后，就可以使用LLVM opt工具对IR调用自定义pass功能。  

LLVM Pass的基础模块是Pass类，这是所有pass的基类。自定义的pass类都要从预定义子类中继承，并根据自定义pass的具体功能要求覆写虚函数或增加新的功能函数。预定义子类包括ModulePass、CallGraphSCCPass、FunctionPass、LoopPass和RegionPass类等等。不同的子类有不同的约束条件，这些约束条件在调度pass时会用到。设计自定义pass时的首要任务就是确定自定义pass的基类。在为pass选择基类时，应在满足要求的前提下，尽可能选择最相关的类。这些类会为LLVM Pass基础结构提供优化运行所必需的信息，避免生成的编译器因为选择的基类不合适而导致运行速度变慢。  

各种pass组合在一起，完成各种IR优化任务。Pass之间的组合可以分为两类：一、多个pass作用于同一个IR单元，function pass是一个典型例子。如下图A所示，Function pass作用于一个function IR，但也可以在某个function pass中运行其它几个function pass，将这几个function pass组合起来作用于同一个IR单元，获得更好的优化效果。二、将一个IR单元分解为更小的单元，并用相应类型的pass处理。如下图B所示，module pass作用于module，但也可以在某个module pass中运行function pass，作用于module中的每一个function，这就将一个IR单元分解为粒度更细的单元来处理。在编译器开发时，可以混合使用两种方式，将各种pass组合为流水线，对IR做不同处理和优化。  

<center><img src="./img/PASS结构图.svg"></center>

LLVM Pass类及其子类如下图所示：  

<center><img src="./img/PASS种类.svg"></center>

 **MoudulePass**  
ModulePass类用于实现非结构化的过程间优化和分析，几乎可以对程序执行任何操作。因此，ModulePass类可能是所有Pass类中最常用的类​​。由ModulePass派生的自定义pass将整个程序作为一个处理单元，可以对其中任何函数体做删改

**CallGraphSCCPass**  
CallGraphSCCPass用于在调用图（call graph）上从下至上的遍历程序。为了理解CallGraphSCCPass，首先要了解两个概念：调用图和SCC。  

调用图表示程序方法间的关系，其中的节点表示程序方法，其中的边表示从调用方法和被调方法的调用关系。调用图中是否有环，取决于代码中是否存在直接或间接递归调用。如果程序中有递归调用，那么定向调用图中也就包含环。实际上，LLVM中没有模块表示调用图，pass通过分析call指令来计算调用图，从IR中的call指令推断出调用图。  

SCC全称strongly connected component, 即强连接分量。要理解SCC，需要从理解什么是连通。如果从图中的节点a到节点b之间存在一条路径，则称a和b是连通的。如果无向图中任意两个节点均连通，则该图称为连通图。对于非连通图，其中可能仍然有部分子图属于连通图，这种连通子图称为连通分量。连通分量的顶点数达到极大，意味着新增加任何顶点都可能使原连通分量不再连通。另外，连通分量的边数达到极大，意味着与子图中所有顶点相连的边都应包含在连通分量中。例如，下图A中的图是非连通图，但仍可分解为图B所示的两个连通分量。图C不能被称为连通分量，因为其中缺少顶点B和C之间的边。图D更不能被称为连通分量，因为其中缺少顶点A及其关联的边。  

<center><img src="./img/连通图1.svg", width="500"></center>

连通分量针对的是无向图，对于有向图则可分为强连通和弱连通两类。在有向图中，如果两个顶点间至少存在一条双向路径，则称两个顶点强连通（strongly connected）。如果有向图的任意两个顶点都强连通，称该图为强连通图。即，从图内任意一个顶点出发，存在通向图内任意一点的的一条路径。非强连通有向图的极大强连通子图，称为强连通分量。。例如下图A是一个非强连通有向图，可以分解为图B所示的两个强连通分量。图B中的A、B、C组成一个强连通图，其中的任意两个顶点都存在一条双向路径。但如果加上顶点D，就不再是一个强连通图。顶点D是一个单独的强连通分量。将非强连通有向图分解为强连通分量的目的是由于强连通分量内部的节点性质相同，因此可以将一个强连通分量内的顶点简化为一个点，即消除了环。例如，图A中顶点A、B、C构成的强连通分量可简化为顶点E。如此一来，原图A就变成了图C所示的有向无环图(directed acyclic graph，DAG)。  

<center><img src="./img/连通图2.svg",width="400"></center> 

强连通分量调用图（SCC call graph）是调用图的强连通分量图，在LLVM中称为CallGraphSCC。强连通分量调用图的某个顶点可以仅包含一个方法，也可以包含调用图中的多个顶点。通过将调用图的有环子图分解为强连通分量，强连通分量调用图将变为无环图，也就是变为有向无环图。  

CallGraphSCCPass构成了LLVM的过程间优化的重要组成部分。CallGraphSCCPass派生类在调用图的强连通分量上运行，并且提供了用于构建和遍历调用图的机制（即以后序方式遍历图），所以可以有效地对程序中的所有调用边进行成对的过程间优化，同时逐步细化并改善这些成对优化。  

自定义SCC pass只能检查和修改当前SCC中的函数，以及直接调用当前SCC的函数和直接被当前SCC调用的函数。如下图所示，自定义SCC pass不能修改和检查顶点B中的函数，除此之外的函数都可以检查和修改。所以，自定义SCC pass并不只属于SCC，而是属于所有SCC可能调用的方法，以及这些方法可能调用的所有方法。自定义SCC pass还属于可能调用SCC中的方法的所有方法。自定义SCC pass还需要保留当前的CallGraph对象，如果程序有任何修改，自定义SCC pass都应负责对CallGraph对象进行更新。自定义SCC pass可能会修改当前SCC的内容，但不允许在当前模块中添加或删除SCC。  

<center><img src="./img/连通图3.svg", widht="400"></center>

**FunctionPass**  
 与ModulePass子类相反，FunctionPass子类具有系统可以预期的局部行为。所有FunctionPass在程序中的每个方法上执行，独立于程序中的所有其它方法。 FunctionPass子类不需要以特定顺序执行，并且不会修改外部方法。明确地说，FunctionPass子类不允许检查或修改当前正在处理的方法以外的其它方法，也不允许添加或删除当前模块的方法和全局变量。AMDGPU后端中的AMDGPUPromoteAllocaToVector pass就是一个function pass。这个pass通过将Alloc指令转换为向量消除Alloc指令：  
 ```  c++
 class AMDGPUPromoteAllocaToVector : public FunctionPass {
……
  bool runOnFunction(Function &F) override;
……
  bool handleAlloca(AllocaInst &I);
 
  void getAnalysisUsage(AnalysisUsage &AU) const override {
    AU.setPreservesCFG();
    FunctionPass::getAnalysisUsage(AU);
  }
};
 ```
**LoopPass**  
所有LoopPass在函数中的每个循环上执行，与函数中的所有其它循环无关。 LoopPass以循环嵌套顺序处理循环，最外层循环最后处理。LoopPass不仅仅是作用在IR中的某个loop结构，而是有可能（有时是必须）修改包含loop结构的外层结构（如包含该loop的函数），或将loop内部的指令移到loop外。类似的修改可能影响相邻的其它模块，从这个意义上说，LoopPass有点像FunctionPass。  

LoopPass子类可以使用LPPassManager接口更新循环嵌套。LoopPass子类需要重写三个虚函数来完成其工作。如果这些方法修改了程序，则应返回true；否则，应返回false。

作为主循环pass一部分运行的LoopPass子类，需要保存其它loop pass在pipeline中所需的所有函数分析pass（function analyses）。为了简化操作，LoopUtils.h提供了getLoopAnalysisUsage()函数。可以在LoopPass子类重写的getAnalysisUsage()函数中调用getLoopAnalysisUsage()函数，以获取正确的分析结果。INITIALIZE_PASS_DEPENDENCY(LoopPass)将初始化这组函数分析pass（function analyses）。  

**RegionPass**  
RegionPass较少使用，其用法与LoopPass有相似之处，不过是在函数中的每个单入口单出口region执行。 RegionPass由RGPassManager管理，以嵌套顺序处理region，最外层region放在最后处理。RegionPass子类可以通过使用RGPassManager接口更新region树。编译器开发者可以重写RegionPass的三个虚函数来实现自定义RegionPass。如果方法修改了程序，则返回true；否则，返回false。

#### 3.3.3.2 Pass管理器（Pass Manager)
Pass管理器用于注册、调度pass，并维护pass之间的依赖关系。Pass管理器会维护一个pass序列，Pass管理器负责维护和优化这些pass的执行，保证先行（prerequisite）pass正确设置。pass序列中的每一个pass在特定IR单元上依次运行。当前pass可以指定自己对其它pass的依赖性，也就是说，被依赖pass需要在当前pass之前运行。另外，当前pass可以指定将由于执行当前pass而失效的pass。 LLVM中的PassManager类可确保在运行pass之前获得所需的分析结果，并确保在编译过程结束并销毁PassManager时一并销毁pass。因此，PassManager类是pass流水线结构的最主要和最基本的构建模块。

PassManager类的pass流水线嵌套结构和IR单元的嵌套结构对应。IR中的Module IR有ModulePassManager与之对应，CGSCC(Call Graph Strongly Connected Component) IR有SCCPassManager，Function IR有FunctionPassManager等等。各种类型的PassManager通过其内部更小的流水线结构遍历对应的IR单元，如此这般才确定了所有pass的执行顺序。PassManager内部实际上是通过依赖图组织pass，开发者不需要了解依赖图如何实现，因为LLVM API使开发者可以在编译过程的不同阶段注册和添加任何pass，比如，只需要通过PassManager的add()接口就可以向PassManager添加pass。IR单元和PassManager类型的对应关系如下图所示： 

<center><img src="./img/PASS%20manager.svg"></center>

LLVM中有两类Pass管理器：Legacy Pass Manager和New Pass Manager。Legacy Pass Manager包含两个层次的类。llvm::Pass和 llvm::legacy::PassManagerBase。  

PassManager类高效调度和运行pass。所有运行pass的LLVM工具都使用PassManager来执行这些pass。 PassManager的责任是确保正确完成pass之间的交互。而当PassManager要以更优化的方式执行pass时，PassManager就必须维护有关pass之间如何交互以及pass之间依赖关系的信息。

PassManager通过两种方式减少pass序列的执行时间：第一，pass之间共享分析结果。PassManager的主要任务之一避免是重复计算分析结果，这就需要PassManager跟踪维护哪些分析可用、哪些分析失效以及哪些分析是必需的。 PassManager跟踪分析结果的生命周期，并在不再需要某些分析结果时，释放这部分分析结果占用的内存，从而实现最优内存使用。第二，PassManager将pass连接起来，以pipeline的方式执行，可以获得更好的内存和缓存结果，从而改善了编译器的缓存行为。例如，当给出一系列连续的FunctionPass时，PassManager将在第一个函数上执行所有FunctionPass，然后在第二个函数上执行所有FunctionPass，依此类推。这种处理方式可改善缓存行为，因为这样一次只会处理LLVM IR的一个函数，而不是处理整个程序，减少了编译器的内存消耗。 

LLVM中添加pass的方式非常灵活。AMDGPU后端是基于llvm::TargetPassConfig类派生AMDGPUPassConfig类，并通过重写其中的虚函数，如addIRPasses()、addCodeGenPrepare()、addInstSelector()等，在代码生成过程中的不同阶段（如如在寄存器分配之前、之后或在汇编代码生成之前）向AMDGPU后端目标添加pass，并应用自定义优化。以下是AMDGPU后端实现addIRPasses()的示例代码： 
```c++
void AMDGPUPassConfig::addIRPasses() {
…...
  addPass(createAMDGPUPrintfRuntimeBinding());
 
  addPass(createAMDGPUFixFunctionBitcastsPass());
 
  addPass(createAMDGPUPropagateAttributesEarlyPass(&TM));
 
  addPass(createAtomicExpandPass());
…..
  if (TM.getTargetTriple().getArch() == Triple::amdgcn) {
    addPass(createAMDGPUCodeGenPreparePass());
  }
……
}
```

# 4. 当前实现的OpenCL前端demo代码
在综合分析mesa clover和clang driver前端的实现方式和流程后，实现了一个部分功能的demo程序，可以根据输入的kernel源码输出LLVM IR，再用工具将其转换为SPIR-V格式。

部分核心代码实现如下：  
初始化目标机器，测试平台上为AMD显卡，只初始化AMD相关信息，也可以全部初始化  
```c++
LLVMInitializeAMDGPUTargetInfo();
LLVMInitializeAMDGPUTarget();
LLVMInitializeAMDGPUTargetMC();
LLVMInitializeAMDGPUAsmPrinter();
LLVMInitializeAMDGPUAsmParser();
```
创建LLVM上下文，用来设置回调函数，并且作为clang compiler instance的上下文
```c++
std::unique_ptr<LLVMContext> ctx{ new LLVMContext };
```
创建编译器实例对象，该对象管理着所有编译相关的资源
```c++
std::unique_ptr<clang::CompilerInstance> c { new clang::CompilerInstance };
```
创建诊断引擎相关对象，用来输出编译调试信息
```c++
clang::TextDiagnosticBuffer *diag_buffer = new clang::TextDiagnosticBuffer;
clang::DiagnosticsEngine diag { new clang::DiagnosticIDs, new clang::DiagnosticOptions, diag_buffer };
```
创建CompilerInvocation对象，用以给实例对象提供编译参数和选项，其中input.cl是编译器前端要编译的源码文件名称，后续会将要编译的代码写入到该文件
```c++
const std::vector<const char *> copts = {"input.cl"};
clang::CompilerInvocation::CreateFromArgs(c->getInvocation(), copts.data(), copts.data()+copts.size(), diag)
```
刷新诊断引擎，会初始化相关成员对象
```c++
diag_buffer->FlushDiagnostics(diag);
```
设置编译目标对象，目标对象用triple来表示，是一个三元组，用来描述目标机器的架构，操作系统，厂商等基本信息，本demo要输出的目标代码时spirv格式，triple可以设置为spriv-Unknown-Unknown
```c++
c->getTargetOpts().Triple = "spirv-Unknown-Unknown";
```
设置一些调试选项，可以输出一些编译信息，例如ShwoStats选项可以打印出编译过程中分析了哪些对象，处理了多少文件，解析了多少函数等
```c++
c->getFrontendOpts().ShowStats = true;
```
设置要编译的语言信息，这样前端能选择合适的处理流程来对输入的语言进行处理
```c++
c->getInvocation().setLangDefaults(c->getLangOpts(),
                             clang::InputKind::OpenCL, ::llvm::Triple(triple),
                             c->getPreprocessorOpts(),  
                             clang::LangStandard::lang_unspecified);
```
将设置的诊断引擎和目标信息与CompilerInstance关联起来
```c++
 c->createDiagnostics(new clang::TextDiagnosticPrinter(
                              *new raw_string_ostream(r_log),
                              &c->getDiagnosticOpts(), true));
 c->setTarget(clang::TargetInfo::CreateTargetInfo(
                        c->getDiagnostics(), c->getInvocation().TargetOpts));
```
设置前端要执行的action种类，如EmitLLVMOnly可以输出可读形式的IR，EmitBCOnly可以输出bitcode形式的IR
```c++
c->getFrontendOpts().ProgramAction = clang::frontend::EmitLLVMOnly;
```
设置ResourceDir并包含OpenCL的头文件，这里是clang编译器会用到的一些头文件，包含着内部的一些宏定义，数据类型，不同平台上的字节对齐等，对于OpenCL来说，对一些扩展进行了处理
```c++
const std::string CLANG_RESOURCE_DIR("/usr/local/lib/clang/8.0.1/include");
c->getHeaderSearchOpts().ResourceDir = CLANG_RESOURCE_DIR;
c->getPreprocessorOpts().Includes.push_back("opencl-c.h");
```
设置OpenCL C版本
```c++
c->getPreprocessorOpts().addMacroDef("__OPENCL_VERSION__=120");
```
给输入文件填充数据,其中filename为设置的输出文件的名字，在此处为input.cl，source为要编译的kernel源码，为std::string类型
```c++
c->getPreprocessorOpts().addRemappedFile(
              filename, ::llvm::MemoryBuffer::getMemBuffer(source).release());
```
在完成准备工作后，启动action执行
```c++
clang::EmitLLVMAction act(ctx.get()); 
if (!c->ExecuteAction(act))
   throw build_error();
return;
```
执行后会输出一个input.ll文件，为可读形式的IR
代码层面上的IR信息保存在llvm::Module对象中，可以通过下述操作提取并进行解读，在本项目中需要将提取的IR进一步转换为SPIR-V格式，目前是使用工具实现，代码层面上还没有进行实现
```c++
auto mod = act.takeModule();
```
通过takeModule方法可以从action中提取Module信息，再调用LLVM-SPIRV-TRANSLATOR中的方法可以讲Module信息进行解读并转换为SPIR-V，当前这一步已有实现思路但还未完成代码实现。