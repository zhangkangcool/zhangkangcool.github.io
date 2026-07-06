# 3DSæ±å

\https://stray-soul.com/softwares.html

视屏教程

https://www.bilibili.com/video/BV1h44y1K7eV/?vd_source=d08e560079f40cdcbcd81c7f269f55e3

https://www.bilibili.com/video/BV1ct4y1L7Hx/

## 3DS汉化

汉化包：

汉化补丁包：https://pan.baidu.com/s/1kX16i5rkGlJFguAGQUKn7w 提取码：l4d5



## 1. 汉化

在开始前，请确认您3DS系统是否更新至最新，有无备份系统NAND。 

1. 开机按Select键进入luma菜单，在enable game patching一项按A键打叉。  （如果您使用双系统，请略过此步） 
2. 将该文件夹内的所有文件夹复制入SD卡的根目录。
3.  将SD卡插入3DS主机，按Start键开机选择Chinese_System_Installer，按提示输入组合键。
4. 如果没有事先备份NAND，会提示您是否进行备份，强烈您进行备份。
5. 选择Install SC/TC。
6. 根据安装在真实/虚拟系统进行选择。
7. 按提示按组合键。
8. 此时开始安装，时长大约2分钟 。
9. （此步骤仅限日版，如果是更新可不做此步骤） 回到主菜单，选择Other Functions→Clear HOME caches  选择SYSNAND（虚拟系统就EmuNAND）。
10. 完成后，选择Other Functions→Delete Apps删除安装数据包（可选） 。
11. 退出重启，完成。



## 2. 更新

本身是可以直接更新的，但是更新后会可能会有部分变回日文英文。并且因为修改过的app无法在更新中自行删除所以会在主机NAND中留下垃圾文件。 

如果你有当前系统版本的脚本backup备份（安装时会自动备份） 在脚本Uninstall SC&TC→Delete Backup→Delete Apps→更新系统→安装最新汉化补丁即可。 

如果你没有对应的backup备份 那就走ctrtransfer保留应用，更新系统，删除SD卡根目录的apps文件夹，再安装最新汉化。



## 3. 卸载

如果您觉得该脚本的卸载功能比较麻烦，您同样可以直接通过ctrtansfer来进行卸载。 

如果您未进行titles备份，或是在本功能支援前就安装了本补丁，请先根据以下步骤进行备份 如果您已经进行了titles备份，请跳过至第五步。 

1. 用G9在SD卡根目录新建BackupSysNAND文件夹或是BackupEmuNAND文件夹。 
2. 如果您在安装时根据提示备份了NAND（保存在gm9/out）或者自行用其他方式备份了NAND   （如果没有留下原始NAND备份，请通过自行ctrtansfer手动卸载补丁并进行NAND备份，或是使用他人最新版本同型号机器的NAND来导出title备份）   请前往选定该NAND，选定后的选项依次是   NAND image options...→Mount image to drive，随后进入目录在title文件夹处按Y。 
3. 前往SD卡/BackupSysNAND或是BackupEmuNAND，进入文件夹。
4. 按Y，选择Copy path(s) 。
5. 回到脚本主菜单，选择Uninstall SC/TC，选择在真实还是虚拟系统进行卸载。
6. 根据提示进行操作，等待卸载结束。
7. （这一步可选）回到脚本主菜单，选择Clear HOME caches ，选择SYSNAND（虚拟系统就EmuNAND）
