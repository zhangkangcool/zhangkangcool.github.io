<h1 align="center">Gerrit + Jira集成环境</h1>




# 一、目标

**1）自动化工作流优化**

- 在 Gerrit 代码评审过程中，自动与 Jira 任务进行关联，提高代码变更的可追溯性。
- 代码提交时自动更新 Jira 任务状态，减少手动操作，提高工作效率。

**2）提高代码审核和任务管理的协同效率**

- 在 Gerrit Web 界面上显示 Jira 任务链接，使审核人员快速了解相关需求背景。
- 在 Jira 任务中自动添加 Gerrit 变更的评论，确保所有相关信息集中管理。

**3）增强代码变更的可追溯性和合规性**

- 确保所有代码提交都能关联到特定的 Jira 任务，便于后续问题排查和审计。
- 遵循开发流程要求，确保开发、审核、测试等环节无缝衔接。

**4）自动化规则触发**

- 当 Gerrit 代码变更发生特定事件（如 `Change Merged`、`Change Abandoned`）时，自动触发相应的 Jira 更新操作（如添加评论、变更任务状态）。
- 允许自定义规则，灵活适配不同团队的开发流程。

# 二、实施步骤记录

## 2.1 **拷贝** **`its-jira.jar`** **插件**

 **将插件添加到 Gerrit 的容器**

```SQL
#1. 找到运行 Gerrit 的 Docker 容器：
docker ps | grep gerrit   #记下容器 ID 或名称。

#2. 将插件文件复制到容器的 plugins/ 目录中：
docker cp <path-to-plugin>.jar <container-id>:/var/gerrit/plugins/

#3. 为了加载新插件，必须重启 Gerrit 容器
docker restart <container-id>
```

## **2.2 配置 JIRA 连接**

在部署gerrit服务器中， 找到/opt/env_devops/gerrit/docker/gerrit/etc 目录下的`gerrit.config`, 

在 `gerrit.config` 中添加：

```bash
[its-jira]
  enabled = true
  url = http://172.18.1.251:50050
  username = gerrit
  password = 123456

说明：
url：替换为你的 JIRA 服务器地址，例如 http://jira.mycompany.com
username 和 password：建议使用 API Token 而不是明文密码
如果你的 JIRA 服务器使用 JIRA Cloud，你需要在 JIRA API Tokens 生成一个 API Token
然后用：
username = admin@example.com
password = your-api-token
```

## 2.3 **修改** **`gerrit.config`**

在 /opt/env_devops/gerrit/docker/gerrit/etc 目录下的`gerrit.config`中修改 `commitlink` 规则如下：

```bash
[commentlink "its-jira"]
  match = ([A-Z0-9]+-[0-9]+)
  link = http://172.18.1.251:50050/browse/$1
  
  ### jira 问题对应链接 
  # http://172.18.1.251:50050/browse/GER-1
  # http://172.18.1.251:50050/browse/GPUEXC-7
```

##  **2.4 配置** **`actions.config`**

**规则优先级**：项目专属规则优先于通用规则。如果某个项目定义了自己的规则，则通用规则不适用于该项目。

例如：

- **全局通用规则** 应定义在 `gerrit_site/etc/its/actions.config` 文件中，以适用于所有启用 ITS 的项目。
- **全局插件专属规则** 应定义在 `gerrit_site/etc/its/actions-its-jira.config` 文件中，以适用于所有启用了 `its-jira` 集成的项目。
- **项目专属规则**（如 `P` 项目）存储在 `refs/meta/config` 分支的 `actions.config` 文件中，以适用于该项目的所有 ITS 集成。
- **项目插件专属规则**（如 `P` 项目）存储在 `refs/meta/config` 分支的 `actions-its-jira.config` 文件中，仅适用于该项目的 `its-jira` 集成。

