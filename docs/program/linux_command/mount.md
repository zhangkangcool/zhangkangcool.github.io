<h1 align="center">mount</h1>
https://www.cnblogs.com/puloieswind/p/5853401.html

# 查看文件挂载点信息
```shell
df -h

Filesystem                  Size  Used Avail Use% Mounted on
/dev/mapper/rhel--l-root    200G   57G  144G  29% /
devtmpfs                    254G     0  254G   0% /dev
tmpfs                       254G     0  254G   0% /dev/shm
tmpfs                       254G   98M  254G   1% /run
tmpfs                       254G     0  254G   0% /sys/fs/cgroup
/dev/sde2                   494M  225M  269M  46% /boot
/dev/mapper/svcvg-svclv     2.0T  1.1T  985G  52% /home
9.23.31.20:/gsa/tlbgsa      3.7T  423G  3.3T  12% /gsa/tlbgsa
9.23.31.20:/gsa/tlbgsa-p3    47T   41T  6.0T  88% /gsa/tlbgsa-p3
9.23.31.20:/gsa/tlbgsa-p2    47T   42T  5.2T  89% /gsa/tlbgsa-p2
9.23.31.20:/gsa/tlbgsa-h1   9.3T  7.3T  2.0T  79% /gsa/tlbgsa-h1
9.23.31.20:/gsa/tlbgsa-p1    32T   25T  6.7T  79% /gsa/tlbgsa-p1
9.23.126.11:/gsa/congsa     7.8T  5.4T  2.4T  70% /gsa/congsa
9.23.126.11:/gsa/congsa-p2  9.5T  7.3T  2.2T  77% /gsa/congsa-p2
9.23.31.21:/gsa/tlbgsa-p4   9.3T  4.4T  4.9T  48% /gsa/tlbgsa-p4
9.23.31.20:/gsa/tlbgsa      3.7T  423G  3.3T  12% /gsaro/tlbgsa
9.23.31.21:/gsa/tlbgsa-p2    47T   42T  5.2T  89% /gsaro/tlbgsa-p2
9.23.31.20:/gsa/tlbgsa-p1    32T   25T  6.7T  79% /gsaro/tlbgsa-p1
```

通过配置文件查看挂载信息
```shell
cat /etc/fstab
# also you can use mount to see the mount info 
mount 
```

# mount the remove filesystme
mount 9.23.31.20:/gsa/tlbgsa /gsa/tlbgsa

# Remote I/O error
aix nfs share to linux
mount 报错:mount.nfs: Remote I/O error
挂载时需要指明版本，由于NFS服务器有多个版本，V2、V3、V4。而且各版本同时运行，因此挂载时需要说明版本号。由于NFS V2最大只支持32BIT的文件大小（4g）,而NFS V3则支持64BIT文件大小。另外V3对于V2还有其他优势，比如文件传输，异步写入等，因此建议采用V3进行访问。

解决办法：mount 加选项 -o nfsvers=3或者-o nfsvers=2       后面IP：/.../..   /...
```shell
mount 9.26.29.200:/test /test -t nfs -o nfsvers=3
```

# umount
```shell
umout -u /gsa/tlbgsa
```

### Error: device is busy
有人正在使用，应该找出这个人，或者使用-f强制umout
[root@DB-Server u06]# fuser -m  /gsa/tlbgsa
/u06:                10584c
[root@DB-Server u06]# kill -9 10584







9.23.31.20:/gsa/tlbgsa-p1    32T   17T   15T  54% /gsa/tlbgsa-p1
9.23.126.11:/gsa/congsa-p2   11T  8.3T  2.5T  77% /gsa/congsa-p2
9.23.31.20:/gsa/tlbgsa-p4    13T   11T  2.4T  82% /gsa/tlbgsa-p4

