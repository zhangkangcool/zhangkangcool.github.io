# æ²¡æ clangdæä¹å

### 如果没有 clangd，应该怎么办？

有 4 种方案，按推荐顺序：

**方案 A：安装系统 clangd（最简单）**

```bash
sudo apt install clangd
```

然后在 `.vscode/settings.json` 中删除 `clangd.path` 行，或设置为 `"clangd.path": "clangd"`，让扩展从 PATH 查找。

**方案 B：使用 VSCode C/C++ 扩展（ms-vscode.cpptools）**

- 这是我之前配置中禁用的扩展，它有**自己的 IntelliSense 引擎**，不依赖 clangd

- 安装扩展后，在 `settings.json` 中配置：

  ```json
  "C_Cpp.intelliSenseEngine": "default",
  "C_Cpp.default.compileCommands": "${workspaceFolder}/build/compile_commands.json"
  ```

- 缺点：对 MLIR/TableGen 等自定义语法的支持不如 clangd，内存占用通常更高

**方案 C：下载 LLVM 官方预编译包**

```bash
# 下载 LLVM 15 预编译版（含 clangd）
wget https://github.com/llvm/llvm-project/releases/download/llvmorg-15.0.7/clang+llvm-15.0.7-x86_64-linux-gnu-ubuntu-18.04.tar.xz
tar xf clang+llvm-15.0.7-*.tar.xz
# 然后设置 clangd.path 指向解压后的 bin/clangd
```

**方案 D：自己编译 LLVM（带 X86 target）**

```bash
cmake -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra" \
      -DLLVM_TARGETS_TO_BUILD=X86 \
      -DCMAKE_BUILD_TYPE=Release \
      ../llvm
make clangd -j$(nproc)
```

---

### 总结

| 问题                         | 答案                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| LLVM 21 为何不能用           | 只编译了 RISC-V target，默认 triple 为空，Clang 前端无法确定目标平台 |
| 必须编译本机架构吗           | 是，做语法分析也需要 target triple 来确定类型/ABI/宏         |
| gcc 编译的项目能用 clangd 吗 | 能，clangd 只读取编译参数，不关心实际编译器品牌              |
| 没有 clangd 怎么办           | `apt install clangd` 或用 cpptools 扩展，或下载预编译包      |

你当前用 LLVM 15 的 clangd 已经是最佳方案，无需改动。