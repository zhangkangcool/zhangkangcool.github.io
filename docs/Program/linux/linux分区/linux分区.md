# linux分区



根据 [查看分区情况](查看分区情况.md) 确认有未分区的空间，下面按以下步骤新建分区：



## 1 运行分区工具

```shell
sudo fdisk /dev/sda                                                          
                                                                                                         
Welcome to fdisk (util-linux 2.35.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.   
```



## 2 新建分区

下面按以下步骤进行

```
n：创建新分区
选择分区类型（默认p主分区即可）
分区号（默认自动分配）
起始扇区（默认直接按回车，使用默认值）
结束扇区（默认直接按回车，使用全部未分配空间）
w：保存设置并退出
```



### 2.1 查看帮助

```shell
Command (m for help): m
Help: 
  GPT
   M   enter protective/hybrid MBR

  Generic
   d   delete a partition
   F   list free unpartitioned space
   l   list known partition types
   n   add a new partition
   p   print the partition table
   t   change a partition type
   v   verify the partition table
   i   print information about a partition

  Misc
   m   print this menu
   x   extra functionality (experts only)

  Script
   I   load disk layout from sfdisk script file
   O   dump disk layout to sfdisk script file

  Save & Exit
   w   write table to disk and exit
   q   quit without saving changes

  Create a new label
   g   create a new empty GPT partition table
   G   create a new empty SGI (IRIX) partition table 
   o   create a new empty DOS partition table
   s   create a new empty Sun partition table
```





### 2.2 开始分区

```shell
Command (m for help): n                                      
Partition number (8-128, default 8):                    # 分区号（默认自动分配）            
First sector (96471040-234441614, default 96471040):    # 起始扇区（默认直接按回车，使用默认值）
Last sector, +/-sectors or +/-size{K,M,G,T,P} (96471040-234441614, default 234441614):   结束扇区（默认直接按回车，使用全部未分配空间）
                                                    
Created a new partition 8 of type 'Linux filesystem' and of size 65.8 GiB.
                                                    
Command (m for help): w                                 # 保存设置并退出
The partition table has been altered.
Syncing disks.                   
```



## 3 确认分区情况

```shell
ken@loongarch64:~/software$ sudo fdisk  -l                                                               
Disk /dev/sda: 111.81 GiB, 120034123776 bytes, 234441648 sectors
Disk model: ZSPEED SSD 120GB             
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt                          
Disk identifier: D929271A-146B-4E88-8A7C-4AD6403058CA
                                                    
Device        Start       End   Sectors  Size Type
/dev/sda1      2048   6293503   6291456    3G Linux filesystem
/dev/sda2   6293504   8390655   2097152    1G EFI System
/dev/sda3   8390656  50333695  41943040   20G Linux filesystem
/dev/sda4  50333696  58722303   8388608    4G Linux filesystem
/dev/sda5  58722304  67110911   8388608    4G Linux swap
/dev/sda6  67110912  88082431  20971520   10G Linux filesystem
/dev/sda7  88082432  96471039   8388608    4G Linux filesystem
/dev/sda8  96471040 234441614 137970575 65.8G Linux filesystem

```



## 4 挂载分区

```shell
sudo mkdir /mnt/sda8
ken@loongarch64:~/software$ sudo mount /dev/sda8 /mnt/sda8
mount: /mnt/sda8: wrong fs type, bad option, bad superblock on /dev/sda8, missing codepage or helper program, or other error.

需要先格式化
ken@loongarch64:/mnt$ sudo mkfs.ext4 /dev/sda8
mke2fs 1.45.7 (28-Jan-2021)
Discarding device blocks: done                             
Creating filesystem with 17246320 4k blocks and 4317184 inodes
Filesystem UUID: 759e478e-8ca3-4728-8fed-25114407d883
Superblock backups stored on blocks: 
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,                          
        4096000, 7962624, 11239424

Allocating group tables: done                             
Writing inode tables: done                             
Creating journal (131072 blocks): done
Writing superblocks and filesystem accounting information: done   
```



```shell

sudo chmod 777 /mnt/sda8
cd /mnt/sda8
mkdir workspace


cd /home/ken
ln -s  /mnt/sda8/workspace workspace
```

