[Source Website](http://4554480.blog.51cto.com/4544480/837006)

放在/root目录下。下面介绍几种在终端执行shell脚本的方法：
测试shell脚本
```
[root@localhost ~]#pwd
/root
[root@localhost ~]#vim hello.sh
#!  /bin/bash
cd /tmp
echo "hello guys!"
echo "welcome to my Blog:linuxboy.org!"
```

## 1.切换到shell脚本所在的目录，执行：
```
[root@localhost ~]# ./hello.sh
-bash: ./ hello.sh: 权限不够
```

## 2. 以绝对路径的方式执行：
```
[root@localhost ~]# /root/Desktop/hello.sh
-bash: /root/Desktop/ hello.sh: 权限不够
```

## 3. 直接用bash或sh执行：
```
[root@localhost ~]# bash hello.sh
hello guys!
welcome to my Blog:linuxboy.org!
[root@localhost ~]# pwd
/root
 
[root@localhost ~]# sh hello.sh
hello guys!
welcome to my Blog:linuxboy.org!
[root@localhost ~]# pwd
/root
```
注意：用以上三种方法执行shell脚本，现行的shell会开启一个子shell环境，去执行shell脚本，前两种必须要有执行权限才能够执行。如果文件有执行权限则前三种是等价的

###  NOTE:也可以让shell脚本在现行的shell中执行：
## 4. 现行的shell中执行
```
[root@localhost ~]# . hello.sh
hello guys!
welcome to my Blog:linuxboy.org!
[root@localhost tmp]# pwd
/tmp

[root@localhost ~]# source hello.sh
hello guys!
welcome to my Blog:linuxboy.org!
[root@localhost tmp]# pwd
/tmp
```

对于第4种不会创建子进程，而是在父进程中直接执行
上面的差异是因为子进程不能改变父进程的执行环境，所以cd(内建命令，只有内建命令才可以改变shell 的执行环境)没有成功，但是第4种没有子进程，所以cd成功。

### NOTICE:如果使用脚本去执行环境变量，为了使脚本在当前的shell中生效，必须使用第四种方法，否则环境变量不会被修改。
