<h1 align="center">git换仓库地址</h1>




https://my.oschina.net/u/4370754/blog/3550662

https://www.liaoxuefeng.com/wiki/896043488029600/898732864121440





#### 下面是真实的需求和例子

把从`github`上下载的llvm-project源代码，上传到内部使用的`gitlab`上。

1. 设置好ssh key(不设也行，需要输入密码)

2. 登陆到github/gitlab之后，选择新建`llvm-project`新项目。不要产生REAMDE.md，不要有任何文件，因为会和即将上传的`llvm-project`有冲突。新建一个无任何文件的空项目。非空的话，最后一部使用force

3. 更改远程仓库地址


```shell
执行此操作前，在源仓库上多切换这个分支，这样这些分支的信息会下载到本地。在目的仓库上一一进行上传。


git remote -v      // 查看git对应的远程仓库地址
git branch -a  
git checkout llvm_release_100,切换各种仓库，这些仓库会被上传(比如远程remotes/origin/llvm_release_100)
git remote rm origin     // 删除关联对应的远程仓库地址,这里只会有本地仓库
git remote -v     // 查看是否删除成功，如果没有任何返回结果，表示OK
git remote add origin git@192.168.5.11:kang.zhang/llvm-project.git // 重新关联git远程仓库地址，这里使用git地址，不要使用https地址，否则可能需要输入用户名和密码。
git push -u origin master    // 这里可能只会上传master分支，其它分支需要切换过去才行。

git push -u origin --all   // 所有本地分支分支，需要先把远程分支切换到本地才行
```





### 把所有的原来的远程分支切换到本地，并进行提交

```shell
git branch -a
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/canary
  remotes/origin/dependabot/npm_and_yarn/tools/sva/cross-spawn-7.0.6
  remotes/origin/fix-diff-crash-opstring
  remotes/origin/main
```



```shell
#!/bin/bash

# 获取所有本地分支名称
# branches=$(git branch -l | sed 's/^[ *]*//')

branches=$(git branch -r | cut -d '/' -f 2)
# git branch -r显示远程分支，如origin/dependabot/npm_and_yarn/tools/sva/cross-spawn-7.0.6
# cut -d '/' -f 2 提取 dependabot/npm_and_yarn/tools/sva/cross-spawn-7.0.6
# ，-d '/' 表示以 / 作为分隔符，-f 2- 表示提取从第 2 个字段开始到最后的所有字段。
echo $branches
for branch in $branches; do
    # 切换到当前分支
    git checkout $branch
    # 拉取最新代码
    git pull origin $branch
    # 推送当前分支到远程仓库
    git push -u origin $branch
done

```

