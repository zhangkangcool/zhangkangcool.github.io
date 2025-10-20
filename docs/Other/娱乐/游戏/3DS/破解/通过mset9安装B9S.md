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



#### 以下破解教程主要以 https://stray-soul.com/mset9.html 上的内容为主。且只选择用命令行模式，另外两种未进行试验，使用GUI方式的话，只需要下载`mset9-2023.zip`，应该是最新的mset不支持GUI方式。命令行模式是推荐方式。

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

将空卡插入到3DS中再开机，识别到卡后会自动生成，然后关机拔卡。



### 3.2 下载破解包

`mset9-2023.zip`和`MSET9-v2.1.zip`，下载后分别进行解压。然后将后者内容全部复制到前者，并进行覆盖。

将合并后的文件内容全部复制到3DS的根目录中。此时，文件这样的。

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



### 3.3 开始破解

#### 3.3.1 生成ID1文件

建议是不管哪个系统都运行`python3 mset9.py`。

```shell
Windows：双击 MSET9-Windows.bat                          # 间接调用 python3 mset9.py
MacOS: 双击 MSET9-macOS.command，如果有输入密码的提示请输入   # 间接调用 python3 mset9.py
Linux：在终端内 cd 进入内存卡根目录后输入 python3 mset9.py
```



##### 确认机器型号和系统版本，不是的话请升级（2025年10月最新版是11.17），这里的用的是新大三11.17.0

```shell
MSET9 v2.1 SETUP by zoogie, Aven, DannyAAM and thepikachugamer
    What is your console model and version?
    Old 3DS has two shoulder buttons (L and R)
    New 3DS has four shoulder buttons (L, R, ZL, ZR)

    -- Please type in a number then hit return --

    Enter one of these four numbers!
    Enter 1 for: Old 3DS/2DS, 11.8.0 to 11.17.0
    Enter 2 for: New 3DS/2DS, 11.8.0 to 11.17.0
    Enter 3 for: Old 3DS/2DS, 11.4.0 to 11.7.0
    Enter 4 for: New 3DS/2DS, 11.4.0 to 11.7.0
    >>> 2      # 根据机器型号和版本进行对应输入
```

##### 产生ID1文件

```shell
    MSET9 v2.1 SETUP by zoogie, Aven, DannyAAM and thepikachugamer
    Using New 3DS/2DS, 11.8.0 to 11.17.0

    Current MSET9 state: ID1 not created      # 当前状态

    -- Please type in a number then hit return --

    ↓ Input one of these numbers!
    1. Create MSET9 ID1
    2. Check MSET9 status
    3. Inject trigger file
    4. Remove trigger file
    5. Remove MSET9

    0. Exit
    >>> 1  # 输入1，产成ID1文件
```

##### 再次输入1确认操作

```shell
 === DISCLAIMER ===

    This process will temporarily reset all your 3DS data.
    All your applications and themes will disappear.
    This is perfectly normal, and if everything goes right, it will re-appear
    at the end of the process.

    In any case, it is highly recommended to make a backup of your SD card's contents to a folder on your PC.
    (Especially the 'Nintendo 3DS' folder.)

    Input '1' again to confirm.
    Input '2' to cancel.
    >>> 1
    [--] Creating hacked ID1...
    [--] Creating dummy databases...
    [--] Backing up original ID1...
    [OK] Created hacked ID1.                   # 这里OK，表示已经生成。
    [--] Press Enter to exit...                # 按enter关闭脚本
```

------------------------

#### 3.3.2 Mii工作室和数据初始化

##### Mii工作室

将内存卡插回3DS，然后进入mii工作室。

![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-119.B6WzJF9N.webp)

等待mii工作室加载完毕后，等待10秒后（不用非常精确，只是确保已经加载完毕），直接按下Home键退回主界面，按下X键，并按A确认关闭应用。



#### 数据初始化

进入系统设置 - 数据管理 - 3DS数据管理 - 应用管理，将会提示数据损坏，是否初始化数据，点确认初始化，然后等待初始化完成。

