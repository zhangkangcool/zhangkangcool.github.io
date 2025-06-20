<h1 align="center">SNN脉冲神经网络</h1>
https://www.cxyzjd.com/article/Jaggie_Yan/121908955

https://blog.csdn.net/Jaggie_Yan/article/details/121908955

https://neuronaldynamics.epfl.ch/online/Ch1.S3.html（英文）



![image-20221024104619671](SNN脉冲神经网络.assets/image-20221024104619671.png)





```
synapse: 突触
membrane: 膜电位
```









# 名称理解

LIF模型全称——*Leaky Intergrate and Fired Model*，其中：

1. **Leaky(泄露):** 表示如果神经元输入只有一个，且不足以让膜电势超过阈值时，由于细胞膜不断进行膜内外离子交换，膜电势会自动发生泄露逐渐回落到静息状态；
2. **Intergrate(集成):** 表示神经元会接收所有与该神经元相连的轴突末端发送来的脉冲，并将所接收的所有脉冲信号进行集成(求和)；
3. **Fired(激发):** 表示当膜电势超过阈值时，神经元会发送脉冲，同时膜电位回落至静息电位Vreset。

# 名词解释

更详细的脉冲发放机制可以参考另一篇博文[[认知神经科学系列｜(2)细胞机制与认知\]](https://blog.csdn.net/ly18846826264/article/details/103319484)

1. **膜电势:** 细胞膜两侧的电位差，在神经细胞通讯中起到重要作用，当膜电势超过阈值时神经元发放脉冲；
2. **静息电位($u_{rest}$):** 细胞膜电位的常态；
3. **动作电位:** 神经元接收外界刺激，细胞膜两侧离子快速跨膜运动，引起膜电位变化。

# LIF模型工作过程

## 0. 说在前面

LIF模型的任务就是建立描述膜电势随时间以及外界输入进行变化的模型，是一种对[[HH模型\]](https://blog.csdn.net/ly18846826264/article/details/103230383)的简化版。简化过程可以说是为了“解决主要矛盾“而”忽略次要矛盾”，在我理解来看，该模型不去刻意描述膜电势变化过程中离子的具体运动情况，而是直接抓住引起膜电势变化发生的两大场景：膜电容和膜电阻，其中电阻的引入便是对细胞膜内外钠、钾等离子运行情况的抽象。LIF相较于HH模型而言降低了对生物特性描述的精度，但是提高了模型在实际应用中的可执行性，对“主要矛盾“进行了有效解决。

## 1. 膜电势变化的场景(1)——细胞膜的电容性

由生物理论可知，一个神经元被由磷脂双分子层构成的细胞膜包围，同时，细胞膜也具有一定的绝缘性来保证内环境的稳定。从电学角度来看，如果想为神经元注射电流，那么附加的电荷必须要有它的容身之所，也就是：它会给细胞膜充电，因此，细胞膜就被近似为一个电容器。充电过程可由下式描述：
$$
q = \int I(t)dt
$$

## 2. 膜电势变化的场景(2)——细胞膜的电阻性

由于细胞膜自身绝缘性的不完美，所以随着时间的推移，电荷会慢慢地从细胞膜内泄漏出，此时细胞膜可以用有限的泄露电阻来表示。综上所述，细胞膜可以建模为膜电容$C$和膜电阻$R$的并联电路，同时，LIF模型的电回路也可表示为由一个电容*C* 和一个由电流 *I* 驱动的电阻*R* 并联而成的电路，如下图所示。如果驱动电流消失，则整个电容器的电压由静息电位$u_{rest}$也就是下图中的$u_{rest}$提供。

![image-20221024104816419](SNN脉冲神经网络.assets/image-20221024104816419.png)



$u(t)$表示膜电容两端的电压，

$I(t)$表示膜电阻的电流。

$u_{rest}$表示静息电压，即电源电压，也就是当不再充电放电时的电压。因此，在没有输入的情况下，膜电位会指数衰减到静息电位。对于一个典型神经元来说，衰减发生在10ms范围内，因此相对于1ms的脉冲持续时间来说足够长。

$\tau = RC$表示时间常数，表示过渡反应的时间过程的常数。在电阻，电容的电路中，它是电阻和电容的乘积。若C的单位是μF（微法），R的单位是MΩ（兆欧），时间常数的单位就是秒。在这样的电路流过恒定电流I，电容的端电压达到最大值的1−1/e，也就是约0.63倍所需要的时间，也即电路断开时（一开始端电压等于最大值），时间常数是电容的端电压达到最大值的1/e1（也就是最大值的0.37倍）所需要的时间就是时间常数。

## 3. 模型的电路分析

为了分析电路，我们利用电流守恒定律，将驱动电流分为分别来自于膜电容和膜电阻的两部分，如下式所示：
$$
I = I_R + I_C
$$




1. 其中，第一个分量代表经过膜电阻的电流，从生物理论的角度来看，则代表由膜内外离子运动所产生的电流。该分量可由下式进行计算：

$$
I_R = \frac{u_R}{R} \\
u_R = u - u_{rest}
$$



2. 其中，第二个分量是给电容器充电，因此流过电容的电流可由下式进行计算：

$$
I_C = C\frac{du(t)}{d(t)}
$$





3. 综上，则有：

$$
I(t) = \frac{u(t) - u_{rest}}{R} + C\frac{du(t)}{d(t)}
$$

引入时间常数$\tau_m=RC$， 则有：


$$
\tau_m\frac{du(t)}{d(t)} = - [u(t) - u_{rest}] + RI(t)
$$

## 4. 模型的方程求解

- 假设时间为0时，膜电势取$u_{rest} + \Delta u$，以后的时间输入电流都为0，此时膜电容开始放电，直至膜电位放松到静息电位。这个过程中，$u(t)$可由下式表达(其中，$t > t0$)：

$$
u(t) = u_{rest} + \Delta {u} exp(-\frac{t - t0}{\tau_m}), \quad for \quad t > t_0
$$





其中$exp(-\frac{t - t0}{\tau_m})$为$RC$串联电路的放电公式，$\tau_M$代表放电过程的时间特征。因此，在没有输入的情况下，膜电位会指数衰减到静息电位。对于一个典型神经元来说，衰减发生在10ms范围内，因此相对于1ms的脉冲持续时间来说足够长。

- 当初始时电压为静息电位，且有输入电流时，$u(t)$可由下式表达。会逐渐升高：

$$
u(t) = u_{rest} + RI_0[1 - exp(-\frac{t}{\tau_m})]
$$



原参考博客中并没有对这个表达式的详细分析，我刚开始看到这个表达式很不明白是怎么得出的，自己鼓捣了很久，在这里写下我的最终理解，如果理解有误，还请高手指点一二！

- [1] 首先，我认为公式中的$RI_0 = \Delta u$。推论如下：
  
  - 我先介绍下$\Delta u$是什么。通过上方4.1的部分可知，$\Delta u$代表的就是有电流输入时$u(t)$动态变化到最大值时与$u_{rest}$的差值，同时，我们假设$u(t)$在$t_0$时刻到达最大值，那么$\Delta u = u(t_0) - u_{rest}$。此处上图来直观感受下：
    
    ![image-20221024141233494](SNN脉冲神经网络.assets/image-20221024141233494.png)
    
  - 接下来介绍RIo和Δu如何产生联系。此时，让我们只聚焦于t0这一时刻，并将相关变量带入如下所得的公式：

$$
\tau_m \frac{du(t)}{d(t)} = - [u(t) - u_{rest}] + RI(t)
$$

我们可以得到：
$$
u(t) - u_{rest} = RI_0 - \tau_m \frac{du(t)}{d(t)}
$$
其中，$u(t) - u_{rest} = \Delta u$，又由图可得，在$t0$时刻$\frac{du(t)}{d(t)}=0$，那么便有$RI_0 = \Delta u$。

- [2] 接下来，介绍$[1 - exp(-\frac{t}{\tau_m})]$是如何得到的。根据1中的图，我们可以观察到Line1和Line2的形状是关于x轴对称的，又由4.1可得，Line2的表达式为$exp(-\frac{t}{\tau_m})$，那么与之对称的曲线表达式便为$exp(-\frac{t}{\tau_m})$，同时需要保证Line1位于x轴上方，则Line1的表达式为[1-exp(-t/Tm)]。同样由图可知，$\Delta u$为$u(t)$与$u_{rest}$的最大差值，当$ t < t_0 $时，$[u(t)-u_{rest}]依据Line1逐渐上升至Δu，则在该时段内的[u(t)-Urest]=Δu[1-exp(-t/Tm)]，也就是RIo[1-exp(-t/Tm)]。
- [3] 至此，当初始时电压为静息电位，且有输入电流时，$u(t)$的表达式便可得出。



![image-20221024150142249](SNN脉冲神经网络.assets/image-20221024150142249.png)

$u_\tau$ 即为$u_{reset}$,即重置电压。

`fire time`神经元产生一个动作电位$t^{(f)}$的时间。

在`LIF`模型定义为：
$$
t^{f}： \quad u(t^{(f)}) = \vartheta
$$
含义是在某个时刻产生的动作电位，使膜电位达到$u_{thre}$
根据上图实线，动作电位产生后马上将膜电位
设置$u_r$

limδ→0;δ>0u(t(f)+δ)=ur
$$
lim u(t^{(f)} + \sigma) = u_r
$$




# 补充图片助理解



以下是我看到比较直观展示细胞膜电位变化的图片，可以进一步促进理解。

https://flashgene.com/archives/65582.html

下图是HH模型的图，LIF是简化后的HH模型。

![image-20221024143934528](SNN脉冲神经网络.assets/image-20221024143934528.png)

图中共有6个输入脉冲（垂直虚线所示），每个脉冲触发膜电压V的快速上升。如果输入脉冲之间的时间间隔较长（例如在1ms与22ms到达的2个脉冲之间，由于漏电通道的作用，没有新的输入脉冲），膜电压V就会随着时间逐渐降低至平衡电压El。如果有多个输入脉冲在短时间内连续到达（例如在45~50ms 之间的3 个脉冲），那幺膜电压V会上升至发放阈值Vth（红色水平虚线所示） 而触发一个输出脉冲。之后V被重置为低于平衡电压El的Vreset，然后逐渐回升至平衡电压El。神经元的行为与输入的时间特性密切相关，一组脉冲如果在短时间内连续到达，可以触发神经元的脉冲；但是同样数量的一组脉冲如果在较长时间内分散到达，那幺膜电压的漏电效应便不会产生脉冲。



为了解决HH模型运算量的问题，许多学者提出了一系列的简化模型。LIF模型将细胞膜的 电特性看成电阻和电容的组合 。 leaky表示泄露，由于细胞膜是不断进行膜内外离子的交换，所以当只有一次输入时，电压会自动发生泄漏逐渐回落到静息状态。对于LIF模型一般是认为先下降低于Vrest,再上升的静息电位处，而IF神经元一般是认为直接回落到静息状态处，这里涉及到一个reset电位。这里的reset可以看成输入一个短暂的电流脉冲