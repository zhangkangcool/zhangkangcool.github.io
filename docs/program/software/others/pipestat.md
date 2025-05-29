# How to use pipestat 

https://ltc3.linux.ibm.com/wiki/LoP_Toolchain/howto/valgrind-itrace



# pipestat manual(recycler)

/opt/ibm/pipestat/pkg/doc/pipestat.pdf



### 2019_P10workshop_pipestat.pdf

https://ibm.ent.box.com/file/458693881230





## 1. Genearte itrace(get the vgi file)

If your case is c++, you must use `--demangle=no`

`num-K-insns-to-collect=10`, it will spend 10 mins.

```shell
/opt/at12.0/bin/valgrind --demangle=no  --num-K-insns-to-collect=10 --tool=itrace --trace-extent=function --fn-start=_ZN7Playout3runER9FastStateb --binary-outfile=valgrind.diffmail.vgi  numactl --localalloc --physcpubind=0 ../run_peak_refrate_clang_default.0000/leela_r_peak.clang_default ref.sgf

/opt/at12.0/bin/valgrind --demangle=no  --num-K-insns-to-collect=10 --tool=itrace --trace-extent=function --fn-start=_ZN7Playout3runER9FastStateb --binary-outfile=valgrind.diffmail.vgi [the cmd to execute the program]


/opt/at12.0/bin/valgrind --demangle=no  --num-K-insns-to-collect=10 --tool=itrace --trace-extent=function --fn-start=_ZN7Playout3runER9FastStateb --binary-outfile=valgrind.diffmail.vgi  ../run_peak_refrate_clang_default.0000/leela_r_peak.clang_default ref.sgf
```



```
If anyone has issues on using valgrind itrace to collect traces, please try using the valgrind from at13.0 /opt/at13.0/bin/valgrind.
In my case, my command
 valgrind --tool=itrace --fnname=foo --trace-extent=function --trace-children=yes --demangle=no --num-K-insns-to-collect=1000 ./a.out
fails to collect traces by using valgrind from at12.0 (no trace collected), but it works by using the at13.0 valgrind.
```





1 mins

```shell
/home/shkzhang/spec_clang_result_0531_pipestat/benchspec/CPU/541.leela_r/run/run_peak_refrate_clang_default.0000

/opt/at12.0/bin/valgrind --demangle=no  --num-K-insns-to-collect=1000 --tool=itrace --trace-extent=function --fn-start=_ZN7Playout3runER9FastStateb --binary-outfile=valgrind.diffmail.vgi  ../run_peak_refrate_clang_default.0000/leela_r_peak.clang_default ref.sgf
```





```shell
/opt/at12.0/bin/valgrind --demangle=no  --num-K-insns-to-collect=10 --tool=itrace --trace-extent=function --fn-start=__ZN7Playout3runER9FastStateb --binary-outfile=valgrind.diffmail.FastStateb.vgi  ../run_peak_refrate_clang_default.0000/leela_r_peak.clang_default ref.sgf


/opt/at12.0/bin/vgi2qt -f valgrind.diffmail.FastStateb.vgi -o trace.FastStateb.qt

// 5 mins
/opt/ibm/pipestat/pkg/bin/pipestat  -v  trace.FastStateb.qt -o log.FastStateb
```





2 mins

```shell
/opt/at12.0/bin/valgrind --demangle=no  --num-K-insns-to-collect=100000 --tool=itrace --trace-extent=function --fn-start=_ZN9FastBoard17update_board_fastEii --binary-outfile=valgrind.diffmail.update_board_fastEii.vgi  ../run_peak_refrate_clang_default.0000/leela_r_peak.clang_default ref.sgf


/opt/at12.0/bin/vgi2qt -f valgrind.diffmail.update_board_fastEii.vgi -o trace.update_board_fastEii.qt

// 5 mins

/opt/ibm/pipestat/pkg/bin/pipestat  -v  trace.update_board_fastEii.qt -o log.update_board_fastEii
```



---------

## 2. itrace —> qtrace

```shell
/opt/at12.0/bin/vgi2qt -f valgrind.diffmail.vgi -o trace.zeson.qt
```

--------

## 3 trace-grained(recycler has the tool)

### 3.1 no cycler

```shell
/opt/ibm/pipestat/pkg/bin/pipestat  -v  trace.zeson.qt -o log.zeson
```



### 3.2 have cycle(detail)

The less instruction, we can get the less pipe file. `10000` will get 5M pipe file.

```shell
## get the output_pipe.pipe file, if the file is very huge, the VPA cann't open it
/opt/m1-p9/run_timer trace.zeson.qt 1000000000 10000 0  output_pipe -d_prefetch 1 -scroll_pipe 1 -scroll_begin 0 -scroll_end 1000000000

## get the detail file
/opt/ibm/pipestat/pkg/bin/pipestat  -v output.pipe -o output_pipe.detail



# About 3 mins
# More suitable amount
/opt/m1-p9/run_timer trace.zeson.qt 1000000000 10000 0  output_pipe -d_prefetch 1 -scroll_pipe 1 -scroll_begin 0 -scroll_end 1000000000

```

![image-20190605163710552](assets/image-20190605163710552.png)



```shell
Collect the mount of insts. 
 arch inst 64007  time 74935.000000
 trace 0 completed arch 64007
 arch inst 65000  time 75975.000000
 trace 0 completed arch 65000
 arch inst 66007  time 77010.000000
```

