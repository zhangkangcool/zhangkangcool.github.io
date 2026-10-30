# FortiClient VPN设置



###  1. windows

如果用的是windows，不能在设置中设置代理来代替CHROME插件，因为设置中是HTTP/HTTPS，而不是SOCKS。

连接上VPN后，这样设置：

```
 ssh -N -D 172.0.0.1:8080 ken@172.20.64.57
```



![image-20261030151737385](FortiClient%20VPN%E8%AE%BE%E7%BD%AE.assets/image-20261030151737385.png)

必须使用SOCK5。



### 2. Mac

连上VPN后，使用小火箭

这里的端口注意是SSH的22端口（没改的话），一般不填也可以。

![image-20261030151939126](FortiClient%20VPN%E8%AE%BE%E7%BD%AE.assets/image-20261030151939126.png)