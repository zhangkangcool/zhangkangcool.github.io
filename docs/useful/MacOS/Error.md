<h1 align="center">Error</h1>
# 1. 您需要安装旧 Java SE 6 运行环境才能打开
https://blog.csdn.net/kongxx/article/details/50969077

Mac OS 您需要安装旧 Java SE 6 运行环境才能打开“XXX” 问题

### 问题描述：

今天在Mac OS上安装一个app的时候提示 “您需要安装旧 Java SE 6 运行环境才能打开 XXX” ，在网上搜索了一下，有说要改app的info.plist文件的，将其中的JVMVersion改成自己机器上的版本的，但是在我的环境下修改了仍然不起作用，最后还是使用了下面的方法搞定的。

### 解决办法

从下面的链接下载javaforosx.dmg并安装，然后再执行上面出错的app，问题就可以解决了。
```shell
https://support.apple.com/kb/DL1572?viewlocale=zh_CN&locale=en_US


```

# 2. ***.app不能打开

可能是该app包中的文件没有可执行权限，例如别人传给你的某个app包。
右键选择`查看包内容`，可以看到包中有哪些东西。

### 解决方法

通过命令行进入包目录，找到`MacOS`目录，给其中的文件加上`x`权限。
`CMVC.app`和`orion.app`都会出现该问题。

```shell
chmod a+x /Users/ken/software/macosx.cocoa.x86_64_orion/eclipse/orion.app/Contents/MacOS/origin
```



# 3. MAC无法确认开发者身份

https://blog.csdn.net/mybrahma/article/details/54948808
https://jingyan.baidu.com/article/f71d60377960651ab741d140.html

`系统偏好设置` -> `安全与隐私`:

随后在安全与隐私的通用设置中，可以看到系统默认是只允许**“Mac App Store 和被认可的开发者”**选项，也就是其它应用程序都会被系统阻止打开。不过这时我们可以看到一个**“仍要打开”**按钮，点击它。

当解锁了系统的安全锁以后，接着请先点击**“任何来源”**选项，再点击**“允许来自任何来源”**按钮.



# 4. 升级系统或软件后无法上网

https://blog.csdn.net/qq_29768125/article/details/82740543

1. 在Finder当中执行Command+Shift+G快捷键，并输入路径“/Library/Preferences/SystemConfiguration/” 
2. 在开启的文件夹当中删除除了com.apple.Boot.plist的所有文件。
3. 重启



# 5. 大小写转换键灯有问题

此方法还未真正试用过，先看相关的网站： https://support.apple.com/zh-cn/HT201295

先关机重启，不行的话可能是需要重置SMC

如果电池不可拆卸：

1. 选取苹果菜单 >“关机”，然后等待您的 Mac 关机。
2. 按下内建键盘左侧的 Shift-Control-Option，然后同时按下电源按钮。按住这些按键和电源按钮 10 秒钟。如果您的 MacBook Pro 配有触控 ID，则触控 ID 按钮也是电源按钮。
3. 松开所有按键。
4. 再次按下电源按钮以开启 Mac。