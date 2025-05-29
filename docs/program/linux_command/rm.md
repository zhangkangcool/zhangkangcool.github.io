# **Linux下禁用rm命令之建立回收站**



可以改用python脚本



#### 1 创建trash

```shell
mkdir .trash
```



#### 2 创建回收站脚本文件

`cat remove.sh`

```shell

# 指定第一步骤中创建的回收站目录的绝对路径
TRASH_DIR="$HOME/.trash/"

for i in $*; do
        STAMP=`date +%Y%m%d`
        FileName=`basename $i`
        mv $i $TRASH_DIR/$FileName"_"$STAMP
done
```



#### 3 覆盖rm命令

`.bashrc`

```shell
alias rm='sh $HOME/remove.sh'
alias realrm='/bin/rm'
```



```shell
. .bashrc
```

