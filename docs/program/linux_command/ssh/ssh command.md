<h1 align="center">ssh command</h1>
# 1 Create the key

https://blog.csdn.net/a753255157/article/details/49156029
https://blog.csdn.net/gulingfengze/article/details/69665223
https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/

https://blog.csdn.net/xiaoluoshan/article/details/78177217?locationNum=8&fps=1



https://help.github.com/cn/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent



```shell
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

# 2 linux实现免密码登陆

```shell
https://www.cnblogs.com/yixue2017/p/7559970.html
```
本质是：将本地id_rsa.pub文件的内容拷贝至远程服务器的~/.ssh/authorized_keys文件中

#### 1. 将本地id_rsa.pub文件的内容拷贝至远程服务器的~/.ssh/authorized_keys文件中: 手工增加

#### 2. scp -p ~/.ssh/id_rsa.pub root@<remote_ip>:/root/.ssh/authorized_keys

#### 3. ssh-copy-id -i ~/.ssh/id_rsa.put <romte_ip>

Method 1 && 3 is recommended.



# 3 对于新机器，可以使用下面简单的方法

在本地复制文件后，将整个`.ssh`文件夹全部复制到远程机器。假如新机器是`recycler`：

`.ssh/config`中加入如下内容：



加入下面四行测试成功，使用`ssh remote_login_name`进行登陆。

```shell
Host remote_login_name(随便取)
HostName 服务器地址/ip
User zhangkang
IdentityFile ~/.ssh/id_rsa
```





以下7行加入后没反应，应该是有错误

```shell
Host remote_login_name(随便取)
HostName 服务器地址/ip
User zhangkang
PubkeyAuthentication yes
PreferredAuthentications publickey
IdentitiesOnly yes
IdentityFile ~/.ssh/id_rsa
```





```shell
cp id_rsa.pub authorized_keys
scp -r .ssh shkzhang@recycler.torolab.ibm.com:~
```



```shell
Permissions 0644 for 'id_rsa' are too open.

$ chmod 0600 id_rsa
```





### 3. 指定key位置，可选

```shell
ssh -i .ssh/id_rsa 240vip@23.254.166.215
```

