<h1 align="center">mkdocs gh-deploy</h1>

如果想使用`github actions`自动进行发布与部署的话，请参考[github action自动发布](./github action自动发布.md)



## `mkdocs gh-deploy` 命令详解

`mkdocs gh-deploy` 是一个专为 MkDocs 项目设计的便捷命令，其主要功能是把 MkDocs 项目自动部署到 GitHub Pages。下面为你详细介绍该命令的用法、工作机制以及相关注意要点。



### 1. 核心功能

- 它会先调用 `mkdocs build` 命令来生成静态网站文件。
- 接着，将生成的文件推送到 GitHub 仓库的 `gh-pages` 分支。
- 最终，这个静态网站会通过 `https://<username>.github.io/<repository>` 这个 URL 对外发布。



### 2. 工作机制

执行 `mkdocs gh-deploy` 命令时，会按以下步骤进行：

1. 首先在本地生成网站文件，这些文件会被存放在 `site/` 目录中。
2. 创建一个名为 `gh-pages` 的临时分支，这个分支只包含 `site/` 目录下的内容。
3. 将这个临时分支推送到 GitHub 的 `gh-pages` 分支。
4. 推送完成后，自动删除本地的临时分支。



### 3. 基础用法

使用该命令的前提是，你的项目已经和 GitHub 仓库完成关联。操作步骤如下：

```shell
# 先确保本地修改已提交到Git
git add .
git commit -m "文档更新"
git push origin main  # 或者推送到你使用的主分支

# 执行部署命令
# 执行部署（会自动创建gh-pages分支, 会自动将docs中的md文件，编译到site目录，最后将site内的文件上传到gp-pates分支）
mkdocs gh-deploy --message "文档更新"
# 如果不加message，则会自动生成message，如Deployed 1dd4d3e with MkDocs version: 1.6.1
# 建议加上message
# mkdocs gh-deploy --remote-branch my-pages-branch  推送到自定义
# 建议使用默认分支
```

由于在main分支的`.gitignore`中有`site`，所以本地的`site`目录不会被上传到主分支。



### 命令参数

`mkdocs gh-deploy` 支持以下这些参数：

- `--clean`：在构建之前，先清除 `site/` 目录下的旧文件。
- `--message '自定义提交信息'`：你可以自定义推送到 `gh-pages` 分支时的提交信息。
- `--force`：不进行任何检查，直接强制推送。
- `--remote-name <远程仓库名>`：指定要推送的远程仓库名称，默认是 `origin`。
- `--remote-branch <分支名>`：指定目标分支，默认是 `gh-pages`。

