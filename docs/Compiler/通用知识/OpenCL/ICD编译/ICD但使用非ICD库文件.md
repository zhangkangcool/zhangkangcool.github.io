# ICD但使用非ICD库文件

## 1. 确认使用了icd编译

这里使用了系统的libOpenCL.so库，该库是ICD编译的基础

```shell
ken@d2000:~/workspace/Compiler_6434$ ldd /usr/bin/clinfo 
        linux-vdso.so.1 (0x0000ffff8517a000)
        libOpenCL.so.1 => /usr/lib/libOpenCL.so.1 (0x0000ffff8511a000)
        libdl.so.2 => /lib/libdl.so.2 (0x0000ffff85106000) 
        libc.so.6 => /lib/libc.so.6 (0x0000ffff84f92000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x0000ffff84f63000)
        /lib/ld-linux-aarch64.so.1 (0x0000ffff85147000)            
```







## 2. 不使用icd编译库

在 /etc/OpenCL/vendors/***.icd 文件中，OpenCL 库的路径不一定要写全，但写全路径通常更保险。

根据 Khronos 的 OpenCL 规范，icd 加载器会读取 /etc/OpenCL/vendors/ 目录下以.icd 结尾的文件，并使用 dlopen (3) 来加载.icd 文件中第一行指定的共享库。.icd 文件中的共享库名称可以包含路径，也可以只是文件名。如果只写文件名，那么系统会在标准动态库加载路径中查找该库。例如，在一些系统中，如果库文件位于默认的 LD_LIBRARY_PATH 路径下，使用文件名可能就可以正常加载。但如果库文件不在默认的动态库加载路径中，就需要写全绝对路径，否则可能导致 icd 加载器无法找到库文件而无法正常工作。

#### 2.1 备份目前/etc/OpenCL/vendors下所有的库

```shell
sudo m mesa.icd mesa.icd.bak
```



#### 2.2 建立所需要的icd文件

```shell
sudo touch libLJM.icd
内容为 libOpenCL.so
```

这里可以写完整路径，否则需要设置LD_LIBRARY_PATH

```
ldd /usr/bin/clinfo   # 检验输出结果十分
```

