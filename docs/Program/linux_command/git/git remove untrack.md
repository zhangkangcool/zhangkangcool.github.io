<h1 align="center">git remove untrack</h1>
https://blog.csdn.net/u013536313/article/details/92578694

### 使用时必须小心，只有在使用了git reset后，多出来的文件手动删除比较麻烦时才用

使用后，所有备份的文件也会被删除，不要加`-d`

### 1. 在用上述 git clean 前，加上 -n 参数来先看看会删掉哪些文件，防止重要文件被误删

```shell
git clean -nxfd
git clean -nf
git clean -nfd**
```



###  2. 删除 untracked files

```shell
git clean -f
```



### 3. 连 untracked 的目录也一起删掉

```shell
git clean -fd
```



### 4. 连 gitignore 的untrack 文件/目录也一起删掉 （慎用)

一般这个是用来删掉编译出来的 .o之类的文件用的）**

```shell
git clean -xfd
```



