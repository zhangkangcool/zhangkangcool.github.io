https://stray-soul.com/mset9.html

<h1 align="center">通过mset9安装B9S</h1>



## 1. 适用版本说明

本教程目前仅适用于11.4.0-11.17.0（目前的最新系统版本）的 3DS/2DS（不限新老型号、区域版本），如果此教程不符合你的系统或主机版本，请点击菜单中的“3DS/2DS破解”查阅适合你系统版本的表格。



## 2. 破解软件说明

教程中windows/macOS可以使用GUI进行安装，linux/macOS安装python3后，可以用命令行进行安装。

### 2.1 官方包和教程

官方的代码是在github上进行维护的：https://github.com/hacks-guide/MSET9/releases/latest ， 最新版v2.1在2025年7月发布。

官方代码是教程在：https://3ds.hacks.guide/installing-boot9strap-(mset9).html

##### 官方包`MSET9-v2.1.zip`中是以下文件：

```shell
$ tree     
.
├── b9
├── boot.3dsx
├── boot9strap
│   ├── boot9strap.firm
│   └── boot9strap.firm.sha
├── boot.firm
├── config
│   └── ssl
│       └── cacert.pem
├── errors.txt
├── _INSTRUCTIONS.txt
├── MSET9-macOS.command   # macOS上用
├── mset9.py              # linux上用
├── MSET9-Windows.bat     # windows上用 
└── SafeB9S.bin

3 directories, 12 files
```



其实`MSET9-macOS.command`和`MSET9-Windows.bat`,都是对`mset9.py进行调用`。

```python
 cat MSET9-macOS.command 
#!/bin/sh
if which python3 >/dev/null; then
        # use exec here to release shell and thus sd card, allow it to be umounted
        exec python3 "$(cd "$(dirname "$0")" && pwd)/mset9.py"
else
        echo "Python 3 is not installed."
        echo "Please install Python 3 and try again."
        echo "https://www.python.org/downloads/"
        echo "Press ENTER to exit ..."
        read DUMMY
fi

```



### 2.2 参考网站提供的包

`MSET9-2023.zip`和 `MSET9-v2.1.zip`，后者就是官方的包，由于官方最新的包全部用的是命令行，所以如果需要使用GUI的话，需要MSET9-2023这个比较旧的包，实用是最新包中的内容把久包进行覆盖。

以下是`MSET9-2023`中的内容：

```shell
$ tree -L 1
.
├── 3DS
├── b9
├── boot.3dsx
├── boot9strap
├── boot.firm
├── CIA(tool)            # 这里放的是FBI等必须的CIA文件。
├── gm9
├── luma
├── mset9.exe             # windows上用的GUI程序
├── mset9-macos.zip       # 解压出来时mset9.app，供在macOS上使用
└── SafeB9S.bin
```



#### 以下破解教程主要以 https://stray-soul.com/mset9.html 上的内容为主。且只选择用命令行模式，另外两种未进行试验。命令行模式是推荐方式。

使用GUI方式时，只需要mset9-2023.zip，使用命令行模式时需要两个包都要有。



## 3. 命令行方式进行破解

### 3.1 准备存储卡

#### 3.1.1 格式化为fat32格式

还没试过不格式化，删除全部文件，只保留Nintendo 3DS目录。

下面以macOS为例进行：

```shell
$ diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *500.3 GB   disk0
   1:                        EFI EFI                     314.6 MB   disk0s1
   2:                 Apple_APFS Container disk1         500.0 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +500.0 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD - 数据...  306.4 GB   disk1s1
   2:                APFS Volume Preboot                 439.0 MB   disk1s2
   3:                APFS Volume Recovery                1.7 GB     disk1s3
   4:                APFS Volume VM                      8.6 GB     disk1s4
   5:                APFS Volume Macintosh HD            24.1 GB    disk1s5
   6:                APFS Volume Macintosh HD - 数据     15.4 GB    disk1s6
   7:              APFS Snapshot com.apple.os.update-... 15.4 GB    disk1s6s1

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *31.3 GB    disk2
   1:                 DOS_FAT_32 3DSMSET9                31.3 GB    disk2s1
```

这里`dev/disk2`为我们的存储卡，备份好数据后进行格式化。

```shell
diskutil unmountDisk /dev/disk2
sudo diskutil eraseDisk FAT32 3DSMSET9 MBRFormat /dev/disk2
```



### 3.1.2 生成Nintendo 3DS文件夹

将空卡插入到3DS中再开机，识别到卡后会自动生成，然后关机把卡。



### 3.2 下载破解包

`mset9-2023.zip`和`MSET9-v2.1.zip`，下载后分别进行解压。然后将后者内容全部复制到前者，并进行覆盖。

此时，文件时这样的。

将合并后的文件内容全部复制到3DS的根目录中。

```shell
$ tree -L 1
.
├── Nintendo 3DS(3DS中原来就有的目录，没有的话，见3.1.2)

├── 3DS
├── b9
├── boot.3dsx
├── boot9strap
├── boot.firm
├── CIA(tool)
├── config
├── errors.txt
├── gm9
├── _INSTRUCTIONS.txt
├── luma
├── mset9.exe
├── MSET9-macOS.command
├── mset9-macos.zip
├── mset9.py
├── MSET9-Windows.bat
└── SafeB9S.bin

6 directories, 11 files
```

















 