<h1 align="center">call hierarchy</h1>
### 关于call tree有另一个文件进行了介绍

----

# 需要编译

### 使用clang进行编译(需要能编译通过，不需要有main函数，因为clang的输出需要给opt)

https://stackoverflow.com/questions/5373714/how-to-generate-a-calling-graph-for-c-code



```c++
static void D() { }
static void Y() { D(); }
static void X() { Y(); }
static void C() { D(); X(); }
static void B() { C(); }
static void S() { D(); }
static void P() { S(); }
static void O() { P(); }
static void N() { O(); }
static void M() { N(); }
static void G() { M(); }
static void A() { B(); G(); }

int main() {
  A();
}
```





```shell
clang++ -S -emit-llvm main1.cpp -o - | opt -analyze -dot-callgraph

dot -Tpng -o callgraph.png callgraph.dot

clang++ -### -fsyntax-only -S -emit-llvm main1.cpp -o - | opt -analyze -dot-callgraph
```



<img src="call hierarchy.assets/image-20210106140641661.png" alt="image-20210106140641661" style="zoom: 80%;" /><img src="call hierarchy.assets/image-20210106140816237.png" alt="image-20210106140816237" style="zoom: 80%;" />



```shell
clang++ -S -emit-llvm main1.cpp -o - | opt -analyze -std-link-opts -dot-callgraph

cat callgraph.dot | c++filt | sed 's,>,\\>,g; s,-\\>,->,g; s,<,\\<,g' | gawk '/external node/{id=$1} $1 != id' > callgraph_filter.dot

dot -Tpng -o callgraph.png callgraph_filter.dot    
```





----



### 用CodeViz和gcc也可以同样效果

https://www.linuxidc.com/Linux/2015-01/111501.htm 



# cflow + graphviz

https://blog.csdn.net/breaksoftware/article/details/75576878

https://blog.csdn.net/benkaoya/article/details/79751000

```
  我只列出我觉得有意思的几个参数:

        -T输出函数调用树状图

        -m指定需要分析的函数名

        -n输出函数所在行号

        -r输出调用的反向关系图

        --cpp预处理，这个还是很重要的
```



默认只输出main函数

```c++
/* whoami.c - a simple implementation of whoami utility */
#include <pwd.h>
#include <sys/types.h>
#include <stdio.h>
#include <stdlib.h>

int who_am_i(void)
{
    struct passwd *pw;
    char *user = NULL;

    pw = getpwuid (geteuid ());
    if (pw)
        user = pw->pw_name;
    else if ((user = getenv ("USER")) == NULL)
    {
        fprintf (stderr, "I don't know!\n");
        return 1;
    }
    printf ("%s\n", user);
    return 0;
}

int main(int argc, char **argv)
{
    if (argc > 1)
    {
        fprintf (stderr, "usage: whoami\n");
        return 1;
    }
    return who_am_i ();
}
```

运行结果

```c++
# cflow whoami.c 
main() <int main (int argc, char **argv) at whoami.c:24>:
    fprintf()
    who_am_i() <int who_am_i (void) at whoami.c:7>:
        getpwuid()
        geteuid()
        getenv()
        fprintf()
        printf()
```



过滤函数

```shell
# cflow -m who_am_i whoami.c 
who_am_i() <int who_am_i (void) at whoami.c:7>:
    getpwuid()
    geteuid()
    getenv()
    fprintf()
    printf()

```



### 使用`-a`可以输出所有函数信息



#### 1 从文本文件转为dot文件

```shell
cflow whoami.c | tree2dotx > out.dot
```



#### 2 从dot文件转为图片文件

```shell
dot -Tgif out.dot -o out.gif
```



### 其他补充

- cflow默认只分析main函数的call graph，如果main不存在，将分析该文件的所有函数。可以通过 -m 选项分析指定的函数，如果指定的函数不存在，也会分析该文件的所有函数。可以利用这个特点，通过 -m 指定一个空的函数名，让cflow分析所有函数的call graph

```shell
cflow -m= file.c
```



- cflow可以同时分析多个源文件

```
cflow -m= file1.c file2.c
flow -m= *.c
```





