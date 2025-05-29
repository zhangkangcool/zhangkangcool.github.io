

```

```





在 Clang 17 版本中，`-debug-pass-manager` 选项在llvm11中被移除，因此你无法使用它来输出 Pass 信息。不过，Clang 仍然支持通过其他方式输出 Pass 信息。为了调试和查看经过的优化 Pass，你可以使用以下方法：

### **方法 1：使用 `-Xclang -debug-pass=Structure`**(llvm17中已经被删除)

Clang 17 不支持通过 `-Xclang -debug-pass=Structure` 来输出 Pass 信息。你可以使用以下命令：

```bash
clang -S -emit-llvm -Xclang -debug-pass=Structure source.c -o output.ll
```

#### 解释：

- `-Xclang`: 允许传递特定给 Clang 的额外选项。

- `-debug-pass=Structure`: 输出 Pass 结构信息，包括每个 Pass 的名称和它所做的工作。

- `-S`: 生成 `.ll` 文件。

- `-emit-llvm`: 指定输出为 LLVM IR（`.ll`）。

  

### **方法 2：使用 `-mllvm -print-after-all`**

如果你想要查看所有 Pass 后的 IR 变化，可以使用 `-mllvm -print-after-all`，它会在每个 Pass 执行后打印出 LLVM IR 的中间状态：

```bash
clang -S -emit-llvm -mllvm -print-after-all source.c -o output.ll
```

#### 解释：

- `-mllvm -print-after-all`: 该选项会在每个 Pass 后输出 LLVM IR，以便查看优化和转换后的结果。

  

### **方法 3：使用 `opt` 命令查看 Pass**

如果你已经有了 `.ll` 文件，可以使用 `opt` 命令来查看 Pass 信息并输出 IR：

```bash
opt -passes=default<O2> -debug-pass-manager -S input.ll -o optimized.ll
```

#### 解释：

- `-passes=default<O2>`: 选择进行标准的 O2 优化。
- `-debug-pass-manager`: 显示 Pass 管理器的调试信息，帮助查看 Pass 执行的顺序。
- `-S`: 生成 `.ll` 输出文件。

------

### 