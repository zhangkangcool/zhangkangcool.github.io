<h1 align="center">红米AX6S救砖教程</h1>
https://home.x-wan.top/archives/mi-ax6s-jiu



# 红米AX6S救砖教程



每一个sysupgrade都要对应自己的factory，如果不对可能存在变砖的可能性，所以如果换不同的包，最好恢复官方后重新刷factory包开始。



##### 1. 用有线连接电脑和路由器的LAN口。

##### 2. 解压小米救急工具包，打开MIWIFIRepairTool.x86.exe。

##### 3. 点浏览，选miwifi_rb03_firmware_stable_1.2.7.bin，再点下一步。

##### 4. 再选网卡，我这里是以太网5，根据实际情况选择，再点下一步

##### 5. 重启路由器

拔掉路由器电源，再按住RESET键不要松手，再插上电源，等到黄灯闪烁后再松开，救砖工具会跳出进度条，等到路由器蓝灯闪烁，则刷机成功，插拔电源重启即可。



##### 6. 把电脑网卡改成自动获取，稍等几分钟即可进小米后台了

```shell
192.168.31.1，不是的话，就看ipconfig
```



启动成功后，进入开发版固件，需要重复解锁SSH的过程，从`红米AX6S路由刷入openWrt`的第二步开始。



**##### 路由器指示灯状态说明**

```shell
1. 蓝灯长亮：工作正常
2. 蓝灯闪烁：刷机成功（需要断电重启，注意路由断电后请等待10s以上再通电）
3. 橙灯长亮：正在启动
4. 橙灯闪烁：进入刷机流程或系统升级中（该过程不要断电）
5. 红灯长亮：系统故障
6. 红灯闪烁：刷机失败
```

