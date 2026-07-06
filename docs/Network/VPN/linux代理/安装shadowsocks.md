<h1 align="center">安装shadowsocks</h1>




## 1. 使用pip安装2.8.2版本（不推荐的方式）

```
pip install shadowsocks 
sslocal --version查看版本
```



这里安装的是2.8.2版本，如果要使用`aes-256-gcm`加密方式的话，会有错误，需要安装更高版本：

https://liqiang.io/post/aes-256-gcm-not-supported-solution-50fd04e3

```
ERROR method aes-256-gcm not supported
```



先删除pip安装的版本

```
pip uninstall shadowsocks # 出现错误的话，进行删除
```



# 2. 源码安装3.0版本（推荐方式）

https://liqiang.io/post/aes-256-gcm-not-supported-solution-50fd04e3

https://yaronzz.com/post/ss_install/

```python
# 下载代码
# 通过任意方式得到master.zip
wget https://github.com/shadowsocks/shadowsocks/archive/master.zip

unzip master.zip

cd master

sudo python3 setup.py install
sslocal --version
```



也可以直接用pip进行安装(需要能访问github)

```python
pip install https://github.com/shadowsocks/shadowsocks/archive/master.zip -U
```

