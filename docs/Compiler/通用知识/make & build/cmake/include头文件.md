# CMake include头文件





##  1. 在CMakeLists.txt文件中进行设置

在 CMake 中设置额外的 include 路径可以使用 `include_directories()` 命令或者更现代的 `target_include_directories()` 命令。

`include_directories()` 是全局设置，会影响后续所有目标：

```cmake
# 添加额外的include路径
include_directories(
    ${PROJECT_SOURCE_DIR}/include
    ${PROJECT_SOURCE_DIR}/third_party/include
    /usr/local/custom/include
)
```



更推荐的方式是使用 `target_include_directories()`，它只为特定目标设置 include 路径，更符合现代 CMake 的目标导向理念：



```cmake
# 假设你有一个名为my_target的目标
add_executable(my_target src/main.cpp)

# 为该目标添加include路径
target_include_directories(my_target
    PRIVATE  # 只对当前目标可见
        ${PROJECT_SOURCE_DIR}/include
        ${PROJECT_SOURCE_DIR}/third_party/include
    PUBLIC   # 对当前目标和链接它的目标都可见
        /usr/local/shared/include
)
```



`PRIVATE`、`PUBLIC` 和 `INTERFACE` 关键字的区别：



- `PRIVATE`：路径仅用于当前目标的编译
- `PUBLIC`：路径用于当前目标的编译，也用于链接该目标的其他目标
- `INTERFACE`：路径不用于当前目标，仅用于链接该目标的其他目标



使用变量可以让路径设置更灵活，例如：



```cmake
set(EXTRA_INCLUDE_DIRS
    ${PROJECT_SOURCE_DIR}/include
    ${PROJECT_SOURCE_DIR}/third_party/include
)

target_include_directories(my_target PRIVATE ${EXTRA_INCLUDE_DIRS})
```









## 2. 直接在cmake -D上进行设置

在 CMake 构建过程中，除了在 CMakeLists.txt 中通过 `include_directories` 或 `target_include_directories` 设置头文件路径外，还可以在编译命令中通过以下方式添加额外的 include 路径：

### 2.1 使用 CMake 变量在命令行传递
可以通过 `-DCMAKE_CXX_FLAGS`（C++）或 `-DCMAKE_C_FLAGS`（C）在运行 `cmake` 命令时直接添加：

```bash
# 为 C++ 项目添加额外 include 路径
cmake -DCMAKE_CXX_FLAGS="-I/path/to/extra/include -I/another/path" ..

# 为 C 项目添加额外 include 路径
cmake -DCMAKE_C_FLAGS="-I/path/to/extra/include" ..
```



### 2.2 通过 CMAKE_INCLUDE_PATH 变量
CMake 提供了 `CMAKE_INCLUDE_PATH` 变量专门用于指定额外的头文件搜索路径：

```bash
cmake -DCMAKE_INCLUDE_PATH="/path/to/extra/include:/another/path" ..
```

这会让 CMake 在查找头文件时自动搜索这些路径，等效于在 CMakeLists.txt 中设置全局 include 路径。





## 3. make构建阶段临时添加（不推荐）
如果已经生成了 Makefile 等构建文件，也可以在 `make` 命令中临时添加：

```bash
make CXXFLAGS+="-I/path/to/extra/include"
```

但这种方式仅对当前构建有效，且可能被 CMake 生成的配置覆盖，不推荐作为常规做法。





**最佳实践**：建议优先在 CMakeLists.txt 中使用 `target_include_directories` 明确指定路径，如需动态调整，再通过 `-DCMAKE_INCLUDE_PATH` 或 `-DCMAKE_CXX_FLAGS` 在命令行传递，这样更符合 CMake 的构建逻辑。

