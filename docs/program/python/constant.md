https://www.cnblogs.com/WebLinuxStudy/p/11840292.html

https://blog.csdn.net/qq_17034717/article/details/81942059

https://www.malike.net.cn/blog/2013/11/03/python-constants/





### 定义常量

```python
# import os

class _const():
  class ConstError(TypeError):
    pass

  class ConstCaseError(ConstError):
    pass

  def __setattr__(self, key, value):
    # Cann't be modified.
    if key in self.__dict__.keys():
      raise self.ConstError("Can't change a const variable: '%s'" % key)
    # Must be upper.
    if not key.isupper():
      raise self.ConstCaseError("Const variable must be combined with upper letters:'%s'" % key)

    self.__dict__[key] = value


const = _const()
const.TEST_DIR = os.path.abspath("..")
print(const.TEST_DIR)

const.PI = 3.14

```



在另一个文件中使用

```python
如何使用自定义常量类
from constant import const


const.TEST = 'HH'
print(const.TEST)
# 尝试修改变量
const.TEST = 'JJ'
# 尝试常量名称为小写字母
const.test = 'HH'
```

