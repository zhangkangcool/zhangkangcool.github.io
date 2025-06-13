<h1 align="center">zsh git 慢的问题</h1>



进入git repo后，zsh会读取repo的信息，所以会很慢。

```shell
# ken @ ken in ~/llvm-project on git:master o [9:27:31]
```

https://blog.csdn.net/a_ran/article/details/72847022

用如下命令解决（无需要添加了.zshrc中）

```shell
git config --add oh-my-zsh.hide-status 1
```


