# dnf如何安装软件



`dnf` 是 Fedora、CentOS 8+、RHEL 8+ 等基于 RPM 的 Linux 发行版中使用的包管理器，用于安装、更新、卸载软件包。以下是使用 `dnf` 安装软件的常用方法：

### 1. 基本安装命令

查询可供安装的软件包（需提前设置好repo）

```shell
# 1. 搜索所有可安装的软件包（含已安装和未安装）
dnf search <关键词>

# 示例：搜索所有包含 "editor" 的可安装软件
dnf search editor

# 2. 仅显示未安装的可安装软件
dnf search --uninstalled <关键词>

# 3. 查看特定软件包的详细信息（包括是否可安装）
dnf info <软件包名>

# 示例：查看 "vim" 软件包的信息（是否可安装、版本等）
dnf info vim
```





安装软件的基本语法：

```bash
sudo dnf install <软件包名称>
```



示例：安装 `firefox` 浏览器

```bash
sudo dnf install firefox
```

### 2. 安装多个软件包

可以同时安装多个软件，用空格分隔包名：

```bash
sudo dnf install package1 package2 package3
```

示例：同时安装 `git` 和 `vim`

```bash
sudo dnf install git vim
```

### 3. 从本地 RPM 包安装

如果已经下载了 `.rpm` 格式的安装包，可直接指定路径安装：

```bash
sudo dnf install /path/to/package.rpm
```



示例：安装当前目录下的 `example.rpm`

```bash
sudo dnf install ./example.rpm
```

### 4. 安装特定版本的软件

如需安装软件的特定版本，先查询可用版本，再指定版本号安装：

```bash
# 查看软件的所有可用版本
dnf list --showduplicates <软件包名称>

# 安装指定版本（版本号需完整匹配）
sudo dnf install <软件包名称>-<版本号>
```



示例：安装特定版本的 `nginx`

```bash
dnf list --showduplicates nginx
sudo dnf install nginx-1.24.0-1.fc38
```

### 5. 强制安装（覆盖冲突文件）

如果安装时遇到文件冲突，可使用 `--allowerasing` 允许替换冲突文件：

```bash
sudo dnf install <软件包名称> --allowerasing
```

### 6. 安装后自动清理缓存

安装完成后自动删除下载的安装包缓存：

```bash
sudo dnf install <软件包名称> && sudo dnf clean packages
```

### 其他常用相关命令

- 搜索软件包：`dnf search <关键词>`（如 `dnf search text editor`）
- 查看软件包信息：`dnf info <软件包名称>`
- 检查是否已安装：`dnf list installed <软件包名称>`



使用 `dnf` 安装软件时需要管理员权限（`sudo`），确保网络连接正常（从远程仓库安装时）。