<h1 align="center">安装zsh</h1>



```shell
sudo apt-get install zsh
```



如果无法使用apt等命令进行安装，需要使用源码进行安装



## 源码安装ZSH

以下是源码下载地址

```shell
https://github.com/zsh-users/zsh/tags
```





根基INSTALL指引

```
./Util/preconfig   # 产生 configure文件
mkdir build
cd build
../configure
make -j
sudo make install
```

