# 在 Ubuntu 24.04 上编译 LLVM 并运行 check-llvm

`make check-llvm` 是在 LLVM 源码编译目录里，**只跑 LLVM 自身的回归测试（不跑 Clang/其他子项目）**，底层用 `llvm-lit` 执行 `llvm/test/` 下的用例。

### 一、基本用法（make 构建）

```Bash
# 进入 build 目录（假设你是 mkdir build && cd build）
cd build

# 完整编译后跑 llvm 测试
make -j$(nproc)
make check-llvm
```

### 二、等价的 ninja 写法（推荐，更快）

```Bash
ninja check-llvm
```

### 三、常见相关目标

- `make check-all`：跑 LLVM + Clang + 所有子项目测试
- `make check-clang`：只跑 Clang 测试
- `make check-llvm-codegen`：只跑 CodeGen 相关测试
- `make check-llvm-unit`：跑 LLVM 单元测试

### 四、常用调试/过滤示例

```Bash
# 只跑某个目录下的测试
make check-llvm LIT_ARGS="llvm/test/CodeGen/RISCV"

# 详细输出，显示失败详情
make check-llvm LIT_ARGS="-v"

# 跑单个测试文件
llvm-lit llvm/test/CodeGen/RISCV/alu.ll
```

### 五、常见报错与原因

1. **找不到 llvm-lit**：没编译完 LLVM，先执行 `make -j$(nproc)`。
2. **测试大量失败**：
   1. Debug 模式下断言触发，建议用 Release+Assertions 编译：
      - ```Bash
        cmake -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_ASSERTIONS=ON ..
        ```
   2. 架构/配置不匹配（如 RISCV 测试在 x86 主机上部分跳过）。
3. **超时**：测试用例过多，可过滤目录或用更强机器。

需要我帮你整理一份在 Ubuntu 24.04 上编译 LLVM 并运行 `check-llvm` 的最小化脚本吗？