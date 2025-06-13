<h1 align="center">md5sum</h1>
http://linux.51yip.com/search/md5sum





比*md5*更安全的校验*[**算法**](http://lib.csdn.net/base/datastructure)*还有*SHA**系列如`sha512sum`

# 1. md5sum

### 1.1 用法

```shell
用法：md5sum [选项]... [文件]...
显示或检查 MD5(128-bit) 校验和。
若没有文件选项，或者文件处为"-"，则从标准输入读取。

  -b, --binary          以二进制模式读取
  -c, --check           从文件中读取MD5 的校验值并予以检查
  -t, --text            以纯文本模式读取(默认)

以下三个选项在进行校验时非常有用：
      --quiet           不为校验成功的文件输出OK
      --status          不输出任何内容，使用退出状态号显示成功
  -w, --warn            对格式不准确的校验和行进行警告

      --strict         with --check, exit non-zero for any invalid input
      --help            显示此帮助信息并退出
      --version         显示版本信息并退出

校验和会按照RFC 1321 规范生成。当进行检查时，给出的输入格式应该和程序的输出
样板格式相同。默认的输出模式时输出一行校验和的校验结果，并有一个字符来
表示文件类型("*"代表二进制，" "代表纯文本)，并同时显示每个文件的名称。
```



### 1.2 例子

##### 例1

```shell
[root@linux ~] md5sum -b test            #以二进制进行读取
832df9d3d18471d80d67bee644eebb8a *test
```



##### 例2

```shell
[root@zhangwei scripts] md5sum zzz > zzz.md5        # 生成md5加密检验和    
[root@zhangwei scripts] md5sum -c zzz.md5           # 检验与文件是否一致
```



```shell
[root@server software]# md5sum lua-5.3.4.tar.gz 
53a9c68bcc0eda58bdc2095ad5cdfc63  lua-5.3.4.tar.gz
[root@server software]# md5sum lua-5.3.4.tar.gz > lua-md5.txt
[root@server software]# md5sum -c lua-md5.txt 
lua-5.3.4.tar.gz: OK
```



#  2. sha512sum

`sha1sum/sha224sum/sha256sum/sha384sum/sha512sum`

```shell
[root@server software]# sha1sum lua-5.3.4.tar.gz 
79790cfd40e09ba796b01a571d4d63b52b1cd950  lua-5.3.4.tar.gz
[root@server software]# sha1sum lua-5.3.4.tar.gz > lua-5.3.4.txt
[root@server software]# sha1sum -c lua-5.3.4.txt 
lua-5.3.4.tar.gz: OK
```

