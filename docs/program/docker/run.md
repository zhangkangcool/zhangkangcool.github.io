



# 1 docker run

```shell
tf_build是镜像名v1是版本号，用：分隔，不加版本号默认是用最新的，也就是lateset后缀的
docker run --name zhangkang --gpus all -it tf_build:v1 /bin/bash
```



使用docker run之后，每次都会建一个新的容器



-------

## 2. 使用已经有的容器

#### 2.1 启动所需要使用的容器

```shell
docker ps -a  // 查看现在有哪些容器，找到需要使用的容器id或name
docker restart a120b46b9f46 或 docker restart zhangkang
```



#### 2.2 利用attach进入容器(不推荐)

`attach`不是一个好方法，如果打开多个终端的话，多个终端会进行同步显示。

```shell
docker restart a120b46b9f46
docker attach a120b46b9f46
```



如果在`docker run`时使用了名字`zhangkang`，可以使用下面的命令，不需要使用ID

```shell
docker restart zhangkang
docker attach zhangkang
```



#### 2.3 利用exec执行容器（推荐）

这样你就进到这个container 里面了，这个bash退出也不会影响之前docker run 启动的 bash

```shell
docker restart zhangkang  // 登陆多个终端只需要执行一次restart
docker exec -it zhangkang /bin/bash
```



