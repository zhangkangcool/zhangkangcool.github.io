# 获得uuid



在 Linux 系统中，获取 UUID（通用唯一标识符）的方法有多种，主要用于查看磁盘分区、文件系统或交换分区的 UUID。以下是常用的几种方式：

### 1. 使用 `blkid` 命令（最常用）

`blkid` 可以显示所有已挂载和未挂载的块设备的 UUID 信息，需要 root 权限：

```bash
# 查看所有设备的UUID
sudo blkid

# 查看指定设备的UUID（例如 /dev/sda1）
sudo blkid /dev/sda1
```

示例输出：

```shell
/dev/sda1: UUID="737cc321-986f-4a45-ba88-5188beb1d25be" TYPE="ext4"
/dev/sda5: UUID="33acfaa4-309e-427f-b5de-e9f822da03d4" TYPE="swap"
```



```shell
sudo blkid   
/dev/sda6: LABEL="SWAP" UUID="33acfaa4-309e-427f-b5de-e9f822da03d4" TYPE="swap" PARTLABEL="logical" PARTUUID"
/dev/sda3: LABEL="SYSROOT" UUID="737cc321-986f-4a45-ba88-518beb1d25be" TYPE="ext4" PARTLABEL="SYSROOT" PARTU"
/dev/sda1: LABEL_FATBOOT="ESP" LABEL="ESP" UUID="9889-7D5D" TYPE="vfat" PARTLABEL="EFI" PARTUUID="7f2dee48-9"
/dev/sda2: LABEL="SYSBOOT" UUID="766992bf-1f56-48b4-b200-7af02e5533e2" TYPE="ext4" PARTLABEL="boot" PARTUUID"
/dev/sda4: LABEL="KYLIN-BACKUP" UUID="07613bd1-b862-44f3-897b-6c5b754bb723" TYPE="ext4" PARTLABEL="backup" P"
/dev/sda5: LABEL="DATA" UUID="484fbf67-4293-40d2-b25a-8e14d61ffea0" TYPE="ext4" PARTLABEL="data" PARTUUID="d"
/dev/sdb1: UUID="899a2089-3dad-4547-998c-9ae44a046e61" TYPE="ext4" PARTUUID="b96da6b5-dadf-5041-8c89-e20546c"
/dev/sdb2: UUID="ba29b9a8-6319-4164-a61a-f5acdb431b1b" TYPE="ext4" PARTUUID="2b80aa17-2bf2-9a43-82c7-eb80b5f"

```







### 2. 查看 `/dev/disk/by-uuid` 目录

系统会在 `/dev/disk/by-uuid` 下创建以 UUID 命名的符号链接，指向对应的设备：

```bash
ls -l /dev/disk/by-uuid
```

```shell
lrwxrwxrwx 1 root root 10  5月  8 10:00 737cc321-986f-4a45-ba88-5188beb1d25be -> ../../sda1
lrwxrwxrwx 1 root root 10  5月  8 10:00 33acfaa4-309e-427f-b5de-e9f822da03d4 -> ../../sda5
```



### 3. 使用 `lsblk` 命令

`lsblk` 可列出块设备信息，加上 `-o` 参数可指定显示 UUID：

```bash
lsblk -o NAME,UUID,TYPE,SIZE   # 或者 lsbl
```



示例输出:

```shell
NAME   UUID                                   TYPE   SIZE
sda                                              disk   50G
├─sda1 737cc321-986f-4a45-ba88-5188beb1d25be part   40G
└─sda5 33acfaa4-309e-427f-b5de-e9f822da03d4 part   10G
```



### 4. 查看 `/etc/fstab` 文件

`/etc/fstab` 中记录了系统启动时自动挂载的文件系统，通常包含 UUID：

```bash
cat /etc/fstab
```



示例输出：

```shell
UUID=737cc321-986f-4a45-ba88-5188beb1d25be / ext4 defaults 0 1
UUID=33acfaa4-309e-427f-b5de-e9f822da03d4 swap swap defaults 0 0
```



### 总结

- 最直接的方法是 `sudo blkid`，可查看所有设备的 UUID。
- `/dev/disk/by-uuid` 目录适合通过 UUID 反查对应的设备。
- `lsblk -o NAME,UUID` 适合快速列出设备与 UUID 的对应关系。