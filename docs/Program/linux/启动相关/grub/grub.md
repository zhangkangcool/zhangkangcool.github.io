





​                 

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
        search --fs-uuid --set=root 899a2089-3dad-4547-998c-9ae44a046e61

        # 3. 加载内核+完整启动参数（参数必须紧跟linux命令，不能换行）
        linux  /boot/Image-4.19.115-01-acorelinux \ # /boot在独立分区则无需/boot
               root=UUID=899a2089-3dad-4547-998c-9ae44a046e61 \          # 内核挂载的根分区（与set root对应）
               console=ttyAMA1,115200 \  # 串口控制台（嵌入式常用，确认串口设备号正确）
#               splash \                  # 启动动画（嵌入式若无显示，可删除）
               loglevel=7 \              # 日志详细程度（7为调试级，正常可设为3）
               rootdelay=5 \             # 根分区延迟挂载（给硬件初始化时间，必要）
               KEYBOARDTYPE=pc \         # 键盘类型（嵌入式若无键盘，可删除）
               KEYTABLE=us               # 键盘布局（同上，无需则删除）
               
              # 4. 加载设备树（嵌入式必需，路径与ls /boot输出一致）
        # devicetree /boot/d2000-devboard-dsk.dtb

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



```
/dev/sda6: LABEL="SWAP" UUID="33acfaa4-309e-427f-b5de-e9f822da03d4" TYPE="swap" PARTLABEL="logical" PARTUUID="2012053b-6f87-4335-94af-2aa4f10f9a81"
/dev/sda3: LABEL="SYSROOT" UUID="737cc321-986f-4a45-ba88-518beb1d25be" TYPE="ext4" PARTLABEL="SYSROOT" PARTUUID="fd40b272-69e1-41b8-8275-f3fc49354f45"
/dev/sda1: LABEL_FATBOOT="ESP" LABEL="ESP" UUID="9889-7D5D" TYPE="vfat" PARTLABEL="EFI" PARTUUID="7f2dee48-946f-489e-9cf9-58f7bd2f5363"
/dev/sda2: LABEL="SYSBOOT" UUID="766992bf-1f56-48b4-b200-7af02e5533e2" TYPE="ext4" PARTLABEL="boot" PARTUUID="811fb3a3-ce35-407b-b243-9549645a293d"
/dev/sda4: LABEL="KYLIN-BACKUP" UUID="07613bd1-b862-44f3-897b-6c5b754bb723" TYPE="ext4" PARTLABEL="backup" PARTUUID="4f14356f-9351-4973-8ecb-38f0e1d9ce7b"
/dev/sda5: LABEL="DATA" UUID="484fbf67-4293-40d2-b25a-8e14d61ffea0" TYPE="ext4" PARTLABEL="data" PARTUUID="de765052-1ef8-49e3-bb84-60fc9f000b26"



udev            1.9G     0  1.9G    0% /dev
tmpfs           385M  2.5M  383M    1% /run
/dev/sda3        58G  8.2G   47G   15% /
tmpfs           1.9G     0  1.9G    0% /dev/shm
tmpfs           5.0M  4.0K  5.0M    1% /run/lock
tmpfs           1.9G     0  1.9G    0% /sys/fs/cgroup
/dev/sda2       976M  483M  427M   54% /boot
/dev/sda5        39G   26G   11G   73% /data
/dev/sda1       511M   11M  501M    3% /boot/efi
tmpfs           385M  8.0K  385M    1% /run/user/1000


$ lsblk          
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 119.2G  0 disk 
├─sda1   8:1    0   512M  0 part /boot/efi
├─sda2   8:2    0     1G  0 part /boot
├─sda3   8:3    0  58.3G  0 part /
├─sda4   8:4    0    16G  0 part 
├─sda5   8:5    0  38.9G  0 part /data
└─sda6   8:6    0   4.5G  0 part [SWAP]

```

