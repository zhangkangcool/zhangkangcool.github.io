

https://bbs.huaweicloud.com/blogs/313277



# Ubuntu 无法打开 terminal 之修复

```
【摘要】 Ubuntu 18.04中升级了Python环境，之前的Python是2.7和Python3.5，而为了兼容某些软件的运行，需要升级到Python3.7，中间也有安装Python3.6版本。当一切都准备就绪后，重启服务器，突然发现Ubuntu 18.04中的命令行 terminal 终端无法正常打开。本文将通过详细的步骤来解决这种问题。
```





ssh远程连接时出现以下问题：

```
kex_exchange_identification: Connection closed by remote host
```





### 1 问题概述

------

   最近在Ubuntu 18.04中升级了Python环境，之前的Python是2.7和Python3.5，而为了兼容某些软件的运行，需要升级到Python3.7，中间也有安装Python3.6版本。当一切都准备就绪后，重启服务器，突然发现Ubuntu 18.04中的命令行 terminal 终端无法正常打开，顿时感觉有点蒙圈。在网上查找了半天资料，终于解决了这个问题，下面将这次解决问题的心得做个总结，也做个备忘。

   当Ubuntu 操作系统中的 terminal 终端无法打开时，首先需要考虑一下如何进行配置和命令的执行。在Ubuntu 操作系统中还有另外一个终端工具XTerm，它是一个X Window System上的终端模拟器，用来提供多个独立的SHELL输入输出。因此，可以暂时使用终端工具XTerm来进行配置和执行命令，终端工具XTerm可以通过搜索查找，界面如下所示：

![1.jpg](https://bbs-img.huaweicloud.com/blogs/img/20211125/1637806062986036912.jpg)
  首先打开XTerm终端工具 ， 在XTerm中输入如下命令(如果没用xterm则通过GUI进行下载)：

```bash
gnome-terminal
```

  一般的Linux系统通常包含多种终端模拟器，如XTerm、Konsole、Gnome-Terminal等。常用的Terminal就是Gnome Terminal，它支持彩色的文本，多样化的主题，透明，鼠标交互，多标签。这个终端支持多用户，所以可以任意尝试不同的设置项，而不会影响当前的配置，或者也可以为不同的任务设置不同的配置，而且支持链接的点击，这个特性用过之后就无法舍弃。

  输入上述命令，则可以启动终端，但可以查看到报错信息，我这里的报错信息如下所示：

```
Traceback (most recent call last):
File "/usr/bin/gnome-terminal", line 9, in
from gi.repository import GLib, Gio
File "/usr/lib/python3/dist-packages/gi/init.py", line 42, in
from . import _gi
**ImportError: cannot import name '_gi'**
```



### 2 问题概述

------

   根据上述错误提示，是报的导入错误，这是由于Python版本不一致导致的。下面给出解决方案。首先切换到如下目录中，执行命令如下所示：

```bash
su root
cd /usr/lib/python3/dist-packages/gi/
ls
```

   查看的目录结构如下所示：

![2.jpg](https://bbs-img.huaweicloud.com/blogs/img/20211125/1637806983016082938.jpg)

   其中有两个核心文件：_gi_cairo.cpython-35m-x86_64-linux-g.so 和 _gi.cpython-35m-x86_64-linux-gnu.so 。这里可以看到是cpython-35m，即表示Python 3.5版本的，下面看一下当前Python相关命令的指向，输入如下命令查看：

```bash
cd /usr/bin
ll python*
```

   输出结果如下所示：

![3.jpg](https://bbs-img.huaweicloud.com/blogs/img/20211125/1637807232805006899.jpg)

  由上述可以看到，Python3 指向了python3.7 ，而_gi_cairo.cpython-35m-x86_64-linux-g.so 和 _gi.cpython-35m-x86_64-linux-gnu.so 指向了Python 3.5 。可以通过cp命令改名即可解决问题。输入如下命令：

```bash
cp _gi_cairo.cpython-35m-x86_64-linux-g.so   _gi_cairo.cpython-37m-x86_64-linux-g.so 
cp  _gi.cpython-35m-x86_64-linux-gnu.so     _gi.cpython-37m-x86_64-linux-gnu.so 
```

   注意：这里具体的版本，可以根据当前的环境来修改。如36m改成35m。

  至于这里为什么需要修改Python3 指向的python3.7 ，这里可以用如下命令查看一下 gnome-terminal 的文件内容：

```bash
vi /usr/bin/gnome-terminal
#!/usr/bin/python3
...........................................
..........................................
```

   第一行表示执行的是/usr/bin/python3 环境，而Python3 指向的python3.7 ，因此需要修改_gi_cairo.cpython-35m-x86_64-linux-g.so 和 _gi.cpython-35m-x86_64-linux-gnu.so 中的35m到37m。至此，可以打开terminal终端工具，并执行命令，界面如下所示：

![5.jpg](https://bbs-img.huaweicloud.com/blogs/img/20211125/1637807736752040153.jpg)