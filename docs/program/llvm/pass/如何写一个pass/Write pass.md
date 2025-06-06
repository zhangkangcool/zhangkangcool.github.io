<h1 align="center">Write pass</h1>
https://blog.csdn.net/baimafujinji/article/details/78631322



```cpp
/// FunctionPass class - This class is used to implement most global
/// optimizations.  Optimizations should subclass this class if they meet the
/// following constraints:
///
///  1. Optimizations are organized globally, i.e., a function at a time
///  2. Optimizing a function does not cause the addition or removal of any
///     functions in the module
///
class FunctionPass : public Pass

//===----------------------------------------------------------------------===//
/// ModulePass class - This class is used to implement unstructured
/// interprocedural optimizations and analyses.  ModulePasses may do anything
/// they want to the program.
///
class ModulePass : public Pass


class LoopPass : public Pass 
class MachineFunctionPass : public FunctionPass

/// ImmutablePass class - This class is used to provide information that does
/// not need to be run.  This is useful for things like target information and
/// "basic" versions of AnalysisGroups.
///
class ImmutablePass : public ModulePass {
```

所有的pass大致可以分为两类：分析和转换分析类的pass以提供信息为主，转换类的会修改中间代码。

这个Pass 可以操作整个module  是以文件进行区分的。ModulePass 可以操作Module 下的大部分 基本是万能的但是不是最方便的。我们需要根据需要选择 FunctionPass  LoopPass 等



最后一个参数判断是否是分析pass，在Analysis下面的pass，基本都是分析pass。

analysis是true，则为分析pass。

```c++
 #define INITIALIZE_PASS(MyPassName, arg, name, cfg, analysis)     # 使用宏来生成 initializeMyPassNamePass
```



分析pass，可以通过下面的代码获得分析有结果，非分析pass不能这么干。

```c++
LiveVariables *LV = getAnalysisIfAvailable<LiveVariables>();
```



分析pass有两种，一种是必须的，另一种是非必须的。

### 1. 必须的分析pass

`EarlyIfConversion.cpp` 该pass必须知道`MachineBranchProbabilityInfo`

```c++
970 INITIALIZE_PASS_DEPENDENCY(MachineDominatorTree)
 971 INITIALIZE_PASS_DEPENDENCY(MachineBranchProbabilityInfo)
 972 INITIALIZE_PASS_END(EarlyIfPredicator, DEBUG_TYPE, "Early If Predicator", false,
 973                     false)
 974
 975 void EarlyIfPredicator::getAnalysisUsage(AnalysisUsage &AU) const {
 976   AU.addRequired<MachineBranchProbabilityInfo>();
 977   AU.addRequired<MachineDominatorTree>();
 978   AU.addPreserved<MachineDominatorTree>();
 979   AU.addRequired<MachineLoopInfo>();
 980   AU.addPreserved<MachineLoopInfo>();
 981   MachineFunctionPass::getAnalysisUsage(AU);
 982 }

 
1038 bool EarlyIfPredicator::runOnMachineFunction(MachineFunction &MF) {

1050   Loops = getAnalysisIfAvailable<MachineLoopInfo>();
1051   MBPI = &getAnalysis<MachineBranchProbabilityInfo>();
}


```



### 2 非必须pass

```
getAnalysisIfAvailable 一般用于已经有了，则进行更新
```



保留传给下一个Pass

```c++
AU.addPreserved<LiveVariables>();
```





`AU.addRequired`还有DEPENDENCY的话，LiveVarialbles一定会支持。

但`AU.addUsedIfAvailable<LiveVariables>();`则需要runpass的时候，手工运行livevars pass。

