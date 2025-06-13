<h1 align="center">安装ssh</h1>


https://jingyan.baidu.com/article/54b6b9c08ff5c42d583b473c.html



# 如何在Ubuntu上开启SSH服务

SSH 是为建立在应用层基础上的安全协议。SSH 是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。利用 SSH 协议可以有效防止远程管理过程中的信息泄露问题。如果没有开启ssh无法进行远程连接终端。

## 工具/原料

- Ubuntu操作系统（我的是ubuntu 16.04.3 LTS）

## 方法/步骤

1. 

   查看是否开启了ssh服务是否安装,使用命令：

   sudo ps -e |grep ssh

   如果安装了的是会有sshd服务的，下面的图片是没有安装ssh服务

   ![如何在Ubuntu上开启SSH服务](https://exp-picture.cdn.bcebos.com/cfa9ae04541bd10f859e752eba0e1799e82aa70c.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)

2. 

   先更新资源列表，使用命令：

   sudo apt-get update

   ![如何在Ubuntu上开启SSH服务](https://exp-picture.cdn.bcebos.com/0cdb2f0e1799e92ac6003af4e1fec314f0c5a00c.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)

3. 

   安装openssh-server，使用命令：

   sudo apt-get install openssh-server

   ![如何在Ubuntu上开启SSH服务](https://exp-picture.cdn.bcebos.com/6bbfdd14f1c595eec379cf9327530688902c9a0c.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)

4. 

   继续输入udo ps -e |grep ssh查看是否安装成功，和下面图片一样看到sshd则说明安装成功。

   ![如何在Ubuntu上开启SSH服务](https://exp-picture.cdn.bcebos.com/906dbbcadce890488a440f43130e5f204271920c.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)

5. 

   查看主机的IP地址，使用命令：

   ifconfig

   ![如何在Ubuntu上开启SSH服务](https://exp-picture.cdn.bcebos.com/423041db3620b93a5f315871ad0f8835dc8a8a0c.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)

6. 

   下载putty软件，进行先关参数输入

   ![如何在Ubuntu上开启SSH服务](https://exp-picture.cdn.bcebos.com/274e9635dd8a59deddbff0b5b370d5413b8c840c.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)

7. 

   输入用户名和密码进行链接。

   ![如何在Ubuntu上开启SSH服务](https://exp-picture.cdn.bcebos.com/444696013870d541a634debc2e0f94fc518c800c.jpg?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_500%2Climit_1)

   END

## 注意事项

- 启动ssh命令：service sshd start
- 停止ssh命令：service sshd stop