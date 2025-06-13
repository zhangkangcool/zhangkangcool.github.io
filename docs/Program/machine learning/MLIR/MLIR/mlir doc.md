<h1 align="center">mlir doc</h1>
# 1. IR设计细节

### Operations（操作）

MLIR中的语义单位是一个“操作”，称为Op。在MLIR系统中，从指令到函数再到模块，一切都建模为Op。MLIR没有固定的Op集合，因此允许并鼓励用户自定义扩展Op。编译器pass会保守地对待未知Op，并且MLIR支持通过特征（traits）、特殊的Operation hooks和Interfaces等方式为pass描述Op语义。

Op（见Figure3）具有唯一的操作码（opcode）。从字面上看，操作码是一个字符串，用于标识它所在的dialect和操作。Op可以有零个或多个值作为操作数和结果，并以静态单赋值的形式（SSA）维护操作数和结果。所有值都有一个类型，类似于LLVM IR。除了操作码、操作数和结果外，Op还可能具有属性、区域、块参数和位置信息（**「Attributes, Regions, Block Arguments, and Location Information」**）。Figure4说明了值和Op，`％`标识符是命名值（包），如果包中有多个值，`：`后指定包中值的数量（注：如Figure3中的`%results:2`，表示返回值有2个），而“＃”表示特定值。在一般的文本表示形式中，操作名称是用引号括起来的字符串，后跟括号括起来的操作数。

下图%result:2表示有两个返回值，"d.opertaion"表示操作名称。`(%arg0, %arg1)`是两个操作数。

Regions由`{}`包起来，属于Op，一个Regision可以有多个blocks。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uz0Xgufw2Oa3NRFwpH8RGyoU6YJBBQQJDL5lylTyzsBaFrR2KeM4X43mGYWamybrEUL8as7fnlkQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

属性：`{attribute="value" : !d.type}`

每个块都有一个（可能为空）类型化的块参数列表，这些参数是常规值并符合静态单赋值。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uz0Xgufw2Oa3NRFwpH8RGyrqBQyY66elfgYQ6xOcWQPZONyvmqGBicAvSP4eqVXBgwoyzbicz3ASrQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

属性`{lower_bound = () -> (0), step = 1 : index, upper_bound = #map3}`）。

其中，`lower_bound`、`step`和`upper_bound`是属性名称。`() -> (0)`标识用于内联仿射形式，在这个例子中是产生常数0的仿射函数。`＃map3`标识用于属性别名，该属性别名允许将属性值与标签预先关联，并可以在任何需要属性值的地方使用标签。



每个块以终止符（`terminator`）操作结尾

Op冒号后为类型，Op使用类似尾函数的语法列出其输入和结果类型。：如affine.store...: (f32, memref<?xf32>, index, index) -> ()



### Attributes（属性）

MLIR属性是结构化的编译期静态信息，例如整数常量值、字符串数据或常量浮点值列表。属性有类型，每个Op实例都有一个从字符串名称到属性值的开放键值对字典映射。在通用语法描述中，**「属性在Op操作数和其类型之间」**，键值对列表中的不同键值对用逗号分隔，并用大括号将整个键值对列表括起来。与操作码一样，MLIR没有固定的属性集。属性的含义由Op语义或与属性相关的dialect 中得出。属性也是可扩展的，允许直接引用外部数据结构，这对于和现有系统集成很有帮助。例如，某个属性可以引用ML系统中（在编译期已知的）数据存储的内容。



### Location information （位置信息）

MLIR提供了位置信息的紧凑表示形式，并鼓励在整个系统中处理和传播位置信息。位置信息可用于保留产生Op的源程序堆栈踪迹，用以生成调试信息。位置信息使编译器产生诊断信息的方式变得标准化，并可用于各种测试工具。位置信息也是可扩展的，允许编译器引用现有的位置跟踪系统、高级AST节点、LLVM风格的文件-行-列（file-line-column ）地址、DWARF调试信息或其它高质量编译实现所需的信息。

**「上面三个要点我们可以基于Toy语言的transpose Op来加深理解：」**

```c++
%t_tensor = "toy.transpose"(%tensor) {inplace = true} : (tensor<2x3xf64>) -> tensor<3x2xf64> loc("example/file/path":12:1)
```

