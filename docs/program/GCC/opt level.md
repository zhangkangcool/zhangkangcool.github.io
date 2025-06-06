<h1 align="center">gopt level</h1>


https://blog.csdn.net/liang_baikai/article/details/110137374



## 1. -O，-O1

这两个命令的效果是一样的，目的都是在不影响编译速度的前提下，尽量采用一些优化算法降低代码大小和可执行代码的运行速度。并开启如下的优化选项：

```
-fauto-inc-dec 
-fbranch-count-reg 
-fcombine-stack-adjustments 
-fcompare-elim 
-fcprop-registers 
-fdce 
-fdefer-pop 
-fdelayed-branch 
-fdse 
-fforward-propagate 
-fguess-branch-probability 
-fif-conversion2 
-fif-conversion 
-finline-functions-called-once 
-fipa-pure-const 
-fipa-profile 
-fipa-reference 
-fmerge-constants 
-fmove-loop-invariants 
-freorder-blocks 
-fshrink-wrap 
-fshrink-wrap-separate 
-fsplit-wide-types 
-fssa-backprop 
-fssa-phiopt 
-fstore-merging 
-ftree-bit-ccp 
-ftree-ccp 
-ftree-ch 
-ftree-coalesce-vars 
-ftree-copy-prop 
-ftree-dce 
-ftree-dominator-opts 
-ftree-dse 
-ftree-forwprop 
-ftree-fre 
-ftree-phiprop 
-ftree-sink 
-ftree-slsr 
-ftree-sra 
-ftree-pta 
-ftree-ter 
-funit-at-a-time
```



## 2. -O2

该优化选项会牺牲部分编译速度，除了执行-O1所执行的所有优化之外，还会采用几乎所有的目标配置支持的优化算法，用以提高目标代码的运行速度

```
-fthread-jumps 
-falign-functions  -falign-jumps 
-falign-loops  -falign-labels 
-fcaller-saves 
-fcrossjumping 
-fcse-follow-jumps  -fcse-skip-blocks 
-fdelete-null-pointer-checks 
-fdevirtualize -fdevirtualize-speculatively 
-fexpensive-optimizations 
-fgcse  -fgcse-lm  
-fhoist-adjacent-loads 
-finline-small-functions 
-findirect-inlining 
-fipa-cp 
-fipa-cp-alignment 
-fipa-bit-cp 
-fipa-sra 
-fipa-icf 
-fisolate-erroneous-paths-dereference 
-flra-remat 
-foptimize-sibling-calls 
-foptimize-strlen 
-fpartial-inlining 
-fpeephole2 
-freorder-blocks-algorithm=stc 
-freorder-blocks-and-partition -freorder-functions 
-frerun-cse-after-loop  
-fsched-interblock  -fsched-spec 
-fschedule-insns  -fschedule-insns2 
-fstrict-aliasing -fstrict-overflow 
-ftree-builtin-call-dce 
-ftree-switch-conversion -ftree-tail-merge 
-fcode-hoisting 
-ftree-pre 
-ftree-vrp 
-fipa-ra
```



## 3. -O3

该选项除了执行-O2所有的优化选项之外，一般都是采取很多向量化算法，提高代码的并行执行程度，利用现代CPU中的流水线，Cache等

```
-finline-functions      // 采用一些启发式算法对函数进行内联
-funswitch-loops        // 执行循环unswitch变换
-fpredictive-commoning  // 
-fgcse-after-reload     //执行全局的共同子表达式消除
-ftree-loop-vectorize　  // 
-ftree-loop-distribute-patterns
-fsplit-paths 
-ftree-slp-vectorize
-fvect-cost-model
-ftree-partial-pre
-fpeel-loops 
-fipa-cp-clone options
```



### 4. -Os
这个优化标识和-O3有异曲同工之妙，当然两者的目标不一样，
-O3的目标是宁愿增加目标代码的大小，也要拼命的提高运行速度，
但是这个选项是在-O2的基础之上，尽量的降低目标代码的大小，这对于存储容量很小的设备来说非常重要。
为了降低目标代码大小，会禁用下列优化选项，一般就是压缩内存中的对齐空白(alignment padding)

```
-falign-functions  
-falign-jumps  
-falign-loops 
-falign-labels
-freorder-blocks  
-freorder-blocks-algorithm=stc 
-freorder-blocks-and-partition  
-fprefetch-loop-arrays
```



### 5. -Ofast

该选项将不会严格遵循语言标准，除了启用所有的-O3优化选项之外，也会针对某些语言启用部分优化。如：-ffast-math ，对于Fortran语言，还会启用下列选项

```
-fno-protect-parens 
-fstack-arrays
```





### 6.-Og
优化调试体验。 -Og应该是标准edit-compile-debug周期的优化级别选择，
在保持快速编译和良好调试体验的同时，提供合理的优化级别。
用于生成可调试代码，因为某些收集调试信息的编译器通道在以下位置被禁用 -O0。
像-O0 -Og完全禁用了许多优化过程，因此控制它们的单个选项无效。除此以外-Og 使所有 -O1 优化标志，但那些可能会干扰调试的标志除外：

```
-fbranch-count-reg  
-fdelayed-branch 
-fdse  
-fif-conversion  
-fif-conversion2  
-finline-functions-called-once 
-fmove-loop-invariants  
-fssa-phiopt 
-ftree-bit-ccp  
-ftree-dse  
-ftree-pta  
-ftree-sra
```



