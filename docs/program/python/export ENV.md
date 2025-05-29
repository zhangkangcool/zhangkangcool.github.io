

# 将python加入环境变量_export-在python脚本中设置环境变量

https://blog.csdn.net/weixin_39528525/article/details/110341763



这里有很多很好的答案，但是您应该不惜一切代价避免使用var1将不可信的变量传递给子流程，因为这是安全隐患。 变量可以转义到shell并运行任意命令！ 如果您无法避免，请至少使用[python](https://so.csdn.net/so/search?from=pc_blog_highlight&q=python)3的`shell=True`来转义字符串（如果您有多个以空格分隔的参数，请使用每个分隔符而不是完整的字符串）。



var1始终是您传递参数数组的默认设置。现在，安全的解决方案...

### 1. os.environ修改当前的环境变量

更改您自己的进程的环境-新的环境将适用于python本身和所有子进程。

```python
os.environ['LD_LIBRARY_PATH'] += ':my_path'
command = ['sqsub', '-np', var1, '/homedir/anotherdir/executable']
subprocess.check_call(command)
```



### 2. subprocess(env=myenv)

复制环境并传递给孩子们。 您可以完全控制子环境，并且不会影响python自己的环境。

```python
myenv = os.environ.copy()
myenv['LD_LIBRARY_PATH'] += '：my_path'
command = ['sqsub', '-np', var1, '/homedir/anotherdir/executable']
subprocess.check_call(command, env=myenv)
```



### 3. 方法3

仅限Unix：执行var1设置环境变量。 如果您要修改的变量很多而不是portabe，则比较麻烦，但是像＃2一样，您可以完全控制python和子级环境。

```python
command = ['env', 'LD_LIBRARY_PATH=my_path', 'sqsub', '-np', var1, '/homedir/anotherdir/executable']
subprocess.check_call(command)
```



当然，如果var1包含多个以空格分隔的参数，则它们现在将作为带有空格的单个参数传递。 要保留shell=True的原始行为，必须组成一个包含分割字符串的命令数组：

```python
command = ['sqsub', '-np'] + var1.split() + ['/homedir/anotherdir/executable']
```

