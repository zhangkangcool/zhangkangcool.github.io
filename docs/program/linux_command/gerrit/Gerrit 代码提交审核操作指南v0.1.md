



# 一、创建Gerrit 账号

- Step1: 联系管理员创建gerrit账号， 账号密码请到 [Gerrit 账号管理](https://kpxqks2w6z.feishu.cn/wiki/LO9cwfPFTi5YKVkZM5GcDSa7nub)查找
- Step2: 登录gerrit

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726121.assets)

输入密码登录

![img](Gerrit 代码提交审核操作指南v0.1.assets/-174598059072595.assets)

- Step3： 添加ssh key

![img](Gerrit 代码提交审核操作指南v0.1.assets/-174598059072596.assets)

![img](Gerrit 代码提交审核操作指南v0.1.assets/-174598059072597.assets)

注意：添加ssh key为开发机本地ssh key

![img](Gerrit 代码提交审核操作指南v0.1.assets/-174598059072598.assets)

# 二、拉取代码

- Step1: 找到repositories,  下面以cp101 为例。

![img](Gerrit 代码提交审核操作指南v0.1.assets/-174598059072599.assets)

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590725100.assets)

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590725101.assets)

- Step2: 完整的复制clone command, 在终端中运行，拉取代码。

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590725102.assets)

# 三、修改提交代码

- Step1： 可以在本地从默认的develop 分支切出自己本地开发的分支， 进行修改

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590725103.assets)

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726104.assets)

- Step2: 提交改动到gerrit 特定分支上进行审核

```Bash
# 提交到refs/for/develop 进行审核
git push origin HEAD:refs/for/develop    


```

git push <remote 名字> <本地分支的名字> : <远程库的名字>

git push origin HEAD:refs/for/xxx

origin : 是远程的库的名字

HEAD: 是一个特别的指针，它是一个指向你正在工作的本地分支的指针，可以把它当做本地分支的别名，git这样就可以知道你工作在哪个分支。

注意事项：

1. 如果遇到提示没有change-id, 请参考常见问题 6.1 章节
2. 请确保每一笔提交有相应的chang-id, 才能提交成功
3. 提交改动到gerrit 特定分支上进行审核， 请严格按照 step2 对应的分支名refs/for/develop   



在分支上多次提交会自动形成依赖

```
git checkout -b test
git commit -m "First commit"
git push origin HEAD:refs/for/develop 


git commit -m "Second commit depend on A"
git push origin HEAD:refs/for/develop 

在Relation Chain和Submitted together上能看到依赖
```



# 四、人工审核

Step1: 点击changes, 查看提交的改动

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726105.assets)

Step2: 可以审核评论，提交建议

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726106.assets)

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726107.assets)

个人审核完成后， 可以点击 reply

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726108.assets)

出现评分选项， 并提交建议

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726109.assets)

需要注意几点：

1）合并代码需要Code-Review的”+2”和Verified的”+1”才能使用合并功能

2）CodeReview的所有选项和Verified的所有选项可以根据团队配置来分配，也可以都由一个人来做。一般情况：CodeReview的+1/-1对应初级审核，+2/-2对应更上一级审核；Verified就是合并之前的确认的。

可以在项目 Access 中就行管理

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726110.assets)

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726111.assets)

当出现 Code-Review +2 时， 就会出现Ready to submit,  再由项目owner 或者拥有 submit 权限的人就行 submit

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726112.assets)

# 五、管理员Merge MR

项目管理员进行submit

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726113.assets)

就会出现 Merged

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726114.assets)

然后在gitlab 上就会看到最新的改动

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726115.assets)

# 六、常见问题

## 6.1 提示没有chang-id

如果遇到提示没有Change-id, 如下所示：

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726116.assets)

解决方案：

安装 `commit-msg` Hook：

Gerrit 提供了一个 `commit-msg` 钩子脚本，可以自动为提交信息添加 `Change-Id`。在项目的根目录运行以下命令，将钩子安装到 `.git/hooks/` 目录ls

**Note:**

根据个人使用不同的账号，需要对应上图中出现的提示修改相应的指令： 如本次操作中是使用了root 账号， 所以下面的command 提示中出现root, 如果使用其他个人账号，请根据提示修改相应的安装指令。

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726117.assets)

```Plain
gitdir=$(git rev-parse --git-dir)
# 注意：需将root切换为自己的用户名
scp -p -P 29418 root@172.18.1.251:hooks/commit-msg ${gitdir}/hooks/ 

# 注意：如果你使用的是 OpenSSH 9.0 或更高版本，可能需要在 scp 命令中加上 -O 参数：
scp -O -p -P 29418 root@172.18.1.251:hooks/commit-msg ${gitdir}/hooks/


# 可以通过 `ssh -V` 指令查看openssh 版本
```

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726118.assets)

再次运行command

```Bash
git commit --amend --no-edit
git push origin HEAD:refs/for/develop
```

## 6.2 提示没有Email未注册

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726119.assets)

解决办法：

在对应的仓库管理权限中， Forge committter identity 增加对应的用户即可

![img](Gerrit 代码提交审核操作指南v0.1.assets/-1745980590726120.assets)

# 七、实用tips

## 7.1 切换到刚提交的commit id

```Bash
####  Powershell 环境

git clone "http://jenkins:0000@172.18.1.251:50070/testgilab"

cd testgilab

git fetch origin $refSpec # GERRIT_REFSPEC 对应refs/changes/33/233/9       
git checkout $patchsetRevision  # GERRIT_PATCHSET_REVISION  对应64d5c9cdb10ac64a1c34d4ff8b0aeb675725f990， 也就是最新的commit       
# 获取当前 commit ID
$currentCommit = git rev-parse  HEAD

# 打印当前 commit 信息
Write-Host "Current commit ID: $currentCommit"
# 输出当前工作目录
Write-Host "Current Directory: $(Get-Location)"




# 打印所有环境变量
Get-ChildItem Env:

# 打印特定的环境变量，例如 GERRIT_PROJECT
Write-Host "GERRIT_PROJECT: $env:GERRIT_PROJECT"

# 从 Gerrit 获取变更集的具体提交
$gerritProject = $env:GERRIT_PROJECT
$patchsetRevision = $env:GERRIT_PATCHSET_REVISION
$refSpec = $Env:GERRIT_REFSPEC
Write-Host "Project: $gerritProject"
Write-Host "Patchset Revision: $patchsetRevision"
```

# 八、更多信息参考

官方指导文档：

https://gerrit-review.googlesource.com/Documentation/access-control.html