<h1 align="center">repo源</h1>


https://blog.csdn.net/weixin_39394526/article/details/87935449



# ubuntu18.04配置国内apt-get源

网上应该可以找到很多关于ubuntu源的设置方法，但是如果不搞清楚就随便设置的话，不仅不能起到应有的效果，还会由于一些问题导致apt不可用。

再此处我提供了清华大学的源，自认为比较不错

> https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190226150235376.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zOTM5NDUyNg==,size_16,color_FFFFFF,t_70)执行步骤如下：
Ubuntu 的软件源配置文件是 /etc/apt/sources.list

### 1. 为避免出现问题，先备份

```shell
sudo cp /etc/apt/sources.list  /etc/apt/sources.list.bak
```



### 2. 编辑sources.list文件替换内容

```shell
sudo vi /etc/apt/sources.list 
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190226150749735.png)

### 3.更新源

```shell
sudo apt-get update
```

完成





```shell
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb http://mirrors.lynxi.net/ubuntu/ xenial main restricted universe multiverse
# deb-src http://mirrors.lynxi.net/ubuntu/ xenial main restricted universe multiverse
deb http://mirrors.lynxi.net/ubuntu/ xenial-updates main restricted universe multiverse
# deb-src http://mirrors.lynxi.net/ubuntu/ xenial-updates main restricted universe multiverse
deb http://mirrors.lynxi.net/ubuntu/ xenial-backports main restricted universe multiverse
# deb-src http://mirrors.lynxi.net/ubuntu/ xenial-backports main restricted universe multiverse
deb http://mirrors.lynxi.net/ubuntu/ xenial-security main restricted universe multiverse
# deb-src http://mirrors.lynxi.net/ubuntu/ xenial-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb http://mirrors.lynxi.net/ubuntu/ xenial-proposed main restricted universe multiverse
# deb-src http://mirrors.lynxi.net/ubuntu/ xenial-proposed main restricted universe multiverse
```

