# LLC的所有流程由`llc.cpp`驱动

`llvm/tools/llc/llc.cpp`



`llc.cpp`中有`main`函数，主函数会调用`compileMoudle`对模块进行一个个编译。

会对PassManager中的各种优化进行添加。



