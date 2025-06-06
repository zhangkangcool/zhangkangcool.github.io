<h1 align="center">clang输出所经过的pass</h1>














## LLVM9

要在Clang的编译过程中输出详细的Pass信息，你可以通过启用-debug-pass选项来打印经过的Pass。这些Pass信息是Clang/LLVM在处理源代码时执行的各个优化和分析阶段的详细日志。

以下是如何通过命令行来启用Pass调试信息：

输出Pass信息的命令

clang -Xclang -debug-pass=Details -S -emit-llvm source.c -o output.ll

说明：
• -Xclang: 允许向Clang传递额外的Clang-specific选项。
• -debug-pass=Details: 启用Pass的详细日志输出，会打印出每个执行的Pass及其信息。
• -S: 生成汇编代码（在此上下文中实际上是LLVM IR），而不是机器代码。
• -emit-llvm: 指定输出为LLVM中间表示（.ll文件）。
• source.c: 输入的C源文件。
• -o output.ll: 输出LLVM IR的文件。

示例输出

执行上述命令后，你将能够在终端中看到类似如下的日志，显示每个Pass的执行：

Running pass 'SimplifyCFG' on function '@main'
Running pass 'Dead Code Elimination' on function '@main'
Running pass 'Constant Folding' on function '@main'
...

这些输出信息将帮助你跟踪Clang编译过程中所有执行的Pass步骤及其顺序。





## llvm 10

在较新的 LLVM 版本（LLVM 10+）中，-debug-pass=Details 选项已被废弃。你可以使用 -mllvm -passes= 选项来输出 Clang 经过的 Pass 过程。以下是几种方法来打印 Pass 信息：

方法 1：使用 -mllvm -debug-pass-manager(在LLVM11中被删除了)

这个选项可以打印 Pass 管理器运行的所有 Pass：

clang -S -emit-llvm -Xclang -disable-O0-optnone -mllvm -debug-pass-manager source.c -o output.ll

说明：
	•	-Xclang -disable-O0-optnone：防止 Clang 在 -O0 级别下禁用优化 Pass。
	•	-mllvm -debug-pass-manager：启用新 Pass 管理器的调试信息，打印出 Clang 运行的所有 Pass。

示例输出：

Running pass: SimplifyCFG
Running pass: SROA
Running pass: EarlyCSE
...

方法 2：显示所有 Pass（LLVM 旧版 & 现代 LLVM）

如果你想要手动控制哪些 Pass 运行，可以使用 -mllvm -print-after-all（旧版）或 -mllvm -passes= 选项（现代 LLVM）。

旧版 LLVM（LLVM 10 及之前）

clang -S -emit-llvm -mllvm -print-after-all source.c -o output.ll 2>&1 | tee passes.log

说明：
	•	-mllvm -print-after-all：在每个 Pass 运行后打印 IR。
	•	2>&1 | tee passes.log：将所有 Pass 输出重定向到 passes.log，方便后续分析。

新版 LLVM（LLVM 11+，推荐方式）

clang -S -emit-llvm -mllvm -passes='default<O2>' source.c -o output.ll

说明：
	•	-mllvm -passes='default<O2>'：使用 LLVM 的默认 -O2 级别优化，并打印 Pass 运行信息。

方法 3：使用 opt 工具查看 Pass

如果你已经有一个 .ll 文件，可以使用 LLVM 的 opt 工具来运行 Pass 并查看详细信息：

opt -passes='default<O2>' -debug-pass-manager -S input.ll -o optimized.ll

或者，如果你想要打印所有 Pass 运行后 IR 的变化：

opt -passes='default<O2>' -print-after-all -S input.ll -o optimized.ll

总结

方法	适用情况	选项
方法 1	现代 LLVM（LLVM 10+）	-mllvm -debug-pass-manager
方法 2（旧版）	旧版 LLVM（LLVM 10 及之前）	-mllvm -print-after-all
方法 2（新版）	LLVM 11+	-mllvm -passes='default<O2>'
方法 3	针对 .ll 文件分析	opt -passes='default<O2>' -debug-pass-manager

如果你使用的 LLVM 版本较新，建议方法 1 或 2（新版）。如果仍然遇到问题，可以先运行 clang --version 检查你的 LLVM 版本，然后再调整参数。



```asm
clang -S -emit-llvm wmemcmp.c  -mllvm -print-after-all -o wmemcmp.s  -O3 > test3.log 2>&1
```

