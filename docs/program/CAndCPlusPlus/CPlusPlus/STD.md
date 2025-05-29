



```c++
bool addRequired(const RegMap &RM) {
  bool changed = false;
  for (RegMap::const_iterator I = RM.begin(), E = RM.end(); I != E; ++I)
    if (addRequired(I->first))
      changed = true;
      return changed;
}
      
bool addRequired(const RegMap &RM) {
  return llvm::any_of(RS, [this](unsigned Reg) { return addRequired(Reg); });
}

any_of/none_of/all_of
```

