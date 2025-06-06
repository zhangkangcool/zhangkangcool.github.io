<h1 align="center">getopt</h1>
https://blog.csdn.net/weixin_43999327/article/details/118968405

# Shell命令 getopt用法详解 命令行参数

在[Linux](https://so.csdn.net/so/search?q=Linux&spm=1001.2101.3001.7020) bash中，可以用以下三中方式解析命令行参数：

- 直接处理：使用`$1`、`$2`、`$3`… 进行解析

- getopts：短选项的情况，例如：`-n 10 -f file.txt`

- getopt：处理`短选项`或者`长选项`，例如：`--perfix=/home`等

  

## 1 直接处理

```c++
$0   #即命令本身，相当于c/c++中的argv[0]
$1   #第一个参数
$2, $3, $4 ...   #第2、3、4个参数，依次类推
$#   #参数的个数，不包括命令本身
$@   #参数本身的列表，不包括命令本身
$*   #和$@相同，但"$*"和"$@"(加引号)并不同，
     #"$*"将所有的参数解释成一个字符串，而"$@"是一个参数数组
```





##  2. getopt命令可解析长命令

```shell
$ getopt --help

用法：
 getopt optstring parameters
 getopt [options] [--] optstring parameters
 getopt [options] -o|--options optstring [options] [--] parameters

选项：
 -a, --alternative            允许长选项以 - 开始
 -h, --help                   这个简短的用法指南
 -l, --longoptions <长选项>  要识别的长选项
 -n, --name <程序名>         将错误报告给的程序名
 -o, --options <选项字符串>  要识别的短选项
 -q, --quiet                  禁止 getopt(3) 的错误报告
 -Q, --quiet-output           无正常输出
 -s, --shell <shell>          设置 shell 引用规则
 -T, --test                   测试 getopt(1) 版本
 -u, --unquoted               不引用输出
 -V, --version                输出版本信息
```



### 2.1 简单格式

```c++
getopt optstring parameters
```

第一部分是命令名。
第二部分optstring（选项字符串），是这个命令解析的格式。
第三部分parameters（getopt命令的参数），就是需要解析的内容。
因此，getopt会按照 optstring 的设置，将 parameters 解析为相应的选项和参数。参考示例来理解：

```c++
第一部分是命令名。
第二部分optstring（选项字符串），是这个命令解析的格式。
第三部分parameters（getopt命令的参数），就是需要解析的内容。
因此，getopt会按照 optstring 的设置，将 parameters 解析为相应的选项和参数。参考示例来理解：
```



主要理解`ab:cd`的意义

这里定义的都是短选项，4个字母代表有4个选项。b后面的冒号表示这个选项需要一个参数。如果不给选项b一个参数，就会报错：

```shell
getopt ab:cd -ad value1 -b
getopt：选项需要一个参数 -- b
 -a -d -- value1
```



#### 2.1.1 使用双破折线

如果添加了双破折线，那么无轮后面是什么，都会作为参数而不是选项来处理：

```shell
getopt ab:cd -- -ad value1 -b best1 value2 value3
 -- -ad value1 -b best1 value2 value3
getopt ab:cd -ad value1 -- -b best1 value2 value3
 -a -d -- value1 -b best1 value2 value3
```

这依然是是命令用法的`第一种格式`，双破折线是parameters内容的一部分。

双破折线出现位置之前的内容按照optstring的设置来解析，之后的内容一律认为是参数。即使有类似选项的内容，被认作为是参数。



#### 2.1.2 参数包含空格的问题

第一种格式和第二、第三种在功能上也是有区别的。这里输出的参数都是不带引号的。而另外两种格式输出的参数都是带引号的。

重要的区别不在引号上，而是这种用法不支持处理带空格和引号的参数值。它会将空格当作参数分隔符，而不是根据双引号将二者当作一个参数。



#### 2.1.3 支持行长选项

```shell
getopt -o ab:cd --long arga,argb:,argc,argd -- -ad -b best --argd value1 value2
 -a -d -b 'best' --argd -- 'value1' 'value2'
```

这是命令用法的第三种格式



`-o`表示定义短选项

–long 其实是–longoptions，不过省略任意个字母程序都能认识。或者也可以用-l。这个是指定长选项的。所有内容都要连起来，不能有空格。选项之间用逗号隔开。定义完之后，在用双破折号隔开，后面的内容就是parameters。





#### 错误报告引用的程序名

```shell
getopt ab:cd -ad value1 -b
getopt：选项需要一个参数 -- b
 -a -d -- value1
```

这里错误报告的是getopt错误，可以把这个默认的内容替换掉。一般是换成执行的脚本的名字。

这里使用命令用法的`第二种格式`，把 optstring 和 parameters 都放到双破折线后面：

```shell
getopt -- ab:cd -ad value1 -b best1
 -a -d -b 'best1' -- 'value1'
```



这样在双破折线前面就可加getopt命令的选项，这里要指定-n选项：

```shell
$ getopt -n test.sh -- ab:cd -ad value1 -b 
test.sh：选项需要一个参数 -- b
 -a -d -- 'value1'
```



这里看到包裹错误是，名字已经被替换掉了。
在脚本中，可以使用 `$(basename $0)`或者直接用`$0`。

**禁止错误报告**

还有一个-q参数，可以禁止错误报告，解析错误的选项和参数将被丢弃：

```shell
$ getopt -n test.sh -q -- ab:cd -ad value1 -b 
 -a -d -- 'value1'
```



**可选参数**

还有一种可选参数，使用两个冒号。这个选项可以有一个或零个参数：

```shell
$ getopt -o a::bc: -l arga::,argb,argc: -- -a value1 --arga value2
 -a '' --arga '' -- 'value1' 'value2'
$ getopt -o a::bc: -l arga::,argb,argc: -- -avalue1 --arga=value2
 -a 'value1' --arga 'value2' --
```



#### 在脚本中使用 getopt

现在已经可以用getopt命令，将命令行参数按照规定的格式解析成规整的格式了。并且在解析过程中，还能发现参数格式错误的情况并报告。
接下来就是在脚本中使用经过getopt命令解析后的参数了。

#### set 命令

要在脚本中使用getopt。首先，要用getopt命令生成格式化后的版本来替换已有的命令行选项和参数。需要用到set命令。
set命令能够处理shell中的各种变量。具体不展开，这里只用了这个命令的一个选项，双破折线（--）。效果是将命令行参数替换成set命令的参数值。
然后，该方法会将原始脚本的命令行参数传给getopt命令执行，之后再将getopt命令的输出传给set命令，用getopt格式化后的命令行参数来替换原始的命令行参数：

```shell
set -- $(getopt ab:cd "$@")
```

现在原始的命令行参数变量的值会被getopt命令的输出替换。而getopt已经为我们格式化好了命令行参数。



#### 直接使用

在之前编写的脚本的基础上，只要在开头加上一行代码，就可以直接使用了：

```shell
set -- $(getopt a:b:s:u "$@")
```

加上这句后，就是让后续的代码处理getopt返回的参数，而不是调用命令时的命令行参数。
验证效果:

```shell
$ ./format.sh -u -a after -b befor value1 value2 value3
BEFOR_VALUE1_AFTER
BEFOR_VALUE2_AFTER
BEFOR_VALUE3_AFTER
$ ./format.sh -u -a after -b befor value1 "value2 value3" value4
BEFOR_VALUE1_AFTER
BEFOR_VALUE2_AFTER
BEFOR_VALUE3_AFTER
BEFOR_VALUE4_AFTER
```



第二条命令并不能处理带空格的参数，因为这里使用的是getopt的第一种格式。

### 使用第二种格式来解析

要处理空格，就需要使用第二种格式（或者第三种），将命令修改为如下：

```shell
set -- $(getopt -- a:b:s:u "$@")
```



简单的在最前面加上双破折线就好了。这条语句是错误的，后面还要修改。

再来验证一下：

```shell
$ ./format.sh -u -a after -b befor value1 "value2 value3" value4
'BEFOR'_'VALUE1'_'AFTER'
'BEFOR'_'VALUE2_'AFTER'
'BEFOR'_VALUE3'_'AFTER'
'BEFOR'_'VALUE4'_'AFTER'
```



使用第二、第三种格式，会用引号来限定参数的内容。但是引号干扰了set命令。

使用 eval 命令
这里出现了一个新的问题，不但没有正确的处理空格，输出的内容还有额外的引号。空格的问题先放一放，这里需要用到eval命令来解决新问题。

eval 命令用于将其后的内容作为单个命令读取和执行，这里用于处理getopt命令生成的参数的转义字符。

关于eval命令，还有一种使用的情景。有时候在脚本中拼接出来的字符串即使打印出来看正确。并且直接复制、粘贴在交互界面中也能正确读被当做命令运行。但是却无法在脚本中被执行。这个时候就可以使用eval命令来解决。它能够把字符串当做命令来执行。
在脚本中通过各种引用和判断拼接出一个复杂的命令的时候，有时候就会出现无法执行的情况。这时候就直接赋值、粘贴去交换界面试一下，如果拼接的结果本身没问题，那么加上eval命令后，应该就能用运行。

修改命令如下：

```shell
eval set -- $(getopt -- a:b:s:u "$@")
```

```shell
$ ./format.sh -u -a after -b befor value1 "value2 value3" value4
BEFOR_VALUE1_AFTER
BEFOR_VALUE2 VALUE3_AFTER
BEFOR_VALUE4_AFTER
```



### 解决空格问题

只要能正确的使用getopt的第二种或第三种格式，那么参数包含空格的问题也就解决了。看上一小节。

### 参数解析错误并退出

执行命令时，使用错误的参数，当前的效果如下：

```shell
$ ./format.sh -u -w -a after -b befor value1 "value2 value3" value4
getopt：无效选项 -- w
BEFOR_VALUE1_AFTER
BEFOR_VALUE2 VALUE3_AFTER
BEFOR_VALUE4_AFTER
```



解析发现问题了，并且报告了，但是脚本没有终止，而是继续执行。如果要判断出解析错误，就需要使用$?参数。然后退出脚本则是用exit命令。
这里直接直接使用$?并无法获取到参数解析错误的结果。因为此时的结果是set命令（也可能是eval命令）的执行结果，而getopt是再前一条的命令。
解决这个问题，要先把getopt命令执行一遍，进行判断。然后再用set调用一遍，可以直接使用之前执行的结果：

```shell
getopt_cmd=$(getopt -n $(basename $0) -- a:b:s:u "$@")
[ $? -ne 0 ] && exit 1
eval set -- "$getopt_cmd"
```



这里还加上了报告错误时名称的定义。exit退出时也要指定退出状态为非0，因为是运行错误。

验证效果：

```shell
$ ./format.sh -v -a after -w -b
format.sh：无效选项 -- v
format.sh：无效选项 -- w
format.sh：选项需要一个参数 -- b
$ echo $?
1
```



完整的代码示例
这里加上长选项以及可选参数的功能。
多加了一个参数 -m, --mark 由于指定使用什么连接符：

默认直接连，不使用连接符号
加上选项，默认使用下划线连接
为选项加上参数后，则使用参数来连接
参数比较多，加了 -h, --help 选项打印参数说明。

完整代码如下：

```shell
$ cat format.sh
#!/bin/bash
mark=""      # 连接符号
prefix=""    # 前缀
base="test"  # 默认字符串
suffix=""    # 后缀
upper=off    # 是否大写
# 显示声明一下这是个数组变量，其实没有必要
declare -a names  # 需要格式化输出的所有原始字符串
# 打印的帮助信息
help_str="
参数说明：
  -h, --help:           打印帮助信息
  -m, --mark [连接符]:  使用连接符，默认是下划线（_），可以指定
  -a, --after string:   添加后缀
  -b, --befor string:   添加前缀
  -s, --string string:  指定中间的字符串，默认是“test”
  -u, --upper:          全大写输出
"
# 解析命令行参数
getopt_cmd=$(getopt -o m::ha:b:s:u --long mark::,help,after:,befor:,string:,upper -n $(basename $0) -- "$@")
[ $? -ne 0 ] && exit 1
eval set -- "$getopt_cmd"
# 解析选项
while [ -n "$1" ]
do
    case "$1" in
        -m|--mark)
            case "$2" in
                "")
                    mark="_"
                    shift ;;
                *)
                    mark="$2"
                    shift ;;
            esac
            ;;
        -h|--help)
            echo -e "$help_str"
            exit ;;
        -a|--after)
            suffix="$2"
            shift ;;
        -b|--befor)
            prefix="$2"
            shift ;;
        -s|--string)
            base="$2"
            shift ;;
        -u|--upper)
            upper=on ;;
        --) shift
            break ;;
         *) echo "$1 is not an option"
            exit 1 ;;  # 发现未知参数，直接退出
    esac
    shift
done
# 解析参数
while [ -n "$1" ]
do
    names=("${names[@]}" "$1")
    shift
done
names[0]=${names[0]:-$base}
for name in "${names[@]}"
do
    # 添加前缀和后缀
    output="${prefix:+${prefix}${mark}}${name}${suffix:+${mark}${suffix}}"
    # 判断是否要全大写输出
    if [ $upper = on ]
    then
        output=${output^^}
    fi
    # 输出结果
    echo "$output"
done
$ 
```



验证效果

```shell
$ ./format.sh -a after -b befor VALUE1 "VALUE2 VALUE3" VALUE4
beforVALUE1after
beforVALUE2 VALUE3after
beforVALUE4after
$ ./format.sh -a after -b befor --mark 
befor_test_after
$ ./format.sh -a after -b befor --mark="||" -u
BEFOR||TEST||AFTER
$ ./format.sh -a after -b befor --mark="||" -u --help

参数说明：
  -h, --help:           打印帮助信息
  -m, --mark [连接符]:  使用连接符，默认是下划线（_），可以指定
  -a, --after string:   添加后缀
  -b, --befor string:   添加前缀
  -s, --string string:  指定中间的字符串，默认是“test”
  -u, --upper:          全大写输出
```







