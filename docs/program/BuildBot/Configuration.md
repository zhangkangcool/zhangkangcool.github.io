

# 1 Configure file

```shell
./bb-master/master/master.cfg

./bb-master/master/buildbot.tac
./bb-worker/worker/buildbot.tac
```



```
buildbot reconfig ~/BuildBot/bb-master/master
```





### 1.1 Test the config file

http://docs.buildbot.net/latest/manual/configuration/intro.html

```shell
[bbadmin@khamsin1:~/BuildBot]$ buildbot checkconfig bb-master/master/master.cfg
[bbadmin@khamsin1:~/BuildBot]$ buildbot checkconfig bb-master/master
```



