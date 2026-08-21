# ResNet50 详细技术文档（结合你全部提问重点整理）

> 面向硬件推理/ONNX模型分析视角，重点收录你反复疑惑的概念、层级划分、张量维度、卷积统计、Bottleneck、QDQ模型特征，避开论文晦涩表述。

## 目录

1. 网络整体概述
2. Stage分段结构（INPUT → Stage0~Stage4）
3. Bottleneck（瓶颈块）完整解析【你重点提问】
4. 张量维度总表（标准输入224×224 RGB）
5. 卷积算子两种统计口径（49Conv / 53Conv【核心疑问点】）
6. Shortcut 两种支路区分
7. 1×1卷积、FC全连接、张量Tile分片概念
8. ONNX QDQ量化模型特征（你的模型：resnet50-v1-12-qdq_cix_s.onnx）
9. Netron可视化读图实操要点
10. 高频误区汇总（全部来自你的提问）

------

# 1. 网络整体概述

ResNet50 属于残差卷积神经网络，原生用途：ImageNet图像分类； 同时广泛作为检测、分割网络的**骨干Backbone**。

- 输入：RGB图片 `NCHW = [N,3,224,224]`；NHWC格式 `[N,224,224,3]`
- 命名由来：**49层卷积 + 1层全连接 = 50层**
- 核心创新：残差连接（Add短路支路），解决深度网络梯度消失。

> 张量格式区分（重中之重，你一直在看NHWC特征） NCHW（PyTorch原生）：`[Batch, C, H, W]` NHWC（Triton/硬件/你的推理场景）：`[Batch, H, W, C]`，简写 `[H,W,OC]` OC = Output Channel，输出通道；OC_tile = 通道分片大小（channel tiling）

# 2. ResNet50 5个Stage分段定义（行业硬件通用划分）

```
原图输入 → Stage0 → Stage1 → Stage2 → Stage3 → Stage4 → 池化 → FC分类头
```

| 分段    | 内部模块              | 输出张量(NCHW) | NHWC简写[H,W,OC] | 说明                                                 |
| ------- | --------------------- | -------------- | ---------------- | ---------------------------------------------------- |
| Stage 0 | Conv1(7×7)+MaxPool    | `[64,56,56]`   | `[56,56,64]`     | 初始特征提取，不属于Bottleneck                       |
| Stage 1 | Conv2_x 3个Bottleneck | `[256,56,56]`  | `[56,56,256]`    | 无下采样，H/W保持56×56                               |
| Stage 2 | Conv3_x 4个Bottleneck | `[512,28,28]`  | `[28,28,512]`    | 首个block stride=2，尺寸减半                         |
| Stage 3 | Conv4_x 6个Bottleneck | `[1024,14,14]` | `[14,14,1024]`   | 首个block stride=2，尺寸减半                         |
| Stage 4 | Conv5_x 3个Bottleneck | `[2048,7,7]`   | `[7,7,2048]`     | 主干最终特征图，通道最大2048，常做Channel Tiling分片 |

> 重点：Stage边界 = 特征图分辨率发生切换的位置。

# 3. Bottleneck 瓶颈块完整解析（你最高频提问）

一个Bottleneck中有3个conv, 最左边那个直接下来的不算。

## 3.1 定义

Bottleneck 是ResNet50最小残差计算单元； **标准模板：1×1 Conv → 3×3 Conv → 1×1 Conv，3层卷积构成主分支**

```
输入特征X
├─主分支：Conv1×1(降通道) → Conv3×3(空间特征提取) → Conv1×1(升通道) → F(x)
└─Shortcut支路：两种形态
输出：F(x) + Shortcut(X) → Add → ReLU
```

名称由来：中间通道被压缩，类似瓶子颈部，大幅降低计算量。

## 3.2 两种Shortcut（你在Netron截图清晰可见）

1. **投影Shortcut（带1×1 Conv）** 仅每组**第0号Bottleneck**拥有（Block2_0 / Block3_0 / Block4_0 / Block5_0） 作用：输入与输出通道、H/W尺寸不一致，使用1×1卷积匹配维度。 👉 也就是你截图里**额外出现的第4个Conv**！
2. **恒等Shortcut（无卷积）** 同组剩余所有Bottleneck，通道、尺寸不变，张量直接连线，**没有卷积算子、无权重**。

## 3.3 关键结论：所有Bottleneck不完全相同

✅ 算子执行**顺序模板一致** ❌ 计算参数不一样：

1. 不同Stage通道配置不同：(in_c,mid_c,out_c) Conv2_x：(64,64,256) Conv3_x：(256,128,512) Conv4_x：(512,256,1024) Conv5_x：(1024,512,2048)
2. stride不同：只有每组第一个Block的3×3卷积stride=2，触发下采样，H/W缩小
3. 是否存在shortcut卷积不统一
4. 每个卷积拥有独立权重参数，不存在复用

