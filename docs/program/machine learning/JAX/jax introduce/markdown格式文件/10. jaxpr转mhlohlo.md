

源码中出现的ir一般是指



`jax_src/lib/mlir`中的

```python
import jaxlib.mlir.ir as ir  # 会引用的mlir/tensorflow提供的一些库

```





`jax/interpreters/mlir.py`

```python
def lower_jaxpr_to_fun(  # 该函数会调用jaxpr_subcomp将jaxpr转为MHLO
    ctx: ModuleContext,
    name: str,
    jaxpr: core.ClosedJaxpr,
    effects: Sequence[core.Effect],
    *,
    create_tokens: bool = False,
    public: bool = False,
    replace_tokens_with_dummy: bool = False,
    replicated_args: Optional[Sequence[bool]] = None,
    arg_shardings: Optional[Sequence[Optional[xc.OpSharding]]] = None,
    result_shardings: Optional[Sequence[Optional[xc.OpSharding]]] = None,
    use_sharding_annotations: bool = True,
    input_output_aliases: Optional[Sequence[Optional[int]]] = None,
    num_output_tokens: int = 0,
) -> func_dialect.FuncOp:
  """Lowers jaxpr and its callees to an IR function.

  Assumes that an MLIR context, location, and insertion point are set.

  Args:
  """
  ...
      out_vals, tokens_out = jaxpr_subcomp(ctx.replace(name_stack=callee_name_stack),
                                         jaxpr.jaxpr, tokens_in, map(ir_constants, jaxpr.consts),
                                         *args)
  ...

# jaxpr转为HMLO
def jaxpr_subcomp(ctx: ModuleContext, jaxpr: core.Jaxpr,
                  tokens: TokenSet,
                  consts: Sequence[Sequence[ir.Value]],
                  *args: Sequence[ir.Value]
                  ) -> Tuple[Sequence[Sequence[ir.Value]], TokenSet]:
  """Lowers a jaxpr into mHLO, inlined into an existing function.

  Assumes that an MLIR context, location, and insertion point are set.
  """
```



即时编译时，生成jaxpr后， jaxpr可以由xla_callable调用jaxpr_subcomp将其编译为XLA HLO程序。

（参考链接：[Autodidax: JAX core from scratch — JAX documentation](https://jax.readthedocs.io/en/latest/autodidax.html?highlight=hlo)）





https://jax.readthedocs.io/en/latest/autodidax.html?highlight=hlo







