<h1 align="center">定义operand</h1>




https://blog.csdn.net/fs3296/article/details/141831812





Operand用于定义操作，相关字段如下：

```asm
Type：操作数类型，例如i8、i16、i32等；
PrintMethod：在class XXXInstPrinter中用于打印该操作数的成员函数，参数分别为const MCInst *MI、unsigned Op、raw_ostream &O。需要cpp实现；
  
EncoderMethod：在class XXXMCCodeEmitter中用于编码该操作数的成员函数，参数分别为const MCInst &MI、unsigned OpNo、SmallVectorImpl &Fixups、const MCSubtargetInfo &STI，返回值为unsigned，表示错误编号。需要cpp实现；
  
DecoderMethod：在class XXXDisassembler中用于解码该操作数的成员函数，参数分别为MCInst &Inst、uint64_t Imm、int64_t Address、const void *Decoder，返回值为DecodeStatus；
  
hasCompleteDecoder：
  
OperandType：操作数类型字符串，包括MCInstrDesc.h中定义的enum OperandType中，有些target会进行自定义。
  
OperandNamespace：操作数类型定义所在的namespace。默认为MCOI，即定义在MCInstrDesc.h中；
MIOperandInfo：子操作数片段。例如地址可能有基地址、偏移、scale等组成，为了可读性将其合并定义为addr；
MCOperandPredicate：在XXXAsmParser和XXXAsmPrinter发射该操作数有效的匹配前置条件的代码片段。代码片段可访问const MCOperand &MCOp；
ParserMatchClass：用于汇编解析的方法集合，类型为AsmOperandClass。
```



class AsmOperandClass用于生成汇编解析代码，其各个字段如下：

```c++
Name：操作数类型名称；
SuperClasses：操作数分类所属父类列表；
PredicateMethod：表示class XXXOperand的成员函数名称，该成员函数用于判断是否为该类型的操作数，不定义则为bool is%Name%() const；

RenderMethod：表示class XXXOperand的成员函数名称，该成员函数用于将该操作数添加到MCInst中，不定义则为void add%Name%Operands(MCInst &Inst, unsigned N) const；
ParserMethod：表示class XXXAsmParser的成员函数名称，用于解析该汇编操作数。函数原型为( OperandMatchResultTy )(OperandVector &Operands)；
DiagnosticType：当XXXAsmParser解析失败时，触发的错误打印；
DiagnosticString：当该操作数被赋值一个非法值时，触发的错误打印；
IsOptional：为1表示为可选参数，为0为必须参数；

DefaultMethod：表示class XXXAsmParser的成员函数名称，当IsOptional时，该成员函数用于创建默认的该操作数，不定义则为std::unique_ptr< XXXOperand > default%Name%Operands() const；
```







以下示例代码来自`CSKYInstrInfo.td`：



下面的定义会用在`ParserMatchClass`中

```c++
//===----------------------------------------------------------------------===//
// Operand and SDNode transformation definitions.
//===----------------------------------------------------------------------===//
class ImmAsmOperand<string prefix, int width, string suffix> : AsmOperandClass {
  let Name = prefix # "Imm" # width # suffix;
  let RenderMethod = "addImmOperands";
  let DiagnosticType = !strconcat("Invalid", Name);
}

class SImmAsmOperand<int width, string suffix = "">
    : ImmAsmOperand<"S", width, suffix> {
}

class UImmAsmOperand<int width, string suffix = "">
    : ImmAsmOperand<"U", width, suffix> {
}

class OImmAsmOperand<int width, string suffix = "">
    : ImmAsmOperand<"O", width, suffix> {
}
```





```c++
class oimm<int num> : Operand<i32>,
  ImmLeaf<i32, "return isUInt<"#num#">(Imm - 1);"> {
  let EncoderMethod = "getOImmOpValue";
  let ParserMatchClass = OImmAsmOperand<num>;  # 使用上面定义的
  let DecoderMethod = "decodeOImmOperand<"#num#">";
}

def imm_neg_XFORM : SDNodeXForm<imm, [{
  return CurDAG->getTargetConstant(-N->getSExtValue(), SDLoc(N), MVT::i32);
}]>;

class oimm_neg<int num> : Operand<i32>,
  ImmLeaf<i32, "return isUInt<"#num#">(-Imm - 1);"> {
}

class uimm<int num, int shift = 0> : Operand<i32>,
  ImmLeaf<i32, "return isShiftedUInt<"#num#", "#shift#">(Imm);"> {
  let EncoderMethod = "getImmOpValue<"#shift#">";
  let ParserMatchClass =
    !if(!ne(shift, 0),
        UImmAsmOperand<num, "Shift"#shift>,
        UImmAsmOperand<num>);
  let DecoderMethod = "decodeUImmOperand<"#num#", "#shift#">";
}

class uimm_neg<int num, int shift = 0> : Operand<i32>,
  ImmLeaf<i32, "return isShiftedUInt<"#num#", "#shift#">(-Imm);"> {
}

class simm<int num, int shift = 0> : Operand<i32>,
  ImmLeaf<i32, "return isShiftedInt<"#num#", "#shift#">(Imm);"> {
  let EncoderMethod = "getImmOpValue<"#shift#">";
  let ParserMatchClass = SImmAsmOperand<num>;
  let DecoderMethod = "decodeSImmOperand<"#num#", "#shift#">";
}
```



```c++
def oimm4 : oimm<4>;
def oimm5 : oimm<5> {
  let MCOperandPredicate = [{
    int64_t Imm;
    if (MCOp.evaluateAsConstantImm(Imm))
      return isUInt<5>(Imm - 1);
    return MCOp.isBareSymbolRef();
  }];
}
def oimm6 : oimm<6>;

def imm5_idly : Operand<i32>, ImmLeaf<i32,
  "return Imm <= 32 && Imm >= 0;"> {
  let EncoderMethod = "getImmOpValueIDLY";
  let DecoderMethod = "decodeOImmOperand<5>";
}

def oimm8 : oimm<8> {
  let MCOperandPredicate = [{
    int64_t Imm;
    if (MCOp.evaluateAsConstantImm(Imm))
      return isUInt<8>(Imm - 1);
    return MCOp.isBareSymbolRef();
  }];
}
def oimm12 : oimm<12> {
  let MCOperandPredicate = [{
    int64_t Imm;
    if (MCOp.evaluateAsConstantImm(Imm))
      return isUInt<12>(Imm - 1);
    return MCOp.isBareSymbolRef();
  }];
}
```



```c++
def nimm12 : nimm<12>;

def uimm1 : uimm<1>;
def uimm2 : uimm<2>;


def uimm2_jmpix : Operand<i32>,
  ImmLeaf<i32, "return Imm == 16 || Imm == 24 || Imm == 32 || Imm == 40;"> {
  let EncoderMethod = "getImmJMPIX";
  let DecoderMethod = "decodeJMPIXImmOperand";
}

def uimm3 : uimm<3>;
def uimm4 : uimm<4>;
def uimm5 : uimm<5> {
  let MCOperandPredicate = [{
    int64_t Imm;
    if (MCOp.evaluateAsConstantImm(Imm))
      return isShiftedUInt<5, 0>(Imm);
    return MCOp.isBareSymbolRef();
  }];
}
def uimm5_msb_size : uimm<5> {
  let EncoderMethod = "getImmOpValueMSBSize";
}

def uimm5_1 : uimm<5, 1> {
  let MCOperandPredicate = [{
    int64_t Imm;
    if (MCOp.evaluateAsConstantImm(Imm))
      return isShiftedUInt<5, 1>(Imm);
    return MCOp.isBareSymbolRef();
  }];
```