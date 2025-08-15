

<h1 align="center">rpm & dnf 卸载软件</h1>



在基于 RPM 的系统（如 Fedora、CentOS、RHEL、openSUSE 等）中，卸载 Mesa 相关组件可以使用 `rpm` 命令或系统包管理器（如 `dnf` 或 `zypper`）。



不过，直接使用 `rpm` 命令卸载可能会比较复杂，因为 Mesa 是许多图形应用的依赖项，强行卸载可能会导致系统组件损坏。建议优先使用包管理器进行操作：

这里以卸载mesa为例

### 1. 使用 dnf（Fedora、CentOS 8+、RHEL 8+）

```bash
# 查看已安装的 Mesa 相关包
dnf list installed "mesa-*"

# 卸载特定的 Mesa 包（替换为实际包名）
sudo dnf remove mesa-<package-name>

# 如需卸载所有 Mesa 相关包（不推荐，可能导致系统问题）
sudo dnf remove "mesa-*"
```

### 2. 使用 zypper（openSUSE）

```bash
# 查看已安装的 Mesa 相关包
zypper search --installed-only "mesa-*"

# 卸载特定的 Mesa 包
sudo zypper remove mesa-<package-name>
```

### 3. 直接使用 rpm 命令（谨慎使用）

如果必须使用 `rpm` 命令，可以这样操作：

```bash
# 查找已安装的 Mesa 包
rpm -qa | grep mesa

# 卸载指定包（替换为实际包名）
sudo rpm -e --nodeps mesa-<package-name>
```

> **警告**：
>
> - `--nodeps` 选项会忽略依赖关系，强行卸载可能导致桌面环境崩溃、图形应用无法运行等问题
> - Mesa 是开源图形栈的核心组件，完全卸载可能导致系统无法正常启动图形界面
> - 除非明确知道自己在做什么，否则不建议完全卸载 Mesa 相关组件



如果是为了解决之前的 OpenCL 冲突问题，建议只卸载特定的冲突包（如 `mesa-opencl-icd`），而不是整个 Mesa 套件。