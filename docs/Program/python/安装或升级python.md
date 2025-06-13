<h1 align="center">安装或升级python</h1>


https://www.zhihu.com/question/265332835/answer/2263342488



# 安装依赖

安装zlib和SSL其中zlib在安装的时候用来解包，**SSL如果不装则Python可用，Pip不可用**

### 1. 安装zlib

```shell
yum install zlib-devel -y
```



ubuntu下使用

```shell
http://www.jsxyy.com.cn/voddetail/181138.html

# 请记住 g前面的字母是数字1，而不是小写的字母L。很多人在输入命令时都会犯这个错误。
sudo apt install zlib1g

# 另一个包，zlib 1g-dev 是开发包。只有在你需要时才安装它，否则你应该使用 zlib 1g 包。
sudo apt install zlib1g-dev
```





下载一个最新版本的Python

```shell
wget https://www.python.org/ftp/python/3.9.7/Python-3.9.7.tgz
```

解压 进目录 

然后configure，这里是准备安装在系统目录,

```shell
./configure -prefix=/usr/local/python3 -with-openssl=/usr/local/openssl -enable-optimizations

#debug 
./configure -prefix=/usr/local/python3 -with-openssl=/usr/local/openssl
```

make

```shell
make -j4
make install 

# 安装在系统目录的话，使用sudo make install


```

最后创建软链接到环境变量

```shell
ln -s /usr/local/python3/bin/python3.9 /usr/bin/python3
ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3
```

