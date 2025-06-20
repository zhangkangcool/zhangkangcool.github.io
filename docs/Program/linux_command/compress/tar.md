<h1 align="center">tar</h1>
### Linux操作系统中，*.zip、*.tar、*.tar.gz、*.tar.bz2、*.tar.xz、*.jar、*.7z等格式的压缩与解压

# 1. zip格式
```
压缩： zip -r [目标文件名].zip [原文件/目录名]
解压： unzip [原文件名].zip
```
注：-r参数代表递归

# 2. tar格式（该格式仅仅打包，不压缩）
```
打包：tar -cvf [目标文件名].tar [原文件名/目录名]
解包：tar -xvf [原文件名].tar

注：c参数代表create（创建），x参数代表extract（解包），v参数代表verbose（详细信息），f参数代表filename（文件名），所以f后必须接文件名。
```

# 3. tar.gz格式

方式一：利用前面已经打包好的tar文件，直接用压缩命令。
```
压缩：gzip [原文件名].tar
解压：gunzip [原文件名].tar.gz
```
方式二：一次性打包并压缩、解压并解包
```
打包并压缩： tar -zcvf [目标文件名].tar.gz [原文件名/目录名]
解压并解包： tar -zxvf [原文件名].tar.gz
```
注：z代表用gzip算法来压缩/解压。

# 4. tar.bz2格式

方式一：利用已经打包好的tar文件，直接执行压缩命令：
```
压缩：bzip2 [原文件名].tar
解压：bunzip2 [原文件名].tar.bz2
```
方式二：一次性打包并压缩、解压并解包
```
打包并压缩： tar -jcvf [目标文件名].tar.bz2 [原文件名/目录名]
解压并解包： tar -jxvf [原文件名].tar.bz2
```
注：小写j代表用bzip2算法来压缩/解压。

# 5. tar.xz格式

方式一：利用已经打包好的tar文件，直接用压缩命令：
```
压缩：xz [原文件名].tar
解压：unxz [原文件名].tar.xz
```
方式二：一次性打包并压缩、解压并解包
```
打包并压缩： tar -Jcvf [目标文件名].tar.xz [原文件名/目录名]
解压并解包： tar -Jxvf [原文件名].tar.xz
```
注：大写J代表用xz算法来压缩/解压。

# 6. tar.Z格式（已过时）

方式一：利用已经打包好的tar文件，直接用压缩命令：
```
压缩：compress [原文件名].tar
解压：uncompress [原文件名].tar.Z
```
方式二：一次性打包并压缩、解压并解包
```
打包并压缩： tar -Zcvf [目标文件名].tar.Z [原文件名/目录名]
解压并解包： tar -Zxvf [原文件名].tar.Z
```
注：大写Z代表用ncompress算法来压缩/解压。另，ncompress是早期Unix系统的压缩格式，但由于ncompress的压缩率太低，现已过时。

# 7. jar格式
```
压缩：jar -cvf [目标文件名].jar [原文件名/目录名]
解压：jar -xvf [原文件名].jar
```
注：如果是打包的是Java类库，并且该类库中存在主类，那么需要写一个META-INF/MANIFEST.MF配置文件，内容如下：
```
Manifest-Version: 1.0
Created-By: 1.6.0_27 (Sun Microsystems Inc.)
Main-class: the_name_of_the_main_class_should_be_put_here
```
然后用如下命令打包：
```
jar -cvfm [目标文件名].jar META-INF/MANIFEST.MF [原文件名/目录名]
```
这样以后就能用“java -jar [文件名].jar”命令直接运行主类中的public static void main方法了。

# 8. 7z格式
```
压缩：7z a [目标文件名].7z [原文件名/目录名]
解压：7z x [原文件名].7z
```
注：这个7z解压命令支持rar格式，即：
```
7z x [原文件名].rar
```
