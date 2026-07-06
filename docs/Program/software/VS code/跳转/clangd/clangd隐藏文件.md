# clangdéèæä»¶

## `.clangd` 文件的作用与必要性

### 什么是 `.clangd` 文件

`.clangd` 是 clangd 语言服务器的**项目级配置文件**（YAML 格式），类似于 `.editorconfig` 或 `.eslintrc`。它由 clangd 自己读取，独立于任何编辑器——无论你用 VSCode、Vim、Emacs，只要装了 clangd，它都会读取这个文件。

### 为什么需要它（与 `.vscode/settings.json` 的分工）

两个文件管辖的领域完全不同：

```
┌─────────────────────────────────────────────────────────────────┐
│  .vscode/settings.json        │  .clangd                        │
│  ────────────────────────     │  ─────────────────────────       │
│  VSCode 编辑器层面            │  clangd 语言服务层面             │
│                               │                                 │
│  • clangd 二进制路径           │  • 编译参数增删（Add/Remove）    │
│  • 禁用 cpptools 冲突          │  • compile_commands.json 路径   │
│  • 文件关联 (.td/.mlir/.ll)   │  • 后台索引开关                 │
│  • 搜索排除目录               │  • clang-tidy 检查规则           │
│  • 扩展行为控制               │  • InlayHints（参数名/类型提示）│
│                               │  • 诊断抑制规则                 │
└─────────────────────────────────────────────────────────────────┘
```

**简单说：`settings.json` 管"用哪个 clangd"，`.clangd` 管"clangd 怎么干活"。**

### 对本项目的具体作用

#### 1. 移除有害的编译 flag（最关键）

LLVM 21 的 CMake 会注入 `-Werror=date-time`、`-Wsuggest-override` 等 flag。但你用的是 clangd **15** 来解析 LLVM **21** 的代码，版本差异会导致大量误报。`.clangd` 中的 `Remove` 能精确移除这些 flag：

```yaml
CompileFlags:
  Remove:
    - -Werror=date-time      # clangd 15 误报时间戳宏
    - -Wsuggest-override     # clangd 15 对 LLVM 21 的 override 误报
```

**`settings.json` 无法做到这一点**——它不能修改编译命令。

#### 2. 为头文件提供 fallback 编译参数

`compile_commands.json` 只记录了 `.cpp` 文件的编译命令。当你打开一个 `.h` 头文件时，clangd 找不到对应的编译命令，需要 fallback 参数。`.clangd` 中的 `Add` 提供了这些：

```yaml
CompileFlags:
  Add: [-std=c++17, -I/home/ken/workspace/llvm-project/llvm/include]
```

这样**头文件也能正确跳转**，而不只是 `.cpp` 文件。

#### 3. 配置 clang-tidy 检查规则

```yaml
Diagnostics:
  ClangTidy:
    Add: [modernize-*, bugprone-*, performance-*]
    Remove: [modernize-use-trailing-return-type]
```

这些规则控制代码诊断（波浪线提示），`settings.json` 只能开/关 clang-tidy，**不能指定具体检查哪些规则**。

#### 4. 启用 InlayHints（代码内嵌提示）

```yaml
InlayHints:
  Enabled: Yes
  ParameterNames: Yes    # 函数调用时显示参数名
  DeducedTypes: Yes      # auto 变量显示推导类型
```

效果（编辑器中灰色文字）：
```cpp
foo(/*name=*/"hello", /*count=*/42);
auto /*int*/ x = getValue();
```

### 总结

| 场景            | 没有 `.clangd`                     | 有 `.clangd`  |
| --------------- | ---------------------------------- | ------------- |
| `.cpp` 跳转     | ✅ 正常（有 compile_commands.json） | ✅ 正常        |
| `.h` 头文件跳转 | ❌ 缺少 fallback 参数               | ✅ 有 fallback |
| clangd 15 误报  | ❌ 大量 `-Werror` 噪声              | ✅ 已移除      |
| clang-tidy 规则 | 只能全开/全关                      | ✅ 精细控制    |
| InlayHints      | 取决于默认值                       | ✅ 已启用      |

**结论**：`.clangd` 不是必须的（没有它 `.cpp` 跳转也能工作），但**强烈推荐**——它让头文件跳转、误报抑制、诊断规则都达到最佳状态。

请重载 VSCode 窗口（`Ctrl+Shift+P` → `Developer: Reload Window`）让配置生效。