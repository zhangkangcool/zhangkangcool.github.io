## 1. multiclass

TableGen的复合类(multiclasses)是一组抽象记录的集合，他们将会被一起实例化。每个实例化将会产生多个TableGen definitions，如果一个multiclass继承另外一个multiclass，在子复合类(sub—multiclass)中的definitions将会成为当前multiclass的一部分，跟它们在当前multiclass声明的效果一样。并且TableGen有个重要的特点是支持用户自定义抽象类，用于描述他们自己的需要的有用信息。



`multiclass`定义的指令必须使用`defm`，否则会报错。正常的`class`使用`def`。



## 2. example



```c++

multiclass XOForm_3rc<bits<6> opcode, bits<9> xo, bit oe, dag OOL, dag IOL,
                      string asmbase, string asmstr, InstrItinClass itin,
                      list<dag> pattern> {
  let BaseName = asmbase in {
    let Defs = [CARRY] in
    def NAME : XOForm_3<opcode, xo, oe, OOL, IOL,
                       !strconcat(asmbase, !strconcat(" ", asmstr)), itin,
                       pattern>, RecFormRel;
    let Defs = [CARRY, CR0] in
    def _rec    : XOForm_3<opcode, xo, oe, OOL, IOL,
                       !strconcat(asmbase, !strconcat(". ", asmstr)), itin,
                       []>, isRecordForm, RecFormRel;
  }
  let BaseName = !strconcat(asmbase, "O") in {
    let Defs = [CARRY, XER] in
    def O    : XOForm_3<opcode, xo, 1, OOL, IOL,
                        !strconcat(asmbase, !strconcat("o ", asmstr)), itin,
                        []>, RecFormRel;
    let Defs = [CARRY, XER, CR0] in
    def O_rec   : XOForm_3<opcode, xo, 1, OOL, IOL,
                        !strconcat(asmbase, !strconcat("o. ", asmstr)), itin,
                        []>, isRecordForm, RecFormRel;
  }
}



defm ADDME  : XOForm_3rc<31, 234, 0, (outs gprc:$rT), (ins gprc:$rA),
                         "addme", "$rT, $rA", IIC_IntGeneral,
                         [(set i32:$rT, (adde i32:$rA, -1))]>;
defm ADDZE  : XOForm_3rc<31, 202, 0, (outs gprc:$rT), (ins gprc:$rA),
                         "addze", "$rT, $rA", IIC_IntGeneral,
                         [(set i32:$rT, (adde i32:$rA, 0))]>;
defm SUBFE : XOForm_1rc<31, 136, 0, (outs gprc:$rT), (ins gprc:$rA, gprc:$rB),
                        "subfe", "$rT, $rA, $rB", IIC_IntGeneral,
                        [(set i32:$rT, (sube i32:$rB, i32:$rA))]>;
defm SUBFME : XOForm_3rc<31, 232, 0, (outs gprc:$rT), (ins gprc:$rA),
                         "subfme", "$rT, $rA", IIC_IntGeneral,
                         [(set i32:$rT, (sube -1, i32:$rA))]>;
defm SUBFZE : XOForm_3rc<31, 200, 0, (outs gprc:$rT), (ins gprc:$rA),
                         "subfze", "$rT, $rA", IIC_IntGeneral,
                         [(set i32:$rT, (sube 0, i32:$rA))]>;

```





multiclass中已有类型的变量，def InstAlias时，不需要再加类型，如bo，也不需要使用`$`

```c++

multiclass BranchSimpleMnemonicAT<string pm, int at> {
  def : InstAlias<"bc"#pm#" $bo, $bi, $dst", (gBCat u5imm:$bo, at, crbitrc:$bi,
                                                    condbrtarget:$dst)>;
  def : InstAlias<"bca"#pm#" $bo, $bi, $dst", (gBCAat u5imm:$bo, at, crbitrc:$bi,
                                                      condbrtarget:$dst)>;
  def : InstAlias<"bcl"#pm#" $bo, $bi, $dst", (gBCLat u5imm:$bo, at, crbitrc:$bi,
                                                      condbrtarget:$dst)>;
  def : InstAlias<"bcla"#pm#" $bo, $bi, $dst", (gBCLAat u5imm:$bo, at, crbitrc:$bi,
                                                        condbrtarget:$dst)>;
}
```

