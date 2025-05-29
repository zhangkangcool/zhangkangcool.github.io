`add_library` 和 `target_link_libraries` 是 CMake 中用于处理库的两个关键命令，它们在功能和用途上有明显区别：



### 功能用途

- `add_library`
  - 此命令的核心功能是定义并创建库。它允许你指定要构建的库的类型（静态库、共享库或模块库），并将源文件集合起来生成对应的库文件。静态库会被链接到使用它的可执行文件中，而共享库则在运行时动态加载。模块库通常用于插件开发。
  - 例如，在一个项目中，你有一组实现了特定功能的源文件，你可以使用 `add_library` 将这些源文件打包成一个库，供其他部分复用。
- `target_link_libraries`
  - 该命令的主要作用是将目标（可以是可执行文件或另一个库）与其他库进行链接。链接操作使得目标能够使用被链接库中定义的函数和变量。通过指定链接的库，你可以确保目标在编译和运行时能够正确访问所需的功能。
  - 比如，当你开发一个可执行程序时，该程序需要使用某个库提供的功能，就可以使用 `target_link_libraries` 将这个库链接到可执行程序上。

### 使用时机

- `add_library`
  - 在 CMake 脚本中，`add_library` 通常在定义库的阶段使用，也就是在明确要构建哪些库以及这些库由哪些源文件组成时调用。一般会在创建可执行文件之前使用该命令来生成所需的库。
- `target_link_libraries`
  - `target_link_libraries` 通常在定义了目标（可执行文件或库）之后使用，用于指定该目标需要链接哪些库。它是在库已经被创建（使用 `add_library`）之后，建立目标与库之间的依赖关系的步骤。

### 示例说明

以下是一个简单的 CMake 示例，展示了两个命令的使用：

```cmake
# 设置 CMake 最低版本要求
cmake_minimum_required(VERSION 3.10)

# 设置项目名称
project(MyProject)

# 使用 add_library 创建一个静态库
add_library(MyStaticLibrary STATIC src/static_lib.cpp)

# 使用 add_library 创建一个共享库
add_library(MySharedLibrary SHARED src/shared_lib.cpp)

# 创建一个可执行文件
add_executable(MyExecutable src/main.cpp)

# 使用 target_link_libraries 将可执行文件与静态库和共享库链接
target_link_libraries(MyExecutable PRIVATE MyStaticLibrary MySharedLibrary)
```



在这个示例中：



- `add_library` 分别创建了静态库 `MyStaticLibrary` 和共享库 `MySharedLibrary`。
- `add_executable` 创建了可执行文件 `MyExecutable`。
- `target_link_libraries` 将 `MyExecutable` 与 `MyStaticLibrary` 和 `MySharedLibrary` 进行链接，使得 `MyExecutable` 能够使用这两个库中定义的功能。



综上所述，`add_library` 用于创建库，而 `target_link_libraries` 用于将目标与已创建的库进行链接，二者在 CMake 项目构建过程中扮演着不同但相互关联的角色。