

https://zhuanlan.zhihu.com/p/423824931



Relay IR是一个函数式、可微的、静态的、针对机器学习的领域定制编程语言。Relay IR解决了普通DL框架不支持control flow（或者要借用python 的control flow，典型的比如TorchScript）以及dynamic shape的特点，使用lambda calculus作为基准IR。

Relay IR可以看成一门编程语言，在灵活性上比ONNX更强。但Relay IR并不是一个独立的IR，它和TVM相互耦合，这使得用户想使用Relay IR就需要基于TVM进行开发，这对一些用户来说是不可接受的。