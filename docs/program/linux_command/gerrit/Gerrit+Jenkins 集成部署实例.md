



# 一、 创建jenkins 用户

在gerrit 中创建jenkins 用户,参考 [Gerrit 账号管理](https://kpxqks2w6z.feishu.cn/wiki/LO9cwfPFTi5YKVkZM5GcDSa7nub)。

# 二、 jenkins 安装gerrit 相关插件

## 2.1 从jenkins 官网下载对应版本的 plugins

Jenkins 版本2.415

- Gerrit Trigger
  -  v2.39.3

  -  [Gerrit TriggerVersion2.39.3](https://plugins.jenkins.io/gerrit-trigger)
- Gerrit Code Review

v0.4.8

[Gerrit Code ReviewVersion0.4.8](https://plugins.jenkins.io/gerrit-code-review)

- Gerrit Verify Status Reporter

V0.0.3

[Gerrit Verify Status ReporterVersion0.0.3](https://plugins.jenkins.io/gerrit-verify-status-reporter)

- Gerrit Checks api 

[66.v3ef8b_f08f1f3](https://plugins.jenkins.io/gerrit-checks-api)

## 2.2 手动安装gerrit相关插件

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057251373.assets)

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057242153.assets)

# 三、 Gerrit上安装插件

## 3.1 Gerrit 插件安装（可选步骤）

在 Docker 部署的 Gerrit 实例中安装新的插件可以按照以下步骤操作：

**Step1：获取插件**

访问 Gerrit Plugins Repository 找到所需的插件，选择与Gerrit 版本兼容的插件并下载 `.jar` 文件。

**Step2：将插件添加到 Gerrit 的容器**

```SQL
#1. 找到运行 Gerrit 的 Docker 容器：
docker ps | grep gerrit   #记下容器 ID 或名称。

#2. 将插件文件复制到容器的 plugins/ 目录中：
docker cp <path-to-plugin>.jar <container-id>:/var/gerrit/plugins/

#3. 为了加载新插件，必须重启 Gerrit 容器
docker restart <container-id>
```

将gerrit verify-status plugin 安装

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057243554.assets)

然后重启gerrit docker

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057243555.assets)

如果插件未加载，检查日志文件：

```SQL
docker logs <container-id>
```

**这部分是配置 Gerrit的 verify-status(可选操作)：**

配置 Gerrit 容器以及 `verify-status` 插件的数据库:

Gerrit 配置文件 (`gerrit.config`) 中：

[plugin "verify-status"]

  dbType = h2

  database = /var/gerrit/db/CiDB

docker exec -it <container_id> gerrit.sh restart

**docker-compose.yml文件配置如下：**

version: '3

services:

  gerrit:

​    image: gerrit/gerrit:latest

​    container_name: gerrit

​    environment:

​      \- GERRIT_SITE=/var/gerrit

​      \- GERRIT_CONFIG_PLUGIN_verify-status__dbType=h2

​      \- GERRIT_CONFIG_PLUGIN_verify-status__database=/var/gerrit/db/CiDB

## 3.2 **Gerrit 上配置verify label**

```Plain
git clone "ssh://root@172.18.1.251:29418/All-Projects" && (cd "All-Projects" && mkdir -p `git rev-parse --git-dir`/hooks/ && curl -Lo `git rev-parse --git-dir`/hooks/commit-msg http://172.18.1.251:50071/tools/hooks/commit-msg && chmod +x `git rev-parse --git-dir`/hooks/commit-msg)
cd All-Projects
git fetch origin refs/meta/config:refs/remotes/origin/meta/config
git checkout meta/config

# 修改project.config
增加如下字符：
[label "Verified"]
    value = -1 Fails
    value = 0 No score
    value = +1 Verified
    copyCondition = changekind:NO_CODE_CHANGE
    
    
 # 保持 提交
git add .
git commit -m "Add Verified Label"
git push origin HEAD:refs/meta/config
```

当遇到如下问题： Forge author permission

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057243856.assets)

解决方案：添加Forge Author identity

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057243857.assets)

Refer to: https://notes.lzwang.ltd/DevOps/Gerrit/gerrit_add_label/#_2 https://blog.csdn.net/qq_38350702/article/details/129058773

