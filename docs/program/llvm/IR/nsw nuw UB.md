<h1 align="center">nsw nuw UB</h1>


## Alive Tool Release

Online: https://rise4fun.com/Alive/

Offline Source code: https://github.com/nunoplopes/alive

Paper about alive: http://www.cs.utah.edu/~regehr/papers/pldi15.pdf



Undefined Behavior slides(Useful & Important): https://www.cs.utah.edu/~regehr/llvm-ub.pdf

http://blog.llvm.org/2011/05/what-every-c-programmer-should-know.html



# ADD NSW NUW

```asm
<result> = add <ty> <op1>, <op2>          ; yields ty:result
<result> = add nuw <ty> <op1>, <op2>      ; yields ty:result
<result> = add nsw <ty> <op1>, <op2>      ; yields ty:result
<result> = add nuw nsw <ty> <op1>, <op2>  ; yields ty:result
```



- nuw: No Unsigned Wrap

- nsw: No Signed Wrap

  ```asm
  ; https://stackoverflow.com/questions/34190997/the-poison-value-and-undefined-value-in-llvm
  %add = add nsw i32 %x, 1
  
  ; equal to below:
  if (%x+1) overflows then 
    %add = undef 
  else 
    %add = add i32 %x,1
  ```

  

If the `nuw` and/or `nsw` keywords are present, the result value of the add is a poison value if unsigned and/or signed overflow.

如果有`nuw`或`nsw`，则相应的Overflow是未定义的，也就是任意值。

An instruction that depends on a poison value, produces a poison value itself. A poison value may be relaxed into an undef value, which takes an arbitrary bit-pattern.

`UB`会传播，任何使用了`UB`作为操作数，得到的结果都是未定义的。



# Poison 

- Ephemeral effect of math instructions that violate

  1. `nsw`: no signed wrap for add, sub, mul, shl

  2. `nuw`:  no unsigned wrap for add, sub, mul, shl
  3. `exact`: no remainder for sdiv, udiv, lshr, ashr

- Designed to support speculaLve execuLon of operations that might overflow

- Poison propagates via instrucLon results

- If poison reaches a side-effecting instruction, the result is `true UB`

  

# True undefined behavior

#### True undefined behavior

- Triggered by
  1. Divide by zero
  2. Illegal memory accesses



- Anything can happen as a result

  Typically results in corrupted execuLon or a processor exception



# 性质

- OK to remove UB(加限制)

- Must not add UB

- Poison propagates via instrucLon results




# Example

`sgt`与`nsw`一致，`ugt`与`nuw`一致。

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

```shell
about Alive - Optimization Verifier
Alive proves correctness of peephole optimizations.
```



#### Example3:

Right result:

```asm
Name: Test
%add = add nsw nuw i32 %a, %b    // add nsw i32 %a, %b
%cmp = icmp sgt i32 %add, %a
  =>
%cmp = icmp sgt i32 %b, 0
```

如果overflow，上面的cmp是UB，任意值都可以，下面的当然满足，如果没有Overflow，下面的也是对的，所以这个式子是对的。



#### Example4:

Error case:(poision propagate)

```asm
Name: Test
%add = add nuw i32 %a, %b   // add i32 %a, %b
%cmp = icmp sgt i32 %add, %a
  =>
%cmp = icmp sgt i32 %b, 0
```



#### Example5:

Error case

```asm
%add = add i32 %a, -1
%cmp = icmp ult i32 %add, %a
  =>
%cmp = true
```



#### Example6:

Right case

```true
Name: Test
%add = add nuw i32 %a, -1
%cmp = icmp ult i32 %add, %a
  =>
%cmp = false  // 0
```



#### Example7:

```asm
Name: Test
%add = add nsw i32 %a, -1
%cmp = icmp slt i32 %add, %a
  =>
%cmp = true   // -1/1


Name: PR20186
%add = add nsw i32 %a, -1
%cmp = icmp sgt i32 %add, %a
  =>
%cmp = 0


Name: PR20186
%add = add nsw i32 %a, 0
%cmp = icmp slt i32 %add, %a
  =>
%cmp = false


%add1 = add nuw i32 %t12, %t13
%add2 = add nuw %t22, %t13
%cmp = icmp ugt i32 %add1, %add2
  =>
%cmp = icmp ugt i32 %t12, %t22
```



