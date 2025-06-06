<h1 align="center">Use scripts(often)</h1>
https://github.ibm.com/cdl-compiler/llvm/wiki/Use-script-to-build-&-test-llvm



# Note

1. If you are using `buildllvm.sh` to build the master, you should add `--community` option. Or the case `log.test` will be failed. Detail see the issue 6452.
2. Recofigure can use the option `--clobber` or `rm $LLVM_BUILD/CMakeCache.txt`, it will use `rm -rf *`.

# On recycler

Below command is for master build, I have add `--community`. If you want to build wyvern_dev, you should remove the `--community`.



## Build

Don't add `DLLVM_ENABLE_EXPENSIVE_CHECKS=ON`   ，or `ninja check-asan` will be failed



#### 编译llvm时，默认使用`--use-lld`，使用以下lld

`/home/shkzhang/llvm/build/bin/ld.lld`

clang test.c -v



#### The fist build

```shell
# Using the default compiler: /xl_le/gsa/tlbgsa/projects/w/wyvern-environment/compilers/ppc64le/linux_leppc/clang.10.0.0.rc2/bin/clang
# master use --community
/home/shkzhang/llvm_test_script/scripts/buildllvm.sh --community --clobber --src=/home/shkzhang/llvm/llvm  --log=/home/shkzhang/llvm/buildlog --ninja --install --width=80 --lit-list-results --cmake-variables=-DTSAN_TEST_DEFLAKE_THRESHOLD=200 --build=/home/shkzhang/llvm/build --cmake-variables=-DBUILD_SHARED_LIBS=ON --install-dir=/home/shkzhang/llvm/install --build-type=Release

# wyvern_dev
/home/shkzhang/llvm_test_script/scripts/buildllvm.sh --clobber --src=/home/shkzhang/llvm/llvm  --log=/home/shkzhang/llvm/buildlog --ninja --install --width=80 --lit-list-results --cmake-variables=-DTSAN_TEST_DEFLAKE_THRESHOLD=200 --build=/home/shkzhang/llvm/build --cmake-variables=-DBUILD_SHARED_LIBS=ON --install-dir=/home/shkzhang/llvm/install --build-type=Release
```

Some extra option:

```shell
--cmake-variables=-DLLVM_ENABLE_EXPENSIVE_CHECKS=ON
--cmake-variables=-DLLVM_TARGETS_TO_BUILD=PowerPC
```





#### The second build

```shell
ninja -j120  
```

-----------

## Test

```shell
# Run all lit and lnt master
/home/shkzhang/llvm_test_script/scripts/testllvm.sh --log=/home/shkzhang/llvm/testlog --test-suite-path=/home/shkzhang/llvm_test_script/llvm-test-suite --lit-path=/home/shkzhang/llvm/build/bin/llvm-lit --width=120  --lit --lnt=all  

# Run all lit and lnt wyvern
/home/shkzhang/llvm_test_script/scripts/testllvm.sh --log=/home/shkzhang/llvm/testlog --test-suite-path=/home/shkzhang/llvm_test_script/test-suite-wyvern --lit-path=/home/shkzhang/llvm/build/bin/llvm-lit --width=120  --lit --lnt=all 

# Run all lit and lnt, except IBM
/home/shkzhang/llvm_test_script/scripts/testllvm.sh --log=/home/shkzhang/llvm/testlog --test-suite-path=/home/shkzhang/llvm_test_script/llvm-test-suite --lit-path=/home/shkzhang/llvm/build/bin/llvm-lit --width=120  --lit --lnt  

# Only run lit
/home/shkzhang/llvm_test_script/scripts/testllvm.sh --log=/home/shkzhang/llvm/testlog --test-suite-path=/home/shkzhang/llvm_test_script/llvm-test-suite --lit-path=/home/shkzhang/llvm/build/bin/llvm-lit --width=120  --lit --no-lnt  

# Only run all lnt
/home/shkzhang/llvm_test_script/scripts/testllvm.sh --log=/home/shkzhang/llvm/testlog --test-suite-path=/home/shkzhang/llvm_test_script/llvm-test-suite --lit-path=/home/shkzhang/llvm/build/bin/llvm-lit --width=120 --no-lit --lnt  

# Only run all lnt, except IBM
/home/shkzhang/llvm_test_script/scripts/testllvm.sh --log=/home/shkzhang/llvm/testlog --test-suite-path=/home/shkzhang/llvm_test_script/llvm-test-suite --lit-path=/home/shkzhang/llvm/build/bin/llvm-lit --width=120 --no-lit --lnt=all
```



Note that if enable `DLLVM_ENABLE_EXPENSIVE_CHECKS=ON` , `ninja check-llvm` will run more cases, but `ninja check-asan` will be failed.

```shell
ninja -check-llvm -j120    
ninja -check-asan -j120
ninja -check-all -j120
```

-------









