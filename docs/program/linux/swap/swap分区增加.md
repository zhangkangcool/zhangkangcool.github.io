https://blog.csdn.net/AlexWang30/article/details/90341172



# Ubuntu 18.04 swap分区扩展（推荐方法）

以下命令只在`ubuntu`上实际使用过



###  1. 查看现在的swap使用情况 

```python
下面几个方式都可以
sudo swapon --show
htop
top 
free -m
```



### 2. 创建 swap 的文件（分配 8G 的swap分区大小）

这里的大小一般有如下原则

```python
当ram < 2G 时，swap=2ram；

当2G < ram < 32G时，swap= 1.5ram

当ram >= 32G 时，swap<=ram；
```



```python
sudo fallocate -l 8G /swapfile
```

   注意：此时可能会显示

```python
fallocate: fallocate failed: Text file busy
```

   

此时执行下述命令进行释放，该命令会删除现有的`swap`分区

```python
sudo swapoff -a

sudo swapon --show 查看，这时已经没有swapfile了
```



再次执行

```python
sudo fallocate -l 8G /swapfile
```



### 3. 执 swapfile 文件设置正确的权限

```python
sudo chmod 600 /swapfile
```



### 4. 使用 mkswap 实用程序在文件上设置 Linux SWAP 区域：

```python
sudo mkswap /swapfile
```



### 5. 激活 swap 文件：

```python
sudo swapon /swapfile
```



### 6. 永久生效

要让创建好的 swap 分区永久生效，可以将 swapfile 路径内容写入到 /etc/fstab 文件当中 ：

先看fstab中是否有如下内容，有则不必再次进行添加。

```python
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

 



## 另一种创建方法（临时方法，每次需要添加）

分配20G的swap空间，这步可能会很慢，推荐使用方法1

```shell
sudo dd if=/dev/zero of=swap bs=1024 count=20480000
sudo mkswap swap
sudo swapon swap
```

再加上永久生效的方法
