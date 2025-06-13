<h1 align="center">MacPort安装和使用</h1>
https://www.jianshu.com/p/705d6aa95a37



Mac下面除了用dmg、pkg来安装软件外，比较方便的还有用MacPorts来帮助你安装其他应用程序，跟BSD中的ports道理一样。MacPorts就像apt-get、yum一样，可以快速安装些软件。

##### 1.安装包安装

[https://www.macports.org/install.php](https://link.jianshu.com?t=https://www.macports.org/install.php) 官网地址
 查找你对应的系统版本。本文以10.12.5为准。找到对应版本的dmg安装包。
 下一步下一步安装即可。
 在安装的过程中会出现卡在更新哪里不动





###### 解决方案：

- 如果等在太久还卡住，那么直接干掉（option+command+esc打开强制退出应用程序窗口）
   同时还要干掉一另一个系统的安装进程（ps aux | grep install可以找到，具体名字没记下来）
   如果不知道怎么杀掉进程，直接在终端运行命令 sudo reboot 重启机器

- 断网后再试试，我在这成功了，运气不好就重启试试吧。记得断网

- 修改/opt/local/etc/macports/sources.conf，把最后的rsync注释掉换成其它镜像源。
   镜像在这[https://trac.macports.org/wiki/Mirrors](https://link.jianshu.com?t=https://trac.macports.org/wiki/Mirrors)，或者sources.conf上面也有这个网址

  

  

4）运行sudo port selfupdate，如果失败再试试其它镜像吧。
 更新成功状态





##### Source Installation

在终端执行
 tar xjvf [MacPorts-2.4.1.tar.bz2](https://link.jianshu.com?t=https://github.com/macports/macports-base/releases/download/v2.4.1/MacPorts-2.4.1.tar.bz2)
 或者
 tar xzvf [MacPorts-2.4.1.tar.gz](https://link.jianshu.com?t=https://github.com/macports/macports-base/releases/download/v2.4.1/MacPorts-2.4.1.tar.gz)



```bash
 cd MacPorts-2.4.1
 ./configure && make && sudo make install
 cd ../
 rm -rf MacPorts-2.4.1*
```

另外一种source安装方式



```ruby
$ curl -O https://distfiles.macports.org/MacPorts/MacPorts-2.4.1.tar.bz2
$ tar xf MacPorts-2.4.1.tar.bz2
$ cd MacPorts-2.4.1/
$ ./configure
$ make
$ sudo make install
```

##### MacPorts使用

更新ports tree和MacPorts版本，强烈推荐第一次运行的时候使用-v参数，显示详细的更新过程。
 sudo port -v selfupdate

搜索索引中的软件
 port search name

安装新软件
 sudo port install name

卸载软件
 sudo port uninstall name

查看有更新的软件以及版本
 port outdated

升级可以更新的软件
 sudo port upgrade outdated

Eclipse的插件需要subclipse需要JavaHL，下面通过MacPorts来安装
 sudo port install subversion-javahlbindings



如果慢的话，可以更换port repo







```shell
sudo port install graphviz
```

