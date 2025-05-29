## C*Core

```c++
def LDW : Mari4<0x8, (outs GR32:$Rz), (ins MEMri:$addr),
 "ldw\t$Rz, ($addr)", [(set GR32:$Rz, (load ADDRri:$addr))]>;
```



```c++
def MEMri : Operand<i32> {
 let PrintMethod = "printMemOperand";
 let MIOperandInfo = (ops GR32, i32imm);
}
```

