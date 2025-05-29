







### 1. LLVM IR官方手册

https://llvm.org/docs/LangRef.html



### 2. 简单的例子



### 2.1 简单运算

```c++
int foo(int a, int b, int c) {
  return a + b * c;
}
```



看起来像是伪汇编，下面的LLVM IR是比较好理解的和机器无关的。比如`store`在不同的架构上，最终后端会生成与机器相关的指令。



#### 不做优化，用用` clang -S -emit-llvm test.c`编译之后，可以得到以下的LLVM IR。

```python
; ModuleID = 'test.c'
source_filename = "test.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; Function Attrs: noinline nounwind optnone uwtable
define dso_local i32 @foo(i32 %a, i32 %b, i32 %c) #0 {
entry:
  %a.addr = alloca i32, align 4
  %b.addr = alloca i32, align 4
  %c.addr = alloca i32, align 4
  store i32 %a, i32* %a.addr, align 4
  store i32 %b, i32* %b.addr, align 4
  store i32 %c, i32* %c.addr, align 4
  %0 = load i32, i32* %a.addr, align 4
  %1 = load i32, i32* %b.addr, align 4
  %2 = load i32, i32* %c.addr, align 4
  %mul = mul nsw i32 %1, %2
  %add = add nsw i32 %0, %mul
  ret i32 %add
}
```



#### `O2`优化，用用` clang -S -emit-llvm -O2 test.c`编译之后，可以得到以下的LLVM IR。

```python
; ModuleID = 'add.c'
source_filename = "add.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; Function Attrs: norecurse nounwind readnone uwtable
define dso_local i32 @foo(i32 %a, i32 %b, i32 %c) local_unnamed_addr #0 {
entry:
  %mul = mul nsw i32 %c, %b
  %add = add nsw i32 %mul, %a
  ret i32 %add
}

attributes #0 = { norecurse nounwind readnone uwtable "disable-tail-calls"="false" "frame-pointer"="none" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" "unsafe-fp-math"="false" "use-soft-float"="false" }

```





### 2.2 比较



```c++
int foo(int a, int b) {
  if (a > b)
    return a;
  else
    return b ;
}
```





```python
; ModuleID = 'test.c'
source_filename = "test.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; Function Attrs: noinline nounwind optnone uwtable
define dso_local i32 @foo(i32 %a, i32 %b) #0 {
entry:
  %retval = alloca i32, align 4
  %a.addr = alloca i32, align 4
  %b.addr = alloca i32, align 4
  store i32 %a, i32* %a.addr, align 4
  store i32 %b, i32* %b.addr, align 4
  %0 = load i32, i32* %a.addr, align 4
  %1 = load i32, i32* %b.addr, align 4
  %cmp = icmp sgt i32 %0, %1
  br i1 %cmp, label %if.then, label %if.else

if.then:                                          ; preds = %entry
  %2 = load i32, i32* %a.addr, align 4
  store i32 %2, i32* %retval, align 4
  br label %return

if.else:                                          ; preds = %entry
  %3 = load i32, i32* %b.addr, align 4
  store i32 %3, i32* %retval, align 4
  br label %return

return:                                           ; preds = %if.else, %if.then
  %4 = load i32, i32* %retval, align 4
  ret i32 %4
}

attributes #0 = { noinline nounwind optnone uwtable "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" "unsafe-fp-math"="false" "use-soft-float"="false" }

```



```python
; ModuleID = 'test.c'
source_filename = "test.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; Function Attrs: norecurse nounwind readnone uwtable
define dso_local i32 @foo(i32 %a, i32 %b) local_unnamed_addr #0 {
entry:
  %cmp = icmp sgt i32 %a, %b
  %retval.0 = select i1 %cmp, i32 %a, i32 %b
  ret i32 %retval.0
}

attributes #0 = { norecurse nounwind readnone uwtable "disable-tail-calls"="false" "frame-pointer"="none" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" "unsafe-fp-math"="false" "use-soft-float"="false" }
```





### 3. 特点

1. LLVM IR是SSA的，使用的是无限的虚拟寄存器，这些寄存器会在后端的指令选择阶段选择成真正的有限的寄存器。为了使LLVM IR是SSA的，引入了PHI指令。

