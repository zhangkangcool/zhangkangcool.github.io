LLVM `isReMaterializable` 完整详解（含RISCV实例）

# LLVM `isReMaterializable` 完整详解（含 RISCV 实例）

## 一、基础概念：什么是 Rematerialization（重物化 / 重计算）

寄存器分配阶段，当虚拟寄存器不够用时，编译器有两种选择：

1. **Spill（溢出）**：把寄存器值存栈（`sw`），用时再加载（`lw`），产生内存访问开销；
2. **Remat（重物化）**：**不存栈，直接原地重新计算出该值**，省去栈读写，降低栈内存、减少访存指令。

`isReMaterializable` 是后端 `.td` 指令描述里的布尔标记（`let isReMaterializable = 1;`），**仅作为编译器的提示**：这条指令理论上支持重物化，但最终能否真的重算，还要通过 `isTriviallyReMaterializable()` 做运行时校验。

### 重物化指令硬性要求（缺一不可）

1. **无副作用**：不能写内存、不能分支、不能调用函数、不能修改其他寄存器；
2. **输入永远稳定可用**：操作数只能是**立即数 / 固定物理寄存器（x0/sp/gp 等）**，不能依赖会被修改的通用虚拟寄存器；
3. **计算代价极低**：单条简单算术 / 加载指令，重算成本远低于一次栈 store+load；
4. 结果仅由自身操作数决定，不受程序执行路径、内存修改影响。

## 二、`isReMaterializable` 核心含义

1. **指令级标记**：写在后端 TD 指令定义中，告诉 LLVM 寄存器分配器：该指令具备重物化潜力；
2. **只是 Hint，不是保证**：
   1. 例：RISCV `addi rd, rs, imm` 标记 `isReMaterializable=1`，但如果`rs`是普通通用寄存器（会被改写），实际不能重算；只有`rs=x0`（零寄存器）时才允许重算；
   2. `lui` 永远可重算，操作数只有立即数，无依赖寄存器；
3. 作用：寄存器分配器遇到高寄存器压力时，优先对标记该位的指令做 remat，**消除 spill 栈帧、减少 lw/sw**，缩小栈占用。

## 三、区分两个关键 API（容易混淆）

1. `MCInstrDesc::isReMaterializable()` 只读 TD 里静态标记，只看指令模板，不看当前指令实例操作数。
2. `TargetInstrInfo::isTriviallyReMaterializable(MachineInstr &MI)` 运行时校验：结合当前指令的操作数、寄存器使用，判断**这条具体机器指令**是否真的可以重物化。

## 四、RISCV 完整实例（你之前接触过的 lui/addi/lla）

### 1. TD 定义片段（RISCV 后端）

```td
let isReMaterializable = 1, hasSideEffects = 0 in {
  def LUI : RVInstU<0b0110111, "lui", GPR, uimm20>;
}
let isReMaterializable = 1, hasSideEffects = 0 in {
  def ADDI : RVInstI<0b0010011, 0b000, "addi", GPR, GPR, simm12>;
}
```

- `LUI`：仅 20 位立即数，无输入寄存器，**任意实例都能重物化**；
- `ADDI`：标记可重算，但仅当源寄存器是`x0`时，才通过`isTriviallyReMaterializable`校验。

### 场景 1：LUI 重物化（永远合法）

原始 MIR 逻辑：

```asm
# 提前计算常数0x12345000存入a0
lui a0, 0x12345
# 中间大量代码，寄存器压力爆炸，a0必须让出
# 普通方案：sw a0, 0(sp) 溢出到栈；后续lw a0,0(sp)恢复
# Remat方案：不溢出，每次使用时重新执行lui
call func1, a0
call func2, a0
```

无 remat 生成代码（产生栈操作）：

```asm
lui a0,0x12345
sw a0, 0(sp)   # 溢出
call func1
lw a0, 0(sp)   # 重载
call func2
```

开启 remat 后（利用`isReMaterializable=1`标记）：

