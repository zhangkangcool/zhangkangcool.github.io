中文manual: http://vimcdoc.sourceforge.net/doc/help.html



# 1. color scheme

http://blog.csdn.net/hjx5200/article/details/21789821

View ther scheme on the machine
```shell
ls /usr/share/vim/vim73/colors
blue.vim      default.vim  desert.vim   evening.vim  morning.vim  pablo.vim      README.txt  shine.vim  torte.vim
darkblue.vim  delek.vim    elflord.vim  koehler.vim  murphy.vim   peachpuff.vim  ron.vim     slate.vim  zellner.vim
```

Set the scheme
```shell
:colorscheme blue
```

# 2. 翻页

```
整页翻页 ctrl-f ctrl-b
f就是forword b就是backward

翻半页
ctrl-d ctlr-u
d=down u=up

滚一行
ctrl-e ctrl-y

zz 让光标所杂的行居屏幕中央
zt 让光标所杂的行居屏幕最上一行 t=top
zb 让光标所杂的行居屏幕最下一行 b=bottom
```



# 3. 折叠

https://blog.csdn.net/woshicsdn7547/article/details/45364047

### 3.1 vim 6种折叠方式

```shell
manual             手工定义折叠
indent             更多的缩进表示更高级别的折叠
expr               用表达式来定义折叠
syntax             用语法高亮来定义折叠
diff               对没有更改的文本进行折叠
marker             对文中的标志折叠
```

可使用命令`set fdm=*`来设置折叠方式.

### 3.2 折叠打开与折合

indent 对应的折叠代码有，在`普通模式`（例如移动光标）下输入下列命令，而不是在`命令模式`下输入:

```shell
zc      折叠
zC      对所在范围内所有嵌套的折叠点进行折叠
zo      展开折叠
zO      对所在范围内所有嵌套的折叠点展开
[z      到当前打开的折叠的开始处。
]z      到当前打开的折叠的末尾处。
zj      向下移动。到达下一个折叠的开始处。关闭的折叠也被计入。
zk      向上移动到前一折叠的结束处。关闭的折叠也被计入。
```

`zO`打开所有折叠是最常用的，使用`zC`来恢复所有折叠。





# 4 查看历史

#### 4.1 命令行模式下：

```shell
:history 查看所有命令行模式下输入的命令历史
:history search或 / 或？ 查看搜索历史
```



#### 4.2 普通模式下：

```
q/ 查看使用/输入的搜索历史
q? 查看使用？输入的搜索历史
q: 查看命令行历史(推荐方式)
```



## 5 替换

#### ` -l`换成换行

```shell
:%s/ -l/\r/g   # 这里的\r表示换行
```



