



https://blog.csdn.net/weixin_38819889/article/details/93846579



# Python的re.match()和re.search()的使用和区别



## 1.re.match()

re.match（）的概念是从头匹配一个符合规则的字符串，从起始位置开始匹配，匹配成功返回一个对象，未匹配成功返回None。包含的参数如下：

- pattern： 正则模型
- string ： 要匹配的字符串
- falgs ： 匹配模式



match() 方法一旦匹配成功，就是一个match object对象，而match object对象有以下方法：

- group() 返回被 RE 匹配的字符串
- start() 返回匹配开始的位置
- end() 返回匹配结束的位置
- span()返回一个元组包含匹配 (开始,结束) 的位置



#### example

```python
import re
# re.match 返回一个Match Object 对象
# 对象提供了 group() 方法，来获取匹配的结果
result = re.match("hello","hello,world")
if result:
    print(result.group())
else:
    print("匹配失败!")
```

输出结果：

```
hello
```



## 2.re.search()

re.search（）函数会在字符串内查找模式匹配,只要找到第一个匹配然后返回，如果字符串没有匹配，则返回None。

```python
格式：re.search(pattern, string, flags=0)
```



要求：匹配出文章阅读的次数

```python
import re

ret = re.search(r"\d+", "阅读次数为 9999")
print(ret.group())
```

输出结果：

```
9999
```



## 3. match()和search()的区别：

- match（）函数只检测RE是不是在string的开始位置匹配，
- search()会扫描整个string查找匹配
- match（）只有在0位置匹配成功的话才有返回，如果不是开始位置匹配成功的话，match()就返回none



#### Example

```python
import re
print(re.match('super', 'superstition').span())  # (0, 5)

print(re.match('super','insuperable'))    # None

print(re.search('super','superstition').span())  # (0, 5)

print(re.search('super','insuperable').span()) # (2, 7)
```

