



`build_llvm.sh`

```c++
#!/usr/bin/env bash

set -euo pipefail
set -x

cd "$(dirname "$(readlink -f "$0")")"

export CCACHE_DIR="${CCACHE_DIR:-$HOME/.cache/ccache-llvm}"
ccache --set-config max_size=15G

NPROC=12
BUILD_DIR="${BUILD_DIR:-build}"
INSTALL_DIR="${INSTALL_DIR:-$PWD/install}"

mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

cmake -S ../llvm -G Ninja \
    -DCMAKE_C_COMPILER_LAUNCHER=ccache \
    -DCMAKE_CXX_COMPILER_LAUNCHER=ccache \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX="$INSTALL_DIR" \
    -DLLVM_TARGETS_TO_BUILD="RISCV" \
    -DLLVM_ENABLE_PROJECTS="clang;mlir;clang-tools-extra;lld" \
    -DLLVM_ENABLE_ASSERTIONS=ON \
    -DLLVM_ENABLE_RTTI=ON \
    -DLLVM_INSTALL_UTILS=ON \
    -DLLVM_BUILD_UTILS=ON \
    -DCLANG_BUILD_TOOLS=ON \
    -DBUILD_SHARED_LIBS=OFF \
    | tee cmake.log

ninja -j$NPROC -v | tee build.log
ninja install -j$NPROC  | tee install.log
ninja -j$NPROC tblgen-lsp-server
```

