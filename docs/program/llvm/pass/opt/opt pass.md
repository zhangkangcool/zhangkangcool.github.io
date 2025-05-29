

Opt使用的各种pass，可以在`llvm/tools/opt/opt.cpp`中看到。



Opt.cpp中注释掉某个initialize函数之后，就无法在opt工具中使用该优化了。比如如下代码，`-wasmehprepare`选项就无法使用了。



```c++
// initializeWasmEHPreparePass(Registry);
```

