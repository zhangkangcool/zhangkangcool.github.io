<h1 align="center">use llvm to modify the binary file</h1>


### 二进制打开文件

```shell
vim -b a.out
```



### 格式转化为16进制显示

```shell
:%!xxd

修改后保存为新文件
:$!xxd -r > new.out
```



二进制中的地址和指令与objdump中是一一对应的，看起来很方便。







