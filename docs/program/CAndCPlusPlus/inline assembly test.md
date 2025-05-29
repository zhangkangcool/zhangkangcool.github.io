# 1 How to write the inline assembly test program
https://github.ibm.com/cdl-compiler/llvm/issues/36 

### 1.1 The regsiter is allocation by compiler
- Below program can build by xlc or clang.
```C
#include <time.h>
#include <sys/time.h>
#include <stdio.h>
long long N = (1UL << 30);
#define MILLION 1000000

int main() {
  long long i = 0;
  struct timeval tpstart;
  struct timeval tpend;
  long long timedif;
  long long a = 0, b = 0, ret = 0;
  gettimeofday(&tpstart,NULL);
  for(; i < N; ++i) {

// XLC can also be ok.
// below is used in llvm/clang
     asm("add     %0,%1,%0 \n\t"
         "subfc   %1,%1,%0 \n\t"
         "subfe   %1,%0,%0 \n\t"
         "subf    %0,%1,%0     "
         : "+r"(a), "+r"(b), "+r"(ret)
            );
  }
  gettimeofday(&tpend,NULL);
  timedif = (tpend.tv_sec - tpstart.tv_sec) * MILLION + (tpend.tv_usec - tpstart.tv_usec);
  printf("%lld us\n", timedif);

  return 0;
}

```
The instructions may be scheduled, and there will be more created more load and store instruction.

### 1.2 The register is allocation by the inline instruction
```C
#include <time.h>
#include <sys/time.h>
#include <stdio.h>
long long N = (1UL << 35);
#define MILLION 1000000
int main() {
  long long i = 0;
  struct timeval tpstart;
  struct timeval tpend;
  long long timedif;
  long long a = 0, b = 0, ret = 0;
  gettimeofday(&tpstart,NULL);
  for(; i < N; ++i) {
// below is used in xlc
  __asm__("addc 5, 4, 3 \t\n"
          "adde 3, 4, 3 \t\n"
         );


  }
  gettimeofday(&tpend,NULL);
  timedif = (tpend.tv_sec - tpstart.tv_sec) * MILLION + (tpend.tv_usec - tpstart.tv_usec);
  printf("%lld us\n", timedif);

  return 0;
}

```

### 1.3 assignment the value to register and get the return value
```c
#include <time.h>
#include <sys/time.h>
#include <stdio.h>

int main() {

  long long a = 2, b = 3, ret = 0;
  asm("add     %2,%1,%0"
         : "+r"(a), "+r"(b), "+r"(ret)
            );

  printf("ret = %lld\n", ret);

  return 0;
}
```
`%0` the first variable.
`%1` the second variable.
`%2` the third variable.

### 1.4 clang test.cpp -m64

```C
#include <stdio.h>

#define MILLION 1000000
int main() {
  long long a = 0x1234567887654321;
  __asm__("li %0, -100 \t\n": "+r"(a)
         );

  printf("a = %llx\n", a);
  printf("a = %lld\n", a);


  long long b = 0x1234567887654321;
  __asm__("li %0, 0 \t\n"
          "ori %0, %0, 65436"
         : "+r"(b)
  );
  printf("b = %llx\n", b);
  printf("b = %lld\n", b);
  return 0;
}
```

# 2 Bind the cpu to run the test program
### 2.1 See the cpu information
```shell
cat /proc/cpuinfo
lscpu
```


### 2.2 Bind the cpu
https://blog.csdn.net/xluren/article/details/43202201 
```shell
taskset -c 21 ./a.out
```

