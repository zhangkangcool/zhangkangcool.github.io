# 何时需要 set root





在 GRUB 配置中，`set root=` 的作用是**告诉 GRUB 去哪里寻找后续要加载的文件（比如内核 `vmlinuz`、 initrd `initrd.img`）**。是否需要它，取决于**你加载的文件和当前 GRUB 的 “根目录” 是否在同一个位置**。

### 先理解 GRUB 的 “根目录” 概念

GRUB 启动时，会有一个默认的 “根目录”（可以理解为 GRUB 自身的 “当前工作目录”），这个默认根目录通常是：

- 你的 `/boot` 分区（比如你的 `/dev/sda2`，对应 GRUB 中的 `(hd0,gpt2)`）；
- 或者是包含 GRUB 启动文件的分区（比如 EFI 分区 `/dev/sda1`，对应 `(hd0,gpt1)`）。

当你执行 `linux /boot/vmlinuz-xxx` 或 `initrd /boot/initrd-xxx` 时，GRUB 会从**自己当前的根目录**下去找这些文件。



### 什么时候需要手动 `set root=`？

当你要加载的文件（内核、initrd）**不在 GRUB 默认的根目录**时，必须用 `set root=` 切换到文件所在的分区。

举个具体例子：

- 你的 Loongnix 系统中，`/boot` 分区是 `/dev/sda2`（GRUB 默认根目录是 `(hd0,gpt2)`）；

- 如果你想加载的内核在/dev/sda5/data分区）的/boot目录下（比JARI_WORKS的内核），那么：

  - GRUB 默认根目录 `(hd0,gpt2)` 下没有这个内核文件；

  - 必须先执行 `set root=(hd0,gpt5)`，告诉 GRUB：“接下来找文件请去 `/dev/sda5` 分区”；

  - 然后再执行 `linux /boot/vmlinuz-jari`（此时 GRUB 会从 `(hd0,gpt5)` 的 `/boot` 目录找这个文件）。

    

### 什么时候不需要手动 `set root=`？

当你要加载的文件（内核、initrd）**就在 GRUB 默认的根目录**下时，不需要手动设置。

比如你的 Loongnix 系统：

- GRUB 默认根目录是 `/dev/sda2`（`(hd0,gpt2)`），而内核 `vmlinuz-4.19.0-19-loongson-3` 和 initrd `initrd.img-4.19.0-19-loongson-3` 正好在 `/dev/sda2` 的 `/boot` 目录下；

- 所以 GRUB 配置中可以直接写：

  ```bash
  linux /boot/vmlinuz-4.19.0-19-loongson-3 root=/dev/sda3 ...
  initrd /boot/initrd.img-4.19.0-19-loongson-3
  ```

  不需要额外

   

  ```
  set root=
  ```

  ，因为文件就在 GRUB 默认的根目录里。

### 总结

- **核心判断**：加载的内核 /initrd 文件所在的分区，是否等于 GRUB 默认的根目录分区？
  - 是 → 不需要 `set root=`；
  - 否 → 必须先 `set root=` 切换到文件所在分区。
- **实用技巧**：
  - 你的 `/boot` 分区（`/dev/sda2`）是 GRUB 默认根目录，所以只要内核 /initrd 在 `/dev/sda2` 的 `/boot` 下（比如 Loongnix 自带的内核），就不用 `set root=`；
  - 如果内核 /initrd 在其他分区（比如 `/dev/sda5`、`/dev/sda7` 等），就必须用 `set root=` 指向那个分区。



装双系统是比如JARI在/dev/sda7中，jxworks在/dev/sda7/boot中，

你可以将/dev/sda7/boot/jxworks复制到/boot（如果存在独立的/boot分区），

```
linux /jxworks/vmlinuz root=/dev/sda7 rw console=tty0 rootwait locale=zh_CN.UTF-8
```



此时你不需要set root，或者你可以set root='(hd0,gpt2)'

```
set root='(hd0,gpt2)'
linux /boot/jxworks/vmlinuz root=/dev/sda7 rw console=tty0 rootwait locale=zh_CN.UTF-8
```

