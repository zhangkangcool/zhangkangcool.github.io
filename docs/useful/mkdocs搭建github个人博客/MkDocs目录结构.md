



### MkDocs 项目目录结构详解

MkDocs 项目遵循特定的目录结构规范，理解这些结构有助于高效管理文档。以下是标准 MkDocs 项目的目录结构及其详细说明：

```shell
my-project/
├── docs/               # 存放文档源文件的目录（Markdown格式）
│   ├── index.md        # 主页内容（必须存在，否则报错找不到）
│   ├── about.md        # 示例页面
│   ├── getting-started.md
│   ├── images/         # 图片资源目录
│   │   └── logo.png
│   └── subfolder/      # 子目录（用于组织文档）
│       └── advanced.md
├── site/               # 自动生成的静态网站（默认忽略，无需手动编辑）
│   ├── index.html
│   ├── about/
│   │   └── index.html
│   └── assets/         # 静态资源（CSS、JS、图片等）
├── mkdocs.yml          # 项目配置文件（关键文件）
├── requirements.txt    # 依赖包列表（可选）
└── .gitignore          # Git忽略规则（建议包含site/目录）
```

### 核心目录和文件说明

#### 1. `docs/` 目录

这是存放所有文档源文件的地方，采用 Markdown 格式（`.md`）。主要特点如下：



- **index.md**：此为网站的主页，是必需文件。
- **子目录组织**：你可以使用子目录对文档进行分类，比如按主题或模块划分。
- **支持的内容**：该目录不仅能存放 Markdown 文件，还可以包含图片、CSS、JavaScript 等资源。
- 

#### 2. `mkdocs.yml` 配置文件

这是 MkDocs 项目的核心配置文件，下面是一个典型配置示例及说明：

```yaml
site_name: My Documentation  # 网站标题
site_description: A guide to using My Project  # 网站描述（用于SEO）
site_author: Your Name  # 作者信息
site_url: https://example.com/  # 网站URL（发布后使用）

# 文档导航结构（控制侧边栏）
nav:
  - Home: index.md
  - About: about.md
  - Getting Started: getting-started.md
  - Advanced Topics: 
    - Subtopic: subfolder/advanced.md

# 主题配置（可选择mkdocs、readthedocs或自定义主题）
theme:
  name: material  # 使用Material主题（需额外安装）
  logo: images/logo.png  # 自定义logo
  favicon: images/favicon.ico  # 自定义favicon

# 额外的配置选项
extra_css:  # 添加自定义CSS
  - stylesheets/extra.css
extra_javascript:  # 添加自定义JavaScript
  - javascripts/extra.js
markdown_extensions:  # 启用Markdown扩展
  - toc:
      permalink: true  # 为标题添加永久链接
  - admonition  # 支持警告框等扩展语法
```

#### 3. `site/` 目录

这个目录是在执行 `mkdocs build` 或 `mkdocs gh-deploy` 命令后自动生成的，包含了最终的静态网站文件。需要注意以下几点：

- **自动生成**：不要手动编辑该目录下的内容，因为每次构建时都会覆盖原有内容。
- **默认忽略**：建议将 `site/` 添加到 `.gitignore` 文件中，避免将生成的文件提交到版本控制。
- **部署内容**：该目录下的所有文件会被推送到 `gh-pages` 分支用于发布。

#### 4. 其他文件

- requirements.txt

  ：如果项目依赖特定的 Python 包（如主题或插件），可在此文件中列出。例如：

  ```shell
  mkdocs-material  # Material主题
  mkdocs-git-revision-date-plugin  # 显示文档修订日期的插件
  ```

- .gitignore

  ：推荐的忽略规则如下：

  ```shell
  site/  # 忽略生成的网站文件
  __pycache__/  # 忽略Python缓存
  *.pyc  # 忽略Python编译文件
  ```

### 高级目录结构示例

对于大型项目，你可以采用更复杂的目录结构，例如：

```shell
my-project/
├── docs/
│   ├── index.md
│   ├── user-guide/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   └── usage.md
│   ├── api-reference/
│   │   ├── endpoints.md
│   │   └── models.md
│   ├── tutorials/
│   │   ├── basic-tutorial.md
│   │   └── advanced-tutorial.md
│   └── assets/
│       ├── css/
│       ├── js/
│       └── images/
├── mkdocs.yml
├── requirements.txt
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions自动化部署配置
```





### 目录结构最佳实践

1. **按主题组织**：根据文档内容的主题或模块来创建子目录，比如 `user-guide`、`api-reference` 等。
2. **保持扁平结构**：避免创建过深的目录层级，建议不超过 3 - 4 级。
3. **清晰的导航配置**：在 `mkdocs.yml` 中明确配置导航结构，确保用户能够轻松找到所需内容。
4. **使用有意义的文件名**：文件名要直观反映文档内容，例如 `getting-started.md` 比 `page1.md` 更好。
5. **分离资源**：将图片、CSS、JavaScript 等资源存放在专门的目录中，便于管理。



通过遵循这些结构规范，你可以高效地管理 MkDocs 项目，同时为用户提供良好的文档浏览体验。