

### 1 全局的config文件

在`~/.gitconfig`，该文件可以被`.ssh/config`中的设置所覆盖。

`git config --global`会对此全局的文件进行修改。



### 2单独的config文件

每个项目可以有自己单独的config文件

```pshell
$project_dir/.git/config   // git config --local会对此进行修改。
```



此时可用 `git config --local --list` 和`git --config --list`查看



`cat .git/config `

```shell
[push]
	default = simple
[user]
	name = Kang Zhang
	email = shkzhang@cn.ibm.com
[alias]
  ck = checkout
  wd = wyvern_dev
```







设置git edit为vim

```
git config --global core.editor vim
```









