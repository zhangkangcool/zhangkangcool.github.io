<h1 align="center">ls颜色问题</h1>
https://blog.csdn.net/u013045749/article/details/53576868

这里以`ubuntu：zz205p1`为例进行说明。



Mac OS X 是基于 FreeBSD 的，所以一些工具 ls, top 等都是 BSD 那一套，ls 不是 GNU ls，所以即使 
Terminal/iTerm2 配置了颜色，但是在 Mac 上敲入 ls 命令也不会显示高亮，可以通过安装 coreutils 来解决。

gdircolor的作用就是设置ls命令使用的环境变量LS_COLORS（BSD是LSCOLORS），我们可以修改~/.dir_colors自定义文件的颜色，此文件中的注释已经包含各种颜色取值的说明。

linux使用命令`dircolors`和`~/.dircolors`



- 下载或生成所需要的配置文件

  Solarized所使用的配置文件

  ```shell
  wget --no-check-certificate https://github.com/seebi/dircolors-solarized/raw/master/dircolors.ansi-universal
  mv dircolors.ansi-universal ~/.dircolors
  ```

  下面命令使用当前配置生成配置文件

  ```shell
  dircolors -p > .dircolors
  ```

- 修改配置文件

  ```shell
  # 修改后
  # 36为绿色，34为蓝色
  # directory
  #DIR 36
  DIR 34
  # symbolic link
  LINK 36
  
  EXEC 36
  ```

  ```shell
  # 未修改前
  # DIR表示针对的是目录名，01表示高亮度显示，34表示蓝色,Solarized不要使用高亮
  DIR 01;34
  ```

  

- 使用配置文件

  `dircolors -b $HOME/.dircolors`这句可能是多余时，系统会自动执行。

  ```shell
  # .bashrc中加入
  # 这个*号仅仅是ls命令显示的，表示有可执行权限，实际文件名不带*号。不喜欢可以去掉-F
  alias ls='ls -F --show-control-chars --color=auto'
  alias dir='dir --color=auto'
  alias vdir='vdir --color=auto'
  alias grep='grep --color=auto'
  alias fgrep='fgrep --color=auto'
  alias egrep='egrep --color=auto'
  alias tree='tree -C'
  eval `dircolors -b $HOME/.dircolors`
  
  alias ..="cd .."
  alias ..2="cd ../.."
  alias ..3="cd ../../.."
  alias ..4="cd ../../../.."
  alias ..5="cd ../../../../.."
  alias  "l"="ls -ahl --full-time"
  ```

  

### ls -F

加了-F参数后，文件后面后显示后缀。

目录的结尾都被加上了斜线 /。此时，当我们想要过滤所有的目录，那么只需要把带斜线的过滤出来就好了。

```shell
/: 表示目录
@: 表示链接文件
*: 表示可执行文件
=: 表示套接字
|: 表示FIFOS
无: 表示普通文件
```

