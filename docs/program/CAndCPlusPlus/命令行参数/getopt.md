<h1 align="center">getopt</h1>
bhttps://blog.csdn.net/yzy1103203312/article/details/78278625



# getopt()函数

无法使用长参数

### 1 原型

```c++
#include <unistd.h>
 
extern char *optarg;
extern int optind, opterr, optopt;
int getopt(int argc, char * const argv[], const char *optstring);
```



#### 外部变量：

optarg：若短选项后有参数，则optarg指向该参数
optind：扫描选项时，标识下一个选项的索引；扫描结束后，标识第一个非选项参数索引
opterr：出现不可识别的选项时，getopt将打印错误信息。将opterr设为0,可不打印错误信息。
optopt：存放不可识别的选项至optopt

#### 参数

argc：参数的个数(main)
argv：参数数组(main)
optstring：短选项字符集合，如 -i -n中的i,n
若选项后面有参数，则选项字符后加:， 对应的参数值保存在外部变量optarg中
如optstring 为"i:a",则表示程序支持两个短选项 -i arg和-a, -i后面须有参数值
当执行./a.out -i filename -a时，optarg指针就指向filename



### 2 描述

1. getopt函数的前两个参数，就是main函数的argc和argv，这两者直接传入即可，要考虑的就只剩下第三个参数。

2. optstring的格式举例说明比较方便，例如：

     char *optstring = "abcd:e::";
   上面这个optstring在传入之后，getopt函数将依次检查命令行是否指定了 -a， -b， -c及 -d（这需要多次调用getopt函数，直到其返回-1），当检查到上面某一个参数被指定时，函数会返回被指定的参数名称（即该字母）最后一个参数d后面带有冒号，: 表示参数d是可以指定值的，如 -d 100 或 -d user。字符后带两个':'表示该选项带可选参数(参数可有可无)。

   ```shell
   ./a.out -a -b -c -d 100 -e
   ./a.out -a -b -c -d 100 -e 200    // e是可选参数，可不带参数
   ```

   

3. optind表示的是下一个将被处理到的参数在argv中的下标值。

4. 如果指定opterr = 0的话，在getopt、getopt_long、getopt_long_only遇到错误将不会输出错误信息到标准输出流。





### 3 解析过程

getopt首先扫描argv[1]到argv[argc-1]，并将选项及参数依次放到argv数组的最左边，非选项参数依次放到argv的最后边
即该函数会改变argv的排列顺序。

如执行程序为:

```
     0         1    2    3    4  5    6     7  8   9 
$ ./mygetopt file1 -i infile -a -o outfile -v -h file2
```

扫描过程中，optind是下一个选项的索引（如-i、-a、-o、-v）, 非选项参数将跳过，同时optind增1。optind初始值为1。
当扫描argv[1]时，为非选项参数，跳过，optind=2; 扫描到-i选项时，后面有参数，下一个将要扫描的选项是-a,则optind更改为4；
扫描到-a选项时，下一个选项是-o，optind=5; 扫描到-o选项时，后面有参数，下一个选项是-v,optind=7; 扫描到-v选项时，下一个
选项是-h，optind=8; 扫描到-h选项时，扫描完了，optind=9

扫描结束后，getopt会将argv数组修改成下面的形式(optstring指定为"i:ao:vh")：

```
     0       1    2    3  4    5     6  7   8     9
$./mygetopt -i infile -a -o outfile -v -h file1 file2
```

同时，optind会指向非选项的第一个参数，如上面，optind将指向file1



### 4 返回值

若getopt找到短选项字符，则返回该选项字符，如此例中的i a o v h.
若出现不能接受的选项字符或丢失选项参数，则返回?，同时optopt将被设置成相应选项字符；
则后面没有选项字符，则返回-1



注：
getopt()的返回后，如果有选项参数的话optarg指向选项参数，并且变量optind包含下一个argv参数作为对getopt()下一次调用的索引。
变量optopt保存最后一个由getopt()返回的已知的选项。
在调用getopt()之前，将opterr设置为0，这样就可以在getopt()函数发现错误的时候强制它不输出任何消息。

### 5 Example

#### 5.1 例1