![img](https://stray-soul.com/assets/image-122.7bru1WqC.webp)



![img](https://stray-soul.com/assets/image-123.QdfiAQDy.webp)



![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-124.Bztyz-FA.webp)

将会提示数据损坏，是否初始化数据，点确认初始化

![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-125.Bd3xGZqZ.webp)



![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-126.HoHtgeE3.webp)



![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-127.DsM3ATaT.webp)

---------------

### 3.3.3  确认MSET9当前状态

上述步骤完成后，关机拔卡，将卡插入电脑，再次运行MSET9脚本。

```python
Windows：双击 MSET9-Windows.bat                          # 间接调用 python3 mset9.py
MacOS: 双击 MSET9-macOS.command，如果有输入密码的提示请输入   # 间接调用 python3 mset9.py
Linux：在终端内 cd 进入内存卡根目录后输入 python3 mset9.py
```



##### 输入对应型号数字

```shell
MSET9 v2.1 SETUP by zoogie, Aven, DannyAAM and thepikachugamer
    What is your console model and version?
    Old 3DS has two shoulder buttons (L and R)
    New 3DS has four shoulder buttons (L, R, ZL, ZR)

    -- Please type in a number then hit return --

    Enter one of these four numbers!
    Enter 1 for: Old 3DS/2DS, 11.8.0 to 11.17.0
    Enter 2 for: New 3DS/2DS, 11.8.0 to 11.17.0
    Enter 3 for: Old 3DS/2DS, 11.4.0 to 11.7.0
    Enter 4 for: New 3DS/2DS, 11.4.0 to 11.7.0
    >>> 2      # 根据机器型号和版本进行对应输入，按Enter
```

##### 

##### 状态是Ready的话，输入0退出。

```shell
    MSET9 v2.1 SETUP by zoogie, Aven, DannyAAM and thepikachugamer
    Using New 3DS/2DS, 11.8.0 to 11.17.0

    Current MSET9 state: Ready      # 当前状态

    -- Please type in a number then hit return --

    ↓ Input one of these numbers!
    1. Create MSET9 ID1
    2. Check MSET9 status
    3. Inject trigger file
    4. Remove trigger file
    5. Remove MSET9

    0. Exit
    >>> 0  # 输入0，退出
```



##### 错误处理

如果提示 Not ready - check MSET9 status for more details...

```
请输入 2 然后根据提示解决问题：

Mii Maker extdata: Missing!：请确保你已经按上文的操作步骤初始化完了 Mii 工作室的数据，请插回内存卡请从上文的第 2 步重新开始。

Title database: Not initialized!：请确保你已经初始化了数据，请插回内存卡从上文的第 4 步重新开始。

Error 01: Couldn't find Nintendo 3DS folder：你没有把文件包正确放好并运行根目录下的 MSET9 脚本，从头开始做一遍教程。

Error 02: Your SD is write protected：你的内存卡写保护开关被打开了，请确保你已经关闭了内存卡上的写保护开关，然后重试一次。

Error 07: One or more files are missing or malformed!：你没有把文件包正确放好并运行根目录下的 MSET9 脚本，从头开始做一遍教程。
```



#### 3.3.4 数据管理追加显示Mii

1. 将内存卡插入3DS，然后开机。
2. 将光标对准系统设置图标，然后关机！关机！关机！

![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-131.B358J2mQ.webp)

3. 再次开机，按下A键进入系统设置。

4. 选择数据管理 - Nintendo 3DS 数据管理 - 追加数据管理

![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-122.7bru1WqC.webp)![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-123.QdfiAQDy.webp)![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-124.Bztyz-FA-176092136679411.webp)![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-129.7MhD_pBO.webp)

5. 等到你看到mii工作室的图标出现后（下图），直接拔出内存卡并接入电脑。

![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/2017-01-01_14-20-41.368_bot.OFibFBx2.webp)

- **不要点击屏幕或者按下任何按键，直接拔出内存卡！**

-----

### 3.3.5 注入MSET9

将卡插入电脑，再次运行MSET9脚本。

```python
Windows：双击 MSET9-Windows.bat                          # 间接调用 python3 mset9.py
MacOS: 双击 MSET9-macOS.command，如果有输入密码的提示请输入   # 间接调用 python3 mset9.py
Linux：在终端内 cd 进入内存卡根目录后输入 python3 mset9.py
```



输入对应数字

```shell
MSET9 v2.1 SETUP by zoogie, Aven, DannyAAM and thepikachugamer
    What is your console model and version?
    Old 3DS has two shoulder buttons (L and R)
    New 3DS has four shoulder buttons (L, R, ZL, ZR)

    -- Please type in a number then hit return --

    Enter one of these four numbers!
    Enter 1 for: Old 3DS/2DS, 11.8.0 to 11.17.0
    Enter 2 for: New 3DS/2DS, 11.8.0 to 11.17.0
    Enter 3 for: Old 3DS/2DS, 11.4.0 to 11.7.0
    Enter 4 for: New 3DS/2DS, 11.4.0 to 11.7.0
    >>> 2      # 根据机器型号和版本进行对应输入，按Enter
```



然后输入 `3` 以注入MSET9。你应该会看到 “MSET9 successfully injected!”，然后按Enter键退出脚本。

![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/20250830-000147.D7iIsEdo.webp)



----

### 3.3.6 插卡破解

1. 将内存卡直接插入3DS。等待一会。如果进入到了 SafeB9SInstaller，那么就是成功了。

<img src="https://stray-soul.com/assets/20250830-000610.De7r96D0.webp" alt="img" style="zoom: 33%;" />

**错误处理：如果并没有进入到 SafeB9SInstalller，看以下方式进行排除**

- 如果红屏了，你可能没有把教程开头的文件放对位置，打开 MSET9 脚本，输入 4 移除触发文件，然后输入 0 退出脚本。然后从头试一次。
- 如果下屏只是一直在转圈，则你可能某些步骤做错了，打开 MSET9 脚本，输入 4 移除触发文件，然后输入 0 退出脚本。然后从第5步再试一次。
- 如果你插卡之后什么也没发生，则或许你某些步骤做错了，考虑将内存卡根目录下的Nintendo 3DS文件夹暂时重命名为backup_Nintendo 3DS文件夹，然后将内存卡插入主机开机一次，待主机重新生成文件夹后，从头开始试一遍教程。
- 如果出现 An exception occurred 错误，则代表你的主机已经破解过了，如果你需要重新安装工具之类的东西，跳至第14步继续做下去。



3. 按上屏提示操作（<←> <↓> <→> <↑> <A>），完毕后会提示你按A重启

- 如果你发现上屏显示的是横纹之类的东西，而没有显示任何提示之类的东西，那么你可能遇到了小概率的显示bug... 但是没关系，按照12步给的按键进行盲按，教程也应该能继续下去。

4. 此时将会自动进入到 Luma设置，将**Enable game patching** 勾选上（按A键勾选，勾选完选项后选项前面显示的是 “（X）”），其它选项不用动，按START键即可。

**错误处理：如果提示 Error writing the configuration file（老版3DS）**

关闭内存卡上的写保护开关。![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/image-60.Bedh_Ou2.webp)如果你发现卡上并没有这个滑块，则它已丢失，你可能需要更换一张内存卡。

----------

### 3.3.7  移除 MSET9

1. 将卡插入电脑，再次运行MSET9脚本。

```python
Windows：双击 MSET9-Windows.bat                          # 间接调用 python3 mset9.py
MacOS: 双击 MSET9-macOS.command，如果有输入密码的提示请输入   # 间接调用 python3 mset9.py
Linux：在终端内 cd 进入内存卡根目录后输入 python3 mset9.py
```



2. 输入对应数字

```shell
MSET9 v2.1 SETUP by zoogie, Aven, DannyAAM and thepikachugamer
    What is your console model and version?
    Old 3DS has two shoulder buttons (L and R)
    New 3DS has four shoulder buttons (L, R, ZL, ZR)

    -- Please type in a number then hit return --

    Enter one of these four numbers!
    Enter 1 for: Old 3DS/2DS, 11.8.0 to 11.17.0
    Enter 2 for: New 3DS/2DS, 11.8.0 to 11.17.0
    Enter 3 for: Old 3DS/2DS, 11.4.0 to 11.7.0
    Enter 4 for: New 3DS/2DS, 11.4.0 to 11.7.0
    >>> 2      # 根据机器型号和版本进行对应输入，按Enter
```



3. 输入4（Remove trigger file），在按Enter

```shell
你应该会看到 “Removed trigger file.”
```



4. 输入 `5` 然后按Enter以移除 MSET9。你应该会看到 “Successfully removed MSET9!”，然后按 Enter 键退出，将内存卡插回主机即可。

![img](%E9%80%9A%E8%BF%87mset9%E5%AE%89%E8%A3%85B9S.assets/20250830-001023.D3wqHZpE.webp)

> 此步非常重要！！！！！！！！！！！！！！若没有移除将会导致主机出现各种问题！！！请一定要确认移除，后续移除会导致主机丢失数据！！！！！！！



### 接下来该干什么？

虽然到这里已经完成破解了，但插卡开机后，主机中并没有安装工具（如FBI等），主机依然看上去像正版的一样。若你想安装工具，请点击下面的链接继续。

[3DS安装必要工具](./3DS安装必要工具.md)

