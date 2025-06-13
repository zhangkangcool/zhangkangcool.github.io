<h1 align="center">relay到llvm ir 5</h1>
https://zhuanlan.zhihu.com/p/165238422



代码行数可能和现在的有些出入，目前来讲改动还不是很剧烈，无伤大雅。

现在是属于ScheduleGetter的Create时间。

还是拆为若干逻辑部分来看，第一部分是对参数的处理。

```c++
CachedFunc Create(const Function& prim_func) {
    auto cache_node = make_object<CachedFuncNode>();
    cache_node->target = target_;
    for (Var param : prim_func->params) {
      Array<tvm::te::Tensor> inputs;
      if (const auto* ttype = param->checked_type().as<TensorTypeNode>()) {
        tvm::te::Tensor tensor = tvm::te::placeholder(GetShape(ttype->shape), ttype->dtype);
        cache_node->inputs.push_back(tensor);
        inputs.push_back(tensor);
      } else {
        // flatten tuple of tensor type.
        const auto* tuple_type = param->type_as<TupleTypeNode>();
        for (Type field : tuple_type->fields) {
          const auto* ttype = field.as<TensorTypeNode>();
          // TODO(@icemelon): Allow recursive tuple
          CHECK(ttype != nullptr);
          tvm::te::Tensor tensor = tvm::te::placeholder(GetShape(ttype->shape), ttype->dtype);
          cache_node->inputs.push_back(tensor);
          inputs.push_back(tensor);
        }
      }
      memo_[param] = inputs;
    }
    ...
}
```

上回说到CreateSschedule将relay IR转为Tensor和Operation构成的数据流图，这里就是把Function各参数输入转换为placeholder这玩意，placeholder表示一个占位符，表示还没有确定的Tensor，约束了该Tensor的形状和类型。看<dive into deep learning compiler>里经常出现te.placeholder就是生成出玩意的实例。处理tuple参数的方法是在else块中将他们都flatten。

```c++
 CachedFunc Create(const Function& prim_func) {
    ...
    readable_name_stream_ << "fused";
    cache_node->outputs = this->VisitExpr(prim_func->body);
    auto candidate_name = readable_name_stream_.str();
    constexpr static size_t kMaxFuncNameLength = 80;
    if (candidate_name.size() > kMaxFuncNameLength) {
      std::stringstream truncated_name;
      truncated_name << candidate_name.substr(0, kMaxFuncNameLength);
      truncated_name << "_" << std::hash<std::string>{}(candidate_name) << "_";
      candidate_name = truncated_name.str();
    }
    cache_node->func_name = candidate_name;

    CHECK(master_op_.defined());
    ...
}
```

这是第二部分，又出现了VisitExpr，这就是把relay不同类型表达式转换成Tensor & Operation的主要逻辑了。最后会用cache_node->outputs来保存转换后该函数所有输出的tensor(s)，用作之后创建Schedule，有兴趣可以瞅瞅对各种Relay Expr都是怎么处理的。

俺这里还是关注Array<te::Tensor> VisitExpr_(const CallNode* call_node)。按打算将这函数切俩半来学习。

```c++
Array<te::Tensor> VisitExpr_(const CallNode* call_node) final {
    static auto fpattern = Op::GetAttrMap<TOpPattern>("TOpPattern");
    static auto flower_call = tvm::runtime::Registry::Get("relay.backend.lower_call");
    CHECK(flower_call) << "relay.backend.lower_call is not registered.";

    Array<te::Tensor> inputs;
    int count_tuple = 0;
    for (Expr arg : call_node->args) {
      if (arg->checked_type().as<TupleTypeNode>()) {
        ++count_tuple;
      }
      for (te::Tensor tensor : VisitExpr(arg)) {
        inputs.push_back(tensor);
      }
    }
    if (count_tuple) {
      CHECK_EQ(call_node->args.size(), 1U) << "Only allow function with a single tuple input";
    }

    CHECK(call_node->op.as<OpNode>()) << "Primitive function only allows call into primitive ops";
    Op op = Downcast<Op>(call_node->op);
    
    Array<te::Tensor> outputs;
    OpImplementation impl;
    // Skip fcompute for device copy operators as it is not registered.
    if (op == device_copy_op_) {
      const auto* copy_input = inputs[0].operator->();
      outputs.push_back(te::Tensor(copy_input->shape, copy_input->dtype, te::Operation(), 0));
    } else {
      LoweredOutput lowered_out = (*flower_call)(GetRef<Call>(call_node), inputs, target_);
      outputs = lowered_out->outputs;
      impl = lowered_out->implementation;
    }
    ...
}
```