结构拆分解释：

- `%t_tensor`：这个Operation定义的结果的名字，前面的`%`是避免冲突，见https://mlir.llvm.org/docs/LangRef/#identifiers-and-keywords 。一个Operation可以定义0或者多个结果（在Toy语言中，只有单结果的Operation），它们是SSA值。该名称在解析期间使用，但不是持久的（例如，它不会在 SSA 值的内存表示中进行跟踪）。
- `"toy.transpose"` ：Operation的名字。它应该是一个唯一的字符串，Dialect 的命名空间前缀为“.”。这可以理解为Toy Dialect 中的transpose Operation。
- `(%tensor)`：零个或多个输入操作数（或参数）的列表，它们是由其它操作定义的SSA值或block参数的引用。
- `{ inplace = true }`：零个或多个属性的字典，这些属性是始终为常量的特殊操作数。在这里，我们定义了一个名为“inplace”的布尔属性，它的常量值为 true。
- `(tensor<2x3xf64>) -> tensor<3x2xf64>`：函数形式表示的操作类型，前者是输入，后者是输出。`<2x3xf64>`号中间的内容描述了张量的尺寸`2x3`和张量中存储的数据类型`f64`，中间使用`x`连接。
- `loc("example/file/path":12:1)`：此操作的源代码中的位置。





### Regions and Blocks（区域和块）

Op的实例可能附有一系列附加区域。区域为MLIR中的嵌套结构提供了实现机制：一个区域包含一系列块，一个块包含一系列操作（操作中可能又包含区域，如Figure3所示）。与属性一样，区域的语义由其附加的操作定义，但是区域内部的块（如果有多个）可形成控制流图（CFG）。例如，Figure4中的`affine.for`操作是一个循环，其中位于`({`和`})`定界符之间的单独块是一个区域。Op指定了跨区域的控制流。在这个例子中，重复执行主体直到达到循环上限。每个区域的主体是一系列块，每个块以终止符（`terminator`）操作结尾，终止符操作可能具有后继块，控制流可以转移到后继块。每个终止符（例如“switch”，“conditional branch”或“unwind”）定义自己的语义。终止符可以选择将控制流转移到同一区域中的另一个块，或将其返回到包含该区域的Op。后续块的图定义了CFG，从而允许区域内有基于标准静态单赋值（SSA）的控制流。MLIR不使用节点，而是使用静态单赋值（SSA）的函数形式。其中，终止符将值传给后继块定义的块参数（block arguments）。每个块都有一个（可能为空）类型化的块参数列表，这些参数是常规值并符合静态单赋值。终止符Op的语义定义了在控制权转移后该块的参数会采用的值。对于该区域的第一个（入口）块，值由包含Op的语义定义。例如，`affine.for`使用入口块参数`％arg4`作为循环归纳变量。

> 这里表达的意思就是一个Operation可能有多个Region，然后Region又是由一系列Block组成，然后Block又包含一系列Op。这样就形成了一个嵌套的关系，可以表达作用域和控制流关系。



### Value dominance and visibility(值支配和可视化)

Op只能使用作用域内的值，即根据SSA支配、嵌套和包含Operation的语义限制可见的值。如果值遵循标准的SSA支配关系，则在CFG中可以看到这些值，在这些值中，可以确保控件在使用前先经过定义。

基于区域的可见性是根据区域的简单嵌套来定义的：如果Op的操作数在当前区域之外，则必须在使用的区域上方用外部词法对其进行定义，这允许`affine.for`操作中的Op使用外部作用域中定义的值。

MLIR还允许将操作定义为**「与上方隔离」**，表明该操作是**「作用域barrier」**（scope barrier）。例如， “std.func” Op定义了一个函数，该函数内的操作不能引用该函数外定义的值。除了提供有用的语义检查之外，由于没有use-def链可以跨过隔离障碍（isolation barriers），包含与上方隔离（isolated-from-above）的Op的Module也可以由ML编译器并行处理。这对于利用多核计算机进行的编译很重要。



### Symbols and symbol tables