```c++
   int test(int r, int y) {
       int l = y || r;
       return l;
   }
   
```

   上述代码不加优化，可以得到以下带有phi的LLVM IR。

```python
   ; ModuleID = 'test.c'
   source_filename = "test.c"
   target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
   target triple = "x86_64-unknown-linux-gnu"
   
   ; Function Attrs: noinline nounwind optnone uwtable
   define dso_local i32 @test(i32 %r, i32 %y) #0 {
   entry:
     %r.addr = alloca i32, align 4
     %y.addr = alloca i32, align 4
     %l = alloca i32, align 4
     store i32 %r, i32* %r.addr, align 4
     store i32 %y, i32* %y.addr, align 4
     %0 = load i32, i32* %y.addr, align 4
     %tobool = icmp ne i32 %0, 0
     br i1 %tobool, label %lor.end, label %lor.rhs
   
   lor.rhs:                                          ; preds = %entry
     %1 = load i32, i32* %r.addr, align 4
     %tobool1 = icmp ne i32 %1, 0
     br label %lor.end
   
   lor.end:                                          ; preds = %lor.rhs, %entry
     %2 = phi i1 [ true, %entry ], [ %tobool1, %lor.rhs ]
     %lor.ext = zext i1 %2 to i32
     store i32 %lor.ext, i32* %l, align 4
     %3 = load i32, i32* %l, align 4
     ret i32 %3
   }
   
   attributes #0 = { noinline nounwind optnone uwtable "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" "unsafe-fp-math"="false" "use-soft-float"="false" }
   
```

   

2. 官方已经提供了各种LLVM IR，如果还不能满足需求，可以自定义LLVM IR，如从C前面暴露一条底层的汇编指令。

3. 一条LLVM IR最多只有一个result。

4. 可以利用`br`分支指令（有条件无条件均可）进行跳转实现循环等。

```c++
   int test(int n) {
       int ret = 0;
       while (n) {
         n--;
         ret += n;
       }
       return ret;
   }
```

   

   上述代码不加优化可以得到以下LLVM IR。

```python
   ; ModuleID = 'test.c'
   source_filename = "test.c"
   target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:1                                                                          6:32:64-S128"
   target triple = "x86_64-unknown-linux-gnu"
   
   ; Function Attrs: noinline nounwind optnone uwtable
   define dso_local i32 @test(i32 %n) #0 {
   entry:
     %n.addr = alloca i32, align 4
     %ret = alloca i32, align 4
     store i32 %n, i32* %n.addr, align 4
     store i32 0, i32* %ret, align 4
     br label %while.cond
   
   while.cond:                                       ; preds = %while.body, %entry
     %0 = load i32, i32* %n.addr, align 4
     %tobool = icmp ne i32 %0, 0
     br i1 %tobool, label %while.body, label %while.end
   
   while.body:                                       ; preds = %while.cond
     %1 = load i32, i32* %n.addr, align 4
     %dec = add nsw i32 %1, -1
     store i32 %dec, i32* %n.addr, align 4
     %2 = load i32, i32* %n.addr, align 4
     %3 = load i32, i32* %ret, align 4
     %add = add nsw i32 %3, %2
     store i32 %add, i32* %ret, align 4
     br label %while.cond
   
   while.end:                                        ; preds = %while.cond
     %4 = load i32, i32* %ret, align 4
     ret i32 %4
   }
   
   attributes #0 = { noinline nounwind optnone uwtable "disable-tail-calls"="false                                                                          " "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="                                                                          0" "no-infs-fp-math"="false" "no-jump- tables"="false" "no-nans-fp-math"="false"                                                                           "no-signed-zeros-fp-math"="false" "no-trapping-math"="true" "stack-protector-b                                                                          uffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+                                                                          sse2,+x87" "tune-cpu"="generic" "unsafe-fp-math"="false" "use-soft-float"="fals                                                                          e" }
   
   !llvm.module.flags = !{!0}
   !llvm.ident = !{!1}
   
   !0 = !{i32 1, !"wchar_size", i32 4}
   !1 = !{!"clang version 12.0.0 (https://github.com/llvm/llvm-project.git 154860a    
```

   
