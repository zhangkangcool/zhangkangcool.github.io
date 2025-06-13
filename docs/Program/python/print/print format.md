<h1 align="center">print format</h1>
# print.format

此方法是推荐方法

```python
print("...{索引}, ... , {索引}, ...".format(值1, 值2))
#索引{}为空，默认按照顺序取值
print("...{key1}, ... , {key2}, ...".format(key1=value,key2=value))
name='xiaoming'
age=12
print('My name is {}, My age is {}'.format(name,age))
print('My name is {0}, My age is {1}'.format(name,age))
print('My name is {name}, My age is {age}'.format(name='xiaoming',age=12))

```



https://www.cnblogs.com/qinchao0317/p/10699717.html









# format用法

 相对基本格式化输出采用‘%’的方法，format()功能更强大，该函数把字符串当成一个模板，通过传入的参数进行格式化，并且使用大括号‘{}’作为特殊字符代替‘%’

## 位置匹配

　　（1）不带编号，即“{}”

　　（2）带数字编号，可调换顺序，即“{1}”、“{2}”

　　（3）带关键字，即“{a}”、“{tom}”

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

![复制代码](https://common.cnblogs.com/images/copycode.gif)

```asm
 1 >>> print('{} {}'.format('hello','world'))  # 不带字段
 2 hello world
 3 >>> print('{0} {1}'.format('hello','world'))  # 带数字编号
 4 hello world
 5 >>> print('{0} {1} {0}'.format('hello','world'))  # 打乱顺序
 6 hello world hello
 7 >>> print('{1} {1} {0}'.format('hello','world'))
 8 world world hello
 9 >>> print('{a} {tom} {a}'.format(tom='hello',a='world'))  # 带关键字
10 world hello world
```

![复制代码](https://common.cnblogs.com/images/copycode.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif)![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif) 通过位置匹配

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif)![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif) 通过名字匹配

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif)![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif) 通过对象属性匹配

