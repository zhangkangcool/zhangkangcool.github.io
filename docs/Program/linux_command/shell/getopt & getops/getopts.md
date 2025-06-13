<h1 align="center">getopts</h1>
# getops命令（只支持短选项，shell内置）



值得一提的是冒号 (:)
在 OPTSTRING 中，冒号有两种含义：

1. 首位的 : 表示「不打印错误信息」
2. 紧邻字母（选项名字）的 : 表示该选项接收一个参数。



getopts是另一个解析命令行参数的工具。它是Bash的内部命令。
它的优势在于：

1. 不需要通过一个外部程序来处理位置参数
2. 可以很容易地设置用来解析的Shell变量
3. getopts 定义在 POSIX 中



不支持长选项

```shell
getopts 不能解析 GUN 风格的长选项（–long），也不能解析 XF86 风格的长选项（-long）
```

getopt 是将选项和参数处理后只生成一个输出。我们还要用 set 来完成传递的工作。
getopts 能够和已有的shell参数变量配合默契。每次调用时，一次只处理命令行上检测到的一个参数。处理之后，它会退出并返回一个大于0的退出状态码。这样就非常方便的可以在while循环中使用。

### 基本用法
getopts 会使用到一下3个变量：

```shell
OPTIND: 存放下一个要处理的参数的索引。这是 getopts 在调用过程中记住自己状态的方式。
OPTARG: 由 getopts 找到的选项所对应的参数。
OPTERR: 值为0或1。指示Bash是否应该显示由 getopts 产生的错误信息。
```



getopts 命令的基本语法：

```shell
getopts 选项字符串 名称 [参数]
```

```shell
选项字符串（OPTSTRING）：getopts 会有哪些选项，哪些是有参数的（选项后有冒号）
名称（VARNAME）：getopts 会将找到的选项赋值给这个名称的变量
参数（ARGS）：一般情况向缺省，getopts会去解析脚本调用时的所有的参数。如果执行了这个参数，getopts就不解析传递给脚本的参数了，而是解析这里的参数。
```



getopts 不会移动变量。在处理完所有的选项后，命令就会停止，并将参数留给我们来继续处理。此时可以先用shit命令配合OPTIND的值来移动到第一个参数的位置：

```shell
shift $[ $OPTIND - 1 ]
```



#### 错误报告模式
getopts命令支持两种错误报告模式：

1. 详细错误报告模式
2. 抑制错误报告模式

#### 详细错误报告模式
在详细错误报告模式下，如果 getopts 遇到了一个无效的选项，VARNAME 的值会被设置为问号（?），并且变量 OPTARG 不会被设置。如果需要的参数没找到，VARNAME的值也会被设置为问号（?），变量 OPRARG 也不会被设置，并且会打印一个错误信息。

#### 抑制错误报告模式
在抑制错误报告模式下，如果 getopts 遇到一个无效的选项，VARNAME 的值会被设置为问号（?），并且变量 OPTARG 会被设置为选项字符。如果需要的参数没找到，VARNAME的值会被设置为冒号（:），并且变量 OPTARG 中会包含选项字符。
要使用抑制错误报告模式，只需要在调用 getopts 时，设置选项字符串（OPTSTRING）时以冒号开头即可。下面的例子用的就是一直错误报告模式。



## 示例代码
这里使用抑制错误报告模式，所以需要自己分析并且报告解析错误。都在代码里了：

```shell
$ cat say_hello.sh 
#!/bin/bash
defaultname="nobody"  # 默认的名字
declare -a names      # 存放名字的数组
hello="hello"         # 打招呼的用语
end="!"               # 结束的内容
tittle=off            # 是否首字母大写
# 解析选项
while getopts :n:h:e:t opt
do
    case "$opt" in
        n) defaultname="$OPTARG" ;;
        h) hello="$OPTARG" ;;
        e) end="$OPTARG" ;;
        t) tittle=on ;;
        :)  # 没有为需要参数的选项指定参数
            echo "This option -$OPTARG requires an argument."
            exit 1 ;;
        ?) # 发现了无效的选项
            echo "-$OPTARG is not an option"
            exit 2 ;;
    esac
done
# 解析参数
shift $[ $OPTIND -1 ]  # 移动到第一个参数的位置
# 这次用for循环遍历
for arg in "$@"
do
    names=("${names[@]}" "$arg")
done
names[0]=${names[0]:-$defaultname}
for name in "${names[@]}"
do
    [ "$tittle" = on ] && output="${hello^} ${name^} $end" || output="$hello $name $end"
    echo "${output}"
done
$ 
```

执行结果如下：

```shell
$ ./say_hello.sh 
hello nobody !
$ ./say_hello.sh -n adam
hello adam !
$ ./say_hello.sh -n adam -h hi -e. -t
Hi Adam .
$ ./say_hello.sh -h hi -e. -t adam bob clark
Hi Adam .
Hi Bob .
Hi Clark .
$ ./say_hello.sh -a -h hi -e. -t adam bob clark
-a is not an option
$ ./say_hello.sh -h
This option -h requires an argument.
```





```shell
$ ./say_hello.sh adam
hello adam !
$ ./say_hello.sh adam -t
hello adam !
hello -t !
```





```shell
$ ./say_hello.sh -t adam
Hello Adam !
$ ./say_hello.sh -t -- adam
Hello Adam !
```



比较下来，使用起来会比getopt方便很多，不过功能上也差了很多，可选参数（双冒号::）应该也是不支持的。另外，如果熟悉getopt的话，每一步的操作都是自己的代码控制的。而getopts就简化了很多地方，比如不会调用shift移动变量。

