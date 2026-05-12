

# Expand Swap to 8GB for LLVM Compilation

我一眼就看出问题了！

你的 **swap 只有 2GB，而且已经 100% 占满了**！

```Plain
交换：         2.0Gi       2.0Gi       3.5Mi  → 满了！
/swapfile file   2G   2G   -2
```

编译 LLVM + Clang + LLDb，**2GB swap 完全不够用，等于没有**。

所以编译还是会被系统杀掉。

## 你现在必须做：**把 SWAP 扩大到 8GB～16GB**

我给你 **无损、无痛、直接扩容到 8GB swap** 的完整命令，复制粘贴就能用：

# 1. 先关闭旧 swap

```Bash
sudo swapoff /swapfile
```

# 2. 删除旧 2GB swap 文件

```Bash
sudo rm /swapfile
```

# 3. 创建 **8GB swap**（编译 LLVM 最低要求）

```Bash
sudo fallocate -l 8G /swapfile
```

# 4. 设置权限 + 格式化

```Bash
sudo chmod 600 /swapfile
sudo mkswap /swapfile
```

# 5. 启用新 swap

```Bash
sudo swapon /swapfile
```

# 6. 验证（必须看到 8GB）

```Bash
free -h
```

输出应该变成：

```Plain
交换：         8.0Gi       0B        8.0Gi
```

# 7. 现在你可以安心编译了！

进入 build 目录：

```Bash
cd ~/workspace/llvm-project/build
```

**推荐用 -j3 或 -j4 编译**（有 8GB swap 完全扛得住）

```Bash
make -j4
```

## 为什么你之前编译被 kill？

- 物理内存 14GB → 够
- **swap 只有 2GB → 瞬间占满 → 系统 OOM 杀进程**

现在扩到 **8GB swap**，

**14GB 内存 + 8GB swap = 22GB**

编译 LLVM + clang + lldb 稳稳的！

## 我再给你一个最稳的 CMake 配置

```Bash
cmake -S ../llvm \
-DCMAKE_BUILD_TYPE=Debug \
-DLLVM_TARGETS_TO_BUILD=RISCV \
-DLLVM_ENABLE_PROJECTS="clang" \
-DBUILD_SHARED_LIBS=OFF \
-DLLVM_REQUIRES_RTTI=ON
```

**不编译 lldb → 内存占用直接减半**

需要我再帮你确认一遍 swap 是否生效吗？