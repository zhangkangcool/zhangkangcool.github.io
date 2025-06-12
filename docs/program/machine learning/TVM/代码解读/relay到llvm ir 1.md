<h1 align="center">relay到llvm ir 1</h1>
https://zhuanlan.zhihu.com/p/160840422



本文在tvm 0.7.dev.1 源码上进行分析。

起点是官网文档的第一个例子:

```python
batch_size = 1
num_class = 1000
image_shape = (3, 224, 224)
data_shape = (batch_size,) + image_shape
out_shape = (batch_size, num_class)
mod, params = relay.testing.resnet.get_workload(num_layers=18, batch_size=batch_size, image_shape=image_shape)
opt_level = 3
#target = tvm.target.cuda()
target = tvm.target.create('llvm -mcpu=skylake-avx512')
with tvm.transform.PassContext(opt_level=opt_level):
        graph, lib, params = relay.build(mod, target, params=params)
print(lib.get_source()[:])
```

我做了微小的改动，使得程序会将生成的llvm ir打印出来，方便我们观察。运行命令是:

```shell
python tvm-test.py > tvm-test.ll
```

生成的ir文件包含众多类型定义和函数，其中一个函数如下，看起来是正确生成了？

```assembly
define dllexport i32 @fused_nn_contrib_conv2d_NCHWc(i8* noalias nocapture readonly, i8* noalias nocapture readonly, i32, i8* noalias nocapture readnone, i8* noalias nocapture readnone, i8* noalias nocapture readnone) local_unnamed_addr {
entry:
  %6 = icmp eq i32 %2, 3
  br i1 %6, label %assert_end, label %assert_fail, !prof !5

assert_fail:                                      ; preds = %entry
  %7 = load void (i8*)*, void (i8*)** @__TVMAPISetLastError, align 8, !tbaa !6
  tail call void %7(i8* getelementptr inbounds ([82 x i8], [82 x i8]* @.str, i64 0, i64 0))
  ret i32 -1

assert_end:                                       ; preds = %entry
  %8 = bitcast i8* %0 to %1**
  %9 = load %1*, %1** %8, align 8
  %10 = bitcast i8* %1 to i32*
  %11 = load i32, i32* %10, align 4, !tbaa !9
  %12 = getelementptr inbounds i8, i8* %0, i64 8
  %13 = bitcast i8* %12 to %1**
  %14 = load %1*, %1** %13, align 8
  %15 = getelementptr inbounds i8, i8* %1, i64 4
  %16 = bitcast i8* %15 to i32*
  %17 = load i32, i32* %16, align 4, !tbaa !23
  ...
```

开始正式研究源码。入口函数是relay.build，该函数定义在**tvm/python/tvm/relay/buil-d_module.py:184**, 省略不重要的代码，紧扣主线，该函数的末尾部分才真正进入代码生成环节:

```python
def build(mod, target=None, target_host=None, params=None):    
    ...
    with tophub_context:
        bld_mod = BuildModule()
        graph_json, mod, params = bld_mod.build(mod, target, target_host, params)
    return graph_json, mod, params

class BuildModule(object):
    """Build an IR module to run on TVM graph runtime. This class is used
    to expose the `RelayBuildModule` APIs implemented in C++.
    """
    def __init__(self):
        self.mod = _build_module._BuildModule()
        self._get_graph_json = self.mod["get_graph_json"]
        self._get_module = self.mod["get_module"]
        self._build = self.mod["build"]
        self._optimize = self.mod["optimize"]
        self._set_params_func = self.mod["set_params"]
        self._get_params_func = self.mod["get_params"]
    
    def build(self, mod, target=None, target_host=None, params=None):
        target = _update_target(target)

        # Setup the params.
        if params:
            self._set_params(params)
        # Build the IR module
        self._build(mod, target, target_host)
        # Get artifacts
        graph_json = self.get_json()
        mod = self.get_module()
        params = self.get_params()

        return graph_json, mod, params
```

