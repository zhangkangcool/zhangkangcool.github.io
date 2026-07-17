# git-delta安装

***\*git-delta\**** 是一个为 Git、`diff` 和 `grep` 输出打造的语法高亮分页器。它能将杂乱的终端差异输出转化为直观、色彩丰富且易于阅读的格式，支持代码高亮、并排（side-by-side）视图和行内差异（inline diff）。 [[1](https://dandavison.github.io/delta/introduction.html), [2](https://cn.x-cmd.com/pkg/delta/)]

快速安装与配置

您可以通过包管理器快速安装并在 Git 中全局启用它： [[1](https://formulae.brew.sh/formula/git-delta), [2](https://cn.x-cmd.com/pkg/delta/)]

## 1. **安装**：

- macOS: `brew install git-delta`
- Linux: `sudo apt install git-delta` 或 `pacman -S git-delta`
- 通用: `cargo install git-delta` [[1](https://archlinux.org/packages/extra/x86_64/git-delta/), [2](https://formulae.brew.sh/formula/git-delta)]



## 2. 配置

可以直接修改配置文件

### 2.1 **在 Git 中配置**：
直接在终端运行以下命令，即可将 `delta` 设为默认的分页器：



```bash
git config --global core.pager "delta"
git config --global interactive.diffFilter "delta --color-only"
```

请谨慎使用此类代码。





### 2.2 **启用并排视图**（可选）：
在 `~/.gitconfig` 文件中添加以下内容以启用并排显示功能：

ini

```bash
[delta]
    side-by-side = true
```

请谨慎使用此类代码。



