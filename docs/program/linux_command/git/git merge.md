#  1. git merge & git rebase

https://blog.csdn.net/liuxiaoheng1992/article/details/79108233
https://www.cnblogs.com/kidsitcn/p/5339382.html

### Don't create the commit log

has not verify

```shell
git checkout develop
git rebase master
```

### Create the commit log

has verify

```shell
// 将master合并到develop，master不变，develop发生变化。
git checkout develop
git merge master
git push
```

### Merge the master & resolve the conflict

```shell
git pull master
git checkout shkzhang_dev
git merge master
# If there is conflict, you will fail to merge the code.
# You should reslove the conflict.
# Find the conflict file and modify it.
# For example, you modify the test.txt
git status
git add test.txt
git commit -m "fix the conflict"
git merge master
git push --force
```



下面这个解决冲突的方法更好，不使用`git push --force`



```shell
git pull master
git checkout shkzhang_dev
git merge master
# If there is conflict, you will fail to merge the code.
# You should reslove the conflict.
# Find the conflict file and modify it.
# For example, you modify the test.txt
git status
git add test.txt
git commit 
git push
```



事实上，可以将未合并前的文件old/test.c，与准备合并的文件new/test.c都复制出来，然后手工合并得到新的merge/test.c。

```shell
git pull master
git checkout shkzhang_dev
git merge master
# If there is conflict, you will fail to merge the code.
# You should reslove the conflict.
# Find the conflict file and modify it.
# For example, you modify the test.c
git status
cp merge/test.c path/
git add test.c
git commit 
git push
```





如果想放弃修改，可以用

```
git reset last_commit_id_before_merge
```



#### git rebase应用场景(提交pr时，master使用时新的)

```shell
// 从master产生分支shkzhang
git checkout -b shkzhang

// 修改shkzhang分支的代码，过了很多天，所对比的master已经不是最新的，想用最新的master进行对比
// 假设master你自己提交了5个commit，这期间master提交了50个commit
git checkout master
git pull

// 此时，master已经是最新的，此时不要使用merge命令（会生产55个commit）
// 用rebase只会产生5个commit
git checkout shkzhang
git rebase master
```





# 2. git merge squash

https://blog.csdn.net/coder1994/article/details/80639404

将多次的commit一次性合并到主分支，主分支上只会有一次commit。

```shell
git checkout master
git merge --squash feature-1.0.0（squash前面两个短杠,feature是你想要merge到master的分支）
git commit -m'信息'
git push origin master

```



# 3. 放弃merge

放弃本地merge

```shell
git checkout old_commit_before_merge
git pull
```





# 4. git cherry-pick

https://blog.csdn.net/jerechen/article/details/100814091

只合并某一个commit，上面会显示提交此commit的人，不过你还是可以对此commit进行修改，修改完成后使用`git commit --amend`命令。

```shell
master: 不能直接push

git checkout master
git checkout -b zhangkang
git cherry-pick commit_id
提交PR
通过后，再进行merge
```

