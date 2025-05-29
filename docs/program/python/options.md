

# 1 `--user`

利用 pip 安装 Python 程序包到个人用户文件夹下

```shell
pip install --user package_name
```



这样会将Python 程序包安装到 **$HOME/.local** 路径下，其中包含三个字文件夹：**bin**，**lib** 和 **share**。



 然后修改 **.bash_profile** 文件使得 **$HOME/.local/bin** 目录下的程序加入到环境变量中

```shell
export PATH=\$HOME/.local/bin:\$PATH
```

