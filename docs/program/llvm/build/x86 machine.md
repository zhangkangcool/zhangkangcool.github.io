



```shell
export LLVM_HOME=/home/zhangkang/workspace/llvm-project

export LLVM_HOME=/home/ken/workspace/llvm
cd $LLVM_HOME
mkdir build
cd build

cmake  ../llvm -DCMAKE_INSTALL_PREFIX=$LLVM_HOME/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra;compiler-rt;mlir"  -DCMAKE_C_COMPILER=/usr/bin/gcc -DCMAKE_CXX_COMPILER=/usr/bin/g++  -DLLVM_BUILD_EXTERNAL_COMPILER_RT=On -DLLVM_BUILD_EXAMPLES=On 


# 时间比较近的话，可以example,mlir，compiler-rt不要编译
cmake  ../llvm -DCMAKE_INSTALL_PREFIX=.install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra"  -DCMAKE_C_COMPILER=/usr/bin/gcc -DCMAKE_CXX_COMPILER=/usr/bin/g++ 


make -j16
make install

export PATH=$LLVM_HOME/build/bin:$PATH
export PATH=$LLVM_HOME/in/bin:$PATH
```







```shell


simplify
ASSERT关闭，不编clang，只编X86
cmake  ../llvm -DCMAKE_INSTALL_PREFIX=$LLVM_HOME/install -DLLVM_ENABLE_ASSERTIONS=Off -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS=""  -DCMAKE_C_COMPILER=/usr/bin/gcc -DCMAKE_CXX_COMPILER=/usr/bin/g++  -DLLVM_BUILD_EXTERNAL_COMPILER_RT=On -DLLVM_BUILD_EXAMPLES=On -DLLVM_TARGETS_TO_BUILD="X86" -DLLVM_TOOL_LLC_BUILD=Off
```





```shell
#!/bin/bash
export SRC_ROOT=${PWD}

cmake -S llvm -B build -G Ninja \                                                                                                                                                                                  
-DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra" \
-DCMAKE_C_FLAGS=" -O0" \
-DCMAKE_CXX_FLAGS=" -O0" \
-DLLVM_INCLUDE_TESTS=On \
-DCMAKE_C_COMPILER=/usr/bin/gcc \
-DCMAKE_CXX_COMPILER=/usr/bin/g++ \
-DCMAKE_INSTALL_PREFIX=${SRC_ROOT}/install \
-DLLVM_ENABLE_ASSERTIONS=On \
-DCMAKE_BUILD_TYPE=Release
ninja -C build install -j12

```



llvm17 编译SPIRV

```shell
#!/bin/bash
set -x
startTime=`date +%Y%m%d-%H:%M:%S`
startTime_s=$(date +%s)

export SRC_ROOT=${PWD}

mkdir -p ${SRC_ROOT}/build
cd ${SRC_ROOT}/build

cmake  ../llvm -DCMAKE_INSTALL_PREFIX=../install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra"  -DCMAKE_C_COMPILER=/usr/bin/gcc -DCMAKE_CXX_COMPILER=/usr/bin/g++ -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD="SPIRV" -DLLVM_INCLUDE_SPIRV_TOOLS_TESTS=ON | tee cmake.log


make -j2 --trace VERBOSE=2 | tee make.log
make install | tee install.log

endTime=`date +%Y%m%d-%H:%M:%S`
endTime_s=$(date +%s)
sumTime=$(( endTime_s - startTime_s ))

echo "$startTime ---> $endTime" "Total:$sumTime seconds"

```





有ninja，使用ninja，没有则使用cmake

```shell
set -x
#!/bin/bash
startTime=`date +%Y%m%d-%H:%M:%S`
startTime_s=$(date +%s)

export SRC_ROOT=${PWD}

export DEFINE_OPTIONS="\
  -DLLVM_ENABLE_PROJECTS=clang \
  -DLLVM_TARGETS_TO_BUILD= \
  -DLLVM_INCLUDE_TESTS=OFF \
  -DCLANG_INCLUDE_TESTS=ON \
  -DCMAKE_INSTALL_PREFIX=${SRC_ROOT}/install \
  -DCMAKE_BUILD_TYPE=Release"


if dpkg -L ninja-build	&> /dev/null ; then
# build.ninja和compile_commands.json中会有详细的编译命令
  echo "using ninja-build"
  cmake -S llvm -B build -G Ninja ${DEFINE_OPTIONS} \
  -DCMAKE_C_FLAGS="-O0" \
  -DCMAKE_CXX_FLAGS="-O0" \
  -DCMAKE_C_FLAGS_RELEASE="-O0" \
  -DCMAKE_CXX_FLAGS_RELEASE="-O0"

  ninja -C build install -j10
else #ninja-build not available
# compile_commands.json中会有详细的编译命令
  echo "ninja not available, build with makefile"
  mkdir -p ${SRC_ROOT}/build
  cd ${SRC_ROOT}/build

  cmake ${SRC_ROOT}/llvm ${DEFINE_OPTIONS} \
  -DCMAKE_C_FLAGS="-O0" \
  -DCMAKE_CXX_FLAGS="-O0" \
  -DCMAKE_C_FLAGS_RELEASE="-O0" \
  -DCMAKE_CXX_FLAGS_RELEASE="-O0"

  cmake --build ${SRC_ROOT}/build -- -j4
  cmake --install ${SRC_ROOT}/build
fi

endTime=`date +%Y%m%d-%H:%M:%S`
endTime_s=$(date +%s)
sumTime=$(( endTime_s - startTime_s ))

echo "$startTime ---> $endTime" "Total:$sumTime seconds"

```



