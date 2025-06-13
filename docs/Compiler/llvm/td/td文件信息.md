<h1 align="center">td文件信息</h1>
## 



https://blog.csdn.net/fs3296/article/details/141831812



# 定义指令

td通过class Instruction来定义指令，其各个字段意义如下：

```asm
OutOperandList：输出dag节点列表；
InOperandList：输入操作数节点列表；
AsmString：用于在“.s”文件中的汇编显示；
Pattern：用于指令选择匹配的dag列表；
Predicates：用于在指令选择阶段是否启用的条件判断；
Uses：指令引用的寄存器列表；
Defs：指令改写的寄存器列表；
Size：指令编码成二进制的长度，为0表示可变长度；
CodeSize：
Itinerary：按步骤方式的调度模式；
SchedRW：按资源使用的调度模式；
Constraints：约束条件，例如有些指令源寄存器与目的寄存器笔下相同，则$src = $dst;
TSFlags：
```

注：还有一个隐含的字段field bits Inst，该字段表示指令转换为二进制时bit位。例如RISCV里面为field bits<32> Inst。




# . 定义SDNode
SDNode用于定义一个dag节点，它分别有如下重要参数：

```asm
opcode：SDNode的节点枚举；
typeprof：用于描述节点特性的SDTypeProfile类型；
props：节点属性列表，定义在SDNodeProperties.td文件中，对应源码enum SDNP。例如满足交换律、满足结合律、有边界影响；
sdclass：节点对应C++类型名称；
```



SDTypeProfile用于描述节点的特性，各个参数如下：

```asm
numresults：节点输出值数量；
numoperands：节点输入操作数数量；
constraints：节点输出/入的约束；
```

注：SDTypeConstraint用于描述节点的输入输出约束。例如SDTCisInt<2>表示第0个输出/入为int，假设节点numresults为1，numoperands为2，序号从0到2，前面一个为输出、后面两个为输入。



# 3. PatFrags
例如store节点包括unindexed store、normal store、trunc store等，怎么分别定义这些SDNode呢？这时PatFrags就派上用场，其主要的参数如下：

```c++
ops与frags：它表示将frags中的任何片段之一匹配成ops片段；
pred：启动该匹配的前置条件代码，输出布尔变量。该代码片段生成于XXXGenDAGISel.inc中，代码片段除了可以访问class XXXDAGToDAGISel，还可以访问一个临时变量SDNode *N；
xform：对节点的转换代码片段，类型为SDNodeXForm。默认为NOOP_SDNodeXForm，即不转换。
```

注：PatFrags本质上是模式匹配的宏（类似c中的宏定义），只有代入pat中才会展开其功能。通常frags只有一项，因此td模板定义了PatFrag来表示这种情况。

class SDNodeXForm用于对节点的转换操作，例如在PatFrags匹配结束，基于匹配的SDNode构造上级pat匹配结果的操作数、或者做封装、甚至替换。此外，SDNodeXForm还会出现在dag匹配片段中。核心字段如下：

```c++
opc：可转换的节点，类型为SDNode。
xformFunction：转换代码片段，代码片段除了可以访问class XXXDAGToDAGISel，还可以访问一个临时变量SDNode *N；
```



## .1 ImmLeaf
ImmLeaf表示将一个常数叶子重新匹配、或者说重定义为一个新的节点，也就是立即数节点。用于取立即数操作。立即数节点是没有子节点可继续展开，所以在PatFrag中断ops参数由一个空的ops表示。其主要两个参数：




```c++
vt：表示节点的输出类型，例如i8、i16、i32等；
pred：表示可匹配的先决条件，为一段输出布尔的代码。代码片段除了可以访问class XXXDAGToDAGISel，还可以访问一个临时变量 Imm
```



### .2 PatLeaf

PatLeaf表示将一个无操作数节点重新匹配、或者说重定义为一个新的节点名称，PatLeaf是PatFrag子类。由于叶子节点没有子节点可继续展开，所以在PatFrag中断ops参数由一个空的ops表示。例如x86中如下定义：

```asm
... ...
def i32immSExt8  : ImmLeaf<i32, [{ return isInt<8>(Imm); }]>;
... ...
def i32immSExt8_su : PatLeaf<(i32immSExt8), [{
    return !shouldAvoidImmediateInstFormsForSize(N);
}]>;
... ...

```



注：与PatFrag类似，pred字段的代码片段除了可以访问class XXXDAGToDAGISel，还可以访问一个临时变量SDNode *N。





# 4 ComplexPattern

ComplexPattern可用于从节点中提前操作数。例如地址有基地址、偏移、scale等组成，这时ComplexPattern派上用场。其各个字段意义如下：

```c++
Ty：被提取、或者说匹配的节点类型；
NumOperands：需要提前的子操作数个数；
SelectFunc：表示class XXXDAGToDAGISel中用于提取操作的成员函数名称；
RootNodes：表示该提取操作在哪些根节点下有效。为空则没有限制；
Properties：表示被提取节点(而非根节点)的属性；
```



例如X86中，有如下定义：

```asm
def addr      : ComplexPattern<iPTR, 5, "selectAddr", [], [SDNPWantParent]>;
```



则X86DAGToDAGISel类中有如下函数实现：

```c++
//Parent - ComplexPattern中定义了SDNPWantParent属性；
//N - 被提取节点，类型为iPTR；
//后面的导出参数对应ComplexPattern中定义的5个需要提前的子操作数
bool X86DAGToDAGISel::selectAddr(SDNode *Parent, SDValue N, SDValue &Base,
                                 SDValue &Scale, SDValue &Index,
                                 SDValue &Disp, SDValue &Segment) {
```





# 5. 谓词条件
谓词条件表示匹配或定义有效的前置条件。除了前面各个record中表示谓词的字段。还有一种定义谓词的通用方式，就是def的record多重继承class Requires< list < Predicate > preds >。其中Predicate定义的谓词一般访问Subtarget实现返回条件布尔值。



## 模式匹配

### 6.1 dag的组成

在模式匹配中，由节点、操作数、输出三者组成一个dag单元；一个匹配的dag由一个dag单元组成、或多个dag单元嵌套组成。

```c++
节点的组成：Instruction、SDNode、PatFrags和它们的派生类型组成；
操作数的组成：除了可以由组成节点的类型组成外；可以由ComplexPattern、SDNodeXForm、Operand以及Operand的派生类型组成；还可以由具体的值(如0、1、。。。)、ValueType的派生类型、RegisterClass、具体的Register组成；另外操作数还可以由一个dag单元组成，用于复杂的dag嵌套；
输出的组成：一般可以不提供，它通常由set指定，由RegisterClass、具体的Register组成。
```



注：特别地，ValueType的派生类型可以显示声明操作数的数据类型和节点输出的数据类型。

此外，llvm还提供了一些特殊的def，也是dag组成的元素。

```c++
unknown：表示节点的操作数、输出值是一个不可知的任意可能的输入/输出；
node：表示组成节点单位的任意元素。通常用在PatFrags和它们的派生类型组成中；
set：用于声明节点输出；
implicit：用于声明dag隐式读取或修改某个寄存器；
```







