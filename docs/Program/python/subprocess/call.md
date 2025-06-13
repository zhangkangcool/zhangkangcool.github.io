<h1 align="center">subpcall</h1>
#  subprocess.call(cmd, shell = False, timeout = num)



### 1.使用方法

- 传入list (shell = False默认)

```python


subprocess.call(['df', '-h'])
下面的例子把shell设置为True

subprocess.call('du -hs $HOME', shell=True)
```



- 传入cmd（shell = True） 推荐方式

```python
subprocess.call(cmd, shell = True)
```



### 2.判断是否成功

```python
通过subprocess.call的返回值你能够判定命令是否执行成功.
每一个进程退出时都会返回一个状态码，你可以根据这个状态码写一些代码。

def base(cmd):
    if subprocess.call(cmd, shell=True):
        raise Exception("{} 执行失败".format(cmd))
```