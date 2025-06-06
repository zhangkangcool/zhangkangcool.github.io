<h1 align="center">关闭GUI</h1>
https://blog.csdn.net/sole_cc/article/details/42707735



# ubuntu如何关闭图形界面，启动文本模式

## 1 **背景知识**  

#### 1.1 Ubuntu运行级别   

Linux [系统](http://www.2cto.com/os/)任何时候都运行在一个指定的运行级上，并且不同的运行级的程序和服务都不同，所要完成的工作和要达到的目的都不同，系统可以在这些运行级之间进行切换，以完成不同的工作。 

```shell
Ubuntu 的系统运行级别：    
0：关机级别    
1：单用户运行级别，运行rc.sysinit和rc1.d目录下的脚本    
2：多用户，但系统不会启动NFS，字符模式，在有些linux系统中，级别2为默认模式，具有网络功能，如ubuntu.debian
3：多用户，字符模式，系统启动具有网络功能,redhat常用运行级别    
4：用户自定义级别    
5：图形界面模式，redhat常用运行级别    
6：重启级别    
S：单用户运行级别，只运行rc.sysinit文件    
```



#### 1.2 查看当前运行级别,执行命令

`runlevel   `

（ runlevel 显示***\*上次的运行级别\****和**当前的运行级别**，“N”表示没有上次的运行级别。）  



#### 1.3 切换运行级别，执行命令：

`init [0123456Ss]`   

（ 即在 init 命令后跟一个参数，此参数是要切换到的运行级的运行级代号，如：用 init 0 命令关机；用 init 6 命令重新启动。）



# 2 从图形界面转到文本界面的方法

#### 2.1 修改conf文件

对于12.04的ubuntu桌面系统，如果想在开机的时候直接进入字符界面，那可以：

编辑文件 ***\*/etc/init/lightdm.conf\****，在第12行附近，原句“ and runlevel***\*[!06]\****” 改为“ and runlevel***\*[!026]\****”即可，之后如果想切换到图形界面，那再执行：startx 就可以了！

（`sudo init 3`不行，还是图形界面，没什么变化
`sudo service stop lightdm` 图形界面会关闭，卡在check battery那里）





首先要做的，就是***\*阻止这个lightdm的进程开机启动\****。 做法：

- 查看文件/etc/init/rc-sysinit.conf，在第14行附近：确认“env DEFAULT_RUNLEVEL=2”。2是新装系统默认的，确保不被修改。

- 编辑文件 /etc/init/lightdm.conf，在第12行附近，原句“ and runlevel [!06]” 改为“ and runlevel [!026]”。

解释：linux系统都有一个运行级别(runlevel)的概念，不同的运行级别配置将导致系统的启动过程有很大差异，比如当配置 runlevel 为 1 是，是不进入图形界面的。系统启动过程中会有一个init进程来拉起许多其他进程(各种系统服务，窗口界面)。在ubuntu上(11.10,12.04是这样，其他版本或其他linux发行版不确定)init会执行两个目录下的脚本，一个是***\*/etc/init/\****下的，另一个是**/etc/rc?.d/**下的，问号可能是0~6的其中一个数字，代表运行级别。接下来，讲解一下流程以加深理解。

在ubuntu上，init进程首先执行/etc/init/目录下的rc-sysinit.conf，这个文件指明了本次启动的默认运行级别。这是上面第一步的意义：确保默认运行级别是2。接下来目录/etc/init下的其他脚本的执行都会根据不同的运行级别做出不同的动作，比如lightdm会判断运行级别是否处于1,2,3,4,5中的一个，是则启动lightdm，不是则不启动lightdm。这便是上面第二步的意义，修改 lightdm.conf ，把“2”加入到判断语句，使得lightdm在运行级别2的时候不要启动。明白了这些，你就可以灵活一点，例如把默认级别设置为3，而把3加入那个判断语句，也可以达到阻止lightdm启动的效果。完成了/etc/init/目录下的启动动作，init 进程会继续执行/etc/rc2.d目录下的脚本。



#### 2.2 修改grub文件

```shell
sudo  vi  /etc/default/grub
```



```shell
 # 把以”GRUB_CMDLINE_LINUX_DEFAULT=“开始的行改成：
 GRUB_CMDLINE_LINUX_DEFAULT="text",
```



```shell
 # 重设grub引导
 sudo  update-grub
 
 # 重启
 sudo  reboot
```





#### 2.3 关闭Ubuntu的载入画面

ubuntu启动时，会有一个ubuntu字样出现在屏幕，文字下方有闪烁的点，***\*这时按ESC可以在动画和文字界面之间切换\****。这一步骤不属于lightdm，而是一个叫 plymouth 的进程在起作用。实际上，plymouth的意义就在于，在开机到图形桌面 (lightdm)起来这段时间里展示出一个动画，从而提高用户体验。

```shell
屏蔽的方法：

一、编辑 /etc/default/grub 文件，原文11行附近：
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash" 

去掉”splash“，改后：
GRUB_CMDLINE_LINUX_DEFAULT="quiet"

二、执行命令：
sudu update-grub

重启，即可看到，不再有载入画面出现了。
```