```c++
131 INITIALIZE_PASS_BEGIN(PHIElimination, DEBUG_TYPE,
132                       "Eliminate PHI nodes for register allocation",
133                       false, false)
134 INITIALIZE_PASS_DEPENDENCY(LiveVariables)
135 INITIALIZE_PASS_END(PHIElimination, DEBUG_TYPE,
136                     "Eliminate PHI nodes for register allocation", false, false)
137
138 void PHIElimination::getAnalysisUsage(AnalysisUsage &AU) const {
139 //  AU.addUsedIfAvailable<LiveVariables>();
140   AU.addRequired<LiveVariables>();
141   AU.addPreserved<LiveVariables>();
142 //  AU.addPreserved<SlotIndexes>();
143   AU.addPreserved<LiveIntervals>();
144   AU.addPreserved<MachineDominatorTree>();
145   AU.addPreserved<MachineLoopInfo>();
146   MachineFunctionPass::getAnalysisUsage(AU);
147 }
148
```



```c++
  template<class PassClass>
  AnalysisUsage &addUsedIfAvailable() {
    Used.push_back(&PassClass::ID);
    return *this;
  }
 
```





```c++
  /// Sets of analyses required and preserved by a pass
  // TODO: It's not clear that SmallVector is an appropriate data structure for
  // this usecase.  The sizes were picked to minimize wasted space, but are
  // otherwise fairly meaningless.
  SmallVector<AnalysisID, 8> Required;
  SmallVector<AnalysisID, 2> RequiredTransitive;
  SmallVector<AnalysisID, 2> Preserved;
  SmallVector<AnalysisID, 0> Used
```



```c++
      ProfileVec(AU.getRequiredSet());
      ProfileVec(AU.getRequiredTransitiveSet());
      ProfileVec(AU.getPreservedSet());
      ProfileVec(AU.getUsedSet());
    
    
    // Return true if P preserves high level analysis used by other
// passes managed by this manager
bool PMDataManager::preserveHigherLevelAnalysis(Pass *P) {
  AnalysisUsage *AnUsage = TPM->findAnalysisUsage(P);
  if (AnUsage->getPreservesAll())
    return true;

  const AnalysisUsage::VectorType &PreservedSet = AnUsage->getPreservedSet();
  for (Pass *P1 : HigherLevelAnalysis) {
    if (P1->getAsImmutablePass() == nullptr &&
        !is_contained(PreservedSet, P1->getPassID()))
      return false;
  }

  return true;
}
```





重新计算：// MachineVerifier 可做此修改

```c++
 375 //      LiveVars = PASS->getAnalysisIfAvailable<LiveVariables>();
 376       LiveVars = &PASS->getAnalysis<LiveVariables>();
 
 286     void getAnalysisUsage(AnalysisUsage &AU) const override {
 287       AU.setPreservesAll();
 288       AU.addRequired<LiveVariables>();
 289       MachineFunctionPass::getAnalysisUsage(AU);
          }
```



有则使用：

```c++
138 void PHIElimination::getAnalysisUsage(AnalysisUsage &AU) const {
139   AU.addUsedIfAvailable<LiveVariables>();
140 //  AU.addRequired<LiveVariables>();
141   AU.addPreserved<LiveVariables>();
147 }
148
149 bool PHIElimination::runOnMachineFunction(MachineFunction &MF) {
151   LV = getAnalysisIfAvailable<LiveVariables>();
152   if (LV)
153     dbgs() << __LINE__ << " zhangkang LV is not empty.\n";
154   else
155     dbgs() << __LINE__ << " zhangkang LV is empty.\n";
```





分析pass不能改变指令和CFG等。



### 分类

https://llvm.org/docs/Passes.html

https://blog.csdn.net/qq_23599965/article/details/88344459

Analysis passes： compute information that other passes can use or for debugging or program visualization purposes. Transform passes： can use (or invalidate) the analysis passes. Transform passes all mutate the program in some way. Utility passes： provides some utility but don't otherwise fit categorization. For example passes to extract functions to bitcode or write a module to bitcode are neither analysis nor transform passes.





在LLVM中优化以pass形式实现, 每一个pass代表一种优化. pass分为两类, 一类是分析(analysis)pass, 负责收集信息共其它pass使用, 辅助调试或使程序可视化; 另一类是变换(transform)pass, 改变程序的dataflow / controlflow. LLVM中实现了几十种优化pass, 其中许多pass运行不止一次. analysis pass存放在lib/Analysis下, transform pass存放在lib/Transforms下. 