https://www.cnblogs.com/puloieswind/p/5853401.html

test buckets
```
adam.torolab.ibm.com:/test               163G  136G   28G  84% /test
adam.torolab.ibm.com:/test/buckets/apps   20G   14G  6.1G  70% /test/buckets/apps



Filesystem                               Size  Used Avail Use% Mounted on
/dev/mapper/rhel-root                     50G   13G   38G  26% /
devtmpfs                                 241G     0  241G   0% /dev
tmpfs                                    254G     0  254G   0% /dev/shm
tmpfs                                    254G  2.1G  252G   1% /run
tmpfs                                    254G     0  254G   0% /sys/fs/cgroup
/dev/mapper/rhel-home                    210G  196G   15G  94% /home
/dev/sda2                               1014M  201M  814M  20% /boot
adam.torolab.ibm.com:/test               163G  136G   28G  84% /test
tlbgsa.ibm.com:/gsa/tlbgsa-h1            9.3T  7.0T  2.3T  76% /gsa/tlbgsa-h1
tlbgsa.ibm.com:/gsa/tlbgsa-p3             47T   40T  7.0T  85% /gsa/tlbgsa-p3
adam.torolab.ibm.com:/test/buckets/apps   20G   14G  6.1G  70% /test/buckets/apps
tlbgsa.ibm.com:/gsa/tlbgsa               3.7T  470G  3.3T  13% /gsa/tlbgsa
tlbgsa.ibm.com:/gsa/tlbgsa-p2             47T   43T  3.5T  93% /gsa/tlbgsa-p2
tlbgsa.ibm.com:/gsa/tlbgsa-p1             32T   18T   15T  55% /gsa/tlbgsa-p1
paix505.rtp.raleigh.ibm.com:/xl_le       1.7T  1.5T  266G  85% /xl_le
everest.torolab.ibm.com:/xlflogs         121G   99G   22G  82% /xlflogs
tmpfs                                     51G     0   51G   0% /run/user/0
9.23.31.20:/gsa/tlbgsa-p2                 47T   43T  3.5T  93% /gsa/tlbgsa-p2
9.23.31.20:/gsa/tlbgsa-h1                9.3T  7.0T  2.3T  76% /gsa/tlbgsa-h1
9.23.31.20:/gsa/tlbgsa-p3                 47T   40T  7.0T  85% /gsa/tlbgsa-p3
9.23.31.21:/gsa/tlbgsa                   3.7T  470G  3.3T  13% /gsa/tlbgsa
9.23.31.21:/gsa/tlbgsa-p1                 32T   18T   15T  55% /gsa/tlbgsa-p1
tmpfs                                     51G     0   51G   0% /run/user/1010

```

# 查看文件挂载点信息
```
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
```
mount 9.26.29.200:/test /test -t nfs -o nfsvers=3
```

# umount
```
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

