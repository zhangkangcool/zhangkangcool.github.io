请将 Noto Sans SC 字体文件放到本目录（docs/assets/fonts/）。

推荐下载来源：Google Noto 官方仓库或 Google Fonts（遵循其授权）。

建议文件及命名：
- NotoSansSC-Regular.woff2
- NotoSansSC-Bold.woff2

也可提供 ttf 备选：
- NotoSansSC-Regular.ttf
- NotoSansSC-Bold.ttf

在放好字体文件后，mkdocs 会在构建或本地预览时加载它们。若希望使用外部 CDN（例如 Google Fonts），可以替代将 @import 或 <link> 放在 `docs/index.md` 的自定义 head 中。

注意：请确保这些字体文件不违反任何分发条款。