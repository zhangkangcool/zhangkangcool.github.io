<h1 align="center">apt_pkg</h1>
https://zhuanlan.zhihu.com/p/547673946



今天在ubuntu升级到Python3.8的过程中遇到一个问题，提示No module named 'apt_pkg'，这里记录一下解决方案

1、进入包文件目录

```asm
cd /usr/lib/python3/dist-packages/ 
```

2、执行软连接

```asm
ln -s apt_pkg.cpython-36m-x86_64-linux-gnu.so apt_pkg.so 
```

如果apt_pkg.so已存在，则使用：

```asm
ln -fs apt_pkg.cpython-36m-x86_64-linux-gnu.so apt_pkg.so  
```

或者可以使用：

```asm
apt install python3-apt 
cd /usr/lib/python3/dist-packages 
cp apt_pkg.cpython-35m-x86_64-linux-gnu.so apt_pkg.cpython-36m-x86_64-linux-gnu.so 
```