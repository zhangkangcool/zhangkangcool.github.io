<h1 align="center">Chrome</h1>
Mac安装Chrome，亲测可用。解决闪退问题

https://blog.csdn.net/u010113247/article/details/79290633



MAC安装Chrome后，在Applications中打开Chrome，出现闪退情况。

- 尝试运行如下命令，删除Chrome本地数据文件夹

```shell
sudo rm -rf ~/Library/Application\ Support/Google/Chrome
```





- 再次打开Chrome，如果显示Google Chrome无法对其数据目录进行操作，则手动为其建立数据目录。

```shell
cd ~/Library/Application\ Support/Google
sudo mkdir Chrome
```



- 并给该目录提供写（w）权限

```shell
sudo chmod a+w Chrome
```





## 导出CRXe

**http://chromecj.com/utilities/2018-09/1505.html**

我的下面位置：

```shell
/Users/ken/Library/Application Support/Google/Chrome/Default/Extensions
```

