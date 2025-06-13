<h1 align="center">openmp</h1>


https://blog.csdn.net/ab0902cd/article/details/108770396









```
#pragma多线程

#pragma omp barrier(多个线程的同步点)

#pragma omp single(选中某一个子线程做)/master（主线程执行）
```



如果设置了nowait子句，则在并行循环的结束处不会进行线程同步，先执行完循环的线程会继续执行后续代码。



```
（1）#pragma omp parallel for

         for()

（2）#pragma omp parallel

        {//注意：大括号必须要另起一行

         #pragma omp for

          for()

        }

```



```
int omp_get_num_threads(void)：返回当前并行区域中的线程数量。

int omp_get_thread_num(void)：返回值当前并行区域中，当前线程在线程组中的编号。这个编号从0开始
```





```shell
// 产生thread_num个线程执行num_thread中的代码
#pragma omp parrel num_thread(thread_num)
{
  uint32_t theadIdx = omp_get_thread_num()
}
```





