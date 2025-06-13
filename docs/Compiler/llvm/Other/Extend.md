<h1 align="center">Extend</h1>


## Method 1

```c++
Value* NewVec = llvm::UndefValue::get(llvm::VectorType::get(Builder.getInt32Ty(), 4));
auto Ret = Builder.CreateInsertElement(NewVec, Val1, (uint64_t)0);
Builder.CreateInsertElement(UndefValue::get(V->getType()), Val, ST->isLittleEndian() ? 0 : 3);

```



## Method 2

```c++
Constant *ZeroConst = ConstantInt::get(Builder.getInt32Ty(), 0);
Value *VecZeroConst = ConstantVector::getSplat(4, ZeroConst);
VecZeroConst->dump();
auto Ret = Builder.CreateInsertElement(VecZeroConst, Val1, (uint64_t)0);
```

