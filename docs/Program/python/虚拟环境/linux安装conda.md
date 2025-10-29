<h1 align="center">linux安装conda</h1>



在 CentOS 系统中安装和使用 Conda（以轻量级的 Miniconda 为例）步骤如下，操作简单且适合服务器环境：

### **一、安装 Miniconda**

Miniconda 仅包含 Conda 和基础依赖，适合服务器场景，步骤如下：

#### 1. 下载 Miniconda 安装脚本

打开终端，通过 `wget` 下载 Linux 版本的 Miniconda 安装脚本（选择 Python 3.x 版本）：

```bash
# 下载最新版 Miniconda3（Python 3.x）
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh    # for x86_65
或者
wget https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh # arm64

```

如果没有 `wget`，可先安装：`sudo yum install -y wget`

#### 2. 执行安装脚本

```bash
# 赋予脚本执行权限
chmod +x Miniconda3-latest-Linux-x86_64.sh   # x86
chmod +x Miniforge3-Linux-aarch64.sh         # for amr64
# 运行安装脚本
bash Miniconda3-latest-Linux-x86_64.sh
```

#### 3. 按照提示完成安装

- 按 `Enter` 阅读许可协议，输入 `yes` 同意。
- 选择安装路径（默认 `~/miniconda3`，直接按 `Enter` 确认即可，无需修改）。
- 最后会提示是否初始化 Conda，输入 `yes`（关键步骤，否则终端无法识别 `conda` 命令）。

#### 4. 使配置生效

安装完成后，关闭当前终端并重新打开，或执行以下命令刷新环境变量：

```bash
source ~/.bashrc
```

此时终端前缀会出现 `(base)`，表示已激活 Conda 的默认环境。

### **二、验证安装**

输入以下命令，若显示版本号则安装成功：

```bash
conda --version
# 示例输出：conda 23.11.0
```

### **三、Conda 常用操作**

#### 1. 升级 Conda（可选）

```bash
conda update -n base -c defaults conda
```

#### 2. 创建虚拟环境

推荐为不同项目创建独立环境，避免依赖冲突：

```bash
# 创建名为 myenv 的环境，指定 Python 版本（如 3.9）
conda create -n myenv python=3.9
```

- `-n` 后面是环境名称（自定义，如 `myproject`）。
- `python=3.9` 指定 Python 版本（根据需求修改，如 3.8、3.10 等）。

#### 3. 激活 / 切换环境

```bash
# 激活环境
conda activate myenv

# 激活后终端前缀会显示环境名：(myenv)
```

#### 4. 安装依赖包

在激活的环境中，可通过 `conda` 或 `pip` 安装包：

```bash
# 用 conda 安装（优先推荐，适合二进制包）
conda install numpy pandas

# 用 pip 安装（适合 Conda 源没有的包）
pip install requests
```

如果需要安装 `requirements.txt` 中的依赖（如之前的项目依赖），先激活环境，再执行：

```bash
pip install -r requirements.txt
```

#### 5. 查看已创建的环境

```bash
conda env list
# 或
conda info --envs
```

#### 6. 退出当前环境

```bash
conda deactivate
```

#### 7. 删除环境（谨慎操作）

```bash
conda remove -n myenv --all
```

### **四、可选配置（提升体验）**

#### 1. 禁止默认激活 base 环境

Conda 默认启动终端时会激活 `base` 环境，可关闭：

```bash
conda config --set auto_activate_base false
```

如需手动激活 `base` 环境：`conda activate base`

#### 2. 添加国内镜像源（加速下载）

默认源在国内可能较慢，可添加清华镜像源：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes  # 显示源地址
```

### **五、卸载 Miniconda（如需）**

1. 删除安装目录：

   ```bash
   rm -rf ~/miniconda3
   ```

   

2. 清理

    

   ```
   .bashrc
   ```

    

   中的 Conda 配置：

   ```bash
   vi ~/.bashrc
   ```

   

   删除文件中与

    

   ```
   miniconda3
   ```

    

   相关的行（通常在末尾），保存后执行

    

   ```
   source ~/.bashrc
   ```

   。

通过以上步骤，即可在 CentOS 中完成 Conda 的安装和基础使用，适合管理 Python 项目依赖和虚拟环境。