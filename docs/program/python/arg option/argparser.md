<h1 align="center">argparser</h1>


# argparse详解

https://zhuanlan.zhihu.com/p/539331146

https://docs.python.org/3/library/argparse.html   官网



###  1. argparse简介

argparse 模块是 Python 内置的用于命令项选项与参数解析的模块，argparse 模块可以让人轻松编写用户友好的命令行接口，能够帮助程序员为模型定义参数。

##### 1.1 argparse定义四个步骤

- 导入argparse包 ——import argparse
- 创建一个命令行解析器对象 ——创建 ArgumentParser() 对象
- 给解析器添加命令行参数 ——调用add_argument() 方法添加参数
- 解析命令行的参数 ——使用 parse_args() 解析添加的参数

##### 1.2 举个栗子

```python
# 导入库
import argparse
 
# 1. 定义命令行解析器对象
parser = argparse.ArgumentParser(description='Demo of argparse')
 
# 2. 添加命令行参数
parser.add_argument('--epochs', type=int, default=30)
parser.add_argument('--batch', type=int, default=4)
 
# 3. 从命令行中结构化解析参数
args = parser.parse_args()
print(args)
# Namespace(batch=4, epochs=30)


epochs = args.epochs
batch = args.batch
print('show {}  {}'.format(epochs, batch))
# show 30 4
```

用大白话对上面代码进行解读，首先我们导入argparse这个包，然后包中的ArgumentParser类生成一个parser对象（其中的description对参数解析器的作用进行描述）



当我们在命令行显示帮助信息的时候会看到description描述的信息。例如:

```asm
python3 ./test.py -h
usage: test.py [-h] [--epochs EPOCHS] [--batch BATCH]

Demo of argparse

optional arguments:
  -h, --help       show this help message and exit
  --epochs EPOCHS
  --batch BATCH

```



下面是参数的使用方法

```asm
python fun_test.py --epochs 30 --batch 4
```







###  2. 参数详解

##### 2.1 add_argument() 方法

（1）添加命令行参数

给一个 ArgumentParser 添加程序参数信息，是通过调用 add_argument() 方法完成的。通常，这些调用指定 ArgumentParser 如何获取命令行字符串并将其转换为对象。这些信息在 parse_args() 调用时被存储在ArgumentParser实例化对象中，以供后续使用。add_argument() 方法定义如何解析命令行参数的呢？

（2）add_argument() 方法定义如何解析命令行参数

```asm
parser.add_argument(name or flags...[, action][, nargs][, const][, default][, type][,choices][, required][, help][, metavar][, dest])
```

每个参数解释如下:

- **name or flags:** 普通参数或flag参数选项参数的名称或标签，例如 epochs 或者 -e, --epochs。Flag参数不需要指定参数值，只需要带有参数名即可。
- **action:** 命令行遇到flags参数时的动作。有两个常见的动作，store_true：设定flag参数为true；store_false：设定flag参数为False。注意：如果直接运行程序，默认不读取该变量，要使用必须要进行传参，例如：python [try.py](https://link.zhihu.com/?target=http%3A//try.py) --epochs
- nargs: 应该读取的命令行参数个数，可以是具体的数字，或者是?号，当不指定值时对于 Positional argument 使用 default，对于 Optional argument 使用 const；或者是 * 号，表示 0 或多个参数；或者是 + 号表示 1 或多个参数。
- **default:** 不指定参数时该参数的默认值。
- **type:** 命令行参数应该被转换成的数据类型。
- required: 是否为必选参数或可选参数。
- **help:** 参数的帮助信息。
- metavar： 在 usage 说明中的参数名称，对于必选参数，默认就是参数名称，对于可选参数默认是全大写的参数名称。
- dest： 解析后的参数名称，默认情况下，对于可选参数选取最长的名称，中划线转换为下划线.
- choices： 参数可允许的值的一个容器。
- const： action 和 nargs 所需要的常量值。
- store_const：表示赋值为const；
- append：将遇到的值存储成列表，也就是如果参数重复则会保存多个值;
- append_const：将参数规范中定义的一个值保存到一个列表；
- count：存储遇到的次数；此外，也可以继承 argparse.Action 自定义参数解析；

##### 2.2 解析命令行的参数：parse_args()

ArgumentParser对象通过 parse_args() 方法解析命令行的参数。它将检查命令行中每个参数，转换为适当的数据类型，然后调用相应的操作，并把参数结构化后存放在对象args中。

```asm
args = parser.parse_args()
```

在脚本中，通常 parse_args() 会被不带参数调用，而 ArgumentParser 将自动从 sys.argv 中确定命令行参数。



示例

```python
import argparse

# 1.创建解释器
parser = argparse.ArgumentParser(description="可写可不写，只是在命令行参数出现错误的时候，随着错误信息打印出来。")
# 2.添加需要的参数
parser.add_argument('-gf', '--girlfriend', choices=['jingjing', 'lihuan'], type = str)
# 参数解释
# -gf 代表短选项，在命令行输入-gf和--girlfriend的效果是一样的，作用是简化参数输入
#--girlfriend 代表完整的参数名称，可以尽量做到让人见名知意，需要注意的是如果想通过解析后的参数取出该值，必须使用带--的名称
# choices 代表输入参数的只能是这个choices里面的内容，其他内容则会保错
parser.add_argument('--house', type=int, default=0)
# 参数解释
# --house 代表参数名称
# type  代表输入的参数类型，从命令行输入的参数，默认是字符串类型
# default 代表如果该参数不输入，则会默认使用该值
parser.add_argument('food')
# 参数解释
# 该种方式则要求必须输入该参数
# 输入该参数不需要指定参数名称，指定反而报错，解释器会自动将输入的参数赋值给food

# 3.进行参数解析
args = parser.parse_args() 
print('------args---------',args)
print('-------gf-------', args.girlfriend)
```



使用

```asm
python gf.py potato ，这种方式会将potato赋值给food
python gf.py -gf jingjing tomato，该种方式会将jingjing赋值给girlfriend，tomato赋值给food
python gf.py --house 2 chicken，该种方式会将house赋值为2，food赋值为chicken
```





```python
def deal_args():
  # 1.创建解释器
  parser = argparse.ArgumentParser(description="cmd line error.")
  # 2.添加需要的参数
  parser.add_argument('-p', '--password', type = str)
  args = parser.parse_args()
  print(args)
  return args


def main():
  deal_args()
  print(args.password)
```