Op还可以附加一个符号表。这个符号表是将名称（以字符串表示）与IR对象（称为符号）相关联的标准方法。IR没有规定符号的用途，而是交由Op定义。对于无需遵守静态单赋值规则的命名实体，符号很有用。符号不能在同一表中重复定义，但是可以在定义之前使用符号。例如，全局变量、函数或命名模块可以表示为符号。没有这种机制，就不可能定义递归函数（在定义中引用自己）。如果附带符号表的Op的关联区域包含相似的Op，那么符号表可以嵌套。MLIR提供了一种机制来引用Op中的符号，包括嵌套符号。

### Dialects

MLIR使用Dialect管理可扩展性。Dialect在一个唯一的命名空间下提供Ops、属性和类型的逻辑分组。Dialect本身并未引入任何新的语义，而是用作逻辑分组机制，并且可用于提供Dialect通用Op支持（例如，dialect中所有op的常量折叠行为）。Dialect命名空间在操作码中是以“.”分隔的前缀，例如，Figure 4使用的`affine`和`std` dialect。

概念上可以将Ops、类型和属性抽象为Dialect，这类似于设计一组模块化库。例如，某种Dialect可以包含用于对硬件向量进行操作的Op和类型（例如，shuffle、insert/extract元素、掩码等），而另一种Dialect可以包含用于对代数向量进行操作的Op和类型（例如，绝对值、点积等 ）。两种dialect是否使用相同的向量类型以及该类型属于哪一个，可以由MLIR用户在设计时决定。

我们也可以将所有Op、类型和属性放在一个dialect中，但容易想到，这必然很快就会因为大量概念和名称冲突等问题，导致Dialect变得难以管理。尽管每个Op、类型和属性都只属于一个dialect，但是MLIR明确支持多种dialect的混合以便能实现渐进式lowering。来自不同dialect的Op可以在IR的任何级别共存，可以使用在不同dialect中定义的类型，等等。Dialect的混合可以加强重用性、可扩展性和灵活性。



### 类型系统

MLIR中的每个值都有类型，该类型在产生该值的Op或将值定义为参数的Block中指定。类型为IR提供了编译期语义。MLIR中的类型系统是用户可扩展的，并且可以引用已有外部类型系统（例如llvm::Type或clang::Type）。MLIR强制执行严格的类型等价检查，并且不提供类型转换规则。Op使用类似尾函数的语法列出其输入和结果类型。Figure4中，`affine.load`从内存引用和索引类型映射到加载的值的类型。从类型理论的角度来看，MLIR仅支持非依赖类型，包括trivial类型、参数类型、函数类型、求和和乘积类型。

### 标准类型

此外，MLIR提供了一组标准化的常用类型，包括任意精度整数、标准浮点类型和简单的通用容器，如元组（tuple）、多维矢量和张量。这些类型仅是方便Dialect开发者，但是不要求一定使用。



### Functions and modules（函数和模块）

与常规IR相似，MLIR通常被构造为函数和模块，这些不是MLIR的新概念。函数和模块在builtin dialect中作为Op实现。模块是一个具有单独区域的Op，这个区域包含了一个单独的块。模块被一个不转移控制流的dummy Op终止。

模块定义了一个可以被引用的符号。像任何块一样，其主体包含一系列Op，这些Op可以是函数、全局变量、编译器元数据或其它顶级构造。函数是具有单个区域的Op，其参数对应于函数参数。

**「函数定义了一个可以按名称引用的符号。使用函数调用Op可以将控制流转移到函数中」**。一旦进入内部，控制流程遵循区域中各个块的CFG。“return”终止符没有后继，而是终止区域执行，从而将控制流转移回函数的调用方。“return”终止符Op的任何操作数都是函数的返回值。

