llvm 17.0.6发布时间是2023年，11月28号（https://github.com/llvm/llvm-project/releases?page=5）



代码仓库在这里，以下结合此代码进行分析

https://github.com/llvm/llvm-project/tree/release/19.x



## 公知背景

公知：ARMv7-A/R 的 NEON 指令集中，不存在原生的、可以根据掩码寄存器选择性地加载或存储数据元素的指令，下面在llvm-project 17.0.6的代码中分析无掩码存储指令的向量处理实现。



vbsl指令介绍

`VBSL` 的全称是 **Vector Bitwise Select**，即**向量按位选择**指令。它是实现 “条件选择” 功能的核心指令，也是 LLVM 在 NEON 平台上模拟掩码加载 / 存储操作的关键。

------

### 1. 指令功能概述

`VBSL` 指令根据一个**掩码向量（Mask Vector）**，在两个源向量（Source Vector）之间进行逐元素的选择，从而构建出一个新的目标向量（Destination Vector）。

可以把它想象成一个硬件加速的、并行的 `if-then-else` 操作。

- **如果** 掩码向量的某个元素为全 1（`0xFFFFFFFF`），
- **那么** 目标向量的对应元素就从**第一个源向量**中选择。
- **否则**（如果掩码向量的元素为全 0 `0x00000000`），
- **那么** 目标向量的对应元素就从**第二个源向量**中选择。

------

### 2. 指令语法

`VBSL` 指令的语法格式如下：

arm

```arm
VBSL <mask>, <src1>, <src2>
```

- **`<mask>`**: 掩码寄存器。必须是 NEON 的向量寄存器（如 `q0`, `d0`）。寄存器中的每个元素必须是全 0 或全 1。
- **`<src1>`**: 第一个源寄存器。当掩码为全 1 时，从这里选择元素。
- **`<src2>`**: 第二个源寄存器。当掩码为全 0 时，从这里选择元素。同时，**结果也会存储在这个寄存器中**。

**关键点**: `VBSL` 是一个**三操作数指令**，但它的目标寄存器和第二个源寄存器是同一个。这意味着操作是**破坏性的**，会覆盖掉 `<src2>` 寄存器的原始值。

------



--------------------



LLVM 在本仓库（llvm17）里并不依赖任何原生的 “掩码加载/存储” 指令。掩码加载/存储通过常规的 load/store + NEON 的选择/位操作伪指令序列来实现（例如用 VLD/VST / VLD1LN 等做实际内存访问，再用 VBSL/VBIT/VBIF 等按掩码合并），并在寄存器分配后把 TableGen 伪指令展开为真实指令序列。
关键位置（来自工程）

Intrinsic / DAG 端的处理：ARMTargetLowering::getTgtMemIntrinsic 和 ARMTargetLowering::PerformDAGCombine 负责把 NEON load/store intrinsics 和高层 DAG 模式转换成目标相关的 load/store/伪指令节点。

ARMTargetLowering::getTgtMemIntrinsic
ARMTargetLowering::PerformDAGCombine
TableGen / 伪指令：大量 VLD/VST/VLD1LN/VLDLN/VLDDUP 等伪指令由 TableGen 在 ARMInstrNEON.td 定义（包括带写回、lane-load、all-lanes、odd/even 版本等），用于在选择阶段或寄存器分配前后表达复杂载入/存储语义。

例：VLD1LNd32，VLD1LNq32Pseudo
掩码合并相关伪/辅助：VBSPd / VBSPq（TableGen 中有注释说明 VBSP 是伪指令，稍后展开为 VBIT/VBIF/VBSL 以避免不必要的拷贝）
文件：ARMInstrNEON.td
伪指令到真实指令的展开：寄存器分配后，ARMExpandPseudo 的方法（如 ExpandVLD/ExpandVST）会把这些 Q/QQ/QQQQ 级别的伪指令展开为对 D 寄存器的真实 VLD/VST（以及必要的偏移/写回操作）。表驱动查找在 NEONLdStTable / LookupNEONLdSt 中实现。

