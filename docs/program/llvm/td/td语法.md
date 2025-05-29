https://llvm.org/docs/TableGen/LangIntro.html#file-scope-entities

https://llvm.org/docs/TableGen/LangRef.html#if

https://reviews.llvm.org/D71474    // **Introduce an if/then/else statement.**



def是用于定义concrete record，class用于定义abstruct record。



### 1. 常量

TD文件中所有的常量都必须是编译TD文件时确定的，所下下面的alias是不能实现的

```c++
sldi ra, rs,n  <====> rldicr ra, rs, n, 63 - n
因为n是在程序编译时才能确定的常量，而不是编译TD文件时确定的常量，这种情况可以在LLVM CPP文件中进行实现。
```



```c++
下面的定义是错的，不能有未知量，也就是说所有的都必须在td文件编译时确定，把以可以写文件，让常量满足什么要求。
def : InstAlias<!if(!eq(!add($m,3), 63),"sldi $rA, $rS, $n", "rldicl $rA, $rS, $m, $n"), (RLDICL g8rc:$rA, g8rc:$rS, u6imm:$m, u6imm:$n)>;


下面是正确的
def : InstAlias<!if(!eq(!add(2,3), 63),"sldi $rA, $rS, $n", "rldicl $rA, $rS, $m, $n"), (RLDICL g8rc:$rA, g8rc:$rS, u6imm:$m, u6imm:$n)>;

```



下面调用TrapExtendedMnemonic时用的是常量，所以也是正确的

```c++
multiclass TrapExtendedMnemonic<string name, int to> {
  def : InstAlias<"td"#name#"i $rA, $imm", (TDI to, g8rc:$rA, s16imm:$imm)>;
  def : InstAlias<"td"#name#" $rA, $rB", (TD to, g8rc:$rA, g8rc:$rB)>;
  def : InstAlias<"tw"#name#"i $rA, $imm", (TWI to, gprc:$rA, s16imm:$imm)>;
  def : InstAlias<"tw"#name#" $rA, $rB", (TW to, gprc:$rA, gprc:$rB)>;
}
defm : TrapExtendedMnemonic<"lt", 16>;
defm : TrapExtendedMnemonic<"le", 20>;
defm : TrapExtendedMnemonic<"eq", 4>;
defm : TrapExtendedMnemonic<"ge", 12>;
defm : TrapExtendedMnemonic<"gt", 8>;
defm : TrapExtendedMnemonic<"nl", 12>;
defm : TrapExtendedMnemonic<"ne", 24>;
defm : TrapExtendedMnemonic<"ng", 20>;
defm : TrapExtendedMnemonic<"llt", 2>;
defm : TrapExtendedMnemonic<"lle", 6>;
defm : TrapExtendedMnemonic<"lge", 5>;
defm : TrapExtendedMnemonic<"lgt", 1>;
defm : TrapExtendedMnemonic<"lnl", 5>;
defm : TrapExtendedMnemonic<"lng", 6>;
defm : TrapExtendedMnemonic<"u", 31>;
```





https://reviews.llvm.org/D71474

```shell
foreach i = 1-4 in {
  if !eq(i, 3) then {
    def "bThree" # i;
  } else {
    def "bNotThree" # i;
  }
}

// Test inside a multiclass, with condition based on a multiclass parameter.

multiclass Multi<int i> {
  def Unconditional;

  if !eq(i, 2) then
    def Cond;

  if !ge(i, 3) then
    def ThenRec;
  else
    def ElseRec;
}
```

