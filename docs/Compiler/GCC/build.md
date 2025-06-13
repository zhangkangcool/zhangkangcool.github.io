<h1 align="center">gbuild</h1>
# 1. Download site

```shell
http://ftp.gnu.org/gnu/gcc/gcc-6.2.0/
```
中科大源
```shell
wget http://mirrors.ustc.edu.cn/gnu/gcc/gcc-6.2.0/gcc-6.2.0.tar.bz2
```


# 2. Build & Install
https://blog.csdn.net/tianshi0007/article/details/52981360?locationNum=9&fps=1

```shell
 ./configure CFLAGS="-g -O0" --prefix=/home/zhangkang/software/gcc-6.2.0  --with-gmp=/home/zhangkang/software/gmp-5.0.1 --with-mpfr=/home/zhangkang/software/mpfr-4.0.1 --with-mpc=/home/zhangkang/software_source_code/mpc-1.1.0 --enable-languages=c,c++


 ./configure CFLAGS="-g -O0" --prefix=/home/ken/software/gcc-4.4.0  --with-gmp=/home/ken/software/gmp-5.0.1 --with-mpfr=/home/ken/software/mpfr-4.0.1 --with-mpc=/home/ken/software_source_code/mpc-1.1.0 --enable-languages=c,c++

export LD_LIBRARY_PATH=/home/zhangkang/software/gmp-5.0.1/lib:/home/zhangkang/software/mpfr-4.0.1/lib:/home/zhangkang/software/mpc-1.1.0/lib:$LD_LIBRARY_PATH  

export LD_LIBRARY_PATH=/home/ken/software/gmp-5.0.1/lib:/home/ken/software/mpfr-4.0.1/lib:/home/ken/software/mpc-1.1.0/lib:$LD_LIBRARY_PATH  

./configure CFLAGS="-g -O0" --prefix=/home/zhangkang/software/gcc-6.2.0  -with-gmp=/home/zhangkang/software/gmp-5.0.1 --with-mpfr=/home/zhangkang/software/mpfr-4.0.1 --enable-languages=c,c++

make -j8




mkdir build && cd build
../configure --prefix=/usr/local/gcc6 --enable-checking=release --enable-languages=c,c++ --enable-threads=posix --disable-multilib
# --prefix=/usr/local/gcc6  指定安装路径
# --enable-languages=c,c++  支持的编程语言
# --enable-threads=posix    使用POSIX/Unix98作为线程支持库
# --disable-multilib        取消多目标库编译(取消32位库编译)
```

https://www.cnblogs.com/findumars/p/6375935.html

