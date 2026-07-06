# grub set root



假如内核在`sdb1`上

如果内核文件（Image-4.19.115-01-acorelinux）所在分区是 **/dev/sdb1**，则 `set root` 的写法需要结合磁盘类型（MBR 或 GPT）和磁盘标识规则来确定，具体分为以下两种场景：

## 1. 核心规则：GRUB 中磁盘 / 分区的标识格式

GRUB 对磁盘和分区的命名遵循固定规则，与 Linux 系统中的 `/dev/sdXn` 对应关系如下：

- 磁盘标识

  ```shell
  hdN
  ```

  （IDE/SATA 磁盘）或

  ```shell
  nvmeNn1
  ```

  （NVMe 磁盘，如 M.2 固态）。

  - `hd0` 对应 Linux 中的 `/dev/sda`（第一块磁盘），`hd1` 对应 `/dev/sdb`（第二块磁盘），以此类推。

- 分区标识

  - 若磁盘是 **GPT 分区表**（主流分区格式），分区编号用 `gptM`，`M` 是分区在磁盘中的顺序（如 `gpt1` 对应 `/dev/sdX1`，`gpt5` 对应 `/dev/sdX5`）。
  - 若磁盘是 **MBR 分区表**（旧格式），分区编号直接用数字（如 `1` 对应 `/dev/sdX1`），但当前场景推荐统一用 GPT 格式适配。



## 2. 当内核分区是 /dev/sdb1 时，`set root` 的正确写法

由于 `/dev/sdb` 是 Linux 中的 “第二块 SATA/IDE 磁盘”，对应 GRUB 中的 `hd1`；分区 `1` 对应 GPT 格式的 `gpt1`，因此最终写法为：

```bash
set root='hd1,gpt1'
```

### 完整的启动项修改示例（适配 /dev/sdb1 内核分区）

假设你的根文件系统所在分区仍为上文的 `/dev/sda5`（需根据实际情况确认），则完整的启动项如下（已去掉注释，修正 `set root`）：

```bash
menuentry 'AcoreLinux Embedded version V1.0.0.F.2' {
        insmod part_gpt  # 加载 GPT 分区表驱动（若磁盘是 MBR，需改为 insmod part_msdos）
        insmod ext2      # 加载 ext2/ext3/ext4 文件系统驱动（根据内核分区的文件系统调整）
        set root='hd1,gpt1'  # /dev/sdb1 对应的 GRUB 磁盘/分区标识
        
        linux  /Image-4.19.115-01-acorelinux  root=/dev/sdb  # 内核文件路径 + 根分区
        console=ttyAMA1,115200 splash loglevel=7 rootdelay=5 KEYBOARDTYPE=pc KEYTABLE=us security=
}
```



这里`set root='hd1,gpt1'`表示要运行的系统的`root，linux  /Image-4.19.115-01-acorelinux`表示` /Image-4.19.115-01-acorelinux`在`hd1, gpt1`上的`/`下。'hd1,gpt1'也可能是独立的`/boot`分区，此时/Image-4.19.115-01-acorelinux在`/boot/目录下。

`root=/dev/sdb`表示要装的系统的根分区。`set root`与`root=`可以不一样。

以下示例进行说明：

```
以下情况Image-4.19.115-01-acorelinux需要放在'hd1,gpt1'下，如果'hd1,gpt1'对应/boot，则需要放在/boot下，如果对应/test，则需要放在/test下，如果对应/,则需要放在/下。
set root='hd1,gpt1'  # /dev/sdb1 对应的 GRUB 磁盘/分区标识
linux  /Image-4.19.115-01-acorelinux  root=/dev/sdc  # 内核文件路径 + 根分区
```





## 3. 额外验证建议

1. 确认 `/dev/sdb1` 的分区表类型：执行 `lsblk -f /dev/sdb`，查看 `TYPE` 列是否为 `gpt`（若为 `dos` 则是 MBR，需将 `insmod part_gpt` 改为 `insmod part_msdos`，`set root` 改为 `'hd1,1'`）。
2. 确认内核文件路径：进入 `/dev/sdb1`（需先挂载，如 `sudo mount /dev/sdb1 /mnt/test`），执行 `ls /mnt/test` 确认 `Image-4.19.115-01-acorelinux` 文件是否存在，避免路径错误。