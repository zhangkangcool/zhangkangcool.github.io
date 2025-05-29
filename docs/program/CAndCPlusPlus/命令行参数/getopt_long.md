

https://www.cnblogs.com/hellokitty2/p/9102924.html



# getopt_long()函数



### 1 原型

getopt_long函数包含了getopt函数的功能，并且还可以指定“长参数”（或者说长选项），与getopt函数对比，getopt_long比其多了两个参数。

```c++
#define _GNU_SOURCE
 
#include <getopt.h>
 
extern char *optarg;
 
extern int optind, opterr, optopt;
 
int getopt_long(int argc, char *const argv[], const char *optstring, const struct option *longopts, int *longindex);
int getopt_long_only(int argc, char *const argv[], const char *optstring, const struct option *longopts, int *longindex);
```







getopt_long_only与getopt_long的区别在于：getopt_long仅仅只能将"--"开始的选项视为长选项，但getopt_long_only将"-"开头选项也会视为长选项，当长选项列表均不满足时，且短选项满足时，"-"才会解析为短选项。

only可以使用 `-arg 123`和`--arg 123`，而非only只能用`--arg 123`，建议使用only版。



### 2 描述

1、注意相比getopt，使用getopt_long需要加头文件<getopt.h>;
2、getopt_long除了会接受长选项，其他概念和getopt是一样的；
3、如果使用getopt_long想只接受短选项，设置longopts为NULL即可；如果只想接受长选项，相应地设置optstring为NULL即可；
4、长选项名是可以使用缩写方式，比如：选项有--file\--create,那么输入--c/--cr/--cre等均会被正确识别为create选项；
5、对于带参数的长选项格式是：--arg=param或--arg param；
6、longopts是指向struct option数组的第一个元素的指针，struct option定义在<getopt.h>中；
7、longindex如果非NULL，则是返回识别到struct option数组中元素的位置指针，当前是第几个长选项，一般为空；
8、当所给的参数存在问题时，函数的返回值是'?'。



### 3. struct option

```c++
struct option {
               const char *name;      
               int         has_arg;  // 0/1/2
               int        *flag;
               int         val;   // 返回值，可以是0 1 2 'a' 之类的
           };
```



name: 长选项名
has_arg: 是否带参数或可选参数，这个值在getopt.h中有宏定义，如下：

- define no_argument        0                表明这个长参数不带参数（即不带数值，如：--name）
- define required_argument  1           表明这个长参数必须带参数（即必须带数值，如：--name Bob）
- define optional_argument  2            表明这个长参数后面带的参数是可选的，（即--name和--name Bob均可）

flag: 确定函数返回值的情况，如果flag==NULL，则识别选项后 函数返回val（常用的如：设置val为长命令的短命令字符）；否则，识别后getopt_long返回0，flag指向一个设置到val的变量；
val: 设置为函数返回值，字符常量返回值('m', 'n', 0 , 1, 2, '2'，即ascii )，可以设成数字，如果不想成为短选项，不要设成字母字符，或者是flag指向的变量；这里要注意不要写-1到val，否则其作用是getopt_long返回-1，然后停止解析选项；如果flag是NULL，那么val通常是个字符常量，用于函数的返回值，如果短选项和长选项一致，那么该字符就应该与optstring中出现的这个选项的参数相同；v



`struct option long_options[]`数组的最后一个元素必须是全0填充，否则会报段错误                                                                                                                                                                                                                                                                                                                                                                                   



### 4 返回值

每次调用getopt_long，它会解析一个符号，返回相应的短选项字符，如果解析完毕返回-1
如果getopt_long遇到一个无效的选项字符，它会打印一个错误消息并且返回'?'
当getopt_long解析到一个长选项并且发现后面没有参数则返回':'，表示缺乏参数。

当处理一个参数时，全局变量optarg指向下一个要处理的变量。当getopt_long处理完所有的选项后，全局变
量optind指向第一个未知的选项索引。



### 5 Example

#### 5.1 例1

```c++
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <getopt.h>

int main(int argc, char **argv)
{
   int opt;   // 带回getopt_long的返回值
   int option_index = 0;    // 最后一个参数，获得值

   // short option, if only use long otpion, use NULL.
   char *optstring = "a:b:c:d";

   // long option, if only use short option, use NULL.
   static struct option long_options[] = {  // long option
       {"reqarg", required_argument, NULL, 'r'},   // long_option_index = 0  
       {"noarg",  no_argument,       NULL, 'n'},   // long_option_index = 1
       {"optarg", optional_argument, NULL, 'o'},   // long_option_index = 2
       {"opt1", optional_argument, NULL, '1'},   // long_option_index = 2
       {"opt2", optional_argument, NULL, '2'},   // long_option_index = 2
       {"opt1", optional_argument, NULL, 1},   // long_option_index = 2
       {0, 0, 0, 0}
   };

//   while ((opt = getopt_long(argc, argv, optstring, long_options, &option_index)) != -1)
   while ((opt = getopt_long_only(argc, argv, optstring, long_options, &long_option_index)) != -1)
   {
        printf("opt = %c\n", opt);
        printf("optarg = %s\n", optarg);   // 内置全局变量
        printf("optind = %d\n", optind);   // 内置全局变量
        printf("argv[optind - 1] = %s\n",  argv[optind - 1]);
        printf("option_index = %d\n\n", long_option_index);
   }

   return 0;
}
```





```c++
./test_getopt -a 100 --reqarg 100 --noarg
opt = a
optarg = 100
optind = 3
argv[optind - 1] = 100
option_index = 0
opt = r
optarg = 100
optind = 5
argv[optind - 1] = 100
option_index = 0
opt = n
optarg = (null)
optind = 6
argv[optind - 1] = --noarg
option_index = 1

------------------------------------------
./a.out -a 100 -reqarg 200 --noarg -m   // 没有-m参数，所以会报错
opt = a
optarg = 100
optind = 3
argv[optind - 1] = 100
option_index = 0

opt = r
optarg = 200
optind = 5
argv[optind - 1] = 200
option_index = 0

opt = n
optarg = (null)
optind = 6
argv[optind - 1] = --noarg
option_index = 1

./a.out: unrecognized option '-m'
opt = ?
optarg = (null)
optind = 7
argv[optind - 1] = -m
option_index = 1

```







#### 5.2 例2

```c++
#include <stdio.h>
#include <getopt.h>

int do_name, do_gf_name;
char *l_opt_arg;
static const char *shortopts = "l:ng";

struct option longopts[] = {
  {"name",    no_argument,       NULL, 'n'},
  {"good", no_argument,       NULL, 'g'},
  {"love",    required_argument, NULL, 'l'},
  {0,         0,                 0,      0},
};

int main (int argc, char *argv[])
{
    int c;
    while ((c = getopt_long (argc, argv, shortopts, longopts, NULL)) != -1)
    {   // c是longopts中的
        switch (c)
        {
        case 'n':
            printf ("nnnnn.\n");
            break;
        case 'g':
            printf ("ggggg.\n");
            break;
        case 'l':
            l_opt_arg = optarg;
            printf ("%s!\n", l_opt_arg);
            break;
        case '?':
        default:
            printUsageInfo(); 
            break;      
        }
    }

    return 0;
}
```



```c++
$ ./dd --name
nnnnn.
$ ./dd --good
ggggg.
$ ./dd --love you
you!
```





```

```

