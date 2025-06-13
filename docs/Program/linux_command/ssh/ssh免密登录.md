<h1 align="center">ssh免密登录</h1>




###  将公钥复制到远程服务器

生成 SSH Key 对后，需要把公钥复制到远程服务器上。可以使用 `ssh-copy-id` 命令来完成这个操作，该命令会自动将公钥添加到远程服务器的 `~/.ssh/authorized_keys` 文件中。

```shell
ssh-copy-id username@remote_server_ip
```



如果使用相同的秘钥，可以直接在服务器上使用复制命令

```shell
cp id_rsa.pub authorized_keys
```

多个公钥的话，再authorized_keys中写入多行，一个文件占一行即可。