```c++
#include <unistd.h>
#include <stdio.h>
int main(int argc, char * argv[])
{
    
    int ch;
    printf("\n\n");
    printf("optind:%d，opterr：%d\n",optind,opterr);
    printf("--------------------------\n");
       while ((ch = getopt(argc, argv, "ab:c:de::")) != -1)
       {
        printf("optind: %d\n", optind);
           switch (ch) 
        {
               case 'a':
                       printf("HAVE option: -a\n\n");   
                       break;
               case 'b':
                       printf("HAVE option: -b\n"); 
                       printf("The argument of -b is %s\n\n", optarg);
                       break;
               case 'c':
                       printf("HAVE option: -c\n");
                       printf("The argument of -c is %s\n\n", optarg);
                       break;
               case 'd':
                   printf("HAVE option: -d\n");
                     break;
              case 'e':
                    printf("HAVE option: -e\n");
                    printf("The argument of -e is %s\n\n", optarg);
                  break;
              case '?':
                       printf("Unknown option: %c\n",(char)optopt);
                       break;
               }
       }
 
 
}
```



#### 5.2 例2

```c++
static char g_deviceid[32] = {0};

std::string g_serverIP = "172.18.18.18";
static int g_serverPort = 8888;

void PrintHelp(char* prog)
{
    printf("%s usage.\n", prog);
    printf("eg:\n");
    printf("%s -i 172.18.18.18 -p 8888 -s 123456789\n", prog);
    printf("-i: ip address, default: 192.168.1.20\n");
    printf("-p: port number, default: 8888\n");
    printf("-s: serial number, default: 123456789\n");

}
void ParseArg(int argc, char *argv[])
{
    int ch = 0;

    strcpy(g_deviceid, "123456789");

    if (argc == 2)
    {
        if (!strcmp(argv[1], "?") ||
            !strcmp(argv[1], "--help") ||
            !strcmp(argv[1], "-h"))
        {
            PrintHelp(argv[0]);
            exit(0);
        }
    }

    while ((ch = getopt(argc, argv, "i:p:s:")) != -1)
    {
        switch (ch)
        {
        case 'i':
            g_serverIP = optarg;
            break;
        case 'p':
            g_serverPort = atoi(optarg);
            break;
        case 's':
            memcpy(g_deviceid, optarg, 32);
            break;
        case '?':
        default:
            PrintHelp(argv[0]);
            exit(0);
            break;
        }
    }
}
```





#### 5.3 例3

```c++
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
 
int main(int argc, char *argv[])
{
    int opt;
    char *optstring = "a:b:c:d";
 
    while ((opt = getopt(argc, argv, optstring)) != -1)
    {
        printf("opt = %c\n", opt);
        printf("optarg = %s\n", optarg);
        printf("optind = %d\n", optind);
        printf("argv[optind - 1] = %s\n\n",  argv[optind - 1]);
    }
 
    return 0;
}
```





### 5.4 例4

```c++
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <getopt.h>

void print_help(char *program) {
    printf("%s usage.\n", program);
    printf("eg:\n");
    printf("%s --from-core 0 --to-core 29 --not-skip-free\n", program);
    printf("--from-core num: core info start range, default: 0.\n");
    printf("--to-core num: core info end range, default: 29\n");
    printf("--not-skip-free: don't skip those the free core, default is skip free core\n");

}

int main(int argc, char **argv)
{
   unsigned int from_core = 0;
   unsigned int to_core = 20;
   bool skip_free = true;


   int opt = -1;
   int long_option_index = 0;

   // short option, if only use long otpion, use NULL.
   const char *short_opts = "";

   // long option, if only use short option, use NULL.
   static struct option long_options[] = {  // long option
       {"from-core", required_argument, NULL, 'f'},
       {"to-core", required_argument, NULL, 't'},
       {"not-skip-free", optional_argument, NULL, 'n'},
       {0, 0, 0, 0}
   };

//   while ((ret_val = getopt_long(argc, argv, optstring, long_options, &long_option_index)) != -1)
   while ((opt = getopt_long_only(argc, argv, short_opts, long_options, &long_option_index)) != -1)
   { 
        printf("opt = %c\n", opt);
        printf("optarg = %s\n", optarg);
        printf("optind = %d\n", optind);
        printf("argv[optind - 1] = %s\n",  argv[optind - 1]);
        printf("option_index = %d\n\n", long_option_index);

        switch(opt)
        {
        case 'f':
            from_core = atoi(optarg);
            break;

        case 't':
            to_core = atoi(optarg);
            break;

        case 'n':
            skip_free = false;
            break;
        case '?':
        default:
            printf("Argument error.\n\n");
            print_help(argv[0]);
        }
   }

   return 0;
}
```



