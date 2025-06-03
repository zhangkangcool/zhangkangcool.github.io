

## 1. 从githb安装

## 1. install brew

#### 1.1 从github安装

```shell
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

如果无法访问github可用下面的方式 



### 1.2 安装caskroom/cask

```shell
brew tap caskroom/cask 
```

安装brew Cask他是图形安装的扩展。





## 2. 从gitee安装(建议方式)

建议全部选择1，中科大源



https://blog.csdn.net/qq_36991248/article/details/127085330



brew 是 Mac 下的一个包管理工具，作用类似于 centos 下的 yum。
brew 可以用一条命令，就可以在mac上安装、卸载、更新各种软件包，因为brew的使用方便，如今已成为使用mac电脑的程序员的必备工具。

本身它就是一个用ruby写的软件，软件是托管在github上的，所以下载的时候可能会很慢。同样，每次执行brew update的时候它会首先去更新自己，故每次可能都会很慢。解决方法为使用国内源进行安装。

1. 打开Mac终端工具，输入以下命令开始安装

```shell
/bin/zsh  -c  "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```



2. 安装开始后首先选择下载源，这个下载源也是以后使用brew命令安装软件的软件下载源。

3. 选择下载源确认后会提示你要删除之前的brew版本以及其下载的软件，输入"Y",回车。
   如果是第一次安装，会弹出“命令行开发者工具”安装对话框，提示安装命令行开发者工具，按照操作安装即可。

4. 再选择删除之前brew,安装新的homebrew后需要输入mac的登录密码进行确认。注意，密码输入是屏幕没有回显。

   

   ##### 下面会提示安装cask图形化软件

5. 输入密码回车后开始安装，其间可能会再次输入密码。等到出现以下提示，表示安装成功。








