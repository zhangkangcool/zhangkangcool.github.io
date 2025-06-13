<h1 align="center">print type</h1>

### 1. Print the type

使用`EVT::getEVTString()`方法。

```c++
MVT MValT;
dbgs() << EVT(MValT).getEVTString() << "\n";
```

