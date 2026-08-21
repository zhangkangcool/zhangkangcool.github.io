# 安装zsh



```shell
sudo apt-get install zsh
```



如果无法使用apt等命令进行安装，需要使用源码进行安装



## 源码安装ZSH

以下是源码下载地址

```shell
https://github.com/zsh-users/zsh/tags
wet https://github.com/zsh-users/zsh/archive/refs/tags/zsh-5.9.tar.gz
```





根据INSTALL指引

```shell
./Util/preconfig   # 产生 configure文件
mkdir build
cd build
../configure # --prefix=/home/ken/software/install
make -j
sudo make install
```

