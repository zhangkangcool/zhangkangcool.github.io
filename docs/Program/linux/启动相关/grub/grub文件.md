# 两个grub文件的区别

以下两个grub.cfg文件有什么区别：

```
 ./efi/boot/grub/grub.cfg ./grub/grub.cfg
```



```shell
$ df -h
文件系统        容量  已用  可用 已用% 挂载点
udev            3.9G     0  3.9G    0% /dev
tmpfs           789M  2.7M  787M    1% /run
/dev/sda3        98G   15G   79G   16% /
tmpfs           3.9G     0  3.9G    0% /dev/shm
tmpfs           5.0M  4.0K  5.0M    1% /run/lock
tmpfs           3.9G     0  3.9G    0% /sys/fs/cgroup
/dev/sda2       976M  256M  654M   29% /boot
/dev/sda5       308G  274G   18G   94% /data
/dev/sda1       511M   11M  501M    3% /boot/efi
/dev/loop0       24M   24M     0  100% /usr/share/kmre/update/arm64/v2.0-220111.10-220111.15/data
tmpfs           789M     0  789M    0% /run/user/1004
/dev/sda4        52G  2.5G   47G    6% /mnt

```





从路径来看，这两个 `grub.cfg` 分别位于不同位置，对应 GRUB 引导程序的不同作用场景，核心区别如下：

## 1. 路径与对应的分区

根据你的系统分区结构（`/boot/efi` 挂载 `sda1`，`/boot` 挂载 `sda2`）：

- `./efi/boot/grub/grub.cfg`
  实际完整路径为 `/boot/efi/efi/boot/grub/grub.cfg`，位于 **ESP 分区（`sda1`）** 内。
- `./grub/grub.cfg`
  实际完整路径为 `/boot/grub/grub.cfg`，位于 **`/boot` 分区（`sda2`）** 内。

## 2. 作用与区别

| 特征         | `/boot/efi/efi/boot/grub/grub.cfg`（ESP 分区内）             | `/boot/grub/grub.cfg`（`/boot` 分区内）                      |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **主要作用** | 作为 UEFI fallback 引导的配置文件                            | 系统默认 GRUB 引导的主配置文件                               |
| **触发场景** | 仅当 UEFI 固件找不到默认引导项时启用（如引导记录损坏、新增硬盘导致设备号变化） | 系统正常启动时，由 GRUB 主程序加载                           |
| **内容来源** | 通常是手动放置或特定工具生成的简化配置，仅包含最基础的启动项 | 由 `update-grub` 自动生成，包含所有检测到的系统启动项（主系统、其他分区系统、内存测试等） |
| **修改方式** | 需手动编辑（很少用到）                                       | 不建议直接修改，应通过 `/etc/grub.d/` 脚本 + `update-grub` 生成 |
| **优先级**   | 低（仅作为应急 fallback）                                    | 高（系统正常启动依赖此文件）                                 |

## 3. 通俗理解

- `/boot/grub/grub.cfg` 是 **“日常使用的配置”**：系统每次启动时，GRUB 主程序都会读取这个文件，显示你在启动菜单中看到的所有选项（包括你的麒麟系统、可能添加的 `JARI-Works V5` 等）。
- `ESP 分区内的 grub.cfg` 是 **“应急备用配置”**：只有当主引导配置出问题（比如 `/boot/grub/grub.cfg` 损坏或 UEFI 找不到主引导项）时，UEFI 固件才会尝试读取这个备用配置，通常只包含最基础的启动逻辑（比如仅能启动主系统）。

### 总结

日常使用和配置双系统启动项时，**只需关注 `/boot/grub/grub.cfg`**（通过 `update-grub` 维护）；ESP 分区内的 `grub.cfg` 一般无需修改，仅在主引导完全失效时作为最后的应急手段。



## 4. 麒麟系统中起作用的是/boot/efi/boot/grub/grub.cfg而不是/boot/grub/grub.cfg

在麒麟系统中，通常情况下起主要作用的是 `/boot/grub/grub.cfg`，但如果出现 `/boot/efi/boot/grub/grub.cfg` 起作用的情况，可能与系统的启动方式和引导链机制有关。

麒麟系统在使用 UEFI 启动方式时，BIOS 会先执行 EFI 文件，EFI 会先调用 `/boot/efi/EFI/kylin/grub.cfg`，这个文件再去调用 `/boot/efi/boot/grub/grub.cfg`麒麟软件。这是因为带安全启动的机器存在一个启动链，在这个启动链的作用下，会按照这样的顺序进行调用麒麟软件。所以，可能是系统在启动过程中，按照 UEFI 启动链的逻辑，先读取了 `/boot/efi/EFI/kylin/grub.cfg`，进而使得 `/boot/efi/boot/grub/grub.cfg` 发挥了作用，而不是直接读取 `/boot/grub/grub.cfg`。

对已有grub文件中的字符串做小修改，可以验证是哪一个grub起作用。