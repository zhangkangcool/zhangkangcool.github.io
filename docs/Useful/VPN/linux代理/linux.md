<h1 align="center">linux</h1>
https://ihac.xyz/2018/07/01/Linux-Mac%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%BF%BB%E5%A2%99/



# Linux/Mac命令行翻墙





## 1. 配置ShadowSocks

`ShadowSocks`分为server端与client端，缺一不可。我的server端部署在`Bandwagon`的vps上，因此，还需要在自己机器上配置client 端。

1. 安装`ShadowSocks`：

   最好看`安装shadowsocks.md`中的安装方法

```shell
   # 安装成功后查看安装版本
   sslocal --version查看版本
```

2. 创建`ShadowSocks`启动配置文件`/etc/shadowsocks.json`：

```python
   {
       "server":"192.119.64.82",
       "server_port":46788,
       "local_address": "127.0.0.1",
       "local_port":1080,
       "password":"233blog.com",
       "timeout":300,
       "method":"aes-256-gcm"
   }
   
   
   以下是目前的信息
   ---------- Shadowsocks 配置信息 -------------
   
    服务器地址 = 192.119.64.82
   
    服务器端口 = 46788
   
    密码 = 233blog.com
   
    加密协议 = aes-256-gcm
   
    SS 链接 = ss://YWVzLTI1Ni1nY206MjMzYmxvZy5jb21AMTkyLjExOS42NC44Mjo0Njc4OA==#233v2.com_ss_192.119.64.82
   
    备注:  Shadowsocks Win 4.0.6  客户端可能无法识别该 SS 链接
   
   提示: 输入  v2ray ssqr  可生成 Shadowsocks 二维码链接
   
   免被墙..推荐使用JMS: https://getjms.com
   
```

   各个字段依照server端的配置来填写。

   

3. 从上述配置文件启动client端：

```python
   sslocal -c ss.json
   
   ### 以下为输入信息
   INFO: loading config from ss.json
   2022-10-10 15:09:59 INFO     loading libcrypto from libcrypto.so.1.1
   2022-10-10 15:09:59 INFO     loading libsodium from libsodium.so.23
   2022-10-10 15:09:59 INFO     starting local at 127.0.0.1:1080
   
```

   此时，`ShadowSocks`将监听本地的1080端口，将收到请求转发到server端的46788端口，从而实现代理的功能。

但这样还不能实现翻墙，因为`ShadowSocks`使用的是`SOCKS5`协议，只支持`SOCKS5`代理，不支持`HTTP`、`HTTPS`代理，下面我们继续配置一个可以将`SOCKS5`代理转换为其他协议代理的工具——`Privoxy`。





## 2. 配置Privoxy

1. 安装`Privoxy`，这里不同操作系统的安装方式不一样。

   Linux是最方便的，直接从源安装即可：

```shell
   sudo apt install privoxy # for Debian
   sudo yum install privoxy # for RedHat
```

   

   

2. 修改配置文件。

   对于Linux，配置文件的路径一般为`/etc/privoxy/config`，而Mac OS上路径稍微有些不同，为`/usr/local/etc/privoxy/config`。如果你找不到配置文件，建议直接全局搜索关键词`privoxy`+`config`。

   在配置文件中找到以下两行，进行修改。

```python
    # 修改为ShadowSocks配置中的local_port
   forward-socks5   /               127.0.0.1:1080 .
   listen-address  localhost:8118
```

   

3. 启动`Privoxy`：

```python
   sudo privoxy /etc/privoxy/config             # for Linux
   # sudo /Application/Privoxy/startPrivoxy.sh    # for Mac OS
```

现在`Privoxy`已经在后台运行，监听8118端口，将请求转发到1080端口，实现`HTTP`、`HTTPS`代理与`SOCKS5`代理的转换。

```shell
systemctl status privoxy.service

systemctl stop privoxy.service
```



## 一些零碎的配置

安装完`ShadowSocks`与`Privoxy`后，我们已经可以命令行翻墙了。

```shell
sslocal -c /etc/shadowsocks.json 1>/dev/null 2>&1 &     # 后台运行ShadowSocks Client
sudo privoxy /etc/privoxy/config                        # 开启privoxy服务

# sudo /Application/Privoxy/startPrivoxy.sh for MacOS
export http_proxy=http://localhost:8118                 # 设置HTTP代理地址
```

