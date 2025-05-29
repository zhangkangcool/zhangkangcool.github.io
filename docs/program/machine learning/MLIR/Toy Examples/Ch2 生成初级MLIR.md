

# 生成初级MLIR

https://mp.weixin.qq.com/s/jMHesvKmAUU5dYH0WznulA

https://mlir.llvm.org/docs/Tutorials/Toy/

https://mlir.llvm.org/docs/Tutorials/Toy/Ch-1/



### 1. Operation

MLIR 被设计成完全可扩展的基础框架，没有封闭的属性集、操作和类型。MLIR 通过**Dialect**（https://mlir.llvm.org/docs/LangRef/#dialects）的概念来支持这种可扩展性。**Dialect**在一个特定的`namespace`下为抽象提供了分组机制。

在MLIR里面，Operation是抽象和计算的核心单元，在许多方面与 LLVM 指定类似。具有特定于应用程序的语义，并且可以用于表示 LLVM 中的所有核心的 IR 结构：指令、globals（类似function）和模块。下面展示一个Toy语言产生的的`transpose` Operation。

```shell
%t_tensor = "toy.transpose"(%tensor) {inplace = true} : (tensor<2x3xf64>) -> tensor<3x2xf64> loc("example/file/path":12:1)
```

结构拆分解释：

- `%t_tensor`：
  - 这个Operation定义的结果的名字，前面的`%`是避免冲突，见https://mlir.llvm.org/docs/LangRef/#identifiers-and-keywords 。一个Operation可以定义0或者多个结果（在Toy语言中，只有单结果的Operation），它们是SSA值。该名称在解析期间使用，但不是持久的（例如，它不会在 SSA 值的内存表示中进行跟踪）。
- `"toy.transpose"` ：
  - Operation的名字。它应该是一个唯一的字符串，Dialect 的命名空间前缀为“.”。这可以理解为Toy Dialect 中的transpose Operation。
- `(%tensor)`：
  - 零个或多个输入操作数（或参数）的列表，它们是由其它操作定义或引用块参数的 SSA 值。
- `{ inplace = true }`：
  - 零个或多个属性的字典，这些属性是始终为常量的特殊操作数。在这里，我们定义了一个名为“inplace”的布尔属性，它的常量值为 true。
- `(tensor<2x3xf64>) -> tensor<3x2xf64>`:
  - 函数形式表示的操作类型，前者是输入，后者是输出。`<2x3xf64>`号中间的内容描述了张量的尺寸`2x3`和张量中存储的数据类型`f64`，中间使用`x`连接。
- `loc("example/file/path":12:1)`：
  - 此操作的源代码中的位置。

-------



## 2. 示例与框架

了解了MLIR指令的基本结构后，我们把目光放到Chapter2要做什么事情上？即**生成初级MLIR**。我们执行下面的命令为Chapter2测试例子中的`codegen.toy`产生MLIR。

```shell
./toyc-ch2 ../../mlir/test/Examples/Toy/Ch2/codegen.toy -emit=mlir -mlir-print-debuginfo
```



`-mlir-print-debuginfo`是`mlir-opt --help`提供的选项，用于加入调试信息。`mlir-opt`的其它选项，在这里也是可以使用的。



其中`codegen.toy`的内容为：

```python
def multiply_transpose(a, b) {
  return transpose(a) * transpose(b);
}

def main() {
  var a<2, 3> = [[1, 2, 3], [4, 5, 6]];
  var b<2, 3> = [1, 2, 3, 4, 5, 6];
  var c = multiply_transpose(a, b);
  var d = multiply_transpose(b, a);
  print(d);
}
```

产生的MLIR为：

```python
module  {
  func @multiply_transpose(%arg0: tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":4:1), %arg1: tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":4:1)) -> tensor<*xf64> {
    %0 = toy.transpose(%arg0 : tensor<*xf64>) to tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":5:10)
    %1 = toy.transpose(%arg1 : tensor<*xf64>) to tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":5:25)
    %2 = toy.mul %0, %1 : tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":5:25)
    toy.return %2 : tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":5:3)
  } loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":4:1)
  func @main() {
    %0 = toy.constant dense<[[1.000000e+00, 2.000000e+00, 3.000000e+00], [4.000000e+00, 5.000000e+00, 6.000000e+00]]> : tensor<2x3xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":9:17)
    %1 = toy.reshape(%0 : tensor<2x3xf64>) to tensor<2x3xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":9:3)
    %2 = toy.constant dense<[1.000000e+00, 2.000000e+00, 3.000000e+00, 4.000000e+00, 5.000000e+00, 6.000000e+00]> : tensor<6xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":10:17)
    %3 = toy.reshape(%2 : tensor<6xf64>) to tensor<2x3xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":10:3)
    %4 = toy.generic_call @multiply_transpose(%1, %3) : (tensor<2x3xf64>, tensor<2x3xf64>) -> tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":11:11)
    %5 = toy.generic_call @multiply_transpose(%3, %1) : (tensor<2x3xf64>, tensor<2x3xf64>) -> tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":12:11)
    toy.print %5 : tensor<*xf64> loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":13:3)
    toy.return loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":8:1)
  } loc("../../mlir/test/Examples/Toy/Ch2/codegen.toy":8:1)
} loc(unknown)
```

