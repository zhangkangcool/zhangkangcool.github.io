<h1 align="center">file read write</h1>




https://blog.csdn.net/kilotwo/article/details/99592915



python open()函数

https://www.runoob.com/python/python-func-open.html



# 1. 传统读文件

传统读取文件的方法是先使用Python内置的open函数打开文件，然后标示符’r’表示读，这样，我们就成功地打开了一个文件，获得到一个f文件句柄。

```python
f = open('test.txt','r')
```

如果文件不存在，`open()`函数就会抛出一个错误，并且给出错误码和详细的信息告诉你文件不存在：

```
---------------------------------------------------------------------------
FileNotFoundError                         Traceback (most recent call last)
<ipython-input-32-3fb42b740c2c> in <module>
----> 1 f = open('test1.txt','r')

FileNotFoundError: [Errno 2] No such file or directory: 'test1.txt'
```

如果文件打开成功，接下来，调用`read()`方法可以一次读取文件的全部内容





### 2. with open() as 读文件

无需要处理异常，调用close等

```
with open('test.txt','r') as f :
   print(f.read())
```





```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from typing import *
from typing import BinaryIO
import re
import os
import sys
import argparse

WYC_WORSE = re.compile(r'wyc worse')

def main():
    logdir = "/home/ken/diff_clang_xl/result_inst_num"
    log_filename = os.path.join(logdir, "README")
    with open(log_filename, 'r') as o:
        lines = o.readlines()
        for line in lines:
            # Remove the `\n`
            line = line.strip()
#            print(line)

            merge_log = os.path.join(logdir, line)
#            print(merge_log)
            with open(merge_log, 'r') as fo:
                content = fo.read()
#                print(content)
                findall_result = re.findall(WYC_WORSE, content)
#                for ret in findall_result:
#                    print(ret)
                num = len(findall_result)
                if num != 0:
                    print("{} has {} cases.".format(line, num))
#                exit(-1)

if __name__ == '__main__':
    sys.exit(main())
```





### write list

```python3
# list of names
names = ['Jessa', 'Eric', 'Bob']

with open(r'E:/demos/files_demos/account/sales.txt', 'w') as fp:
    fp.write('\n'.join(names))
```