# 四、Gerrit上jenkins配置

## 4.1 jenkins容器生成ssh-key

Step1: 进入 Jenkins Docker 容器

```Bash
docker ps  # 查找 jenkins container name or id
docker exec -it <jenkins-container-name> /bin/bash
```

Step2: 生成ssh密钥

```Bash
# 生成密钥到特定目录 /var/jenkins_home/.ssh/id_rsa
mkdir -p /var/jenkins_home/.ssh
ssh-keygen -t rsa -b 4096 -C "jenkins@ljm.com" -f /var/jenkins_home/.ssh/id_rsa
```

Step3: 添加/var/jenkins_home/.ssh/id_rsa.pub公钥到 gerrit 中的 jenkins 用户

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057244358.assets)

## 4.2 Gerrit 访问权限配置

Step1: 在Gerrit平台注册一个jenkins用户，然后设置一个SSH key (来源是4.1 章节中的ssh-key)

Step2: Gerrit Web页面，进入Browse > Groups > Service Users，将jenkins 用户添加到这个分组中。（Gerrit v3.3之前的CI组名称为Non-Interactive Us ers）

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057244359.assets)

## 4.3 Jenkins中 Gerrit server 配置， 确保Jenkins能访问gerrit

**配置Gerrit Trigger:**  Manage Jenkins >> Gerrit Trigger

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057244360.assets)

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057244861.assets)

配置完成后，点击 Test connection, 直到出现success, 说明 jenkins 能够正常访问gerrit了。

Note: Test connection, 出现success， 检查jenkins 上先 gerrit server 状态。

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057244862.assets)

当状态显示蓝绿色，表示正常工作。如果显示红色，可以重启Jenkins，再次检查 gerrit server状态和版本。

# 五、jenkins创建Gerrit job

## 5.1 jenkins 中创建 Gerrit Job

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057245363.assets)

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057245364.assets)

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057245365.assets)

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057246566.assets)

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057246667.assets)

## 5.2 Gerrit job 自动编译配置

参考文档：https://wiki.jenkins.io/display//JENKINS/Gerrit-Trigger.html

- Step1：构建触发器选择 Gerrit event, 选择 gerrit server 

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057246668.assets)

- Step2：配置项目和触发条件

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057246669.assets)

图中的type 说明：

在 **Gerrit Trigger** 插件中，配置触发器时会使用一些选项，如 **type**、**path**、和 **plain** 等。这些选项定义了触发条件和匹配方式。以下是这些选项的具体含义：

```Bash
path 用于指定需要匹配的文件路径或目录，配合 type 使用，通常与 Gerrit 提交中的 file 内容相关。
作用：通过文件路径来决定是否触发构建。
触发条件：当提交中修改了指定的文件或目录，触发器将被激活。
举例：
Path 设置为 src/main/**：
当提交中包含文件 src/main/app.c 或 src/main/utils/helper.c 的修改时，会触发构建。
Path 设置为 docs/README.md：
仅当 docs/README.md 被修改时触发。

plain
plain 是 type 的一种类型，表示对字符串进行直接匹配。
匹配逻辑：不支持通配符或正则表达式，仅当字符串完全相同时触发。
举例：
如果分支名被配置为 develop 且使用 plain，提交到 develop 分支会触发，但提交到 feature/develop-update 不会触发。

配置场景示例
1. 触发指定分支的构建
如果你希望构建仅在 develop 分支上提交时触发：
type: Plainbranch: develop
说明：当提交被推送到 develop 分支时，触发器会激活。

2. 触发特定文件修改的构建
如果你希望在项目的 src/ 目录下文件被修改时触发：
type: Pathpath: src/**
说明：当提交中修改了 src/ 目录及其子目录下的文件时，触发器会激活。

3. 使用正则匹配分支
如果你希望匹配以 feature/ 开头的所有分支：
type: RegExpbranch: ^feature/.*
说明：当提交推送到 feature/ 开头的分支（如 feature/new-feature 或 feature/bug-fix）时，触发器会激活。
```

- Step3：编译配置

需要切代码到提交的改动对应commit id,  使其针对改动编译：

