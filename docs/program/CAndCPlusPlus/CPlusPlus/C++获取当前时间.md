<h1 align="center">C++获取当前时间</h1>


### 1. 利用timeb得到毫秒

毫秒是整数

1970年以来的UTC时间

```c++

#include <time.h>
#include <sys/timeb.h>
#include <iostream>

int main() {
    long long time_last;
    time_last = time(NULL);

    struct timeb t1;
    ftime(&t1);
    time_t ttt= t1.millitm+t1.time*1000;
    std::cout << t1.time << "." << t1.millitm << std::endl;
    return 0;
}

// output: 1627010823.519

```





获得纳秒

```c++

#include <ctime>
#include <iostream>
#include <iomanip>
int main()
{
  struct timespec ts;
  clock_gettime(CLOCK_REALTIME,&ts);

  std::cout << ts.tv_sec * 1000000000 + ts.tv_nsec << std::endl;
  double seconds =  ts.tv_sec + (ts.tv_nsec / 1000000000.0);
  std::cout << std::setprecision(20) << seconds << std::endl;
  return 0;
}

```









# gettimeofday() 和 clock_gettime()函数 分析小结

https://zhuge.blog.csdn.net/article/details/109372643

  在上一篇文章《struct timeval 和 struct timespec 应用小结》我们分析了与linux系统时间相关的结构体定义，在linux系统C编程中，获取系统时间的api函数有两个，分别为：

int gettimeofday(struct timeval *tv, struct timezone *tz)

int clock_gettime(clockid_t, struct timespec *)
我们逐个分析：

1、gettimeofday()

     该函数把当前时间用 tv 结构体返回，当前时区的信息则放到tz所 指向的结构体。
    
      我们在使用该函数时，第2个参数一般为空（NULL），因为 一般只需要获取当前时间， 而不用获取时区信息。
    
      注意：返回的当前时间tv.tv_sec 是从1970年1月1日0 点开始的 “秒”数。

2、clock_gettime()

    该函数是用于获取特定 时钟的时间，常用如下4种时钟：

CLOCK_REALTIME                  //系统当前时间，从1970年1.1日算起
CLOCK_MONOTONIC                 //系统的启动后运行时间，不能被设置
CLOCK_PROCESS_CPUTIME_ID        //本进程运行时间
CLOCK_THREAD_CPUTIME_ID         //本线程运行时间
  我们经常用到的是CLOCK_REALTIME和CLOCK_MONOTONIC，其中CLOCK_REALTIME 跟 gettimeofday 返回的秒是一致的，都是相对于1970年1月1日的秒数。

区别：

1、clock_gettime 相比 gettimeofday的精度更高一些，前者精度到 纳秒，而后者精度到微秒。

2、clock_gettime可以通过 时钟选项而 得到不同参考下的时间，而gettimeofday则只有一种用途（获取当前系统时间）。

常规应用下，使用gettimeofday 即可获取 当前系统时间，对精度要求高，而且有不同需求的，可以使用clock_gettime。
————————————————
版权声明：本文为CSDN博主「猪哥-嵌入式」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u012351051/article/details/109372643







https://www.cnblogs.com/zlshmily/p/10058427.html

https://blog.csdn.net/code_peak/article/details/118199854

#### 现在所有的时间都被统一到了`std::chrono`库



```c++

#include <chrono>
int main ()
{
  using namespace std::chrono;
  typedef duration<int,std::ratio<60*60*24>> days_type;
  time_point<system_clock,days_type> today = time_point_cast<days_type>(system_clock::now());
  std::cout << today.time_since_epoch().count() << " days since epoch" << std::endl;
  return 0;
}
```





```c++
#include <iostream>
#include <chrono>
// 获得1000 * 1000，也就是微秒
int main()
{
    typedef std::chrono::duration<long long, std::ratio<1, 1000 * 1000>> days_type;
        //now 表示当前时间到格林威治标准时间的天数
    std::chrono::time_point<std::chrono::system_clock, days_type> today = std::chrono::time_point_cast<days_type>(std::chrono::system_clock::now());
    //std::chrono::system_clock::time_point等效于time_point<std::chrono::system_clock>
    std::cout << today.time_since_epoch().count() << " ms since epoch" << std::endl;
    return 0;
}

```





```c++
#include <iostream>
#include <chrono>
#include <iomanip>

int main()
{
    typedef std::chrono::duration<long long, std::ratio<1, 1000 * 1000>> us_type;
        //now 表示当前时间到格林威治标准时间的天数
    std::chrono::time_point<std::chrono::system_clock, us_type> today = std::chrono::time_point_cast<us_type>(std::chrono::system_clock::now());
    //std::chrono::system_clock::time_point等效于time_point<std::chrono::system_clock>
    std::cout << std::setprecision(20) << today.time_since_epoch().count() / (1000.0 * 1000) << " us since epoch" << std::endl;
    return 0;
}

```

