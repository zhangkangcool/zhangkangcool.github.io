# configure


## 1. configure介绍

configure是shell脚本，和make/cmake不用，后者是程序，前者是写的脚本，每个源码程序带的configure脚本不一样。

```shell
bash/sh -x ./configure  # 相当于在脚本第一行中加上 set -x，  set -x是对此行之后有效，bash -x全部有效，所有相当于加在第一行。
```







## 2. configure使用

### 2.1 help info

```c++
./configure --help


Installation directories:
  --prefix=PREFIX         install architecture-independent files in PREFIX
                          [/usr/local]
  --exec-prefix=EPREFIX   install architecture-dependent files in EPREFIX
                          [PREFIX]
```

### 2.2 useful command

```c++
// install the program in local usr directory
./configure --prefix=/home/ken/usr   
```



### 2.3 build

编译时，最好新建build目录，否则编译的临时文件全部在当前目录

```c++
mkdir build
cd build
../configure --prefix=/home/ken/usr  
```

