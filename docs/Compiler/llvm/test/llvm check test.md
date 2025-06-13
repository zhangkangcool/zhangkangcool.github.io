<h1 align="center">llvm check test</h1>
http://llvm.org/docs/CommandGuide/FileCheck.html

http://llvm.org/docs/CommandGuide/lit.html

# make check

```shell
cd $llvm-build-dir
make check-all -j40   // run the test of llvm and clang
make check-llvm -j40  // run the test of llvm
```



#### ninja

```shell
无需cd build， -C选项就是切换到某个目标，这里是build目录
ninja -C build check-llvm-unit
ninja -C build check-llvm
ninja -C build check-all
```



# run the test suite

https://llvm.org/docs/TestSuiteMakefileGuide.html#running-the-test-suite-via-cmake
```shell
cd llvm
mkdir test-suite-build   // llvm/test-suite-build
svn co http://llvm.org/svn/llvm-project/test-suite/trunk test-suite
cd test-suite-build      // llvm/test-suite-build
mkdir test-suite-build   // llvm/test-suite-build/test-suite-build
```

run.sh
```shell
cd /home/ken/llvm/test-suite-build
rm -rf *

export CC=/home/ken/llvm/build/bin/clang
export CXX=/home/ken/llvm/build/bin/clang++
cmake ../test-suite
#cmake -DCMAKE_C_COMPILER=/home/ken/llvm_ppc/build/bin/clang -DCMAKE_CXX_COMPILER=/home/ken/llvm_ppc/build/bin/clang++ ../test-suite

make -k -j40
echo "RUNNING TEST-SUITE in `pwd`..."
llvm-lit -v -j 20 . > results.json 2>&1
grep 'FAIL' results.json
echo "PASS No:"
grep 'PASS' results.json | wc -l


```

# USE LIT & LNT to run the test suite
#### 1. download the test script of kit
```shell
git clone git@github.ibm.com:compiler/scripts.git 
```
```shell
./testllvm.sh --help
which: no lnt in (/home/ken/llvm/build/bin:/home/ken/llvm/build/bin:home/ken/software/graphviz-2.40.1/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/ken/.local/bin:/home/ken/bin)
Usage: testllvm.sh:
  --build Directory for the build. Default is /home/ken/llvm/build.
  --cc C compiler to use for the tests.  Default is /home/ken/llvm/build/bin/clang.
  --cxx C++ compiler to use for the tests.  Default is /home/ken/llvm/build/bin/clang++.
  --lit Enable LIT tests. Default is 1.
  --lit-results Path to put output from LIT run.  Defult is .
  --lnt Enable LNT tests. Default is 1.
  --lnt-build-width Number of threads to use when building LNT tests.
  --lnt-num-runs Number of times to run LNT tests.
  --lnt-path Location of lnt. Default is
  --lnt-results Path to put output from LNT run.  Default is .
  --lnt-run-width Number of threads to use when running LNT tests.
  --log Directory to save log files. Default is /home/ken/llvm/log.
  -h|--help Print this message and exit.
  --ninja Use ninja to build Clang/LLVM.
  --no-lit Disable LIT tests.
  --no-lnt Disable LNT tests.
  --test-suite Path to LLVM Test Suite. Default is /home/ken/llvm/test-suite.
  --width Number of processors to use when running tests.  Default is 20.
```
Some important options, you should check whether the default value is right.
```shell
  --test-suite Path to LLVM Test Suite. Default is /home/ken/llvm/test-suite.
```
# Install LNT tool
```shell
http://llvm.org/docs/lnt/quickstart.html
```
- You should install the python virutal env tool virtualenv
```shell
sudo easy_install virtualenv
```
On e1v, it has been installed.

- Create a new virtual environment for the LNT application
```shell
virtualenv ~/mysandbox
```

- Checkout the LNT sources
```shell
svn co http://llvm.org/svn/llvm-project/lnt/trunk ~/lnt
```

- Install LNT into the virtual environment:
```shell
~/mysandbox/bin/python ~/lnt/setup.py develop
```

After that, you will find the virtual env python, lit, lnt has installed in `/home/ken/mysandbox/bin`.

#### Download the test-suite code
```shell
svn co http://llvm.org/svn/llvm-project/test-suite/trunk ~/llvm-test-suite
```

#### Run the test-suite
- Set the virtual lnt env
```shell
source ~/mysandbox/bin/activate
```

- If you want delete the virtual env
```shell
source ~/mysandbox/bin/deactivate
```

- Before you run the test, you should check the default value, or you should modify it by usikng the option, below is my command line:

#### Notice the build must be set the llvm build directory. 
```shell
./testllvm.sh --test-suite=/home/shkzhang/llvm_cdl/llvm-test-suite --cc=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang --cxx=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++
```


