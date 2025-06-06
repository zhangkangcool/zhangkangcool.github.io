<h1 align="center">ctags & ctaglist</h1>
```shell
1.$ ctags –R *    ($ 为Linux系统Shell提示符)        

2.$ vi –t tag       (请把tag替换为您欲查找的变量或函数名)        

3.:ts                   (ts  助记字：tags list, “:”开头的命令为VI中命令行模式命令)        

4.:tp                   (tp 助记字：tags preview)

5.:tn                   (tn 助记字：tags next)

6.Ctrl + ]            (跳转到定义处)

7.Ctrl + T           (退回至跳转前)

8.:ta x                (跳转到符号x的定义处，如果有多个符号，直接跳转到第一处
9.:ts x                (列出符号x的定义)
10.:tj x               (可以看做上面两个命令的合并，如果只找到一个符号定义，那么直接跳转到符号定义处，如果有多个，则让用户自行选择)
```

注意：运行vim的时候，必须在“tags”文件所在的目录下运行。否则，运行vim的时候还要用“:settags=”命令设定“tags”文件的路径，这样vim才能找到“tags”文件。在完成编码时，可以手工删掉tags文件。

`.vimrc`中加入下面两句后，不必每次都在有tags文件的目录下运行。

```shell
 set tags=tags;    "   其中 ; 不能没有
 set autochdir
```



#### ctags5.8源码安装地址

https://blog.csdn.net/G_BrightBoy/article/details/16830395




使用 vim + ctags + cscope + taglist 阅读源码
```shell
https://my.oschina.net/u/554995/blog/59927
```

# ctagslist

```shell
https://www.cnblogs.com/diegodu/p/7088596.html
https://www.cnblogs.com/mo-beifeng/archive/2011/11/22/2259356.html
```

```shell
"鼠标在Vim 里面点击无效，请在~/.vimrc下加入这句话
set mouse=a  " always use mouse

"Taglist setup
"设置ctags路径
let Tlist_Ctags_Cmd = '/usr/bin/ctags'

"启动vim后自动打开taglist窗口
let Tlist_Auto_Open = 1

"不同时显示多个文件的tag，仅显示一个
"let Tlist_Show_One_File = 1

"taglist为最后一个窗口时，退出vim
let Tlist_Exit_OnlyWindow = 1

"taglist窗口显示在右侧，缺省为左侧
"let Tlist_Use_Right_Window =1

"设置taglist窗口大小
"let Tlist_WinHeight = 100
"let Tlist_WinWidth = 40

"设置taglist打开关闭的快捷键F2
noremap <F2> :TlistToggle<CR>

"更新ctags标签文件快捷键设置
noremap <F6> :!ctags -R<CR>

"设置Tlist_Sort_Type为”name”可以使taglist以tag名字进行排序
let Tlist_Sort_Type = "name"

"listToggle打开taglist窗口时，如果希望输入焦点在taglist窗口中
let Tlist_GainFocus_On_ToggleOpen = 1

"defualt double click to jump
"let list_Use_SingleClick = 1


let Tlist_Show_Menu = 1

```

# cscope

```shell
https://blog.csdn.net/dengxiayehu/article/details/6330200
https://blog.csdn.net/heyuqian_csdn/article/details/78832099
https://blog.csdn.net/clevercode/article/details/51379309
https://blog.csdn.net/lee244868149/article/details/38980937
```

If you use `cscope`, you should not use `set autochdir`, or you will get the error `cscope file does not exist`.
https://my.oschina.net/u/554995/blog/59927

````shell
cscope -Rbkq
```

```

  
set tags=tags;  
"set autochdir  

map <F12> :!ctags -R .<CR>  
  
map <F11> :!cscope -Rbq <CR>  
```

If you only use `ctags`, you should use `set autochdir`



