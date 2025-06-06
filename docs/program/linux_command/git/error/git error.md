<h1 align="center">git error</h1>
# git checkout

#### 1 The following untracked working tree files would be overwritten by checkout

https://blog.csdn.net/lisulong1/article/details/78910727

在IDEA中进行分支切换时，出现如此错误，导致无法正常切换：

```
error: The following untracked working tree files would be overwritten by checkout
```

通过错误提示可知，是由于一些untracked working tree files引起的问题。所以只要解决了这些untracked的文件就能解决这个问题。



删除 一些 没有 `git add` 的 文件；

```shell
    git clean 参数 
    
    -n 显示将要删除的文件和目录；
    -x -----删除忽略文件已经对git来说不识别的文件
    -d -----删除未被添加到git的路径中的文件
    -f -----强制运行

    git clean -n
    git clean -df
    git clean -f
```



#### `git clean`命令很危险，可能会删除一些本地的所需要的但未ADD的文件，切记不要加`-x -d`选项。

删除前必须先用 `git chlean -n `进行确认，确认时添加好必要的选项。



打开SourceTree通过命令行，进入本地版本仓库目录下，直接执行

```shell
git clean -f
```





#### 2. Git push 处理报错：remote: error: cannot lock ref

```shell
git status

LynGPU/zhangkang/return_value (本地分支)
remotes/origin/LynGPU/zhangkang (远程分支)
```



远程分支的名字中包括了本地分支的某个目录，此时会报这种错误。

如果远程分支无用的话，可以考虑直接删除。有用，则继续google解决该问题的方法。

```shell
git push origin --delete remotes/origin/LynGPU/zhangkang
git push --set-upstream origin LynGPU/zhangkang/return_value
```



删除完远程的`LynGPU/zhangkang`分支之后，在另一个代码的位置进行`git pull`时可能还是会报下述的错误：

```
error: some local refs could not be updated; try running
'git remote prune origin' to remove any old, conflicting branches.
```

根据提示使用即可以使用`git remote prune origin`即可解决上述错误。