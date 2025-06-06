<h1 align="center">alive</h1>
# Automatic LLVM's Instcombine Verifier

Alive is a tool that can prove the correctness of InstCombine optimizations specified in a high-level language. (Used in opt). It can automatically translated into C++ code.

You can verify your opt rule.



## Release

Online: https://rise4fun.com/Alive/

Offline Source code: https://github.com/nunoplopes/alive

Undefined Behavior slides: https://www.cs.utah.edu/~regehr/llvm-ub.pdf

Paper about alive: http://www.cs.utah.edu/~regehr/papers/pldi15.pdf

Latest Slides: https://llvm.org/devmtg/2019-10/slides/Lopes-Regehr-Alive2.pdf



## Online Example

- OK to remove UB(加限制)

- Must not add UB

- Poison propagates via instrucLon results

  

#### example1:

```asm
Name: InstCombine icmp optimization
%result = add i32 %a, %b

  =>
%result = add nsw i32 %a, %b
```

Result:

```asm
Optimization: InstCombine icmp optimization 
ERROR: Target is more poisonous than Source for i32 %result 
Example: 
%a i32 = 0x7FFFEFFF (2147479551) 
%b i32 = 0x7FFFFBFF (2147482623) 
Source value: 0xFFFFEBFE (4294962174, -5122) 
Target value: poison
```

确定值可以推导出未定义，即确定值是未定义值(任意值的子集)。但未定义不能推导出任意值。



#### Example2:

```asm
Name: Test
%result = add nsw i32 %a, %b

  =>
%result = add i32 %a, %b
```

Result:

```asm
about Alive - Optimization Verifier
Alive proves correctness of peephole optimizations.
```



Example3:

Right result:

```asm
Name: Test
%add = add nsw nuw i32 %a, %b    // add nsw i32 %a, %b
%cmp = icmp sgt i32 %add, %a
  =>
%cmp = icmp sgt i32 %b, 0
```

如果overflow，上面的cmp是UB，任意值都可以，下面的当然满足，如果没有Overflow，下面的也是对的，所以这个式子是对的。



Example4:

Error case:(poision propagate)

```asm
Name: Test
%add = add nuw i32 %a, %b   // add i32 %a, %b
%cmp = icmp sgt i32 %add, %a
  =>
%cmp = icmp sgt i32 %b, 0
```



Example5:

```asm
// right
%add = add nuw i8 %t12, 6
%t21 = i8 9
%cmp = icmp ugt i8 %add, %t21
  =>
%cmp = icmp ugt i8 %t12, 3

// right
%add = add nuw i8 %t12, -6
%t21 = i8 -3
%cmp = icmp ugt i8 %add, %t21
  =>
%cmp = icmp ugt i8 %t12, 3

// right
%add = add nuw i8 %t12, 6
%t21 = i8 9
%cmp = icmp ugt i8 %add, %t21
  =>
%cmp = icmp ugt i8 %t12, 3

cmpconst > addconst > 0 || 0 > cmpconst > addconst 


// error
%add = add nuw i8 %t12, -6
%t21 = i8 -9
%cmp = icmp ugt i8 %add, %t21
  =>
%cmp = icmp ugt i8 %t12, -3

// error
%add = add nuw i8 %t12, -6
%t21 = i8 9
%cmp = icmp ugt i8 %add, %t21
  =>
%cmp = icmp ugt i8 %t12, 15
```



Right

```asm
Name: Test
%add = add nuw i8 %a, -10
%cmp = icmp sgt i8 %add, 126
  =>
%cmp = icmp sgt i8 %a, 9



Name: Test
%add = add nuw i8 %a, -10
%cmp = icmp sgt i8 %add, 126
  =>
%cmp = false
```





`sgt`与`nsw`一致，`ugt`与`nuw`一致。