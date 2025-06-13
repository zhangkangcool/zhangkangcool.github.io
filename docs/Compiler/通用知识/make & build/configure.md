<h1 align="center">configure</h1>
# 1. configure

### 1.1 help info

```
./configure --help


Installation directories:
  --prefix=PREFIX         install architecture-independent files in PREFIX
                          [/usr/local]
  --exec-prefix=EPREFIX   install architecture-dependent files in EPREFIX
                          [PREFIX]
```

### 1.1 useful command

```
// install the program in local usr directory
./configure --prefix=/home/ken/usr   
```



### build

编译时，最好新建build目录，否则编译的临时文件全部在当前目录

```
mkdir build
cd build
../configure --prefix=/home/ken/usr  
```