```c++
// Compute A*B using an implementation of multiply kernel and print the
// result using a TensorFlow op. The dimensions of A and B are partially
// known. The shapes are assumed to match.
func.func @mul(%A: tensor<100x?xf32>, %B: tensor<?x50xf32>) -> (tensor<100x50xf32>) {
  // Compute the inner dimension of %A using the dim operation.
  %n = memref.dim %A, 1 : tensor<100x?xf32>

  // Allocate addressable "buffers" and copy tensors %A and %B into them.
  %A_m = memref.alloc(%n) : memref<100x?xf32>
  memref.tensor_store %A to %A_m : memref<100x?xf32>

  %B_m = memref.alloc(%n) : memref<?x50xf32>
  memref.tensor_store %B to %B_m : memref<?x50xf32>

  // Call function @multiply passing memrefs as arguments,
  // and getting returned the result of the multiplication.
  %C_m = call @multiply(%A_m, %B_m)
          : (memref<100x?xf32>, memref<?x50xf32>) -> (memref<100x50xf32>)

  memref.dealloc %A_m : memref<100x?xf32>
  memref.dealloc %B_m : memref<?x50xf32>

  // Load the buffer data into a higher level "tensor" value.
  %C = memref.tensor_load %C_m : memref<100x50xf32>
  memref.dealloc %C_m : memref<100x50xf32>

  // Call TensorFlow built-in function to print the result tensor.
  "tf.Print"(%C){message: "mul result"} : (tensor<100x50xf32>) -> (tensor<100x50xf32>)

  return %C : tensor<100x50xf32>
}

// A function that multiplies two memrefs and returns the result.
func.func @multiply(%A: memref<100x?xf32>, %B: memref<?x50xf32>)
          -> (memref<100x50xf32>)  {
  // Compute the inner dimension of %A.
  %n = memref.dim %A, 1 : memref<100x?xf32>

  // Allocate memory for the multiplication result.
  %C = memref.alloc() : memref<100x50xf32>

  // Multiplication loop nest.
  affine.for %i = 0 to 100 {
     affine.for %j = 0 to 50 {
        memref.store 0 to %C[%i, %j] : memref<100x50xf32>
        affine.for %k = 0 to %n {
           %a_v  = memref.load %A[%i, %k] : memref<100x?xf32>
           %b_v  = memref.load %B[%k, %j] : memref<?x50xf32>
           %prod = arith.mulf %a_v, %b_v : f32
           %c_v  = memref.load %C[%i, %j] : memref<100x50xf32>
           %sum  = arith.addf %c_v, %prod : f32
           memref.store %sum, %C[%i, %j] : memref<100x50xf32>
        }
     }
  }
  return %C : memref<100x50xf32>
}
```



# 2.  **IR基础设施**

除了IR本身之外，MLIR还提供了用于定义IR元素（如dialect、Ops、 pattern rewrite、验证和可重用passes）的基础结构。当定义新的抽象并将MLIR用作优化工具包时，MLIR的基础结构对于提供可扩展性和易用性至关重要。

### Operation description（操作描述）

MLIR使用TableGen[47]规范定义操作描述（Operation Descriptions, ODS），以声明的方式定义Op的结构及其验证程序组件。TableGen是一种在LLVM中广泛使用的数据建模工具，目的是帮助定义和维护领域特定（ domain-specific）信息的记录。ODS可以看作是嵌入TableGen语言并用来定义MLIR Op的DSL。因此ODS语法由TableGen规定，但MLIR特定的语义由ODS规定。ODS定义最终会转换为C++代码，这些代码可以与编译系统的其余部分互操作。

MLIR使用TableGen Op类在ODS中对Op进行建模。Figure 5显示了Op 用ODS定义的示例。每个Op定义都有一个名称，该名称是唯一标识符。Op的特征（trait）列表描述了Op属性。Op的argument（参数）列表指定Op的操作数和属性。Op定义中还有一个result（结果）列表。Op的参数和结果具有名称和类型约束（例如float或int32的固定形状张量）。Op定义还可以指定人类可读的Op描述。当Op需要定义比ODS提供的更精细的控制时，可以通过builder、printer、parser、verifier语句注入额外C++代码。Op trait可以是通用的，例如“has no side-effects”，也可以是特定于Dialect或ODS的，例如“has custom exporter”。ODS中的traits可以由定义trait行为的C++类支持。MLIR没有固定的trait集合，但是有些trait或者optimizer（对应论文的6.1节）对ODS来说是已知的（例如，“shape result and operand type”表示对于给定输入类型完全捕获输出类型的约束）。

