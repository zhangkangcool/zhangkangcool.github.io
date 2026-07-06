<h1 align="center">Unzip</h1>




### MacOS or Windows 下解压文件,压缩文件夹中文编码原因导致无法解压

https://www.jianshu.com/p/ed2bdf102364



## zip & unzip command

https://blog.csdn.net/yxys01/article/details/73848720

### 压缩文件夹

```shell
/Users/ken/ssh_bakup
zip -r ssh_qiaojun.zip ssh_qiaojun
```



### 解压

```shell
unzip ssh_qiaojun.zip
```





#### 错误信息

```shell
unzip checkdir error cannot create illegal byte sequence
```



#### 处理方案：

用 ditto 代替 unzip

```shell
 ditto -V -x -k --sequesterRsrc --rsrc thinkpad_backup.zip thinkpad_backup_unzip_dir > log.txt 2>&1
```

