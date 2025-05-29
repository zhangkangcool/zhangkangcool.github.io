https://www.cnblogs.com/itwhite/p/12329916.html

##  1. os.system()

os.system() 是对 C 语言中 system() 系统函数的封装，允许执行一条命令，并返回退出码（exit code），命令输出的内容会直接打印到屏幕上，无法直接获取。

示例：

```python
# test.py
import os
os.system("ls -l | grep test")    # 允许管道符

# 测试执行
$ ll                <======== 列出当前目录中的内容
drwxr-xr-x 2 foo foo 4096 Feb 13 09:09 __pycache__
-rw-r--r-- 1 foo foo  359 Feb 19 09:21 test.py
$ python test.py
-rw-r--r-- 1 foo foo  359 Feb 19 09:21 test.py    <======== 只有名字包含 test 的文件被列出
```

## 2. subprocess.run() 3.5以后推荐方式该方式返回的信息更多，如果想得到输出，推荐使用些方法



重定向日志

```python
with open("stdout.txt","a+") as log1:
   subprocess.run('my command', cwd='my path', shell=True, stdout=log1, stderr=log1)
```





Python 3.5 开始推荐使用这个方法执行命令，其原型如下：



最好不要使用3.6的版本



3.6的定义

```python
subprocess.run(args, *, stdin=None, input=None, stdout=None, stderr=None,
               shell=False, cwd=None, timeout=None, check=False, encoding=None,
               errors=None, env=None)
```





不要用capture_output和text 参数，因为3.6版本不存在这个参数。直接使用`stderr = subprocess.PIPE, stdout = subprocess.PIPE`

3.7的定义

```python
subprocess.run(
    args, *, stdin=None, input=None, stdout=None, stderr=None, capture_output=False, 
    shell=False, cwd=None, timeout=None, check=False, encoding=None, errors=None, 
    text=None, env=None, universal_newlines=None
)

if capture_output:
    if ('stdout' in kwargs) or ('stderr' in kwargs):
        raise ValueError('stdout and stderr arguments may not be used '
                         'with capture_output.')
    kwargs['stdout'] = PIPE
    kwargs['stderr'] = PIPE
```

其中：

- args： 可以是一个字符串（当 shell=True 时），也可以是一个列表（当 shell=False 时）
- stdin, stdout, stderr： 用于指定标准IO文件句柄，可以是：
  - subprocess.PIPE： 用作 stdout, stderr 参数的值时，可以从返回值对象中的 stdout 和 stderr 属性中读取输出内容
  - subprocess.STDOUT： 用作 stderr 参数的值时，相当于把标准错误重定向到标准输入中）
  - subprocess.DEVNULL： 用作 stdout, stderr 参数的值时，相当于把输出内容重定向到 /dev/null
  - 用户已经打开的文件对象或描述符（整型数字）
- capture_output： 当设置为 True 时，相当于 stdout 和 stderr 参数都设置为 True 了，可以通过返回值对象访问标准输出和标准错误内容
- shell： 当设置为 True 时，args 参数会当做一条命令字符串（支持管道、重定向操作）；当它为 False 时，args 需是一个列表（并且不支持管道、重定向操作）
- cwd： 指定执行命令的目录，默认为当前目录
- timeout： 指定命令执行超时时间（按妙计），若执行超时了，会 kill 掉命令并抛出 TimeoutExpired 异常
- check： 当设置为 True 时，会自动检测执行退出码，若不为0，则抛出 CalledProcessError 异常
- text： 当设置为 True 时，stdin、stdout、stderr 会以“文本”模式打开（返回值对象中的 stdout、stderr 存储文本内容），否则返回值对象中 stdout、stderr 存储的是字节序列
- env： 用于设置程序执行时继承的环境变量等，默认与当前进程相同

该方法返回一个 CompletedProcess 对象，其中包含以下属性：

- returncode： 执行命令的退出码
- stdout： 捕获的标准输出内容（当 stdout 参数为 PIPE 时）。其格式默认为字节序列，除非 text 参数为 True （此时为文本格式）。
- stderr： 捕获的标准错误内容（当 stderr 参数为 PIPE 时）。其格式默认为字节序列，除非 text 参数为 True （此时为文本格式）。
- args： 同参数 args 。

