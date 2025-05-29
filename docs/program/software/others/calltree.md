https://blog.csdn.net/lsr_fighting/article/details/78458679

https://www.cnblogs.com/mylinux/p/6145625.html 

https://www.cnblogs.com/zengkefu/p/5569577.html

https://blog.csdn.net/breaksoftware/article/details/75441751

make INS_BASE=/home/ken/software/calltree-2.3 install
https://blog.csdn.net/breaksoftware/article/details/75441751

ppc le上未成功

### calltree看代码调用图
calltree是在linux下面看c代码（尤其是复杂的内核代码）的神器。

推荐  calltree+vim + ctags + cscope + taglist 【 vim: 搭建vim看代码的环境   http://www.cnblogs.com/mylinux/p/5013588.html】

　　或者 calltree + source insight

source insight能方便地查看向上和向下的函数（变量等）调用关系，并且支持多种语言，几乎是无可替代的。但调用深度太大的时候，人就记不住了，这个时候calltree可以生成一个全局的调用图，便于很快掌握代码框架。

如想看内核代码start_kernel干了些什么：

```
#calltree -np -b  list=start_kernel    depth=3 `find ./init/ ./kernel/ -name "*.c"` > maps

#vi maps
```


```
start_kernel:
|   WARN
|   acpi_early_init
|   anon_vma_init
|   boot_cpu_init
|   |   set_cpu_active
|   |   |   cpumask_clear_cpu
|   |   |   cpumask_set_cpu
|   |   |   to_cpumask
|   |   set_cpu_online
|   |   |   cpumask_clear_cpu
|   |   |   cpumask_set_cpu
|   |   |   to_cpumask
|   |   set_cpu_possible
|   |   |   cpumask_clear_cpu
|   |   |   cpumask_set_cpu
|   |   |   to_cpumask
|   |   set_cpu_present
|   |   |   cpumask_clear_cpu
|   |   |   cpumask_set_cpu
|   |   |   to_cpumask
|   |   smp_processor_id
|   boot_init_stack_canary
|   buffer_init
|   build_all_zonelists
|   calibrate_delay
|   |   calibrate_delay_converge
|   |   |   __delay
|   |   calibrate_delay_direct
|   |   |   printk
|   |   |   read_current_timer
|   |   |   time_before_eq
|   |   calibrate_delay_is_known
```

### 下载：
```
    calltree-2.3.tar.bz2 http://download.chinaunix.net/download.php?id=2245&ResourceID=1172 
    sudo apt-get install graphviz
```

### 使用：
```
    calltree -help
    calltree -np -gb -m *.c 
    calltree -np -gb lf=send_query *.c 
    calltree -np -b  list=start_kernel    depth=4 `find ./init/ -name "*.c"` > maps
    calltree -np -b  list=raw_spin_lock_irqsave  `find . -name "*.c"`
    calltree -np -gb lf=raw_spin_lock_irqsave    `find . -name "*.c"`
```
还可以生成一个调用图，以kernel为例
```
    calltree -np -b -dot list=start_kernel ./init/*.c > ~/start_kernel.dot
    dot -T png start_kernel.dot -o ./testhaha.png
```        
    
    下面介绍一下各选项：
    -b 就是那个竖线了，很直观地显示缩进层次。
    -g 打印内部函数的所属文件名及行号，外部函数所属文件名和行号也是可打印的，详man
    -np 不要调用c预处理器，这样打印出的界面不会很杂乱，但也可能会产生错误哦，如果我们只看函数的调用关系的话，不会有大问题。
    -m 告诉程序从main开始
    还有一个重要的选项是listfunction ，缩写是lf，用来只打印某个函数中的调用，用法是： lf=your_function
    depth=#选项： 例如： calltree -gb -np -m bind9/bin/named/*.[c.h] depth=2 > codecalltree.txt


注意：

　　调用关系一般比较复杂，最好设置好（1）想要关心的函数（2）调用深度（3）关心的目录，否则又会引入过多无关选项，干扰视线。