![img](https://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif)![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif) 通过下标或key匹配参数

 

## 格式转换

'b' - 二进制。将数字以2为基数进行输出。

'c' - 字符。在打印之前将整数转换成对应的Unicode字符串。

'd' - 十进制整数。将数字以10为基数进行输出。

'o' - 八进制。将数字以8为基数进行输出。

'x' - 十六进制。将数字以16为基数进行输出，9以上的位数用小写字母。

'e' - 幂符号。用科学计数法打印数字。用'e'表示幂。

'g' - 一般格式。将数值以fixed-point格式输出。当数值特别大的时候，用幂形式打印。

'n' - 数字。当值为整数时和'd'相同，值为浮点数时和'g'相同。不同的是它会根据区域设置插入数字分隔符。

'%' - 百分数。将数值乘以100然后以fixed-point('f')格式打印，值后面会有一个百分号。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

![复制代码](https://common.cnblogs.com/images/copycode.gif)

```asm
 1 >>> print('{0:b}'.format(3))
 2 11
 3 >>> print('{:c}'.format(20))
 4 
 5 >>> print('{:d}'.format(20))
 6 20
 7 >>> print('{:o}'.format(20))
 8 24
 9 >>> print('{:x}'.format(20))
10 14
11 >>> print('{:e}'.format(20))
12 2.000000e+01
13 >>> print('{:g}'.format(20.1))
14 20.1
15 >>> print('{:f}'.format(20))
16 20.000000
17 >>> print('{:n}'.format(20))
18 20
19 >>> print('{:%}'.format(20))
20 2000.000000%
21 >>> 
```

![复制代码](https://common.cnblogs.com/images/copycode.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

## 进阶用法

### 进制转换

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```asm
>>> # format also supports binary numbers
>>> "int: {0:d};  hex: {0:x};  oct: {0:o};  bin: {0:b}".format(42)
'int: 42;  hex: 2a;  oct: 52;  bin: 101010'
>>> # with 0x, 0o, or 0b as prefix:
>>> "int: {0:d};  hex: {0:#x};  oct: {0:#o};  bin: {0:#b}".format(42)  # 在前面加“#”，则带进制前缀
'int: 42;  hex: 0x2a;  oct: 0o52;  bin: 0b101010'
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

### 左中右对齐及位数补全

（1）< （默认）左对齐、> 右对齐、^ 中间对齐、= （只用于数字）在小数点后进行补齐

（2）取位数“{:4s}”、"{:.2f}"等

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```asm
>>> print('{} and {}'.format('hello','world'))  # 默认左对齐
hello and world
>>> print('{:10s} and {:>10s}'.format('hello','world'))  # 取10位左对齐，取10位右对齐
hello      and      world
>>> print('{:^10s} and {:^10s}'.format('hello','world'))  # 取10位中间对齐
  hello    and   world   
>>> print('{} is {:.2f}'.format(1.123,1.123))  # 取2位小数
1.123 is 1.12
>>> print('{0} is {0:>10.2f}'.format(1.123))  # 取2位小数，右对齐，取10位
1.123 is       1.12

>>> '{:<30}'.format('left aligned')  # 左对齐
'left aligned                  '
>>> '{:>30}'.format('right aligned')  # 右对齐
'                 right aligned'
>>> '{:^30}'.format('centered')  # 中间对齐
'           centered           '
>>> '{:*^30}'.format('centered')  # 使用“*”填充
'***********centered***********'
>>>'{:0=30}'.format(11)  # 还有“=”只能应用于数字，这种方法可用“>”代替
'000000000000000000000000000011'
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

### 正负符号显示

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```asm
>>> '{:+f}; {:+f}'.format(3.14, -3.14)  # 总是显示符号
'+3.140000; -3.140000'
>>> '{: f}; {: f}'.format(3.14, -3.14)  # 若是+数，则在前面留空格
' 3.140000; -3.140000'
>>> '{:-f}; {:-f}'.format(3.14, -3.14)  # -数时显示-，与'{:f}; {:f}'一致
'3.140000; -3.140000'
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

### 百分数%

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

```asm
>>> points = 19
>>> total = 22
>>> 'Correct answers: {:.2%}'.format(points/total)
'Correct answers: 86.36%'
```

### 时间

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

```asm
>>> import datetime
>>> d = datetime.datetime(2010, 7, 4, 12, 15, 58)
>>> '{:%Y-%m-%d %H:%M:%S}'.format(d)
'2010-07-04 12:15:58'
```

### 逗号","分隔金钱，没以前进位

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

```asm
>>> '{:,}'.format(1234567890)
'1,234,567,890'
```

### 占位符嵌套

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```asm
>>> for align, text in zip('<^>', ['left', 'center', 'right']):
...     '{0:{fill}{align}16}'.format(text, fill=align, align=align)
...
'left<<<<<<<<<<<<'
'^^^^^center^^^^^'
'>>>>>>>>>>>right'
>>>
>>> octets = [192, 168, 0, 1]
>>> '{:02X}{:02X}{:02X}{:02X}'.format(*octets)
'C0A80001'
>>> int(_, 16)  # 官方文档给出来的，无法在IDLE复现
3232235521
>>>
>>> width = 5
>>> for num in range(5,12):
...     for base in 'dXob':
...         print('{0:{width}{base}}'.format(num, base=base, width=width), end=' ')
...     print()
...
    5     5     5   101
    6     6     6   110
    7     7     7   111
    8     8    10  1000
    9     9    11  1001
   10     A    12  1010
   11     B    13  1011
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

### 占位符%s和%r

![img](https://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```asm
"""
replacement_field ::= "{" [field_name] ["!" conversion] [":" format_spec] "}"
conversion ::= "r" | "s" | "a"
这里只有三个转换符号，用"!"开头。
"!r"对应 repr()；"!s"对应 str(); "!a"对应ascii()。
"""

>>> "repr() shows quotes: {!r}; str() doesn't: {!s}".format('test1', 'test2')
"repr() shows quotes: 'test1'; str() doesn't: test2"  # 输出结果是一个带引号，一个不带
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

# format的用法变形

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

![复制代码](https://common.cnblogs.com/images/copycode.gif)

```asm
# a.format(b)
>>> "{0} {1}".format("hello","world")
'hello world'


# f"xxxx"# 可在字符串前加f以达到格式化的目的，在{}里加入对象，此为format的另一种形式：
>>> a = "hello"
>>> b = "world"
>>> f"{a} {b}"
'hello world'



name = 'jack'
age = 18
sex = 'man'
job = "IT"
salary = 9999.99

print(f'my name is {name.capitalize()}.')
print(f'I am {age:*^10} years old.')
print(f'I am a {sex}')
print(f'My salary is {salary:10.3f}')

# 结果
my name is Jack.
I am ****18**** years old.
I am a man
My salary is   9999.990
```

![复制代码](https://common.cnblogs.com/images/copycode.gif)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)



```asm
 name = "ken"
 age = 10
 a = f"{name}:{age}"
```

