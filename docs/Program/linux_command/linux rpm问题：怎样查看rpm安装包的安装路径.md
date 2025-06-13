<h1 align="center">linux rpm问题：怎样查看rpm安装包的安装路径</h1>
https://blog.csdn.net/vovo2000/article/details/2110762

# 1. 如何安装rpm软件包 

rmp软件包的安装可以使用程序rpm来完成。执行下面的命令 
```shell
rpm -i your-package.rpm 
```
其中your-package.rpm是你要安装的rpm包的文件名，一般置于当前目录下。 
安装过程中可能出现下面的警告或者提示： 
`... conflict with ...` 可能是要安装的包里有一些文件可能会覆盖现有 
的文件，缺省时这样的情况下是无法正确安装的可以用 
`rpm --force -i `强制安装即可 
`... is needed by ...` 
`... is not installed ... `此包需要的一些软件你没有安装可以用 
`rpm --nodeps -i` 来忽略此信息 
也就是说，`rpm -i --force --nodeps` 可以忽略所有依赖关系和文件问题，什么包 
都能安装上，但这种强制安装的软件包不能保证完全发挥功能

# 2.如何安装.src.rpm软件包 
有些软件包是以.src.rpm结尾的，这类软件包是包含了源代码的rpm包，在安装时 
需要进行编译。这类软件包有两种安装方法，

### 方法一：
```shell
1.rpm -i your-package.src.rpm 
2. cd /usr/src/redhat/SPECS 
3. rpmbuild -bp your-package.specs   ///一个和你的软件包同名的specs文件 
4. cd /usr/src/redhat/BUILD/your-package/   // 一个和你的软件包同名的目录 
5. ./configure    // 这一步和编译普通的源码软件一样，可以加上参数 
6. make 
7. make install
````


### 方法二: 
```shell


1.rpm -i you-package.src.rpm 
2. cd /usr/src/redhat/SPECS 
前两步和方法一相同 
3. rpmbuild -bb your-package.specs 一个和你的软件包同名的specs文件 
这时，在/usr/src/redhat/RPM/i386/ （根据具体包的不同，也可能是i686,noarch等等) 
在这个目录下，有一个新的rpm包，这个是编译好的二进制文件。 
执行rpm -i new-package.rpm即可安装完成。


```

# 3.如何卸载rpm软件包 
使用命令 rpm -e 包名，包名可以包含版本号等信息，但是不可以有后缀.rpm 
比如卸载软件包proftpd-1.2.8-1，可以使用下列格式：
```shell
rpm -e proftpd-1.2.8-1 
rpm -e proftpd-1.2.8 
rpm -e proftpd- 
rpm -e proftpd 
```
不可以是下列格式： 
```shell
rpm -e proftpd-1.2.8-1.i386.rpm 
rpm -e proftpd-1.2.8-1.i386 
rpm -e proftpd-1.2 
rpm -e proftpd-1 
```
有时会出现一些错误或者警告： 
`... is needed by ...` 这说明这个软件被其他软件需要，不能随便卸载 
可以用rpm -e --nodeps强制卸载

# 4.如何不安装但是获取rpm包中的文件 
使用工具rpm2cpio和cpio 
```shell
rpm2cpio xxx.rpm | cpio -vi 
rpm2cpio xxx.rpm | cpio -idmv 
rpm2cpio xxx.rpm | cpio --extract --make-directories 
```
参数i和extract相同，表示提取文件。v表示指示执行进程 
d和make-directory相同，表示根据包中文件原来的路径建立目录 
m表示保持文件的更新时间。

# 5.如何查看与rpm包相关的文件和其他信息 
下面所有的例子都假设使用软件包mysql-3.23.54a-11 
### 1.我的系统中安装了那些rpm软件包 
```shell
rpm -qa 讲列出所有安装过的包 
如果要查找所有安装过的包含某个字符串sql的软件包 
rpm -qa |grep sql
```
### 2.如何获得某个软件包的文件全名 
```shell
rpm -q mysql 可以获得系统中安装的mysql软件包全名，从中可以获得 
当前软件包的版本等信息。这个例子中可以得到信息mysql-3.23.54a-11
```

### 3.一个rpm包中的文件安装到那里去了？ 
```shell
rpm -ql 包名 
注意这里的是不包括.rpm后缀的软件包的名称 
也就是说只能用mysql或者mysql-3.23.54a-11而不是mysql-3.23.54a-11.rpm。 
如果只是想知道可执行程序放到那里去了，也可以用which，比如 
which mysql
```

### 4.一个rpm包中包含那些文件 
```shell
一个没有安装过的软件包，使用rpm -qlp ****.rpm 
一个已经安装过的软件包，还可以使用rpm -ql ****.rpm
```
### 5.如何获取关于一个软件包的版本，用途等相关信息？ 
```shell
一个没有安装过的软件包，使用rpm -qip ****.rpm 
一个已经安装过的软件包，还可以使用rpm -qi ****.rpm
```

### 6.某个程序是哪个软件包安装的，或者哪个软件包包含这个程序 
```shell
rpm -qf `which 程序名` 返回软件包的全名 
rpm -qif `which 程序名` 返回软件包的有关信息 
rpm -qlf `which 程序名` 返回软件包的文件列表 
```
注意，这里不是引号，而是`，就是键盘左上角的那个键。 
也可以使用rpm -qilf，同时输出软件包信息和文件列表