类型约束会检查参数/结果类型的属性，并且由用户/dialect扩展。MLIR基础结构还提供了许多预定义的类型约束，例如“any type”、““tensor with element satisfying the given constraint”、““vector of given rank”等。ODS对自动推断操作数结果的返回类型的支持很有限，这些操作数使用了由特征带来的约束。更多信息请参见下一节（对应论文的4.2节）。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uz0Xgufw2Oa3NRFwpH8RGyZxtGCuI2p7icXO07yYkFCNDrk7UmoTj31haR2vahdNlibicFW2IDQwUbw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

### Declarative rewrites（声明式重写）

许多MLIR变换涉及Op操作，尽管某些变换需要对IR进行复杂的修改，但许多其它转换可以表示为对静态单赋值 use-def 关系定义DAG的简单重写。MLIR提供了一个图重写框架，并辅以声明性重写规则（Declarative Rewrite Rule, DRR）系统，使得模式（pattern）表达变得简单。

与ODS相似，DRR是嵌入到TableGen语言中的DSL。DRR表示源和目标DAG pattern以及约束（包括动态约束[49]）并从pattern优先优先级中受益。pattern可以捕获和重用Op的参数。从概念上讲，DRR表示在特定约束下DAG的等效性。Figure 6给出了DRR模式的示例，该模式将Fiugure 5中定义的Op转换为由`compare`和`select`组成的通用低级别实现。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uz0Xgufw2Oa3NRFwpH8RGyFsBzYLzvQTEBgW9sAjFIjA487vrTKA2sEdvDaW5QNdMZBbe4icd2e4A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)DRR图改写规则

DRR被转换为C++代码，可以使用通用图重写框架将其与直接在C++中定义的更复杂的模式混合。通过这项功能，MLIR可以使常见用例保持简洁，且不会限制框架的通用性。



### Pass Manager

MLIR pass管理器以各种粒度组织并处理IR pass序列，保证pass的高效执行。现有编译系统中的pass管理通常是按照固定的粒度（例如，模块、函数或循环 pass管理器）定义的。但在MLIR中，模块和函数并无特殊，它们只是具有区域的Ops，并且有多种变体。**「因此，MLIR pass管理器也不专门针对固定的Op集合，而是针对任意嵌套级别的任意Op。」**

**「并行编译」** MLIR的一个重要需求是利用多核计算机来加快编译速度。pass管理器支持并发遍历和修改IR，这可以通过Op的“与上方隔离（isolated-from-above）”属性提供的不变量来实现，因为静态单赋值 use-def链无法跨越这些op的区域边界，因此具有这种行为的Op（例如“ std.func” Op）定义了可以并行处理的区域树。

这个需求也是MLIR不具有whole-module use-def链的原因（这与LLVM相反）。全局对象通过符号表条目进行引用，而常量则由具有关联属性的Op实现。



### 可相互变换的IR文本表示形式

### 可相互变换的IR文本表示形式

MLIR中的IR和Op具有文本表示形式，可以完全反映内存中的IR表示，这对于调试、理解变换期间的IR以及编写测试用例至关重要。Figure4所示的原始IR表示冗长且难以理解，因此MLIR允许用户为Op定义定制的打印和解析格式，这使得示例可以如Figure 8所示进行打印和解析，这更容易使用。两种形式可以完全相互转换，并且可以使用文本形式作为输入和输出，分别测试每个编译器pass。由于没有隐藏状态，因此运行单个pass的结果与在完整pass pipeline中运行相同pass的结果相同。这种方法对用户友好，因为可以手动创建IR格式，并可方便跟踪IR转换。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uz0Xgufw2Oa3NRFwpH8RGynu0Sw0DghDS7UL0F1zkUzQNJ1WPWhX09SPNPvpu7OLjaJropvx9SSA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)自定义解析格式的Affine Dialect IR



###  文档

Dialect、Op和Interfaces都有从其对应ODS描述生成的文档。除了summary和更易读懂的description之外，生成的文档还包括参数和结果类型约束。由于验证代码和文档使用相同的来源，因此文档可以与运行时行为保持同步。



### 验证器

