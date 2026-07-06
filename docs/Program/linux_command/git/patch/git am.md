# git am

下面是同事拿到三个 patch 后的应用方法总结：

## 推荐方式：`git am`（保留作者、提交信息）

```bash
cd path/to/your/repo

# 1. 确保工作区干净
git status

# 2. 依次应用三个 patch
git am 0001-*.patch 0002-*.patch 0003-*.patch

# 简便写法（文件名本身按 0001/0002/0003 有序）
git am *.patch
```

这样做的好处：会保留原始的 commit message、作者、日期，直接在同事仓库里生成三个新 commit。

## 备选方式：`git apply`（只打改动，不创建 commit）

```bash
git apply 0001-*.patch 0002-*.patch 0003-*.patch
```

适合同事想自己审阅改动、重新组织提交的情况。

## 常用辅助操作

- **应用前先预检能否干净应用**：
  ```bash
  git apply --check 0001-*.patch 0002-*.patch 0003-*.patch
  ```
- **应用后查看历史**：
  ```bash
  git log --oneline -3
  ```

## 冲突处理

`git am` 中途遇到冲突时：

```bash
# 1. 查看冲突文件
git status

# 2. 手动解决冲突后
git add <冲突文件>

# 3. 继续应用下一个 patch
git am --continue

# 若想放弃，回到应用前状态
git am --abort
```

## 注意事项

1. **顺序很重要**：`git format-patch -3` 生成的文件名带 `0001/0002/0003` 序号，按顺序应用即可，不要打乱。
2. **基础要一致**：同事的分支起点最好和你生成 patch 时基于的提交一致，否则容易在 `git am` 时出现冲突。
3. **建议先用 `--check` 预检**，避免应用到一半才发现冲突。