这是前半部分代码，对该CallNode的实参们调用VisitExpr，获得实参(们)转换后得的Tensor(s)。还有就是获得存储各Op模式(Pattern)的表的引用，存在fpattern变量种。以及使flower_call成为指向函数lower_call的引用。

fpattern可以认为是kv map，键类型是Op(即relay::Op)，每个实例代表系统已注册的各个relay op。值类型则是枚举类型OpPatternKind的值。OpPatternKind定义在include/tvm/relay/op_attr*_*types.h:45, 源码如下:

```c++
enum OpPatternKind {
  // Elementwise operation
  kElemWise = 0,
  // Broadcasting operator, can always map output axis to the input in order.
  // for example :code:`out[i, ax1, j, ax2] = input[i, j]`.
  // Note that the axis need to be in order so transpose is not a bcast operator.
  kBroadcast = 1,
  // Injective operator, can always injectively map output axis to a single input axis.
  // All injective operator can still be safely fused to injective and reduction.
  kInjective = 2,
  // Communicative reduction operator.
  kCommReduce = 3,
  // Complex operation, can still fuse elemwise operations into its output.
  // but cannot chain another complex op
  kOutEWiseFusable = 4,
  // The pattern for tuple nodes. Can fuse into subsequent injective ops,
  // but treated specially
  kTuple = 7,
  // Opaque operation, cannot fuse anything.
  kOpaque = 8
};
```

不过寥寥几种，似乎值越大表示复杂度越高。模式的具体作用在后半部分讨论。

而lower_call是一个python函数，定义在**python/tvm/relay/backend/compile_engine.py:229**。作用是将一个调用表达式转换为被调用Op最优的OpImplementation，以及该调用表达式输出的Tensor(s)。回忆上一篇，OpImplementation是平台相关的，如果我们想部署在CPU平台上，总不能生成一个cuda kernel吧...

先判断该Op是否为host <-> device的数据传输操作，如果是的话处理比较简单，就8说了。如果不是，则会调用刚刚获得的lower_call来获取OpImplementation和输出，保存到lowered_out 中，这个lowered_out 可以理解为类型是（OpImplementation， Array<Tensor>）的Tuple。

以下是lower_call的代码。

```python
@tvm._ffi.register_func("relay.backend.lower_call")
def lower_call(call, inputs, target):
    """Lower the call expression to op implementation and tensor outputs."""
    assert isinstance(call.op, tvm.ir.Op)
    op = call.op

    # Prepare the call_node->checked_type(). For the call node inputs, we ensure that
    # the shape is Int32. Following code ensures the same for the output as well.
    # TODO(@icemelon9): Support recursive tuple
    ret_type = call.checked_type
    if isinstance(ret_type, _ty.TensorType):
        ret_type = _ty.TensorType(get_shape(ret_type.shape), ret_type.dtype)
    elif isinstance(ret_type, _ty.TupleType):
        new_fields = []
        for field in ret_type.fields:
            if isinstance(field, _ty.TensorType):
                new_fields.append(_ty.TensorType(get_shape(field.shape), field.dtype))
            else:
                new_fields.append(field)
        ret_type = _ty.TupleType(new_fields)

    is_dyn = _ty.type_has_any(call.checked_type)
    for arg in call.args:
        is_dyn = is_dyn or _ty.type_has_any(arg.checked_type)

    # check if in the AutoTVM tracing mode, and disable if op is not in wanted list
    env = autotvm.task.TaskExtractEnv.current
    reenable_tracing = False
    if env is not None and env.tracing:
        if env.wanted_relay_ops is not None and op not in env.wanted_relay_ops:
            env.tracing = False
            reenable_tracing = True

    if not is_dyn:
        best_impl, outputs = select_implementation(
            op, call.attrs, inputs, ret_type, target)
        logger.info("Use implementation %s for op %s", best_impl.name, op.name)
    else:
        # TODO(@icemelon9): Allow tvm to generate multiple kernels for dynamic shapes.
        #   Currently, we just use the implementation with highest plevel
        best_impl, outputs = select_implementation(
            op, call.attrs, inputs, ret_type, target, use_autotvm=False)

    # re-enable AutoTVM tracing
    if reenable_tracing:
        env.tracing = True
    return LoweredOutput(outputs, best_impl)
```

