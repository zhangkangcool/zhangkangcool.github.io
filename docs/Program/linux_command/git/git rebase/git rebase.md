# git rebase






```
git rebase
```



如果有冲突，解决完冲突后，使用

```
git add conflict_file
git rebase --continue
```



冲突文件也是会自动合并的，不过合并冲突的地方，会使用--head等标记，重点对这些地方进行选择修改。







更新我现在 在 dev 分析，dev 从 master checkout 而来，现在 master 又有人交了代码，我怎么同步到我的 dev 分析，我需要先切换到 master , 然后  git pull, 然后 切换到 dev, 然后 rebase msater 吗





先把结论先说清楚： 你的思路**大体正确**，但有更简洁、稳妥的完整流程，同时区分两种场景：**普通开发（推荐 rebase）**、Gerrit 环境下的注意事项。

> 当前状态：
>
> - `dev` 从旧版 `master` 切出来
> - `origin/master` 已有别人新提交
> - 你想把上游 master 最新代码同步到自己 dev 分支

## 方案 1：你描述的传统步骤（可行）

```
# 1. 切master
git checkout cix_master
# 2. 更新远端最新
git pull origin cix_master
# 3. 切回你的dev分支
git checkout dev
# 4. 把dev所有提交rebase在最新master之上
git rebase cix_master
```

## 方案 2：更简洁、不用来回切分支（推荐）

不用切进 master，直接拉取远端然后 rebase：

```
# 确保拿到远端最新提交（刷新本地origin/*缓存）
git fetch origin
# 在dev分支直接rebase远端master
git rebase origin/cix_master
```

✅ 优势：不用切换 master、不用执行 git pull，避免不小心在 master 产生不必要的合并提交。

> 原理： `git pull = git fetch + git merge` 很多人不建议在公共主干 master 随便 git pull，容易多出 merge 节点。



-----

```
it fetch origin
git rebase cix\_master
这样可以吗，你刚说的是
git fetch origin
git rebase origin/cix\_master
```



先说核心结论：**两者不一样，推荐用 `git rebase origin/cix_master`，不推荐 `git rebase cix_master`**

### 1. 两条命令区别

```
git fetch origin
git rebase cix_master
```

- `git fetch` 只会刷新本地的 `remotes/origin/*` 远端快照
- **但是 `cix_master` 是你的【本地分支】**
- `git fetch 不会自动更新你本地的 cix_master！`

👉 风险： 你本地 `cix_master` 有可能还是旧版本，哪怕远端已经更新了。 此时 rebase 只是基于**本机陈旧的 cix_master**，没有拿到远端最新代码。

```
git fetch origin
git rebase origin/cix_master
```

- `origin/cix_master` = fetch 之后已经更新完成的远端镜像
- **不需要切换、不需要更新本地 cix_master**，直接拿远端最新基准 ✅ 这是最稳妥、一步到位的写法。

### 2. 如果你非要写 `git rebase cix_master`，必须补齐一步

想要等价效果，得手动更新本地master：

```
git checkout cix_master
git pull origin cix_master    # 更新本地cix_master到远端最新
git checkout dev
git rebase cix_master
```

这套就是你最开始设想的流程，可行，但是多来回切换分支。

### 3. 最简最优方案（你当前在 dev 分支，直接执行）

```shell
git fetch origin
git rebase origin/cix_master
# git rebase origin/cix_rls_perf_resnet50
```

不用切任何分支，没有多余操作，基准一定是远端最新主干。

### 4. Gerrit额外提醒

rebase成功后，推送评审依旧使用标准gerrit命令：

```
git push origin HEAD:refs/for/dev
```

### 一句话记忆

- `origin/xxx`：fetch后就是最新远端代码（首选）
- 本地分支名 `xxx`：必须手动pull才能同步远端，否则可能陈旧。





