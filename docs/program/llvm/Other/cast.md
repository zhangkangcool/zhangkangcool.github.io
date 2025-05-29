`dyn_cast` will return `NULL` or what you want. 

`isa` will return bool, if it can convert.

`cast` do the convert, you must ensure it can work, or you will get error.

```c++
if (ConstantSDNode *N1C = dyn_cast<ConstantSDNode>(N1)) {
  const APInt &C1 = N1C->getAPIntValue();
}

// equal to
if (isa<ConstantSDNode>(N1)) {
  ConstantSDNode *N1C = cast<ConstantSDNode>(N1)
      const APInt &C1 = N1C->getAPIntValue();
}
```

