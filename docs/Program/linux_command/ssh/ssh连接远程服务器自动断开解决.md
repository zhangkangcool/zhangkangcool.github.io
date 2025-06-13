<h1 align="center">ssh连接远程服务器自动断开解决</h1>
https://blog.csdn.net/hustcw98/article/details/79325878

https://blog.csdn.net/abld99/article/details/69388858



# ssh连接长时间不操作自动断开

> 这个问题用ssh一段时间后就觉得很尴尬了,有时隔一小会不操作ssh连接就断开了,重新打开还要卡死一会.

###  1 修改服务器端参数(不推荐)

如果你用多台本地机器连接服务器,可以考虑把服务器端的配置作修改**路径是:/etc/ssh/sshd_config**

在其中添加一行内容,意思是向客户端每60秒发一次保持连接的信号

```shell
ClientAliveInterval  601
```

如果仍要设置断开时间,还有一个参数可以添加

```shell
ClientAliveCountMax  601
```

意思是如果客户端60次未响应就断开连接,依据你期望的时间来设定

------

###  2 修改本地（client）参数(linux/macos)对所有用户有效，比方法1好)

也可以让客户端向服务器发送保持连接信号,路径是**/etc/ssh/ssh_config**

在其中类似的添加相应的参数也行

```shell
ServerAliveInterval  60
ServerAliveCountMax  6012
```

------

### 3 使用ssh登录时也可设置参数

在连接前使用-o 可以设置相应的参数

```shell
ssh -o ServerAliveInterval=30 root@192.168.1.1
```

-----

### 4. 在服务器上本用户的`~/.ssh/config`中进行设置，只对某个用户有效(推荐方法)

```shell
vi ~/.ssh/config 中加入如下内容：

ServerAliveInterval  60
ServerAliveCountMax  6012
```





----

## 重启ssh服务

```shell
servece sshd restart
```