```shell
cd /home/ken/llvm_test/kit_shell/scripts
./testllvm.sh --test-suite=/home/ken/llvm_cdl/llvm-test-suite
./testllvm.sh --test-suite=~/llvm_cdl/llvm-test-suite
*********************************************************************
*                           Configuration                           *
*********************************************************************
* Build Directory: /home/ken/llvm/build
* C Compiler: /home/ken/llvm/build/bin/clang
* CXX Compiler: /home/ken/llvm/build/bin/clang++
* LIT Log file: /home/ken/llvm/log/lit-2018-09-13_23-38-06.out
* LIT Build Command: make
* LNT Build Threads:
* LNT Run Threads:
* LNT Number of runs:
* LNT Path: /home/ken/mysandbox/bin/lnt
* LNT Log file: /home/ken/llvm/log/test-2018-09-13_23-38-06.out
* Test LIT: 1
* Test LNT: 1
* Test Suite: /home/ken/llvm_cdl/llvm-test-suite
* Width: 20
*********************************************************************
Running LNT tests
There are 6 failures in projects/test-suite.
Running unit tests
There are 0 failures in unit tests.

```

#### How to use the virtualenv, you can refer to below website.
```shell
https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001432712108300322c61f256c74803b43bfd65c6f8d0d0000
```
# FileCheck
https://llvm.org/docs/CommandGuide/FileCheck.html
### test on assembly `-verity-machineinstrs`
The test file will tell to how to run the test case
```shell
test/CodeGen/PowerPC/fsel.ll
; NOTE: Assertions have been autogenerated by utils/update_llc_test_checks.py
; RUN: llc -verify-machineinstrs < %s -mtriple=powerpc64le-unknown-unknown | FileCheck %s
```

```shell
llc -verify-machineinstrs < add.ll -mtriple=powerpc64le-unknown-unknown | FileCheck add.ll
```

### test on IR `-instcombine -S`
If the optimization is in the `opt` tool.
```shell
test/Transforms/InstCombine/select_meta.ll
; RUN: opt < %s -instcombine -S | FileCheck %s
```

### CHECK-DAG
`CHECK-DAG`之间是不管顺序的，但在非`CHECK-DAG`间必须管顺序
`BEFORE1`和`BEFORE2`间顺序可以换，但不能换到NOT之后。
```shell
; CHECK-DAG: BEFORE1
; CHECK-DAG: BEFORE2
; CHECK-NOT: NOT
; CHECK-DAG: AFTER1
; CHECK-DAG: AFTER2
```

下面的`CHECK-DAG`不能调度到`CHECK`之后。
```shell
; CHECK-DAG: add [[REG1:r[0-9]+]], r1, r2
; CHECK-DAG: add [[REG2:r[0-9]+]], r3, r4
; CHECK:     mul r5, [[REG1]], [[REG2]]
```

# How to write the test command line:
### 1. triple
This option is to the what object you want get. First your machine should support this target.

- For llvm IR case you `MUST ADD`: 
```shell
-mtriple=powerpc64le-unknown-linux-gnu -mcpu=pwr9
```
- For clang c case you `MUST ADD`:
```shell
-triple powerpc64le-unknown-linux-gnu -mcpu=pwr9
```

If you use `-mcpu ppc64`,  it equals `-mcpu ppc64be`, you'd better use `ppc64be`. If you want to use BE, you must use `ppc64le`.

### 2. REQUIRES

This is saied what target your machine should support. If your case is in PowerPC directory, it may has added `REQUIRES`. Or you must add this `REQUIRES`.
```shell
// REQUIRES: powerpc-registered-target
```

Maybe you need add`REQUIRES: asserts` 

### Error: Forget add REQUIRES

Your PC is `the X86 mac, and you build the compiler with target X86`. Your add `-triple powerpc64le-unknown-linux-gnu` for your test case and the case is not in PowerPC directory. 
It will give your an error when you built it. Because you compiler can't get the asm whose target is powerpc. You should add `REQUIRES` for this case. So the compiler know it doesn't support this target, so it will give you an UNSUPPORTED for this case.

- X86 machine未编PPC target compiler,无REQUIERS，但指定triple，会使compiler吐ppc asm而错误
- PPC machine上编X86 targe compiler，但case无REQUIRES,指定triple为ppc。

### Error: Forget add triple

- X86 machine 使用PPC target compiler,有REQUIRES，但未使用triple，会使compiler吐出非PPC asm错误（compiler不知该吐出何种汇编，如compiler支持吐出多种汇编,default与triple不同的情况，如本机支持吐出X86与PPC，默认是X86，而需要CHECK PPC ASM）。

# make check-all -j

If you get the python error, you should modify below file to remove the clang test. `clang/CMakefile.txt`

