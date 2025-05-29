

#### 以下代码以r2.10.0为例

`GpuCompiler` & `CpuCompiler`都继承于`LLVMCompiler`。

```c++
class GpuCompiler : public LLVMCompiler
class CpuCompiler : public LLVMCompiler
```



`RunBackend`会调用`CompileModuleTollvmIrImpl`去生成`LLVM IR`。

```c++
StatusOr<std::unique_ptr<Executable>> GpuCompiler::RunBackend(
    std::unique_ptr<HloModule> module, se::StreamExecutor* stream_exec,
    const CompileOptions& options) {
  VLOG(1) << "Starting to compile HLO module " << module->name();
  XLA_SCOPED_LOGGING_TIMER("GpuCompiler::RunBackend");
  ...
  // hlo Module转成llvm ir
  TF_RETURN_IF_ERROR(CompileModuleToLlvmIrImpl(
      module.get(), &llvm_context, target_triple_, data_layout_,
      stream_exec->platform()->Name(), stream_exec->platform()->id(),
      gpu_device_info,
      stream_exec->GetDeviceDescription().cuda_compute_capability(),
      stream_exec->GetDeviceDescription().rocm_compute_capability(),
      GetCanShareBuffer(), pointer_size_, &compile_module_results,
      stream_exec));
...
}
```



```c++
// The order of `thunk_sequence` corresponds to
// `hlo_schedule->ThunkLaunchOrder()`.
static Status CompileModuleToLlvmIrImpl(
    HloModule* hlo_module, llvm::LLVMContext* llvm_context,
    const std::string& target_triple, const std::string& data_layout,
    const std::string& platform_name, const se::Platform::Id platform_id,
    GpuDeviceInfo gpu_device_info,
    se::CudaComputeCapability cuda_compute_capability,
    se::RocmComputeCapability rocm_compute_capability,
    const HloDataflowAnalysis::CanShareBuffer& can_share_buffer_function,
    int pointer_size, CompileModuleResults* results,
    se::StreamExecutor* stream_exec = nullptr) {
  results->llvm_module = std::make_unique<llvm::Module>("", *llvm_context);
  results->llvm_module->setTargetTriple(target_triple);
  results->llvm_module->setDataLayout(data_layout);
  ...
    
 
  // hlo转化为MLIR的LHLO
  TF_RETURN_IF_ERROR(
      HloToLhloModule(*results->buffer_assignment, *hlo_module, *mlir_module));
  
   if (DumpingEnabledForHloModule(*hlo_module)) {
    DumpToFileInDirOrStdout(*hlo_module, "lmhlo", mlir_module.get());
  }
  ...
      TF_RETURN_IF_ERROR(ir_emitter->EmitLmhloRegion(&entry_function.getBody()));  // 会调用EmitOp，将mlir转化为llvm ir。
  ...
```





https://sketch2sky.com/2020/03/08/tensorflow-xla-service-buffer/#more-1820





```
-2- 从XLA Service通用层中选择适合GPU的Schedule策略
-3- 基于Schedule策略，进行设备无关的Buffer优化，主要关注尽可能的减少Buffer的大小。注意，这里是设备无关的优化，是无法利用硬件Memory特性的。
-4- 将HloModule转化为LLVM IR
-5,6- 利用LLVM框架，将LLVM IR编译为二进制代码。
```



- HloPassPipeline优化HLO IR之后，将创建xla.cpu.IrEmitter，进入图2中的第三个循环处理逻辑(loop for every computation of module)：将xla.HloModule中的每个xla.HloComputation转化为llvm IR表示，并创建对应的llvm.Module.
- 至此，Hlo IR 到 llvm IR的转化阶段完成，后面进入llvm IR的处理阶段。



```c++
 IrEmitterContext ir_emitter_context(
      module.get(), buffer_assignment.get(), stream_exec->platform(),
      &stream_exec->GetDeviceDescription(), &llvm_module);

  HloComputation* entry_computation = module->entry_computation();   // module is the HloModule*
  IrEmitterUnnested ir_emitter(module->config(), entry_computation,
                               &ir_emitter_context);

  TF_RETURN_IF_ERROR(ir_emitter.EmitConstantGlobals());

  {
    XLA_SCOPED_LOGGING_TIMER("NVPTXCompiler::RunBackend - IR emission");
    TF_RETURN_IF_ERROR(entry_computation->Accept(&ir_emitter));
  }
```







```
 Emits LLVM IR for an "unnested computation".
```



在tensorflow的源码中查找nvvm，可以对一个intrinsic等进行跟踪。IrEmitterUnnested

选择根据`EmitLoop()` 会调用 `EmitIndexAndSetExitBasicBlock()`