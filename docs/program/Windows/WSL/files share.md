

## win10与子系统Ubuntu之间互相访问文件系统

https://blog.csdn.net/qq_38121031/article/details/81879212

https://learn.microsoft.com/zh-cn/windows/wsl/filesystems



# 1. 方法1

这里的`xxx`表示的是用户名。

#### 1 在win10环境下访问Ubuntu文件系统的home目录：

这里需要打开隐藏目录

```shell
C:\Users\xxx\AppData\Local\Packages\CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc\LocalState\rootfs\home\xxx
```



真实情况是这样的

```shell
C:\Users\69138
```

与

```
/mnt/c/Users/69138
```

相对应，另外我自己建了个`linux`文件夹。

```shell
C:\Users\69138\linux     <======> /mnt/c/Users/69138/linux
```





#### 2 在Ubuntu系统下访问win10的home目录：

```shell
/mnt/c/Users/xxx
```



 软链接必须使用左边必须使用绝对路径

在WSL环境下可以创建一个访问win10的快捷方式

```shell
$ ln -s /mnt/c/Users/xxx ~/win10 
```

在ubuntu下通过下面的命令直接进入win10的home目录

```shell
$ cd win10
```



真实使用的命令

```
ln -s /mnt/c/Users/69138/linux win10
```



# 2. 方法2

下述方法可以用VSCode打开代码，使用本地的VSC，避免使用remote-vscode。

windows的资源管理器中直接输入

可以把\\wsl$下的某个文件弄个快捷方式到桌面上

```
\\wsl$  或者  \\wsl.localhost
```





