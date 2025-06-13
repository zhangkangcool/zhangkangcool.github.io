<h1 align="center">xargs</h1>




https://www.freesion.com/article/1989606497/



```shell
-i使用缺省的占位符{}，而-I是可以指定的，所以在使用上也显示有不同

-I {} 与 -i 是等价的。 -I 可以指定其它占位符，不仅限于 {}
建议使用 -I {}， 因为 macos或某些linux不支持 -i
```





```shell
[root@liumiaocn easypack]# cat /etc/redhat-release 
CentOS Linux release 7.3.1611 (Core) 
[root@liumiaocn easypack]# 
[root@liumiaocn easypack]# find . -name "*.tar.gz" |xargs -I {} echo {}
./containers/alpine/redmine/themes.tar.gz
./containers/standard/rancher/k3s/ansible/download/files/pause-amd64-3.1.tar.gz
./k8s/shell/data/pause-amd64-3.1.tar.gz
[root@liumiaocn easypack]# 
[root@liumiaocn easypack]# find . -name "*.tar.gz" |xargs -i echo {}
./containers/alpine/redmine/themes.tar.gz
./containers/standard/rancher/k3s/ansible/download/files/pause-amd64-3.1.tar.gz
./k8s/shell/data/pause-amd64-3.1.tar.gz
[root@liumiaocn easypack]# 

liumiaocn:easypack liumiao$ find . -name '*.tar.gz' |xargs -I {} echo 
```





不同版本的xargs对-i的处理也有所不同，比如在当前的MacOS上的xargs，直接都没有-i参数，这也是脚本移植的时候需要考虑的内容。确认结果如下所示，可以看到相同的命令在MacOS上的xargs是无法使用的





什么时候需要使用占位符号，比如复制

```shell
find . -name '*.tar.gz' | xargs -I {} cp {} zhangkang.tar.gz
```