```makefile
-if( CLANG_INCLUDE_TESTS )
-  if(EXISTS ${LLVM_MAIN_SRC_DIR}/utils/unittest/googletest/include/gtest/gtest.h)
-    add_subdirectory(unittests)
-    list(APPEND CLANG_TEST_DEPS ClangUnitTests)
-    list(APPEND CLANG_TEST_PARAMS
-      clang_unit_site_config=${CMAKE_CURRENT_BINARY_DIR}/test/Unit/lit.site.cfg
-      )
-  endif()
-  add_subdirectory(test)
-  add_subdirectory(bindings/python/tests)
-
-  if(CLANG_BUILT_STANDALONE)
-    # Add a global check rule now that all subdirectories have been traversed
-    # and we know the total set of lit testsuites.
-    get_property(LLVM_LIT_TESTSUITES GLOBAL PROPERTY LLVM_LIT_TESTSUITES)
-    get_property(LLVM_LIT_PARAMS GLOBAL PROPERTY LLVM_LIT_PARAMS)
-    get_property(LLVM_LIT_DEPENDS GLOBAL PROPERTY LLVM_LIT_DEPENDS)
-    get_property(LLVM_LIT_EXTRA_ARGS GLOBAL PROPERTY LLVM_LIT_EXTRA_ARGS)
-    get_property(LLVM_ADDITIONAL_TEST_TARGETS
-                 GLOBAL PROPERTY LLVM_ADDITIONAL_TEST_TARGETS)
-    add_lit_target(check-all
-      "Running all regression tests"
-      ${LLVM_LIT_TESTSUITES}
-      PARAMS ${LLVM_LIT_PARAMS}
-      DEPENDS ${LLVM_LIT_DEPENDS} ${LLVM_ADDITIONAL_TEST_TARGETS}
-      ARGS ${LLVM_LIT_EXTRA_ARGS}
-      )
-  endif()
-  add_subdirectory(utils/perf-training)
-endif()
-
```



# LIT run the single case

```asm
 llvm-lit ~/llvm/llvm/test/CodeGen/PowerPC/sms-iterator.ll -a
-- Testing: 1 tests, single process --
XFAIL: LLVM :: CodeGen/PowerPC/sms-iterator.ll (1 of 1)
Script:
--
: 'RUN: at line 2';   /home/ken/llvm/build/bin/llc < /home/ken/llvm/llvm/test/CodeGen/PowerPC/sms-iterator.ll -mtriple=powerpc64le-unknown-linux-gnu -verify-machineinstrs       -mcpu=pwr9 --ppc-enable-pipeliner -debug-only=pipeliner 2>&1        >/dev/null | /home/ken/llvm/build/bin/FileCheck /home/ken/llvm/llvm/test/CodeGen/PowerPC/sms-iterator.ll
--
Exit Code: 1

Command Output (stderr):
--
/home/ken/llvm/llvm/test/CodeGen/PowerPC/sms-iterator.ll:12:10: error: CHECK: expected string not found in input
; CHECK: MII = 8 MAX_II = 18
         ^
<stdin>:1:1: note: scanning from here
ExitSU: BDNZ8 %bb.2, implicit-def dead $ctr8, implicit $ctr8
^
<stdin>:10:1: note: possible intended match here
MII = 1 MAX_II = 11 (rec=0, res=1)
^

--

********************
Testing Time: 0.07s
  Expected Failures  : 1
```

- `-a` 输出所使用的命令行等各种信息。





```asm
This new patch will do below optimization in the end of block-placement pass:
​```
bb.1:
  B %bb.11

bb.2:
  renamable $x3 = LI8 1
  BLR8 implicit $lr8, implicit $rm, implicit killed $x3
​```

​```
bb.1:
  renamable $x3 = LI8 1
  BLR8 implicit $lr8, implicit $rm, implicit killed $x3 
​```

Above pattern will may be created in `block-placement` pass which is after the `tail duplication` pass.
```



# Get the error command

下述脚本中加`set -x`

`~/llvm/log/test-2019-07-17_17-04-03/test.log`

```shell
/home/ken/llvm_cdl/llvm-test-suite/RunSafely.sh 
```





```shell
[shkzhang@recycler:~/llvm/testlog/test-2020-08-03_09-39-41/MultiSource/Benchmarks]$ find . -name link.txt | grep gs
./mediabench/gsm/toast/CMakeFiles/toast.dir/link.txt

/usr/bin/make  -f MultiSource/Benchmarks/MallocBench/gs/CMakeFiles/gs.dir/build.make MultiSource/Benchmarks/MallocBench/gs/CMakeFiles/gs.dir/build


[shkzhang@recycler:~/llvm/testlog/test-2020-08-04_06-01-37]$ /usr/bin/make  -f MultiSource/Benchmarks/MallocBench/gs/CMakeFiles/gs.dir/build.make MultiSource/Benchmarks/MallocBench/gs/CMakeFiles/gs.dir/build
```

