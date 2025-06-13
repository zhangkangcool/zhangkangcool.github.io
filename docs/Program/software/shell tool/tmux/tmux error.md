<h1 align="center">tmux error</h1>


# 1. linux无法正常启动tmux的解决方法

### 1.1 问题

在服务器端，有时候会遇见输入tmux回车以后没有反应了，甚至ctrl+c也没反应。





### 1.2 解决方法

可以尝试用命令`strace -e trace=file tmux`查看运行tmux的各个操作
通常是会说某个文件夹已经存在了
如我的是/tmp/tmux-1001 has existed





然后我们找到这个文件夹，删除不需要root权限，删去这个文件夹就可以了
`（记得确认这个文件夹的owner是不是你）`
然后就可以正常启动tmux了。



