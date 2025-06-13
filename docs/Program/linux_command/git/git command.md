<h1 align="center">git command</h1>
#   1. reset & revert

```
https://blog.csdn.net/u012589515/article/details/66973734
https://blog.csdn.net/qq8427003/article/details/64920987
```
```shell
git revert <commit_id>
git show <commit_id>  // 查看此次commit做了什么，一般用于merge conflict后
git reset --hard <commit_id>    // 回滚并删除修改
git reset [--soft] <commit_id>  // 回滚但不删除修改，更安全，随后可以用`git checkout file`删除修改

git show <commit_id>   查看对应的修改
git log -p filename    查看对应文件的修改历史日志
git chekcout .         撤销还没有添加的修改
git clean -df          清理工作目录，删除没有添加的文件等

revert hash 这个hash为对应想删除的commit

revert hash..HEAD 这个hash对应的commit不会被删除，会删除到它的后一次commit

revert 会产生新的提交，并不会真正删除history。
```

- 虽然说`git revert`跟`git reset`都是用来回退代码的，但是真正在功能上面名副其实回退代码的应该是`git reset`命令。

- revert用于使用相反的操作删除中间的某一次提交，其它提交不会修改，会产生一个新的提交记录。
- reset会扔掉指定提交之后的所有提交，不会产生新的提交记录。

### 1.1 reset
- 在执行过完git reset指令之后我们用git log去查看提交日志的时候，发现reset之前的提交已经不见了！实现了真正的代码回退，而且reset回退的是一个区间的的所有提交！

- 在reset的时候添加了–hard的参数，因为快速的reset不经过staged暂存，这种情况的话需要强行才能恢复reset过的内容，但是，如果我们不添加参数或者说添加–soft参数（这两种情况类似）的话，git会把reset操作之后的内容暂存起来

- 在这种情况下面，如果我们需要确认我们的reset操作的话，我们需要执行git reset HEAD <file>...,执行完毕之后会变成下面不添加任何参数的这种情况，然后在执行git checkout .来取消reset产生的修改操作。
在git reset <commit_id>之后的状态

- 总结：通过操作的日志可以看出，我们在执行玩reset操作之后，git会认为我们的代码回到了reset对应版本，但是，因为本地的代码是reset之前最新的，所以如果不添加–hard参数的话，通过git status .命令会出现有修改的情况，因为本地的代码跟reset之后的代码存在差异，系统没有直接删除这些内容，而是把这些内容当成了修改。当然，这个修改就是从reset对应reset之前的修改，如果你不需要reset的话，重新add然后commit就可以了，如果你依然执行reset之后的结果，执行git checkout .就可以了.

- 大概能能够了解这两个命令的基本操作了。但是可能你又会问，如果我reset成功了！也就是使用了–hard参数之后的效果。那么如果现在我发现自己弄错了需要怎么办呢？
最简单的方法就是如果你的远程分支的代码还没更改的话，直接使用git pull就可以了！如果远程分支也跟本地修改的同步了，那么我们可以使用reset命令才重新的回退回去！但是重点就是你必须知道之前的commit id！知道的话直接reset回去就可以了，操作跟上面的基本一致！ 

- 如果要把本地reset之后的代码提交上去，如果直接使用git push命令是不行的，会提示以下的错误，
```shell
resonLei@resonLei-PC MINGW64 /d/new_website_ssh/my_website (master)
$ git push
To git.oschina.net:Mr.Lei/my_website.git
 ! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to 'git@git.oschina.net:Mr.Lei/my_website.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

```shell
git push --force
```

### 1.2 revert
- 当我们执行`git revert`之后，其实整个分支的节奏是向前的，也就是说会产生一次新的提交，只不过这次提交是与对应改动相反的提交，而且一般来说revert是‘回退’一次提交
- revert只是功能上面实现了看起来的‘回退’代码，实际是通过新的提交来覆盖之前的修改


# 2. git commit --amend  --no-edit
```shell
https://blog.csdn.net/zhujiangtaotaise/article/details/73505770
https://blog.csdn.net/garfielder007/article/details/60885000
```

- 方法1：leader 将你提交的所有代码 abandon掉，然后你回去 通过git reset …将代码回退到你代码提交之前的版本，然后你修改出问题的Java文件，然后 git add xx.java xxx.java -s -m “Porject : 1.修改bug…”
最后通过 git push origin HEAD:refs/for/branches

- 方法2：
leader不abandon代码，你回去之后，修改出问题的Java文件，修改好之后，git add 该出问题.java
然后 git commit –amend –no-edit,
最后 git push origin HEAD:refs/for/branches。

如果提交时出现冲突，要使用
```shell
git push --force
```

# 3. git pull
- 远程分支与本地分支进行同步。
`git pull`提取远程分支代码到本地分支，不过可以冲突的话，需要解决冲突。
可以通过 `git diff > diff.log 2>&1`来对diff进行备份，方便导入。

- 丢弃本地分支，并拉取远程分支代码
```shell
git checkout -- .
git pull

