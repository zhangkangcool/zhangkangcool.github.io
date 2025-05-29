https://blog.csdn.net/pengfei240/article/details/53165151

# 参数详解

可用来查看，所使用的头文件，以及各种文件间的依赖关系。

- -M
  不是输出预编译过程的结果，而是输出一个用于make的规则，该规则描述了这个源文件的依赖关系。预编译器输出的这个make规则包含名字与原文件相同的目标文件，冒号和所有include文件的名字。只输出信息，不会进行编译。

  

- -MM
  与-M相似，只是不包含系统头文件

  

- -MF file
  将依赖关系写到文件file中

  

- -MT target / -MQ target
  重新定义目标对象名

  

- -MD
  等同于-M -MF file



# 例子

```c
/* main.c */
#include <stdio.h>
#include "main.h"

void main(void)
{
    printf("%s\n", PRINT_STR);
}
```



```c
/* main.h */
#define PRINT_STR "Hello World"
```



- -M 参数实例 - 完整的头文件依赖关系

```shell
$ gcc -M main.c 
main.o: main.c /usr/include/stdc-predef.h /usr/include/stdio.h \ 
/usr/include/features.h /usr/include/i386-linux-gnu/sys/cdefs.h \ 
/usr/include/i386-linux-gnu/bits/wordsize.h \ 
/usr/include/i386-linux-gnu/gnu/stubs.h \ 
/usr/include/i386-linux-gnu/gnu/stubs-32.h \ 
/usr/lib/gcc/i686-linux-gnu/4.8/include/stddef.h \ 
/usr/include/i386-linux-gnu/bits/types.h \ 
/usr/include/i386-linux-gnu/bits/typesizes.h /usr/include/libio.h \ 
/usr/include/_G_config.h /usr/include/wchar.h \ 
/usr/lib/gcc/i686-linux-gnu/4.8/include/stdarg.h \ 
/usr/include/i386-linux-gnu/bits/stdio_lim.h \ 
/usr/include/i386-linux-gnu/bits/sys_errlist.h main.h
```



- -MM 参数实例 - 不包含系统头文件的依赖关系

```shell
$ gcc -MM main.c
main.o: main.c main.h
```



- -MF 参数实例 - 依赖关系被写入main.d中

```shell
$ gcc -MM main.c -MF main.d
$ cat main.d
main.o: main.c main.h
```



- -MT 参数实例 - 目标对象由main.o变为了hello.o

```shell
$ gcc -MM main.c -MT hello.o
hello.o: main.c main.h
```



 