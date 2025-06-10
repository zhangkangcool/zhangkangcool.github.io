<h1 align="center">IP限制</h1>


https://www.yfname.com/help/detail/288





Squid允许你使用访问控制列表（ACL）来控制客户如何访问网络资源。默认情况下，只允许从本地主机访问。

如果所有使用代理服务器的客户都有一个静态IP地址，那么限制访问代理服务器的最简单的办法就是创建一个ACL，其中包括允许的IP。否则，你可以将squid设置为使用认证。

不要在主配置文件中添加IP地址，而是创建一个新的专用文件，以容纳允许的IP。



## 1. IP限制列表文件

静态IP的情况，动态IP请使用密码来控制

新建文件 `/etc/squid/allowed_ips.txt`，内容如下

```c++
# All other allowed IPs
192.168.110.237   # 192.168.110.* 的写法使用`systemctl restart squild.service`报错
```





### 2. 修改配置文件

`/etc/squid/squid.conf`修改如下，

```shell
include /etc/squid/conf.d/*

acl allowed_ips src "/etc/squid/allowed_ips.txt" # 添加的第一行

# Example rule allowing access from your local networks.
# Adapt localnet in the ACL section to list your (internal) IP networks
# from where browsing should be allowed
#http_access allow localnet
http_access allow localhost
http_access allow allowed_ips      # 添加的第二行内容

# And finally deny all other access to this proxy
http_access deny all    # 这里使用原始的deny，不使用密码或配置文件时，这里是allow

```





http_access规则的顺序很重要。请确保你在http_access deny all之前加入这一行。

http_access指令的工作方式与防火墙规则类似。Squid从上到下读取规则，当一条规则匹配时，下面的规则不会被处理。



### 3. 使规则生效

```shell
sudo systemctl restart squid
```

