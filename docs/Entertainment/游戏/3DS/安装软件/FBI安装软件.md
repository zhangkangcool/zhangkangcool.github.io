# FBI安装软件



## 1 本地安装

1. FBI按A进入。
2. 选择SD按A进入
3. 选择cia(tool)按A进入（进入到你放CIA文件的目录）
4. 选择 <current directory> 按A进入
5. 选择install all cias（安装所有安装包）
6. 按A确认。
7. 安装完毕后，按下Home键。
8. 桌面应该会多出很多的礼包。依次点开即可。



## 2 远程安装

进入FBI -> Remote Install -> Scan QR Code，然后扫描以下二维码。

二维码其实就是CIA文件的下载地址，如github上的`https://github.com/mtheall/ftpd/releases/download/v3.2.1/ftpd.cia`,或者使用自建服务器。

### 2.1 自建服务器

自建服务器的好处是电脑下载的软件，无需拷贝到储存卡，再进行安装。如果使用FTP拷贝的话，最大只有2M/s，安装也差不多只有2M/s，除非拔卡安装。



在下载好CIA文件的目录下，运行：

```shell
sudo python3 -m http.server
```

在打开的网站上的CIA文件上选择复制链接地址（这里，IP使用同一局域网IP，不要使用127.0.0.1）

选中文件上右击选择生成QR Code（需要安装Chrome插件，后者使用公开的QR生成网站进行生成），然后使用FBI进行扫码安装。

http://172.18.8.106:8000/3DSident.cia