### 7.某个文件是哪个软件包安装的，或者哪个软件包包含这个文件 
注意，前一个问题中的方法，只适用与可执行的程序，而下面的方法，不仅可以 
用于可执行程序，也可以用于普通的任何文件。前提是知道这个文件名。 
首先获得这个程序的完整路径，可以用whereis或者which，然后使用rpm -qf例如： 
```shell
# whereis ftptop 
ftptop: /usr/bin/ftptop /usr/share/man/man1/ftptop.1.gz 
# rpm -qf /usr/bin/ftptop 
proftpd-1.2.8-1 
# rpm -qf /usr/share/doc/proftpd-1.2.8/rfc/rfc0959.txt 
proftpd-1.2.8-1
```

总结： 
获得软件包相关的信息用rpm -q，q表示查询query，后面可以跟其他选项，比如 
i 表示info，获得软件包的信息； 
l 表示list，获得文件列表； 
a 表示all，在所有包中执行查询； 
f 表示file，根据文件进行相关的查询； 
p 表示package，根据软件包进行查询 
需要的查询条件可以使用grep产生，或者从"` `"中的命令行产生

# 6.关于rpm软件包的一些相关知识 
### 1.什么是rpm 
rpm 即RedHat Package Management，是RedHat的发明之一

### 2.为什么需要rpm 
在一个操作系统下，需要安装实现各种功能的软件包。这些软件包一般都有各自的 
程序，但是同时也有错综复杂的依赖关系。同时还需要解决软件包的版本，以及安装， 
配置，卸载的自动化问题。为了解决这些问题，RedHat针对自己的系统提出了一个 
较好的办法来管理成千上百的软件。这就是RPM管理系统。在系统中安装了rpm管理系统 
以后，只要是符合rpm文件标准的打包的程序都可以方便的安装，升级，卸载

### 3.是不是所有的linux都使用rpm 
任何系统都需要包管理系统，因此很多linux都使用rpm系统。但rpm系统是为RH专门 
但是TL,Mandrake等系统也都使用rpm。由于rpm的源程序可以在别的系统上进行编译， 
所以有可能在别的系统上也使用rpm 
除了rpm，其他一些系统也有自己的软件包管理程序，例如debian的deb包， 
slakware也都有自己的包管理系统

### 4.rpm包的文件名为什么那么长 
rpm包的文件名中包含了这个软件包的版本信息，操作系统信息，硬件要求等等。 
比如mypackage-1.1-2TL.i386.rpm，其中mypackage是在系统中登记的软件包的名字 
1.1是软件的版本号，2是发行号，TL表示用于TL操作系统，还可能是RH等。i386表示 
用于intel x86平台，还可能是sparc等。

### 5.软件包文件名中的i386,i686是什么意思 
rpm软件包的文件名中，不仅包含了软件名称，版本信息，还包括了适用的硬件架构 
的信息。 
i386指这个软件包适用于intel 80386以上的x86架构的计算机(AI32) 
i686指这个软件包适用于intel 80686以上(奔腾pro以上)的x86架构的计算机(IA32) 
noarch指这个软件包于硬件架构无关，可以通用。 
i686软件包的程序通常针对CPU进行了优化，所以，向后兼容比较用以，i386的包在 
x86机器上都可以用。向前一般不兼容。不过现在的计算机，奔腾pro以下的CPU已经很少 
用，通常配置的机器都可以使用i686软件包


### 6.不同操作系统发行的rpm包可否混用？ 
对于已经编译成二进制的rpm包，由于操作系统环境不同，一般不能混用。 
对于以src.rpm发行的软件包，由于需要安装时进行本地编译，所以通常可以在不同 
系统下安装。

### 7.使用rpm时遇到的一些特殊问题 
Q 我用rpm -e **.rpm无法删除rpm包 
A 包名不要包括rpm， 
rpm -e 包名，可以包含版本号等信息，但是不可以有后缀.rpm

Q 在MS的系统下有没有读RPM文件的工具？ 
A wincmd with rpm plugins.....

Q 是否可以通过ftp安装安装升级rpm包？ 
A 可以。rpm -ivh ftp://xxxxxxxx/PATH2SomeRPM

Q rpm安装时已有的包版本过高怎么办？ 
A 有时由于安装的软件包太老，而系统中相关的软件包版本比较新，所以可能需要 
安装的包依赖的一些文件会找不到。这时有两种解决办法， 
第一是在系统文件中找到和需要的文件功能相同或相似的文件，做一个符号链接到 
需要的目录下。 