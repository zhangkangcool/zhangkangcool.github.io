<h1 align="center">regex</h1>
[https://baike.baidu.com/item/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F/1700215?fr=aladdin](https://baike.baidu.com/item/正则表达式/1700215?fr=aladdin)

https://www.runoob.com/python/python-reg-expressions.html





https://docs.python.org/zh-cn/3/library/re.html 

```asm
asm = "14:     20 00 80 4e     blr"

#OP = re.compile(r':\s+\S\S\s\S\S\s\S\S\s\S\S\s+(?=blr)')  // :	20 00 80 4e
OP = re.compile(r':\s+\S\S\s\S\S\s\S\S\s\S\S\s+blr')       // :	20 00 80 4e 	blr


```







```asm
re.search 与 re.match 的用法区别
match会从头开始匹配，search而不是


asm = "a:b"
Op = re.compile(r':b')
ret = Op.match(Op, line)     // none
ret = Op.search(Op, line)    // :b

Opall = re.compile(r'a:b')
ret = Op.match(Op, line)     // a:b
ret = Op.search(Op, line)    // a:b
```





匹配不包含

https://www.cnblogs.com/jmliao/p/11775938.html

```asm
^(?!.*helloworld).*$
```





```asm
OP = re.compile(r'^(?!.*nop).*b')

asm1 = "14:    20 00 80 4e     nop"
asm2 = "14:     20 00 80 4e     blr"

ret1 = re.search(OP, asm1)     // none
ret2 = re.search(OP, asm2)     // 14:     20 00 80 4e     b
```





过滤反汇编中的nop指令

```asm
OP = re.compile(r'^(?!.*\s+nop).*:\s+\S\S\s\S\S\s\S\S\s\S\S\s+\D')  # right
```







```asm
 22 OP = re.compile(r'.*\s+\.long|.*\s+nop')
 23
 24 asm1 = "14:     20 00 80 4e     nop"     yes  
 25 asm2 = "16:     20 00 80 4e     beq"     no
 26 asm3 = "18:     20 00 80 4e     blr"     no
 27 asm4 = "24:     18 00 00 00     .long 0x18"    yes
```



~/Test/testpython/match_inst/asm.py

```asm
 23 OP = re.compile(r'^(?!.*\s+\.long.*|.*\s+nop.*)') #right
 24
 25 asm1 = "14:     20 00 80 4e     nop"               no
 26 asm2 = "16:     20 00 80 4e     beq"               yes
 27 asm3 = "18:     20 00 80 4e     blr"               yes
 28 asm4 = "24:     18 00 00 00     .long 0x18"        no
```







```asm
OP = re.compile(r'^(?!.*\s+\.long.*|.*\s+nop\s*).*:\s+\S{2}\s\S{2}\s\S{2}\s\S{2}\s+\D')


asm1 = "14:     20 00 80 4e     nop"             no
asm2 = "16:     20 00 80 4e     beq"             yes
asm3 = "18:     20 00 80 4e     blr"             yes
asm4 = "24:     18 00 00 00     .long 0x18"      no
```





包含特定的字符串是返回none

```asm
r'^(?!.*\s+\.long.*|.*\s+nop\s*).*:zhangkang'
包含zhangkang的行，但不包含.long或nop
```





```asm


line = "/home/ken/diff_clang_xl/test/Transforms/TransformsA_G/ADCE/2002-05-22-PHITest.ll:test -> /home/ken/diff_clang_xl/ADCE_c_files/bd6d877019daca4ec27adf6d45cbc597b26c8d60.c"

GEN_LL_FILE = re.compile(r'.*(?= -> )')   // /home/ken/diff_clang_xl/test/Transforms/TransformsA_G/ADCE/2002-05-22-PHITest.ll:test
GEN_C_FILE = re.compile(r'(?= -> ).*')   // -> /home/ken/diff_clang_xl/ADCE_c_files/bd6d877019daca4ec27adf6d45cbc597b26c8d60.c
GEN_C_FILE = re.compile(r'(?<= -> ).*') // /home/ken/diff_clang_xl/ADCE_c_files/bd6d877019daca4ec27adf6d45cbc597b26c8d60.c
```





```asm
read()  得到所有的内容，非list
readlines() 得到list
```





```python
INST_BRANCH = re.compile(r'^(?!.*\s+\.long.*|.*\s+nop\s*).*:\s+\S{2}\s\S{2}\s\S{2}\s\S{2}\s+b\D*\s+([0-9]+) <.*\+.*>')
INST_OFFSET = re.compile(r'^[0-9]+(?=:)')
#INST_BRANCH = re.compile(r'^(?!.*\s+\.long.*|.*\s+nop\s*).*:\s+\S{2}\s\S{2}\s\S{2}\s\S{2}\s+b\D*\s+([0-9]+)\<.*+.*\>')

line = "60:   e0 ff 00 42     bdnz    40 <test7+0x40>"

ret = re.search(INST_BRANCH, line)
print(ret.group())
print(ret.group(0))
print(ret.group(1))

ret = re.search(INST_OFFSET, line)
print(ret.group())

### result
60:   e0 ff 00 42     bdnz    40 <test7+0x40>
60:   e0 ff 00 42     bdnz    40 <test7+0x40>
40
60
```





# findall & finditer

https://blog.csdn.net/naipeng/article/details/94744621

两者都可以获取所有的匹配结果，这和search方法有着很大的区别，同时不同的是一个返回list，一个返回一个MatchObject类型的iterator

```python
content = '''email:12345678@163.com
email:2345678@163.com
email:345678@163.com
'''
```



#### 1 需求：（正则没有分组）提取所有的邮箱信息

```python
result_finditer = re.finditer(r"\d+@\w+.com", content)
#由于返回的为MatchObject的iterator，所以我们需要迭代并通过MatchObject的方法输出
for i in result_finditer :
    print i.group()

result_findall = re.findall(r"\d+@\w+.com", content)
#返回一个[]  直接输出or或者循环输出
print result_findall
for i in result_findall :
    print i
```



### 2 需求：（正则有分组）提取出来所有的电话号码和邮箱类型

```python
result_finditer = re.finditer(r"(\d+)@(\w+).com", content)
#正则有两个分组，我们需要分别获取分区，分组从0开始，group方法不传递索引默认为0，代表了整个正则的匹配结果
for i in result_finditer :
    phone_no = i.group(1)
    email_type = i.group(2)

result_findall = re.findall(r"(\d+)@(\w+).com", content)
#此时返回的虽然为[]，但不是简单的[],而是一个tuple类型的list  
#如：[('12345678', '163'), ('2345678', '163'), ('345678', '163')]
for i in result_findall :
    phone_no = i[0]
    email_type = i[1]
```



命名分组和非命名分组的情况是一样的。
findall注意点：

### 3 当正则没有分组是返回的就是正则的匹配

```python
re.findall(r"\d+@\w+.com", content)
['2345678@163.com', '2345678@163.com', '345678@163.com']
```



### 4 有一个分组返回的是分组的匹配而不是整个正则的匹配

```python
re.findall(r"(\d+)@\w+.com", content)
['2345678', '2345678', '345678']
```



### 5 多个分组时将分组装到tuple中返回

```python
re.findall(r"(\d+)@(\w+).com", content)
[('2345678', '163'), ('2345678', '163'), ('345678', '163')]
```



因此假如我们需要拿到整个正则和每个分组的匹配，使用findall我们需要将整个正则作为一个分组

```python
re.findall(r"((\d+)@(\w+).com)", content)
[('2345678@163.com', '2345678', '163'), ('2345678@163.com', '2345678', '163'), ('345678@163.com', '345678', '163')]
```



而使用finditer我们无需手动将整个正则用()括起来group()代表整个正则的匹配，实际中我们根据我们的需求选择方法既可。

