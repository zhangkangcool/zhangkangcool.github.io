





```
grub> set root=(hd1,gpt1)
grub> ls /root
error: file `/root' not found.
grub> ls 
(hd0) (hd0,gpt2) (hd0,gpt1) (hd1) (hd1,gpt6) (hd1,gpt5) (hd1,gpt4) (hd1,gpt3) (hd1,gpt2) (hd1,gpt1) 
grub> ls /
efi/ boot/ 
grub> set root=(hd0,gpt1) 
grub> ls /
lost+found/ acore-image-beta-d2000-20221226041741.rootfs.tar.gz bin/ boot/ dev/ etc/ home/ lib/ log_l 
run/ sbin/ srv/ sys/ tmp/ usr/ var/ Image-4.19.115-01-acorelinux 

```





```
grub> ls
(hd0) (hd0,gpt2) (hd0,gpt1) (hd1) (hd1,gpt6) (hd1,gpt5) (hd1,gpt4) (hd1,gpt3) (hd1,gpt2) (hd1,gpt1) 
grub> ls (hd0,gpt1)
        Partition hd0,gpt1: Filesystem type ext* - Last modification time 2025-09-09 18:45:19 Tuesday, UUID
899a2089-3dad-4547-998c-9ae44a046e61 - Partition start at 1024KiB - Total size 62914560KiB
grub> ls (hd0,gpt1)/
lost+found/ acore-image-beta-d2000-20221226041741.rootfs.tar.gz bin/ boot/ dev/ etc/ home/ lib/ log_lock.pid media 
run/ sbin/ srv/ sys/ tmp/ usr/ var/ Image-4.19.115-01-acorelinux 
grub> ls (hd0)
Device hd0: No known filesystem detected - Sector size 512B - Total size 117220824KiB
grub> ls (hd0)/
error: unknown filesystem.

```



```
|setparams 'AcoreLinux Embedded version V1.0.0.F.2'                                                               
 |                                                                                                                 
 |         # 1. /                                                                                                  
 |        insmod part_gpt       # MBR insmod part_msdos                                                            
 |        insmod ext2           # xfs insmod xfsGRUB                                                               
 |                                                                                                                 
 |        # 2. GRUBroot=/dev/sdb1                                                                                  
 |        # set root='PARTUUID=b96da6b5-dadf-5041-8c89-e20546c6c7d2'   # hd1gpt1                                   
 |        # set root=(hd0,gpt1)                                                                                    
 |        set root='UUID=899a2089-3dad-4547-998c-9ae44a046e61'   # hd1gpt1  

 |                                                                                                                 
 |        # 3. +linux                                                                                              
 |        linux  /root/Image-4.19.115-01-acorelinux \                                                              
 |               root=UUID=899a2089-3dad-4547-998c-9ae44a046e61 \          # set root                              
 |               console=ttyAMA1,115200 \  #                                                                       
 |               loglevel=7 \              # 73                                                                    
 |               rootdelay=5 \             #                                                                       
 |               KEYBOARDTYPE=pc \         #                                                                       
 |               KEYTABLE=us               #                           
```



```shell
 menuentry 'AcoreLinux Embedded version V1.0.0.F.2' {
         # 1. 加载必要的驱动（根据分区格式/文件系统调整）
        insmod part_gpt       # 若硬盘是MBR，替换为 insmod part_msdos
        insmod ext2           # 若文件系统是xfs，替换为 insmod xfs（需GRUB支持）
        insmod search_fs_uuid  # 加载UUID搜索模块（核心）  # insmod uuid无法使用时

        # 2. 指定GRUB根分区（内核所在分区，与下方root=/dev/sdb1对应）
        # set root='PARTUUID=b96da6b5-dadf-5041-8c89-e20546c6c7d2'   # 确认hd1是第二块硬盘，gpt1是内核所在分区
        # set root=(hd0,gpt1)
        # set root='UUID=899a2089-3dad-4547-998c-9ae44a046e61'   # 确认hd1是第二块硬盘，gpt1是内核所在分区
        search --fs-uuid 899a2089-3dad-4547-998c-9ae44a046e61 --set=root

        # 3. 加载内核+完整启动参数（参数必须紧跟linux命令，不能换行）
        linux  /并oot/Image-4.19.115-01-acorelinux \
               root=UUID=899a2089-3dad-4547-998c-9ae44a046e61 \          # 内核挂载的根分区（与set root对应）
               console=ttyAMA1,115200 \  # 串口控制台（嵌入式常用，确认串口设备号正确）
#               splash \                  # 启动动画（嵌入式若无显示，可删除）
               loglevel=7 \              # 日志详细程度（7为调试级，正常可设为3）
               rootdelay=5 \             # 根分区延迟挂载（给硬件初始化时间，必要）
               KEYBOARDTYPE=pc \         # 键盘类型（嵌入式若无键盘，可删除）
               KEYTABLE=us               # 键盘布局（同上，无需则删除）
}
```





```
grub> insmod part_gpt
grub> insmod ext2    
grub> insmod part_gpt
grub> insmod search_fs_uuid
grub> search --fs-uuid 899a2089-3dad-4547-998c-9ae44a046e61
 hd0,gpt1 hd0,gpt1
grub> ls /
lost+found/ acore-image-beta-d2000-20221226041741.rootfs.tar.gz bin/ boot/ dev/ etc/ home/ lib/ log_lock.pid media 
run/ sbin/ srv/ sys/ tmp/ usr/ var/ Image-4.19.115-01-acorelinux 
grub> ls /boot
EFI/ Image Image-4.19.115-01-acorelinux Module.symvers-4.19.115-01-acorelinux System.map-4.19.115-01-acorelinux 
config-4.19.115-01-acorelinux d2000-devboard-dsk.dtb 
grub> 
```

