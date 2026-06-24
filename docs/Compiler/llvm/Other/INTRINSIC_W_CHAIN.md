





```cpp
setOperationAction(ISD::INTRINSIC_W_CHAIN, MVT::i32, Custom);
setOperationAction(ISD::INTRINSIC_W_CHAIN, MVT::Other, Custom);
```

这两句通常是配套使用，

它们的含义是：

> 对 `ISD::INTRINSIC_W_CHAIN` 这种 DAG 节点，当它的 result type 涉及 `i32` 或 `Other` 时，都交给 RISC-V 后端 custom lowering。

---

## 1. `INTRINSIC_W_CHAIN` 本身表示什么？

`ISD::INTRINSIC_W_CHAIN` 表示：

```text
intrinsic with return value and chain
```

也就是：

```text
有普通返回值 + 有 chain
```

例如一个 LLVM IR intrinsic：

```llvm
%r = call i32 @llvm.riscv.xxx(...)
```

如果它有 side effect / memory / chain，那么 SelectionDAG 中可能长这样：

```text
t0: ch = EntryToken
t1: i32,ch = intrinsic_w_chain t0, intrinsic_id, operands...
```

这个 DAG node 有两个 result：

```text
result 0: i32
result 1: ch / MVT::Other
```

所以可以理解为：

```text
返回 i32，同时产生一个 chain
```

但不要写成“返回值是 i32:chain”。更准确是：

```text
这个 node 有两个结果：i32 value 和 Other chain
```

---

## 2. `MVT::Other` 是什么？

`MVT::Other` 不是普通 C/LLVM IR 返回值类型。

它在 SelectionDAG 里表示 chain/token 类型，用来描述副作用顺序，比如：

- load/store；
- volatile；
- CSR read/write；
- intrinsic side effect；
- memory intrinsic；
- 不能被随意重排的操作。

所以：

```cpp
setOperationAction(ISD::INTRINSIC_W_CHAIN, MVT::Other, Custom);
```

不是说返回值是 `Other`，而是说：

> 对这个带 chain 的 intrinsic，它的 chain result 也需要 custom legalize/lowering。

---

## 3. 为什么这两句要一起写？

因为一个 `INTRINSIC_W_CHAIN` 节点通常有两个 result：

```text
i32, Other
```

所以你需要分别告诉 Legalizer：

```cpp
setOperationAction(ISD::INTRINSIC_W_CHAIN, MVT::i32, Custom);
```

处理普通返回值 result：

```text
i32
```

以及：

```cpp
setOperationAction(ISD::INTRINSIC_W_CHAIN, MVT::Other, Custom);
```

处理 chain result：

```text
Other
```

它们是一个逻辑整体，表示：

> `+xcxnai` 下，返回 `i32` 且带 chain 的 intrinsic，由 RISC-V 后端自定义 lowering。

---

## 4. 如果没有返回值，应该是什么？

如果 intrinsic 没有普通返回值，只有副作用，一般不是 `INTRINSIC_W_CHAIN`，而是：

```cpp
ISD::INTRINSIC_VOID
```

例如：

```llvm
call void @llvm.riscv.xxx(...)
```

SelectionDAG 里类似：

```text
ch = intrinsic_void chain, intrinsic_id, operands...
```

这种情况下不会有：

```text
i32
```

只有：

```text
Other
```

所以“无返回值”的 intrinsic 应该对应：

```cpp
ISD::INTRINSIC_VOID
```

而不是：

```cpp
ISD::INTRINSIC_W_CHAIN
```

---

## 5. 这两句可以这样理解

你的代码：

```cpp
if (Subtarget.hasStdExtXcxnai()) {
  setOperationAction(ISD::INTRINSIC_W_CHAIN, MVT::i32, Custom);
  setOperationAction(ISD::INTRINSIC_W_CHAIN, MVT::Other, Custom);
}
```

可以解释为：

```text
当开启 +xcxnai 时，
对于带 chain 且返回 i32 的 intrinsic：

  i32,ch = intrinsic_w_chain ...

这个 opcode 的 i32 result 和 chain result 都交给 RISCVTargetLowering 自定义处理。
```

也就是最终允许它进入：

```cpp
case ISD::INTRINSIC_W_CHAIN:
  return LowerINTRINSIC_W_CHAIN(Op, DAG);
```

---

## 6. 推荐表述

建议不要说：

```text
不返回值是 i32:chain
```

这个说法不准确。

更推荐说：

```text
这两句是配套的，用来 custom lower 返回 i32 且带 chain 的 INTRINSIC_W_CHAIN 节点。
其中 MVT::i32 对应普通数据返回值，MVT::Other 对应 chain result。
```

或者更短一点：

```text
它表示 i32,ch = intrinsic_w_chain ... 这种 DAG 节点需要 custom lowering。
i32 是数据返回值，Other 是 chain，不是普通返回值。
```