```asm
%add = add nuw i32 %a, -1
%cmp = icmp ult i32 %add, %b
  =>
%cmp = icmp ugt i32 %a, %b
%add = add nuw i32 %a, -1
```





```asm
%add = add nuw i32 %a, -1
%cmp = icmp ult i32 %add, %b
  =>
%cmp = false
%add = add nuw i32 %a, -1
```

```
; sign right, unsigned error
Below is error case
%add = add nuw i32 %a, -1
%cmp = icmp ult i32 %add, %b
  =>
%cmp = icmp ule i32 %a , %b

```





More case can be tested on the `alive`.



# posion -> UB

Posion value是为了跟踪状态，看不否能最终角发UB。

An instruction that *depends* on a poison value, produces a poison value itself. A poison value may be relaxed into an [undef value](https://llvm.org/docs/LangRef.html#undefvalues), which takes an arbitrary bit-pattern.

This means that immediate undefined behavior occurs if a poison value is used as an instruction operand that has any values that trigger undefined behavior. Notably this includes (but is not limited to):

- The pointer operand of a [load](https://llvm.org/docs/LangRef.html#i-load), [store](https://llvm.org/docs/LangRef.html#i-store) or any other pointer dereferencing instruction (independent of address space).
- The divisor operand of a `udiv`, `sdiv`, `urem` or `srem` instruction.

load/store/udiv/sdiv/urem/srem如果用到了posion的话，会得到UB。注意目前是这6条，不保证以后不会添加。此处需要找到相关的代码。



如果一个add/sub的结果被多次使用之后会触发UB的话，则该add/sub需要加上nsw/nuw。



```asm
  %poison = sub nuw i32 0, 1           ; Results in a poison value.
  %still_poison = and i32 %poison, 0   ; 0, but also poison.
  %poison_yet_again = getelementptr i32, i32* @h, i32 %still_poison
  store i32 0, i32* %poison_yet_again  ; Undefined behavior due to
                                       ; store to poison.

  store i32 %poison, i32* @g           ; Poison value stored to memory.
  %poison2 = load i32, i32* @g         ; Poison value loaded back from memory.

  %narrowaddr = bitcast i32* @g to i16*
  %wideaddr = bitcast i32* @g to i64*
  %poison3 = load i16, i16* %narrowaddr ; Returns a poison value.
  %poison4 = load i64, i64* %wideaddr  ; Returns a poison value.

  %cmp = icmp slt i32 %poison, 0       ; Returns a poison value.
  br i1 %cmp, label %true, label %end  ; Branch to either destination.

true:
  store volatile i32 0, i32* @g        ; This is control-dependent on %cmp, so
                                       ; it has undefined behavior.
  br label %end

end:
  %p = phi i32 [ 0, %entry ], [ 1, %true ]
                                       ; Both edges into this PHI are
                                       ; control-dependent on %cmp, so this
                                       ; always results in a poison value.

  store volatile i32 0, i32* @g        ; This would depend on the store in %true
                                       ; if %cmp is true, or the store in %entry
                                       ; otherwise, so this is undefined behavior.

  br i1 %cmp, label %second_true, label %second_end
                                       ; The same branch again, but this time the
                                       ; true block doesn't have side effects.

second_true:
  ; No side effects!
  ret void

second_end:
  store volatile i32 0, i32* @g        ; This time, the instruction always depends
                                       ; on the store in %end. Also, it is
                                       ; control-equivalent to %end, so this is
                                       ; well-defined (ignoring earlier undefined
                                       ; behavior in this example).
```





Poinson如果能触发undefine的话，溢出可以任意值，否则不行。

注意下面这个case是对的。

```asm
%result = add nsw i8 100, 100
  =>
%result = i8 100
```