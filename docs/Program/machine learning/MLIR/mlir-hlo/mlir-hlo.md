<h1 align="center">mlir-hlo</h1>
https://github.com/tensorflow/mlir-hlo/tree/1857b1eac21ef5b30b088ccc79ef2fa0e3161621



整个项目在`tensorflow/compiler/xla/mlir_hlo`下。





`chlo`, `mhlo`, `lmhlo`在tensorflow的代码中，也可以单独拿出来使用

`chlo --> mhlo <--> lmhlo`



## Overview

MLIR-HLO aims to provide an end-to-end compiler for CPU and GPU, as well as building reusable blocks for other accelerators. This is heavily inspired by the success of XLA.

[XLA](https://www.tensorflow.org/xla/) (Accelerated Linear Algebra) is a domain-specific compiler framework and execution environment for linear algebra, which powers code-generation for ML frameworks like TensorFlow, JAX, and others.

A cornerstone of XLA is the HLO (High Level Optimizer) IR, which offers a carefully fixed selected list of operations, mostly orthogonal to each other. It provides an efficient optimizer for computations expressed with this set of operations and generate codes for hardware platforms like CPU, GPU, and TPUs. Its goal is to provide a uniform interface to compile and execute these optimized HLO programs independently of the targeted device. It is not a front-end ML system like TensorFlow or JAX, rather it is a backend framework that optimizes HLO and lowers to machine code.

The HLO set of operations is closed and has well defined semantics. HLO operations operate on immutable Tensors with static shapes (actually bounded shapes to be exact) and explicit broadcasts.

[MLIR](https://mlir.llvm.org/) is a compiler infrastructure which intends to come with "battery included", as such it intends to provide all the blocks required to assemble graph optimization and codegen pipelines. The longer term roadmap for MLIR is to provide a [Tensor Compute Primitive](https://llvm.discourse.group/c/mlir/MLIR-TCP-WG/36) (TCP) dialect, which should hopefully be general enough to model what HLO represents today (see [slides](https://drive.google.com/open?id=1iljcpTQ5NPaMfGpoPDFml1XkYxjK_6A4) and [recording](https://drive.google.com/open?id=1jSPa8TwPKUt0WuLquGc8OgSUVYJHMvWZ) for a technical discussion on this topic).

The work on MLIR-HLO can be seen as a stepping stone towards building TCP, while integrating intermediate components into XLA itself by relying on the well-proven HLO IR and introducing more pieces from upstream MLIR ([Linalg](https://mlir.llvm.org/docs/Dialects/Linalg/), [Vector](https://mlir.llvm.org/docs/Dialects/Vector/), [GPU](https://mlir.llvm.org/docs/Dialects/GPU/) dialect, ...). [This document](https://www.tensorflow.org/mlir/xla_gpu_codegen) provides more information on the current migration of the XLA GPU codegen.

## MLIR Dialects for XLA-style compilation

This repository defines three dialects to support a HLO-like compilation pipeline using MLIR:

- `chlo`: the "client" HLO dialect, intended to be closer to the frontend (including implicit broadcast semantics).
- `mhlo`: "meta"-HLO dialect ; similar to `xla_hlo`, but with extensions for dynamic shape support.
- `lmhlo`: "late"-"meta"-HLO, it is the IR after buffer allocation is performed. In XLA the buffer allocation is a side-data structure which keeps track of these informations, while this separate dialect materializes it in the IR.

We describe these in more details below.

----



### HLO Client Dialect: `chlo`.

``mlir_hlo/include/mlir-hlo/Dialect/mhlo/IR/chlo_ops.h`

```c++
namespace mlir {
namespace chlo {

class ChloDialect : public Dialect {
  void initialize();

 public:
  explicit ChloDialect(MLIRContext* context)
      : Dialect(getDialectNamespace(), context, TypeID::get<ChloDialect>()) {
    initialize();
  }
  Operation* materializeConstant(OpBuilder& builder, Attribute value, Type type,
                                 Location loc) override;
  static StringRef getDialectNamespace() { return "chlo"; }
};

}  // namespace chlo
}  // namespace mlir

```



- It was originally designed to map the [XLA client APIs](https://www.tensorflow.org/xla/operation_semantics) (e.g., ops supports implicit broadcast and roughly modeled on XlaBuilder API) modulo support for dynamic shapes and additional ops required to support dynamic client side HLOs.
- Ops can be from either the XlaBuilder or XLA helper functions can be converted into ops (e.g., given ambiguity in what constitutes these ops, there is some freedom to decide), the goal of this dialect is to correspond close to client level and enable a thin layer between client use and op construction (making it cheap to construct and optimizations on the dialect close to optimizations on the client ops).

Entry:

- The vast majority of old "client" interactions are via the XlaBuilder APIs. These APIs are used by TF2XLA kernels, JAX, PyTorch bridge and directly. The legalization path (described below) can also reuse the XlaBuilder's APIs to construct XLA Client HLO ops directly (this uses MlirXlaBuilder which is a subclass of XlaBuilder).
- The other entry point is during legalization from TensorFlow ops in the TF Graph Compiler and other tools (e.g., SavedModel lowering and TFCompile).

Exit:

- MHLO
- May be exported to xla::HloInstructionProto by invoking the XlaBuilder APIs (with regular XlaBuilder)

The `chlo` dialect started originally as mapping to the XLA client Builder APIs. It enables it to both be constructed and converted back to existing XLA interfaces using the XlaBuilder API. Due to the way that translation into and out of the dialect works, there is no expectation that this dialect roundtrips to XLA (e.g., it is only intended to be translated to MLIR and then legalized to another dialect or translated to HloInstructionProto).

The export approach of reusing the XlaBuilders enables reusing a lot of logic that was already implemented in terms of computing shapes, inserting broadcasts etc.

An important topic here is that XLA Client HLO ops are not a well defined set. And in particular what some would consider helper functions, others would consider ops. It should be easy to move between these and so define a new op along with the helper function or autogenerate the helper functions from the descriptions of the ops. For the former, a simple approach would be to simply consider the context in which the op is being constructed and if an MLIR one, construct a op in the client dialect instead of further calls into XlaBuilder. The latter could be implemented by adding the op and a legalization of the op to other known ops, from which a helper function can get generated that could be used as regular.

Status: Exists but need to be cleaned up.

-----------

### Meta HLO Dialect `mhlo`

`mlir_hlo/include/mlir-hlo/Dialect/mhlo/IR`

```c++
├── CMakeLists.txt
├── IR
│   ├── chlo_ops.h    // chlo定义
│   ├── chlo_ops.td
│   ├── CMakeLists.txt
│   ├── hlo_ops_base_attrs.td
│   ├── hlo_ops_base_enums.td
│   ├── hlo_ops_base.h
│   ├── hlo_ops_base.td
│   ├── hlo_ops_common.h
│   ├── hlo_ops.h    // mhlo定义
│   ├── hlo_ops.td
│   ├── hlo_utils.td
│   └── register.h
└── transforms
    ├── bufferizable_op_interface_impl.h
    ├── CMakeLists.txt
    ├── legalize_to_linalg_utils.h
    ├── map_chlo_to_hlo_op.h       // chlo -> hlo
    ├── map_mhlo_to_scalar_op.h
    ├── mhlo_passes.td
    ├── PassDetail.h
    ├── passes.h
    ├── register_passes.h
    ├── rewriters.h
    └── type_conversion.h

```





其中的`hlo_ops.h`中

```c++
class ChloDialect : public Dialect {
 public:
  explicit ChloDialect(MLIRContext* context);
  static StringRef getDialectNamespace() { return "chlo"; }

  Operation* materializeConstant(OpBuilder& builder, Attribute value, Type type,
                                 Location loc) override;

  Attribute parseAttribute(DialectAsmParser& parser, Type type) const override;

  void printAttribute(Attribute attr, DialectAsmPrinter& os) const override;
};

}  // namespace chlo
}  // namespace mlir
```



- Dialect is closer to current HLO server ops (e.g., no implicit broadcast)
- MHLO dialect where we can deviate from the requirements of the client or server dialect, in particular:
  - Control flow ops with implicit capture to enable simpler optimizations (e.g., generic LICM, unroll & jam, etc.)
  - Multiple results ops (e.g., no tuples)
  - More ops (for example, unique op or assert op), and ops that don't need to be added to either client or server dialect.
  - Op set not constrained by implementation (e.g., hlo.add operating on say i79 or !mydialect.weird_type is allowed even though no XLA backend supports it). Verification on types happening at the boundaries.
  - It does not need to preserve some deprecated XLA constructs (e.g. stateful RNG HLO).
  - More dynamic shape support ops without need for updating all users/backends.
- This dialect enables evolving HLO independently from XLA in order to experiment with features we'd like to upstream in MLIR TCP. In particular it intends to be user-extensible through [interfaces](https://mlir.llvm.org/docs/Interfaces/).
- It should have no TensorFlow, or proto, or other Google internal dependencies.
- It need not be a complete superset of ops compared to XLA HLO dialect.

Entry:

- Legalization from `chlo` dialect or conversion from XLA HLO.
- Directly emitted from TF Graph Compiler;
- Builder call (e.g., EDSL);

Exit:

- LMHLO, Linalg IREE, directly used in codegen.
- XLA HLO.

The MHLO dialect has no direct export format, it is only meant as an intermediate optimization dialect/format. It is also where we can experiment cheaply with new ops. This format will be where the representation would differ from existing endpoints.

Status: Exists but need to be cleaned up and evolved, in particular with respect to supporting dynamic shapes.

MHLO differs from XLA HLO op set in multiple ways, including:

1. MHLO While accepts multiple operands and may produce multiple results instead;

### LMHLO

`mlir_hlo/include/mlir-hlo/Dialect/lhlo`有各种头文件，td文件等，



```c++
lhlo
├── CMakeLists.txt
├── IR   // lhlo相关的td文件
│   ├── CMakeLists.txt
│   ├── lhlo_dialect.td
│   ├── lhlo_ops_base.td
│   ├── lhlo_ops.h
│   ├── lhlo_ops_structs.h
│   ├── lhlo_ops_structs.td
│   ├── lhlo_ops.td
│   ├── lhlo_structured_interface.h
│   └── lhlo_structured_interface.td
└── transforms
    ├── CMakeLists.txt
    ├── lhlo_elemental_utils.h
    ├── lmhlo_passes.td
    ├── map_hlo_to_lhlo_op.h   // hlo --> lhlo
    ├── map_lhlo_to_hlo_op.h   // lhlo --> hlo
    ├── map_lmhlo_to_scalar_op.h
    ├── PassDetail.h
    ├── passes.h
    └── register_passes.h

```





其中`IR/lhlo_ops.h`

```c++
#include "mlir-hlo/Dialect/lhlo/IR/lhlo_structured_interface.h"

namespace mlir {
namespace lmhlo {

#include "mlir-hlo/Dialect/lhlo/IR/lhlo_structured_interface.cpp.inc"

}  // namespace lmhlo
}  // namespace mlir
```



LMHLO corresponds to late `mhlo` and operates on buffer domain (e.g., memref) with side-effecting operations. The lowering from `mhlo` dialect proceeds by way of scheduling, memory and buffer allocation. The current mapping is directly on XLA Client HLOs but without implicit broadcast and with operation on memrefs. This dialect will instead be rebased on `mhlo` dialect but operating on buffers still.

Entry:

- Post buffer assignment on `mhlo` dialect, or from XLA after buffer assignment.

Exit:

- Codegen (LLVM IR in the common cases at the moment)