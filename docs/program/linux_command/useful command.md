

# 1. scp

copy from remote to local
```
scp -r ken@host_address:/home/test.txt .
```

copy from local to remote
```
scp -r /home/text.txt ken@host_address:~
```

# 2. du 目录信息

local current dir size
```shell
du -ah --max-depth=1
du -h -d 1
du --max-depth=1 -h -B G /home/ | sort -rn
du --max-depth=1 -h -B G . | sort -rn
```

# 3. 重导向

`>>` append

### 3.1. trash

```shell
ls -al > /dev/null
```

### 3.2. To file

```shell
ls -al 1> list.txt 2> ok.txt
ls -al > list.txt 2>&1
```

# 4. nm查看导出库

```shell
nm libc.so
```

# 5. 杀死用户所有进程
### 5.1 pkill方式

```shell
pkill -u zhangnq
```
### 5.2 killall方式
```
killall -u zhangnq
```
### 5.3 ps方式 ps列出zhangnq的pid，然后依次kill掉，比较繁琐。
```
ps -ef | grep zhangnq | awk '{ print $2 }' | xargs kill -9
```
### 5.4 pgrep方式 pgrep -u参数查出用户的所有pid，然后依次kill
```
pgrep -u zhangnq | xargs kill -9
```

# 6. 查看linux导出符号和依赖库
https://www.cnblogs.com/xiaomanon/p/4203671.html
### 1. nm *.a 静态库
```
nm abc.a
```

### 2. nm *.so 动态库
```
nm -D abc.so
or 
objdump -tT abc.so
```

### 3. ldd 查看依赖库


# 7. 输出正在运行的命令行
```
bash -x
```





# 8. xdg-open

xdg-open用法非常简单，就直接参数传入要打开的文件，等效于鼠标双击打开，系统会根据文件类型自动调用对应的程序

```shell
xdg-open  xxx.doc
xdg-open  xxx.pdf
xdg-open  xxx.png
```





# 9. 查看内存CPU等信息 & 绑定CPU
```
lscpu
ppc64_cpu --info
cat /proc/cpuinfo
cat /proc/meminfo

tasket -c 12 ./a.out
```




# 10. linux release

```
cat /etc/os-release
```

# 13 ln -s

```shell
ln -s /lib64/libncurses.so.6 libncurses.so.5
ln -s exit_file new_link_file
```

### 批量建立符号链接

https://blog.csdn.net/hnlyyk/article/details/49303741

- 使用`ln`命令

  ```shell
  ln -s /tmp/*.log /tmp/lnk/
  
  #bin目录下的所有文件建立在当前文件的符号链接
  ln -s /home/shkzhang/llvm/build/bin/* .
  ```

  

- 使用`cp`命令的参数`rs`

  ```shell
  cp -rs /tmp/*.log /tmp/lnk/
  ```

  

- 写shell脚本，一个比较愚蠢的方法

```shell
for FILE in /tmp/*.log;do ln -s $FILE '/tmp/lnk_'`basename $FILE`;done
```



# 14 file 查看文件类型

```shell
/home/shkzhang/llvm/build/bin/clang++ -c -o Playout.o -DSPEC -DNDEBUG -I. -DSPEC_AUTO_SUPPRESS_OPENMP     -O3 -m64 -mcpu=power9 -fexperimental-new-pass-manager  -fprofile-use=default.profdata -flto -Wl,-q  -Wl,-rpath=/home/shkzhang/llvm/build/lib      -DSPEC_LP64  Playout.cpp

[shkzhang@recycler:~/spec_clang_result/benchspec/CPU/541.leela_r/build/build_peak_clang_default.0000]$ file Playout.o
Playout.o: LLVM IR bitcode



```









