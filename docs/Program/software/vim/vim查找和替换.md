<h1 align="center">vim查找和替换</h1>
# vim查找和替换详解
http://blog.csdn.net/zcube/article/details/42710141

# 1. vim 单文件中查找方法
```shell
/love   从光标位置向前搜索关键词 love  
?love   从光标位置向后搜索关键词 love  
```
正常模式下使用 n 或 N 命令执行 向前查找 或 向后查找 下一个关键词  
```shell
:set ic     忽略大小写命令，ic 为 ignore case 缩写   
:set is     边输入边显示匹配结果，is 是 incsearch 命令的缩写  
:set hls    高亮显示匹配结果，hls 为 highlight search 缩写  
```
可将上述设置放入.vimrc 文件中，设为默认搜索设置  
```  shell
:set noic nois nohls    将取消上述设置  
:noh    暂时取消高亮显示，不会影响下次高亮显示匹配结果   
```

# 2. vim 多文件查找方法  
正常模式下使用 :vim 或 :vimgrep 命令执行多文件搜索  
搜索的时候涉及到选取文件问题，这里主要用到 * 作为通配符  
```shell
** 表示文件夹及子文件夹下的所有文件  
  
搜索 love 关键词  
:vim/love/*                     当前文件夹下的所有文件  
:vim/love/**                    当前文件夹及子目录下的所有文件  
:vim/love/**/*.php              当前文件夹及子目录下的所有 php 文件  
:vim/love/*.php aa/**/*.php     当前文件夹下的 php 文件和 aa 目录及子目录下的 php 文件  
  
使用 ** 和 * 可任意组合出想要搜索的文件  
  
:cw         查看搜索结果  
:ccl        关闭搜索结果  
:cn         查找下一个  
:cp         查找上一个  
```

# 3. vim 单文件替换方法
单文件中使用 :s 命令进行替换操作  
  替换操作会涉及几个常用的标记  
% 所有行  g 单行内所有匹配项  i 忽略大小写  c  确认是否替换  
```  shell
关键词 old 替换为 new  
:s/old/new              将光标所在行第一个 old 替换为 new  
:s/old/new/g            将光标所在行所有 old 替换为 new  
:%s/old/new/gc          全文执行替换,询问是否替换  
:3,10s/old/new/gic      将第3行到第10行内容替换，忽略大小写，且每个询问是否替换  
  
g i c 可自由组合  
```

# 4. vim 多问件替换  

多文件替换使用 :args 和 :argdo 命令，这两个命令结合可以对多文件执行相同操作，不仅是替换  
```  shell
:args *.php                         将当前文件夹下的 php 文件加入参数列表。加入文件操作也可使用 ** 选择文件夹和子文件夹，和上述2 多文件查找用法一样  
:argdo %s/old/new/gc | update       执行替换操作，除使用:argdo 和 | update 外，其它替换操作和 3 中单文件替换用法是一样的  
  
args 命令为选取文件到列表，argdo 命令为对列表中的文件执行批处理操作  
  
:args       查看参数列表  
:argd *     清空参数列表  
:arga xx    添加 xx 文件到参数列表，和 args 添加一样，可用 ** 
```
选择多文件夹和文件，参见上述 2 方法  


注意：  

在执行 argdo 操作的时候，要先保存当前文件，因为批处理操作会跳到其它文件。  
替换前要备份原先文件，update 必须加上，系统会自动保存替换后的文件，否则替换会被中断。  


其它：  

执行 args 添加文件操作会将遍历的文件同样添加到缓冲区列表。  
```  shell
:ls             列出当前缓冲区列表文件  
:bd 3           将缓冲区3号文档删除到非缓冲区列表  
:ls!            列出非缓冲区列表文件  
:bw 3           可将缓冲区或非缓冲区列表文件彻底清除  
:argdo bw       可对参数列表中的所有文件执行清除缓冲区操作  
```



# 5. 换行问题

`\r`是换行，不是`\n`

如: `BB_END`后面加个换行

```shell
:%s/BB_END/BB_END\r/g
```

