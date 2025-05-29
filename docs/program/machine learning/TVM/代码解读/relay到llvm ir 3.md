https://zhuanlan.zhihu.com/p/164902791



上回说到碰到VisitExpr老熟人，歪到了GraphNode。但俺学习了几天之后，俺认为有必要进行拨乱反正了，重新回到主线--生成llvm ir上，不再过多关注什么graph。省去废话，俺直接给出要探索的函数是std::vector<GraphNodeRef> VisitExpr_(const CallNode*)。







先来看看VisitExpr_(const CallNode*)的代码，我做了一些省略和改写:

```cpp
std::vector<GraphNodeRef> VisitExpr_(const CallNode* op) override {
    auto pf0 = GetPackedFunc("relay.backend._make_CCacheKey");
    auto pf1 = GetPackedFunc("relay.backend._CompileEngineLower");
    Target target;
    CHECK_GE(storage_device_map_.count(expr), 0);
    auto& device_type = storage_device_map_[expr][1];
    auto call_dev_type = device_type[0]->value;
    // Normal Relay Function
    if (targets_.size() == 1) {
      // homogeneous execution.
      const auto& it = targets_.begin();
      target = (*it).second;
    } else {
      // heterogeneous execution.
      std::string call_dev_name;
      if (call_dev_type == 0) {
        call_dev_name = "llvm";
      } else {
        call_dev_name = runtime::DeviceName(call_dev_type);
      }
      if (targets_.count(call_dev_type) == 0) {
        LOG(FATAL) << "No target is provided for device " << call_dev_name;
      }
      target = targets_[call_dev_type];
    }
    CCacheKey key = (*pf0)(func, target);
    CachedFunc lowered_func = (*pf1)(compile_engine_, key);
    if (!lowered_funcs_.count(target->str())) {
      lowered_funcs_[target->str()] = IRModule();
    }
    lowered_funcs_[target->str()]->Update(lowered_func->funcs);
    return GraphAddCallNode(op, _GetUniqueName(lowered_func->func_name), lowered_func->func_name);
  }
```

可以分为3个逻辑部分来看：1.获取relay.backend._make_CCacheKey和relay.backend._CompileEngineLower俩函数的引用；2.中间的if-else判断语句，用于获取要生成的目标平台信息；3.生成目标代码。

而我省去的部分是一些常规检查和处理外部设备的代码生成，俺现阶段不关心。下面是三个部分的详细说明。

第一部分，relay.backend._make_CCacheKey的作用是生成一个CCacheKey实例并返回赋给key变量，每个CCacheKey记录了要生成的relay源函数和目标平台。relay.backend._CompileEngineLower则接受两个参数，分别是self和key，前者指向一个CompileEngineNode实例，后者指向CCacheKey，在我们的代码中可以看到，调用该函数时传入的两个参数分别是compile_engine_和key。后者是刚才relay.backend._make_CCacheKey创建的对象，函数体代码是以key为唯一参数调用compile_engine_的Lower方法。

compile_engine_是GraphRuntimeCodegen的成员变量，在GraphRuntimeCodegen构造函数中进行初始化，它也是后续流程的执行者。为了解释清楚，贴出刚才提到的代码:

```text
TVM_REGISTER_GLOBAL("relay.backend._CompileEngineLower")
    .set_body_typed([](CompileEngine self, CCacheKey key) { return self->Lower(key); });

GraphRuntimeCodegen(runtime::Module* mod, const TargetsMap& targets) : mod_(mod) {
  compile_engine_ = CompileEngine::Global();
  targets_ = targets;
}

const CompileEngine& CompileEngine::Global() {
  // intentionally allocate raw pointer to avoid
  // free during destructuion.
  static CompileEngine* inst = new CompileEngine(make_object<CompileEngineImpl>());
  return *inst;
}
```

也就是说，我们的compile_engine_成员实际指向一个CompileEngineImpl的实例，它的具体作用到第三部分再深入叙述。

第二部分代码，获取目标平台的信息，代码也很明了，我们的目标是只生成llvm ir，是同构设备，targets_只有一个平台的信息，所以if判断为真，只要取出target_的唯一元素就可以了。大家有兴趣可以看看研究异构平台怎么搞的。

第三部分是全文的高潮，分别调用了relay.backend._make_CCacheKey和relay.backend._CompileEngineLower来实现lower。在介绍第一部分时候我已经说了对前者的使用，现在说说后者，重点就是CompileEngineImpl承担了什么样的角色。

CompileEngineImpl类定义在**src/relay/backend/[http://compile_engine.cc:549](https://link.zhihu.com/?target=http%3A//compile_engine.cc%3A549)。**调用了Lower方法。这个Lower方法就只是调用了LowerInternal方法，代码如下:

```text
CachedFunc Lower(const CCacheKey& key) { 
    return LowerInternal(key)->cached_func; 
}
```

结合CCacheKey和CCacheFunc这俩名字，猜也才得出这里运用了缓存机制，没必要对同一个relay function进行两次代码生成，所以要缓存结果。

LowerInternal方法比较长，还是要省略一下远离主线的代码。俺所省略的代码完成的主要任务有1.缓存机制，如果已经处理过该relay function了直接返回以前的结果，没有的话就开个新的cache entry给它，继续处理流程。2. 如果是外部函数，则不急着进行代码生成，先都收集起来，最后再调用外部代码生成工具一把梭，所以这里完成收集的步骤。

```text
   CCacheValue LowerInternal(const CCacheKey& key) {
    std::lock_guard<std::mutex> lock(mutex_);
    CCacheValue value;
    // Enforce use the target.
    With<Target> target_scope(key->target);

    CHECK(!value->cached_func.defined());
    auto cfunc = CreateSchedule(key->source_func, key->target);
    auto cache_node = make_object<CachedFuncNode>(*(cfunc.operator->()));

    // Skip lowering for device copy node.
    const Expr body = (key->source_func)->body;
    if (const CallNode* call_node = body.as<CallNode>()) {
      if (call_node->attrs.as<DeviceCopyAttrs>()) {
        value->cached_func = CachedFunc(cache_node);
        return value;
      }
    }

    cache_node->func_name = GetUniqueName(cache_node->func_name);
    // NOTE: array will copy on write.
    Array<te::Tensor> all_args = cache_node->inputs;
    for (te::Tensor arg : cache_node->outputs) {
      all_args.push_back(arg);
    }
    // lower the function
    if (const auto* f = runtime::Registry::Get("relay.backend.lower")) {
      cache_node->funcs = (*f)(cfunc->schedule, all_args, cache_node->func_name, key->source_func);
    } else {
      using tvm::transform::PassContext;
      With<PassContext> fresh_pass_ctx_scope(PassContext::Create());

      std::unordered_map<te::Tensor, tir::Buffer> binds;
      cache_node->funcs = tvm::lower(cfunc->schedule, all_args, cache_node->func_name, binds);
    }
    value->cached_func = CachedFunc(cache_node);
    return value;
  }
```

尽管略去后还是很长。先提俩重点，cfunc和relay.backend.lower。