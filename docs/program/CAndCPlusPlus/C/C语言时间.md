<h1 align="center">C语言时间</h1>




```c++
    struct timeval tv;       // 有两个成员 秒 和 微秒
    struct tm *tm_info;      // 有时 分 秒 三个成员
    gettimeofday(&tv, NULL)  // 得到当前时间
    tm_info = localtime(&tv.tv_sec);      // 将秒数转换为本地时间 
```





### 1. 得到本地时间

```c++
#include <stdio.h>
#include <sys/time.h>
#include <time.h>

int main() {
    struct timeval tv;
    struct tm *tm_info;

    // 获取当前时间
    if (gettimeofday(&tv, NULL) == -1) {
        perror("gettimeofday");
        return 1;
    }

    // 将秒数转换为本地时间
    tm_info = localtime(&tv.tv_sec);

    // 输出当前的时分秒
    printf("当前时间（时:分:秒）: %02d:%02d:%02d\n", tm_info->tm_hour, tm_info->tm_min, tm_info->tm_sec);

    return 0;
}
    
```





### 2. 算函数运行时间

```c++
    struct timeval start, end;        /* 秒 微秒为单位 */

    double gpu_time;

    gettimeofday(&start, NULL);
    cl_int retval = clEnqueueNDRangeKernel();
    gettimeofday(&end, NULL);


    gpu_time = (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) * 1e-6;

    printf("GPU use time is1: %.8f s\n", gpu_time);

```







### 算运行时间，并打印出开始 结束时间

```c++
    struct timeval start, end;        /* 秒 微秒为单位 */
    struct tm *tm_start, *tm_end;  /* 时分秒信息 */                                                                                                                                                                

    double gpu_time;

    gettimeofday(&start, NULL);
    tm_start = localtime(&start.tv_sec);

    printf("clEnqueueNDRangeKernel start time:%d:%d:%d.%ld  us\n",
            tm_start->tm_hour, tm_start->tm_min, tm_start->tm_sec, start.tv_usec);
    cl_int retval = clEnqueueNDRangeKernel(qq, handle, (cl_uint)dims,
                                           NULL, globalsize, localsize, 0, 0,
                                           (sync && !timeNS) ? 0 : &asyncEvent);
    gettimeofday(&end, NULL);
    tm_end = localtime(&end.tv_sec);

    gpu_time = (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) * 1e-6;
    printf("clEnqueueNDRangeKernel end time:%d:%d:%d.%ld  us\n", tm_end->tm_hour, tm_end->tm_min, tm_end->tm_sec, end.tv_usec);
    printf("GPU use time is1: %.8f s\n", gpu_time);

```

