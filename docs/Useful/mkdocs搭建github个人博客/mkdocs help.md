<h1 align="center">mkdocs help</h1>


# Mkdocs命令简介

```shell
Usage: mkdocs [OPTIONS] COMMAND [ARGS]...

  MkDocs - Project documentation with Markdown.

Options:
  -V, --version         Show the version and exit.
  -q, --quiet           Silence warnings
  -v, --verbose         Enable verbose output
  --color / --no-color  Force enable or disable color and wrapping for the output. Default is auto-detect.
  -h, --help            Show this message and exit.

Commands:
  build      Build the MkDocs documentation.
  get-deps   Show required PyPI packages inferred from plugins in mkdocs.yml.
  gh-deploy  Deploy your documentation to GitHub Pages.
  new        Create a new MkDocs project.
  serve      Run the builtin development server.

```



### 1. mkdocs new

该命令其实是产成docs目录下的index.md和mkdocs.yml文件。文件中的内容都是最简单的模板。

新建空目录test_mkdocs

```shell
mkdocs new test_mkdocs/

tree test_mkdocs/
test_mkdocs/
├── docs
│   └── index.md
└── mkdocs.yml

```



以下为index.md中的内容

```shell
cat test_mkdocs/docs/index.md 
# Welcome to MkDocs

For full documentation visit [mkdocs.org](https://www.mkdocs.org).

## Commands

* `mkdocs new [dir-name]` - Create a new project.
* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs -h` - Print help message and exit.

## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files.

```



### 2. mkdocs serve

启动本地服务器/远程服务器，在使用给出的地址就能访问。

```shell
mkdocs serve
INFO    -  Building documentation...
INFO    -  Cleaning site directory
INFO    -  Documentation built in 0.03 seconds
INFO    -  [11:56:48] Watching paths for changes: 'docs', 'mkdocs.yml'
INFO    -  [11:56:48] Serving on http://127.0.0.1:8000/
```





### 3. mkdocs build

该命令会根据`mkdocs.yml`中的配置信息，将`docs`中的markdown文件编译成静态html网页,并放于新产成的site目录中。




### 4. mkdocs gh-deploy

在github上进行部署，见[mkdocs gh-deploy](./mkdocs gh-deploy.md)。



