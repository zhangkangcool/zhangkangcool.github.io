###  1 -v查看编译过程

可以看到include文件的查找位置

```shell
gcc PPC.cpp -v
Apple LLVM version 10.0.0 (clang-1000.11.45.2)
Target: x86_64-apple-darwin18.0.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
 "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang" -cc1 -triple x86_64-apple-macosx10.14.0 -Wdeprecated-objc-isa-usage -Werror=deprecated-objc-isa-usage -emit-obj -mrelax-all -disable-free -disable-llvm-verifier -discard-value-names -main-file-name PPC.cpp -mrelocation-model pic -pic-level 2 -mthread-model posix -mdisable-fp-elim -fno-strict-return -masm-verbose -munwind-tables -target-cpu penryn -dwarf-column-info -debugger-tuning=lldb -target-linker-version 409.12 -v -resource-dir /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/clang/10.0.0 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk -I/usr/local/include -stdlib=libc++ -fdeprecated-macro -fdebug-compilation-dir /Users/ken -ferror-limit 19 -fmessage-length 135 -stack-protector 1 -fblocks -fencode-extended-block-signature -fobjc-runtime=macosx-10.14.0 -fcxx-exceptions -fexceptions -fmax-type-align=16 -fdiagnostics-show-option -fcolor-diagnostics -o /var/folders/55/1pk4z40s3v75y6xhy1h0wpl80000gn/T/PPC-b8cbc7.o -x c++ PPC.cpp
clang -cc1 version 10.0.0 (clang-1000.11.45.2) default target x86_64-apple-darwin18.0.0
ignoring nonexistent directory "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/include/c++/v1"
ignoring nonexistent directory "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/local/include"
ignoring nonexistent directory "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/Library/Frameworks"
#include "..." search starts here:
#include <...> search starts here:
 /usr/local/include
 /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include/c++/v1
 /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/clang/10.0.0/include
 /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include
 /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/include
 /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/System/Library/Frameworks (framework directory)
End of search list.
PPC.cpp:14:10: fatal error: 'PPC.h' file not found
#include "PPC.h"
         ^~~~~~~
1 error generated.
```



### 2 查看include earch path(以下方法也可以用于clang) 头文件路径

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

