<h1 align="center">gerrit使用技巧说明</h1>




# 一、 Changid

每一笔提交（对应commit）都会产生一个唯一的changid, gerrit 会把changid当作是一个需要单独审核的提交

# 二、使用技巧

1） 单独修改一次提交的冲突

举例：

![img](gerrit使用技巧说明.assets/-17459804516793.assets)

```Bash
# 拉取这一笔提交到本地
#使用 git fetch 拉取变更：
git fetch origin refs/changes/74/274/1

#74是变更编号的最后两位。
#274是变更编号。
#/1 是 Patch Set 的版本号。如果变更有多个 Patch Set，可以调整为最新的版本号。

#检出变更到一个新分支：

git checkout -b <new-branch-name>  FETCH_HEAD
```

实际输出：

![img](gerrit使用技巧说明.assets/-17459804516761.assets)

![img](gerrit使用技巧说明.assets/-17459804516772.assets)

2）当出现原有的commit 对应提交被丢弃，导致后续的 commit 对应的提交无法合并

现在gerrit 是基于一笔笔提交的， 所以建议每个commit 都是基于最新的主分支提交

解决步骤：

```markdown
git fetch origin refs/changes/08/608/3  # 单独拉取一笔提交：
git checkout -b test FETCH_HEAD         # 将一笔提交切到test 分支

git checkout develop
git checkotu -b feature/addxxx
git cherry-pick 4d7da549d84084a264873ca536c1a0100eec8d3e # cherry-pick一个需要提交的commit : 

# 重新生成 changid
git reset --soft HEAD^
git commit -m  "xxxx"
git push origin HEAD:refs/for/develop
```