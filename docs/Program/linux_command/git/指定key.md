<h1 align="center">指定key</h1>
https://www.cnblogs.com/chenkeyu/p/10440798.html（重点参考）

https://gist.github.com/jexchan/2351996

https://www.jianshu.com/p/ddd3122cb351

https://keysaim.github.io/post/git/2017-08-15-how-to-git-with-specific-ssh-key/



### 1 根据不同的Host选择使用不同的key

多个人使用同一终端时，该方法是不管用的。

`HostName`可以是不同的

```shell
Host personal.github.com  
    HostName github.com  
    User git  
    IdentityFile ~/.ssh/personal_rsa  
    
Host work.github.com  
    HostName github.com  
    User git  
    IdentityFile ~/.ssh/work_rsa  
```





### 2 次佳解决方案(已试可用)

该方法只是指定了私钥的位置，但config未设置，所以`.ssh`目录下的config等是无法生效的。仍会使用`~/.ssh/config`。应该使用项目下的config文件。

#### 2.1 原理

环境变量`GIT_SSH_COMMAND`：

从Git版本2.3.0可以使用环境变量`GIT_SSH_COMMAND`，如下所示：

```shell
# git 2.7.4 测试成功
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_example" git clone example
```



请注意，`-i`有时可以被您的配置文件覆盖，在这种情况下，您应该给SSH一个空配置文件，如下所示：

```shell
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_example -F /dev/null" git clone example
```



### 配置`core.sshCommand`：

从Git版本2.10.0，您可以配置每个repo或全局，所以您不必再设置环境变量！

```shell
git config core.sshCommand "ssh -i ~/.ssh/id_rsa_example -F /dev/null"
 
git pull
 
git push
```



#### 2.2 真实使用案例

`cat ~/zhangkang/workspace/bashrc`

```shell
# git 2.7.4 测试成功
export GIT_SSH_COMMAND="ssh -i /home/lynxi/zhangkang/workspace/.ssh/id_rsa" git clone example
```



```shell
~/zhangkang/workspace/bashrc
```



此时可用 `git config --local --list` 和`git --config --list`查看

```shell
user.email=kang.zhang@lynxi.net   // 重点行
user.name=kang.zhang              // 重点行
core.editor=vim
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true
remote.origin.url=https://github.com/llvm/llvm-project.git   // 重点行
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.master.remote=origin
branch.master.merge=refs/heads/master
branch.release/11.x.remote=origin
branch.release/11.x.merge=refs/heads/release/11.x
```



如果`user.email`和`user.name`不是预期用户，则要进行相应的修改。注意修改时，最好不要用`global`参数，使用`local`只对自己拥有的代码有效。

```shell
git config --local core.editor.vim
git config --local push.default simple
git config --local user.name "kang.zhang"
git config --local user.email "kang.zhang@lynxi.net"

```





设置好`GIT_SSH_COMMAND`后，从github下载代码







### 3  第三种解决方案

没有直接的方法告诉`git`哪个私钥要使用，因为它依赖于`ssh`进行存储库认证。但是，仍有几种方法可以实现您的目标：

##### 3.1：`ssh-agent`

您可以使用`ssh-agent`临时授权您的私钥。

例如：

```shell
$ ssh-agent sh -c 'ssh-add ~/.ssh/id_rsa; git fetch user@host'
```

##### 3.2`GIT_SSH_COMMAND`

使用`GIT_SSH_COMMAND`环境变量(Git 2.3.0+)传递ssh参数。

例如：

```shell
GIT_SSH_COMMAND='ssh -i ~/.ssh/id_rsa -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'

git clone user@host
```



您可以在一行中输入所有内容，省略``。

##### 3.3`GIT_SSH`

使用`GIT_SSH`环境变量传递ssh参数。

例如：

```shell
echo 'ssh -i ~/.ssh/id_rsa -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no $*' > ssh

chmod +x ssh

GIT_TRACE=1 GIT_SSH='./ssh' git clone user@host
```



注意：上面的行是你应该粘贴到你的终端的shell(终端)命令行。他们将创建一个名为`ssh`的文件，使其可执行，并(间接)执行它。

##### 3.4`~/.ssh/config`

使用其他答案中建议的`~/.ssh/config`文件，以指定您的私钥的位置。

 

### 4 第四种方案

编写一个使用所需参数调用`ssh`的脚本，并将脚本的文件名放在`$GIT_SSH`中。或者将您的配置放在`~/.ssh/config`中。

 

### 5 第五种方案

在与`$GIT_SSH`斗争之后，我想分享一下对我有用的东西。

通过我的例子，我会假设你的私钥位于`/home/user/.ssh/jenkins`

##### 错误避免：GIT_SSH值包括选项

```shell
export GIT_SSH="ssh -i /home/user/.ssh/jenkins"
```

或者任何类似的将失败，因为git将尝试将该值作为文件执行。因此，您必须创建一个脚本。

##### $GIT_SSH脚本`/home/user/gssh.sh`的工作示例

脚本将被调用如下：

```shell
$GIT_SSH [username@]host [-p <port>] <command>
```

工作示例脚本可能如下所示：

```shell
#!/bin/sh

ssh -i /home/user/.ssh/jenkins $*
```



注意`$*`到底是它的重要组成部分。

甚至更安全的选择，这将防止任何与您的默认配置文件中的任何可能的冲突(加上明确提及要使用的端口)将是：

```shell
#!/bin/sh

ssh -i /home/user/.ssh/jenkins -F /dev/null -p 22 $*
```



假设脚本在`/home/user/gssh.sh`中，那么你将：

```shell
export GIT_SSH=/home/user/gssh.sh
```

所有人都应该工作。

 

### 6 第六种方案

如果您不想在每次运行git时指定环境变量，则不要再使用另一个包装器脚本，不要/不能运行ssh-agent(1)，也不想为此下载另一个包，请使用git-remote-ext(1 )外部运输：

```shell
git clone 'ext::ssh -i $HOME/.ssh/alternate_id git.example.com %S /path/to/repository.git'

Cloning into 'repository'
(...)

cd repository

git remote -v

origin ext::ssh -i $HOME/.ssh/alternate_id git.example.com %S /path/to/repository.git (fetch)

origin ext::ssh -i $HOME/.ssh/alternate_id git.example.com %S /path/to/repository.git (push)
```



我认为这个解决方案是优越的，因为：

- 它是存储库/远程特定的
- 避免包装脚本膨胀
- 不需要SSH代理 – 如果您想要无人值守的克隆/推/拉(例如在[cron](https://www.baidu.com/s?wd=cron&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd))
- 当然，没有外部工具需要

 

### 7第七种方案

您可以使用ssh-ident而不是创建自己的包装器。

您可以阅读更多：[https://github.com/ccontavalli/ssh-ident](https://gxnotes.com/link.php?target=https%3A//github.com/ccontavalli/ssh-ident)

它首次需要加载ssh密钥，一次，即使是多个登录会话，xterms或NFS共享的家庭。

使用一个微小的配置文件，它可以自动加载不同的密钥，并根据您需要做的事情将它们分隔在不同的代理(代理转发)中。

 

### 8 第八种方案

在`~/.ssh/config`中使用自定义主机配置，如下所示：

```shell
Host gitlab-as-thuc

HostName git.thuc.com

User git

IdentityFile ~/.ssh/id_rsa.thuc

IdentitiesOnly yes
```



然后使用您的自定义主机名：

```shell
git remote add thuc git@gitlab-as-thuc:your-repo.git  
```









