<h1 align="center">安装JARI-WORKS</h1>





以下操作进入麒麟系统进行操作 

## 1. 划定新分区

使用磁盘分区工具划分出10G左右的新空间(装双系统时预留的未在麒麟中分配使用的空间)，并格式化为ext4格式，这里假定新分区为/dev/sda7, sda1~6是麒麟下的已知分区，通过`df -h`可以看到。

```shell
麒麟系统的分区情况，sda1~sda6被使用。
ken@ken-pc:~$ df -h
文件系统        容量  已用  可用 已用% 挂载点
udev            3.8G   16K  3.8G    1% /dev
tmpfs           771M  5.3M  766M    1% /run
/dev/sda3        20G   11G  8.5G   55% /
/dev/sda1       2.9G  147M  2.6G    6% /boot
/dev/sda2      1022M   41M  982M    5% /boot/efi
/dev/sda6       9.8G  115M  9.2G    2% /data
/dev/sda4       3.9G   67M  3.6G    2% /tmp
tmpfs           3.8G   32K  3.8G    1% /dev/shm
tmpfs           5.0M   16K  5.0M    1% /run/lock
tmpfs           3.8G     0  3.8G    0% /sys/fs/cgroup
tmpfs           771M   64K  771M    1% /run/user/1000
```





## 2 解压安装从os-package

2/3根据拿到的镜像选择其中之一

##### 2.1 仅将安装包中的***\*os-package文件夹\****复制到目标机器中，进入该目录

```shell
cd  os-package
```



##### 2.2 变更uzip.sh的权限

```shell
chmod 755 uzip.sh
```



##### 2.3 切换root用户（麒麟系统下）

```shell
sudo su 和  su root
```



##### 2.4 假定新划定的空白分区为/dev/sda7，并被挂载至/mnt/sda7下。执行uzip.sh脚本，例如：

```shell
./uzip.sh /mnt/sda7
这里也可以使用
sudo mount /dev/sda7 /mnt/sda7
```



## 3 解压安装从image

2/3根据拿到的镜像选择其中之一

```shell
sudo mount /dev/sda7 /mnt/sda7  # 根据实际情况选择空闲的挂在盘
```

以下命令如果报权限问题，则使用sudo或者是进行



### 3.1 解压core-image-jari-loongarch64-20250814021925.rootfs.tar.gz

得到以下文件，最好直接将此tar.bz文件解压到`/mnt/sda7`下，因为这是系统的内核。

```shell
$ ls /mnt/sda7
bin/   dev/  home/  lib64@  mnt/   run/   sys/  usr/
boot/  etc/  lib/   media/  proc/  sbin/  tmp/  var/
```



```shell
$ ls /mnt/sda7/boot
EFI/  vmlinuz@  vmlinuz-4.19.190-la   # 只有3个文件，其余文件从第二步复制而来
```



````
$ ls lib/modules       # modules下的test文件从第二步复制而来
4.19.190-la/
````





### 2. 解压`20250813-2k2000-内核及头文件.zip`

此部其实是将两个文件夹中的内容得到到上一步系统的内核的对应地方。



解压`20250813-2k2000-内核及头文件.zip`后，再解压其中的`2k2000-A101_JARI-Works_kernelImage_4.19.272-rt120.JARI-Works.0428-test-merge-dev-1.1-580f8f1f.tar.gz`文件，得到 `boot` 和 `lib` 两个文件夹。

##### 其中`boot`内为以下内容：

```shell
$ tree boot
boot
├── System.map-4.19.272-rt120.JARI-Works.0428-test
├── config-4.19.272-rt120.JARI-Works.0428-test
├── jxworks
├── vmlinux-4.19.272-rt120.JARI-Works.0428-test
└── vmlinuz-4.19.272-rt120.JARI-Works.0428-test
```