真的很冗长...

ret_type那部分就是构造等价的输出类型，不难理解。

然后就是判断输入/输出的Tensor(们)的类型是不是动态的，结果保存在布尔变量is_dyn中。源码在**src/relay/analysis/[http://util.cc:423](https://link.zhihu.com/?target=http%3A//util.cc%3A423)**，主体类是IsDynamicVisitor。动态Tensor的判断条件是Tensor的各个维度是否允许为任何值，代码中用AnyNode表示。而我们的简单例子中，is_dyn为假。

下边的AutoTVM相关的我暂时还不是太了解。

因为is_dyn为假，if判断条件成立，便会在调用select_implementation时默认启用autotvm。lower_call最后会将select_implementation的结果以LoweredOutput实例返回。

select_implementation的作用是为op选取最优的OpImplementation，其注释上说，如果启用了AutoTVM则使用相关机制来决策，没有的话就选用最高有优先级的实现。俺将它的代码拆分成常规决策和使用AutoTVM两部分, 以下为第一部分:

```python
def select_implementation(op, attrs, inputs, out_type, target, use_autotvm=True):
    all_impls = get_valid_implementations(op, attrs, inputs, out_type, target)

    best_plevel_impl = None
    for impl in all_impls:
        if best_plevel_impl is None or impl.plevel > best_plevel_impl.plevel:
            best_plevel_impl = impl
    if not use_autotvm:
        outs = best_plevel_impl.compute(attrs, inputs, out_type)
        return best_plevel_impl, outs
    ... 
```



上回给到select_implementation的第一部分代码，瞅瞅它干了啥。

首先是调用了**get_valid_implementations**获得所有的候选实现。省掉注释后的代码长这样:

```python
def get_valid_implementations(op, attrs, inputs, out_type, target):
    fstrategy = op.get_attr("FTVMStrategy")
    assert fstrategy is not None, "%s doesn't have FTVMStrategy registered" % op.name
    with target:
        strategy = fstrategy(attrs, inputs, out_type, target)
    analyzer = tvm.arith.Analyzer()
    ret = []
    for spec in strategy.specializations:
        if spec.condition:
            # check if all the clauses in the specialized condition are true
            flag = True
            for clause in spec.condition.clauses:
                clause = analyzer.canonical_simplify(clause)
                if isinstance(clause, tvm.tir.IntImm) and clause.value:
                    continue
                flag = False
                break
            if flag:
                for impl in spec.implementations:
                    ret.append(impl)
        else:
            for impl in spec.implementations:
                ret.append(impl)
    return ret
```

在[第三篇](https://zhuanlan.zhihu.com/p/164931829)中，已经简要介绍了OpStrategy的角色，结合官方文档，这里不再累述。OpStrategy是存在对应Op的属性表中，所以第一句话是通过传入Op的键为“FTVMStrategy”从属性表中获得对应的OpStrategy。然后遍历OpStrategy包含的所有OpSpecialization实例，如果当前环境满足该实例下的全部条件子句(condition clause)，则把该OpSpecialization实例下的全部实现(**OpImplementation**)加入到**ret**中。ret是元素类型为OpImplementation的数组。最后将ret返回。

Ps: 以后有需要再去探究各个条件从句是啥，这里只管主线剧情就好了。

那么回到select_implementation中。下一步就是遍历刚才获得的ret中的各个实现，选取最“好”的实现，选取的标准是每个实现的plevel值，也就是他们的优先级，这里plevel越大优先级越高。

此时，如果没有启用autotvm的话，就直接调用compute生成输出Tensor(s)，并将Tensor(s)和刚才挑选出的最优实现返回即可。

但很可惜，我们简单例子中要使用autotvm...