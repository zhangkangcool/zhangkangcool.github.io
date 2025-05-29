

# Toy语言和AST

https://mp.weixin.qq.com/s/jMHesvKmAUU5dYH0WznulA

https://mlir.llvm.org/docs/Tutorials/Toy/

https://mlir.llvm.org/docs/Tutorials/Toy/Ch-1/



源码在：`llvm/mlir/examples/toy/Ch1`

test在：`llvm/mlir/test/Examples/ToyCh1`





MLIR提供了一种Toy语言来说明MLIR的定义和执行的流程。Toy语言是一种基于张量的语言，我们可以使用它来定义函数，执行一些数学计算以及输出结果。下面要介绍的例子中限制Tensor的维度是<=2的，并且Toy语言中唯一的数据类型是64位浮点类型，对应C语言中的"double"。另外`Values`是不可以重写的，即每个操作都会返回一个新分配的值，并自动管理释放。直接看下面这个例子：

```shell
def main() {
  # Define a variable `a` with shape <2, 3>, initialized with the literal value.
  # The shape is inferred from the supplied literal.
  var a = [[1, 2, 3], [4, 5, 6]];

  # b is identical to a, the literal tensor is implicitly reshaped: defining new
  # variables is the way to reshape tensors (element count must match).
  var b<2, 3> = [1, 2, 3, 4, 5, 6];

  # transpose() and print() are the only builtin, the following will transpose
  # a and b and perform an element-wise multiplication before printing the result.
  print(transpose(a) * transpose(b));
}
```

类型检查是通过类型推断静态执行的。Toy语言只需在必要时指定Tensor形状的类型声明。下面定义了一个`multiply_transpose`函数，注意这个函数里面参数`a`和`b`的形状我们预先都是不知道的，只有调用这个函数时我们才知道，可以关注一下下面例子中的shape变化。

```shell
# User defined generic function that operates on unknown shaped arguments.
def multiply_transpose(a, b) {
  return transpose(a) * transpose(b);
}

def main() {
  # Define a variable `a` with shape <2, 3>, initialized with the literal value.
  var a = [[1, 2, 3], [4, 5, 6]];
  var b<2, 3> = [1, 2, 3, 4, 5, 6];

  # This call will specialize `multiply_transpose` with <2, 3> for both
  # arguments and deduce a return type of <3, 2> in initialization of `c`.
  var c = multiply_transpose(a, b);

  # A second call to `multiply_transpose` with <2, 3> for both arguments will
  # reuse the previously specialized and inferred version and return <3, 2>.
  var d = multiply_transpose(b, a);

  # A new call with <3, 2> (instead of <2, 3>) for both dimensions will
  # trigger another specialization of `multiply_transpose`.
  var e = multiply_transpose(b, c);

  # Finally, calling into `multiply_transpose` with incompatible shape will
  # trigger a shape inference error.
  var f = multiply_transpose(transpose(a), c);
}
```

然后我们可以使用下面的命令来产生这个Toy语言程序的AST：

```shell
cd llvm-project/build/bin
./toyc-ch1 ../../mlir/test/Examples/Toy/Ch1/ast.toy --emit=ast
```



上面Toy程序产生的AST长下面这样：

```shell
Module:
    Function 
      Proto 'multiply_transpose' @../../mlir/test/Examples/Toy/Ch1/ast.toy:4:1
      Params: [a, b]
      Block {
        Return
          BinOp: * @../../mlir/test/Examples/Toy/Ch1/ast.toy:5:25
            Call 'transpose' [ @../../mlir/test/Examples/Toy/Ch1/ast.toy:5:10
              var: a @../../mlir/test/Examples/Toy/Ch1/ast.toy:5:20
            ]
            Call 'transpose' [ @../../mlir/test/Examples/Toy/Ch1/ast.toy:5:25
              var: b @../../mlir/test/Examples/Toy/Ch1/ast.toy:5:35
            ]
      } // Block
    Function 
      Proto 'main' @../../mlir/test/Examples/Toy/Ch1/ast.toy:8:1
      Params: []
      Block {
        VarDecl a<> @../../mlir/test/Examples/Toy/Ch1/ast.toy:11:3
          Literal: <2, 3>[ <3>[ 1.000000e+00, 2.000000e+00, 3.000000e+00], <3>[ 4.000000e+00, 5.000000e+00, 6.000000e+00]] @../../mlir/test/Examples/Toy/Ch1/ast.toy:11:11
        VarDecl b<2, 3> @../../mlir/test/Examples/Toy/Ch1/ast.toy:15:3
          Literal: <6>[ 1.000000e+00, 2.000000e+00, 3.000000e+00, 4.000000e+00, 5.000000e+00, 6.000000e+00] @../../mlir/test/Examples/Toy/Ch1/ast.toy:15:17
        VarDecl c<> @../../mlir/test/Examples/Toy/Ch1/ast.toy:19:3
          Call 'multiply_transpose' [ @../../mlir/test/Examples/Toy/Ch1/ast.toy:19:11
            var: a @../../mlir/test/Examples/Toy/Ch1/ast.toy:19:30
            var: b @../../mlir/test/Examples/Toy/Ch1/ast.toy:19:33
          ]
        VarDecl d<> @../../mlir/test/Examples/Toy/Ch1/ast.toy:22:3
          Call 'multiply_transpose' [ @../../mlir/test/Examples/Toy/Ch1/ast.toy:22:11
            var: b @../../mlir/test/Examples/Toy/Ch1/ast.toy:22:30
            var: a @../../mlir/test/Examples/Toy/Ch1/ast.toy:22:33
          ]
        VarDecl e<> @../../mlir/test/Examples/Toy/Ch1/ast.toy:25:3
          Call 'multiply_transpose' [ @../../mlir/test/Examples/Toy/Ch1/ast.toy:25:11
            var: b @../../mlir/test/Examples/Toy/Ch1/ast.toy:25:30
            var: c @../../mlir/test/Examples/Toy/Ch1/ast.toy:25:33
          ]
        VarDecl f<> @../../mlir/test/Examples/Toy/Ch1/ast.toy:28:3
          Call 'multiply_transpose' [ @../../mlir/test/Examples/Toy/Ch1/ast.toy:28:11
            Call 'transpose' [ @../../mlir/test/Examples/Toy/Ch1/ast.toy:28:30
              var: a @../../mlir/test/Examples/Toy/Ch1/ast.toy:28:40
            ]
            var: c @../../mlir/test/Examples/Toy/Ch1/ast.toy:28:44
          ]
      } // Block
```

AST的解析具体实现在`mlir/examples/toy/Ch1/include/toy/Parser.h`和`mlir/examples/toy/Ch1/include/toy/Lexer.h`中，感兴趣的读者可以看一下。我对这一块并不熟悉，就暂时不深入下去了，但这个AST看起来还是比较直观的，首先有两个Function对应了Toy程序里面的`multiply_transpose`和`main`，Params表示函数的输入参数，Proto表示这个函数在`ast.toy`文件中的行数和列数，BinOp表示`transpose(a) * transpose(b)`中的`*`是二元Op，并列出了左值和右值。其它的以此类推也比较好理解。

第一章就是简单介绍了一下Toy语言的几个特点以及Toy示例程序产生的AST长什么样子，如果对AST的解析感兴趣可以去查看代码实现。