将此部得到的boot/*的内容，复制到image解压出来的/boot/下。

```shell
$ ls /mnt/sda7/boot
config-4.19.272-rt120.JARI-Works.0428-test  EFI      System.map-4.19.272-rt120.JARI-Works.0428-test  vmlinuz              vmlinuz-4.19.272-rt120.JARI-Works.0428-test
efi                                         jxworks  vmlinux-4.19.272-rt120.JARI-Works.0428-test     vmlinuz-4.19.190-la
```





##### `lib`下为下以内容

```
lib/modules/4.19.272-rt120.JARI-Works.0428-test   # lib下只有modules文件夹，modules下只有此test文件夹
```

将此部得到的`lib/modules/4.19.272-rt120.JARI-Works.0428-test`复制到`image`解压后得到的`lib/modules`下。

```
$ ls /mnt/sda7/lib/modules
4.19.190-la  4.19.272-rt120.JARI-Works.0428-test  
```





## 4 复制内核及修改启动配置文件

假定内核所在分区为/dev/sda1，并被挂载至/mnt/sda1下。

##### 4.1 复制内核到启动分区，例如：

```shell
cp /mnt/sda7/boot/jxworks /boot-v  # 将jxworks复制到麒麟系统下的/boot下, -v输出更详细的信息
或者
cp /mnt/sda7/boot/jxworks /boot -v  # 将jxworks复制到麒麟系统下的/boot下, -v输出更详细的信息
可能需要修改jxworks权限
sudo chmod 777 /boot/jxworks
```



以下是麒麟系统`/boot`下的内容，`jxworks`是从`/mnt/sda7/boot/jxworks`复制而来。

```shell
ken@ken-pc:/boot$ ls
boot  boot.cfg  config-5.4.18-142-generic  efi  EFI  grub  initrd.img  initrd.img-5.4.18-142-generic  initrd.img.old  jxworks  lost+found  System.map-5.4.18-142-generic  TRANS.TBL  vmlinuz  vmlinuz-5.4.18-142-generic  vmlinuz.old
```

##### 4.2 修改启动配置文件

对uefi启动方式，修改grub配置文件，通常位于/mnt/sda1/grub/grub.cfg也就是`/boot/grub/grub.cfg`，修改进入系统时的系统选择项部分，新增JARI-worrks。

可从已有可用启动项中复制一项，修改内核名为jxworks，修改根文件系统所在分区为/dev/sda7，例如：

以下是 /boot/grub/grub.cfg中的内容，2到6行是新加的JARI。

```shell
以下几行为为JARI新增内容
menuentry "JARI_WORKS V4"{
        insmod part_gpt
        insmod ext2
        linux /jxworks root=/dev/sda7 rw console=tty rootwait rw locale=zh_CN efi=runtime
}

# 以下为原来就有的内容，不用管
menuentry 'Kylin V10 SP1 5.4.18-142-generic' --unrestricted --class kylin --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-simple-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
        recordfail
        load_video
        gfxmode $linux_gfx_mode
        insmod gzio
        if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
        insmod part_gpt
        insmod ext2
        set root='hd0,gpt1'
        if [ x$feature_platform_search_hint = xy ]; then
          search --no-floppy --fs-uuid --set=root --hint-ieee1275='ieee1275//disk@0,gpt1' --hint-bios=hd0,gpt1 --hint-efi=hd0,gpt1 --hint-baremetal=ahci0,gpt1  3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
        else
          search --no-floppy --fs-uuid --set=root 3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
        fi
        linux   /vmlinuz-5.4.18-142-generic root=UUID=9ed600f3-10f3-4096-af3e-869ad9f3e0bb ro  quiet splash loglevel=0   resume=UUID=eef26e8c-52df-4291-a1da-c23136ed20d5 security=kysec
        initrd  /initrd.img-5.4.18-142-generic
}
  submenu 'Kylin V10 SP1 (系统备份还原模式)' --unrestricted $menuentry_id_option 'gnulinux-advanced-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
        menuentry 'Kylin V10 SP1 (backup mode)'  --unrestricted --class kylin --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-5.4.18-142-generic-backup-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
                recordfail
                load_video
                gfxmode $linux_gfx_mode
                insmod gzio
                if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
                insmod part_gpt
                insmod ext2
                set root='hd0,gpt1'
                if [ x$feature_platform_search_hint = xy ]; then
                  search --no-floppy --fs-uuid --set=root --hint-ieee1275='ieee1275//disk@0,gpt1' --hint-bios=hd0,gpt1 --hint-efi=hd0,gpt1 --hint-baremetal=ahci0,gpt1  3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                else
                  search --no-floppy --fs-uuid --set=root 3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                fi
                echo    '载入 Linux 5.4.18-142-generic ...'
              linux   /vmlinuz-5.4.18-142-generic root=UUID=9ed600f3-10f3-4096-af3e-869ad9f3e0bb rw  quiet splash loglevel=0   resume=UUID=eef26e8c-52df-4291-a1da-c23136ed20d5 security=kysec selinux=0 backup 
              initrd  /initrd.img-5.4.18-142-generic
        }
        menuentry 'Kylin V10 SP1 (restore mode)'  --unrestricted --class kylin --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-5.4.18-142-generic-restore-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
                recordfail
                load_video
                gfxmode $linux_gfx_mode
                insmod gzio
                if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
                insmod part_gpt
                insmod ext2
                set root='hd0,gpt1'
                if [ x$feature_platform_search_hint = xy ]; then
                  search --no-floppy --fs-uuid --set=root --hint-ieee1275='ieee1275//disk@0,gpt1' --hint-bios=hd0,gpt1 --hint-efi=hd0,gpt1 --hint-baremetal=ahci0,gpt1  3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                else
                  search --no-floppy --fs-uuid --set=root 3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                fi
                echo    '载入 Linux 5.4.18-142-generic ...'
              linux   /vmlinuz-5.4.18-142-generic root=UUID=9ed600f3-10f3-4096-af3e-869ad9f3e0bb rw  quiet splash loglevel=0   resume=UUID=eef26e8c-52df-4291-a1da-c23136ed20d5 security=kysec selinux=0 restore 
              initrd  /initrd.img-5.4.18-142-generic
        }
        menuentry 'Kylin V10 SP1 (restore-retain-userdata mode)'  --unrestricted --class kylin --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-5.4.18-142-generic-restore-retain-userdata-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
                recordfail
                load_video
                gfxmode $linux_gfx_mode
                insmod gzio
                if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
                insmod part_gpt
                insmod ext2
                set root='hd0,gpt1'
                if [ x$feature_platform_search_hint = xy ]; then
                  search --no-floppy --fs-uuid --set=root --hint-ieee1275='ieee1275//disk@0,gpt1' --hint-bios=hd0,gpt1 --hint-efi=hd0,gpt1 --hint-baremetal=ahci0,gpt1  3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                else
                  search --no-floppy --fs-uuid --set=root 3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                fi
                echo    '载入 Linux 5.4.18-142-generic ...'
              linux   /vmlinuz-5.4.18-142-generic root=UUID=9ed600f3-10f3-4096-af3e-869ad9f3e0bb rw  quiet splash loglevel=0   resume=UUID=eef26e8c-52df-4291-a1da-c23136ed20d5 security=kysec selinux=0 restore-retain-userdata 
              initrd  /initrd.img-5.4.18-142-generic
        }
  }
submenu 'Kylin V10 SP1 的高级选项' --unrestricted $menuentry_id_option 'gnulinux-advanced-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
        menuentry 'Kylin V10 SP1, 5.4.18-142-generic'  --unrestricted --class kylin --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-5.4.18-142-generic-advanced-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
                recordfail
                load_video
                gfxmode $linux_gfx_mode
                insmod gzio
                if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
                insmod part_gpt
                insmod ext2
                set root='hd0,gpt1'
                if [ x$feature_platform_search_hint = xy ]; then
                  search --no-floppy --fs-uuid --set=root --hint-ieee1275='ieee1275//disk@0,gpt1' --hint-bios=hd0,gpt1 --hint-efi=hd0,gpt1 --hint-baremetal=ahci0,gpt1  3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                else
                  search --no-floppy --fs-uuid --set=root 3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                fi
                echo    '载入 Linux 5.4.18-142-generic ...'
                linux   /vmlinuz-5.4.18-142-generic root=UUID=9ed600f3-10f3-4096-af3e-869ad9f3e0bb ro  quiet splash loglevel=0   resume=UUID=eef26e8c-52df-4291-a1da-c23136ed20d5 security=kysec
                echo    '载入初始化内存盘...'
                initrd  /initrd.img-5.4.18-142-generic
        }
        menuentry 'Kylin V10 SP1, 5.4.18-142-generic (recovery mode)' --class kylin --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-5.4.18-142-generic-recovery-9ed600f3-10f3-4096-af3e-869ad9f3e0bb' {
                recordfail
                load_video
                insmod gzio
                if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
                insmod part_gpt
                insmod ext2
                set root='hd0,gpt1'
                if [ x$feature_platform_search_hint = xy ]; then
                  search --no-floppy --fs-uuid --set=root --hint-ieee1275='ieee1275//disk@0,gpt1' --hint-bios=hd0,gpt1 --hint-efi=hd0,gpt1 --hint-baremetal=ahci0,gpt1  3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                else
                  search --no-floppy --fs-uuid --set=root 3c60b334-4a83-47a2-9ce5-c8d7a1f6d79f
                fi
                echo    '载入 Linux 5.4.18-142-generic ...'
                linux   /vmlinuz-5.4.18-142-generic root=UUID=9ed600f3-10f3-4096-af3e-869ad9f3e0bb ro single nomodeset  security=kysec
                echo    '载入初始化内存盘...'
                initrd  /initrd.img-5.4.18-142-generic
        }
}
```



系统选择界面时按e可以看到以下内容（这里不用管，只是为了说明上述对grub.cfg如何起作用的）：

```shell
setparams 'JARI-Works V4'

   insmod part_gpt
   insmod ext2
   set root='hd0, gpt1'
   linux /jxworks  root=/dev/sda6 rw console=tty rootwait rw locale=zh_CN efi=runtime
```



##### 4.3 重启系统

在进入麒麟时会出现多一行未`JARI-Works V4`。下一行则是麒麟，再下一行时麒麟修复模式。
