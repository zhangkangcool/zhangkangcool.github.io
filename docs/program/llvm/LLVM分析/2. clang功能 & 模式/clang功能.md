<h1 align="center">clang功能</h1>
# clang功能模块

clang的各个模块都是单独编译成库，但不同的库之前依旧存在着一定的依赖关系，在代码裁剪时需要考虑依赖问题，主要核心库包括以下内容：

libclangLex: 用于预处理和词法分析、处理宏、令牌和pragma构造。

libclangParse: 用于使用词法分析阶段的结果进行逻辑解析,语法分析。

libclangAST: 构建、操作和遍历抽象语法树。

libclangSema: 用于语义分析，语义分析为AST验证提供操作。

libclangCodeGen: 使用编译目标的信息来生成LLVM IR代码。

libclangAnalysis: 包含用于静态分析的资源。

libclangRewrite: 用于支持代码重构，并为构建代码重构工具提供基础架构。

libclangBasic: 提供一组实用程序，包括文件缓存系统、内存分配抽象、源代码位置和故障诊断、目标机器抽象、语言抽象等。

clang驱动程序，应用程序，也是下文提及的driver。



