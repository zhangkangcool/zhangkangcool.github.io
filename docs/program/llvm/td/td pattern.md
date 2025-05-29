



- PowerPC specific DAG Nodes.(与PPCISD::XSMAXCDP对应的node)

  PPCxsmaxc可理解成自定义指令时，在TD文件中使用的PPCISD::PPCxsmaxc

```shell
def PPCxsmaxc : SDNode<"PPCISD::XSMAXCDP", SDT_PPCFPMinMax, []>;
```



- Lowering

```c++
DAG.getNode(PPCISD::XSMAXCDP, dl, Op.getValueType(), LHS, RHS);
```



- Instruction Selection

  两种方式：一种是用def ppc指令时利用的set中的isd进行匹配，另一种是利用pat来匹配。

  pat一般用于多条isd匹配，或者是RC类型需要进行兼容性转化的情况。

  def ppc::mc ::format<,,,[set isd pattern]>

  1. (PPCxsmaxc -> PPC::XSMAXCDP )

```c++
def XSMAXCDP : XX3_XT5_XA5_XB5<60, 128, "xsmaxcdp", vsfrc, vsfrc, vsfrc,
                                 IIC_VecFP,
                                 [(set f64:$XT, (PPCxsmaxc f64:$XA, f64:$XB))]>;
```



2. PPCxsmaxc -> PPC::XSMAXCDP(硬件指令)

```c++
def : Pat<(ISD::Node), (PPC::Node)>
ISD::VECTOR_EXTRACT_ELT

 def : Pat<(i32 (vector_extract v4i32:$S, 0)),
            (i32 (EXTRACT_SUBREG (VEXTUWLX (LI8 0), $S), sub_32))>;
```



```c++
def : Pat<(f32 (PPCxsmaxc f32:$XA, f32:$XB)),
            (f32 (COPY_TO_REGCLASS (XSMAXCDP (COPY_TO_REGCLASS $XA, VSSRC),
                                             (COPY_TO_REGCLASS $XB, VSSRC)),
                                   VSSRC))>;
```





### Example

PPC::CRSET,

 [(set i1:$dst, 1)]是匹配的ISD

`creqv $dst, $dst, $dst`: 将会生成的asm

```c++
def CRSET  : XLForm_1_ext<19, 289, (outs crbitrc:$dst), (ins),
              "creqv $dst, $dst, $dst", IIC_BrCR,
              [(set i1:$dst, 1)]>;
```





