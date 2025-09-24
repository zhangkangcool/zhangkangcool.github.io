

<h1 align="center">MacOS安装RealVNC</h1>



macOS 可以使用 Homebrew 安装 RealVNC Viewer。

Homebrew 是一款在 UNIX 平台下的软件安装管理器，Brew Cask 是 Brew 的扩展，用于安装和管理 macOS 应用程序，RealVNC Viewer 可以通过 Brew Cask 进行安装。具体安装命令如下：

```bash
brew install --cask vnc-viewer
```

如果尚未安装 Homebrew，需要先运行以下命令安装 Homebrew：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/
```