<h1 align="center">tar_more</h1>
Linux下最常用的打包程序就是tar了，使用tar程序打出来的包我们常称为tar包，tar包文件的命令通常都是以.tar结尾的。生成tar包后，就可以用其它的程序来进
行压缩了，所以首先就来讲讲tar命令的基本用法：
```
tar -cf all.tar *.jpg
```
　　这条命令是将所有.jpg的文件打成一个名为all.tar的包。-c是表示产生新的包
，-f指定包的文件名。
```
tar -rf all.tar *.gif
```
　　这条命令是将所有.gif的文件增加到all.tar的包里面去。-r是表示增加文件的
意思。
```
tar -uf all.tar logo.gif
```
　　这条命令是更新原来tar包all.tar中logo.gif文件，-u是表示更新文件的意思。
```
tar -tf all.tar
```
　　这条命令是列出all.tar包中所有文件，-t是列出文件的意思
```
tar -xf all.tar
```
这条命令是解出all.tar包中所有文件，-x是解开的意思.
以上就是tar的最基本的用法。为了方便用户在打包解包的同时可以压缩或解压文件，tar提供了一种特殊的功能。这就是tar可以在打包或解包的同时调用其它的压缩程序，比如调用gzip、bzip2等。
##### tar调用gzip
　　gzip是GNU组织开发的一个压缩程序，.gz结尾的文件就是gzip压缩的结果。与gzip
相对的解压程序是gunzip。tar中使用-z这个参数来调用gzip。下面来举例说明一下
：
```
tar -czf all.tar.gz *.jpg
```
　　这条命令是将所有.jpg的文件打成一个tar包，并且将其用gzip压缩，生成一个
gzip压缩过的包，包名为all.tar.gz
```
tar -xzf all.tar.gz
```
　　这条命令是将上面产生的包解开。
##### tar调用bzip2
　　bzip2是一个压缩能力更强的压缩程序，.bz2结尾的文件就是bzip2压缩的结果。
与bzip2相对的解压程序是bunzip2。tar中使用-j这个参数来调用gzip。下面来举例
说明一下：
```
tar -cjf all.tar.bz2 *.jpg
```
　　这条命令是将所有.jpg的文件打成一个tar包，并且将其用bzip2压缩，生成一个
bzip2压缩过的包，包名为all.tar.bz2
```
tar -xjf all.tar.bz2
```
　　这条命令是将上面产生的包解开。
##### tar调用compress
　　compress也是一个压缩程序，但是好象使用compress的人不如gzip和bzip2的人
多。.Z结尾的文件就是bzip2压缩的结果。与 compress相对的解压程序是uncompress
。tar中使用-Z这个参数来调用compress。下面来举例说明一下：
```
tar -cZf all.tar.Z *.jpg
```
　　这条命令是将所有.jpg的文件打成一个tar包，并且将其用compress压缩，生成
一个uncompress压缩过的包，包名为all.tar.Z
```
tar -xZf all.tar.Z
```
　　这条命令是将上面产生的包解开

　　有了上面的知识，你应该可以解开多种压缩文件了，下面对于tar系列的压缩文
件作一个小结：
```
　　1)对于.tar结尾的文件
　　tar -xf all.tar
　　2)对于.gz结尾的文件
　　gzip -d all.gz
　　gunzip all.gz
　　3)对于.tgz或.tar.gz结尾的文件
　　tar -xzf all.tar.gz
　　tar -xzf all.tgz
　　4)对于.bz2结尾的文件
　　bzip2 -d all.bz2
　　bunzip2 all.bz2
　　5)对于tar.bz2结尾的文件
　　tar -xjf all.tar.bz2
　　6)对于.Z结尾的文件
　　uncompress all.Z
　　7)对于.tar.Z结尾的文件
　　tar -xZf all.tar.z
```
　　另外对于Window下的常见压缩文件.zip和.rar，Linux也有相应的方法来解压它们：
##### 对于.zip
　　linux下提供了zip和unzip程序，zip是压缩程序，unzip是解压程序。它们的参
数选项很多，这里只做简单介绍，依旧举例说明一下其用法：
```
zip all.zip *.jpg
```
　　这条命令是将所有.jpg的文件压缩成一个zip包
```
unzip all.zip
```
　　这条命令是将all.zip中的所有文件解压出来



以下补充

tar
```
-c: 建立压缩档案
-x：解压
-t：查看内容
-r：向压缩归档文件末尾追加文件
-u：更新原压缩包中的文件

这五个是独立的命令，压缩解压都要用到其中一个，可以和别的命令连用但只能用其中一个。下面的参数是根据需要在压缩或解压档案时可选的。

-z：有gzip属性的
-j：有bz2属性的
-Z：有compress属性的
-v：显示所有过程
-O：将文件解开到标准输出
```
下面的参数-f是必须的

-f: 使用档案名字，切记，这个参数是最后一个参数，后面只能接档案名。
```
tar -cf all.tar
```
*.jpg这条命令是将所有.jpg的文件打成一个名为all.tar的包。-c是表示产生新的包，-f指定包的文件名。
```
tar -rf all.tar *.gif
```
这条命令是将所有.gif的文件增加到all.tar的包里面去。-r是表示增加文件的意思。
```
tar -uf all.tar logo.gif
```
这条命令是更新原来tar包all.tar中logo.gif文件，-u是表示更新文件的意思。
```
tar -tf all.tar
```
这条命令是列出all.tar包中所有文件，-t是列出文件的意思
```
tar -xf all.tar
```
这条命令是解出all.tar包中所有文件，-x是解开的意思压缩
```
tar –cvf jpg.tar *.jpg //将目录里所有jpg文件打包成tar.jpg
tar –czf jpg.tar.gz *.jpg //将目录里所有jpg文件打包成jpg.tar后，并且将其用gzip压缩，生成一个gzip压缩过的包，命名为jpg.tar.gz
tar –cjf jpg.tar.bz2 *.jpg //将目录里所有jpg文件打包成jpg.tar后，并且将其用bzip2压缩，生成一个bzip2压缩过的包，命名为jpg.tar.bz2
tar –cZf jpg.tar.Z *.jpg //将目录里所有jpg文件打包成jpg.tar后，并且将其用compress压缩，生成一个umcompress压缩过的包，命名为jpg.tar.Z
rar a jpg.rar *.jpg //rar格式的压缩，需要先下载rar for linux
zip jpg.zip *.jpg //zip格式的压缩，需要先下载zip for linux
```
解压
```
tar –xvf file.tar //解压 tar包
tar -xzvf file.tar.gz //解压tar.gz
tar -xjvf file.tar.bz2 //解压 tar.bz2
tar –xZvf file.tar.Z //解压tar.Z
unrar e file.rar //解压rar
unzip file.zip //解压zip
```
总结
```
1、*.tar 用 tar –xvf 解压
2、*.gz 用 gzip -d或者gunzip 解压
3、*.tar.gz和*.tgz 用 tar –xzf 解压
4、*.bz2 用 bzip2 -d或者用bunzip2 解压
5、*.tar.bz2用tar –xjf 解压
6、*.Z 用 uncompress 解压
7、*.tar.Z 用tar –xZf 解压
8、*.rar 用 unrar e解压
9、*.zip 用 unzip 解压
```