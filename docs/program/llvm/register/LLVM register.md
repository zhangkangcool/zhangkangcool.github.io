<h1 align="center">LLVM register</h1>




https://blog.csdn.net/pc153262603/article/details/124801586

https://blog.csdn.net/openEuler_/article/details/126481453



四种寄存器分配方法

Basic Register Allocator、Fast Register Allocator、PBQP Register Allocator、Greedy Register Allocator



有优化就是Greedy，无优化则是Fast。

```c++
/// Instantiate the default register allocator pass for this target for either
/// the optimized or unoptimized allocation path. This will be added to the pass
/// manager by addFastRegAlloc in the unoptimized case or addOptimizedRegAlloc
/// in the optimized case.
///
/// A target that uses the standard regalloc pass order for fast or optimized
/// allocation may still override this for per-target regalloc
/// selection. But -regalloc=... always takes precedence.
FunctionPass *TargetPassConfig::createTargetRegisterAllocator(bool Optimized) {
  if (Optimized)
    return createGreedyRegisterAllocator();
  else
    return createFastRegisterAllocator();
}
```





PBQP目前来看只有AArch64支持。



与在CodeGen中与RegAlloc相关的文件

```asm
RegAllocBase.cpp   RegAllocGreedy.cpp         RegisterClassInfo.cpp  RegisterScavenging.cpp
RegAllocBase.h     RegAllocPBQP.cpp           RegisterCoalescer.cpp  RegisterUsageInfo.cpp
RegAllocBasic.cpp  RegUsageInfoCollector.cpp  RegisterCoalescer.h
RegAllocFast.cpp   RegUsageInfoPropagate.cpp  RegisterPressure.cpp
```











在上文中介绍的算法都是作用在最普通的四元式上，但LLVM-IR是SSA形式，有PHI节点，但PHI节点没有机器指令表示，所以在寄存器分配前需要把PHI节点干掉，消除PHI节点的算法限于篇幅不展开，请自行查阅。

llvm作为工业级编译器，有多种分配算法，可以通过llc的命令行选项-regalloc=pbqp|greedy|basic|fast来手动控制分配算法。

不同优化等级默认使用算法也不同：O2和O3默认使用greedy，其他默认使用fast。

#### fast算法：

策略很简单，扫描代码并为出现的变量分配寄存器，寄存器不够用就溢出到内存。用途主要是调试。



### basic算法

以linearscan为基础并对life interval设置了溢出权重而且用优先队列来存储life interval。

https://zhuanlan.zhihu.com/p/24554029



### greedy算法

使用优先队列，但特点是先为生命期长的变量分配寄存器，而短生命期的变量可以放在间隙中，详情可以参考[5]。



### pbqp算法

全称是Partitioned Boolean Quadratic Programming，限于篇幅，感兴趣的读者请查阅[6]。



至于具体实现，自顶向下依次是：

TargetPassConfig::addMachinePasses含有寄存器分配和其他优化
addOptimizedRegAlloc中是与寄存器分配密切相关的pass，比如上文提到的消除PHI节点
addRegAssignAndRewriteOptimized是实际的寄存器分配算法寄存器分配相关文件在lib/CodeGen下的RegAllocBase.cpp、RegAllocGreedy.cpp、RegAllocFast.cpp、RegAllocBasic.cpp和RegAllocPBQP.cpp等。
RegAllocBase类定义了一系列接口，重点是selectOrSplit和enqueue/dequeue方法，数据结构的重点是priority queue。 selectOrSplit方法可以类比上文中提到的SpillAtInterval。 priority queue类比active list。简要代码如下：

```c++
void RegAllocBase::allocatePhysRegs() {
  // 1. virtual reg其实就是变量
  while (LiveInterval *VirtReg = dequeue()) {

    // 2.selectOrSplit 会返回一个可用的物理寄存器然后返回新的live intervals列表
    using VirtRegVec = SmallVector<Register, 4>;
    VirtRegVec SplitVRegs;
    MCRegister AvailablePhysReg = selectOrSplit(*VirtReg, SplitVRegs);
    // 3.分配失败检查
    if (AvailablePhysReg == ~0u) {
        ...
    }
    // 4.正式分配
    if (AvailablePhysReg)
      Matrix->assign(*VirtReg, AvailablePhysReg);
    
    for (Register Reg : SplitVRegs) {
      // 5.入队分割后的liver interval
      LiveInterval *SplitVirtReg = &LIS->getInterval(Reg);
      enqueue(SplitVirtReg);
    }
  }
}
```





下面是默认的寄存器分配方式，可以根据Target自定义，如NVPTX

```c++
/// Instantiate the default register allocator pass for this target for either
/// the optimized or unoptimized allocation path. This will be added to the pass
/// manager by addFastRegAlloc in the unoptimized case or addOptimizedRegAlloc
/// in the optimized case.
///
/// A target that uses the standard regalloc pass order for fast or optimized
/// allocation may still override this for per-target regalloc
/// selection. But -regalloc=... always takes precedence.
FunctionPass *TargetPassConfig::createTargetRegisterAllocator(bool Optimized) {
  if (Optimized)
    return createGreedyRegisterAllocator();
  else
    return createFastRegisterAllocator();
}
```





`createTargetRegisterAllocator`是virtual函数，如果不需要寄存器申请的话，可以像WebAssembly/SPIRV一样返回空。

```c++
FunctionPass *WebAssemblyPassConfig::createTargetRegisterAllocator(bool) {
  return nullptr; // No reg alloc
}
```

