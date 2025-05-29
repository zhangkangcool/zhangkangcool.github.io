

# 1. useradd

```
-c<备注>：加上备注文字。备注文字会保存在passwd的备注栏位中； -d<登入目录>：指定用户登入时的启始目录； -D：变更预设值； -e<有效期限>：指定帐号的有效期限； -f<缓冲天数>：指定在密码过期后多少天即关闭该帐号； -g<群组>：指定用户所属的群组； -G<群组>：指定用户所属的附加群组； -m：自动建立用户的登入目录； -M：不要自动建立用户的登入目录； -n：取消建立以用户名称为名的群组； -r：建立系统帐号； -s：指定用户登入后所使用的shell； -u：指定用户id。

来自: http://man.linuxde.net/useradd
```

In general, you can use below command create the user and set its home directory.

```
useradd shkzhang -m  -s /bin/bash
```

### 更改目录的组及所有者

```
chgrp  用户名    文件名  -R
chown 用户名   文件名  -R
```



# 2. userdel

```
userdel -r ken // 删除用户及目录
```





# 3. usedel usermod

`usermod`或者直接修改/etc/passwd

```
sudo usermod -s /bin/bash zhangkang

sudo usermod --shell /bin/bash zhangkang
```
