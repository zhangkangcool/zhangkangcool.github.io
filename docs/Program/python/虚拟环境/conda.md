# python安装conda



在 Python 环境中安装和配置 Conda（通常指 Anaconda 或 Miniconda）的步骤如下，适用于 Windows、macOS 和 Linux 系统：

### **一、选择 Conda 版本**

Conda 有两个常用发行版，按需选择：

- **Anaconda**：包含大量预安装的科学计算包（适合新手，体积较大）。
- **Miniconda**：仅包含 Conda 和基础依赖（轻量，需手动安装其他包）。

### **二、下载安装包**

1. 访问官方下载页：
   - Anaconda：https://www.anaconda.com/download
   - Miniconda：https://docs.conda.io/en/latest/miniconda.html
2. 根据操作系统（Windows/macOS/Linux）和 Python 版本（建议选 Python 3.x）下载对应安装包。

### **三、安装步骤**

#### **1. Windows 系统**

1. 双击下载的 `.exe` 文件，启动安装向导。
2. 勾选 **"I Agree"** 同意协议。
3. 选择安装类型：
   - 推荐 **"Just Me (recommended)"**（仅当前用户）。
   - 避免选择 **"All Users"**（可能需要管理员权限）。
4. 选择安装路径：
   - 建议默认路径，或自定义路径（路径中不要有空格、中文或特殊字符）。
5. 高级选项（关键）：
   - 勾选 **"Add Anaconda3 to my PATH environment variable"**（添加到环境变量，方便命令行调用，Miniconda 同理）。
   - 可选勾选 **"Register Anaconda3 as my default Python 3.x"**（设为默认 Python）。
6. 点击 **"Install"** 完成安装。

#### **2. macOS 系统**

1. 下载 `.pkg` 安装包，双击启动向导，按提示完成安装（默认路径通常为 `~/opt/anaconda3` 或 `~/miniconda3`）。

2. 若下载的是

    

   ```shell
   .sh
   ```

    

   脚本（适用于命令行安装）：

   - 打开终端，进入下载目录：`cd ~/Downloads`

   - 执行安装命令（替换文件名）：

     

     ```shell
     bash Miniconda3-latest-MacOSX-x86_64.sh
     ```

     （Intel 芯片）

     或

     ```shell
     bash Miniconda3-latest-MacOSX-arm64.sh
     ```

     （M1/M2 芯片）

   - 按提示输入 `yes` 同意协议，选择安装路径（默认即可），最后确认初始化 Conda（输入 `yes`）。

#### **3. Linux 系统**

1. 下载 `.sh` 脚本，终端进入下载目录：`cd ~/Downloads`

2. 执行安装命令（替换文件名）：

   

   ```shell
   bash Miniconda3-latest-Linux-x86_64.sh
   ```

3. 按提示输入 `yes` 同意协议，选择安装路径（默认 `~/miniconda3`），确认初始化 Conda（输入 `yes`）。

4. 重启终端或执行 `source ~/.bashrc`（或 `~/.zshrc`）使配置生效。

### **四、验证安装**

1. 打开新的终端（或命令提示符）。

2. 输入以下命令，若显示版本号则安装成功：

   

   ```shell
   conda --version
   ```

   或

   ```shell
   conda -V
   ```

### **五、初始化 Conda（若未自动配置）**

如果终端输入 `conda` 提示 “命令不存在”，需手动初始化：

1. 终端中进入 Conda 安装目录的

    

   ```shell
   bin
   ```

    

   文件夹（以 Miniconda 为例）：

   

   Windows：

   ```shell
   cd C:\Users\用户名\miniconda3\Scripts
   ```

   

   macOS/Linux：

   ```shell
   cd ~/miniconda3/bin
   ```

2. 执行初始化命令：

   

   ```shell
   conda init
   ```

3. 重启终端后生效。

### **六、常用后续操作**

1. 更新 Conda：

   

   ```shell
   conda update conda
   ```

2. 创建虚拟环境：

   

   ```shell
   conda create -n 环境名 python=3.9
   ```

   （指定 Python 版本）

3. 激活环境：

   

   Windows：

   ```shell
   conda activate 环境名
   ```

   

   macOS/Linux：

   ```shell
   source activate 环境名
   ```

   （或直接

    

   ```shell
   conda activate 环境名
   ```

   ，取决于配置）

4. 安装包：

   

   ```shell
   conda install 包名
   ```

   或 

   ```shell
   pip install 包名
   ```

通过以上步骤，即可完成 Conda 的安装和基础配置。如果遇到权限或路径问题，检查安装路径是否有特殊字符，或尝试以管理员身份运行终端 / 安装程序。





### 七. 安装指定版本的python

```shell
# 创建一个 Python 3.9 的环境（名称自定义，比如 myenv）
conda create -n myenv python=3.9
# 激活环境
conda activate myenv
# 再次安装依赖
```



导出环境

```
conda run -n Acuity pip freeze > requirements.txt
```

