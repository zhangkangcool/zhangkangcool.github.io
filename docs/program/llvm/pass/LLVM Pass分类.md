

#### 以下是ChatGPT的回答

在 LLVM 中，Pass 是一个重要的概念，它表示 LLVM 中的一些操作，例如优化、分析、转换等。Pass 可以在 LLVM 中的多个阶段中运行，从而对程序进行多种不同类型的操作。常见的 LLVM Pass 类型如下：

1. Analysis Pass：分析 Pass 主要用于对代码进行分析，例如计算程序中的数据流、控制流、依赖关系等。这些分析结果可以用于其他 Pass 进行优化。拿到分析结果，不能对指令进行修改。
2. Transformation Pass：转换 Pass 主要用于对代码进行转换，例如插入、删除、修改指令等。这些 Pass 可以直接修改程序的 IR。
3. Optimization Pass：优化 Pass 主要用于对代码进行优化，例如常量折叠、循环展开、内联、代码移动等。这些 Pass 可以改进程序的性能、减少程序的内存占用等。
4. Instrumentation Pass：Instrumentation Pass 主要用于在程序中插入额外的代码，例如插入计时器、采样器、调试信息等。这些 Pass 可以用于调试程序、收集性能数据等。该类pass在Transforms下。
5. Code Generation Pass：代码生成 Pass 主要用于将 LLVM IR 转换为目标代码，例如将 IR 转换为汇编代码或机器码。这些 Pass 可以用于生成可执行文件、库文件等。流程转化
6. Other Pass：除了上述 Pass 类型之外，LLVM 还有一些其他类型的 Pass，例如 Debugging Pass、Module Cleaning Pass 等。

总之，LLVM 的 Pass 是一个非常强大的工具，可以用于在多个阶段对程序进行多种不同类型的操作，从而改进程序的性能、可读性、可维护性等。





### 知乎上的分类方式

https://zhuanlan.zhihu.com/p/290946850

LLVM提供的pass分为三类:Analysis pass、Transform pass和Utility pass。Analysis pass计算相关IR单元的高层信息，但不对其进行修改。这些信息可以被其他pass使用，或用于调试和程序可视化。简言之，Analysis pass提供其它pass需要查询的信息并提供查询接口。例如，basic-aa pass是基本别名分析（Basic Alias Analysis）pass，得到的别名分析结果可以用于后续的其它优化pass。Analysis pass不仅从IR中得到有用信息，还可以通过调用其它Analysis pass得到信息，并将这些信息结合起来，得到关于IR更有价值的信息。这些分析结果可以被缓存下来 ，直到分析的IR被修改，原有的分析结果当然也就失效了。

Transform pass可以使用Analysis pass。Transform pass会检视IR，查询Analysis pass得到IR的高层信息，然后以某种方式改变和优化IR，并保证改变后的IR仍然合法有效。例如，adce pass是激进的死代码消除（Aggressive Dead Code Elimination）pass，会将死代码从原来的模块中删除。

Utility pass是一些功能性的实用程序，既不属于Analysis pass，也不属于Transform pass。例如，extract-blocks pass将basic block从模块中提取出来供bugpoint使用，这个utility pass既不属于Analysis pass，也不属于Transform pass。参考文献[1]中列出了LLVM提供的所有pass。当调用RegisterPass()注册自定义pass时，会要求指定是否为Analysis pass。通过RegisterPass()注册自定义pass后，就可以使用LLVM opt工具对IR调用自定义pass功能。

LLVM Pass的基础模块是Pass类，这是所有pass的基类。自定义的pass类都要从预定义子类中继承，并根据自定义pass的具体功能要求覆写虚函数或增加新的功能函数。预定义子类包括ModulePass、CallGraphSCCPass、FunctionPass、LoopPass和RegionPass类等等。不同的子类有不同的约束条件，这些约束条件在调度pass时会用到。设计自定义pass时的首要任务就是确定自定义pass的基类。在为pass选择基类时，应在满足要求的前提下，尽可能选择最相关的类。这些类会为LLVM Pass基础结构提供优化运行所必需的信息，避免生成的编译器因为选择的基类不合适而导致运行速度变慢。各种pass组合在一起，完成各种IR优化任务。Pass之间的组合可以分为两类：一、多个pass作用于同一个IR单元，function pass是一个典型例子。如下图A所示，Function pass作用于一个function IR，但也可以在某个function pass中运行其它几个function pass，将这几个function pass组合起来作用于同一个IR单元，获得更好的优化效果。二、将一个IR单元分解为更小的单元，并用相应类型的pass处理。如下图B所示，module pass作用于module，但也可以在某个module pass中运行function pass，作用于module中的每一个function，这就将一个IR单元分解为粒度更细的单元来处理。在编译器开发时，可以混合使用两种方式，将各种pass组合为流水线，对IR做不同处理和优化。