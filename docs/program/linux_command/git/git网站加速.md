



# 使用gitclone.com加速github访问



有时候github访问太慢或者直接访问不了，可以使用gitclone加速，官网URL：https://gitclone.com/

按照官方描述，有三种方式使用



#### 1.  replace url方法（推荐方法）

```shell
git clone https://gitclone.com/github.com/tendermint/tendermint.git


git config --global url."https://gitclone.com/".insteadOf https://

git clone https://github.com/tendermint/tendermint.git


```



####  2 set git parameters方法

```shell
git config --global url."https://gitclone.com/".insteadOf https://

git clone https://github.com/tendermint/tendermint.git
```





#### 3. use cgit client方法

```
git clone https://github.com/tendermint/tendermint.git
```

