https://blog.csdn.net/weixin_30482027/article/details/116578311



# linux 运行命令行参数,linux shell命令行选项与参数用法详解



##  1. 综述

问题描述：在[linux](https://so.csdn.net/so/search?q=linux&spm=1001.2101.3001.7020) shell中如何处理tail -n 10 access.log这样的命令行选项？

在bash中，可以用以下三种方式来处理命令行参数，每种方式都有自己的应用场景。

1. 直接处理，依次对$1,$2,...,$n进行解析，分别手工处理；

2. getopts来处理，单个字符选项的情况(如：-n 10 -f file.txt等选项)；

3. getopt，可以处理单个字符选项，也可以处理长选项long-option(如：--prefix=/home等)。

总结：小脚本手工处理即可，getopts能处理绝大多数的情况，getopt较复杂、功能也更强大。



## 2. 命令行的三种处理方式

### 2.1 直接手工处理位置参数

必须要要知道几个变量，

```
$0：即命令本身，相当于c/c++中的argv[0]
$1：第一个参数, $2, $3, $4 ... ：第2、3、4个参数，依次类推。
$#: 参数的个数，不包括命令本身
$@: 参数本身的列表，也不包括命令本身


*和@相同，"*"和"@"（加引号）并不同，"*"将所有的参数解析成一个字符串，面"@"是一个参数数组。
```



手工处理方式能满足多数的简单需求，配合shift使用也能构造出强大的功能，但处理复杂选项时建议用下面的两种方法。

例子，(getargs.sh)：

```shell
#!/bin/bash

if [ $# -lt 1 ]; then
  echo "error.. need args"
  exit 1
fi

echo "commond is $0"
echo "args are:"
for arg in "$@"
do
  echo $arg
done
```



运行命令：

```shell
./getargs.sh 11 22 zk
commond is ./getargs.sh
args are:
11
22
zk
```



### 2.2 getopts (shell内置命令)



getopts被shell程序用来分析位置参数，optstring包含需要被识别的选项字符，如果这里的字符后面跟着一个冒号，表明该字符选项需要一个参数，其参数需要以空格分隔。冒号和问号不能被用作选项字符。getopts每次被调用时，它会将下一个选项字符放置到变量name中。

变量OPTIND是下一个要被处理的位置参数的索引，初始值为1。shell不会自动的复位OPTIND，如果想再次对位置参数进行分析，则需要手动对OPTIND进行复位。当选项需要参数时，getopts将参数放置在变量OPTARG中。

当所有的位置参数分析结束，getopts退出并返回一个大于0的值，OPTIND变为首个不是选项的位置参数的索引，name被置为'?'。默认情况下getopts会去分析传入的位置参数，但如果args有值，则只会分析args里的参数，args只支持形如-abc形式。

如果遇到错误，getopts会打印出错误信息，但如果optstring第一个字符是冒号，或者变量OPTERR被置为0（此项只是不打印错误信息，不会在出错后设置OPTARG的值），则会进入静默模式，不会打印错误信息。遇到的错误通常有两种情况：
1、无效的选项，此时name会被置为'?'。静默模式下，会将此无效选项置于OPTARG。非静默模式，打印错误信息，并且unset OPTARG。
2、选项需要的参数未提供，静默模式下，name会被置为':'，无效选项会置于OPTARG。非静默模式，name被置为'?'，unset OPTARG并打印出错信息。

getopts如果遇到一个选项（无论是否有效），返回true(0)。如果遇到结束或者产生错误，返回false



处理命令行参数是一个相似而又复杂的事情，为此，c提供了getopt/getopt_long等函数，c++的boost提供了options库，在shell中，处理此事的是getopts和getopt。

getopts/getopt的区别，getopt是个外部binary文件，而getopts是shell builtin。

复制代码 代码示例:

```shell
[root@jbxue ~]$ type getopt

getopt is /usr/bin/getopt

[root@jbxue ~]$ type getopts

getopts is a shell builtin
```



getopts不能直接处理长的选项(如：--prefix=/home等)

关于getopts的使用方法，可以man bash 搜索getopts

getopts有两个参数，第一个参数是一个字符串，包括字符和“：”，每一个字符都是一个有效的选项，如果字符后面带有“：”，表示这个字符有自己的参数。getopts从命令中获取这些参数，并且删去了“-”，并将其赋值在第二个参数中，如果带有自己参数，这个参数赋值在“optarg”中。提供getopts的shell内置了optarg这个变变，getopts修改了这个变量。

```
optarg: 存储相应选项的参数，
optind: 总是存储原始参数列表中下一个要处理的元素位置。
```





`while getopts ":a:bc" opt`  : 第一个冒号表示忽略错误；字符后面的冒号表示该选项必须有自己的参数

```shell
#!/bin/bash

# echo $*
# echo $@

while getopts "a:bc" opt
do
  case $opt in
    a ) echo $OPTARG
        echo $OPTIND;;
    b ) echo "b $OPTIND";;
    c ) echo "c $OPTIND";;
    ? ) echo "error"
        exit 1;;
  esac
done

echo $OPTIND


# 通过shift $(($OPTIND - 1))的处理
# $*中就只保留了除去选项内容的参数，可以在其后进行正常的shell编程处理了
shift $(($OPTIND - 1))

echo $0  #  ./getopts.sh
echo $*

```

复制代码 代码示例:

```shell
 ./getopts.sh -a 11 -b -c
11
3
b 4
c 5
5
./getopts.sh
```





### 2.3 getopt(一个外部工具)

https://www.cnblogs.com/lxhbky/p/14189189.html

https://blog.csdn.net/weixin_43999327/article/details/118968405



```shell
-o: 表示短选项，两个冒号表示该选项有一个可选参数，可选参数必须紧贴选项，如-carg 而不能是-c arg
--long: 表示长选项
```

例子，(getopt.sh)：

复制代码 代码示例:

\#!/bin/bash

\# a small example program for using the new getopt(1) program.

\# this program will only work with bash(1)

\# an similar program using the tcsh(1) script. language can be found

\# as parse.tcsh

\# example input and output (from the bash prompt):

\# ./parse.bash -a par1 'another arg' --c-long 'wow!*\?' -cmore -b " very long "

\# option a

\# option c, no argument

\# option c, argument `more'

\# option b, argument ` very long '

\# remaining arguments:

\# --> `par1'

\# --> `another arg'

\# --> `wow!*\?'

\# note that we use `"$@"' to let each command-line parameter expand to a

\# separate word. the quotes around `$@' are essential!

\# we need temp as the `eval set --' would nuke the return value of getopt.

\#-o表示短选项，两个冒号表示该选项有一个可选参数，可选参数必须紧贴选项

\#如-carg 而不能是-c arg

\#--long表示长选项

\#"$@"在上面解释过

\# -n:出错时的信息

\# -- ：举一个例子比较好理解：

\#我们要创建一个名字为 "-f"的目录你会怎么办？

\# mkdir -f #不成功，因为-f会被mkdir当作选项来解析，这时就可以使用

\# mkdir -- -f 这样-f就不会被作为选项。

temp=`getopt -o ab:c:: --long a-long,b-long:,c-long:: \

-n 'example.bash' -- "$@"`

if [ $? != 0 ] ; then echo "terminating..." >&2 ; exit 1 ; fi

\# note the quotes around `$temp': they are essential!

\#set 会重新排列参数的顺序，也就是改变$1,$2...$n的值，这些值在getopt中重新排列过了

eval set -- "$temp"

\#经过getopt的处理，下面处理具体选项。

while true ; do

case "$1" in

-a|--a-long) echo "option a" ; shift ;;

-b|--b-long) echo "option b, argument \`$2'" ; shift 2 ;;

-c|--c-long)

\# c has an optional argument. as we are in quoted mode,

\# an empty parameter will be generated if its optional

\# argument is not found.

case "$2" in

"") echo "option c, no argument"; shift 2 ;;

*) echo "option c, argument \`$2'" ; shift 2 ;;

esac ;;

--) shift ; break ;;

*) echo "internal error!" ; exit 1 ;;

esac

done

echo "remaining arguments:"

for arg do

echo '--> '"\`$arg'" ;

done

运行命令：

复制代码 代码示例:

./getopt.sh --b-long abc -a -c33 remain

option b, argument `abc'

option a

option c, argument `33'

remaining arguments:

--> `remain'

