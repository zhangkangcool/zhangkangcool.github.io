# compile_commands.json

## `compile_commands.json` 的生成机制

### 核心结论

**`compile_commands.json` 是由 CMake 生成的，不是由 ninja 生成的。** ninja 只是编译器，不负责生成此文件。但 CMake 生成它有两个前提条件：

| 条件                                        | 说明                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| ① 选项 `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON` | 必须显式开启，CMake **默认不生成**此文件                     |
| ② 使用 Ninja 或 Makefile 生成器             | 即 `-G Ninja` 或 `-G "Unix Makefiles"`，**VS / Xcode 生成器不支持** |

### 分工说明

```
cmake 配置阶段               ninja 编译阶段
─────────────────           ─────────────────
cmake -G Ninja \             ninja -j8
  -DCMAKE_EXPORT_...          ↓
  compile_commands.json!      只负责编译，不生成 json
       ↓
  生成 build.ninja
```

- **CMake**（配置阶段 `cmake ..`）：读取 CMakeLists.txt → 生成 `build.ninja` **和** `compile_commands.json`
- **Ninja**（编译阶段 `ninja`）：读取 `build.ninja` → 编译 `.o` 文件，**与 json 无关**

### 为什么你的项目有这个文件？

从你的 `build_llvm.sh` 看，命令行中**没有** `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON`：

```bash
cmake -S ../llvm -G Ninja \
    -DCMAKE_C_COMPILER_LAUNCHER=ccache \
    # ... 没有 CMAKE_EXPORT_COMPILE_COMMANDS ...
```

但 `compile_commands.json` 确实存在（9.5MB）。这说明 **LLVM 的 CMake 代码内部某处用 `set()` 设置了这个变量**（而非 cache 变量，所以 `CMakeCache.txt` 中显示为空）。很多大型项目（LLVM、Boost 等）会在 CMakeLists.txt 中默认开启它。

### 通用用法（适用于任何项目）

**方法 1：命令行传参（最通用）**
```bash
cmake -B build -G Ninja -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
```

**方法 2：在 CMakeLists.txt 中设置**
```cmake
# 放在项目顶层 CMakeLists.txt 的 project() 之后
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
```

**方法 3：让 clangd 找到它（软链接到项目根目录）**

CMake 默认把 json 生成在 `build/` 目录，但 clangd 默认只在**项目根目录**查找。两种解决方式：

```bash
# 方式 A：创建软链接到根目录
ln -s build/compile_commands.json compile_commands.json

# 方式 B：在 .clangd 中指定路径（本项目的做法）
# .clangd 文件中：
#   CompileFlags:
#     CompilationDatabase: /home/ken/workspace/llvm-project/build
```

### 总结对比

| 问题                 | 答案                                                   |
| -------------------- | ------------------------------------------------------ |
| ninja 会生成吗？     | ❌ 不会，ninja 只负责编译                               |
| cmake 会自动生成吗？ | ❌ 不会，默认关闭                                       |
| 需要什么选项？       | `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON`                   |
| 所有生成器都支持吗？ | ❌ 只有 **Ninja** 和 **Makefile** 支持，VS/Xcode 不支持 |
| 你的项目为何有？     | LLVM 的 CMake 代码内部设置了此变量                     |

所以对于**任何 CMake 项目**，只要在 `cmake` 配置时加上 `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON` 并使用 Ninja/Makefile 生成器，就会生成 `compile_commands.json`，clangd 就能据此提供跳转。



----

## 不指定 `-G` 时是否生成 `compile_commands.json`？

**取决于你的操作系统平台——不能一概而论。**

关键在于：不指定 `-G` 时，CMake 会使用**平台默认生成器**。而 `CMAKE_EXPORT_COMPILE_COMMANDS` 只被部分生成器支持。

### 各生成器的支持情况

| 生成器                                           | 支持 `CMAKE_EXPORT_COMPILE_COMMANDS`？ | 是否为某平台默认     |
| ------------------------------------------------ | -------------------------------------- | -------------------- |
| **Ninja** (`-G Ninja`)                           | ✅ 支持                                 | 否                   |
| **Unix Makefiles** (`-G "Unix Makefiles"`)       | ✅ 支持                                 | **Linux/macOS 默认** |
| Ninja Multi-Config (`-G "Ninja Multi-Config"`)   | ✅ 支持                                 | 否                   |
| **Visual Studio** (`-G "Visual Studio 17 2022"`) | ❌ **不支持**                           | **Windows 默认**     |
| **Xcode** (`-G Xcode`)                           | ❌ **不支持**                           | macOS（需 Xcode 时） |
| CodeBlocks (`-G "CodeBlocks - Unix Makefiles"`)  | ✅ 支持                                 | 否                   |

> 官方文档原文：*"This option is implemented only by Makefile Generators and the Ninja Generators. It is not implemented by IDE generators such as Visual Studio, Xcode, etc."*

### 所以你的问题的答案

#### 场景 1：Linux 上（你的环境）
```bash
cmake -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
# 不指定 -G，默认使用 "Unix Makefiles"
```
**会生成** ✅ —— 因为 Linux 默认生成器是 `Unix Makefiles`，它支持此选项。编译时用 `make` 而非 `ninja`。

#### 场景 2：Windows 上
```bash
cmake -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
# 不指定 -G，默认使用 "Visual Studio 17 2022"
```
**不会生成** ❌ —— 因为 Windows 默认生成器是 Visual Studio，它不支持此选项。即使加了 `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON`，CMake 会静默忽略（不报错）。

### 验证你的环境

你可以用以下命令查看本机 CMake 的默认生成器：
```bash
cmake --help | grep "Default generator"
```
在你的 Linux 机器上输出会是类似 `* Unix Makefiles = Generates Makefiles ...`。

### 总结

```
是否生成 compile_commands.json
= (-DCMAKE_EXPORT_COMPILE_COMMANDS=ON) AND (生成器属于 Ninja/Makefile 家族)
```

| 条件组合                   | Linux               | Windows            |
| -------------------------- | ------------------- | ------------------ |
| `-G Ninja` + `ON`          | ✅                   | ✅                  |
| 不指定 `-G`（默认） + `ON` | ✅（Unix Makefiles） | ❌（Visual Studio） |
| `-G Ninja` + 不加选项      | ❌                   | ❌                  |
| 不指定 `-G` + 不加选项     | ❌                   | ❌                  |

**最佳实践**：无论哪个平台，显式指定 `-G Ninja -DCMAKE_EXPORT_COMPILE_COMMANDS=ON` 是最可靠的组合——速度快（ninja 并行编译）且保证生成 json。