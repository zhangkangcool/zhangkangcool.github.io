<h1 align="center">LLVM CodeBook</h1>
# 1. Error
### 1. Chapter2
```asm
ch2_toy.cpp:328:33: error: assigning to 'mapped_type' (aka 'llvm::Value *') from incompatible
      type 'Function::arg_iterator' (aka 'ilist_iterator<llvm::Argument>')
          Named_Values[Arguments[Idx]] = Arg_It;

```

The solved method is in
```asm
https://llvm1802.wordpress.com/2016/04/30/llvm-cookbook-chapter-2-redux-encore/
```

Reference [Kaleidoscope](http://llvm.org/docs/tutorial/) Chapter3



