<h1 align="center">mkdocs介绍</h1>
# Mkdocs介绍



## 引言

在无纸化信息处理的流程中，信息输入、信息整理阶段的工具选择已经很多了，雨后春笋般不断浮现的笔记工具让人眼花缭乱。但到了信息输出和展示的环节——例如发表自己的读书心得、思考或是学习笔记，或是为自己的软件项目撰写文档——现有解决方案则总有明显的遗憾之处。

一方面，如果选择语雀、Notion 这样的第三方云端文档平台来存放，定制空间就很有限，且数据始终是寄人篱下。另一方面，如果选择 WordPress 这类 CMS 或近年流行的 [Jekyll](https://sspai.com/link?target=https%3A%2F%2Fjekyllrb.com%2F)、[Hugo](https://sspai.com/link?target=https%3A%2F%2Fgohugo.io%2F) 或是 [Hexo](https://sspai.com/link?target=https%3A%2F%2Fhexo.io%2F) 等「静态网站生成器」，随之而来的技术门槛和复杂操作又容易打消人的创作和分享热情。

以我个人为例，我想通过搭建简单的静态网站来很好地展示我在学习编程过程中的所作的笔记、对问题的看法等，将它们作为一个 Cookbook 或系统化的参考文档来使用，同时也兼具美观和可读性。对此，上述主流框架都有些「杀鸡用牛刀」的感觉，那么，有没有更好的方式呢？

我遇见的答案是 [MkDocs](https://sspai.com/link?target=https%3A%2F%2Fwww.mkdocs.org%2F)。

## 什么是 MkDocs？

[MkDocs](https://sspai.com/link?target=https%3A%2F%2Fwww.mkdocs.org%2F)（**M**ar**k**down **Doc**ument**s**）是一个快速、简单的静态网站生成器，用于将 Markdown 文档组织起来构建成有层次、美观的文档站点。



MkDocs 基于 Python 编写，也贯彻了 Python 里「简洁胜于复杂」的理念，与其他常见的静态网站生成器相比，无需繁琐的环境配置（如 Jekyll 涉及的 Bundler、Gems 等），所有配置都用只有简单的一个配置文件管理，并且当中配置项的内容也仅有一页文档。

MkDocs 见名知意就是为 Markdown 而生，根据 Markdown 格式将内容渲染成美观的文档，并通过目录层级关系对应文档的树状结构，使得当中所有的文档组织分明且层次递进。



此外，简洁不等同于简单，MkDocs 还为「动手能力强」的玩家们提供了扩展的空间：我们可以进一步让更多语法特性体现在文档内容中，如为 Markdown 增加列表语法等；我们也可以对 MkDocs 构建的站点的布局样式进行二次定制和编排，使得整个站点更加美观。

MkDocs 的上述优点，让它被很多知名开源项目选中，用于搭建和项目相关的文档网站。比如 Python 里知名的 Web 圈里的 [django-rest-framework](https://sspai.com/link?target=https%3A%2F%2Fwww.django-rest-framework.org%2F)、[FastAPI](https://sspai.com/link?target=https%3A%2F%2Ffastapi.tiangolo.com%2F) 以及基于 Go 编写的云网关代理服务器 [traefik](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Ftraefik%2Ftraefik) 等项目的官方文档站点，都是通过 MkDocs 进行搭建。

当然，MkDocs 并不仅仅是开发者的玩物。由于文档的本质就是一组结构化、体系化的说明文本，任何具有这种特征的内容——例如就特定话题所做的笔记、Wiki 等——只要是使用了 Markdown 格式记录，那么用 MkDocs 来搭建一个自用的 Cookbook 或参考手册也完全不在话下。



因此，如果你和我一样是个 Markdown 爱好者并使用 Markdown 来写作或记录，并且不想花费过多时间和精力在琐碎的站点设计上，那么 MkDocs 是个不错的选择。

**注：**尽管 MkDocs 没有提供汉化翻译，但它的文档内容足够简洁明了，所以即使读者对自己的英语水平不太有信心，也可以在翻译软件的和示例项目的帮助下，快速上手并构建一个站点。





### Instll

```shell
sudo pip3 install mkdocs
```