效果如下图所示：

[![ss+privoxy](https://ihac.xyz/contents/images/shadowsocks-privoxy.png)](https://ihac.xyz/contents/images/shadowsocks-privoxy.png)

可以看到，本机的外网ip发生了变化，这说明代理配置成功，此时也可以试一试`wget www.google.com`。

如果我们不想用代理该怎么办呢？很简单，直接把变量`http_proxy`给注销掉（`unset http_proxy`）即可。不过，这样的操作不够优雅，用户并不会关心（甚至讨厌）配置细节，他们要的仅仅是`开启代理`、`关闭代理`两个操作而已。而且注意到`ShadowSocks`一直运行在后台，一旦这个shell被关闭，那么`ShadowSocks`进程也会被杀死，其他shell想用代理时只能重新运行`ShadowSocks`，这太糟糕了。

为了解决以上两个问题，我们可以做一下小配置。

1. 使用`nohup`让`ShadowSocks`一直运行：

```shell
   nohup sslocal -c /etc/shadowsocks.json 1>/dev/null 2>&1 &
```

2. 将所有命令操作封装一下。

   在主目录下新建脚本文件`ss.sh`：

```shell
   #! /bin/bash
   nohup sslocal -c /etc/shadowsocks.json >/dev/null 2>&1 &
   sudo privoxy /etc/privoxy/config # only for Linux
   # for Mac OS, sudo /Application/Privoxy/startPrivoxy.sh
```

   在当前shell的profile（`.bashrc`、`.zshrc`等等，也可以写在`/etc/profile`）里，实现两个函数，分别用于开启代理与关闭代理：

```shell
   function sson() {
       export http_proxy=http://localhost:8118;
       export https_proxy=http://localhost:8118;
       export ftp_proxy=http://localhost:8118;
   }
   function ssoff() {
       unset http_proxy https_proxy ftp_proxy
   }
```

   现在，你可以运行一次脚本`ss.sh`，以后想用代理时，直接命令行输入命令`sson`即可，同理，关闭代理使用`ssoff`。如果你想实现开机自动运行`ShadowSocks`和`Privoxy`（即开机运行`ss.sh`脚本），直接在`/etc/rc.local`中添加运行`ss.sh`的命令即可。

## 配置Chrome

最后，我还需要为浏览器配置代理，这步就比较简单了，全部鼠标操作。

1. 下载并安装插件`SwitchyOmega`，由于未翻墙不能访问chrome webstore，建议从github（[link](https://github.com/FelisCatus/SwitchyOmega/releases/download/v2.3.21/SwitchyOmega.crx)）下载，我这里提供`2.3.21`版本的下载（[link](http://www.xiaoan.org/share/SwitchyOmega.crx)）。

2. 进入`SwitchyOmega`的`options`（选项）界面，在侧边栏中选择`proxy`（代理），按照下图填写：

   [![proxy](https://ihac.xyz/contents/images/proxy.png)](https://ihac.xyz/contents/images/proxy.png)

3. 在侧边栏中选择`auto switch`（自动切换），按照下图填写：

   [![auto-switch](https://ihac.xyz/contents/images/auto-switch.png)](https://ihac.xyz/contents/images/auto-switch.png)

   注意，填写完`Rule List URL`后，需要点击下方的`Download Profile Now`下载翻墙名单`gfwlist.txt`。

4. 填写完后，点击`Apply changes`（确认修改）。

现在可以使用`Chrome`翻墙啦。将插件设置为`auto switch`模式，此时，名单`gfwlist.list`内的所有网址会自动走代理，而不在名单的网址不走代理。

回顾最开始我提出来的四个问题，现在好像还剩一个没有解决——`PAC`列表修改起来很麻烦。其实不然，`SwitchyOmega`为我们提供了一个很优雅的操作方式。一旦有请求失败，`SwitchyOmega`会将它们记录下来，此时，我们可以为这些失败的请求设置规则：

[![add condition](https://ihac.xyz/contents/images/add-condition.png)](https://ihac.xyz/contents/images/add-condition.png)

如上所示，直接点击`Add condition`即可将`*.atdmt.com`设置为`proxy`模式，以后每次访问以`.atdmt.com`结尾的网址时，浏览器都会自动走代理。终于，我们不需要自己手动设置`PAC`名单啦。