验证器用于增强 IR 的结构正确性和 Op 的不变性 让pass确定已验证的IR不变式是经过检查的，并且还可以用作调试工具。验证过程以MLIR总体结构属性检查开始，比如，检查类型必须完全匹配，值仅定义一次且遵守支配规则和可见性，符号名称在符号表中是唯一的，所有块均以终结符Op结尾，等等。之后，应用各个Op和属性的验证器。每个Op可以定义一组检查结构和语义有效性规则。例如，二元Op会检查是否有两个操作数，一些Op只接受特定类型的值，而一些Op需要附加特定的属性或区域。同样，Dialect属性只能在特定的Op上被允许使用，或者通过这些属性对其所附加的Op做进一步的限制。例如，Dialect属性可以要求Op仅使用Dialect中定义的类型，即使Op本身更通用。验证失败被视为invariant violation并中止编译。



### TensorFlow graphs

尽管大多数编译器开发人员也都熟悉其它表示形式，但是MLIR的关键用例之一是支持机器学习框架的开发。机器学习框架的内部表示通常基于具有动态执行语义的数据流图[53]。

TensorFlow[1]是这种框架的一个例子。TensorFlow的表示是高级数据流计算，其中的节点是可以放置在各种设备（包括特定的硬件加速器）上的各种计算过程。

TensorFlow使用MLIR对该内部表示进行建模，并针对Figure1所示的用例进行转换，将简单的代数优化转换为能在（硬件加速器的）数据中心集群上并行执行的、新形式的图，并将IR lowering为能使用XLA[57]这类工具生成高效本地代码、适合移动端部署的表示。MLIR中的TensorFlow Graph表示如图7所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uz0Xgufw2Oa3NRFwpH8RGysUGricI4HMUdqfvoT4KVmCRTcrpUOtwODbiaVgVRgU5QsSYRF42yC61Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)



# 3. **MLIR设计的成果**

MLIR设计有助于对新语言和编译抽象进行建模，同时有助于重用现有的、通用的相关编译方法。**「MLIR对很多问题的有效解决方法是“添加新操作、新类型”，如果可能，将其收集到“某个新dialect”中」**。对于编译器工程而言，这是重大的设计转变，产生了新的机遇，挑战和见解。本节将探讨其中部分观点。



### 可重用的编译器Pass

在一个 IR 中可以表示多个抽象级别的能力自然产生了编写跨多个抽象级别工作的pass的想法。关于MLIR的一个常见问题是，既然MLIR具有可扩展的操作和类型系统，那么如何编写编译器pass？虽然编译器pass可能总是以保守、正确的方式处理未知结构，但MLIR的目标是生成高性能代码，主要有四种方法：

**「基本操作特征」** 一些“bread and butter”编译器pass（如“死代码消除”和“通用子表达式消除”）只依赖我们定义为Op traits简单属性（例如“has no side effect”或“is commutative”）。ODS中Op的定义允许Op的开发者指定这些特征，并且pass可以使用此信息来保持操作在许多不同抽象域都适用。

MLIR的可扩展性体现为包含一些结构属性，其中包括下述信息：**「是否知道某个操作是控制流终止符」**，**「是否知道某个操作包含的区域是与上方隔离的」**（isolated-from-above）等等。这些信息可用于函数、闭包、模块和其他代码结构的建模和处理。

**「Privileged operation hooks」**（Op的特殊钩子）虽然某些特征可以用单比特建模，但是其它很多特征则需要C++代码实现，例如常量折叠逻辑。MLIR对适用于大量pass的某些hook提供了最好的支持。这些hook可以基于每个操作实现，也可以在dialect对象中实现。后一种方法对支持诸如TensorFlow ops的常量折叠之类pass很方便，在这种情况下，很容易实现对现有逻辑的委托。

尽管常量折叠是非常重要的功能，但更有意思的hook是`getCanonicalizationPatterns`，这个hook允许指定应用于操作的折叠模式。这使得重要的代数简化形式（例如x − x→0，min（x，y，y）→min（x，y）等）具有可扩展性，并可帮助将普通“规范化（Canonicalization）”pass应用到所有dialect 。这些都使得单一的可扩展系统可以包含像“InstCombine”、“DAGCombine”、“PeepholeOptimizer”、“SILCombine”这类pass，以及LLVM生态系统（和其它编译器）中的其它特殊用途pass。

