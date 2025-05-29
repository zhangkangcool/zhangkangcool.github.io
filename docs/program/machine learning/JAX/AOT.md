



https://jax.readthedocs.io/en/latest/aot.html





1. **Stage out** a specialized version of the original Python callable `F` to an internal representation. The specialization reflects a restriction of `F` to input types inferred from properties of the arguments `x` and `y` (usually their shape and element type).
2. **Lower** this specialized, staged-out computation to the XLA compiler’s input language, MHLO.
3. **Compile** the lowered HLO program to produce an optimized executable for the target device (CPU, GPU, or TPU).
4. **Execute** the compiled executable with the arrays `x` and `y` as arguments.

JAX’s AOT API gives you direct control over steps #2, #3, and #4 (but [not #1](https://jax.readthedocs.io/en/latest/aot.html#inspecting-staged-out-computations)), plus some other features along the way. An example:

```python
>>> import jax
>>> import jax.numpy as jnp
>>> import numpy as np

>>> def f(x, y): return 2 * x + y
>>> x, y = 3, 4

>>> lowered = jax.jit(f).lower(x, y)

>>> # Print lowered HLO
>>> print(lowered.as_text())
module @jit_f.0 {
  func.func public @main(%arg0: tensor<i32>, %arg1: tensor<i32>) -> tensor<i32> {
    %0 = mhlo.constant dense<2> : tensor<i32>
    %1 = mhlo.multiply %0, %arg0 : tensor<i32>
    %2 = mhlo.add %1, %arg1 : tensor<i32>
    return %2 : tensor<i32>
  }
}

>>> compiled = lowered.compile()

>>> # Query for cost analysis, print FLOP estimate
>>> compiled.cost_analysis()[0]['flops']
2.0

>>> # Execute the compiled function!
>>> compiled(x, y)
DeviceArray(10, dtype=int32)
```