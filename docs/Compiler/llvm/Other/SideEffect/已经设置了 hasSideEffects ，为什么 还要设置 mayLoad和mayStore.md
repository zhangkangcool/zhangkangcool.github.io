要保留。`hasSideEffects`、`mayLoad`、`mayStore` 不是互相替代关系。

它们分别表达不同事实：

```
let hasSideEffects = 1;
```

表示：这条指令有不可见副作用，不能被当成“无用纯计算”删掉，也不能随便合并/消除。

```
let mayLoad = 1;
let mayStore = 1;
```

表示：这条指令可能访问内存。AITE 会读取 descriptor/input/weight，也会把结果写回 output buffer，所以它确实是 load + store 类副作用。

为什么不能只写 `hasSideEffects = 1`？

因为一些机器层分析/调度/别名相关逻辑会专门看 `mayLoad()` / `mayStore()`，例如判断内存依赖、调度屏障、是否能和其他 memory op 重排。`hasSideEffects` 更宽泛，它告诉编译器“有不透明副作用”；但不精确说明“这是内存读写”。

对 AITE 最合理的是三者都写：

```
let hasSideEffects = 1;
let mayLoad = 1;
let mayStore = 1;
```

含义是：

```
AITE 是任务提交指令，有不可见硬件副作用；
同时它会通过 descriptor 触发外部内存读写。
```

