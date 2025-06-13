<h1 align="center">repo LJW</h1>




欢迎使用本地源!
目前仅支持ubuntu20.04+amd64、kylin V10SP1+。使用步骤如下:

### 1 修改apt配置文件
```
sudo mv /etc/apt/sources.list /etc/apt/sources.list.bak
sudo vim /etc/apt/sources.list
```

#### ubuntu 20.04中sources list修改为:

```
deb http://172.18.8.88/ubuntu/ focal main restricted universe multiversedeb-src http://172.18.8.88/ubuntu/ focal main restricted universe multiverse
```



#### kylin V10-SP1中sources,list修改为:

```
deb http://172.18.8.88/KYLIN-ALL 101 main universe multiverse restricteddeb http://172.18.8.88/V10-SP1 default all
```





### 2 更新apt源
```
sudo apt-get update
```





### 3 安装所需安装包
```
sudo apt-get install XXXX
```