```asm
lui a0,0x12345
call func1
# 不存栈，第二次使用重新生成
lui a0,0x12345
call func2
```

收益：省去栈空间、消除`sw/lw`两条内存指令。

### 场景 2：ADDI 两种情况对比

#### 可重物化：`addi a1, x0, 100`

源寄存器是零寄存器 x0（永不修改），满足输入稳定：

```asm
addi a1, x0, 100
# 寄存器不足时，每次使用直接重算addi，不用栈溢出
```

#### 不可重物化：`addi a1, a2, 100`

a2 是通用寄存器，中间代码可能改写 a2 的值，重算会得到错误结果，`isTriviallyReMaterializable`返回 false，只能溢出栈。

### 场景 3：lla /auipc+addi（PC 相对地址）

`auipc`、`addi %pcrel_lo`均标记`isReMaterializable=1`，只要符号与代码段相对位置不变，地址可随时重算：

```asm
# 原始lla伪指令展开
auipc t3, %pcrel_hi(val)
addi t3, t3, %pcrel_lo(val)
```

寄存器压力大时，不会把 val 的地址存栈，而是在每个使用点重新执行这两条指令，消除栈帧。

## 五、直观对比：Spill vs Remat 代码差异

### C 源码示例

```c
void test() {
  int a = 0x12345000;
  use(a);
  // 中间大量占用寄存器的计算
  use(a);
}
```

1. **关闭 isReMaterializable（无重物化）**

```asm
lui a0, 0x12345
sw a0, 0(sp)    # 分配栈空间溢出
jal use
lw a0, 0(sp)    # 从栈重载
jal use
addi sp, sp, 4
```

栈占用 + 2 条访存指令。

1. **开启 isReMaterializable（支持重物化）**

```asm
lui a0, 0x12345
jal use
# 直接重算，无栈操作
lui a0, 0x12345
jal use
```

栈内存减少，无 load/store。

## 六、哪些指令一般标记 isReMaterializable=1 / 禁止标记

### ✅ 典型可标记（无副作用、依赖立即数 / 固定物理寄存器）

1. 立即数加载：`lui`、`li`展开的`addi x0`；
2. PC 相对地址计算：`auipc`、`addi %pcrel_lo`（lla 依赖的两条指令）；
3. 简单位运算（仅立即数 + x0）：`andi x0`、`ori x0`；
4. 只读静态常量加载（无内存修改风险）。

### ❌ 绝对不能标记

1. 访存写指令：`sw/fsh`（有副作用）；
2. 普通 load：`lw/flh`（内存值可能中途被改写，重算结果不一致）；
3. 依赖可变通用寄存器的运算：`add a0,a1,a2`；
4. 函数调用、分支、系统指令；
5. 有状态修改的浮点 / 向量指令。

## 七、关键补充误区澄清

1. **不是标记了就一定会重算** LLVM 会权衡开销：如果重算需要 3 条以上指令，而 spill 仅 1 条 load，会放弃 remat，选择栈溢出。
2. **和 LICM（循环不变量外提）是反向优化**
   1. LICM：把循环内不变计算提到循环外，减少重复计算，但拉长寄存器存活区间，增加溢出；
   2. Remat：把计算放回循环内，少量重复计算，大幅降低寄存器压力，减少栈访问。二者相互配合。
3. **对 PIC 代码收益巨大** `auipc+addi`重物化可以避免 GOT 加载、栈溢出，动态库 / PIE 程序栈占用显著下降（官方测试 Dhrystone 栈从 192→112 字节）。

## 八、一句话总结

`isReMaterializable` 是后端指令模板的静态标记，告知寄存器分配器该指令具备**原地重计算**的潜力；寄存器压力高时，编译器会校验操作数是否稳定，合法则放弃栈 spill，每次使用重新执行该指令，减少内存访问与栈开销，RISCV 中`lui`、`auipc`、`x0作为源的addi`是最典型的重物化指令。