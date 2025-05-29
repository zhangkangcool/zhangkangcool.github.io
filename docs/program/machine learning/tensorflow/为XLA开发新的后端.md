## 为XLA开发新的后端



本初步指南适用于希望以有效方式轻松将TensorFlow重新定位到其硬件的早期采用者。本指南不是分步介绍的，并且假定您具有[LLVM](http://llvm.org/) ， [Bazel](https://bazel.build/)和TensorFlow的知识。

XLA提供了一个抽象接口，新架构或加速器可以实现该抽象接口，以创建后端来运行TensorFlow图。与为新硬件实现每个现有的TensorFlow Op相比，重新定向XLA应该明显更简单且可扩展。

大多数实现将属于以下情况之一：

1. 带有或不带有现有[LLVM](http://llvm.org/)后端的XLA尚未正式支持现有的CPU体系结构。
2. 具有现有LLVM后端的非CPU类硬件。
3. 没有现有LLVM后端的非CPU类硬件。

> **注意：** LLVM后端可以表示正式发布的LLVM后端之一，也可以指内部开发的定制LLVM后端。

## 方案1：XLA尚未正式支持现有的CPU体系结构

在这种情况下， [请先](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/cpu/)查看现有的[XLA CPU后端](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/cpu/) 。 XLA可以通过使用LLVM轻松将TensorFlow重定向到不同的CPU，因为CPU的XLA后端之间的主要区别是LLVM生成的代码。 Google针对X64和ARM64体系结构测试了XLA。

如果硬件供应商为其硬件提供了LLVM后端，则将后端与使用XLA构建的LLVM链接起来很简单。在JIT模式下，XLA CPU后端为主机CPU发出代码。对于提前编译， [`xla::AotCompilationOptions`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/compiler.h)可以提供LLVM三元组来配置目标体系结构。

如果没有现有的LLVM后端，但存在另一种代码生成器，则应该可以重用大多数现有的CPU后端。

## 方案2：具有现有LLVM后端的非CPU类硬件

可以在现有[`xla::CPUCompiler`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/cpu/cpu_compiler.cc)和[`xla::GPUCompiler`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/gpu/nvptx_compiler.cc)类上为新的[`xla::Compiler`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/compiler.h)实现[`xla::GPUCompiler`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/gpu/nvptx_compiler.cc) ，因为它们已经发出了LLVM IR。根据硬件的性质，可能必须更改许多LLVM IR生成方面，但是可以与现有后端共享许多代码。

一个很好的例子是XLA的[GPU后端](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/gpu/) 。 GPU后端针对非CPU的ISA，因此其代码生成的某些方面对于GPU域而言是唯一的。其他种类的硬件，例如像Hexagon这样的DSP（具有上游LLVM后端），可以重用LLVM IR发射逻辑的一部分，但是其他部分将是唯一的。







## 方案3：没有现有LLVM后端的非CPU类硬件

如果无法利用LLVM，则最好的选择是为所需的硬件为XLA实施新的后端。此选项需要最大的努力。需要实现的类如下：

- [`StreamExecutor`](https://www.tensorflow.org/code/tensorflow/stream_executor/stream_executor.h) ：对于许多设备，并不需要所有`StreamExecutor`方法。有关详细信息，请参见现有的`StreamExecutor`实现。
- [`xla::Compiler`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/compiler.h) ：此类将HLO计算的编译封装到`xla::Executable` 。
- [`xla::Executable`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/executable.h) ：此类用于在平台上启动编译的计算。
- [`xla::TransferManager`](https://www.tensorflow.org/code/tensorflow/compiler/xla/service/transfer_manager.h) ：`` 此类使后端能够提供特定于平台的机制，以从给定的设备内存句柄构造XLA文字数据。换句话说，它有助于封装从主机到设备再到设备的数据传输。