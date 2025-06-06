<h1 align="center">getopt_long2</h1>
https://blog.csdn.net/lx123010/article/details/105972533



getopt_long支持长选项的命令行解析，函数中的参数argc和argv通常直接从main()的两个参数传递而来。

头文件
#include<getopt.h>

函数原型
int getopt_long(int argc,char * const argv[],const char *optstring,const struct option *longopts,int *longindex)

函数说明
getopt函数只能处理短选项，但是getopt_long除了接受短选项外还接受长选项，长选项以"--"开头。

如果程序只接受长选项，那么optstring应指定为空字符串。

长选项可以采用两种形式：--arg=param或--arg param.

longopts是一个指针指向结构体option数组。

 

参数以及返回值介绍（以上三个函数都适用）：

1、argc和argv和main函数的两个参数一致。

2、optstring: 表示短选项字符串。
    形式如“a:b::cd:“，分别表示程序支持的命令行短选项有-a、-b、-c、-d，冒号含义如下：
    (1)只有一个字符，不带冒号——只表示选项， 如-c
    (2)一个字符，后接一个冒号——表示选项后面带一个参数，如-a 100
    (3)一个字符，后接两个冒号——表示选项后面带一个可选参数，即参数可有可无，如果带参数，则选项与参数直接不能有空格
        形式应该如-b200

eg：

char*optstring = “ab:c::”;
单个字符a         表示选项a没有参数            格式：-a即可，不加参数
单字符加冒号b:     表示选项b有且必须加参数      格式：-b 100或-b100,但-b=100错
单字符加2冒号c::   表示选项c可以有，也可以无     格式：-c200，其它格式错误
3、参数longopts：表示长选项结构体。结构如下：

 

struct option {
const char *name; //name表示的是长参数名
int has_arg； 
//has_arg有3个值，no_argument(或者是0)，表示该参数后面不跟参数值
// required_argument(或者是1),表示该参数后面一定要跟个参数值
// optional_argument(或者是2),表示该参数后面可以跟，也可以不跟参数值
int *flag;
//用来决定，getopt_long()的返回值到底是什么。如果flag是null，则函数会返回与该项option匹配的val值
int val; //和flag联合决定返回值
} 
eg：

static struct option longOpts[] = {
      { "daemon", no_argument, NULL, 'D' },
      { "dir", required_argument, NULL, 'd' },
      { "out", required_argument, NULL, 'o' },
      { "log", required_argument, NULL, 'l' },
      { "split", required_argument, NULL, 's' },
      { "http-proxy", required_argument, &lopt, 1 },
      { "http-user", required_argument, &lopt, 2 },
      { "http-passwd", required_argument, &lopt, 3 },
      { "http-proxy-user", required_argument, &lopt, 4 },
      { "http-proxy-passwd", required_argument, &lopt, 5 },
      { "http-auth-scheme", required_argument, &lopt, 6 },
      { "version", no_argument, NULL, 'v' },
      { "help", no_argument, NULL, 'h' },
      { 0, 0, 0, 0 }
    };
(1)name:表示选项的名称,比如daemon,dir,out等。

  (2)has_arg:表示选项后面是否携带参数。该参数有三个不同值，如下：
           a: no_argument(或者是0)时 ——参数后面不跟参数值，eg: --version,--help
           b: required_argument(或者是1)时 ——参数输入格式为：--参数 值 或者 --参数=值。eg:--dir=/home
           c: optional_argument(或者是2)时  ——参数输入格式只能为：--参数=值

  (3)flag:这个参数有两个意思，空或者非空。

           a:如果参数为空NULL，那么当选中某个长选项的时候，getopt_long将返回val值。
                   eg，可执行程序 --help，getopt_long的返回值为h.             
           b:如果参数不为空，那么当选中某个长选项的时候，getopt_long将返回0，并且将flag指针参数指向val值。
    
                   eg: 可执行程序 --http-proxy=127.0.0.1:80 那么getopt_long返回值为0，并且lopt值为1。

  (4)val：表示指定函数找到该选项时的返回值，或者当flag非空时指定flag指向的数据的值val。


4、longindex：longindex非空，它指向的变量将记录当前找到参数符合longopts里的第几个元素的描述，即是longopts的下标值。

5、全局变量：

        （1）optarg：表示当前选项对应的参数值。
    
        （2）optind：表示的是下一个将被处理到的参数在argv中的下标值。
    
        （3）opterr：如果opterr = 0，在getopt、getopt_long、getopt_long_only遇到错误将不会输出错误信息到标准输出流。opterr在非0时，向屏幕输出错误。
    
        （4）optopt：表示没有被未标识的选项。

#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <getopt.h>

int
main(int argc, char **argv)
{
   int opt;
   int digit_optind = 0;
   int option_index = 0;
   char *optstring = "a:b:c:d";
   static struct option long_options[] = {
       {"reqarg", required_argument, NULL, 'r'},
       {"noarg",  no_argument,       NULL, 'n'},
       {"optarg", optional_argument, NULL, 'o'},
       {0, 0, 0, 0}
   };

   while ( (opt = getopt_long(argc, argv, optstring, long_options, &option_index)) != -1)
   {
        printf("opt = %c\n", opt);
        printf("optarg = %s\n", optarg);
        printf("optind = %d\n", optind);
        printf("argv[optind - 1] = %s\n",  argv[optind - 1]);
        printf("option_index = %d\n", option_index);
   }

   return 0;
}

#./test_getopt_long -a 100 --reqarg 100 --nonarg
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

./test_getopt_long: unrecognized option '--nonarg'
opt = ?
optarg = (null)
optind = 6
argv[optind - 1] = --nonarg
option_index = 0

 当所给的参数存在问题时，opt（即函数返回值是'?'）

6、返回值：

         （1）如果短选项找到，那么将返回短选项对应的字符。
    
         （2）如果长选项找到，如果flag为NULL，返回val。如果flag不为空，返回0
    
         （3）如果遇到一个选项没有在短字符、长字符里面。或者在长字符里面存在二义性的，返回“？”
    
         （4）如果解析完所有字符没有找到（一般是输入命令参数格式错误，eg： 连斜杠都没有加的选项），返回“-1”
         （5）如果选项需要参数，忘了添加参数。返回值取决于optstring，如果其第一个字符是“：”，则返回“：”，否则返回“？”。

注意：

        （1）longopts的最后一个元素必须是全0填充，否则会报段错误
    
        （2）短选项中每个选项都是唯一的。而长选项如果简写，也需要保持唯一性。


实例如下：

#include <stdio.h>
#include <getopt.h>
char *l_opt_arg;
char* const short_options = "nbl:";

struct option long_options[] = {
	{ "name", 0, NULL, 'n' },
	{ "bf_name", 0, NULL, 'b' },
	{ "love", 1, NULL, 'l' },
	{ 0, 0, 0, 0},
};

int main(int argc, char *argv[])
{
	int c;
	while((c = getopt_long (argc, argv, short_options, long_options, NULL)) != -1)
	{
		switch (c)
		{
			case 'n':
				printf("My name is XL./n");
				break;
			case 'b':
				printf("His name is ST./n");
				break;
			case 'l':
				l_opt_arg = optarg;
				printf("Our love is %s!/n", l_opt_arg);
				break;
		}
	}
		return 0;
}

