<h1 align="center">linux设置串口通信</h1>





### **1. 确认串口设备**

1. **查看可用串口**
   串口设备通常位于`/dev/`目录下，常见名称有：

   - `/dev/ttyS0`~`/dev/ttyS3`：传统 COM 口（硬件串口）
   - `/dev/ttyUSB0`~`/dev/ttyUSBn`：USB 转串口设备（如 CH340、CP2102 芯片）
   - `/dev/ttyACM0`~`/dev/ttyACMn`：USB 转串口（如 Arduino 设备）

   使用以下命令查看系统识别的串口设备：

   ```bash
   ls /dev/tty*
   ```

2. **查看设备信息**
   若要确认 USB 转串口设备的详细信息（如厂商、型号），可使用：

   ```bash
   dmesg | grep tty
   ```



### **2. 使用命令行工具读取串口数据**

#### 2.1 **minicom**

```bash
# 安装minicom
sudo apt-get install minicom

# 配置并打开串口（示例：/dev/ttyUSB0，波特率115200）
minicom -D /dev/ttyUSB0 -b 115200
```



- 操作快捷键

  ：

  - `Ctrl + A` 后按 `X`：退出 minicom
  - `Ctrl + A` 后按 `Z`：显示帮助菜单

#### 2.2 **screen**

```bash
# 安装screen
sudo apt-get install screen

# 打开串口
screen /dev/ttyUSB0 115200

# 退出screen
Ctrl + A 后按 \，然后按 Y 确认
```



#### 2.3 **cat（简单查看）**

若只需查看串口输出，可使用：

```bash
cat /dev/ttyUSB0
```



**注意**：此方法无法发送数据，且需提前配置好波特率（见下文编程方式）。



## 3. 如何确认是哪个设备

可以先`ls /dev/tty*`，然后插拔串口线，然后再次使用该命令，并对结果进行对比。

插入设置后，查看信息`dmesg | tail -n 20`。

### **常见设备与名称对应关系**

| 设备类型         | 典型名称                | 识别特征（dmesg/lsusb）     |
| ---------------- | ----------------------- | --------------------------- |
| CH340/CH341 芯片 | `/dev/ttyUSB0`          | ID 1a86:7523、ch341 驱动    |
| CP2102 芯片      | `/dev/ttyUSB0`          | ID 10c4:ea60、cp210x 驱动   |
| FT232RL 芯片     | `/dev/ttyUSB0`          | ID 0403:6001、ftdi_sio 驱动 |
| Arduino 板       | `/dev/ttyACM0`          | ID 2341:0043、cdc_acm 驱动  |
| 树莓派板载串口   | `/dev/ttyAMA0`或`ttyS0` | 硬件串口，直接集成在主板上  |



