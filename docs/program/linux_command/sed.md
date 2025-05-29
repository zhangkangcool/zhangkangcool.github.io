# sed

查找含有`adandrea`的文件，并将其全部找成`shkzhang`。

```shell
sed -i "s/adandrea/shkzhang/g" `grep -rl "adandrea" .`
```



`-i` 表示inplace edit，就地修改文件
`-r` 表示搜索子目录
`-l` 表示输出匹配的文件名



`grep -rl`

```shell
[shkzhang@afterburner:~/spec2017/v1.0/config]$ grep -rl shkzhang .
./clang_Patrick.cfg
./perf.report.1
./spec2017_int_p9_aaron_namd.cfg
./nohup.out
./clang_default.cfg
./perf.report.192
./spec2017_int_p9.debug.cfg
./clang_default.cfg~
./perf.report
./wyvern_ori.cfg~
./spec2017_int_p8.cfg
./perf.report.192.wyvern
./perf.namd.XL.C1.res
./clang_Patrick.cfg~
./spec2017_int_p9.debug.cfg~
./clang_aaron_namd.cfg
./.spec2017_int_p9.cfg.swp
./CINT2017.006.intrate.refrate.cfg
./wyvern_ori.cfg
./clang_simple.cfg
./perf.report.1.wyvern
./spec2017_int_p9.noisel.cfg
./#clang_simple.cfg#
./spec2017_int_p9.cfg
./clang_whitney.cfg
./clang_simple.cfg~
./perf.namd.wyvern.C1.res
./clang_O3.cfg
./spec2017_int_p9.cfg~
./perf.namd.wyvern.C1.res2
./#spec2017_int_p9.cfg#
```





https://blog.csdn.net/shenyunsese/article/details/125044669



### 1. 替换文件中的文本
命令格式：

```shell
sed -i 's/<search_str>/<target_str>/g' <file_path>
```

参数解析：
search_str：需要搜索的字符串（字符串带斜杠’/‘,需要有转移’//‘）
target_str：需要替换成的目标字符串（字符串带斜杠’/‘,需要有转移’//'）
file_path：操作的文件路径

举例：
将a.txt文件中的abc字符替换为xyz

```shell
sed -i 's/abc/xyz/g' a.txt
```


将a.txt文件中的/a字符替换为-b,注意使用了转义符。

```shell
sed -i 's/\/a/-b/g' a.txt
```



### 2. 替换文件夹中文件中的文本
命令格式：

```shell
sed -i 's/<search_str>/<target_str>/g' `grep "<search_str>" -rl <folder_path>`
```



参数解析：
search_str：需要搜索的字符串（字符串带斜杠’/‘,需要有转移’//‘）
target_str：需要替换成的目标字符串（字符串带斜杠’/‘,需要有转移’//'）
folder_path：操作的文件夹路径

命令解析：
1、前半节是sed的命令
2、后半节是寻找文件夹目录中满足搜索条件的文件，注意顿号"`",不是逗号

举例：
将/opt/a目录下的所有文件中的abc字符串替换为xzy

```shell
sed -i 's/abc/xyz/g' `grep "xyz" -rl /opt/a`
或
grep "abc" -rl . | xargs sed -i 's/abc/xyz/g'
```





以下是实例

```Shell
grep -rl "set(CMAKE_INSTALL_PREFIX \"/install" . |  xargs sed -i "s/set(CMAKE_INSTALL_PREFIX \"\/install/set(CMAKE_INSTALL_PREFIX \"\.\.\/install/g"

将
set(CMAKE_INSTALL_PREFIX "/install")
替换为
set(CMAKE_INSTALL_PREFIX "../install")

这里的grep只需要转译/，但sed需要转译/和引号
```







