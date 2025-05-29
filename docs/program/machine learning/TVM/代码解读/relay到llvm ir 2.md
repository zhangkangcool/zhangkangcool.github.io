https://zhuanlan.zhihu.com/p/161030209



为了方便，再次插入第一段的代码:

```cpp
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
    /* ... */
 }
```

可以看到代码生成是从relay模块的入口函数"main"开始的，主要工作由graph_codegen_来完成，故必须先整明白graph_codegen_是个什么东西。

GraphCodegen结构体定义在**src/relay/backend/[http://build_module.cc:58](https://link.zhihu.com/?target=http%3A//build_module.cc%3A58)**。它里边有一个成员对象mod为**tvm::runtime::Module**类的实例，下边展示的是GraphCodegen结构体的部分代码，省去了暂时不会用到的函数。

```text
struct GraphCodegen {
 public:
  GraphCodegen() {
    auto pf = GetPackedFunc("relay.build_module._GraphRuntimeCodegen");
    mod = (*pf)();
  }
  ~GraphCodegen() {}

  void Init(runtime::Module* m, TargetsMap targets) { CallFunc("init", m, targets); }

  void Codegen(const Function& func) { CallFunc("codegen", func); }

 protected:
  tvm::runtime::Module mod;

  template <typename R, typename... Args>
  R CallFunc(const std::string& name, Args... args) {
    auto pf = mod.GetFunction(name, false);
    return pf(std::forward<Args>(args)...);
  }
  template <typename... Args>
  void CallFunc(const std::string& name, Args... args) {
    auto pf = mod.GetFunction(name, false);
    pf(std::forward<Args>(args)...);
    return;
  }
}
```

它的方法是经过转发实际调用了**GraphRuntimeCodegenModule**类的方法，这两个类的桥梁就是mod成员对象和CallFunction方法, 初始化函数中的pf实际指向的是CreateGraph-CodegenMod函数，mod被初始化为GraphRuntimeCodegenModule类的对象。下面是桥接的代码(**src/relay/backend/graph_runtime\*_\*[http://codegen.cc](https://link.zhihu.com/?target=http%3A//codegen.cc))**:

```text
runtime::Module CreateGraphCodegenMod() {
  auto ptr = make_object<GraphRuntimeCodegenModule>();
  return runtime::Module(ptr);
}

TVM_REGISTER_GLOBAL("relay.build_module._GraphRuntimeCodegen")
    .set_body([](TVMArgs args, TVMRetValue* rv) { *rv = CreateGraphCodegenMod(); });
```

很显然现在得把关注点聚焦在**GraphRuntimeCodegenModule**(**graph_runtime\*_\*[http://cod-egen.cc:553](https://link.zhihu.com/?target=http%3A//cod-egen.cc%3A553)**)类上，这个类的初始化函数什么都没干。

回忆起BuildRelay中，分别调用了init和codegen方法，现在来一探究竟。

插个题外话: 浏览TVM源码时我发现作者们似乎很喜欢用函数式编程的风格，让俺甚是喜欢，即便是用C++来做令俺有点看不太懂。不得不感慨，C++真是博大精深。

GraphRuntimeCodegenModule类中就只实现了GetFunction方法，除了init和codegen,其他的是getXXX方法，无关紧要。

```text
virtual PackedFunc GetFunction(const std::string& name, const ObjectPtr<Object>& sptr_to_self) {
    if (name == "init") {
      return PackedFunc([sptr_to_self, this](TVMArgs args, TVMRetValue* rv) {
        CHECK_EQ(args.num_args, 2) << "The expected of arguments are: "
                                   << "runtime::Module mod and Map<int, Target> targets";
        void* mod = args[0];
        Map<Integer, tvm::Target> tmp = args[1];
        TargetsMap targets;
        for (const auto& it : tmp) {
          auto dev_type = it.first.as<tir::IntImmNode>();
          CHECK(dev_type);
          targets[dev_type->value] = it.second;
        }
        codegen_ =
            std::make_shared<GraphRuntimeCodegen>(reinterpret_cast<runtime::Module*>(mod), targets);
      });
    } else if (name == "codegen") {
      return PackedFunc([sptr_to_self, this](TVMArgs args, TVMRetValue* rv) {
        Function func = args[0];
        this->output_ = this->codegen_->Codegen(func);
      });
    } 
}
```

先看codegen, 它实际上是调用了codegen_成员的Codegen方法，而codegen_是在init中进行初始化的**GraphRuntimeCodegen**类实例。我暂时先把init中对targets的处理放在一旁，等到有需要的时候再回来研究研究。现在重点变成了GraphRuntimeCodegen类。

Ps: 从刚才到现在绕了点弯子, 接下来也会有点绕，先总结一下，我们目前的旅程是:

GraphCodegen-> GraphRuntimeCodegenModule -> GraphRuntimeCodegen

好了，开始研究GraphRuntimeCodegen(graph_runtime*_*[http://codegen.cc:185](https://link.zhihu.com/?target=http%3A//codegen.cc%3A185))。初始化函数将成员对象compile_engine_初始化为CompileEngineImpl类实例, 注释说CompileEngineI-mpl的功能是"**backend compilation engine for low level code generation**", 目前不清楚它是用来生成ir还是机器码，我粗略地扫了一眼这个类的方法，感觉挺猛的。但是它现在不是俺的重点盯防对象，也许会在后边遇到它。回到GraphRuntimeCodegen中，先研究研究Codegen方法干了啥。

```text
LoweredOutput Codegen(relay::Function func) {
    auto pf = GetPackedFunc("relay.backend.GraphPlanMemory");
    storage_device_map_ = (*pf)(func);
    // First we convert all the parameters into input nodes.
    for (auto param : func->params) {
      auto node_ptr = GraphInputNode::make_node_ptr(param->name_hint(), GraphAttrs());
      var_map_[param.get()] = AddNode(node_ptr, param);
    }
    heads_ = VisitExpr(func->body);
    std::ostringstream os;
    dmlc::JSONWriter writer(&os);
    GetJSON(&writer);
    LoweredOutput ret;
    ret.graph_json = os.str();
    ret.params = params_;

    for (auto& kv : lowered_funcs_) {
      if (ret.lowered_funcs.count(kv.first) == 0) {
        ret.lowered_funcs.Set(kv.first, IRModule());
      }
      auto& mod = ret.lowered_funcs[kv.first];
      mod->Update(kv.second);
      ret.lowered_funcs.Set(kv.first, mod);
    }
    ret.external_mods = compile_engine_->LowerExternalFunctions();
    return ret;
}
```

写项目改过点clang和llvm代码，一看到老熟人VisitExpr俺就乐了，想都不用想这肯定是重点观察对象。但是，还是先看看它怎么把输入转变为节点的吧，也就是第一行注释底下那个for循环干的事，循环中第一句根据每个参数创建了GraphInputNode实例，第二句调用AddNode把先前创建的节点加入到图中，一个个来看。

GraphInputNode是个啥?

是**GraphNode**的子类，GraphNode代表现在要建的图中的节点，我搜了一下它似乎只有两个子类，GraphInputNode和GraphOpNode。

先来探究这个GraphNode类。

```text
class GraphNode {
 public:
  GraphNode() {}
  virtual void Save(dmlc::JSONWriter* writer) const {}
  virtual void Load(dmlc::JSONReader* reader) {}
  virtual GraphNodeType Type() const { return kGraphNop; }
  virtual ~GraphNode() {}

 public:
  int num_outputs_{1};
  std::string name_;
  GraphAttrs attrs_;
};
```

一看到JSON相关的我就想起文档中说的可以把生成的图以json格式保存下来，以后再读取，大概底层就是调用的各个节点的Save和Load来实现的吧，python代码长这样:

```python
with open(temp.relpath("deploy_graph.json"), "w") as fo:
    fo.write(graph)
```

在进入它的子类之前，看看它本身有什么有趣的地方，我发现了GraphAttrs这个类型，它是一个别名:

```text
using GraphAttrs = std::unordered_map<std::string, dmlc::any>;
```

实际上是一个map，键是字符串，值类型为any, 看注释说是和C++17的std::any兼容，我搜了一下C++17的这东西，可以充当任何类型单个值的类型安全的容器，顿时我对GraphAttrs的用途产生了强烈的好奇。