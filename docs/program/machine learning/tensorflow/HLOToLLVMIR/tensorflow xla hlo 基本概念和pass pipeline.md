https://zhuanlan.zhihu.com/p/71980945



## tensorflow xla hlo 基本概念和pass pipeline



经过tf2xla后，得到的是一个hlo的图，这个图就和编程语言非常像了。

其中涉及到3个概念，hlo module, computation, instruction。

- hlo module用源码注释的解释，就是一个编译单元，相当于是一个完整可运行的程序。
- 既然是一个程序，就有入口函数，也就是 entry_*computation，*每个module都有且仅有一个entry_computation，相当于main函数，有输入和输出，输入可以是多个参数，但输出只有一个（root instruction的值），如果要返回多个值，需要把多个值构造成一个元组（tuple）返回。
- 一个module可以包含多个computation，除了entry_computation，其他的都是"nested"，也就是被调用。
- HLO instructions就是op了，对应了官网上列出的operation semantics，看注释已经解释的非常清楚了，op融合和向llvm ir转换都是在这个层面进行的。

```text
// HLO instructions are the atomic unit of the high-level compiler's IR.
//
// HloInstructions live inside of an HloComputation, which is analogous to a
// function in other programming languages.  Nodes have no total order within
// their computation.  Instead, they have a partial ordering determined by their
// data and control dependencies.
//
// HLO does not have basic blocks or explicit "branch" instructions.  Instead,
// certain HloInstructions -- namely, kWhile, kConditional, and kCall -- encode
// control flow.  For example, the kConditional HLO executes one of two possible
// computations, depending on the runtime value of a predicate.
//
// HLO is pure (mostly).  It has no concept of mutable state.  Instead, data
// values are produced by one HLO and flow into consumers across dependency
// edges.
```

举hlo.proto里的一个例子:

```text
   ENTRY main {
     a = f32[] parameter(0)
     b = f32[10] parameter(1)
     ROOT root = (f32[], f32[10]) tuple(%a, %b)
   }
```

一个简单的直接返回输入的图，用hlo表达就是上面这个样子，有输入参数，有root指令，有entry_computation，然后这整个就是一个module。

看源码的时候需要注意的是，tf2xla目录是调用了xla目录里的函数，xla目录内的结构本身又是client/service结构的，service是真正的定义和调用发生处，client是对service的封装，xla_*b*uilder就在client内。而hlo的定义都在service内，但在tf2xla中还可以看到两个概念：xla_expression和xla_resource。

- xla_expression 可以表示常量、符号值、变量和列表，但我理解最重要的是符号值的表示
- xla_resource 表示hlo中的变量，这个不是很好理解，我理解如果xla只是作为推理用，那么hlo中除了输入参数，其他的参数都会转换成常量吧，这个变量应该是表示需要更新的数据，所以可能是表示梯度？用于训练？当然还有一个用途就是表示最终的输出值，这个毫无疑问，或者需要嵌套computation的时候，表示被嵌套computation的输出，被其他computation引用。

得到hlo graph后，就需要做high level optimize了。此处调用代码：

```text
aot_or = client->CompileAheadOfTime({instance}, aot_opts);
```

通过xla的client（compile_only*client）*最终调用到cpu_compiler或gpu_compiler。

如何做优化，结构很简单，就是通过一个pipeline（HloPassPipeline）把所有的pass串起

来。

完成了各种pass优化和变换后，就是hlo_dataflow_analysis，最后是buffer_assignment。

所以整个流程就是

```
graph compile -> hlo graph build -> hlo pass pipelime -> hlo dataflow analysis -> codegen
```

