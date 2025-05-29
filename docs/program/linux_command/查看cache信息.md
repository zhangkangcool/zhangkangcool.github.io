https://blog.csdn.net/ai297313/article/details/44726187

cache信息在`/sys/devices/system/cpu/cpu1/cache`.

  有4个文件夹，分别L1数据cache，L1指令cache，L2cache，L3cache

```shell
coherency_line_size  number_of_sets  size  ways_of_associativity
level                shared_cpu_map  type
```

cat level可以查看是几级cache，`type`则说明cache的类型，`coherency_line_size`cache行的大小。

