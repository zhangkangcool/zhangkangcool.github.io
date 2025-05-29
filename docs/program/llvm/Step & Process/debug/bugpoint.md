# LLVM bugpoint tool: design and usage

https://llvm.org/docs/Bugpoint.html

[https://github.ibm.com/cdl-compiler/llvm/wiki/Bugpoint-%E7%AE%80%E5%8D%95%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97](https://github.ibm.com/cdl-compiler/llvm/wiki/Bugpoint-简单使用指南)

[https://books.google.ca/books?id=WqS_CQAAQBAJ&pg=PA259&lpg=PA259&dq=llvm+bugpoint+narrow+the+case&source=bl&ots=QKh5JpMUav&sig=ACfU3U3CzWwQS5TupJOjytQ546xzPzCp6A&hl=zh-CN&sa=X&ved=2ahUKEwj7jv2VhsDpAhXMj3IEHRlqCBgQ6AEwB3oECAkQAQ#v=onepage&q=llvm%20bugpoint%20narrow%20the%20case&f=false](https://books.google.ca/books?id=WqS_CQAAQBAJ&pg=PA259&lpg=PA259&dq=llvm+bugpoint+narrow+the+case&source=bl&ots=QKh5JpMUav&sig=ACfU3U3CzWwQS5TupJOjytQ546xzPzCp6A&hl=zh-CN&sa=X&ved=2ahUKEwj7jv2VhsDpAhXMj3IEHRlqCBgQ6AEwB3oECAkQAQ#v=onepage&q=llvm bugpoint narrow the case&f=false)





在分析benchmark codegen的时候，常常需要一个小一点的IR来产生想要的pattern，`bugpoint`提供了`--compile-custom`功能可以完成这个任务[1]。

使用一个例子来说明`bugpoint`的这一用法。

最近的wyvern对leela_r产生了这样的pattern
```asm
150: li r6, 0
     mr r3, r6
     blr
```
这里有个明显的redundant copy。`perf`是了解这段代码所在的函数的，所以我们也知道源代码文件。通过spec的编译log，我们也知道编译命令，从而我们可以得到相应的`FastBoard.ll`。



### 1 用`llvm-extract`把目标函数抽取出来成为一个独立的IR文件

为了加快`bugpoint`的reduce速度，我们可以先用`llvm-extract`把目标函数抽取出来成为一个独立的IR文件。

```shell

llvm-extract -S --func=<target_func_name> FastBoard.ll -o output.ll
llvm-extract -S --func=_ZN3pov12Ray_In_BoundEPNS_10Ray_StructEPNS_13Object_StructE objects.ll -o objects.narrow.ll
```

### 2 写感兴趣的CHECK脚本

接下来是编写`check`脚本。`check`脚本会被`bugpoint`调用，输入为`bugpoint`提供的LLVM IR文件，通过返回码向`bugpoint`反馈信息[2]。

> The command should exit with a failure exit code if the file is "interesting" and should exit with a success exit code (i.e. 0) otherwise (this is the same as if it crashed on "interesting" inputs).

```bash
#!/bin/bash
# check
! $(llc < "$@" | FileCheck <file-contains-check-directives>)
```
对于这个例子，在`output.ll`中加上
```
; CHECK: li [[RA:r[0-9]+]], 0                                                                                                                                                                 
; CHECK-NEXT: mr r3, [[RA]]                                                                                                                                                                   
; CHECK-NEXT: blr 
```
`check.sh`脚本为

`cat check.sh` 

```bash
#!/bin/bash
! $(llc < "$@" | FileCheck output.ll)
```



或者

```
#!/bin/bash
! $(llc < "$@" | FileCheck "$@")
```



可以先试下`llc < output.ll | FileCheck output.ll`能否通过，即能否得到自己想到的Pattern。

### 3 调用bugpoint narrow down case

最后调用`bugpoint`

```shell
bugpoint --compile-custom --compile-command=./check.sh output.ll
```



### 4 得到simplify.bc

bugpoint执行完后，你将得到下述文件

```shell
bugpoint-reduced-blocks.bc        bugpoint-reduced-simplified.bc   bugpoint.reference.out-358a0f0
bugpoint-reduced-conditionals.bc  bugpoint-reduced-simplified.s    check.sh
bugpoint-reduced-instructions.bc  bugpoint-reduced-simplifycfg.bc  output.ll
bugpoint-reduced-named-md.bc      bugpoint.reference.out-22be82e   output.s
```



得到所需要的ll文件

```shell
llvm-dis bugpoint-reduced-simplified.bc -o bugpoint-reduced-simplified.ll
```



利用check.sh中的命令行来检验是否得到了所需要的ll文件。





[1]: http://blog.llvm.org/2015/11/reduce-your-testcases-with-bugpoint-and.html
[2]: https://llvm.org/docs/CommandGuide/bugpoint.html



# Example

从`~/llvm/llvm/test/CodeGen/PowerPC/bdzlr.ll`中提取能用于测试`ppc-early-ret`pass的从`BCC->BCCLR`的小case。

- 修改bdnzlr.ll

bdzlr.ll的最后加上`CHECK: BCCLR`



- 得到`before-early-ret.mir`,简单是否有所需要的BCCLR

```shell
llc -verify-machineinstrs  bdzlr.ll -mtriple=powerpc64-unknown-linux-gnu -mcpu=pwr7 -mattr=-crbits -stop-after=ppc-early-ret -o before-early-ret.mir
```



- cat check.sh

```shell
#!/bin/bash
! $(llc -verify-machineinstrs -mtriple=powerpc64-unknown-linux-gnu -mcpu=pwr7 -mattr=-crbits -stop-after=ppc-early-ret < "$@" | FileCheck "$@")
```



- 调用bugpoint

```shell
bugpoint --compile-custom --compile-command=./check.sh bdzlr.ll
```



- get the simplified ll 

```c++
llvm-dis bugpoint-reduced-simplified.bc -o bugpoint-reduced-simplified.ll
```

