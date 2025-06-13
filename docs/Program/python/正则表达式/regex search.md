<h1 align="center">regex search</h1>
https://www.cnblogs.com/DonCharles/p/9930059.html



正则表达式中，group（）用来提出分组截获的字符串，（）用来分组

![img](https://img2018.cnblogs.com/blog/1525891/201811/1525891-20181108164704049-1066234445.png)

 

究其因

\1. 正则表达式中的三组括号把匹配结果分成三组

-  group() 同group（0）就是匹配正则表达式整体结果
-  group(1) 列出第一个括号匹配部分，group(2) 列出第二个括号匹配部分，group(3) 列出第三个括号匹配部分。

\2. 没有匹配成功的，re.search（）返回None

\3. 当然郑则表达式中没有括号，group(1)肯定不对了。







```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# issue 127

import re
import os
import sys

INST_LIS = re.compile(r'^(?!.*\s+\.long.*|.*\s+nop\s*).*:\s+\S{2}\s\S{2}\s\S{2}\s\S{2}\s+lis\s+(\w)+')
INST_ORI = re.compile(r'^(?!.*\s+\.long.*|.*\s+nop\s*).*:\s+\S{2}\s\S{2}\s\S{2}\s\S{2}\s+ori\s+(\w+),(\w+)')


line_lis = "  0:   04 00 80 3c     lis     r4,4"
line_ori = "  4:   00 10 84 60     ori     r4,r4,4096"

lis_re = re.search(INST_LIS, line_lis)
ori_re = re.search(INST_ORI, line_ori)

print(lis_re.group())
print(ori_re.group())


#INST_LOAD = re.compile(r'(lbz|lhz|lwz|ld)\s+(\S+)')
#INST_LOAD = re.compile(r'(lbz|lhz|lwz|ld)\s+(\S+),(\S+)')
#INST_LOAD = re.compile(r'(lbz|lhz|lwz|ld)\s+(\w+),(\w+)\W(\w+)\W)')
INST_LOAD = re.compile(r'(lbz|lhz|lwz|ld)\s+((\w+),(\w+)\((\w+)\))')
line_load = "  80:   2c 00 c1 80     lwz     r6,44(r1)"
load_re = re.search(INST_LOAD, line_load)
print(load_re.group())   # lwz     r6,44(r1)
print(load_re.group(0))   # lwz     r6,44(r1)
print(load_re.group(1))   # lwz
print(load_re.group(2))   # r6,44(r1)
print(load_re.group(3))   # r6
print(load_re.group(4))   # 44
print(load_re.group(5))   # r1



dict_ld = {'lbz':'stb', 'lhz':'sth', 'lwz':'stw', 'ld':'std'}
dict_st = {'stz':'lbz', 'sth':'lhz', 'stw':'lwz', 'std':'ld'}
dict_ldx = {'lbzx':'stbx', 'lhzx':'sthx', 'lwzx':'stwx', 'ldx':'stdx'}
dict_stx = {'stzx':'lbzx', 'sthx':'lhzx', 'stwx':'lwzx', 'stdx':'ldx'}
```

