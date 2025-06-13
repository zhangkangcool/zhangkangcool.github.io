<h1 align="center">diff github</h1>
# Compare output of WYC and XLC

#### The old shell script & result is in the branch `shell_script`.

-----

# 1 The result info

## 1.1 result_inst_num

This dir contains the log files and c files.

For example:

```shell
ls result_inst_num/CodeGen
cfiles/  log/
```

The result_inst_num result is get by using the `comparators/compare_num_inst_ops`.



## 1.2 Log files

Every log dir has 6 log files, for example `result_inst_num/Transforms/log/ADCE`:

```shell
ls result_inst_num/Transforms/log/ADCE
compare.error.log  compare.log  generate_c.error.log  generate_c.log  merge_result.error.log  merge_result.log
```

- generate_c.error.log: The err  info how we transfer ll:func file to the hash.c., you needn't care about it.

- compare.error.log: The err info when comparing the xlc dis with wyc dis. , you needn't care about it.

- merge_result.error.log:  The err info when merge generate_c.log and comapre.log , you needn't care about it.



- generate_c.log: The info how we transfer ll:func file to the hash.c. Below is an example:

  ```shell
  /home/ken/llvm/llvm/test/Transforms/ADCE/2002-05-28-Crash-distilled.ll:test -> /home/ken/diff_clang_xl/result_inst_num/Transforms/cfiles/ADCE/26924449f5e59c9aeb6e82bf2bf452a1f59e05d5.c
  ```



- compare.log: The info when comparing the xlc dis with wyc dis. The log only records the wyc worse case. Below is an example:

  ```shell
  /home/ken/diff_clang_xl/result_inst_num/Transforms/cfiles/ADCE/26924449f5e59c9aeb6e82bf2bf452a1f59e05d5.c: wyc worse  WYC: /xl_le/compgpfs/builds/rings/ppc64le/rhel7/wyvern.dev.release/ring.good/latest/bin/clang -O2 -Ofast -mcpu=pwr9 -c /home/ken/diff_clang_xl/result_inst_num/Transforms/cfiles/ADCE/26924449f5e59c9aeb6e82bf2bf452a1f59e05d5.c -o /tmp/tmppfok7e_o
  XLC: /xl_le/gsa/tlbgsa/projects/x/xlcmpbld/run/clangtana/16.1.1/linux_leppc/daily/latest/bin/xlc -O2 -Ofast -mcpu=pwr9 -c /home/ken/diff_clang_xl/result_inst_num/Transforms/cfiles/ADCE/26924449f5e59c9aeb6e82bf2bf452a1f59e05d5.c -o /tmp/tmptydskg1k
  WYC has 6 instructions, XLC has 5 instructions.
  WYC has more 1 instructions than XLC(20.00%).
  ```



- merge_result.log:  The info when merge generate_c.log and comapre.log , you don't care about it.

  Above case, we will get:

  ```shell
  /home/ken/llvm/llvm/test/Transforms/ADCE/2002-05-28-Crash-distilled.ll:test: wyc worse
  WYC has 6 instructions, XLC has 5 instructions.
  WYC has more 1 instructions than XLC(20.00%).
  ```

Then, you can use the `reprodece` script to reproduce the issue.



----------------

# 2 Scripts

## 2.1 reproduce(important)

```shell
usage: reproduce [-h] --ir_filename IR_FILENAME --func FUNC --out OUT
                 --custom_compare CUSTOM_COMPARE --compare COMPARE

Generate the C file and reproduce the compare

optional arguments:
  -h, --help            show this help message and exit
  --ir_filename IR_FILENAME
                        The IR filename
  --func FUNC           The func to be tested in the ir_filename
  --out OUT             Output directory
  --custom_compare CUSTOM_COMPARE
                        Script to compare output assembly of wyc and xlc
  --compare COMPARE     Script to use the C file
```

This file can using the ll file and func name to extract the ll file, and get the c file, and assembly file.



For example, in 1.2 you have seen below log:

```shell
/home/ken/llvm/llvm/test/Transforms/ADCE/2002-05-28-Crash-distilled.ll:test: wyc worse
WYC has 6 instructions, XLC has 5 instructions.
WYC has more 1 instructions than XLC(20.00%).
```

You will use below command to get the ll file, c file, assemlby file for the case: `2002-05-28-Crash-distilled.ll:test`.

```shell
/home/ken/diff_clang_xl/scripts/reproduce --ir_filename /home/ken/llvm/llvm/test/Transforms/ADCE/2002-05-28-Crash-distilled.ll --func test --out result/

The result is in result/test
./test/test.bc
./test/test.ll
./test/test.c
./test/test_compare.log
```



In the cureent result dir, you will get:

```shell
ls test/
test.bc  test.c  test_compare.log  test.ll  wyc.out  xlc.out
```



## 2.2 generate_c

```shell
usage: generate_c [-h] [-j J] -i I --out OUT [-m M] [--report_error]

Generate c code via LLVM C Backend

optional arguments:
  -h, --help      show this help message and exit
  -j J            Number of threads
  -i I            Input directory to search bitcode and IR files
  --out OUT       Output directory
  -m M            Output manifest filename
  --report_error
```



This script is used to generate c code from LLVM IR via `llvm-cbe`.

For example, I can use below command to get the c files for `Transforms/ADCE`.

```shell
~/diff_clang_xl/scripts/generate_c -j 64 -i ~diff_clang_xl/test/Transforms/ADCE --out ~/diff_clang_xl/result_inst_num/Transforms/cfiles/ADCE -m ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/generate_c.log > ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/generate_c.error.log 2>&1
```



## 2.3 compare

