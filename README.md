# 欢迎 — ken 的个人技术博客

这是一个使用 MkDocs + Material 主题构建的静态博客/知识库，内容以编程语言、编译器和相关技术笔记为主。

主要目的：为个人技术笔记提供可搜索、可发布到 GitHub Pages 的静态网站，同时保留文档源码（`docs/`）用于编辑和版本管理。

主要文件/目录
- `docs/` — 文章与笔记的 Markdown 源文件（按主题分目录，例如 `Compiler/`、`Program/`、`useful/` 等）。
- `mkdocs.yml` — MkDocs 配置（主题、插件、Markdown 扩展等）。
- `requirements.txt` — Python 依赖，用于本地构建或 CI 中安装插件。
- `.github/workflows/ci.yml` — GitHub Actions 工作流：在 `main` 分支 push 时构建并部署到 GitHub Pages。
- `site/` — MkDocs 构建出的静态站点（由 `mkdocs build` 生成；请勿手动编辑）。

本地开发与预览
1. 安装依赖：

```bash
pip install -r requirements.txt
```

2. 本地预览（实时重载）：

```bash
mkdocs serve
```

在浏览器打开：http://127.0.0.1:8000

构建与部署
- 构建静态站点：`mkdocs build`，输出到 `site/`。
- CI（自动部署）：仓库的 `.github/workflows/ci.yml` 在推送到 `main` 时会安装必要包并运行 `mkdocs gh-deploy --force` 将站点发布到 GitHub Pages。

项目约定与注意事项
- 导航由 `awesome-pages` 插件管理：请勿在 `mkdocs.yml` 中硬编码 `nav`/`pages`，以免与插件冲突。
- 常用 Markdown 扩展（pymdownx、codehilite、details 等）已在 `mkdocs.yml` 中启用；撰写文档时可使用这些扩展的语法（例如折叠、任务列表、代码高亮）。
- 内容以中文为主，技术术语可混用英文。
- 不要直接修改 `site/`，所有更改均应在 `docs/` 中进行并通过构建生成站点。

如果你想让我把 README 调整为更短的版本或加入更多具体示例（例如 CI 错误排查、常见构建问题），告诉我希望的方向，我可以继续修改.

快速本地开发（更快的 `mkdocs serve`）

如果你发现 `mkdocs serve` 每次会触发全面编译，或本地预览比较慢，可以使用仓库提供的轻量开发配置 `mkdocs.dev.yml`：

```bash
# 安装依赖（如果尚未安装）
pip install -r requirements.txt

# 使用 dev 配置运行（禁用部分耗时插件）
mkdocs serve -f mkdocs.dev.yml
```

说明：`mkdocs.dev.yml` 会在本地禁用或简化一些在生产中需要的插件（例如 `awesome-pages`、`minify`、`git-revision-date-localized` 等），以减少每次变更时的全站重建。若需预览生产构建结果，请用默认的 `mkdocs.yml`。





