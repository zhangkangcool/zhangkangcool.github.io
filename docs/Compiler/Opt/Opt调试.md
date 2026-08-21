





opt 的 pass‑by‑pass IR打印（对应 llc `‑print‑after‑all`）

`llc -print‑after‑all` 是后端 MIR 每轮 pass 打印机器 IR；**opt 中端 LLVM‑IR 同样有** **`-print‑after‑all`****，新 PM 完全支持**，输出到 stderr，不是 stdout/std 输出文件。

> ⚠️ 重点：打印内容输出到**标准错误 2**，不是 `-o` 指定输出文件，必须重定向 `2> trace.log`。

## 完整可用示例（LLVM‑13~19，新 PM，ResNet50）

```bash
opt -passes="default<O3>" -print-after-all -S resnet50.ll -o resnet50_o3.ll 2> pass_trace.log
```

打开 `pass_trace.log`，会看到：

```Plain
*** IR Dump After SROAPass ***
; ModuleID = 'resnet50.ll'
...IR...
*** IR Dump After EarlyCSEPass ***
...IR...
```

等价 llc 的 `‑print‑after‑all` 效果，每一个 pass 跑完 dump 完整 module IR。

## 配套常用调试 flag（新 Pass Manager）

| 参数                                | 作用                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| `-print‑after‑all`                  | 全部 pass 之后打印 IR（输出 stderr）                         |
| `-print‑before‑all`                 | 全部 pass 之前打印 IR                                        |
| `-print‑after=gvn,instcombine`      | **只打印指定 pass 之后 IR**，逗号分隔 pass 名                |
| `-print‑before=sroa`                | 指定 pass 之前打印 IR                                        |
| `-print‑changed`                    | **只打印 IR 发生变更的 pass**，过滤掉无修改 pass，大模型非常有用，减少输出量 |
| `-filter‑print‑funcs="resnet_main"` | 只 dump 指定函数 IR，避免整个 module 巨量输出，ResNet50 必用 |
| `-debug‑pass‑manager`               | 打印 pass 执行顺序、分析失效信息，不打印 IR，只打印文本日志  |
| `-print‑pipeline‑passes`            | 打印 O3 展开完整 pass 流水线字符串，**不跑 IR 转换**，只看流水线结构 |

示例：只看发生修改的 IR，过滤无变化 pass

```bash
opt -passes="default<O3>" -print-changed -S resnet50.ll -o resnet50_o3.ll 2> changed_trace.log
```

## 坑点（高频踩坑）

1. ❌ 忘记 `2>` 重定向：大量 IR 直接刷终端，`‑o` 文件里面**不会包含 dump IR**。dump 永远走 stderr。
2. ❌ ResNet50 这类大模型：`‑print‑after‑all` 会产生**GB 级别日志**，优先用 `-print‑changed` 或者 `-filter‑print‑funcs` 限定函数，不然磁盘直接打满。
3. 旧 Legacy‑PM：同样支持 `-print‑after‑all`；LLVM‑17+ 删除 legacy‑pm，flag 依然保留给新 PM 使用。
4. 区分两个容易混淆参数：
   1. `‑print‑pipeline‑passes`：**只打印 pass 名字字符串，不输出 IR**，看流水线结构；
   2. `‑print‑after‑all`：**输出完整 LLVM IR 文本**，看每步 IR 变化。

## 小技巧：查看 O3 完整流水线文本（不跑 heavy IR dump）

```bash
opt -passes="default<O3>" -print-pipeline-passes resnet50.ll -S -o /dev/null
```

直接输出完整嵌套 pass 流水线字符串，可以复制到 `-passes="..."` 做自定义裁剪。

## Legacy‑PM（LLVM<=16）对比写法

```bash
opt -enable-new-pm=0 -O3 -print-after-all -S resnet50.ll -o resnet50_o3.ll 2> legacy_trace.log
```

> LLVM‑17+ 已经移除 `-enable‑new‑pm=0`，这条命令直接报错。

## 实操建议针对 ResNet50

不要直接裸跑 `-print‑after‑all`，优先：

1. 先用 `‑print‑pipeline‑passes` 看清 O3 完整 pass 列表；
2. 定位怀疑的 pass，用 `‑print‑after=xxx` 只抓这几步 IR；
3. 实在需要全量 trace，务必加上 `-filter‑print‑funcs` 限定你关心的函数，并且重定向到文件。

如果你需要，我可以给你一个小 shell 片段，把 `pass_trace.log` 按 `*** IR Dump After XxxPass ***` 分割成一个个独立 ll 文件，方便 diff 对比。