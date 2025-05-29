

## Search Path

https://blog.csdn.net/ibingow/article/details/7882098
https://gcc.gnu.org/ml/gcc-help/2005-12/msg00017.html
```
Unless loading object has RUNPATH:
    RPATH of the loading object,
        then the RPATH of its loader (unless it has a RUNPATH), ...,
        until the end of the chain, which is either the executable
        or an object loaded by dlopen(loader 为可执行程序或被 dlopen 打开的对象)
    Unless executable has RUNPATH:
        RPATH of the executable
LD_LIBRARY_PATH
RUNPATH of the loading object
ld.so.cache
default dirs
```

gcc编译链接动态库时，很有可能编译通过，但是执行时，找不到动态链接库，那是
因为-L选项指定的路径只在编译时有效，编译出来的可执行文件不知道-L选项后面的值，当然找不到。可以用ldd <your_execute>看看是不有 ‘not found’在你链接的库后面，解决方法是在编译时使用`-Wl,rpath=<your_lib_dir>`，使得execute记住链接库的位置.

`-LDir`是编译时指定的路径，但运行时，EXE并不知道该路径，运动时使用系统路径，或是`$LD_LIBRARY_PATH`指定的路径。
如果想运行时指定库的位置，编译时可以使用`-LDir -Wl -rpath=Dir`或是`-LDir -Wl,rpath,Dir`，这样运行时就不需要再使用`LD_LIBRARY_PATH`了。

二进制程序被链接时由参数-rpath指定的运行时目录，多个则以冒号分隔。这个是被硬编码进二进制程序的，包括可执行程序和动态库，都可以有这个-rpath.





运行时动态库的搜索顺序：

```
1. 二进制程序被链接时由参数-rpath指定的运行时目录，多个则以冒号分隔。这个是被硬编码进二进制程序的，包括可执行程序和动态库，都可以有这个-rpath.
2.环境变量LD_LIBRARY_PATH指定的目录，多个则以冒号分隔。
3.系统里/etc/ld.so.conf文件里指定的目录。
4.系统里动态库加载器ld-linux.so（ldd命令实际调用的还是这个）默认的搜索目录/lib,usr/lib或者/lib64,/usr/lib64。
```





`-Wl`:告诉编译器将后面的参数传递给链接器。

例如：
```
cat test.cpp

#include <stdio.h>
#include <stdlib.h>
int main() {
//    malloc(10);
    return 0;
}
```

#  -LDir

```
xlc -ltcmalloc test.cpp -L/opt/at12.0/lib64
./a.out
./a.out: error while loading shared libraries: libtcmalloc.so.4: cannot open shared object file: No such file or directory
ldd a.out
	linux-vdso64.so.1 =>  (0x00007ffff7f80000)
	libtcmalloc.so.4 => not found
	libgcc_s.so.1 => /lib/powerpc64le-linux-gnu/libgcc_s.so.1 (0x00007ffff7f20000)
	libm.so.6 => /lib/powerpc64le-linux-gnu/libm.so.6 (0x00007ffff7de0000)
	libc.so.6 => /lib/powerpc64le-linux-gnu/libc.so.6 (0x00007ffff7bf0000)
	/lib64/ld64.so.2 (0x00007ffff7fa0000)
```
此种情况，需要将`/opt/at12.0/lib64`加入系统路径或是用LD_LIBRARY_PATH



# -LDir -Wl,-rpath,Dir

这里编译时记住了库所在的路径，所以不需要个性`LD_LIBRARY_PATH`即可运行。

```
xlc -ltcmalloc test.cpp -L/opt/at12.0/lib64 -Wl,-rpath=/opt/at12.0/lib64
ldd a.out
	linux-vdso64.so.1 =>  (0x00007ffff7f80000)
	libtcmalloc.so.4 => /opt/at12.0/lib64/libtcmalloc.so.4 (0x00007ffff7dd0000)
	libgcc_s.so.1 => /opt/at12.0/lib64/power9/libgcc_s.so.1 (0x00007ffff7d90000)
	libm.so.6 => /opt/at12.0/lib64/power9/libm.so.6 (0x00007ffff7c50000)
	libc.so.6 => /opt/at12.0/lib64/power9/libc.so.6 (0x00007ffff7a10000)
	libpthread.so.0 => /opt/at12.0/lib64/power9/libpthread.so.0 (0x00007ffff79c0000)
	libstdc++.so.6 => /opt/at12.0/lib64/power9/libstdc++.so.6 (0x00007ffff7770000)
	/lib64/ld64.so.2 (0x00007ffff7fa0000)

./a.out // work well
```









### -l (小写的L)**参数和**-L (大写的L)参数

-l 不需要路径，不在系统路径中的其它路径由-L指定

**-l**参数就是用来**指定程序要链接的库**，**-l**参数紧接着就是库名，那么库名跟真正的库文件名有什么关系呢？
就拿数学库来说，他的库名是m，他的库文件名是lib**m**.so，很容易看出，把库文件名的头lib和尾.so去掉就是库名了。

好了现在我们知道怎么得到库名了，比如我们自已要用到一个第三方提供的库名字叫libtest.so，那么我们只要把libtest.so拷贝到/usr/lib里，编译时加上**-**ltest参数，我们就能用上libtest.so库了（当然要用libtest.so库里的函数，我们还需要与libtest.so配套的头文件）。

**放在/lib和/usr/lib和/usr/local/lib里的库直接用-l参数就能链接了**，但如果库文件没放在这三个目录里，而是放在其他目录里，这时我们只用**-l**参数的话，链接还是会出错，出错信息大概是：“/usr/bin/ld: cannot find **-**lxxx”，也就是链接程序ld在那3个目录里找不到libxxx.so，这时**另外一个参数-L就派上用场了**，比如常用的X11的库，它放在/usr/X11R6/lib目录下，我们编译时就要用**-L** /usr/X11R6/lib **-**lX11参数，**-L参数跟着的是库文件所在的目录名**。再比如我们把libtest.so放在/aaa/bbb/ccc目录下，那链接参数就是**-L**/aaa/bbb/ccc **-**ltest

另外，大部分libxxxx.so只是一个链接，以RH9为例，比如libm.so它链接到/lib/libm.so.x，/lib/libm.so.6又链接到/lib/libm**-**2.3.2.so，

如果没有这样的链接，还是会出错，因为ld只会找libxxxx.so，所以如果你要用到xxxx库，而只有libxxxx.so.x或者libxxxx**-**x.x.x.so，做一个链接就可以了ln **-**s libxxxx**-**x.x.x.so libxxxx.so

手工来写链接参数总是很麻烦的，还好很多库开发包提供了生成链接参数的程序，名字一般叫xxxx**-**config，一般放在/usr/bin目录下，比如





cmake中设置编译时路径,运行时可以使用LD_LIBRARY_PATH，或者 rpath把路径在程序中写死

```
link_directories(/usr/lib)
会编译时自动添加-L,如
gcc -o test test.cpp -L/usr/lib
```