```java
# 通用 actions.config 配置，适用于 its-jira 插件
[rule "patchset-created"]
    event-type = patchset-created
    action = add-standard-comment
    
[rule "change-merged"]
    event-type = change-merged
    action = add-standard-comment
    #action = transition Resolved  # 在 Jira 中将关联 issue 置为 "Resolved"

[rule "change-abandoned"]
    event-type = change-abandoned
    action = add-standard-comment
    #action = transition Rejected  # 在 Jira 中将 issue 状态更改为 "Rejected"

[rule "change-restored"]
    event-type = change-restored
    action = add-standard-comment
    #action = transition In Progress  # 变更恢复时，将 Jira issue 置为 "In Progress"


####暂时没有添加
[rule "negative-code-review"]
    event-type = comment-added
    approvalCodeReview = -2,-1
    action = add-comment A negative code review has been added in Gerrit.

[rule "positive-code-review"]
    event-type = comment-added
    approvalCodeReview = +2
    action = add-comment The change received a +2 Code-Review in Gerrit.

[rule "work-in-progress"]
    event-type = work-in-progress-state-changed
    action = add-comment The Gerrit change was marked as Work In Progress.
    action = transition In Progress  # 在 Jira 中同步变更状态

[rule "private-state-changed"]
    event-type = private-state-changed
    action = add-comment The Gerrit change visibility was modified.

[rule "ref-updated"]
    event-type = ref-updated
    action = add-comment A reference update occurred in Gerrit.

[rule "comment-added"]
    event-type = comment-added
    action = add-comment A new comment was added in Gerrit.
    
    
    
说明：
event-type = change-merged: 当变更被合并时，添加标准评论，并在 Jira 中将 issue 置为 Resolved。
event-type = change-abandoned: 变更被放弃时，添加评论，并在 Jira 中将 issue 状态改为 Rejected。
event-type = change-restored: 变更恢复时，添加评论，并将 Jira issue 置为 In Progress。
event-type = comment-added: 当评论被添加时：
如果 Code-Review 评分为 -2 或 -1，则添加一条负面评审的评论。
如果 Code-Review 评分为 +2，则添加一条正面评审的评论。
event-type = patchset-created: 当新的 patchset 被上传时，添加评论。
event-type = work-in-progress-state-changed: 当 Gerrit 变更被标记为 Work In Progress 时，在 Jira 同步状态。
event-type = private-state-changed: 当 Gerrit 变更的可见性发生变化时，记录评论。
event-type = ref-updated: 记录 Gerrit 代码库的 ref 变更。
event-type = comment-added: 任何评论的新增都会触发 Jira 记录。
你可以根据你的具体需求调整 transition 的状态名，例如 Resolved、Rejected、In Progress，以匹配 Jira 的工作流配置。
```

##  **2.5 配置** **`project.config`****使能 its-jira**

使能its-jira: To enable the Jira integration for a project the project must have the following entry in its `project.config` file:

```Plain
[plugin "its-jira"]
    enabled = true
```

![img](Gerrit + Jira集成环境.assets/-1745980626114155.assets)

具体修改操作流程：

```Plain
git clone "ssh://root@172.18.1.251:29418/All-Projects" && (cd "All-Projects" && mkdir -p `git rev-parse --git-dir`/hooks/ && curl -Lo `git rev-parse --git-dir`/hooks/commit-msg http://172.18.1.251:50071/tools/hooks/commit-msg && chmod +x `git rev-parse --git-dir`/hooks/commit-msg)
cd All-Projects
git fetch origin refs/meta/config:refs/remotes/origin/meta/config
git checkout meta/config

# 修改project.config
增加如下字符：
[plugin "its-jira"]
    enabled = true
    
    
 # 保持 提交
git add .
git commit -m "Add its-jira"
git push origin HEAD:refs/meta/config
```

![img](Gerrit + Jira集成环境.assets/-1745980626114149.assets)

# 三、 Gerrit+jira 联动使用说明

## 3.1  Gerrit 链接Jira

在提交的commit message 中包含对应的Jira-ID:

\1) Jira-ID可以从jira 页面中找到

![img](Gerrit + Jira集成环境.assets/-1745980626114150.assets)

\2) 提交的commit message包含Jira-ID

![img](Gerrit + Jira集成环境.assets/-1745980626114151.assets)

3）提交到gerrit 中进行审核，可以在gerrit 页面看到对应Jira-ID问题链接

![img](Gerrit + Jira集成环境.assets/-1745980626114152.assets)

## 3.2  Jira中可看到Gerrit push/merged等信息

![img](Gerrit + Jira集成环境.assets/-1745980626114153.assets)

# 四、常见问题

1）gerrit error_log中提示没有its-jira 配置或者配置不对

/var/log/gerrit/error_log

![img](Gerrit + Jira集成环境.assets/-1745980626114154.assets)

原因：**`gerrit.config`****中没有成功配置its-jira 连接配置**

```java
[its-jira]
  enabled = true
  url = http://172.18.1.251:50050
  username = gerrit
  password = 123456
  
[commentlink "its-jira"]
  match = ([A-Z0-9]+-[0-9]+)
  link = http://172.18.1.251:50050/browse/$1
```

2）一定要配置**`project.config`**使能 its-jira

要配置**`project.config`**使能 its-jira，增加如下配置， 否则`actions.config`不生效， 无法在jira中添加comment.

# 五、参考链接

https://www.jianshu.com/p/860eb0502bfc

https://help.gitkraken.com/git-integration-for-jira-cloud/gerrit-gij-cloud/

https://github.com/GerritCodeReview/plugins_its-jira

https://gerrit.googlesource.com/plugins/its-jira/

https://blog.csdn.net/scm002/article/details/84830945

官方gerrit:

https://gerrit-review.googlesource.com/admin/repos

官方插件仓库

https://www.gerritcodereview.com/plugins.html

插件下载：

https://blog.csdn.net/qq_15371293/article/details/128844347

官方编译下载

https://gerrit-ci.gerritforge.com/job/plugin-its-jira-bazel-master-stable-3.10/1/console

官方配置流：

https://community.cirata.com/s/article/Guide-to-ITS-Jira-plugin-with-Gerrit