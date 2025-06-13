## 前端关键过程

> 参考文档：https://getting-started-with-llvm-core-libraries-zh-cn.readthedocs.io/zh_CN/latest/ch04.html#

![_images/front_end_passes.png](https://getting-started-with-llvm-core-libraries-zh-cn.readthedocs.io/zh_CN/latest/_images/front_end_passes.png)

1. **词法分析（Lexical analysis）**

   <u>以源代码作为输入，负责将语言结构分解为一组单词和标记，去除注释、空白、制表符等</u>。

   每个单词或者标记必须属于语言子集，语言的保留字被变换为编译器内部表示。

   文件`include/clang/Basic/TokenKinds.def`定义了保留字。

2. **预处理（Preprocess）**

   负责展开宏，包含文件，根据各种以#开头的预处理器指示略去部分代码。

3. **语法分析（Syntacitic analysis）**

   <u>以标记流作为输入，负责解析输出语法树（AST）。</u>

   分组标记以形成表达式、语句、函数体等。同时检查一组标记是否有意义，考虑它们的物理布局，不关心你说了什么，只考虑句子是否正确。

4. **语义分析（Semantic analysis）**

   借助符号表检验代码没有违背语言类型系统。这个表存储标识符和它们各自的类型之间的映射，以及其它内容。与众不同的是，Clang并不在解析之后遍历AST。相反，它在AST节点生成过程中即时检查类型。



## Clang源码

> 参考文档：https://clang.llvm.org/docs/InternalsManual.html

### 主要相关库

- **LLVM Support库**：基础底层库，定义基本数据结构

- **Basic库**

  - 诊断系统
  -  `SourceLocation ` /  `SourceManager` 

- **Clang Driver库**

- **Lexer / Preprocessor库**

  对外主要暴露`Preprocessor`类，该类的核心方法为`Preprocessor::Lex`，该方法获取流中的下一个`Token`。

  `Token`具体分为两种形式：

  - normal tokens：由lexer生成
  - annotation tokens：由parser生成，包含语义信息，用于替换normal token

- **Parser库**

  通过`Preprocessor`读取`Token`，递归向下地进行语法分析，同阶段与`Sema`库进行交互，进行语义分析。

  `Parser`通过不直接访问AST节点，而是通过 `ExprResult`  /  `StmtResult`包装类进行访问。

- **AST库**：定义AST节点类

- **Sema库**：由Paser库调用，进行语义分析。生成AST

- **CodeGen库**：接收AST生成LLVM IR



## Clang Driver库架构

> 参考文档：https://clang.llvm.org/docs/DriverInternals.html
>
> The Clang driver is intended to be a production quality compiler driver providing access to the Clang compiler and tools, with a command line interface which is compatible with the gcc driver.

### 架构图

为用户使用Clang编译器以及相关工具提供命令行接口。

<img src="https://releases.llvm.org/8.0.1/tools/clang/docs/_images/DriverArchitecture.png" alt="Driver Architecture Diagram" style="zoom:80%;" />

*橙色：相关数据结构实体；绿色：driver操作数据结构实体的不同阶段；蓝色：重要工具类*

### 五个阶段

driver将任务拆分为为5个独立的阶段：

1. **命令行参数解析（Parse）**

```bash
$ clang -### -Xarch_i386 -fomit-frame-pointer -Wa,-fast -Ifoo -I foo t.c
Option 0 - Name: "-Xarch_", Values: {"i386", "-fomit-frame-pointer"}
Option 1 - Name: "-Wa,", Values: {"-fast"}
Option 2 - Name: "-I", Values: {"foo"}
Option 3 - Name: "-I", Values: {"foo"}
Option 4 - Name: "<input>", Values: {"t.c"}
```

2. **操作流水线构建（Pipline）**

​		根据Parse阶段解析的参数，构建从输入到目标输出的操作（Action）序列，例如预处理、编译、汇编、链接等。

```bash
  $ clang -ccc-print-phases -x c t.c -x assembler t.s
  0: input, "t.c", c
  1: preprocessor, {0}, cpp-output
  2: compiler, {1}, assembler
  3: assembler, {2}, object
  4: input, "t.s", assembler
  5: assembler, {4}, object
  6: linker, {3, 5}, image
```

3. **为操作绑定实际的工具（Bind）**

   由ToolChain（工具类）为每个Action选择合适tool执行，同时确定不同的操作之间的中间产物（inprocess module / pipes / temporary files / user provided filenames）

```bash
$ clang -ccc-print-bindings -arch i386 -arch ppc t0.c
"i386-apple-darwin9" - "clang", inputs: ["t0.c"], output: "/tmp/cc-Sn4RKF.s"
"i386-apple-darwin9" - "darwin::Assemble", inputs: ["/tmp/cc-Sn4RKF.s"], output: "/tmp/cc-gvSnbS.o"
"i386-apple-darwin9" - "darwin::Link", inputs: ["/tmp/cc-gvSnbS.o"], output: "/tmp/cc-jgHQxi.out"
"ppc-apple-darwin9" - "gcc::Compile", inputs: ["t0.c"], output: "/tmp/cc-Q0bTox.s"
"ppc-apple-darwin9" - "gcc::Assemble", inputs: ["/tmp/cc-Q0bTox.s"], output: "/tmp/cc-WCdicw.o"
"ppc-apple-darwin9" - "gcc::Link", inputs: ["/tmp/cc-WCdicw.o"], output: "/tmp/cc-HHBEBh.out"
"i386-apple-darwin9" - "darwin::Lipo", inputs: ["/tmp/cc-jgHQxi.out", "/tmp/cc-HHBEBh.out"], output: "a.out"
```

4. **将命令行参数转换为工具需要的形式（Translate）**

​		该阶段的产物是Commands列表，即工具可执行文件路径与与工具匹配的参数表。

5. **执行流水线（Excute）**



## 源码阅读

### CompilerInstance类

> CompilerInstance - Helper class for managing a single instance of the Clang compiler.

功能：1. 管理编译器相关对象，如预处理器（preprocessor）、AST上下文等。2. 提供了用于构造和操作常见 Clang 对象的实用程序。

### 关键过程

- `CompilerInstance::ExecuteAction(FrontendAction &Act)`

  > ExecuteAction - Execute the provided action against the compiler's CompilerInvocation object.
  >
  > CompilerInvocation - Helper class for holding the data(include paths, the code generation options, the warning flags...) necessary to invoke the compiler.

  - `Act.Execute()`

    `FrontendAction::ExecuteAction()`为纯虚函数，由子类`ASTFrontendAction`与`WrapperFrontendAction`实现，运行时确定执行哪一个

    - `ASTFrontendAction::ExecuteAction()`为例

      - `ParseAST(Sema &S, bool PrintStats, bool SkipFunctionBodies)`

        > Parse the main file known to the preprocessor, producing an abstract syntax tree.*template*

        - ```c++
          Parser::DeclGroupPtrTy ADecl;
          for (bool AtEOF = P.ParseFirstTopLevelDecl(ADecl); !AtEOF;
               AtEOF = P.ParseTopLevelDecl(ADecl)) {
            if (ADecl && !Consumer->HandleTopLevelDecl(ADecl.get()))
              return;
          }
          ```

          

        - `Consumer->HandleTranslationUnit(S.getASTContext())`





## 使用LLDB调试Clang的编译过程

### 问题解决：头文件找不到

> 参考文档：https://www.cnblogs.com/LittleSec/p/12757964.html

```bash
cd build8/bin/hello

lldb -- ../clang -isysroot `xcrun --show-sdk-path` -emit-llvm -S hello.c -o hello.ll

```

























