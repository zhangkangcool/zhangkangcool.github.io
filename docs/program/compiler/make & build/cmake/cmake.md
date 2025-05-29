



```
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

