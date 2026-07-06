# dnf REPO设置



在基于 `dnf` 的系统（如 Fedora、CentOS Stream、RHEL 等）中，软件仓库（repo）的配置决定了 `dnf` 从哪里获取软件包。以下是管理和配置 `dnf` 仓库的常用方法：

### 1. 查看当前启用的仓库

首先了解系统中已配置的仓库：

```bash
# 列出所有启用的仓库
dnf repolist enabled

# 列出所有仓库（包括禁用的）
dnf repolist all
```

### 2. 仓库配置文件位置

`dnf` 的仓库配置文件通常存放在以下目录：



- 系统默认仓库：`/etc/yum.repos.d/`（所有 `.repo` 后缀的文件都会被加载）
- 用户自定义仓库：建议也放在 `/etc/yum.repos.d/` 下，方便管理

### 3. 启用 / 禁用仓库

无需修改配置文件，可临时或永久启用 / 禁用仓库：

```bash
# 临时启用某个仓库（仅本次命令有效）
sudo dnf --enablerepo=仓库名 install 软件包

# 临时禁用某个仓库
sudo dnf --disablerepo=仓库名 update

# 永久启用仓库（修改配置文件）
sudo dnf config-manager --set-enabled 仓库名

# 永久禁用仓库
sudo dnf config-manager --set-disabled 仓库名
```



示例：启用名为 `fedora-updates-testing` 的仓库

```bash
sudo dnf config-manager --set-enabled fedora-updates-testing
```

### 4. 添加自定义仓库

如果需要添加第三方仓库（如 EPEL、RPM Fusion 等），有两种方式：

#### 方式 1：安装仓库 RPM 包（推荐）

大多数第三方仓库会提供 `.rpm` 安装包，自动配置仓库：

```bash
# 示例：添加 EPEL 仓库（适用于 RHEL/CentOS）
sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm

# 示例：添加 RPM Fusion 仓库（提供额外多媒体 codec 等）
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
```

#### 方式 2：手动创建 `.repo` 文件

在 `/etc/yum.repos.d/` 目录下创建自定义 `.repo` 文件（如 `myrepo.repo`），格式如下：

```ini
[myrepo]  # 仓库标识（必须唯一）
name=My Custom Repository  # 仓库名称（描述性文字）
baseurl=https://example.com/repo/$releasever/$basearch/  # 仓库地址（支持 http/https/file 协议）
enabled=1  # 1=启用，0=禁用
gpgcheck=1  # 1=验证签名，0=不验证
gpgkey=https://example.com/repo/RPM-GPG-KEY-myrepo  # GPG 公钥地址（若 gpgcheck=1）
```



保存后，`dnf` 会自动识别该仓库。

### 5. 常用仓库管理工具

- `dnf config-manager`：用于修改仓库配置（启用 / 禁用、设置优先级等）

  ```bash
  # 查看仓库详细配置
  dnf config-manager --dump 仓库名
  
  # 设置仓库优先级（数字越小优先级越高，需安装 yum-plugin-priorities）
  sudo dnf config-manager --setopt=仓库名.priority=10 仓库名
  ```

  

- `dnf repolist`：管理仓库列表（如过滤、刷新）

  ```bash
  # 刷新仓库缓存
  sudo dnf clean all && sudo dnf makecache
  ```

### 6. 注意事项

- 第三方仓库可能存在兼容性问题，建议只添加信任的仓库
- 仓库地址中的变量（如 `$releasever` 表示系统版本，`$basearch` 表示架构）会自动替换为实际值
- 若仓库访问失败，检查网络连接或 `baseurl` 是否正确
- 部分仓库需要注册（如 RHEL 官方仓库），需先配置订阅



通过合理配置仓库，可以扩展 `dnf` 可安装的软件范围，同时保证系统稳定性。