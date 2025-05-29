



```
// Describes a compilation unit at the HLO level.
//
// HloModule is the top-level unit in the HLO IR.  It corresponds to a whole
// "program".  Running a module, from beginning to end, is the only way to run
// an XLA program.
//
// A module contains one "entry computation"; this HloComputation is like main()
// in a C program.  The result of running the module is the result of running
// this computation.
//
// A module also contains some number of "nested computations".  Each nested
// computation is attached to an HloInstruction within some other computation.
// The meaning of the nested computation depends on the instruction it's
// attached to.
class HloModule {
```



https://zhuanlan.zhihu.com/p/71980945

其中涉及到3个概念，hlo module, computation, instruction。

- hlo module用源码注释的解释，就是一个编译单元，相当于是一个完整可运行的程序。

- 既然是一个程序，就有入口函数，也就是 entry_*computation，*每个module都有且仅有一个entry_computation，相当于main函数，有输入和输出，输入可以是多个参数，但输出只有一个（root instruction的值），如果要返回多个值，需要把多个值构造成一个元组（tuple）返回。

- 一个module可以包含多个computation，除了entry_computation，其他的都是"nested"，也就是被调用。

- HLO instructions就是op了，对应了官网上列出的operation semantics，看注释已经解释的非常清楚了，op融合和向llvm ir转换都是在这个层面进行的。

  



