<h1 align="center">subprocess</h1>


https://blog.csdn.net/mouday/article/details/86367256

http://blog.csdn.net/imzoer/article/details/8678029

https://blog.csdn.net/qq_34355232/article/details/87709418



# python – subprocess Popen和call之间有什么区别(我如何使用它们)？



`call`由popen实现，call是阻塞的。

```python
def call(*popenargs, timeout=None, **kwargs):
    """Run command with arguments.  Wait for command to complete or
    timeout, then return the returncode attribute.

    The arguments are the same as for the Popen constructor.  Example:

    retcode = call(["ls", "-l"])
    """
    with Popen(*popenargs, **kwargs) as p:
        try:
            return p.wait(timeout=timeout)
        except:
            p.kill()
            p.wait()
            raise
```





#### 添加超时和异常处理

https://www.pythonheidong.com/blog/article/165969/

```python
try:
...             subprocess.call("notepad", timeout=3)
...     except subprocess.TimeoutExpired:
...             continue
...     else:
...             break
...     finally:
...             run += 1
```





# 1 subprocess.call