从该类的注释中可以看出，该类主要是封装了C++类RelayBuildModule, 实际上也是，经过各种转发后(关于ffi以及它具体如何实现转发的机制我不关心)，最终self.build调用的是C++代码**RelayBuildModule::Build(src/relay/backend/[http://build_module.cc:224](https://link.zhihu.com/?target=http%3A//build_module.cc%3A224))**, 以下是涉及到的创建，构建模块代码:

```cpp
runtime::Module RelayBuildCreate() {
  auto exec = make_object<RelayBuildModule>();
  return runtime::Module(exec);
}

TVM_REGISTER_GLOBAL("relay.build_module._BuildModule").set_body([](TVMArgs args, TVMRetValue* rv) {
  *rv = RelayBuildCreate();
});

void Build(IRModule mod, const TargetsMap& targets, const tvm::Target& target_host) {
    targets_ = targets;
    target_host_ = target_host;
    BuildRelay(mod, params_);
}
```

也就是说是通过**RelayBuildModule::BuildRelay(src/relay/backend/[http://build_modul-e.cc:417](https://link.zhihu.com/?target=http%3A//build_modul-e.cc%3A417))**来最终完成代码生成的, 我逻辑地把该函数分两部分来分析，第一部分是生成计算图，第二部分是生成目标代码。其实我还没太搞懂计算图，topi, te, tir和relay ir的个中关系。:)

下面是BuildRelay的第一部分:

```c++
  void BuildRelay(IRModule relay_module,
                  const std::unordered_map<std::string, tvm::runtime::NDArray>& params) {
    // Relay IRModule -> IRModule optimizations.
    relay_module = Optimize(relay_module, targets_, params);
    // Get the updated function.
    auto func = Downcast<Function>(relay_module->Lookup("main"));

    // Generate code for the updated function.
    graph_codegen_ = std::unique_ptr<GraphCodegen>(new GraphCodegen());
    graph_codegen_->Init(nullptr, targets_);
    graph_codegen_->Codegen(func);
    ...
 }
```

这里岔开一个题外话, 就是在Relay上做的优化，同LLVM IR的优化类似，通过Pass来完成的，而tvm中添加pass和运行pass的工作交给了**RelayBuildModule::Optimize**来完成, 该函数大致的行为如下，添加到pass_seqs的就是pass的实体，有兴趣可以去看看各个pass干了啥。

```C++
IRModule Optimize(IRModule relay_module, const TargetsMap& targets,
                    const std::unordered_map<std::string, runtime::NDArray>& params) {
    Array<Pass> pass_seqs;
    Array<runtime::String> entry_functions{"main"};
    pass_seqs.push_back(transform::RemoveUnusedFunctions(entry_functions));

    // Run all dialect legalization passes.
    pass_seqs.push_back(relay::qnn::transform::Legalize());

    // Legalize pass is restricted to homogeneous execution for now.
    if (targets.size() == 1) {
      pass_seqs.push_back(transform::Legalize());
    }
    pass_seqs.push_back(transform::EliminateCommonSubexpr(fskip));
    pass_seqs.push_back(transform::CombineParallelConv2D(3));
    pass_seqs.push_back(transform::CombineParallelDense(3));
    pass_seqs.push_back(transform::CombineParallelBatchMatmul(3));
    pass_seqs.push_back(transform::FoldConstant());
    pass_seqs.push_back(transform::FoldScaleAxis());
    pass_seqs.push_back(transform::CanonicalizeCast());
    pass_seqs.push_back(transform::CanonicalizeOps());

    // Alter layout transformation is only applied to homogeneous execution yet.
    if (targets.size() == 1) {
      pass_seqs.push_back(transform::AlterOpLayout());
    }

    // Fast math optimizations.
    pass_seqs.push_back(transform::FastMath());
    pass_seqs.push_back(transform::FoldConstant());

    // Create a sequential pass and perform optimizations.
    transform::Pass seq = transform::Sequential(pass_seqs);
    relay_module = seq(relay_module);
}
```

最后通过**SequentialNode(src/ir/[http://transform.cc:209](https://link.zhihu.com/?target=http%3A//transform.cc%3A209))**来运行这些passes, 见代码:

```c++
// TODO(zhiics): we currenlty only sequentially execute each pass in
// a Sequential without the consideration of their orders. The phase
// ordering problem needs to be handled in the future.
IRModule SequentialNode::operator()(IRModule mod, const PassContext& pass_ctx) const {
  for (const Pass& pass : passes) {
    CHECK(pass.defined()) << "Found undefined pass for optimization.";
    const PassInfo& pass_info = pass->Info();
    if (!PassEnabled(pass_info)) continue;
    // resolve dependencies
    for (const auto& it : pass_info->required) {
      mod = GetPass(it)(std::move(mod), pass_ctx);
    }
    mod = pass(std::move(mod), pass_ctx);
  }
  return mod;
}
```

就是一个简单的for循环，但是并不是每个添加的pass都会运行，是根据PassContext中设定优化级别(在本例中即opt_level的赋值)等决定的。比较有趣的地方是注释上说当前并未考虑各个pass之间的顺序，或许说的是可以通过排序省去不必要的pass运行，像llvm一样，并不是每个Transform pass都会对Analysis pass的结果造成影响，因而不必重新分析等等? 有时间俺可以试着搞搞看。