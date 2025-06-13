<h1 align="center">link_library命令介绍</h1>








在 CMake 里，用于生成库并进行链接操作的命令主要有 `add_library` 和 `target_link_libraries`。下面为你详细介绍这两个命令及其使用示例。

## 1. `add_library`

此命令的作用是定义要构建的库。它有三种库类型：静态库（`STATIC`）、共享库（`SHARED`）以及模块库（`MODULE`）。



**基本语法**：

```cmake
add_library(<name> [STATIC | SHARED | MODULE] [EXCLUDE_FROM_ALL] source1 [source2 ...])
```

- `<name>`：这是库的名称。
- `STATIC`、`SHARED`、`MODULE`：分别代表静态库、共享库和模块库。若不指定，默认生成静态库。
- `EXCLUDE_FROM_ALL`：表示该库不会被包含在默认的构建目标里。
- `source1 [source2 ...]`：为构成库的源文件列表。



## 2. `target_link_libraries`

该命令用于将目标（可执行文件或者库）与其他库进行链接。

**基本语法**：

```cmake
target_link_libraries(<target> [PRIVATE | PUBLIC | INTERFACE] item1 [item2 ...])
```

- `<target>`：是要链接库的目标，可以是可执行文件或者库。

- PRIVATE、PUBLIC、INTERFACE

  ：这几个关键字明确了链接的作用域。

  - `PRIVATE`：意味着该库仅在目标内部使用。
  - `PUBLIC`：表示该库既在目标内部使用，也会传递给依赖该目标的其他目标。
  - `INTERFACE`：表示该库不会在目标内部使用，仅传递给依赖该目标的其他目标。

- `item1 [item2 ...]`：为要链接的库的名称。



## 3. 示例代码

下面给出一个简单的 CMake 示例，展示如何生成库并将其链接到可执行文件：

```cmake
# 设置 CMake 最低版本要求
cmake_minimum_required(VERSION 3.10)

# 设置项目名称
project(MyProject)

# 添加库
add_library(MyLibrary SHARED src/mylibrary.cpp)

# 添加可执行文件
add_executable(MyExecutable src/main.cpp)

# 链接库到可执行文件
target_link_libraries(MyExecutable PRIVATE MyLibrary)    
```



在这个示例中：

1. 首先设定了 CMake 的最低版本要求以及项目名称。
2. 接着运用 `add_library` 命令生成一个名为 `MyLibrary` 的共享库。
3. 然后使用 `add_executable` 命令创建一个名为 `MyExecutable` 的可执行文件。
4. 最后通过 `target_link_libraries` 命令把 `MyLibrary` 库链接到 `MyExecutable` 可执行文件上。

你可以按照如下步骤使用这个 CMake 脚本：

1. 把上述代码保存为 `CMakeLists.txt`。
2. 在项目根目录下创建 `src` 文件夹，并在其中创建 `mylibrary.cpp` 和 `main.cpp` 文件。
3. 打开终端，进入项目根目录，执行以下命令：

```bash
mkdir build
cd build
cmake ..
make
```

