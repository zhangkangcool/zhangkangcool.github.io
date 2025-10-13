





<h1 align="center">deskflow安装</h1>





## 1. MacOs

在该项目的github网页的README.md文件中有介绍，需要MacOS12及以上。

### 1.1 添加tap

```shell
brew tap deskflow/homebrew-tap
```

### 1.2 安装

```shell
Stable     稳定版: brew install deskflow
或者
Continuous 开发版: brew install deskflow-dev
```



## 2. Linux

可尝试

```shell
sudo apt install deskflow
```



如果失败则用以下方法：

https://github.com/deskflow/deskflow/releases

找到合适的版本进行安装，我用的是Ubuntu 22.04 jimmy，没找到对应的版本，则使用Flatpak进行安装。

下载[deskflow-1.24.0-linux-aarch64.flatpak](https://github.com/deskflow/deskflow/releases/download/v1.24.0/deskflow-1.24.0-linux-aarch64.flatpak)或者[deskflow-1.24.0-linux-x86_64.flatpak](https://github.com/deskflow/deskflow/releases/download/v1.24.0/deskflow-1.24.0-linux-x86_64.flatpak)，然后进行安装。参考[ubuntu上安装flatpak文件](../../linux安装软件/flatpak/ubuntu上安装flatpak文件.md)

