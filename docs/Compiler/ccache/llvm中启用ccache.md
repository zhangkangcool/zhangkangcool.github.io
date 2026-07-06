# llvmä¸­å¯ç¨ccache

## 如何在 LLVM 构建中正确启用 ccache

### 1. 先确认 ccache 已安装
```bash
ccache --version
# 没装就装：
sudo apt install ccache       # Debian/Ubuntu
```

### 2. 三种启用方式（任选其一）

#### ✅ 方式 A：LLVM 官方推荐（最简单）
LLVM 的 CMake 自带一个开关，开了之后它内部会自动把 `ccache` 设为编译器 launcher：
```bash
cmake -S ../llvm -G Ninja \
    -DLLVM_CCACHE_BUILD=ON \
    ...
```
原理：LLVM 在 `llvm/CMakeLists.txt` 里看到这个变量后，会执行类似
`set(CMAKE_C_COMPILER_LAUNCHER ccache)`、`set(CMAKE_CXX_COMPILER_LAUNCHER ccache)`。

> 还可配套：
> - `-DLLVM_CCACHE_MAXSIZE=20G`
> - `-DLLVM_CCACHE_DIR=$HOME/.cache/ccache-llvm`
> - `-DLLVM_CCACHE_PROGRAM=/usr/bin/ccache`（指定二进制路径）

#### ✅ 方式 B：通用 CMake 写法（任何项目都能用）
```bash
cmake -S ../llvm -G Ninja \
    -DCMAKE_C_COMPILER_LAUNCHER=ccache \
    -DCMAKE_CXX_COMPILER_LAUNCHER=ccache \
    ...
```
CMake 会在每次编译命令前加上 `ccache`，例如 `ccache /usr/bin/c++ -c foo.cpp`。

#### ⚠️ 方式 C：把编译器替换成 ccache 包装（老办法，不推荐）
```bash
-DCMAKE_C_COMPILER=/usr/lib/ccache/gcc
-DCMAKE_CXX_COMPILER=/usr/lib/ccache/g++
```
某些发行版会在 `/usr/lib/ccache/` 下放 gcc/g++ 的同名 symlink 指向 ccache，PATH 优先它即可。不太推荐这种方式，因为它会让 CMake 的编译器检测信息变得有点乱。

---

### 3. ccache 的全局配置（一次性设好即可）
跟 CMake 参数无关，是 ccache 自己的设置：
```bash
# 缓存目录（默认 ~/.ccache）
export CCACHE_DIR=$HOME/.cache/ccache-llvm
# 或写进 ~/.config/ccache/ccache.conf:
#   cache_dir = /home/ken/.cache/ccache-llvm
#   max_size  = 30G

ccache --set-config max_size=30G          # 缓存上限
ccache --set-config compression=true      # 启用压缩
ccache --set-config compression_level=6   # 压缩等级
```

环境变量也能临时改：
```bash
export CCACHE_MAXSIZE=30G
export CCACHE_COMPRESS=1
```

---

### 4. 验证 ccache 确实在工作

构建前清零统计：
```bash
ccache -z
```

构建后查看命中率：
```bash
ccache -s
```
应该能看到类似输出：
```
cacheable calls:    12345
  hits:             10000  (81.00%)
  misses:            2345  (19.00%)
cache size:         8.2 GB
```
第一次全量构建命中率会接近 0%（都是 miss、填缓存）；第二次重建同一份源码，命中率应接近 100%。

构建时也可以看到 ninja 命令前缀变成 `ccache /usr/bin/c++ ...`（用 `ninja -v` 时可见）。

---

### 5. 应用到你的 `build_llvm.sh`

你目前的脚本只设了 `CCACHE_DIR` 和 `max_size`，但**没告诉 CMake 用 ccache**，所以缓存目录里其实啥都没存。把 cmake 那段加一行即可：

```bash
export CCACHE_DIR="${CCACHE_DIR:-$HOME/.cache/ccache-llvm}"
ccache --set-config max_size=15G

cmake -S ../llvm -G Ninja \
    -DLLVM_CCACHE_BUILD=ON \
    -DCMAKE_BUILD_TYPE=Release \
    -DLLVM_ENABLE_ASSERTIONS=ON \
    -DLLVM_TARGETS_TO_BUILD="RISCV" \
    -DLLVM_ENABLE_PROJECTS="clang;mlir;clang-tools-extra;lld" \
    -DLLVM_ENABLE_RTTI=ON \
    ...
```

---

### 6. 实用小技巧

- **第一次构建** ccache 也要把所有源码"过一遍"才有缓存，速度不会变快；**第二次起**才有显著加速。
- **改 compile flag**（如 `-O2` → `-O3`、加 `-DLLVM_ENABLE_ASSERTIONS`）会让 hash 变化，全部 miss，属正常。
- 想让"切分支重编"也命中缓存：
  ```bash
  ccache --set-config sloppiness=time_macros,include_file_mtime,include_file_ctime,file_macro
  ```
- 想清空缓存：`ccache -C`；想看配置：`ccache -p`。
- 配合 `-DLLVM_USE_LINKER=lld`，编译阶段被 ccache 加速、链接阶段被 lld 加速，增量构建非常快。