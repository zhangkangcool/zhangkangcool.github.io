



https://sketch2sky.com/2020/03/08/tensorflow-xla-service-buffer/#more-1820

```C++
NVPTXCompiler::RunBackend() {
  hlo_schedule = GpuHloSchedule::Build(*module, *stream_assignment, pointer_size_)
  BufferAssigner::Run(hlo_schedule->ConsumeHloOrdering()...)
  entry_computation->Accept(&ir_emitter)
  CompileToPtx() 
  CompilePtxOrGetCachedResult()
}
```



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