```shell
usage: compare [-h] [-j J] -i I [-m M] [--report_error] --custom_compare
               CUSTOM_COMPARE [--filter_worse FILTER_WORSE]
               [--filter_better FILTER_BETTER] [--skip_wyc_won]

Compare wyc and xlc

optional arguments:
  -h, --help            show this help message and exit
  -j J                  Number of threads
  -i I                  Input directory to search c code files
  -m M                  Output manifest filename
  --report_error
  --custom_compare CUSTOM_COMPARE
                        Script to compare output assembly of wyc and xlc
  --filter_worse FILTER_WORSE
                        Directory to contain cases wyc get worse result
  --filter_better FILTER_BETTER
                        Directory to contain cases wyc get better result
  --skip_wyc_won
```

This script is used to compare the output assembly of wyc and xlc.

User should implement the `custom_compare` to define what output is good.

For example, I can use below command to get the compare result for `Transforms/ADCE`.

```
~/diff_clang_xl/scripts/compare --skip_wyc_won -i ~/diff_clang_xl/result_inst_num/Transforms/cfiles/ADCE --custom_compare ~/diff_clang_xl/scripts/comparators/compare_num_inst_ops -m ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/compare.log > ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/compare.error.log 2>&1
```



## 2.4 merge_result

```shell
usage: merge_result [-h] --generate_log GENERATE_LOG --compare_log COMPARE_LOG
                    [--output OUTPUT]

Merge the output of generate_c and compare

optional arguments:
  -h, --help            show this help message and exit
  --generate_log GENERATE_LOG
                        The log file of generate_c script
  --compare_log COMPARE_LOG
                        The log file of compare script
  --output OUTPUT       Output merge filename
```

This script is used to merge the output of generate_c and compare.

For example, I can use the generate_c.log in 2.1 and compare.log in 2.2 by using below command:

```shell
./merge_result --generate_log ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/generate_c.log --compare_log ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/compare.log  --output ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/merge_result.log > ~/diff_clang_xl/result_inst_num/Transforms/log/ADCE/merge_result.error.log 2>&1
```



## 2.5 comparators/

This dir contains the script how the xlc.dis compare with wyc.dis. If will be a parameter used by `compare --custom_compare`.



## 2.6 multi_dir/

```shell
ls multi_dir/
compare_multi_dir*  generate_multi_dir*  merge_result_multi_dir*
```

In general, you will not use the script. Above three script is a wrap for `compare`,  `generat`, and  `merge_result`.  But is can support multi dirs.

The `multi_dir` version script will search the dir which contains sub-dir, and then call `non-mul_dir` version script.



In fact, I get the result in `result_inst_num/Transforms` by using below command.

#### 1 Using  `generate_multi_dir` get the cfiles

 ```shell
./generate_multi_dir -i ~/llvm/llvm/test/Transforms --cfiles_out_dir /home/ken/diff_clang_xl/result_inst_num/Transforms/cfiles --log_out_dir /home/ken/diff_clang_xl/result_inst_num/Transforms/log --generate_c /home/ken/diff_clang_xl/scripts/generate_c -j 64
 ```



#### 2 Using  `compare_multi_dir` get the compare result

```shell
./compare_multi_dir -i /home/ken/diff_clang_xl/result_inst_num/Transforms/cfiles --custom_compare comparators/compare_num_inst_ops --log_out_dir /home/ken/diff_clang_xl/result_inst_num/Transforms/log --compare /home/ken/diff_clang_xl/scripts/compare --custom_compare comparators/compare_num_inst_ops -j64
```



#### 3 Using`merge_result_multi_dir` to merge the generate_multi_dir log and compare_multi_dir log

```shell
./merge_result_multi_dir --merge_result ~/diff_clang_xl/scripts/merge_result -i /home/ken/diff_clang_xl/result_inst_num/Transforms/log
```





------

# 3 How to mark the case

###  3.1 Use the pattern script to mark the case

Below command will add `has_cmpwi` in the end of the log line, if the script `has_cmpwi` return 0.

```shell
./mark_case --log_dirs /home/ken/diff_clang_xl/result_inst_num/tools/ --custom_pattern pattern/has_cmpwi --mark_info has_cmpwi
```



Below is the result after run above command:

```shell
git diff ../result_inst_num/tools/log/merge_result.log
diff --git a/result_inst_num/tools/log/merge_result.log b/result_inst_num/tools/log/merge_result.log
index 2b6ed6b..445aa8c 100644
--- a/result_inst_num/tools/log/merge_result.log
+++ b/result_inst_num/tools/log/merge_result.log
@@ -6,7 +6,7 @@ WYC has more 38 instructions than XLC(92.00%).
 WYC has 165 instructions, XLC has 44 instructions.
 WYC has more 121 instructions than XLC(275.00%).

-/home/ken/llvm/llvm/test/tools/gold/X86/opt-level.ll:bar: wyc worse
+/home/ken/llvm/llvm/test/tools/gold/X86/opt-level.ll:bar: wyc worse #has_cmpwi
 WYC has 5 instructions, XLC has 4 instructions.
 WYC has more 1 instructions than XLC(25.00%).
```





### 3.2 Manual

If you have anayze the case or open the issue for it, you should mark it to avoid others do the same work.



In the file`~/diff_clang_xl/result_inst_num/CodeGen/log/PowerPC/merge_result.log`, you can see below info:

```shell
2261 /home/ken/llvm/llvm/test/CodeGen/PowerPC/f128-vecExtractNconv.ll:uhwVecConv2qp5: wyc worse #142
2262 WYC has 34 instructions, XLC has 15 instructions.
2263 WYC has more 19 instructions than XLC(126.00%).
```



It shows that this case has been analyzed in the issue 142.