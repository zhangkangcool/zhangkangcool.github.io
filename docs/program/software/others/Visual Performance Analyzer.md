<h1 align="center">Visual Performance Analyzer</h1>
Visual Performance Analyzer(VPA)

Download: https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/W5be7727ab90c_4453_b240_01bb7c1df49d/page/Performance%20Tools%20Release

https://ctweb.torolab.ibm.com/wiki/index.php/Prepare_testcase_for_P9_M1_perf_test

https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/Wf6305d6e6a03_468d_9aea_5b6b54446a50/page/Run%20Performance%20Test%20on%20M1



Jviewer



## Run Performance Test on M1

The Mambo (Functional simulator, qtrace generator) and M1 (Performance simulator) simulation env have been set up on recycler.

Mambo :

```shell
 P9: /opt/systemsim-p9-release
P10: /opt/systemsim-p10-release
```

M1:

```shell
 P9: /opt/m1-p9/
P10: /opt/m1-p10/
```



You can use these simulators directly if you want. But please don't try to run long trace (eg: SPEC!) on recycler! 

 

If you would like to run some simple test, you can use Jinsong's script on `recycler`.

1. refer to how to prepare the testcase and how to link it in <https://ctweb.torolab.ibm.com/wiki/index.php/Prepare_testcase_for_P9_M1_perf_test> first.

2. source the setup here: `source /opt/sim_env.cfg` 

3. run **run_bare_metal_sim.pl**

 `run_bare_metal_sim.pl -10 -f ./a.out`

If you want run it on the real machine, you should not using `-8` or `-10`.

```shell
$ run_bare_metal_sim.pl 
Usage: /home/jji/Mambo_M1/Mambo_M1_barmetal_sim_scripts/run_bare_metal_sim.pl
​        -d <string>, optional, directory to run
​        -f <string>, optional, binary to run
​        -o <string>, optional, output filename, default is timestamp.csv
​        -q , optional, generate qtrace only
​        -m , optional, use the qtrace directly (run M1 only)
​        -s , optional, run scrollpv to ASCII
​        -n , optional, don't generate pipe file
​        -8 , optional, run P8 mambo/M1 instead
​        -10 , optional, run P10 mambo/M1 instead
​        -p9mambo , optional, run P9 mambo for P10, when -10 is used instead
​        -p , optional, PATH to Mambo installation, default is using ENV setting
​        -i , optional, show instruction when simulating with Mambo
​        -r , optional, show register when simulating with Mambo
​        -x , optional, show memory reference when simulating with Mambo
​        -a , optional, analyze the report only
​        -v , optional, verbose print commands
```



### Results

- You can find the CPI/INST/TIME in output csv file. eg:

```
Directory, Filename, CPI, INST, TIME
lhs/test, lhs_test1a.qt.bz2, 0.47159, 11561, 5452
```

- You can get the detail M1 report and pipe file in *.qt.bz2.results in your binary dir.



# Prepare testcase for M1 perf test

(Redirected from [Prepare testcase for P9 M1 perf test](https://ctweb.torolab.ibm.com/wiki/index.php?title=Prepare_testcase_for_P9_M1_perf_test&redirect=no))



## Guidelines

-  No system call  
  -  No getenv/setenv etc 
  -  No cout/printf etc 
  -  No malloc/free, unless you write your own library that don't use any system call. 
    -  Use static array if you can. 
-  No runtime dependency 
-  No too many iterations. 



## Simple steps 

-  Define special nops for mambo 

```python
#define mambo_warm_trace() asm volatile("or 13,13,13")
#define mambo_start_trace() asm volatile("or 14,14,14")
#define mambo_stop_trace() asm volatile("or 15,15,15")
```

-  Point out where you want to collect the trace with special nops 
  - call mambo_warm_trace(); at the beginning of your test. eg: in main . 
  - call mambo_start_trace; where the interested part is. eg: at the beginning of Run(). 
  - call mambo_stop_trace; where the interested part ends. eg: at the end of Run(). 
-  Static link with nocrt. 
  -  Add "-e main -qnocrt -static -L/opt/at11.0/lib64/ " to your normal xl link options 
  -  Add "-Xlinker -emain -nostartfiles -static " to your normal clang link options 



cat main.c

```cpp
#define mambo_warm_trace() asm volatile("or 13,13,13")
#define mambo_start_trace() asm volatile("or 14,14,14")
#define mambo_stop_trace() asm volatile("or 15,15,15")

struct parm {
  int *arr;
  int m;
  int n;
};
void foo(struct parm*);
int main() {
  int a[5000];
  struct parm arg = {a, 1000, 5};pkl     nlkm  mambo_warm_trace();
  mambo_start_trace();
  foo(&arg);
  mambo_stop_trace();
  return 0;
}
```



cat foo.c

```c
struct parm {
  int *arr;
  int m;
  int n;
};
void foo(struct parm *arg) {
//  m--;
//  n--;
  struct parm localArg = *arg;
  int m = localArg.m;
  int *s = localArg.arr;
  int n = localArg.n;
  do{
    int k = n;
//    n--;
//    k--;
    do{
      s[++k] = k++;
      s[k++] = k;
      s[k++] = k;
      s[k] = k;
      s[--k] = k--;
      s[k--] = k;
      s[--k] = k;
//      s[k++] = k--;
//      s[k++] = k--;
//      s[k-1]=k;
    }while(k--);
  } while(m--);

  s[n]=0;
}
```

cat t.ksh

```shell
mv t.dis t_old.dis
clang -c main.c -O0
#clang -c main.c -O
clang -S foo.c -O -fno-vectorize -mllvm -unroll-count=0
#clang -o t foo.s main.o -Xlinker -emain -nostartfiles -static
clang -o t main.o foo.s -Xlinker -emain -nostartfiles -static
#clang -o t foo.s main.o
#clang -o t main.o foo.s
objdump -dr t > t.dis
```





After you link the program by using `clang -Xlinker -emain -nostartfiles -static`, you must run it by using `run_bare_metal_sim.pl`, or you will get `segmentation fault`.

### Use the VPA to open the pipe file