<h1 align="center">test suite</h1>


# How to debug the test suite error

You'd better remove `llvm/log` first.

### Log file

```shell
/home/ken/llvm/log/test-2019-06-19_13-19-56/test.log
```





`FAIL: test-suite :: SingleSource/UnitTests/SignlessTypes/cast-bug.test (467 of 543)`

You can get below log:

```shell
FAIL: test-suite :: SingleSource/UnitTests/SignlessTypes/cast-bug.test (467 of 543)
******************** TEST 'test-suite :: SingleSource/UnitTests/SignlessTypes/cast-bug.test' FAILED ********************

/home/shkzhang/llvm/log/test-2019-05-10_05-22-47/tools/timeit-target --limit-core 0 --limit-cpu 7200 --timeout 7200 --limit-file-size 104857600 --limit-rss-size 838860800 --append-exitstatus --redirect-output /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes/Output/cast-bug.test.out --redirect-input /dev/null --chdir /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes --summary /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes/Output/cast-bug.test.time /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes/cast-bug 31415926
cd /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes ; /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/tools/fpcmp /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes/Output/cast-bug.test.out cast-bug.reference_output
```



The error is `line 5`:

```shell
 /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/tools/fpcmp /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes/Output/cast-bug.test.out cast-bug.reference_output
```



Below is the build command:

```shell
/usr/bin/make -f SingleSource/UnitTests/SignlessTypes/CMakeFiles/div.dir/build.make SingleSource/UnitTests/SignlessTypes/CMakeFiles/div.dir/depend
[ 88%] Building C object SingleSource/UnitTests/SignlessTypes/CMakeFiles/cast-bug.dir/cast-bug.c.o
cd /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes && /home/shkzhang/llvm/log/test-2019-05-10_05-22-47/tools/timeit --summary CMakeFiles/cast-bug.dir/cast-bug.c.o.time /home/shkzhang/llvm/build/bin/clang -DNDEBUG  -O3 -DNDEBUG   -w -Werror=date-time -o CMakeFiles/cast-bug.dir/cast-bug.c.o   -c /home/shkzhang/llvm_cdl/llvm-test-suite/SingleSource/UnitTests/SignlessTypes/cast-bug.c
```



The log file is in:

```shell
/home/shkzhang/llvm/log/test-2019-05-10_05-22-47/SingleSource/UnitTests/SignlessTypes/CMakeFiles/cast-bug.dir
```





If the test is right, you want to get the log, you can modify

```shell
/home/ken/llvm_cdl/llvm-test-suite/./SingleSource/UnitTests/SignlessTypes/cast-bug.reference_output
```



Add `set -x` in `/home/ken/llvm_cdl/llvm-test-suite/DiffOutput.sh`.

可能出错代码处加`assert`，定位出错的文件，然后单独编译此文件。 

```shell

/home/ken/llvm_cdl/llvm-test-suite/HashProgramOutput.sh Output/ldecod.simple-hash
/home/ken/llvm_cdl/llvm-test-suite/DiffOutput.sh "/home/ken/llvm/log/test-2019-06-20_06-21-44/tools/fpcmp " simple ldecod
******************** TEST (simple) 'ldecod' FAILED! ********************
Execution Context Diff:
/home/ken/llvm/log/test-2019-06-20_06-21-44/tools/fpcmp: files differ without tolerance allowance
******************** TEST (simple) 'ldecod' ****************************
/home/ken/llvm_cdl/llvm-test-suite/RunSafely.sh --show-errors -t "/home/ken/llvm/log/test-2019-06-20_06-21-44/tools/timeit" 500 /dev/null Output/rawdaudio.llvm.o.compile \
  /home/ken/llvm/build/bin/clang -I/home/ken/llvm/log/test-2019-06-20_06-21-44/MultiSource/Benchmarks/mediabench/adpcm/rawdaudio -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/mediabench/adpcm/rawdaudio -I/home/ken/llvm_cdl/llvm-test-suite/include -I../../../../../include -D_GNU_SOURCE -D__STDC_LIMIT_MACROS -DNDEBUG  -O3  -ffp-contract=off -fomit-frame-pointer -c /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/mediabench/adpcm/rawdaudio/rawdaudio.c -o Output/rawdaudio.llvm.o
rm -f Output/ldecod.exe-simple
```

```shell
/home/ken/llvm/log/test-2019-06-20_08-42-10/MultiSource/Applications/JM/ldecod/Output

grep -r "exit"
The file return not 0 is error

cd /home/ken/llvm/log/test-2019-06-20_08-42-10/MultiSource/Applications/JM/ldecod/Output
 /home/ken/llvm/build/bin/clang -D __USE_LARGEFILE64 -D _FILE_OFFSET_BITS=64 -I/home/ken/llvm/log/test-2019-06-20_08-42-10/MultiSource/Applications/JM/lencod -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Applications/JM/lencod -I/home/ken/llvm_cdl/llvm-test-suite/include -I../../../../include -D_GNU_SOURCE -D__STDC_LIMIT_MACROS -DNDEBUG  -O3  -ffp-contract=off -fomit-frame-pointer -c /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Applications/JM/lencod/loopFilter.c -o Output/loopFilter.llvm.o
 
```


可在代码中标志输出，然后在所有的log中grep

```shell
12440       dbgs() << __LINE__ << "zhangkang_num*****************\n";
12441       LHS.dump();
12442       RHS.dump();
12443       N->dump();
12444       dbgs() << __LINE__ << "*****************\n";

cd /home/ken/llvm/log/test-2019-06-24_06-01-49
grep -r "zhangkang"

结合 test-2019-06-24_02-01-49.out 中出错的case，很容易定位到是哪个文件出现了不理想的结果。因为每个文件的编译输出都会输出到文件。
```



Open `./MultiSource/Benchmarks/MallocBench/cfrac/Output/atop.llvm.o.compile` we can get the building file `./MultiSource/Benchmarks/MallocBench/cfrac/Output/atop.c`. Then, we can search the test.log to get the cmd to build file

```shell
./MultiSource/Benchmarks/MallocBench/cfrac/Output/atop.llvm.o.compile:clang-9: /home/ken/llvm/llvm/lib/Target/PowerPC/PPCISelLowering.cpp:12397: llvm::SDValue llvm::PPCTargetLowering::combineSetCC(llvm::SDNode*, llvm::TargetLowering::DAGCombinerInfo&) const: Assertion `"zhangkang find a case" && false' failed.
```

