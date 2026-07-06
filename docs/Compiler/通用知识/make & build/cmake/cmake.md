# cmake




```shell
进入到有CMakeLists的目录

执行
cmake .

make -j

或者先建立
mkdir build
cd build
cmake ..(CMakeLists所在目录)
```





```
cmake --trace 打印cmake脚本的执行信息
cmake --trace-expand  打印展开更多cmake脚本的执行信息，每一条生成gcc的命令及选项等
cmake -DCMAKE_VERBOSE_MAKEFILE=ON   使用make时打印命令，比如具体的gcc命令
```





在当面目录下的install进行安装

```
cmake . -DCMAKE_INSTALL_PREFIX="../install"

如果CMAKE后发现install错了，可以搜索set(CMAKE_INSTALL_PREFIX,进行查找，然后进行相应的替换。

如搜索 set(CMAKE_INSTALL_PREFIX "/install")可以用 gerp -r "set(CMAKE_INSTALL_PREFIX \"INSTALL"
```





### `make install`和`cmake install .`区别

#### make install

## **make install vs cmake --install . 的区别**

### 1. **make install** (传统方式)

make install

**特点:**

- ❌ **必须先执行 `make` 编译所有目标**
- ❌ 如果有任何编译错误(包括测试),`make install` 会失败
- ❌ 无法跳过失败的目标
- ✅ 适用于所有构建系统 (Make, Ninja 等)
- ⚠️ 在你的情况下会因为测试链接错误而失败

**执行流程:**

### 2. **cmake --install .** (CMake 3.15+ 推荐)

**特点:**

- ✅ **只安装已经编译成功的目标**
- ✅ 跳过编译失败的目标 (如测试)
- ✅ 不需要先运行 `make`
- ✅ 可以指定安装组件: `cmake --install . --component lib`
- ✅ 可以指定安装前缀: `cmake --install . --prefix /custom/path`
- ✅ 更灵活,更现代

**执行流程:**

### 3. **在你的项目中的表现**

#### 使用 make install:

**结果:** ❌ 失败

#### 使用 cmake --install:

**结果:** ✅ 成功

### 4. **高级用法**

### 5. **总结对比表**

| 特性             | make install   | cmake --install . |
| ---------------- | -------------- | ----------------- |
| CMake 版本要求   | 任何版本       | ≥ 3.15            |
| 是否需要完整编译 | ✅ 是           | ❌ 否              |
| 遇到编译错误     | ❌ 失败         | ✅ 跳过            |
| 组件选择         | ❌ 不支持       | ✅ 支持            |
| 自定义前缀       | ❌ 需重新配置   | ✅ 命令行指定      |
| 跨平台一致性     | ⚠️ 依赖构建工具 | ✅ 完全一致        |
| **你的项目推荐** | ❌              | ✅                 |

### 6. **推荐做法 (针对你的项目)**

**或者更简单:**

```
cd /home/ken/workspace/pocl/build

# 尝试编译所有,遇到错误继续
make -j$(nproc) -k

# 安装成功编译的部分
cmake --install .
```
