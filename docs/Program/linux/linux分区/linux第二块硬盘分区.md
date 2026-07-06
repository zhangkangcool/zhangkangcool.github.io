# linuxç¬¬äºåç¡¬çååº

## 1. 磁盘信息

```shell
kylin@kylin-pc:~$ lsblk
NAME         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda            8:0    0 119.2G  0 disk 
├─sda1         8:1    0   512M  0 part /boot/efi
├─sda2         8:2    0     1G  0 part /boot
├─sda3         8:3    0  58.3G  0 part /
├─sda4         8:4    0    16G  0 part 
├─sda5         8:5    0  38.9G  0 part /data
└─sda6         8:6    0   4.5G  0 part [SWAP]
sdb            8:16   0 111.8G  0 disk 
├─sdb1         8:17   0   600M  0 part 
├─sdb2         8:18   0     1G  0 part 
└─sdb3         8:19   0 110.2G  0 part 
  ├─uos-swap 252:0    0   7.9G  0 lvm  
  ├─uos-home 252:1    0  32.3G  0 lvm  
  └─uos-root 252:2    0    70G  0 lvm  
我需要删除sdb的所有分区，并重新新建两个分区，第一个60G，剩下第二个
```





## 2. 分区

##### 2.1 启动分区工具

```shell
sudo fdisk /dev/sdb
```



##### 2.2 删除所有分区

```python
输入p查看当前分区表，确认目标磁盘正确
输入d删除分区，若有多个分区，会依次删除（重复此步骤直到所有分区都被删除）
输入p再次确认所有分区已被删除
```



##### 2.3 创建新分区

```shell
# 创建第一块分区
输入n创建新分区
选择p创建主分区
分区号按默认（1）
起始扇区按默认
结束扇区输入+60G（分配 55GB 空间）

# 创建第二个分区
再次输入n
选择p创建主分区
分区号默认（2）
起始扇区默认
结束扇区默认（会自动使用剩余空间，约 50GB）
保存更改
输入w保存分区表并退出
```





## 3. 格式化分区

```shell
# 格式化为ext4文件系统（常用格式）
sudo mkfs.ext4 /dev/sdb1
sudo mkfs.ext4 /dev/sdb2
```





## 4. 验证结果

```shell
lsblk /dev/sdb
或者
sudo fdisk /dev/sdb -l
```

