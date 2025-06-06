<h1 align="center">查看include path</h1>
# 2 查看include path(以下方法也可以用于clang)

##### 2.1 For C

```shell
gcc -xc -E -v -
```



##### 2.2 For C++

```shell
gcc -xc++ -E -v -
```



##### 2.3 

```shell
echo | gcc -Wp,-v -x c++ - -fsyntax-only
clang -cc1 version 10.0.1 (clang-1001.0.46.4) default target x86_64-apple-darwin18.7.0
ignoring nonexistent directory "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/include/c++/v1"
ignoring nonexistent directory "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/local/include"
ignoring nonexistent directory "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/Library/Frameworks"
ignoring duplicate directory "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include/c++/v1"
ignoring duplicate directory "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/include"
#include "..." search starts here:
#include <...> search starts here:
 /usr/local/include
 .
 /Users/ken/llvm/libcxx/include
 /Users/ken/llvm/llvm/include
 /Users/ken/llvm/build/include
 /Users/ken/llvm/clang/include
 /Users/ken/llvm/build/tools/clang/include
 /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/include
 /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include/c++/v1
 /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/clang/10.0.1/include
 /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include
 /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/System/Library/Frameworks (framework directory)
End of search list.
```