关键部分：

```SQL
# 切到提交的commit id
$patchsetRevision = $env:GERRIT_PATCHSET_REVISION
$refSpec = $Env:GERRIT_REFSPEC
git fetch origin $refSpec
git checkout $patchsetRevision
```

完成的编译：

```Bash
Write-Host "SOC v2 build success!!!"

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

# Gerrit中jenkins 账号和密码
$username = "jenkins"
$password = "0000"
# git clone "http://$username:$password@172.18.1.251:50070/ljm_sdk_arm_baremetal_v2"

# 定义文件夹路径
$folderPath = "$(Get-Location)\ljm_sdk_arm_baremetal_v2"

# 检查文件夹是否存在
if (Test-Path $folderPath) {
    Write-Host "Folder '$folderPath' already exists. Deleting..."
    Remove-Item -Recurse -Force $folderPath
    Write-Host "Folder deleted successfully."
} else {
    Write-Host "Folder '$folderPath' does not exist."
}
# 拉取代码
git clone "http://jenkins:0000@172.18.1.251:50070/ljm_sdk_arm_baremetal_v2"

cd ljm_sdk_arm_baremetal_v2

# 切到提交的commit id
git fetch origin $refSpec
git checkout $patchsetRevision
# 获取当前 commit ID
$currentCommit = git rev-parse  HEAD
# 打印当前 commit 信息
Write-Host "Current commit ID: $currentCommit"
# 输出当前工作目录
Write-Host "Current Directory: $(Get-Location)"

Write-Host "******************CP101 build start*********"
python .\tool\build_baremetal.py
Write-Host "******************CP101 build end***********"
```

- Step4：暂时绕过build failure 投票导致的 无法merge（可选步骤）

**如果暂时绕过build failure 投票导致的 无法merge 可以使用如下办法**：

在jenkins 中设置skip vote, 选择fail。(使得当编译失败时候，不会vote -1)

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057246670.assets)

Note: 当需要强制检查编译失败后，不能提交时， 请不要skip vote。

# 六、问题记录

## 6.1  ssh key invalid key file

**问题：**当在jenkins 中配置gerrit server 时候，填入id_rsa 密钥文件位置时，实际在Jenkins 容器内部存在这个id_rsa 文件。

解决方法：

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057246671.assets)

需要重新在jenkins 容器中重新通过 -m PEM 生成ssh key

```Bash
#生成新的 SSH 密钥
#在容器中，为 Jenkins 用户生成新的 SSH 密钥，确保使用 PEM 格式：
ssh-keygen -t rsa -b 4096 -m PEM -C "jenkins@ljm.com" -f /var/jenkins_home/.ssh/id_rsa
#参数说明：
# -t rsa：生成 RSA 类型密钥。
# -b 4096：密钥长度为 4096 位（安全性更高）。
# -m PEM：确保生成的私钥使用 PEM 格式（兼容性更好）。
# -C "jenkins@yourdomain.com"：为密钥添加注释，便于识别。
# -f /var/jenkins_home/.ssh/id_rsa：指定密钥的保存路径。

生成完成后，你应该在 /var/jenkins_home/.ssh 目录下看到以下两个文件：
id_rsa：私钥
id_rsa.pub：公钥

# 将公钥添加到 Gerrit
登录到 Gerrit Web 界面。
cat /var/jenkins_home/.ssh/id_rsa.pub
将公钥内容复制到 Gerrit 的 SSH Keys 配置中，点击 Add 保存。

# 测试 SSH 连接
在容器中使用新的私钥测试连接到 Gerrit：

ssh -i /var/jenkins_home/.ssh/id_rsa -p 29418 jenkins@172.18.1.251
```

![img](Gerrit+Jenkins 集成部署实例.assets/-174598057246672.assets)

# 七、调试docker

```Bash
# 查看 jenkins docker status
docker ps -a | grep jenkins

# 查看 jenkins docker log
docker logs <jenkins 容器id>


# restart jenkins docker 
docker restart <jenkins 容器id>


将本机文件放到容器中
sudo docker cp ./gerrit.config <容器id>:/var/gerrit/etc/gerrit.config
```