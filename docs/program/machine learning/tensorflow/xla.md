<h1 align="center">xla</h1>
xla是tensorflow自带的一个可以支持llvm自定义后端的编译器。其实相当于clang前端。



https://blog.slinuxer.com/2019/06/tensorflow-xla

https://www.jianshu.com/p/1a4fa57d4588?u_atoken=c98bf7c9-d0c0-42fb-9ac1-dd6fb59053ad&u_asession=011e2lP2omchOIdeZGkWtuPh_LfgmmjzlIy26_coCpmfO2KREyvCEXEETQBphvqlhQX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K_SgRGBLKIpECTsmyCnLbx-Pn5sJEo90JdruCukG2OVYmBkFo3NEHBv0PZUm6pbxQU&u_asig=05ReNMps794XZLa2116BvqUYPFmstJ58S6j1HgJfANpAlQvO8tAkUOqWL48od8FVQb4T33W3wJGKdEdayR2H64rH6ZPXaK68FF-kcNoqQJiEJgvE6Q32M2NpIl40yOVrOJ88dh-vxLyFErY8xw4WUUOmhvFIkhw5hadxXnlVD-4zn9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzWegaXXakMSqV4tiLderpbq2BJzI8pZq-_UteI-fo5HJLoLNx2oKfcIBo1yjPF0Bne3h9VXwMyh6PgyDIVSG1W9Pz0H8xKp94HbXWIb0PdUuRuWSBte70yVF-VuwV1s-7Smao2muW7RClUrCvrQEuEFFH1tbhDmxnH9PWvvoVvjqmWspDxyAEEo4kbsryBKb9Q&u_aref=INq52jKIaY29vFMzMQMPXjReTo8%3D







[关于XLA](https://www.tensorflow.org/xla/overview)，Tensorflow给出了比较简略的说明。XLA主要是用来提升计算速度、节省内存（显存）等。XLA的输入语言称为“HLO (High Level Optimizer)”，HLO定义了整个计算图。随后，XLA对HLO进行一些机器无关、高层的优化，然后用LLVM等进行机器相关、底层的优化并生成代码。这个流程如下图所示。

1. 描绘计算图HLO，这一步可以通过tf2xla、xla_client等完成
2. 对HLO进行广义优化（机器无关），如[CSE](https://en.wikipedia.org/wiki/Common_subexpression_elimination)、[Loop Fusion](https://en.wikipedia.org/wiki/Loop_fission_and_fusion)等编译常用[优化策略](https://en.wikipedia.org/wiki/Optimizing_compiler)
3. 针对特定设备，对HLO进行优化
4. LLVM等生成可执行代码



![img](https://blog.slinuxer.com/wp-content/uploads/2019/06/how-does-xla-work.png)





[XLA](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.tensorflow.org%2Fxla)(Accelerated Linear Algebra)是专用于机器学习的编译器，机器学习的运算中99%都是向量乘以矩阵、矩阵乘以矩阵的计算，XLA是专门用来优化这些计算的。

# How to

举个例子，运行在GPU上的`model_fn`函数会顺序调用`multiply`、`add`和`reduce_sum`这三个op，而且`multiply`，也就是`y * z`的计算结果会先从GPU拷贝回host，再拷贝到device作为`add`的input，同样的，add的计算结果也会以相同的方式传递给下一个op。



```python
def model_fn(x, y, z):
  return tf.reduce_sum(x + y * z)
```

显然，对于整个函数来说，将中间变量在host和device间来回倒腾是没有意义的。因此，如果把函数看作一个op，那在计算中产生的中间结果就不必返回到host，少了数据传输的时间开销，就可以大幅提升运算效率。

这种将多个op融合成一个op的方法就称为`fuse`，当前fuse的技术路线有：

- 通过手写或codegen工具来开发fused op，例如在上述例子中就可以开发`tf.fused_reduce_sum(x, y, z)`。它的优点是代码可控性高，易于性能优化，但缺点是程序缺乏灵活性。像Pytorch这种动态图的框架走的就是这条路线，Nvidia的Apex提供有大量fused kernel，对fused kernel感兴趣的，可以读读[LayerNorm核心技术](https://www.jianshu.com/p/b6ab2128cea6)。
- 通过XLA等AI编译器将python函数编译成fused op。这样做的好处是灵活性强，可以fuse任何计算，弊端则是开发难度大，且性能通常会逊色于手写或codegen kernel。

# 性能

XLA的优化当然不只是fuse，还有对计算图的优化，包括删除无效指令、减少内存占用、替换复杂指令等优化。下图是官方提供的性能报告，经XLA优化过后，Tensorflow BERT MLPerf的训练性能提升了~7倍。除了Tensorflow外，XLA还支持[JAX](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fgoogle%2Fjax)、[Julia](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FJuliaTPU%2FXLA.jl)、[PyTorch](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fpytorch%2Fxla)和[Nx](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Felixir-nx%2Fnx)等前端。

![img](https:////upload-images.jianshu.io/upload_images/13575947-22020c557652fa74.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

https://www.tensorflow.org/xla

# Just in time（JIT）

`jit`是指在首次运行时将函数编译成二进制程序，后续再调用该函数时直接运行先前编译好的程序而非python code。`@tf.funciton`修饰的函数（包括它的子函数）会做`jit`。除非signature发生了变化，也就是input的shape或dtype和编译时不同，否则`get_MSE`是不需要重复编译的。



```tsx
@tf.function
def get_MSE(y_true, y_pred):
  print("compiling ...")
  sq_diff = tf.pow(y_true - y_pred, 2)
  return tf.reduce_mean(sq_diff)

get_MSE(tf.constant(1.0), tf.constant(2.0)) # compile
get_MSE(tf.constant(3.0), tf.constant(4.0)) # It won't recompile
get_MSE(tf.ones([2, 2]), tf.ones([2, 2]) # compile again for new signature
```

`@tf.function`将函数内的ops替换成一组（`XlaCompile`, `XlaRun`) ops，在运行时前者负责编译，并将编译结果--`executable`保存到cache，后者负责运行executable。如果cache里已经有编译好的程序就不需要编译了，例如`get_MSE(tf.constant(3.0), tf.constant(4.0))`。

# HLO

XLA编译器支持的语言（IR）是HLO（High Level Operations），顾名思义这些语言是由一个个op组成，因此，我们在编译前需要先从python code中提取出所有ops，再将它们转换成HLO。

JAX通过tracing的方式，从`@jax.jit`修饰的函数中提取ops，这些ops通过`jaxpr`来表示。然后再通过XLA client提供的API为ops生成相应的HLO。PyTorch/XLA也是采用类似的方法来生成HLO。

Tensorflow的`tf2xla`为每个`Op`创建了一个同名的`XlaOp`用于生成HLO，`XlaOp`派生于`Op`，使用相同的注册机制，因此，只要把要编译的子图根据拓扑排序运行一遍就能生成它的HLO。

# 编译

HLO先经过一系列`pass`优化后再将HLO lowering成ISA，最后将编译好的二进制封装到`executable`。

![img](https:////upload-images.jianshu.io/upload_images/13575947-5f547e4ad3269fb5.png?imageMogr2/auto-orient/strip|imageView2/2/w/427/format/webp)

https://www.tensorflow.org/xla/architecture

# Executable

除了二进制程序，它还包含运行该程序所需要的infos和options。调用`executable.run()`就可以执行计算图。



作者：A君来了
链接：https://www.jianshu.com/p/1a4fa57d4588
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。