我们需要弄清楚`codegen.toy`是如何产生的MLIR文件。也即下图的AST到MLIR表达式那部分（包含Dialect）。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uDKbdKfH14Z3he5rKttLrnkV2gZEXM7yvqYXDnO9BTiceGI1o6xh8XsJd2G3EWhhpb3FpzroNhb3w/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)图源知乎法斯特豪斯，侵删

#### 生成MLIR的流程

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uDKbdKfH14Z3he5rKttLrn09micQwgEkGAgBOyCa07bJfNpjvYDDqHh4ThlIsS4TQIQFN8puCzftg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)从AST到MLIR由是和Dialect相关的这部分

这里首先有一个MLIRGen函数负责遍历AST。具体在`mlir/examples/toy/Ch2/mlir/MLIRGen.cpp`文件中实现，里面有一个`mlirGen`函数，实现如下：

```c++
/// Dispatch codegen for the right expression subclass using RTTI.
  mlir::Value mlirGen(ExprAST &expr) {
    switch (expr.getKind()) {
    case toy::ExprAST::Expr_BinOp:
      return mlirGen(cast<BinaryExprAST>(expr));
    case toy::ExprAST::Expr_Var:
      return mlirGen(cast<VariableExprAST>(expr));
    case toy::ExprAST::Expr_Literal:
      return mlirGen(cast<LiteralExprAST>(expr));
    case toy::ExprAST::Expr_Call:
      return mlirGen(cast<CallExprAST>(expr));
    case toy::ExprAST::Expr_Num:
      return mlirGen(cast<NumberExprAST>(expr));
    default:
      emitError(loc(expr.loc()))
          << "MLIR codegen encountered an unhandled expr kind '"
          << Twine(expr.getKind()) << "'";
      return nullptr;
    }
  }
```

这个函数会根据AST中的节点类型递归调用其它的`mlirGen`子函数，并在各个子函数完成真正的转换MLIR表达式的操作。以上面`codege.toy`的`transpose(a)`操作为例，对应的`mlirGen`子函数为：

```c++
/// Emit a call expression. It emits specific operations for the `transpose`
  /// builtin. Other identifiers are assumed to be user-defined functions.
  mlir::Value mlirGen(CallExprAST &call) {
    llvm::StringRef callee = call.getCallee();
    auto location = loc(call.loc());

    // Codegen the operands first.
    SmallVector<mlir::Value, 4> operands;
    for (auto &expr : call.getArgs()) {
      auto arg = mlirGen(*expr);
      if (!arg)
        return nullptr;
      operands.push_back(arg);
    }

    // Builtin calls have their custom operation, meaning this is a
    // straightforward emission.
    if (callee == "transpose") {
      if (call.getArgs().size() != 1) {
        emitError(location, "MLIR codegen encountered an error: toy.transpose "
                            "does not accept multiple arguments");
        return nullptr;
      }
      
      // 新建一个`TransposeOp`类型的MLIR节点
      return builder.create<TransposeOp>(location, operands[0]);
    }

    // Otherwise this is a call to a user-defined function. Calls to
    // user-defined functions are mapped to a custom call that takes the callee
    // name as an attribute.
    return builder.create<GenericCallOp>(location, callee, operands);
  }
```

26这行代码涉及到MLIR的Dialect和TableGen。

------





### 3. 定义Dialecct

目前Ch2只定义了Ops.td，该td文件会引用mlir下的另外4个td文件。



MLIR是通过Dialect来统一各种不同级别的IR，即负责定义各种Operation和解析，同时还具有可扩展性。在Toy语言中我们也定义了Dialect，定义这个Dialect的时候是通过TableGen规范来定义到`mlir/examples/toy/Ch2/include/toy/Ops.td`中的。

```c++
// Provide a definition of the 'toy' dialect in the ODS framework so that we
// can define our operations.
def Toy_Dialect : Dialect {
  let name = "toy";
  let cppNamespace = "::mlir::toy";
}
```

在MLIR中，Dialect和Operation（也可以说算子）的定义是框架是基于TableGen（一种声明性编程语言）规范构造的，在源码中它以`.td`的格式存在，在编译时会自动生成对应的C++文件，生成定义好的Dialect。使用TableGen的好处不仅是因为它是声明性的语言让新增Dialect和Operation变得简单，而且容易修改和维护。可能我解释得不是很直观，但我们可以直接结合Chapter2的代码`mlir/examples/toy/Ch2/include/toy/Ops.td` 来理解。后面我们会看到在Toy语言的示例中，`.td`文件的组成以及TableGen是如何自动解析`.td`生成C++代码的。

