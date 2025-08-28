<h1 align="center">U盘直接安装JARI-WORKS</h1>



此方法未经过测试



SourceURL:file:///home/ken/下载/(非密)JARI-Works系统安装手册.docx



## 1 安装准备

1. 一套飞腾的硬件环境作为待安装目标机(UEFI 固件，Radeon HD 7450显卡）；
2. 一个U盘；
3. JARI_Works 安装包（jari-works-wayland-rootfs-aarch64-241127.tar.gz）；
3. 

## 2 启动U盘制作

1. 将U盘插入宿主机的USB口

2. 将安装包解压至U盘根目录，应包括os-package、jxworks、initrd、boot、EFI如图1所示：

![img](U%E7%9B%98%E7%9B%B4%E6%8E%A5%E5%AE%89%E8%A3%85JARI-WORKS.assets/wpsMBBm17.jpg) 

图 1 选择镜像文件



## 3 选择U盘引导

将U盘插入待安装目标机，启动目标机，进入UEFI BIOS菜单，在选择项里面可以看到当前目标机硬盘和U盘信息，选择U盘项启动，即可以从U盘引导。



## 4 系统硬盘分区

引导程序默认将硬盘分成五个分区：

```shell
/dev/sda1             #boot分区
/dev/sda2             #主要文件系统分区
/dev/sda3             #swap分区
/dev/sda4             #备份分区
/dev/sda5            #数据分区
```



一般情况下都按默认分区即可，按提示进行操作，具体步骤如下：

1．磁盘分区向导首先会提示用户是否安装此镜像，此处可选择y确认；如图 5所示。

![img](U%E7%9B%98%E7%9B%B4%E6%8E%A5%E5%AE%89%E8%A3%85JARI-WORKS.assets/wpsK95M7a.jpg) 

图 5 开始分区

2．确认结束后，磁盘分区向导会根据磁盘容量计算三个分区的大小并提示用户是否按照默认的分区进行划分，如果对系统有特殊需求，可以选择n，然后根据提示自主设置三个分区的大小，否则，选择y，直接进行后续操作；

![img](U%E7%9B%98%E7%9B%B4%E6%8E%A5%E5%AE%89%E8%A3%85JARI-WORKS.assets/wpsIKzOuw.jpg) 

图 6 默认分区大小

3．分区过程中，若原硬盘存有数据，会询问是否消除数据，均选y回车继续即可。

4．分区结束后，磁盘分区向导会提示用户选择JARI-Works安装包镜像的部署方式，从U盘部署选择1，利用网络传输部署选择2，这里选择U盘部署。

![img](U%E7%9B%98%E7%9B%B4%E6%8E%A5%E5%AE%89%E8%A3%85JARI-WORKS.assets/wpsHxz1lw.jpg) 

图 7 选择部署方式

 

![img](U%E7%9B%98%E7%9B%B4%E6%8E%A5%E5%AE%89%E8%A3%85JARI-WORKS.assets/wpsoSsQpR.jpg) 

图 8 安装包部署结束



## 5 安装包部署

完成磁盘分区后，如下图所示，根据提示选择1，设置文件系统的部署方式为USB方式，目标机将从U盘获取安装包直接解压安装，如图 8安装完成后，在目标机输入reboot 命令重启目标机，系统安装结束。