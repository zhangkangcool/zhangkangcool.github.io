# Error

### 1 无法登陆

#### [Permission denied (publickey,gssapi-keyex,gssapi-with-mic) 的解决方案！](https://www.cnblogs.com/xubing-613/p/6844564.html)

此时应该修改配置文件`/etc/ssh/sshd_config`以允许通过RSA免密码登陆。

https://www.cnblogs.com/xubing-613/p/6844564.html



### 2 Too open

```shell
$ ssh qiaojun@142.11.252.34
The authenticity of host '142.11.252.34 (142.11.252.34)' can't be established.
ECDSA key fingerprint is SHA256:1fxomF3Gamzr1Sk8b9Ahw4lptxoIQU61teZXvIigsb0.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '142.11.252.34' (ECDSA) to the list of known hosts.
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/Users/ken/.ssh/id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/Users/ken/.ssh/id_rsa": bad permissions
qiaojun@142.11.252.34: Permission denied (publickey,gssapi-keyex,gssapi-with-mic).


```



```shell
chmod 0600 id_rsa
```

