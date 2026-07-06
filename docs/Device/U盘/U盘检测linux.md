# U盘检测linux



## 1. U盘磁盘

```shell
lsblk
sdb           8:16   1  29.1G  0 disk 
└─sdb1        8:17   1  29.1G  0 part /media/ken/B058-5EBD
nvme0n1     259:0    0 476.9G  0 disk 
├─nvme0n1p1 259:1    0   300M  0 part 
├─nvme0n1p2 259:2    0    16M  0 part 
├─nvme0n1p3 259:3    0   150G  0 part 
├─nvme0n1p4 259:4    0   163G  0 part 
└─nvme0n1p5 259:5    0 163.6G  0 part /media/ken/数据
```

你是想在 Ubuntu 下检测一个 U 盘是否被 “扩容”（比如用软件把 4GB 刷成 32GB 的假容量）吗？

这个可以用几个简单的命令行工具来完成，核心思路就是**写满数据再校验**。



## 2. U盘检测

### 2.1  方法1：用 `f3` 工具（推荐）

`f3`（Fake Flash Test）是专门检测假扩容存储的工具。

1. **安装 f3**

```bash
sudo apt update
sudo apt install f3
```

1. 测试步骤

   - 先查看 U 盘设备名：

     ```bash
     lsblk
     ```

     找到你的 U 盘（比如 `/dev/sdb`）。

   - 运行写入测试：

     ```bash
     sudo f3write /media/你的用户名/U盘挂载点
     ```

     

   - 再运行校验：

     ```bash
     sudo f3read /media/你的用户名/U盘挂载点
     ```

     

     如果容量是假的，这里会报错或发现数据损坏。



### 2.2 方法2：用 `dd` 命令手动测试

1. **查看 U 盘设备名**

```bash
lsblk
```

2. **写零到整个 U 盘**（会清空所有数据！）

```bash
sudo dd if=/dev/zero of=/dev/sdX bs=1M status=progress
```

把 `/dev/sdX` 换成你的 U 盘设备名。

这条命令的作用是**向整个 U 盘（`/dev/sdb`）持续写入空数据**，直到把 U 盘的所有存储空间写满为止。

体写入的数据量取决于：

(1) U 盘的实际可写入容量（不是标称容量，而是真实物理容量）

(2) 当写入到 U 盘的最大容量后，命令会自动停止

`bs=1M` 表示每次写入 1MB 的数据块，但命令会循环执行这个过程，直到 U 盘被写满（或遇到错误停止，比如扩容盘超过真实容量时）。

如果是正常 U 盘，会写入其全部容量（比如你的 U 盘标称 29.1GB，会尽量写满这个大小）；如果是扩容盘，会写到其真实容量后报错停止（比如实际只有 4GB，写满 4GB 就会出错）。

执行过程中，`status=progress` 会显示实时进度（已写入多少 MB/GB），你可以通过这个进度判断 U 盘的真实可写入容量。



3. 再读回校验

```
# 用 md5sum 计算
md5sum testfile > testfile.md5

# 或用 sha256sum 计算（更安全）
sha256sum testfile > testfile.sha256
```

- 生成的 `testfile.md5` 或 `testfile.sha256` 中包含原始文件的哈希值。

 

对比写入前后的哈希值，确认没有写入失败。



### 方法三：图形界面工具

- **GNOME Disks**（Ubuntu 自带）：查看 “设备” 实际容量和分区表是否匹配。
- **F3GUI**：`f3` 的图形版本，适合不习惯命令行的用户。

💡 **注意事项**：