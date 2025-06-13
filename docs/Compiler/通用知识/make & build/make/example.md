<h1 align="center">example</h1>
下面是一个最简单的Makefile文件示例，用于编译一个名为test.cpp的源文件：

makefile

复制

```makefile
# 编译器设置
CC = g++
CFLAGS = -Wall -Werror

# 目标规则
all: test

test: test.cpp
    $(CC) $(CFLAGS) -o $@ $<

# 清理规则
clean:
    rm -f test
```

这个Makefile文件包含了一个目标规则`test`和一个清理规则`clean`。

- 在目标规则中，定义了一个名为`test`的目标。它依赖于`test.cpp`源文件。`$(CC)`表示编译器，`$(CFLAGS)`表示编译选项，`-o $@`表示输出文件名为`test`，`$<`表示第一个依赖文件（即`test.cpp`）。因此，该规则将使用`g++`编译器编译`test.cpp`源文件，并生成可执行文件`test`。
- 清理规则`clean`用于删除生成的可执行文件。在该示例中，它会删除名为`test`的文件。

要编译`test.cpp`文件，只需在命令行中运行`make`命令。它将根据Makefile中的规则编译源文件并生成可执行文件`test`。

要清理生成的文件，可以运行`make clean`命令。它将执行清理规则并删除可执行文件`test`。

请确保在Makefile中使用Tab键进行缩进，并将文件命名为`Makefile`（注意大小写）。