# 4. 卷积算子数量两大统计口径（你核心疑问：到底49还是53个Conv）

## 口径1：论文标准（命名ResNet50使用）

只统计Bottleneck**主分支内部3个卷积 + Stage0的Conv1**

- Conv1：1

- Conv2_x：3block ×3 =9

- Conv3_x：4block ×3 =12

- Conv4_x：6block ×3 =18

- Conv5_x：3block ×3 =9 合计：

  49个卷积

  > ⚠️ 规则：**4个shortcut投影卷积不纳入统计！**

## 口径2：硬件/ONNX算子统计（Netron读图、调度、权重加载用）

4个Stage各存在1个shortcut投影卷积，一共4个额外Conv 总卷积 = 49 + 4 = **53个Conv算子**

> 你在ONNX模型中遍历所有Conv节点，总数就是53！

## 重要区分

FC全连接MatMul **不属于Conv**，不要计入卷积数量。

# 5. 特征图Channel Tiling（通道分片，你最早的问题）

主干最后输出特征：`[7,7,2048]`（NHWC）

- H=7 特征图高度，W=7特征图宽度，**不是原图尺寸！**

- OC=2048 输出通道数量（每一条通道代表一类提取的视觉特征） 硬件片上SRAM无法一次性缓存2048通道完整特征图 解决方案：**Channel Tiling** 沿通道维度切分：`[H,W,OC]` → 多个 `[H,W,OC_tile]`

- tile：分片、子块

- OC_tile：单个分片内的通道数量

  > 只切通道，H、W空间维度保持完整不变。

# 6. 1×1卷积 VS FC全连接（你最后截图提问）

## 1×1 卷积（网络主干内，属于Conv算子）

张量格式：`[N,C,H,W]`，保留空间维度H、W； 作用：通道升降维，特征融合。 即使H=7,W=7依然是卷积，**不属于FC**。

## FC全连接层（分类头）

出现位置：GlobalAveragePool + Flatten之后 ONNX中使用 **MatMul + Add(bias)** 实现 输入是一维向量 `[N,2048]`，无空间H/W维度； 输出1000分类结果。

> 补充：数学上当H=1,W=1时1×1卷积等价FC，但网络结构归属上严格区分。

# 7. 关于你的模型文件 resnet50-v1-12-qdq_cix_s.onnx

1. **qdq**：QDQ量化模型，网络插入`QuantizeLinear`/`DequantizeLinear`节点，FP32→INT8量化推理；
2. **cix**：RISC-V CIX自定义硬件算子，通用Netron无法解析内部逻辑，只会显示CustomOp；
3. **_s**：simplified，简化后的ONNX模型；
4. Netron打开提示：QDQ节点是量化封装，**不属于网络原生算子结构**，硬件通常做Conv-QDQ算子融合。

# 8. Netron可视化读图实操要点

1. 在线地址：https://netron.app/ （文件本地解析，不上传）
2. 识别Bottleneck特征：3条主分支Conv + 末端Add残差相加；
3. 判断Stage分界线：观察张量H/W数值变化；
4. 区分投影shortcut：左侧多出一条独立Conv；普通block只有导线；
5. 最末尾蓝色Conv依然属于Stage4主干，后面Pool+MatMul才是FC。

# 9. 高频误区汇总（全部来自你的提问）

1. ❌ H、W是原图分辨率 ✅ H、W是**特征图尺寸**，经过下采样不断缩小，原图224×224，主干最终7×7
2. ❌ 一个Bottleneck固定看到4个Conv ✅ 只有组首Block带有shortcut投影Conv（4个Conv）；其余Block只有主分支3个Conv
3. ❌ ResNet50名字里的50层包含shortcut卷积 ✅ 50层定义：49主分支卷积 + 1FC，不含shortcut卷积
4. ❌ Stage末尾的1×1卷积就是全连接FC ✅ Pool之后的MatMul才是FC
5. ❌ 所有Bottleneck内部计算完全一致 ✅ 模板顺序一致，通道、stride、shortcut结构存在差异
6. ❌ OC是图片通道 ✅ OC=Output Channel，特征图通道，代表提取的特征种类，越靠后通道越多

# 10. 补充工程实用建议

1. 做硬件算子调度：使用 **53Conv** 统计口径，不要漏掉4路shortcut卷积；
2. 特征缓存压力最大位置：Stage4输出 `[7,7,2048]`，优先考虑通道tiling；
3. 下采样只发生在Conv3_x/4_x/5_x第一个Bottleneck；Conv2_x全程尺寸不变；
4. QDQ量化模型开发：设计时将Quantize/Dequantize和前后Conv融合，减少数据搬移。

如果你需要，我可以把这份文档调整为Markdown格式，你可以直接保存，或者再补充一份【每层输入输出张量+权重尺寸附表】。