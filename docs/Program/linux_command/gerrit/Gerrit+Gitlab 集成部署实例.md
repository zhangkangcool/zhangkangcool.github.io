<h1 align="center">Gerrit+Gitlab 集成部署实例</h1>




# 一、创建Gerrit 项目工程

# 1.1 创建工程

登录账号后，点击Repositories -> CREATE NEW

![img](Untitled.assets/-174598052532729.assets)

# 1.2 配置gerrit ssh key

在 docker gerrit 容器中，创建gerrit， 并生成gerrit ssh-key (**仅第一次需要操作生成ssh -key**)

```Bash
# 进入 gerrit 容器
sudo docker ps  # 列出所有的docker容器

# 找到gerrit 容器id,并进入gerrit 容器
sudo docker exec -it <container_id_or_name> /bin/bash


git config --global user.name "gerrit"
git config --global user.email "gerrit@ljm.com"


# 在gerrit 容器中生成公私钥
ssh-keygen -t rsa -C gerrit@ljm.com
```

# 二、创建Gitlab 项目工程

- Step1: 创建和Gerrit 项目同名 的项目

![img](Untitled.assets/-17459805252907.assets)

- Step2:  在gitlab 中创建gerrit 用户（**仅第一次需要创建， 如果有gerrit 用户，就不需要重复创建）**

| gitlab账号用户名 | 密码 | 备注                       |
| ---------------- | ---- | -------------------------- |
| gerrit           | 0000 | 在gitlab 中创建gerrit 用户 |

- Step3：Gitlab 中有gerrit 用户，并为gerrit用户添加ssh key， ssh-key 在1.2章节中，去gerrit 容器中获取（**仅第一次需要添加）**

- Step4: 为Gitlab 项目添加项目成员gerrit

# 三、配置Gerrit同步项目到gitlab 

- Step1: Gerrit 项目同步到gitlab 是依赖于gerrit 中replication 插件， 请确保gerrit 安装此插件，并使能。（如果显示已经使能， 就不需要enable）

![img](Untitled.assets/-17459805252908.assets)

![img](Untitled.assets/-17459805252909.assets)

- Step2:  配置 replication 插件配置文件

在部署gerrit服务器中， 找到/opt/env_devops/gerrit/docker/gerrit/etc 目录下的replication.config, 

![img](Untitled.assets/-174598052529010.assets)

配置文件如下：

![img](Untitled.assets/-174598052529011.assets)

如上图所示， 添加了testgilab  repositority 同步配置；

**Note:** 如果需要增加其他仓库的同步， 请在replication.config， 继续添加需要同步的仓库项目

- Step3: 使 replication 配置文件生效

```Plain
sudo docker ps
docker restart <gerrit_container_id>
```

# 四、Gerrit同步项目到gitlab 测试

4.1 拉取gerrit 代码

4.2 修改代码后push

```Bash
# 提交到master上进行审核
git push origin HEAD:refs/for/master
```

如果遇到提示没有Change-id, 如下所示：

![img](Untitled.assets/-174598052529012.assets)

解决方案：

安装 `commit-msg` Hook：

Gerrit 提供了一个 `commit-msg` 钩子脚本，可以自动为提交信息添加 `Change-Id`。在项目的根目录运行以下命令，将钩子安装到 `.git/hooks/` 目录中：

```Plain
gitdir=$(git rev-parse --git-dir)
scp -p -P 29418 root@172.18.1.251:hooks/commit-msg ${gitdir}/hooks/

# 注意：如果你使用的是 OpenSSH 9.0 或更高版本，可能需要在 scp 命令中加上 -O 参数：
scp -O -p -P 29418 root@172.18.1.251:hooks/commit-msg ${gitdir}/hooks/


# 可以通过 `ssh -V` 指令查看openssh 版本
```

![img](Untitled.assets/-174598052529113.assets)

再次运行command

```Bash
git commit --amend 
git push origin HEAD:refs/for/master
```

![img](Untitled.assets/-174598052529114.assets)

将会看到new reference, 同时在gerrit web 看到changes

![img](Untitled.assets/-174598052529115.assets)

需要人工review 和投票

![img](Untitled.assets/-174598052529116.assets)

当CodeReview +2 后，就可以人工merge

![img](Untitled.assets/-174598052529117.assets)

![img](Untitled.assets/-174598052529118.assets)

去gitlab 上查看这个改动是否同步：

![img](Untitled.assets/-174598052529119.assets)

# 五、实例CP101 部署实战

## 5.1、创建Gerrit cp101工程

![img](Untitled.assets/-174598052529120.assets)

## 5.2、创建Gitlab cp101工程

创建与gerrit 上项目同名

![img](Untitled.assets/-174598052529121.assets)

添加gerrit 成员到gitlab 仓库成员中

![img](Untitled.assets/-174598052529122.assets)

## 5.3、配置Gerrit 同步项目到Gitlab cp101工程

- Step1: 配置replication config

![img](Untitled.assets/-174598052529123.assets)

增加cp101 同步配置

![img](Untitled.assets/-174598052529124.assets)

- Step2: replication.config 生效

```Bash
# 找到 gerrit 容器id
sudo docker ps

# 重启gerrit， 使repilcation.config 生效

sudo docker restart <gerrit 容器id>
```

## 5.4 Gerrit CP101项目审核测试

- Step1： 拉取代码

![img](Untitled.assets/-174598052529125.assets)

- Step2: 修改代码，提交到特定分支上进行审核

![img](Untitled.assets/-174598052529126.assets)

# 六、 Gerrit replication 插件调试技巧

## 6.1 查看log

```Bash
# 进入到gerrit 容器中, 查看log

# 找到 gerrit 容器id
sudo docker ps

# 进入到gerrit 容器中
sudo docker exec -it <gerrit 容器id> /bin/bash

# 查看 replication 插件log
cd /var/gerrit/logs
ls

#可以看到replication log
#查看是否有相关错误方便排查


# 退出gerrit 容器
exit
```

![img](Untitled.assets/-174598052529127.assets)

## 6.2 Gerrit replication error: SSH-connection Failed 

如图：

![img](Untitled.assets/-174598052529128.assets)

解决办法：

从日志来看，Gerrit 在通过 SSH 推送到 GitLab 时失败了，原因是 SSH 连接需要确认并接受目标服务器的主机密钥 (Accept and store this key, and continue connecting?)。这是由于 SSH 连接的主机密钥验证失败，JGit 无法交互式接受主机密钥。

### 解决方法

要解决这个问题，需要提前将目标主机的 SSH 密钥加入 Gerrit 容器的 `~/.ssh/known_hosts` 文件中，确保 SSH 连接能够顺利建立。

#### 方法 1: 手动添加主机密钥

```Bash
# 进入 Gerrit 容器:
docker exec -it gerrit bash

#添加目标服务器的主机密钥: 使用 ssh-keyscan 获取目标服务器的主机密钥并添加到 known_hosts 文件中
ssh-keyscan -p 2222 172.18.1.251 >> ~/.ssh/known_hosts

# 验证是否成功: 测试连接：
ssh -p 2222 git@172.18.1.251

# 确保连接成功且不会提示确认密钥。
```