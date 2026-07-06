# RPM查询已安装的软件包





使用 `rpm` 命令可以查询系统中已安装的 RPM 软件包，常用的查询方式如下：

### 1. 列出所有已安装的包

```bash
rpm -qa
```



- `-q`：查询模式
- `-a`：所有已安装的包



此命令会列出系统中所有已安装的 RPM 包，输出内容较多，通常结合 `grep` 过滤：

```bash
# 例如：查找包含 "python" 的已安装包
rpm -qa | grep python
```

### 2. 精确查询某个包是否安装

```bash
rpm -q <包名>
```



示例：查询 `firefox` 是否安装

```bash
rpm -q firefox
```



- 若已安装，会显示完整包名（含版本号）
- 若未安装，会提示 `package firefox is not installed`

### 3. 查询包的详细信息

查看已安装包的详细信息（版本、发布日期、安装时间、描述等）：

```bash
rpm -qi <包名>
```



示例：查看 `bash` 包的详细信息

```bash
rpm -qi bash
```

### 4. 查询包安装的文件列表

查看某个包在系统中安装了哪些文件及其路径：

```bash
rpm -ql <包名>
```



示例：查看 `nginx` 安装的所有文件

```bash
rpm -ql nginx
```

### 5. 查询某个文件属于哪个包

如果想知道系统中某个文件是由哪个 RPM 包安装的：

```bash
rpm -qf <文件路径>
```



示例：查询 `/usr/bin/ls` 属于哪个包

```bash
rpm -qf /usr/bin/ls
```

### 6. 查询包的依赖关系

查看已安装包的依赖项：

```bash
# 查看该包依赖哪些其他包
rpm -qR <包名>

# 查看哪些包依赖该包（反向依赖）
rpm -q --whatrequires <包名>
```



示例：查看 `python3` 的依赖包

```bash
rpm -qR python3
```

### 7. 常用组合技巧

- 按关键词模糊查询已安装包：

  ```bash
  rpm -qa | grep -i "java"  # -i 忽略大小写
  ```

  

- 统计已安装包的数量：

  ```bash
  rpm -qa | wc -l
  ```

  

- 查找特定版本的已安装包：

  ```bash
  rpm -qa | grep "kernel-5.14."
  ```

  通过这些命令，可以全面了解系统中 RPM 包的安装情况，方便进行包管理和问题排查。