这里首先在`td`中定义一下Toy Dialect，并建立和Dialect的链接，它负责将后续在Toy Dialect空间下定义的所有Operation联系起来。即：



可以使用下面的命令进行编译：

```shell
${build_root}/bin/mlir-tblgen -gen-dialect-decls ${mlir_src_root}/examples/toy/Ch2/include/toy/Ops.td -I ${mlir_src_root}/include/
```



该命令会生成以下代码(以下为mlir/examples/toy/Che/include/toy/Dialect.h中的内容，用mlir-tblgen生成时不会产生注释)：

```c++
/// This is the definition of the Toy dialect. A dialect inherits from
/// mlir::Dialect and registers custom attributes, operations, and types (in its
/// constructor). It can also override some general behavior exposed via virtual
/// methods.
class ToyDialect : public mlir::Dialect {
public:
  explicit ToyDialect(mlir::MLIRContext *ctx);

  /// Provide a utility accessor to the dialect namespace. This is used by
  /// several utilities for casting between dialects.
  static llvm::StringRef getDialectNamespace() { return "toy"; }
};
```









### 4. 定义操作数



然后构造一个`Toy_Op`类代表Toy Dialect下所有Operation的基类，后面新增Operation都需要继承这个类。

```c++
// Base class for toy dialect operations. This operation inherits from the base
// `Op` class in OpBase.td, and provides:
//   * The parent dialect of the operation.
//   * The mnemonic for the operation, or the name without the dialect prefix.
//   * A list of traits for the operation.
class Toy_Op<string mnemonic, list<OpTrait> traits = []> :
    Op<Toy_Dialect, mnemonic, traits>;
```

下面给出`transpose` Operation的定义感受一下：

```c++
def TransposeOp : Toy_Op<"transpose"> {
  let summary = "transpose operation";

  let arguments = (ins F64Tensor:$input);
  let results = (outs F64Tensor);

  let assemblyFormat = [{
    `(` $input `:` type($input) `)` attr-dict `to` type(results)
  }];

  // Allow building a TransposeOp with from the input operand.
  let builders = [
    OpBuilder<(ins "Value":$input)>
  ];

  // Invoke a static verify method to verify this transpose operation.
  let verifier = [{ return ::verify(*this); }];
}
```

在继承`Toy_Op`的基础上，还使用TableGen语法定义了描述信息，参数，值，builder，verfier这些元素。

编写完`td`文件之后，就可以使用`mlir-tblgen`工具生成C++代码，先使用下面的命令生成Dialect的C++代码：`./mlir-tblgen -gen-dialect-decls llvm-project/mlir/examples/toy/Ch2/include/toy/Ops.td -I ../../mlir/include/`

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uDKbdKfH14Z3he5rKttLrncOM0Y1S4ocA1Y3pHTvibe9ezyJXcbyWbibicDk2eWy81IhscWsDKFoV4w/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)自动生成的Toy Dialect C++代码

把上面的命令换成`./mlir-tblgen -gen-op-defs llvm-project/mlir/examples/toy/Ch2/include/toy/Ops.td -I ../../mlir/include/` 就可以生成Operation的C++代码。感兴趣的读者可自行查看。

与工具链 toyc-ch2 的联系，查看CMakeList.txt 文件（默认位置为 `llvm-project/mlir/examples/toy/Ch2/include/toy`）：

```c++
set(LLVM_TARGET_DEFINITIONS Ops.td)
mlir_tablegen(Ops.h.inc -gen-op-decls)
mlir_tablegen(Ops.cpp.inc -gen-op-defs)
mlir_tablegen(Dialect.h.inc -gen-dialect-decls)
mlir_tablegen(Dialect.cpp.inc -gen-dialect-defs)
add_public_tablegen_target(ToyCh2OpsIncGen)
```

使用mlir-tblgen搭配 `-gen-op-decls` 和 `-gen-op-defs` 选项，生成 Ops.h.inc 声明代码和 Ops.cpp.inc 定义代码，将两者作为构建工具链 toyc-ch2 的代码依赖。

总结一下，Chapter2主要介绍了MLIR中的MLIRGen，Dialect，Operation以及TableGen这几个MLIR的核心组成部分以及它们是如何相互作用的。它们的关系可以借用中科院Zhang Hongbin同学的PPT来更好的描述：

![图片](https://mmbiz.qpic.cn/mmbiz_png/SdQCib1UzF3uDKbdKfH14Z3he5rKttLrn14CXAZj9IYrYbwYpibkmiatsxA74NTRS3ZThKYnsr3PdricqicHxv3CYvQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

