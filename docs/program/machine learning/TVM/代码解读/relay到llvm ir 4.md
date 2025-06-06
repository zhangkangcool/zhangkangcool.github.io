<h1 align="center">relay到llvm ir 4</h1>
https://zhuanlan.zhihu.com/p/164931829



上回说到CompileEngineImpl::LowerInternal, 开了个头，今儿个就接着往下唠。

cfunc是通过调用CreateSchedule得到的返回结果，它把relay function转换为了Schedule。

什么是Schedule？最标准的回答可以去看官网文档。我的理解是，Shedule是数据流图，图中每个节点是StageNode实例，约束了进行计算的步骤和先后顺序。数据在每个StageNode上有一个op成员，是OperationNode的实例，代表输入数据在本Stage中经过怎么样的运算变为输出。数据从入口节点流向终点的过程，也就是执行源Relay Function中语义的过程。

我们在各个Stage中可以进行各种各样的优化，比如parallel，vectorize，tiling，cached read/write等。其他优化方法可以参见**include/tvm/te/schedule.h**中Stage类里的注释。手工优化需要深厚地体系结构功底。

Schedule中的数据以Tensor的形式流动，每个Tensor中记录了产生自身的OperationNode(和Stage中是同一种东西，可以想想为啥）。

从Relay Function转换为Schedule的流程是Relay IR -> Tensor & Operation -> Schedule(Stages)。两个箭头所代表的转换分别是通过FTVMCompute和FTVMSchedule函数来完成的。FTVMSchedule是把Tensor(s)转换成Schedule，Tensor(s)则是通过FTVMCompute转换relay IR所得。

FTVMCompute和FTVMSchedule成双入对，每对存在OpImplementation(**include/tvm/relay/op_strategy.h**)的fcompute和fschedule中。OpImplementation是平台相关的，这也是为啥我们在CreateSchedule中传入了target参数。一个relay op可能对应着多个OpImplementation，数目取决于支持的后端数。如果你想为tvm增加新的后端，大概得为每个relay op都写一个新的OpImplementation，然后注册在系统中...

Ps: 关于OpImplementation上层的OpSpecialization和OpStrategy啥的建议大家自行看文档。还有就是可以关注topi这个目录下边的东西，它提供了各个平台下Tensor级的Op，比如sum，conv2d等, relay op可能通过conpute转换为topi中提供的Tensor级Op。所以我们增加新的平台的时候，可能要为TOPI中每个算子都写一遍Schedule....

Pps: 为relay op注册compute和schedule，strategy等的方法可以在源码中搜索**register_compute**, **register_schedule**和**register_strategy**进行参考。

为什么OpImplementation是平台相关的，这里举个64个元素向量加法的例子，对于cpu和cuda有不同的方式实现, 摘抄自<dive into deep learning compiler>

```cpp
// vector-add, shape=(64, ), <Dive into deep learning compiler>

// CPU pseudo-code
// parallel & vectorized
// 0 <= Ramp(x, y, z) < 64
produce c { 
    parallel (i.outer, 0, 8)  { 
        c[ramp(i.outer*8, 1, 8)] = a[ramp(i.outer*8, 1, 8)] + b[ramp(i.outer*8, 1, 8)]) 
    } 
} 

// GPU pseudo-code
extern “C” __global__ void default_function_kernel0(float *__restrict__ c, float *__restrict__ a, float *__restrict__ b)  {
    c[blockIdx.x * 64 + threadIdx.x] = a[blockIdx.x * 64 + threadIdx.x]  + b[blockIdx.x * 64 + threadIdx.x] 
}
```

上面的代码分别是向量加转换为不同平台的Schedule对应的伪代码。向量加比较简单，所以我估计它转换出来的Schedule只有一个Stage(我没有进行求证)。

CPU部分的代码是对Stage进行了**vectorize**和**parallel**两种变换，将64元素的向量分为8元素一组，组间并行执行，组内使用向量加，一次性完成8个元素的加法。

GPU部分则是利用GPU结构的特性，把每个元素对应的加法映射到不同的work-item来做(我这里用了opencl的概念，对cuda不是很熟)，他们这里是用每个work-item的blockIdx.x和threadIdx.x来完成映射的。在本例中，元素数目很少，通常来说并行的work-item的数目要大得多，所以可以不用等待其他work-group。

当我们将某rely op转换成Schedule时，我们会从系统已注册的OpImplementation中挑选满足要求的最优候选者。这里说的“条件”是指平台，以及opStrategy中设置的OpSpecialization所包含的条件。俺现在只关心平台这个条件就好了。所谓最优就是优先级最高的候选者，优先级也是开发者可以设定的。

回到CreateSchedule，它长这样：

```c++
  CachedFunc CreateSchedule(const Function& source_func, const Target& target) {
    return ScheduleGetter(target).Create(source_func);
  }
```

ScheduleGetter类的初始化函数没啥好说的，任务都是Crreate方法来完成的。