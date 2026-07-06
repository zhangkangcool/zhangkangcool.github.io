# clangd(llvm-project)

根目标下的clangd文件

```json
---
# clangd configuration for llvm-project
# See: https://clangd.llvm.org/config
#
# 注意：本文件与 .vscode/settings.json 的分工：
#   - .vscode/settings.json: 配置 clangd 二进制路径、扩展行为、VSCode 界面
#   - .clangd: 配置 clangd 语言服务本身的编译参数、索引、诊断、InlayHints

CompileFlags:
  # compile_commands.json 所在目录（CMake 生成）
  CompilationDatabase: /home/ken/workspace/llvm-project/build

  # 移除会导致 clangd 15 误报的编译 flag
  # LLVM 21 的 CMake 会注入这些 flag，但 clangd 15 解析时可能产生噪声
  Remove:
    - -Werror=date-time
    - -Werror=unguarded-availability-new
    - -Werror=global-constructors
    - -Wsuggest-override    # clangd 15 对 LLVM 21 代码误报较多

  # 为不在 compile_commands.json 中的文件（如 header）提供 fallback
  # 确保头文件也能正确解析
  Add: [-std=c++17, -I/home/ken/workspace/llvm-project/llvm/include]

Index:
  # 启用后台索引，提升跨文件跳转能力
  Background: Build
  StandardLibrary: true

InlayHints:
  Enabled: Yes
  ParameterNames: Yes
  DeducedTypes: Yes

# clang-tidy 检查（轻量级，避免拖慢 clangd）
Diagnostics:
  ClangTidy:
    Add: [modernize-*, bugprone-*, performance-*]
    Remove:
      - modernize-use-trailing-return-type
      - modernize-use-nodiscard
  Suppress: [unused_includes]
```





`.vscode/settings.json`

```json
{
  // --- clangd (recommended) ---
  // 使用稳定的 clangd 15（LLVM_DEFAULT_TARGET_TRIPLE=x86_64-unknown-linux-gnu）。
  // 项目 build/ 中的 clangd 21 因构建时未设置 default target triple，
  // 导致 "unknown target triple 'unknown'" → AST 构建失败，跳转失效。
  "clangd.path": "/home/ken/workspace/llvm15/build/bin/clangd",
  "clangd.arguments": [
    "--compile-commands-dir=${workspaceFolder}/build",
    "--background-index",
    "--clang-tidy",
    "--header-insertion=never",
    "--completion-style=detailed",
    "--pch-storage=memory",
    "--log=error"
  ],
  "clangd.onConfigChanged": "restart",
  "clangd.checkUpdates": false,

  // --- Disable cpptools IntelliSense to prevent conflicts ---
  // 已安装 ms-vscode.cpptools，它会与 clangd 扩展争抢 IntelliSense。
  // 必须全部禁用，让 clangd 独占 C++ 语言服务。
  "C_Cpp.intelliSenseEngine": "disabled",
  "C_Cpp.autocomplete": "disabled",
  "C_Cpp.errorSquiggles": "disabled",
  "C_Cpp.formatting": "disabled",
  "C_Cpp.default.compileCommands": "${workspaceFolder}/build/compile_commands.json",

  // --- tblgen-lsp-server for .td files ---
  "mlir.tblgenLspServer.path": "${workspaceFolder}/build/bin/tblgen-lsp-server",
  "mlir.tblgenLspServer.includePaths": [
    "${workspaceFolder}/llvm/include",
    "${workspaceFolder}/llvm/lib/Target",
    "${workspaceFolder}/llvm/lib/Target/RISCV"
  ],

  // --- File associations for this LLVM/MLIR project ---
  "files.associations": {
    "*.td": "tablegen",
    "*.mlir": "mlir",
    "*.ll": "llvm",
    "*.tpp": "cpp"
  },

  // Exclude build dir from search to speed up clangd and file search.
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true
  },
  "search.exclude": {
    "**/build": true
  },

  "chat.tools.terminal.autoApprove": {
    "cp": true,
    "$LLC": true,
    "$LLVMMC": true,
    "$LLD": true,
    "return": true,
    "build_and_test": true,
    "ninja": true,
    "llvm-lit": true,
    "git stash": true,
    "/^bash build_and_run\\.sh$/": {
      "approve": true,
      "matchCommandLine": true
    }
  }
}
```

