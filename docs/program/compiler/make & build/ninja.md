



### 命令行

ninja使用的命令行在`build/compile_commands.json`中。

`build.ninja`和`rules.ninja`：包含Ninja的所有的构建语句和构建规则。

```shelL
sudo apt-get update -y

sudo apt-get install -y ninja-build
```





```shell
#!/bin/bash
startTime=`date +%Y%m%d-%H:%M:%S`
startTime_s=$(date +%s)

export SRC_ROOT=${PWD}
# TESTS depend on LLVM tool, but we only need llvm-config
# so set LLVM_INCLUDE_TESTS OFF
# CLANG_ENABLE_ARCMT CLANG_ENABLE_STATIC_ANALYZER CLANG_ENABLE_BUILD_EXAMPLES会
# 引入很多无关依赖，选择关掉
# CLANG_INCLUDE_TESTS依赖LLVM_INCLUDE_TESTS,需要显式打开
# SPIRV_SKIP_DEBUG_INFO_TESTS=ON  剔除spirv测试对一些工具的依赖
if dpkg -L ninja-build	&> /dev/null ; then
  echo "using ninja-build"
  cmake -S llvm -B build -G Ninja \
  -DLLVM_ENABLE_BACKEND="OFF" \
  -DLLVM_ENABLE_AGGREGATE_PASS="OFF" \
  -DLLVM_ENABLE_LESS_SIMPLIFY="OFF" \
  -DCLANG_ENABLE_ARCMT="OFF" \
  -DCLANG_ENABLE_STATIC_ANALYZER="OFF" \
  -DCLANG_BUILD_EXAMPLES=OFF \
  -DLLVM_ENABLE_PROJECTS="clang" \
  -DCMAKE_C_FLAGS="-Os -DNDEBUG" \
  -DCMAKE_CXX_FLAGS="-Os -DNDEBUG" \
  -DCMAKE_C_FLAGS_RELEASE="-Os -DNDEBUG" \
  -DCMAKE_CXX_FLAGS_RELEASE="-Os -DNDEBUG" \
  -DLLVM_TARGETS_TO_BUILD="" \
  -DLLVM_INCLUDE_TESTS=OFF \
  -DCLANG_INCLUDE_TESTS=ON \
  -DSPIRV_SKIP_DEBUG_INFO_TESTS=ON \
  -DLLVM_INCLUDE_BENCHMARKS=OFF \
  -DCMAKE_INSTALL_PREFIX=${SRC_ROOT}/build/install \
  -DCMAKE_BUILD_TYPE=Release
  ninja -C build install \
  # > log.txt 2>&1
else #ninja-build not available
  echo "ninja not available, build with makefile"
  mkdir -p ${SRC_ROOT}/build
  cd ${SRC_ROOT}/build

  cmake ${SRC_ROOT}/llvm \
  -DLLVM_ENABLE_BACKEND="OFF" \
  -DLLVM_ENABLE_AGGREGATE_PASS="OFF" \
  -DLLVM_ENABLE_LESS_SIMPLIFY="OFF" \
  -DCLANG_ENABLE_ARCMT="OFF" \
  -DCLANG_ENABLE_STATIC_ANALYZER="OFF" \
  -DCLANG_BUILD_EXAMPLES=OFF \
  -DLLVM_ENABLE_PROJECTS="clang" \
  -DCMAKE_C_FLAGS="-Os -DNDEBUG" \
  -DCMAKE_CXX_FLAGS="-Os -DNDEBUG" \
  -DCMAKE_C_FLAGS_RELEASE="-Os -DNDEBUG" \
  -DCMAKE_CXX_FLAGS_RELEASE="-Os -DNDEBUG" \
  -DLLVM_TARGETS_TO_BUILD="" \
  -DLLVM_INCLUDE_TESTS=OFF \
  -DCLANG_INCLUDE_TESTS=ON \
  -DSPIRV_SKIP_DEBUG_INFO_TESTS=ON \
  -DLLVM_INCLUDE_BENCHMARKS=OFF \
  -DCMAKE_INSTALL_PREFIX=${SRC_ROOT}/build/install \
  -DCMAKE_BUILD_TYPE=Release

  cmake --build ${SRC_ROOT}/build -- -j4
  cmake --install ${SRC_ROOT}/build
fi

endTime=`date +%Y%m%d-%H:%M:%S`
endTime_s=$(date +%s)
sumTime=$(( endTime_s - startTime_s ))

echo "$startTime ---> $endTime" "Total:$sumTime seconds"

```



```
cmake -S 指定源码目录
cmake -B 指定构建目录
cmake -G 指定生成器，可以是Ninja XCode等
```

