

/usr/local/lib/ 不在系统的LD_LIBRARY_PATH



在 Linux 系统中，`/usr/local/lib/` 目录通常用于存放用户手动安装的库文件。不过，该目录可能并未被默认添加到 `LD_LIBRARY_PATH` 环境变量里，这会致使系统在运行时无法找到存于该目录下的库文件。以下为你介绍几种把 `/usr/local/lib/` 加入 `LD_LIBRARY_PATH` 的方法。

### 临时添加

你能够在当前终端会话里临时添加 `/usr/local/lib/` 到 `LD_LIBRARY_PATH`，此设置仅在当前终端会话中生效，关闭终端后便会失效。

```bash
export LD_LIBRARY_PATH=/usr/local/lib/:$LD_LIBRARY_PATH
```

运行此命令之后，`/usr/local/lib/` 就会被添加到 `LD_LIBRARY_PATH` 的开头。你可以通过如下命令来验证：

```bash
echo $LD_LIBRARY_PATH
```

### 永久添加

若要让 `/usr/local/lib/` 永久地被添加到 `LD_LIBRARY_PATH`，可以按照以下步骤操作。

#### 针对单个用户

编辑当前用户的 `~/.bashrc` 或者 `~/.bash_profile` 文件，添加如下内容：

```bash
export LD_LIBRARY_PATH=/usr/local/lib/:$LD_LIBRARY_PATH
```



保存文件后，运行下面的命令使更改生效：

```bash
source ~/.bashrc
```

```bash
source ~/.bash_profile
```



#### 针对所有用户

编辑 `/etc/profile` 或者 `/etc/environment` 文件。



**编辑 `/etc/profile`**：
在文件末尾添加如下内容：

```bash
export LD_LIBRARY_PATH=/usr/local/lib/:$LD_LIBRARY_PATH
```



保存文件后，运行以下命令使更改生效：

```bash
source /etc/profile
```



**编辑 `/etc/environment`**：
打开 `/etc/environment` 文件，找到 `LD_LIBRARY_PATH` 变量（若不存在则添加），并添加 `/usr/local/lib/` 到变量值中。示例如下：

```plaintext
LD_LIBRARY_PATH="/usr/local/lib/:$LD_LIBRARY_PATH"
```

保存文件后，重启系统或者注销并重新登录，使更改生效。



### 通过 `ldconfig` 解决

另一种解决办法是借助 `ldconfig` 工具更新动态链接器的缓存。你可以在 `/etc/ld.so.conf.d/` 目录下创建一个新的配置文件，例如 `local.conf`，并在文件中添加 `/usr/local/lib/`：

```plaintext
/usr/local/lib/
```

保存文件后，运行以下命令更新缓存：

```bash
sudo ldconfig
```

这种方法能让系统在运行时自动查找 `/usr/local/lib/` 目录下的库文件，而无需修改 `LD_LIBRARY_PATH` 环境变量。