ARMExpandPseudo::ExpandVLD
LookupNEONLdSt / NEONLdStTable`
实现思路（步骤概览）

前端 / IR/Intrinsic 层把“掩码加载”表示成一个 intrinsic 或带掩码的 DAG 模式。
DAG combine / target lowering 将其转换为：
对应地址做一个或多个普通向量加载（VLD/VLD1LN/逐 lane load 或者 标量 load + INSERT_SUBVECTOR），或者先加载原始目标向量作为“旧值”；
生成掩码向量（比较/布尔生成）；
用按位选择指令（VBSL / VBIT / VBIF）把“加载到的新值”和“旧值”按掩码合并成最终向量；
最后把合并结果存回（VST/VST1）。 这些转换在 TableGen 模式、DAG combine 和 intrinsic lowering 中配合实现（见上面链接）。
在寄存器分配/指令选择之后，NEON 的多寄存器伪指令（QQ/QQQQ 等）被 [ARMExpandPseudo] 展开成对 D 寄存器的真实 VLD/VST 指令序列。





## 代码示例分析说明

https://github.com/llvm/llvm-project/blob/release/17.x/llvm/test/CodeGen/ARM/vbsl-constant.ll

```
define <1 x i64> @v_bsli64(ptr %A, ptr %B, ptr %C) nounwind {
; CHECK-LABEL: v_bsli64:
; CHECK:       @ %bb.0:
; CHECK-NEXT:    vldr d17, [r2]                     ; 1. 加载 C 的值到 d17
; CHECK-NEXT:    vldr d16, LCPI3_0                  ; 2. 加载掩码到 d16
; CHECK-NEXT:    vldr d18, [r0]                      ; 3. 加载 A 的值到 d18
; CHECK-NEXT:    vbsl d16, d18, d17       
; CHECK-NEXT:    vmov r0, r1, d16                      ; 4. 执行位选择操作
; CHECK-NEXT:    mov pc, lr                             ; 5. 将结果从 d16 移动到通用寄存器以返回
    %tmp1 = load <1 x i64>, ptr %A
    %tmp2 = load <1 x i64>, ptr %B
    %tmp3 = load <1 x i64>, ptr %C
    %tmp4 = and <1 x i64> %tmp1, <i64 3>
    %tmp6 = and <1 x i64> %tmp3, <i64 -4> 
    %tmp7 = or <1 x i64> %tmp4, %tmp6
    ret <1 x i64> %tmp7
}
```



这个例子中，以下四条指令可以看成是掩码访存模版，通过掩码实现向量运算。

```
; CHECK-NEXT:    vldr d17, [r2]                     ; 1. 加载 C 的值到 d17
; CHECK-NEXT:    vldr d16, LCPI3_0                  ; 2. 加载掩码到 d16
; CHECK-NEXT:    vldr d18, [r0]                      ; 3. 加载 A 的值到 d18
; CHECK-NEXT:    vbsl d16, d18, d17   
```





1. **`VBSL` 指令的作用**: 在这段代码中，`VBSL` 指令被用来高效地实现两个 64 位整数的 ** 位拼接（Bit Splicing）** 操作。它根据一个固定的掩码，将一个寄存器的低 2 位和另一个寄存器的高 62 位组合在一起，生成一个新的 64 位整数。
2. **`d16` 。这个掩码是一个固定的值，由编译器在编译时生成并存放在常量池中（`LCPI3_0`）。

在这个例子中：

- **掩码** (`0b...0011`) 被存放在寄存器 `d16` 中。
- **源数据 A** 被存放在寄存器 `d18` 中。
- **源数据 C** 被存放在寄存器 `d17` 中。
- `vbsl d16, d18, d17` 指令根据 `d16` 的值，将 `d18` 的低 2 位和 `d17` 的高 62 位拼接起来，并将最终结果存入 `d17`。
