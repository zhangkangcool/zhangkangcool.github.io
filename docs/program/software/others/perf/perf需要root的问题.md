https://www.cnblogs.com/ber619/p/13431817.html



2.一般环境中，安装完成后，使用perf top/perf record是不能正常工作的：

*WARNING: Kernel address maps (/proc/{kallsyms,modules}) are restricted,*
*check /proc/sys/kernel/kptr_restrict.*

*Samples in kernel functions may not be resolved if a suitable vmlinux*
*file is not found in the buildid cache or in the vmlinux path.*

*Samples in kernel modules won't be resolved at all.*

*If some relocation was applied (e.g. kexec) symbols may be misresolved*
*even with a suitable vmlinux or kallsyms file.*

*perf_event_open(..., PERF_FLAG_FD_CLOEXEC) failed with unexpected error 13 (Permission denied)*
*perf_event_open(..., 0) failed unexpectedly with error 13 (Permission denied)*
*Error:*
*You may not have permission to collect stats.*

*Consider tweaking /proc/sys/kernel/perf_event_paranoid,*
*which controls use of the performance events system by*
*unprivileged users (without CAP_SYS_ADMIN).*

*The current value is 3:*

*-1: Allow use of (almost) all events by all users*
*Ignore mlock limit after perf_event_mlock_kb without CAP_IPC_LOCK*
*>= 0: Disallow ftrace function tracepoint by users without CAP_SYS_ADMIN*
*Disallow raw tracepoint access by users without CAP_SYS_ADMIN*
*>= 1: Disallow CPU event access by users without CAP_SYS_ADMIN*
*>= 2: Disallow kernel profiling by users without CAP_SYS_ADMIN*

*To make this setting permanent, edit /etc/sysctl.conf too, e.g.:*

*kernel.perf_event_paranoid = -1*

两种解决方法：

（1）使用sudo权限，如sudo perf top。

（2）设置kenel.perf_event_paranoid：

​    （2.1）临时设置，需要sudo su切换到root用户后再进行如下操作，操作完成后返回原用户，此时输入perf top可以正常工作。该方法系统重启后失效。

　　　　如果是ubuntu16.04系统：

　　　　echo 0 > /proc/sys/kernel/kptr_restrict
　　　　echo -1 > /proc/sys/kernel/perf_event_paranoid

　　　　如果是ubuntu18.04系统（未实测）：

　　　　echo -1 > /proc/sys/kernel/perf_event_paranoid

　　（2.2）修改配置文件，重启后仍有效。

　　　　编辑/etc/sysctl.conf，在文件末尾加上：

　　　　　　kernel.kptr_restrict=0 （如果是ubuntu16.04则加入该配置）

　　　　　　kernel.perf_event_paranoid= -1

　　　　最后，使用sysctl -p /etc/sysctl.conf命令reload配置文件。