示例：

```python
import subprocess
subprocess.run(["ls", "-l"])            # 默认时，args 参数需是一个列表
subprocess.run("ls -l", shell=True)     # 当 shell 为 True 时，args 是一个字符串
ret = subprocess.run("ls -l", shell=True, capture_output=True, text=True) # 以文本模式捕获输出内容
print("Return code:", ret.returncode)   # Return code: 0
print("STDOUT:", ret.stdout)            # STDOUT: ...当前目录内容...
print("STDERR:", ret.stderr)            # STDERR: <空>
ret = subprocess.run("abcdefg", shell=True, text=True,  # 注意：这里必须 shell=True 才能捕获到 /bin/sh 的输出错误
        # 当 shell=False 时，是要去捕获 "abcdefg" 命令自身输出的内容，但是它不存在，python 会报错
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT    # 标准错误重定向到标准输出
) 
print("STDOUT:", ret.stdout)            # STDOUT: /bin/sh: abcdefg: command not found
```



另一个用于测试 shell 参数区别的示例如下：

```python
import sys, re, subprocess
if len(sys.argv) == 1:  # parent process
    cmd = ["python", sys.argv[0], "--run-child"]
    
    ret = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print(ret) # CompletedProcess(args=['python', 'test.py', '--run-child'], returncode=0, stdout='stdout output\n', stderr='stderr output')
    assert re.match("stdout output", ret.stdout)
    assert re.match("stderr output", ret.stderr)    # 如果 cmd 中的命令不存在，这里是捕获不到的，subprocess.run()自己就会报错
    
    ret = subprocess.run(" ".join(cmd), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print(ret) # CompletedProcess(args='python test.py --run-child', returncode=0, stdout='stdout output\n', stderr='stderr output')
    assert re.match("stdout output", ret.stdout)
    assert re.match("stderr output", ret.stderr)    # 如果 cmd 中的命令不存在，这里也是可以捕获到的，内容可能是 xxx command not found
    
    print("Passed!")
else:                   # child process
    print("stdout output")
    sys.stderr.write("stderr output")
    
    
这里用data = ret.stdout.decode(“utf-8”)[: -1]实现 b'1234\n'  ==> 1234
```

参考： https://docs.python.org/3/library/subprocess.html

## 3. subprocess.call() 3.5以前的方法

Python 3.5 以前（包括 2.x 版本）没有 subprocess.run() 方法，可以使用 subprocess.call() 来执行命令，该方法原型如下：

```
subprocess.call(args, *, stdin=None, stdout=None, stderr=None, shell=False, cwd=None, timeout=None)
```

注意：这个方法的返回值是命令的退出码，而不是一个对象，所以无法像 subprocess.run() 一样捕获命令输出内容（不要设置 stdout=PIPE 或 stderr=PIPE，否则可能造成命令卡死）。

该方法的其它参数与 subprocess.run() 类似。

##  4. subprocess.check_output()

Python 3.5 以前的版本，要想捕获命令输出内容，可以使用 subprocess.check_output() 方法，它的原型如下：

```python
subprocess.check_output(args, *, stdin=None, stderr=None, shell=False, cwd=None, encoding=None, errors=None, universal_newlines=None, timeout=None, text=None)
```

注意：参数中没有 stdout ，因为这个函数的返回值默认就是标准输出内容，也可以将设置 stderr=subprocess.STDOUT 将标准错误重定向到标准输出，但是好像没有办法单独捕获标准错误内容呢！

示例：

```python
import sys, re, subprocess
if len(sys.argv) == 1:  # parent process
    cmd = ["python", sys.argv[0], "--run-child"]
    ret = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    print("[" + ret + "]")  # 输出内容中包含标准输出和标准错误，输出顺序在 windows 下和 linux 下可能会有差异
    assert re.search("stdout output", ret)
    assert re.search("stderr output", ret)
    print("Passed!")
else:                   # child process
    print("stdout output")
    sys.stderr.write("stderr output")
```