<h1 align="center">Instruction Selection</h1>




### 1. FastISel(O0)



##### `FastISel.cpp`

```c++
// This file contains the implementation of the FastISel class.
//
// "Fast" instruction selection is designed to emit very poor code quickly.
// Also, it is not designed to be able to do much lowering, so most illegal
// types (e.g. i64 on 32-bit targets) and operations are not supported.  It is
// also not intended to be able to do much optimization, except in a few cases
// where doing optimizations reduces overall compile time.  For example, folding
// constants into immediate fields is often done, because it's cheap and it
// reduces the number of instructions later phases have to examine.
//
// "Fast" instruction selection is able to fail gracefully and transfer
// control to the SelectionDAG selector for operations that it doesn't
// support.  In many cases, this allows us to avoid duplicating a lot of
// the complicated lowering logic that SelectionDAG currently has.
//
// The intended use for "fast" instruction selection is "-O0" mode
// compilation, where the quality of the generated code is irrelevant when
// weighed against the speed at which the code can be generated.  Also,
// at -O0, the LLVM optimizers are not running, and this makes the
// compile time of codegen a much higher portion of the overall compile
// time.  Despite its limitations, "fast" instruction selection is able to
// handle enough code on its own to provide noticeable overall speedups
// in -O0 compiles.
//
// Basic operations are supported in a target-independent way, by reading
// the same instruction descriptions that the SelectionDAG selector reads,
// and identifying simple arithmetic operations that can be directly selected
// from simple operators.  More complicated operations currently require
// target-specific code.
```

