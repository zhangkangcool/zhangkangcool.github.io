

```
当我们使用g++编译c++程序时，一般都会动态链接libstdc++.so共享库，有时候受限于不同机器和不同使用场景，我们希望静态链接libstdc++.so库，这样可能便于移植到相似的机器上，这时候就可以使用-static-xxx选项，将所有的库打包成一个可执行文件。他们之间的主要不同点在于：

-static 会将所以有用到的外部库全部以静态的方式链接
-static-libstdc++ 只将libstdc++.so静态链接
-static-gcc 同-static-libstdc++
————————————————
版权声明：本文为CSDN博主「YLEOY」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/leigelaile1/article/details/124952467
```







```
add_library(APUasm STATIC ${src_files})   # 编译成静态库 生成libAPUasm.so
add_library(APUasm SHARED ${src_files})   # 编译成动态库 生成libAPUasm.a


target_link_libraries(APUasm -lm -lpthread -lvec2 -static)  // -lvec2明确使用静态库，默认是先使用动态库，没有则使用静态库

g++ -o APUASM -rdynamic -lm -lpthread -lvec2 -static
```

