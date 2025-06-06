<h1 align="center">Solarized Dark Error</h1>






https://hufangyun.com/2017/zsh-plugin/

https://www.haoyep.com/posts/zsh-config-oh-my-zsh/



## 1. zsh-syntax-highlighting

平常用的`ls`、`cd` 等命令输入正确会绿色高亮显示，输入错误会显示其他的颜色。

在输入命令的过程中，若指令不合法，则指令显示为红色，若指令合法就会显示为绿色。

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 中国用户可以使用下面任意一个加速下载
# 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```



## 2. zsh -autosuggestions

一个命令提示插件，当你输入命令时，会自动推测你可能需要输入的命令，按下右键可以快速采用建议。

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 中国用户可以使用下面任意一个加速下载
# 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```



## 3. z

`oh-my-zsh` 内置了 `z` 插件。`z` 是一个文件夹快捷跳转插件，对于曾经跳转过的目录，只需要输入最终目标文件夹名称，就可以快速跳转，避免再输入长串路径，提高切换文件夹的效率。

```shell
cd workspace/test
cd
z test   # (tab)
```





## 4. extract

`oh-my-zsh` 内置了 `extract` 插件。`extract` 用于解压任何压缩文件，不必根据压缩文件的后缀名来记忆压缩软件。使用 `x` 命令即可解压文件。

```shell
x test.tar.bz2
```



## 对插件进行启用

`/Users/ken/.oh-my-zsh/plugins`目录下有所有支持的插件，不要里面的需要额外再安装。

```shell
# 我所作用的设置
# .zshrc add
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract)

source $ZSH/oh-my-zsh.sh
```











# Solarized Dark vim



https://www.vpsee.com/2013/09/use-the-solarized-color-theme-on-mac-os-x-terminal/

- 下载所需要的配置文件并复制到指定位置

```shell
git clone https://github.com/altercation/solarized.git

cd solarized/vim-colors-solarized/colors
mkdir -p ~/.vim/colors
cp solarized.vim ~/.vim/colors/
```

- 设置vim使用所选的配置文件

```shell
$ vi ~/.vimrc
syntax on
set background=dark
colorscheme solarized
```

这样，vim的语法高亮就可以正常使用了。



# Solarized Dark ls

不仅仅适用`Solarized`，`zsh`，`bash`显示有问题都可以解决。

Mac OS X 是基于 FreeBSD 的，所以一些工具 ls, top 等都是 BSD 那一套，ls 不是 GNU ls，所以即使 
Terminal/iTerm2 配置了颜色，但是在 Mac 上敲入 ls 命令也不会显示高亮，可以通过安装 coreutils 来解决。

gdircolor的作用就是设置ls命令使用的环境变量LS_COLORS（BSD是LSCOLORS），我们可以修改~/.dir_colors自定义文件的颜色，此文件中的注释已经包含各种颜色取值的说明。



linux使用命令`dircolor/dircolors`和`~/.dircolors`，具体内容在`颜色设置.md`。

http://ju.outofmemory.cn/entry/140562

http://www.cnblogs.com/cocoajin/p/3729436.html

- 安装所需软件

```shell
  brew install coreutils  # install command gdircolors
```

- 下载所需的配置文件并重命名为`.dir_colors`，linux是`.dircolors`

```shell
  wget --no-check-certificate https://github.com/seebi/dircolors-solarized/raw/master/dircolors.ansi-universal
  mv dircolors.ansi-universal ~/.dir_colors
```

  

  也可生成所需要的配置文件，再对其进行信息

```shell
  gdircolors --print-database > ~/.dir_colors
```

  生成的配置文件会反映当前的配置情况，最好直接下载，生成的配置文件，一般去除前缀高亮即可。

- 在`.zshrc`和`.bashrc`中添加如下设置

```shell
  # 通过coreutils设置ls的颜色
  if brew list | grep coreutils > /dev/null ; then
    PATH="$(brew --prefix coreutils)/libexec/gnubin:$PATH"
    # 这个*号仅仅是ls命令显示的，表示有可执行权限，实际文件名不带*号。不喜欢可以去掉-F
    alias ls='ls -F --show-control-chars --color=auto'
    alias dir='dir --color=auto'
    alias vdir='vdir --color=auto'
    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
    alias tree='tree -C'
    eval `gdircolors -b $HOME/.dir_colors`
  fi
  
  alias ..="cd .."
  alias ..2="cd ../.."
  alias ..3="cd ../../.."
  alias ..4="cd ../../../.."
  alias ..5="cd ../../../../.."
  alias  "l"="ls -ahl --full-time"
```

  现在，`zsh`和`bash`的颜色都可以正常显示。

- 个性`.dir_colors`中的颜色成所喜欢颜色

  https://blog.csdn.net/u013045749/article/details/53576868

```shell
  # 36为绿色，34为蓝色
  # directory
  #DIR 36
  DIR 34
  # symbolic link
  LINK 01;36
  
  EXEC 01;36
```

```shell
  # DIR表示针对的是目录名，01表示高亮度显示，34表示蓝色,Solarized不要使用高亮
  DIR 01;34
```

  

通过vim的颜色高亮打开`.dir_colors`文件时，已经可以看出哪些文件使用什么颜色了。linux中的ls颜色问题可查看`ls颜色问题`。

iterm2中取消`Brightem bold text`勾选。 `iterm2 -> Preferences > Profiles -> colors`



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







### 按tab时，屏幕闪烁的问题

```shell
term2更新后, tab键时会闪屏。修改方法为: iterm -> preference -> profiles -> Terminal, 在notifications中选中 "slience bell"。
```

