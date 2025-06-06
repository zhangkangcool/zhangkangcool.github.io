<h1 align="center">get pgo info</h1>
# 静态分析

`lib/Analysis/BranchProbabilityInfo.cpp`

```cpp
865 /// Get the raw edge probability for the edge. If can't find it, return a
 866 /// default probability 1/N where N is the number of successors. Here an edge is
 867 /// specified using PredBlock and an
 868 /// index to the successors.
 869 BranchProbability
 870 BranchProbabilityInfo::getEdgeProbability(const BasicBlock *Src,
 871                                           unsigned IndexInSuccessors) const {
 872  dbgs() << __FILE__ << " getEdgeProbability zhangkang " << __LINE__ << "\n";
 873   auto I = Probs.find(std::make_pair(Src, IndexInSuccessors));
 874
 875   if (I != Probs.end())
 876     return I->second;
 877
 878  dbgs() << __FILE__ << " getEdgeProbability zhangkang " << __LINE__ << "\n";
 879   return {1, static_cast<uint32_t>(succ_size(Src))};
 880 }
```





# 判断和使用PGO优化

`./lib/Passes/PassBuilder.cpp`

```cpp
 806   if (!LTOPreLink && PGOOpt) {
 807     if (PGOOpt->CSAction == PGOOptions::CSIRInstr)
 808       addPGOInstrPasses(MPM, DebugLogging, Level, /* RunProfileGen */ true,
 809                         /* IsCS */ true, PGOOpt->CSProfileGenFile,
 810                         PGOOpt->ProfileRemappingFile);
 811     else if (PGOOpt->CSAction == PGOOptions::CSIRUse)
 812       addPGOInstrPasses(MPM, DebugLogging, Level, /* RunProfileGen */ false,
 813                         /* IsCS */ true, PGOOpt->ProfileFile,
 814                         PGOOpt->ProfileRemappingFile);
 815   }

1174   if (PGOOpt) {
1175     if (PGOOpt->CSAction == PGOOptions::CSIRInstr)
1176       addPGOInstrPasses(MPM, DebugLogging, Level, /* RunProfileGen */ true,
1177                         /* IsCS */ true, PGOOpt->CSProfileGenFile,
1178                         PGOOpt->ProfileRemappingFile);
1179     else if (PGOOpt->CSAction == PGOOptions::CSIRUse)
1180       addPGOInstrPasses(MPM, DebugLogging, Level, /* RunProfileGen */ false,
1181                         /* IsCS */ true, PGOOpt->ProfileFile,
1182                         PGOOpt->ProfileRemappingFile);
1183   }
```





### lib/CodeGen/BranchFolding.cpp

```cpp
1222 void BranchFolder::setCommonTailEdgeWeights(MachineBasicBlock &TailMBB) {
1223   SmallVector<BlockFrequency, 2> EdgeFreqLs(TailMBB.succ_size());
1224   BlockFrequency AccumulatedMBBFreq;
1225
1226   // Aggregate edge frequency of successor edge j:
1227   //  edgeFreq(j) = sum (freq(bb) * edgeProb(bb, j)),
1228   //  where bb is a basic block that is in SameTails.
1229   for (const auto &Src : SameTails) {
1230     const MachineBasicBlock *SrcMBB = Src.getBlock();
1231     BlockFrequency BlockFreq = MBBFreqInfo.getBlockFreq(SrcMBB);
1232     AccumulatedMBBFreq += BlockFreq;
1233
1234     // It is not necessary to recompute edge weights if TailBB has less than two
1235     // successors.
1236     if (TailMBB.succ_size() <= 1)
1237       continue;
1238
1239     auto EdgeFreq = EdgeFreqLs.begin();
1240
1241     for (auto SuccI = TailMBB.succ_begin(), SuccE = TailMBB.succ_end();
1242          SuccI != SuccE; ++SuccI, ++EdgeFreq)
1243       *EdgeFreq += BlockFreq * MBPI.getEdgeProbability(SrcMBB, *SuccI);
1244   }
```



```cpp
560 void BranchFolder::MBFIWrapper::setBlockFreq(const MachineBasicBlock *MBB,
 561                                              BlockFrequency F) {
 562   assert(false);
 563  dbgs() << __FILE__ << " setBlockFreq zhangkang " << __LINE__ << "\n";
 564   MergedBBFreq[MBB] = F;
 565 }
 566
```





###  Read the PGO info

./lib/Transforms/Instrumentation/PGOInstrumentation.cpp

```cpp
1517 static bool annotateAllFunctions(
1518     Module &M, StringRef ProfileFileName, StringRef ProfileRemappingFileName,
1519     function_ref<BranchProbabilityInfo *(Function &)> LookupBPI,
1520     function_ref<BlockFrequencyInfo *(Function &)> LookupBFI, bool IsCS) {
1521   LLVM_DEBUG(dbgs() << "Read in profile counters: ");
1522   auto &Ctx = M.getContext();
1523   // Read the counter array from file.
1524   auto ReaderOrErr =
1525       IndexedInstrProfReader::create(ProfileFileName, ProfileRemappingFileName);
1526   if (Error E = ReaderOrErr.takeError()) {
1527     handleAllErrors(std::move(E), [&](const ErrorInfoBase &EI) {
1528       Ctx.diagnose(
1529           DiagnosticInfoPGOProfile(ProfileFileName.data(), EI.message()));
1530     });
1531     return false;
1532   }
```





## Metadata

metadata是class Instruction的属性

https://llvm.org/doxygen/classllvm_1_1Metadata.html

https://llvm.org/docs/doxygen/classllvm_1_1Instruction.html

```c++
$ cat def.c 
int test(int a, int b) {
  return a <= b ? a : -a;
}

$ cat use.c 
int test(int, int);
int main(int argc, const char **argv) {
  int Ret = 0;
  for (int i = 0; i < 1 << 28; i += 1) {
    Ret += test(i, i - 1);
  }

  return Ret;
}

$ clang -O3 def.c use.c -fprofile-generate
$ ./a.out
$ llvm-profdata merge default_*.profraw -o default.profdata
$ clang -O3 def.c -fprofile-use -emit-llvm -S
$ grep '\!30' def.ll 
  %cond = select i1 %cmp, i32 %sub, i32 %a, !prof !30
!30 = !{!"branch_weights", i32 1073741818, i32 6}
```



Metadata for branch/select

```C++
7396       uint64_t TrueWeight, FalseWeight;
7397       if (Br1->extractProfMetadata(TrueWeight, FalseWeight)) {
7398         uint64_t NewTrueWeight = TrueWeight;
7399         uint64_t NewFalseWeight = TrueWeight + 2 * FalseWeight;
7400         scaleWeights(NewTrueWeight, NewFalseWeight);
7401         Br1->setMetadata(LLVMContext::MD_prof, MDBuilder(Br1->getContext())
7402                          .createBranchWeights(TrueWeight, FalseWeight));
7403
7404         NewTrueWeight = TrueWeight;
7405         NewFalseWeight = 2 * FalseWeight;
7406         scaleWeights(NewTrueWeight, NewFalseWeight);
7407         Br2->setMetadata(LLVMContext::MD_prof, MDBuilder(Br2->getContext())
7408                          .createBranchWeights(TrueWeight, FalseWeight));
7409       }
```







