



```
# 进入 llvm-project
cd llvm-project

# 新建一个干净的构建目录
mkdir build-lsp && cd build-lsp

编译时，需要打开mlir才行

# 执行 cmake
cmake ../llvm \
  -DCMAKE_BUILD_TYPE=Release \
  -DLLVM_ENABLE_PROJECTS="mlir"

# 编译
make tblgen-lsp-server
```





.vscode/settings.json

```json
{
    // MLIR/TableGen 支持 .td 跳转
    "mlir.tblgenLspServer.path": "/home/ken/workspace/llvm-project/build/bin/tblgen-lsp-server",
    "mlir.tblgenLspServer.includePaths": [
        "/home/ken/workspace/llvm-project/llvm/include",
        "/home/ken/workspace/llvm-project/llvm/lib/Target",
        "/home/ken/workspace/llvm-project/llvm/lib/Target/RISCV", // 可选，RISC-V 特定路径
        "/home/ken/workspace/llvm-project/mlir/include"
    ],
    // td 文件默认语法
    "files.associations": {
        "*.td": "tablegen"
    }
}
```

