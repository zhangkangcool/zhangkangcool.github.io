<h1 align="center">RaspBerry PI 4安装 typora</h1>



Typora 是一款商业软件，但在测试期间免费。你可以通过以下步骤在树莓派上安装 Typora：

1. **更新软件包列表**：

   

   在树莓派的终端中输入以下命令，更新系统的软件包列表：

   ```bash
   sudo apt update
   ```

   

2. **安装 snapd**：

   使用以下命令安装`snapd`，它是用于管理`snap`包的工具：

   ```bash
   sudo apt install snapd
   ```

   

3. **重启设备**：

   

   安装完`snapd`后，需要重启树莓派，使设置生效：

   ```bash
   sudo reboot
   ```

   

4. **再次安装 snapd**：

   重启后，再次执行以下命令安装`snapd`的`snap`包，以获取最新版本的`snapd`

   ```bash
   sudo snap install snapd
   ```

   

5. **安装 Typora**：

   最后，使用以下命令安装 Typora：

   ```bash
   sudo snap install typora
   ```



