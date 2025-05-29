https://www.zhihu.com/question/24992774/answer/29740949?utm_campaign=rss&utm_medium=rss&utm_source=rss&utm_content=title

作者：RednaxelaFX
链接：https://www.zhihu.com/question/24992774/answer/29740949
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

由于目标指令集多半不支持“Phi”的概念，编译器里通常会有一个pass是“resolution”，把Phi node给resolve为move（也叫copy insertion），经过了resolution之后再生成具体的目标代码。经过Phi resolution的IR就退出了SSA形式，所以这个动作也叫做SSA destruction，缩写de-SSA。在编译器的源码里看到名如“PhiResolver”之类的东西那就是这玩儿了。举例来说，如果在一个基本块B2的开头有：
```
x2 = phi(x0, x1)
```
那么最简单的resolution做法就是：假如x0在基本块B0定义，x1在基本块B1定义，并且假如x0分配到了R1，x1分配到了R2，x2分配到了R3，那么在B0的末尾会生成：
```
move R3 <- R1
```
而在B1末尾则会生成：
```
move R3 <- R2
```
这样后面R3就得到正确的x2的值了。当然举的这个例子所生成的代码比较浪费寄存器。实际上如果Phi resolution在寄存器分配之前做，那么寄存器分配器通常会想办法把Phi引发的move给coalesce到同一个寄存器，这样可能x0和x1都会被设法分配到R2上，就不需要那个额外的move来实现Phi的语义了。这种resolution可以发生在寄存器分配之前，也可以发生在寄存器分配之后。现在比较常见的是先做了resolution再做寄存器分配，这样的话寄存器分配就不是在SSA形式上进行的；但是因为SSA形式上的干涉图是cordal graph，在它上面做寄存器分配也可以很方便，所以现在也有一些编译器选择在寄存器分配之后才做Phi resolution。

作者：蓝色
链接：https://www.zhihu.com/question/24992774/answer/29746701
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


先顺便补充一些背景材料。对于Phi，或者更确切的符号Φ，其主要解决的是SSA（Static Single Assignment）赋值一次的问题，如下面的例子：
```
a = 1;
if (v < 10)
    a = 2;
b = a;
```

由于静态单赋值只能让变量赋值一次，那么这里的b 到底取2 还是1 呢？这是无法决定的，而Phi 则是解决这样的问题。
```
a1 = 1;
if (v < 10)
    a2 = 2;
    
b = PHI(a1, a2);
```
那么Phi则会根据到达的是a1还是a2而选择给b赋何值。See:Static single assignment form而RFX提到的Resolution思路也是解决Phil的通用做法，其实也也非常容易举例验证，然后进行观察。
```
int main()
{
    int a = 47;
    int b = 0;
    if (a > 47)
    {
	a = 47;
    }
    else
    {
	a = 1;
    }
    b = a + 13;
    b = b + 1;
    return 0;
}
```
这是一个非常简单的例子，几乎就是上面的伪代码的翻版，我们把这个例子产生LLVM IR进行观察。
```shell
define i32 @main() #0 {
entry:
  %retval = alloca i32, align 4
  %a = alloca i32, align 4
  %b = alloca i32, align 4
  store i32 0, i32* %retval
  store i32 47, i32* %a, align 4
  store i32 0, i32* %b, align 4
  %0 = load i32* %a, align 4
  %cmp = icmp sgt i32 %0, 47
  br i1 %cmp, label %if.then, label %if.else

if.then:                                          ; preds = %entry
  store i32 47, i32* %a, align 4
  br label %if.end

if.else:                                          ; preds = %entry
  store i32 1, i32* %a, align 4
  br label %if.end

if.end:                                           ; preds = %if.else, %if.then
  %1 = load i32* %a, align 4
  %add = add nsw i32 %1, 13
  store i32 %add, i32* %b, align 4
  %2 = load i32* %b, align 4
  %add1 = add nsw i32 %2, 1
  store i32 %add1, i32* %b, align 4
  ret i32 0
}
```
而这里就能看出一些端倪了，其实在判定的时候是有一个%cmp，以及载入%a给了一个临时的%0，而最后给%b的是经过Resolution后的a，而这里要看出来到底用了哪些寄存器，需要观察汇编。
```
_main:
    pushl    %ebp
    movl    %esp, %ebp
    subl    $12, %esp
    calll    ___main
    movl    $0, -4(%ebp)
    movl    $47, -8(%ebp)   # a
    movl    $0, -12(%ebp)   # b
    cmpl    $47, -8(%ebp)   # a compare 47
    jle    LBB0_2              # a < 47
    movl    $47, -8(%ebp)   # then branch: a = 47 
    jmp    LBB0_3              # a >= 47
LBB0_2:
    movl    $1, -8(%ebp)    # a = 1
LBB0_3:
    movl    $0, %eax
    movl    -8(%ebp), %ecx  # a -> % ecx
    addl    $13, %ecx       # %ecx + 13. i.e. a + 13
    movl    %ecx, -12(%ebp) # %ecx -> b
    movl    -12(%ebp), %ecx # b -> %ecx
    addl    $1, %ecx        # %ecx + 1.  i.e. b + 1
    movl    %ecx, -12(%ebp)
    addl    $12, %esp
    popl    %ebp
    ret
```
这里可以阐述RFX所说的寄存器分配办法，以及经过Resolution后，退出舞台后的Phil，从而转变为了具体move的汇编代码是如何。