```

# 4. git 删除分支

- 在网站上查看分支

```shell
https://github.ibm.com/compiler/wyvern/issues/5859#issuecomment-18693834

https://github.ibm.com/compiler/llvm-project/branches/yours
https://github.ibm.com/compiler/scripts/branches/yours
https://github.ibm.com/compiler/test-suite/branches/yours
```



```shell
https://www.cnblogs.com/luosongchao/p/3408365.html
```

 - 删除远程分支
```shell
git push origin --delete shkzhang_isseue184   // 不需要加remotes/origin/shkzhang_issue184
```
- 删除本地分支
```shell
git branch -d Chapater8  // 如果主分支上对应的分支还在，则正确，否则会提示使用-D
git branch -D Chapater8  // 小心使用，此时可能主分支已被删除，本地是唯一一份代码
```



```shell
[shkzhang@recycler:~/llvm_project]$ git branch -d shkzhang_alias
error: The branch 'shkzhang_alias' is not fully merged.
If you are sure you want to delete it, run 'git branch -D shkzhang_alias'.

[shkzhang@recycler:~/llvm_project]$ git branch -D shkzhang_alias
Deleted branch shkzhang_alias (was 6f20505fcb9).
```



### 错误  

```shell
remote refs do not exist

https://blog.csdn.net/harryptter/article/details/58129187
解决的方法是 在git 命令行终端输入 git fetch -p origin
```



## 5. rm

##### 删除单个文件

```shell
git rm test.txt 
```



删除多个文件

```shell
rm test.txt test1.txt  // 正常的用rm命令删除
git add --all .        // 添加进来，正常情况下git add不会添加删除的文件，这里加上--all后，会将删除的文件也加进来。
```





#  6. set multiple comments

```shell
which vim
git config --global core.editor "/usr/bin/vim"
git commit # Then vim will open a new window

```



## 设置commit模板

```shell
git config --global commit.template gitcommit_template.tx
```



```shell
cat gitcommit_template.txt

type(模板)：标题

JIRA-ID: ABC000
soulution:
rootcause:


git commit 格式:
type(模块):标题                           ------必填       （常用  feat: 新特性 fix: 修改问题 refactor: 代码重构docs: 文档修改 style: 代码格式修改 test: 测试用例修改 chore: 其他修改， 比如构建流程， 依赖管理revert: 用于撤销以前的 commit ）
JIRA-ID:ABC-XXXX                       ------必填      （需求JIRA ID 或 问题单JIRA ID，无JIRA，可默认ABC-0000） 超链接跳转到对应JIRA  
[rootcause]:[rootcause描述]         -------可选
[solution]:[solution描述]               -------可选

推荐使用方式，配置gitcommit_template：
```





# 7. 查看远程仓库地址

```shell
git remote -v
```

# 8. git form one address to another address
```shell
git clone  /gsa/tlbgsa/projects/x/xlanalytics/public/gromacs/gromacs-2016-rc3/.git/
cd gromacs-2016-rc3/
git remote rm origin
git remote add origin git@github.ibm.com:compiler-oob2/gromacs-2016-rc3.git
git push -u origin master
```


# 9. git local
Create the git log
```shell
rm -rf .git
git init
git add *
git commit -m "first"
git push
```



# 10. git checkout -f

`git checkout -f`, `-f`会强制删除本地冲突，一定要非常小心，只对那些想删除的分支做此操作。

```shell
If you are in shkzhang_merge, you want to remove shkzhang_merge branch. shkzhang-dev is the local branch.
git checkout shkzhang-dev
If you get some error said, you cann't remove this branch.
You can use 
git checkout -f
git checkout shkzhang-dev
git branch -d shkzhang-dev
```



# 11 git push

`git push <远程主机名> <本地分支名>:<远程分支名>`

https://www.yiibai.com/git/git_push.html

https://www.cnblogs.com/zhouj850/p/7260558.html

https://blog.csdn.net/weixin_35955795/article/details/54314528

```shell
$ git push origin
```

上面命令表示，将当前分支推送到origin主机的对应分支。 

如果当前分支只有一个追踪分支，那么主机名都可以省略。 



```shell
$ git push 
```

如果当前分支与多个主机存在追踪关系，那么这个时候-u选项会指定一个默认主机，这样后面就可以不加任何参数使用git push。



```shell
$ git push -u origin master 
```

上面命令将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push了。

### matching（匹配所有分支）

`matching` 参数是 Git 1.x 的默认参数，也就是老的执行方式。其意是如果你执行 git push 但没有指定分支，它将 push 所有你本地的分支到远程仓库中对应匹配的分支。

### simple（匹配单个分支）(推荐方式)

`simple`参数是 Git 2.x 默认参数，意思是执行 git push 没有指定分支时，只有当前分支会被 push 到远程仓库。

如果我们想使用matching方式，可以在命令行输入：

```shell
git config --global push.default matching
```



如果我们想使用simple方式，可以在命令行输入：

```shell
git config --global push.default simple
```





使用时，最好使用`git push orign shkzhang_branch`,推送到指定的分支，而不是全部。 或者最好使用`simple`模式，然后可以安全的使用`git push`。