**「Optimization interfaces」** (优化接口) MLIR的主要目标是可扩展性，不仅在Op和类型方面，而且在转换方面也要有可扩展性。虽然规范化（canonicalization）和常量折叠是关键操作，但仍需要以某些方式对许多标准转换进行参数化设置，才能描述转换的特定属性，才能实现代码模型等。

问题的解决方案是称为“优化接口”的子系统。考虑一下MLIR内联pass，我们希望inliner可以处理TensorFlow图、Flang函数、函数语言的闭包等，但是inliner不知道调用方是什么，甚至不知道被调用方是什么。inliner需要了解的核心特性是：

- 将给定操作内联到给定区域是否有效；
- 如何处理内联后终止于块中间的终止符操作。

为了了解这些属性，Inliner pass定义了Figure 10中的接口。各个操作和dialect可以向MLIR注册该接口在操作和dialect中的实现，并从通用的Innerer pass中获益。如果某个操作或dialect没有提供接口，则相应的优化pass将会保守地对待该操作。这种设计让dialect的开发者能快速启动开发并运行dialect。随着时间的推移，通过将更多的精力投入到接口的开发，可以从系统中获得更多收益。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uz0Xgufw2Oa3NRFwpH8RGyVYbmAY9ywvqGY09BN9ecqgskGMuloYibxPz47ntMstYeyZRHlborWww/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)内联Pass接口

优化接口还为核心编译器提供了模块化优势，因为dialect特定的逻辑是在dialect自身内部实现，而不是在核心转换中实现。

**「Dialect特定pass」** 最后，定义特定dialect可以定义专用pass，MLIR系统中的这些pass和在其它编译器系统中的pass一样都很有用。比如说，如果想让代码生成器根据特定的机器约束对机器指令进行自定义调度，就可以通过专用pass达到目的。这可当作开发新转换pass的起点，不需要考虑pass的通用性。

### Dialect的混合

MLIR中一个最根本（也是最难理解）的部分是允许并鼓励将来自不同dialect的操作混合在一个程序中。尽管在某些情况下（例如，将主机和加速器的计算保存在同一模块中），这样做很容易理解，但最有趣的情况是，在MLIR中可以将dialect直接混合（因为这样可以实现整个类的重用），这在其它系统中是见不到的。

考虑第0x6.5.2节中描述的afﬁne dialect。affine控制流和affine映射的定义与affine区域中包含的操作的语义无关。在我们的案例中，我们将afﬁne dialect与“standard” dialect结合起来，以目标无关的形式（如同LLVM IR）表示简单算术，也可以针对内部加速器，将afﬁne dialect与多个目标相关机器指令dialect结合。也有人将afﬁne dialect与其它问题领域的抽象相结合。

重用通用多面体变换（使用Op Interface获取特定转换中操作的语义）的能力是分解编译器基础结构的一种有力方法。另一个例子是，可以在各种源语言IR中使用和重用OpenMP dialect。



### 互操作性

本文的工作涉及与大量现有系统的互操作，例如，protobuff格式的机器学习graphs、包括LLVM IR在内的编译器IR、各种专有指令集等。任何一种表示形式不可避免都有各种缺陷，虽然这些缺陷在某个现有系统的适用场景下是合理的，但是MLIR的表达能力使MLIR成为一种更好的表示形式。因为importer和exporters的测试难度很大（测试用例通常是二进制格式），因此我们希望确保其复杂性最低。

问题的解决方案是尽可能定义与外部系统直接相对应的dialect，从而能以一种简单且可预测的方式来回转换该格式。一旦将IR导入MLIR格式中，就可以使用MLIR基础结构中所有转换，将导入的IR升级或降级为某种更适合的IR格式，并允许对这些转换pass进行类似于所有其它MLIR pass的测试。

这类dialect的例子很多，包括：a）LLVM dialect，可将LLVM IR映射为MLIR；b）TensorFlow的图表示形式，提出这种表示是为了简化TensorFlow中“切换和合并（switch and merge）”节点相关的分析和转换；c ）函数式控制流运算符。“functional while”和“functional if”在机器学习图中很常见，在这种情况下，将其代码主体作为区域而不是外联（out-of-line）函数更方便。

这种方法对我们来说效果很好，并且MLIR工具对于编写外来二进制文件格式的测试用例也很有用。











