

<h1 align="center">make</h1>



make use `Makefile` default.
If you want to use the specify Makefile file, you should use `make -f`.
On the linux the `gmake`(means gnu make) is same as `make`. If on other OS, you must use `gmake` to use the gnu make. 

```
make -j40 -f Makefile.lnx_le
```

print the command line and not to run
```
make -n
```

### 1 A Makefile example



```
TARGET = main
OBJ=server.o interface.o phy_iniparser.o phy_dictionary.o  XenCtrImpl.o auth_app.o public.o log.o md5.o main.o
CFLAG=-Wall -Iinclude/ 
LFLAG=-lpthread -lmysqlclient_r -L/lib64/mysql
CC=gcc
main:$(OBJ)
	$(CC) $(OBJ) -g -rdynamic -o $(TARGET) $(LFLAG) 
%.o:%.c
	$(CC) -g -c -rdynamic $(CFLAG) $<
clean:
	rm $(TARGET) *.o
```
缩进必须是TAB，不能是space。

### 2.2 查看命令行

```
仅查看命令，不执行编译
make clean
make cheak -n 
make -n
```



### 2.3 编译时显示详细的命令行

```
http://euhat.com/wp/2017/11/01/cmake-%E6%98%BE%E7%A4%BA%E7%BC%96%E8%AF%91%E5%91%BD%E4%BB%A4/
最好先make clean
make VERBOSE=1
```





### 2.4 指定Makefile文件

```
 make -f myMakefile
```

# 3. build a software

If you are building the `texinfo-6.0`.
```
mkdir ~/software/textinfo
cd ~/software/textinfo
mkdir build
mkdir install
build  install  texinfo-6.0  texinfo-6.0.tar
cd build

../texinfo-6.0/configure --prefix=/home/shkzhang/software/textinfo/install/
make -j
make install
```



# 4. make编译打印详细日志

`make V=1`

```shell
常用的是 make V=1
make V=0 	quiet build (default)
make V=1 	verbose build
make V=2 	give reason for rebuild of target

make VERBOSE=1


make -n 只输出编译命令，不进行真正的输出
```





```
cmake -E link.txt --verbose=1
```





`make V=1` 的效果取决于 `Makefile` 的编写方式。以下是一些可能的原因：

1. **`Makefile` 结构不同：**
   - 有些 `Makefile` 明确支持 `V` 变量来控制输出详细程度，而有些则没有实现这一功能。

2. **自动化工具：**
   - 使用 CMake 或 autotools 生成的 `Makefile` 通常支持 `VERBOSE` 或 `V` 变量，但手写的 `Makefile` 可能没有这种功能。

3. **隐藏命令：**
   - 如果命令前面有 `@`，即使设置了 `V=1`，也可能隐藏输出。需要在 `Makefile` 中移除这些 `@` 符号。

4. **缺少条件：**
   - 需要在 `Makefile` 中使用条件语句（如 `ifeq`）来根据 `V` 的值决定是否输出详细信息。

如果 `V=1` 不起作用，可以查看 `Makefile` 来确定其是否支持该变量，或者手动修改 `Makefile` 以启用详细输出。





### 5. Make 调试

```
make CFLAGS="-g" CXXFLAGS="-g"
```





### 6. flag上加-v输出更多信息

```C++
CFLAGS    += -v
CXXFLAGS  += -v
```





### 7. make --trace VERBOSE=2（建议使用）

cmake --trace可以打印cmake脚本信息，

Cmake --trace-expand 打印更多cmake信息，每个宏的值都能找到

和 make --trace不同，后者打印编译信息

加 VERBOSE=2或1后，才能看到link脚本的具体执行。

最好是在CMAKE时加上DCMAKE_VERBOSE_MAKEFILE=ON，这样可以看到链接代码

使用`--trace`可以得到所需要的编译命令。该命令打印跟踪信息。该命令不仅会打印编译命令，还会打印出对makefile文件的整个解析运行过程。相当于shell脚本中的`set -x`。显示信息最多，会显示执行的哪个Makefile文件，以及文件的哪一行。
