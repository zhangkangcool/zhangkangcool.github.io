# About

这里是 ken 的个人技术博客和知识库，使用 MkDocs + Material 构建，主要用于整理编译器、编程语言、工具链、系统环境、网络配置以及日常实践笔记。

这个站点的目标不是写成完整教程，而是把平时调研、实验、排错和阅读源码时形成的记录沉淀下来，方便后续搜索、引用和继续补充。

## 内容范围

- [Compiler](Compiler/index.md)：编译器、LLVM、GCC、工具链、交叉编译和优化相关笔记。
- [Program](Program/index.md)：编程语言、开发工具、Linux 命令、脚本、机器学习和工程实践。
- [System](System/index.md)：MacOS、Linux 系统安装、软件安装和桌面环境配置。
- [Device](Device/index.md)：路由器、串口、U 盘、数字设备、树莓派和外设相关记录。
- [Network](Network/index.md)：VPN、代理、HTTP、域名服务器、网络配置和安全查询。
- [Knowledge](Knowledge/index.md)：博客搭建、专利、论文、Office、学习资源和虚拟货币笔记。
- [Life](Life/index.md)：理财、抢购等生活类记录。
- [Entertainment](Entertainment/index.md)：游戏、音乐、电视等娱乐内容。

## 项目结构

- `docs/`：所有文章与笔记的 Markdown 源文件，站点导航主要由这里的目录结构决定。
- `mkdocs.yml`：MkDocs 主配置，包含主题、插件、Markdown 扩展和站点信息。
- `mkdocs.dev.yml`：本地开发用配置，适合更快地启动预览。
- `requirements.txt`：本地构建和 CI 需要的 Python 依赖。
- `site/`：构建产物，由 `mkdocs build` 生成，不建议手动编辑。

## 本地预览

安装依赖：

```bash
pip install -r requirements.txt
```

使用默认配置预览：

```bash
mkdocs serve
```

如果只想快速预览内容，可以使用轻量开发配置：

```bash
mkdocs serve -f mkdocs.dev.yml
```

默认访问地址是 <http://127.0.0.1:8000>。

## 构建与部署

构建静态站点：

```bash
mkdocs build
```

仓库配置了 GitHub Pages 部署流程，推送到 `main` 后会通过 CI 构建并发布站点。所有内容修改都应优先落在 `docs/` 下，再由 MkDocs 生成最终页面。

## 写作约定

- 内容以中文为主，技术术语可以保留英文。
- 新文章优先放入已有主题目录；如果现有目录不合适，再新增清晰的二级目录。
- 顶层目录保持克制，避免重新出现 `Useful`、`Other` 这类过于宽泛的分类。
- 图片和附件建议放在文章同名 `.assets/` 目录中，便于迁移和维护。
- 不直接修改 `site/`，也不把构建产物当作源文件维护。

## 联系方式

维护者：ken

邮箱：<691386092@qq.com>
