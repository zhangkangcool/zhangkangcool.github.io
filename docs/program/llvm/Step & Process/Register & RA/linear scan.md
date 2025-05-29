https://blog.csdn.net/qq_29674357/article/details/79069013

https://blog.csdn.net/qq_29674357/article/details/79110417

https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/17/Slides17.pdf

https://www.zhihu.com/question/29355187



Paper(MIT & IBM 1999): [Linear Scan Register Allocation](http://web.cs.ucla.edu/~palsberg/course/cs132/linearscan.pdf)  



在 LLVM3.0 版本以前，默认的寄存器分配器的核心算法就是线性扫描算法。这种算法生成的代码相对图着色有 10%-30% 的冗余代码（见参考文献【2】），但速度远快于图着色。在 LLVM3.0 版本以后，新加入的 basic/greedy 寄存器分配器在线性扫描算法的基础上进行了进一步强化，可以看作是线性扫描算法的变种。正因如此，新版分配器里的一些关键概念与线性扫描经典论文 [Linear Scan Register Allocation](http://web.cs.ucla.edu/~palsberg/course/cs132/linearscan.pdf) 中并无出入。



##1 为什么不用图着色

- 根本原因是它要先构造好完整的干涉图，才能在图上着色，而干涉图的构造代价太过高昂.
- 图着色算法把重点放在解决“如何把所有的程序变量尽可能地分配到寄存器中”，如果程序一定会大量产生溢出，那么，关注“如何高效地溢出”比关注“如何尽量减少溢出”更有价值。例如，可以关注如何选择溢出的变量，以达到尽可能减少对性能的影响这一问题。这一着重点的改变，就是目前 LLVM 里贪心寄存器分配器的中心思想。
- 图着色算法的最后一个问题，就是它难以处理实际寄存器分配问题中碰到的复杂局面。例如，在 X86 架构中，存在 register alias（如 AL/AH/AX）、pre-color 等问题，图着色算法在解决这类问题时需要较为复杂的调整。这些因素都促使 LLVM 选择了线性扫描算法。

-----------------------------------

## 2 术语

#### 2.1 live interval:

这是线性扫描算法的一个至关重要的概念。假设 IR 里的指令按数字编号，变量 v 的 live interval 是区间 [i, j]，需要满足下述条件：不存在编号为 j’(j’> j)的指令，使得变量 v 在 j’处活跃，且不存在编号为 i’(i’< i)的指令，使得变量 v 在 i’处活跃。这个定义是对 live ranges 的保守估计，因为在区间 [i, j] 里，可能存在部分子区间变量 v 并不活跃，这些区间在 live interval 的定义里被忽视掉了，这就是传统的线性扫描算法未能充分利用寄存器的原因。


#### 2.2 live range

live range：这里采取文献 [Register Allocation](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/17/Slides17.pdf) 中的定义，即认为 live range 是严格意义上变量活跃时所有程序点的集合。例如，若有一变量的生命期是 [12, 96], [96, 112], [112, 256]，上述三个区间都是此变量的 live range，而区间 [12, 256] 则是此变量的 live interval。注意，这里的这个概念和 LLVM 里的 Segment 是一样的。



#### 2.3 interference

在线性扫描里，不存在相交图（interference graph），相交发生在各个 live interval 重叠的部分。显然，需要特别关注每个 interval 的起始位置和结束位置，各个 live interval 的相交关系只会在这两个位置发生改变。



#### 2.4 active list

用于表示已经分配了寄存器的 live interval 的表，表中的 live interval 都按照结束位置递增的顺序排列。这么排的原因不难想象，结束位置最小的 live interval 最先结束，然后就可以把分配给该 live interval 的寄存器回收到寄存器池中，等待下一次分配。

## 3 计算live interval

在开始执行线性扫描算法前，要先获得 live interval，算法分配寄存器都是给 live interval 分配的，因此编译器还要事先做一点准备工作。首先，编译器要将控制流图 CFG 线性化并给每条指令编号。在 LLVM 里，是通过深度优先序来线性化 CFG 的，同时通过 slot index 来给每条指令编号，`相邻指令之间编号的差值为 16`。Poletto 的论文里，也选择了深度优先序列。实际上，这并不是一个巧合。其次，需要对 IR 做后向数据流分析，就可以获得每个变量的活跃信息，并进一步得到 live interval。



## 4 工作过程

在上述的线性扫描算法中，LinearScanRegisterAllocation 函数按照 original list 里的顺序（起始位置的升序）对 live interval 进行扫描，每一次扫描是对一个新的 live interval 执行一系列操作。我们可以在此函数中发现 active list 的使用，该 list 用于存放当前程序点（即正在扫描的 live interval 起始位置处指令后的程序点）分配了寄存器的 live interval，这些 interval 是互相干涉的。
每当开始扫描一个新的 live interval 时，算法会调用 ExpireOldInterval 函数，从头到尾遍历 active list。一旦发现 active list 里有哪个 interval 的结束位置是在新扫描的 interval 开始位置之后，就把它从 active list 中移除，并把它所占有的寄存器回收到寄存器池中。这说明这两个 interval 不相交，分配到同一个物理寄存器也不打紧。

显然，active list 的大小最多等同于可分配寄存器的总数。在最坏的情况下，当新一轮扫描开始时，active list 的大小可能已经达到了最大。若此时新扫描的 live interval 的起始位置在 active list 中所有 interval 的结束位置后，即它与之前所有的 interval 相交，此时寄存器就不够用了，必须溢出到内存中。溢出的 live interval 可以是 active list 里的任意一个 interval，也可以是新扫描的 interval，具体如何抉择就看分配器的设计者如何选择启发式了。在 Poletto 的论文里，作为溢出选择的是结束位置距离当前程序点最远的 live interval（图中的 last interval），或者当前扫描的 live interval。如果是当前的 interval 结束得更迟，则直接给它分配一个栈槽；否则，把分配给 last interval 的寄存器分配给当前的 interval，并把 last interval 溢出到栈槽中。

选择这样的启发式的原因不难理解：如果把这样的 interval 溢出了，剩下的 interval 的剩余干涉期较短，更容易被移出 active list，从而更容易回收寄存器。根据 Poletto 论文的说法，这一启发式效果非常好。

------------







# 6 参考文献
[1] [Register Allocation in LLVM 3.0](http://llvm.org/devmtg/2011-11/Olesen_RegisterAllocation.pdf)
[2] [Hacker News - Register Allocation](https://news.ycombinator.com/item?id=9754013)
[3] [Linear Scan Register Allocation](http://web.cs.ucla.edu/~palsberg/course/cs132/linearscan.pdf)
[4] [Register Allocation](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/17/Slides17.pdf)
[5] [知乎 - 寄存器分配问题？XlousZeng 的回答](https://www.zhihu.com/question/29355187/answer/99413526)



