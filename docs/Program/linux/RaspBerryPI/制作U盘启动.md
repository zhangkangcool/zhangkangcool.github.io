# å¶ä½Uçå¯å¨

```sellh
# 首先确定U盘的设备名称
diskutil list

# 找到你的U盘（通常是/dev/disk3或类似名称，注意不要选错！）
# 卸载U盘（假设设备是disk3）
diskutil unmountDisk /dev/disk3

# 写入镜像文件（替换input.img为你的树莓派镜像路径）
sudo dd if=/path/to/input.img of=/dev/disk2 bs=1m status=progress

# 完成后弹出U盘
diskutil eject /dev/disk3
```





```
/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *31.3 GB    disk2
   1:             Windows_FAT_32 bootfs                  536.9 MB   disk2s1
   2:                      Linux                         30.7 GB    disk2s2
这是我的U盘，将全部空间格式化为FAT 32格式
```









要将整个 U 盘格式化为 FAT32 格式，可以按照以下步骤操作：

1. 首先确保 U 盘已卸载（但不要拔出）：

```bash
diskutil unmountDisk /dev/disk2
```

1. 执行格式化命令（会清除所有数据，请确认已备份重要文件）：

```bash
sudo diskutil eraseDisk FAT32 RPI_BOOT MBRFormat /dev/disk2
```

### 命令说明：

- `eraseDisk`：格式化整个磁盘
- `FAT32`：指定文件系统格式为 FAT32
- `RPI_BOOT`：这是格式化后的 U 盘名称，你可以自行修改
- `MBRFormat`：使用 MBR 分区表（树莓派兼容）
- `/dev/disk2`：你的 U 盘设备路径

执行后，整个 31.3GB 的 U 盘会被格式化为一个单独的 FAT32 分区，适合作为树莓派启动盘使用。操作完成后，系统会自动挂载 U 盘。

如果后续需要制作树莓派启动盘，无需再次格式化，直接使用`dd`命令写入镜像即可（镜像会自动重建分区结构）。

编辑分享

