<h1 align="center">clang驱动实现原</h1>








下述文件会编译生成`clang-17`

```shell
ls ~/workspace/llvm-project/clang/tools/driver on git:main o [14:36:11]
CMakeLists.txt  Info.plist.in  cc1_main.cpp  cc1as_main.cpp  cc1gen_reproducer_main.cpp  driver.cpp
```





如果是用的cmake/make，编译命令在，如果是用的ninja，编译命令在build.ninja中。

```shell
 ./tools/clang/tools/driver/CMakeFiles/clang.dir/link.txt
```





其它的文件是指向`clang-17`的软链接。

```shell
lrwxr-xr-x 1 ken staff         8  428日 14:18 clang -> clang-17*
lrwxr-xr-x 1 ken staff         8  428日 14:18 clang++ -> clang-17*
-rwxr-xr-x 1 ken staff 280395240  428日 14:18 clang-17*
lrwxr-xr-x 1 ken staff         8  428日 14:18 clang-cl -> clang-17*
lrwxr-xr-x 1 ken staff         8  428日 14:18 clang-cpp -> clang-17*
```



下面是`clang/tools/driver/CMakeLists.txt`是建立软链接的代码。

```cmake

# Support plugins.
if(CLANG_PLUGIN_SUPPORT)
  export_executable_symbols_for_plugins(clang)    // 产生可执行文件，该实现在AddLLVMcmake中
endif()


if(NOT CLANG_LINKS_TO_CREATE)
  set(CLANG_LINKS_TO_CREATE clang++ clang-cl clang-cpp)
endif()

if (CLANG_ENABLE_HLSL)
  set(HLSL_LINK clang-dxc)
endif()

foreach(link ${CLANG_LINKS_TO_CREATE} ${HLSL_LINK})
  add_clang_symlink(${link} clang)  # 建立 clang++ clang-cl clang-cpp 指向clang
endforeach()
```







### 调用关系

`driver.cpp`

```c++
int clang_main(int Argc, char **Argv, const llvm::ToolContext &ToolContext) {
...
  ExecuteCC1Tool(Args, ToolContext);
...
 }
```



`clang_main -> ExecuteCC1Tool`,在早期的版本中`clang_main`直接就是`main`函数。



`cc1`, `cc1as`, `cc1gen-reproducer`分别对应一个文件实现。

```c++
static int ExecuteCC1Tool(SmallVectorImpl<const char *> &ArgV,
                          const llvm::ToolContext &ToolContext) {
  // If we call the cc1 tool from the clangDriver library (through
  // Driver::CC1Main), we need to clean up the options usage count. The options
  // are currently global, and they might have been used previously by the
  // driver.
  llvm::cl::ResetAllOptionOccurrences();

  llvm::BumpPtrAllocator A;
  llvm::cl::ExpansionContext ECtx(A, llvm::cl::TokenizeGNUCommandLine);
  if (llvm::Error Err = ECtx.expandResponseFiles(ArgV)) {
    llvm::errs() << toString(std::move(Err)) << '\n';
    return 1;
  }
  StringRef Tool = ArgV[1];
  void *GetExecutablePathVP = (void *)(intptr_t)GetExecutablePath;
  if (Tool == "-cc1")    // 用于前端
    return cc1_main(ArrayRef(ArgV).slice(1), ArgV[0], GetExecutablePathVP);
  if (Tool == "-cc1as")  // 用于汇编
    return cc1as_main(ArrayRef(ArgV).slice(2), ArgV[0], GetExecutablePathVP);
  if (Tool == "-cc1gen-reproducer")
    return cc1gen_reproducer_main(ArrayRef(ArgV).slice(2), ArgV[0],
                                  GetExecutablePathVP, ToolContext);
  // Reject unknown tools.
  llvm::errs() << "error: unknown integrated tool '" << Tool << "'. "
               << "Valid tools include '-cc1' and '-cc1as'.\n";
  return 1;
}
```





`cc1_main.cpp`中主要是以下函数，其它还包括设置各种环境，`include`等。如果自己写前端驱动的话，可以参考该文件。

```c++
bool Success = CompilerInvocation::CreateFromArgs(Clang->getInvocation(),
                                                    Argv, Diags, Argv0);
```





从编译命令可以知道，编译clang时，还使用了`clang-driver.cpp`文件。该文件在`./build/tools/clang/tools/driver/clang-driver.cpp`。编译时才会产生的文件，其内容如下：

```c++
//===-- driver-template.cpp -----------------------------------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//

#include "llvm/Support/LLVMDriver.h"
#include "llvm/ADT/ArrayRef.h"

int clang_main(int argc, char **, const llvm::ToolContext &);

int main(int argc, char **argv) {
  return clang_main(argc, argv, {argv[0], nullptr, false});
}
```



该文件是由`llvm/cmake/modules/llvm-driver-template.cpp`产生。其内容与`clang-driver.cpp`一样。这样做的目的是用相同的代码，还能产生其它的`dirver.cpp`。

```c++
//===-- driver-template.cpp -----------------------------------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//

#include "llvm/Support/LLVMDriver.h"
#include "llvm/ADT/ArrayRef.h"

int @TOOL_NAME@_main(int argc, char **, const llvm::ToolContext &);

int main(int argc, char **argv) {
  return @TOOL_NAME@_main(argc, argv, {argv[0], nullptr, false});
}
```





早期的版本直接在tool中就有main函数，后期使用了`llvm-driver-template.cpp`。

```c++
$ grep -r "main(int argc, char.*const llvm::ToolContext" .
./llvm-lipo/llvm-lipo-driver.cpp:int llvm_lipo_main(int argc, char **, const llvm::ToolContext &);
./clang/tools/driver/clang-driver.cpp:int clang_main(int argc, char **, const llvm::ToolContext &);
./clang/tools/clang-scan-deps/clang-scan-deps-driver.cpp:int clang_scan_deps_main(int argc, char **, const llvm::ToolContext &);
./llvm-rc/llvm-rc-driver.cpp:int llvm_rc_main(int argc, char **, const llvm::ToolContext &);
./llvm-nm/llvm-nm-driver.cpp:int llvm_nm_main(int argc, char **, const llvm::ToolContext &);
./llvm-ar/llvm-ar-driver.cpp:int llvm_ar_main(int argc, char **, const llvm::ToolContext &);
./llvm-size/llvm-size-driver.cpp:int llvm_size_main(int argc, char **, const llvm::ToolContext &);
./llvm-readobj/llvm-readobj-driver.cpp:int llvm_readobj_main(int argc, char **, const llvm::ToolContext &);
./llvm-cxxfilt/llvm-cxxfilt-driver.cpp:int llvm_cxxfilt_main(int argc, char **, const llvm::ToolContext &);
./llvm-ifs/llvm-ifs-driver.cpp:int llvm_ifs_main(int argc, char **, const llvm::ToolContext &);
./llvm-profdata/llvm-profdata-driver.cpp:int llvm_profdata_main(int argc, char **, const llvm::ToolContext &);
./llvm-objcopy/llvm-objcopy-driver.cpp:int llvm_objcopy_main(int argc, char **, const llvm::ToolContext &);
./llvm-mt/llvm-mt-driver.cpp:int llvm_mt_main(int argc, char **, const llvm::ToolContext &);
```





CMAKE中找不到的定义就往上层找。

