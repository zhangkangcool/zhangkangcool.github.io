BUILD_SHARED_LIBS=ON

DLLVM_ENABLE_EXPENSIVE_CHECKS=ON只能在check-llvm时加，否则很多case会挂。

# Build on lep824e1v

```shell
https://llvm.org/docs/GettingStarted.html
```
### xlc on gsa

```shell
/gsa/tlbgsa/projects/x/xlcmpbld/run/clangtana/16.1.1/linux_leppc/daily/181205
```

### clang on gsa

```shell
/xl_le/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang
```

### Donwload the code

```shell
mkdir llvm #  ~/llvm
cd llvm
git clone git@github.ibm.com:compiler/llvm.git
```

### Create with cmake configure

```shell
DLLVM_TARGETS_TO_BUILD=PowerPC;X86
```

```shell
If there is CMakeCache.txt, your should reomve it in /llvm/build
mkdir install
mkdir build
cd build    #  ~/llvm/build
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;llvm;compiler-rt;clang-tools-extra;libclc;libcxx;libcxxabi;libunwind;lld;lldb;parallel-libs;openmp;polly"
```

If you want to use the graph dot tool, you should use the opton 
```shell
-DLLVM_ENABLE_ASSERTIONS=On — Compile with assertion checks enabled (default is Yes for Debug builds, No for all other build types) 
```

### you can use below command

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang"
```

You'd better set the `ASSERTIONS` to on.
```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;llvm;compiler-rt;clang-tools-extra"
```

Use the at12 to build if the version of libstdc++ is low.
```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang" -DLLVM_EXTERNAL_CLANG_SOURCE_DIR=../llvm/clang -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++ -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DCLANG_ENABLE_PROJECTS="llvm" -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```

#### test can use below command to build clang on lep824e1v:

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang"  -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++ -DLLVM_ENABLE_EXPENSIVE_CHECKS=On

cmake $HOME/llvm/llvm -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=//opt/at12.0/bin/gcc  -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++  -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DCLANG_INCLUDE_TESTS=Off -DLLVM_ENABLE_EXPENSIVE_CHECKS=On

cmake $HOME/llvm/llvm -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra;compiler-rt"  -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc  -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++  -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DCLANG_INCLUDE_TESTS=Off -DLLVM_ENABLE_EXPENSIVE_CHECKS=On


cmake $HOME/llvm/llvm -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra;compiler-rt"  -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc  -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++  -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DLLVM_ENABLE_EXPENSIVE_CHECKS=On


****************lep824e1v used*********************
### e1v used, 2020.07.31
cmake $HOME/llvm/llvm -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra;compiler-rt"  -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc  -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++  -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include
****************lep824e1v used*********************
```

If you want to set more tripe, you should not use the option ` -DLLVM_TARGETS_TO_BUILD=PowerPC`.
```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="llvm" -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```

For example, you want to use X86 
```shell
cmake $HOME/llvm_x86/llvm -DLLVM_TARGETS_TO_BUILD="X86"  -DCMAKE_INSTALL_PREFIX=$HOME/llvm_x86/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="llvm" -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```

### Use assert on and clang on gsa only build llvm

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang" -DLLVM_EXTERNAL_CLANG_SOURCE_DIR=../llvm/clang -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++ -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```

### Build

```shell
cd ~/llvm/build
cmake --build .
```

### fast build with j40 (3 minutes)

```shell
cd ~/llvm/build
gmake -j40
make install
```

```shell
 /gsa/tlbgsa-p1/05/xlcmpbldenv/ubuntu14_leppc/cmake/bin/cmake  $HOME/llvm/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;llvm;compiler-rt;clang-tools-extra;libclc;libcxx;libcxxabi;libunwind;lld;l ldb;parallel-libs;openmp;polly" -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```



--------------



# X86

You should set `-DLLVM_TARGETS_TO_BUILD=X86`

### compile x86 on ppc

```asm
; ModuleID = 'add.c'
source_filename = "add.c"

; Function Attrs: norecurse nounwind readnone
define i64 @add64carry(i64 %sum, i64 %x) local_unnamed_addr #0 {
entry:
  %add = add i64 %x, %sum
  %cmp = icmp ult i64 %add, %x
  %inc = zext i1 %cmp to i64
  %spec.select = add i64 %add, %inc
  ret i64 %spec.select
}


!llvm.module.flags = !{!0, !1}
!llvm.ident = !{!2}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"PIC Level", i32 2}
!2 = !{!"clang version 7.0.0 "}
```

When you use the clang, you should remove those attributes.

You can use the llc --version to see the arch your llc support.

```shell
$ llc --version
LLVM (http://llvm.org/):
  LLVM version 7.0.0svn
  Optimized build with assertions.
  Default target: powerpc64le-unknown-linux-gnu
  Host CPU: pwr8

  Registered Targets:
    x86    - 32-bit X86: Pentium-Pro and above
    x86-64 - 64-bit X86: EM64T and AMD64

```

```shell
llc -O3 add.ll -mtriple=x86_64-unknown-unknown
llc -O3 add.ll -mtriple=x86_64
llc -O3 add.ll -mtriple=ppc32
llc -O3 add.ll -mtriple=lyngpu
```



---------

# zz205p1

### build clang & llvm on zz205p1 with ld.gold
```shell
export SPEC_HOME=/home/shkzhang
export SPEC_HOME=/SPEC/shkzhang
cmake $SPEC_HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$SPEC_HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt" -DLLVM_BINUTILS_INCDIR=$SPEC_HOME/software/install/include -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++ -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```

### build clang & llvm on zz205p1 without ld.gold

```shell
export SPEC_HOME=/SPEC/shkzhang
cmake $SPEC_HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$SPEC_HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang" -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++ -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```



# afterburner/zz13

build clang & llvm & compiler-rt & ld.gold

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++  -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```



# recycler

At12 gcc/g++ 的问题，可以使用gsa上的clang.

`DLLVM_ENABLE_EXPENSIVE_CHECKS`后，asan等会挂

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++ -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DLLVM_ENABLE_EXPENSIVE_CHECKS=On


cmake $HOME/llvm/llvm   -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++  -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DLLVM_ENABLE_EXPENSIVE_CHECKS=On -DLLVM_USE_SANITIZER=Address



cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=/compgpfs/builds/continuous.dev/ppc64le/rhel7/wyvern.dev.release/1159/bin/clang -DCMAKE_CXX_COMPILER=/compgpfs/builds/continuous.dev/ppc64le/rhel7/wyvern.dev.release/1159/bin/clang++ -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DLLVM_ENABLE_EXPENSIVE_CHECKS=On


# All arch & opt -ffast-math可用
################# recommend ##############
cmake $HOME/llvm/llvm -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/linux_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/linux_leppc/daily/latest/bin/clang++ -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DCLANG_INCLUDE_TESTS=Off -DLLVM_ENABLE_EXPENSIVE_CHECKS=On


cmake $HOME/llvm/llvm -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=//opt/at12.0/bin/gcc  -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++  -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DCLANG_INCLUDE_TESTS=Off -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```





`LLVM_USE_SANITIZER`: -DLLVM_USE_SANITIZER=Address



# perfzz13(opt -ffast-math可用)

用gcc/g++

```shell
# All arch & opt -ffast-math可用
##### 用gcc/g++，这样编fortran不会出错，否则可能会有出来mergedata错误的问题
cmake $HOME/llvm/llvm -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt;lld"  -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++ -DLLVM_BINUTILS_INCDIR=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/p9_software/binutils/binutils/include -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```





# Use the xcode to read the source code

```shell
cmake -G "Xcode" $HOME/llvm/llvm -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DCMAKE_CXX_COMPILER=/usr/bin/g++ -DCMAKE_C_COMPILER=/usr/bin/gcc

cmake -G "Xcode" $HOME/llvm-project-xcode/llvm -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DCMAKE_CXX_COMPILER=/usr/bin/g++ -DCMAKE_C_COMPILER=/usr/bin/gcc  -DLLVM_TARGETS_TO_BUILD=PowerPC -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```

If you get the error `xcode-select: error: tool 'xcodebuild' requires Xcode`, you should run below command:

```shell
# https://www.jianshu.com/p/07a281ff57d3
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer/
```

Then, you can use `xcode` to open `/Users/ken/llvm-project/xcode-build/LLVM.xcodeproj/`.





# Error

如果想编译的组件无法成功的话，可直接对`/home/shkzhang/llvm/llvm/CMakeLists.txt`进行修改。

`/home/shkzhang/llvm/llvm/CMakeLists.txt`所有参数都有默认值，可在使用`cmake`命令时对其进行覆盖。如

`option(LLVM_ENABLE_WERROR "Fail and stop if a warning is triggered." OFF)`，可用`-DLLVM_ENABLE_WERROR=ON`将其打开。

```shell
542 option (LLVM_BUILD_EXTERNAL_COMPILER_RT
 543   "Build compiler-rt as an external project." ON)  	# 原来是Off
 
cmake  ../llvm  -DLLVM_TARGETS_TO_BUILD=PowerPC  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt"  -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++  -DLLVM_USE_SANITIZER=Address -DLLVM_BUILD_EXTERNAL_COMPILER_RT=ON -DLLVM_ENABLE_EXPENSIVE_CHECKS=On
```





要想使用Sanitizer,必须设置`-DLLVM_BUILD_EXTERNAL_COMPILER_RT=ON`.



### -DLLVM_ENABLE_EXPENSIVE_CHECKS=On(最好编译成此版本，能检测出隐藏漏洞)

```shell
cmake $HOME/llvm/llvm -DLLVM_ENABLE_EXPENSIVE_CHECKS=On  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE   -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++ -DLLVM_TARGETS_TO_BUILD=PowerPC


cmake $HOME/llvm/llvm -DLLVM_ENABLE_EXPENSIVE_CHECKS=On  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE   -DCMAKE_C_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++ -DLLVM_TARGETS_TO_BUILD=PowerPC

cmake $HOME/llvm/llvm -DLLVM_ENABLE_EXPENSIVE_CHECKS=On  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE   -DCMAKE_C_COMPILER=/opt/at12.0/bin/gcc -DCMAKE_CXX_COMPILER=/opt/at12.0/bin/g++ -DLLVM_TARGETS_TO_BUILD=PowerPC -DLLVM_ENABLE_PROJECTS="clang"
```



需要修改下述文件，不能使用系统提供的`std::swap()`，此处有bug，用`llvm::shuffle`替换`std::shuffle`。且在`llvm::shuffle`中不能使用`std::swap()`，否则会出现错误`safe_container.h:86:error: attempt to self move`。

<https://bugs.llvm.org/show_bug.cgi?id=37652> 此bug还未被修复。

```C++
diff --git a/llvm/include/llvm/ADT/STLExtras.h b/llvm/include/llvm/ADT/STLExtras.h
index 81dce0168c79..f032654e1be5 100644
--- a/llvm/include/llvm/ADT/STLExtras.h
+++ b/llvm/include/llvm/ADT/STLExtras.h
@@ -1085,6 +1085,20 @@ inline int (*get_array_pod_sort_comparator(const T &))
 ///
 /// NOTE: If qsort_r were portable, we could allow a custom comparator and
 /// default to std::less.
+
+template <class RandomAccessIterator, class URNG>
+  void shuffle (RandomAccessIterator first, RandomAccessIterator last, URNG&& g)
+{
+  for (auto i=(last-first)-1; i>0; --i) {
+    std::uniform_int_distribution<decltype(i)> d(0,i);
+//    if (*first[i] == *first[d(g)])
+//    std::swap(first[i], first[d(g)]);
+//    auto &temp = first[i];;
+//    first[i] = first[d(g)];
+//    first[d(g)] = temp;
+  }
+}
+
 template<class IteratorTy>
 inline void array_pod_sort(IteratorTy Start, IteratorTy End) {
   // Don't inefficiently call qsort with one element or trigger undefined
@@ -1122,7 +1136,7 @@ template <typename IteratorTy>
 inline void sort(IteratorTy Start, IteratorTy End) {
 #ifdef EXPENSIVE_CHECKS
   std::mt19937 Generator(std::random_device{}());
-  std::shuffle(Start, End, Generator);
+  llvm::shuffle(Start, End, Generator);
 #endif
   std::sort(Start, End);
 }
@@ -1135,7 +1149,7 @@ template <typename IteratorTy, typename Compare>
 inline void sort(IteratorTy Start, IteratorTy End, Compare Comp) {
 #ifdef EXPENSIVE_CHECKS
   std::mt19937 Generator(std::random_device{}());
-  std::shuffle(Start, End, Generator);
+  llvm::shuffle(Start, End, Generator);
 #endif
   std::sort(Start, End, Comp);
 }
```



## 交叉编译

```
-DCMAKE_C_FLAGS="-march=broadwell" -DCMAKE_CXX_FLAGS="-march=broadwell" -DLLVM_TARGETS_TO_BUILD=X86 
```



```

-DCMAKE_C_FLAGS="-march=broadwell" -DCMAKE_CXX_FLAGS="-march=broadwell"：编译生成的clang/llc是在哪个平台运行，如果是编译的平台，则不需要指明march

DLLVM_TARGETS_TO_BUILD = x86：clang/llc 生成的ll exe等是在哪个平台,效果是llvm/build/lib/Target下只在AMDGPU

上述表示clang/llc是在broadwell平台的编译器，该编译器生成的ll或exe是运行在x86平台的。


```







```shell
cmake -G Ninja ../llvm -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_ASSERTIONS=True -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=ON -DCMAKE_C_FLAGS="-march=broadwell" -DCMAKE_CXX_FLAGS="-march=broadwell" -DLLVM_TARGETS_TO_BUILD=X86 -DCMAKE_C_COMPILER=/xl_le/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang -DCMAKE_CXX_COMPILER=/xl_le/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++  -DLLVM_ENABLE_PROJECTS="clang" -DLLVM_LIT_ARGS="-v"


cmake -G Ninja ../llvm -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_ASSERTIONS=True -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=ON -DCMAKE_C_FLAGS="-march=broadwell" -DCMAKE_CXX_FLAGS="-march=broadwell" -DLLVM_TARGETS_TO_BUILD=X86 -DCMAKE_C_COMPILER=/home/shkzhang/llvm/build_all/bin/clang -DCMAKE_CXX_COMPILER=/home/shkzhang/llvm/build_all/bin/clang++  -DLLVM_ENABLE_PROJECTS="clang" -DLLVM_LIT_ARGS="-v"

/home/ken/llvm/build/bin/clang++ -I/home/ken/llvm/log/test-2019-08-12_02-29-53/MultiSource/Benchmarks/7zip -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip -I/home/ken/llvm_cdl/llvm-test-suite/include -I../../../include -D_GNU_SOURCE -D__STDC_LIMIT_MACROS -DNDEBUG -std=gnu++98 -DBREAK_HANDLER -DUNICODE -D_UNICODE -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/C -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/myWindows -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/include_windows -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP -I. -D_FILE_OFFSET_BITS=64 -D_LARGEFILE_SOURCE -DNDEBUG -D_REENTRANT -DENV_UNIX -D_7ZIP_LARGE_PAGES -pthread -O3 -c /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/7zip/UI/Console/UserInputUtils.cpp -o Output/UserInputUtils.llvm.o


cd /home/ken/llvm/log/test-2019-08-12_02-29-53/MultiSource/Benchmarks/7zip
/gsa/tlbgsa-p3/11/xlrtcbld/jenkins/clang.main_trunk.runnable/rhel7_leppc/daily/190811_1707/bin/clang-10  -cc1 -triple x86_64-unknown-linux-gnu -emit-obj -disable-free -main-file-name UserInputUtils.cpp -mrelocation-model static -mthread-model posix -mframe-pointer=none -fmath-errno -masm-verbose -mconstructor-aliases -munwind-tables -fuse-init-array -target-cpu broadwell -dwarf-column-info -debugger-tuning=gdb -coverage-notes-file /home/ken/llvm/log/test-2019-08-12_02-29-53/MultiSource/Benchmarks/7zip/Output/UserInputUtils.llvm.gcno -resource-dir /gsa/tlbgsa-p3/11/xlrtcbld/jenkins/clang.main_trunk.runnable/rhel7_leppc/daily/190811_1707/lib/clang/10.0.0 -I /home/ken/llvm/log/test-2019-08-12_02-29-53/MultiSource/Benchmarks/7zip -I /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip -I /home/ken/llvm_cdl/llvm-test-suite/include ../../../include -D _GNU_SOURCE -D __STDC_LIMIT_MACROS -D NDEBUG -D BREAK_HANDLER -D UNICODE -D _UNICODE -I /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/C -I /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/myWindows -I /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/include_windows -I /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP -I . -D _FILE_OFFSET_BITS=64 -D _LARGEFILE_SOURCE -D NDEBUG -D _REENTRANT -D ENV_UNIX -D _7ZIP_LARGE_PAGES -c-isystem . -c-isystem /home/ken/llvm/llvm/include -c-isystem /home/ken/llvm/build/include -c-isystem /home/ken/llvm/clang/include -c-isystem /home/ken/llvm/build/tools/clang/include -cxx-isystem . -cxx-isystem /home/ken/llvm/llvm/include -cxx-isystem /home/ken/llvm/build/include -cxx-isystem /home/ken/llvm/clang/include -cxx-isystem /home/ken/llvm/build/tools/clang/include -internal-isystem /usr/lib/gcc/ppc64le-redhat-linux/4.8.3/../../../../include/c++/4.8.3 -internal-isystem /usr/lib/gcc/ppc64le-redhat-linux/4.8.3/../../../../include/c++/4.8.3/ppc64le-redhat-linux -internal-isystem /usr/lib/gcc/ppc64le-redhat-linux/4.8.3/../../../../include/c++/4.8.3/backward -internal-isystem /gsa/tlbgsa-p3/11/xlrtcbld/jenkins/clang.main_trunk.runnable/rhel7_leppc/daily/190811_1707/lib/clang/10.0.0/include/ppc_wrappers -internal-isystem /usr/local/include -internal-isystem /gsa/tlbgsa-p3/11/xlrtcbld/jenkins/clang.main_trunk.runnable/rhel7_leppc/daily/190811_1707/lib/clang/10.0.0/include -internal-externc-isystem /include -internal-externc-isystem /usr/include -O3 -std=gnu++98 -fdeprecated-macro -fdebug-compilation-dir /home/ken/llvm/log/test-2019-08-12_02-29-53/MultiSource/Benchmarks/7zip -ferror-limit 19 -fmessage-length 0 -pthread -fno-signed-char -fobjc-runtime=gcc -fcxx-exceptions -fexceptions -fdiagnostics-show-option -fcolor-diagnostics -vectorize-loops -vectorize-slp -faddrsig -o Output/UserInputUtils.llvm.o -x c++ /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/7zip/UI/Console/UserInputUtils.cpp


```





```shell
/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/RunSafely.sh --show-errors -t "/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/sandbox/build/tools/timeit" 1200 /dev/null Output/UserInputUtils.llvm.o.compile 



/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/stage1.install/bin/clang++ -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/sandbox/build/MultiSource/Benchmarks/7zip -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/include -I../../../include -D_GNU_SOURCE -D__STDC_LIMIT_MACROS -DNDEBUG -std=gnu++98 -DBREAK_HANDLER -DUNICODE -D_UNICODE -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/C -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP/myWindows -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP/include_windows -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP -I. -D_FILE_OFFSET_BITS=64 -D_LARGEFILE_SOURCE -DNDEBUG -D_REENTRANT -DENV_UNIX -D_7ZIP_LARGE_PAGES -pthread -O3 -march=skylake-avx512 -c /home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP/7zip/UI/Console/UserInputUtils.cpp -o Output/UserInputUtils.llvm.o
```





```
/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/stage1.install/bin/clang++ -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/sandbox/build/MultiSource/Benchmarks/7zip -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/include -I../../../include -D_GNU_SOURCE -D__STDC_LIMIT_MACROS -DNDEBUG -std=gnu++98 -DBREAK_HANDLER -DUNICODE -D_UNICODE -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/C -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP/myWindows -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP/include_windows -I/home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP -I. -D_FILE_OFFSET_BITS=64 -D_LARGEFILE_SOURCE -DNDEBUG -D_REENTRANT -DENV_UNIX -D_7ZIP_LARGE_PAGES -pthread -O3 -march=skylake-avx512 -c /home/ssglocal/clang-cmake-x86_64-sde-avx512-linux/clang-cmake-x86_64-sde-avx512-linux/test/test-suite/MultiSource/Benchmarks/7zip/CPP/7zip/UI/Console/UserInputUtils.cpp -o Output/UserInputUtils.llvm.o
```





```shell
/home/ken/llvm/build/bin/clang++ -I/home/ken/llvm/log/test-2019-08-02_02-54-36/MultiSource/Benchmarks/7zip -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip -I/home/ken/llvm_cdl/llvm-test-suite/include -I../../../include -D_GNU_SOURCE -D__STDC_LIMIT_MACROS -DNDEBUG -std=gnu++98 -DBREAK_HANDLER -DUNICODE -D_UNICODE -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/C -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/myWindows -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/include_windows -I/home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP -I. -D_FILE_OFFSET_BITS=64 -D_LARGEFILE_SOURCE -DNDEBUG -D_REENTRANT -DENV_UNIX -D_7ZIP_LARGE_PAGES -pthread -O3  -c /home/ken/llvm_cdl/llvm-test-suite/MultiSource/Benchmarks/7zip/CPP/7zip/UI/Console/UserInputUtils.cpp -o Output/UserInputUtils.llvm.o -target x86_64-unknown-linux-gnu
```



---------------



## Build On Mac(Need C11, you'd better to use clang)

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD="X86"  -DCM AKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang" -DCMAKE_C_COMPILER=/usr/bin/clang -DCMAKE_CXX_COMPILER=/usr/bin/clang++

cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD="X86"  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra" -DCMAKE_C_COMPILER=/usr/bin/clang -DCMAKE_CXX_COMPILER=/usr/bin/clang++ 


cd $HOME/llvm
mkdir build
mkdir install
cd build
cmake $HOME/llvm/llvm  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;clang-tools-extra" -DCMAKE_C_COMPILER=/usr/bin/gcc -DCMAKE_CXX_COMPILER=/usr/bin/g++ 
```



必须注释掉`.zshrc`中的如下代码，否则会报头文件的错误，编译完成后，放开如下注释：

`CMAKE`时，必须将下面的4个export全部注释掉

```shell
export C_INCLUDE_PATH=/usr/local/include:$CLANG_PATH/llvm/include:$CLANG_PATH/build/include:$CLANG_PATH/clang/include:$CLANG_PATH/build/tools/clang/include:$C_INCLUDE_PATH
export CPLUS_INCLUDE_PATH=/usr/local/include:$CLANG_PATH/llvm/include:$CLANG_PATH/build/include:$CLANG_PATH/clang/include:$CLANG_PATH/build/tools/clang/include:$CPLUS_INCLUDE_PATH


# When build the llvm, below path need comment
export C_INCLUDE_PATH=$C_INCLUDE_PATH:/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/include:/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include/
export CPLUS_INCLUDE_PATH=$CPLUS_INCLUDE_PATH:/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk/usr/include:/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include/c++/v1/:/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include/
```

编译完成后，如果不放开上述注释使用clang编译程序时，会出现找不到`stdio.h`等错误。



# Use the script to build llvm



### On recycler

```shell
The default compiler is /xl_le/gsa/tlbgsa/projects/w/wyvern-environment/compilers/ppc64le/linux_leppc/clang.10.0.0.rc2/bin/clang


# Enable DLLVM_ENABLE_EXPENSIVE_CHECKS=ON, check asan会错
不要加`--cmake-variables=-DLLVM_ENABLE_EXPENSIVE_CHECKS=ON`
/home/shkzhang/llvm_test_script/scripts/buildllvm.sh --community --src=/home/shkzhang/llvm/llvm  --log=//home/shkzhang/llvm/buildlog --ninja --install --width=80 --lit-list-results --cmake-variables=-DTSAN_TEST_DEFLAKE_THRESHOLD=200 --build=/home/shkzhang/llvm/build --cmake-variables=-DBUILD_SHARED_LIBS=ON --install-dir=/home/shkzhang/llvm/install --build-type=Release


Below command is from buildbot
/home/xlcit/worker/LLVM-Master-RHEL-Release/scripts/buildllvm.sh --src=/home/xlcit/worker/LLVM-Master-RHEL-Release/llvm/llvm --log=/home/xlcit/worker/LLVM-Master-RHEL-Release/buildlog --ninja --install --width=20 --lit-list-results --cmake-variables=-DTSAN_TEST_DEFLAKE_THRESHOLD=200 --build=/home/xlcit/worker/LLVM-Master-RHEL-Release/build --cmake-variables=-DBUILD_SHARED_LIBS=ON --install-dir=/home/xlcit/worker/LLVM-Master-RHEL-Release/installdir --build-type=Release


ninja -j120
ninja -check-llvm -j120     // expensive 36665
ninja -check-asan -j120
ninja -check-all -j120

-DLLVM_USE_SANITIZER=Address -DLLVM_ENABLE_EXPENSIVE_CHECKS=ON
```





# On 3dxp

```shell
cmake $HOME/llvm/llvm -DLLVM_TARGETS_TO_BUILD="X86"  -DCMAKE_INSTALL_PREFIX=$HOME/llvm/install -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_ENABLE_PROJECTS="clang;compiler-rt" -DCMAKE_C_COMPILER=/opt/intel/bin/icc -DCMAKE_CXX_COMPILER=/opt/intel/bin/icpc  -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE

```



# Bootstrap

```shell
cd ~/llvm_test_script/scripts
[shkzhang@recycler:~/llvm_test_script/scripts]$ ./bootstrapllvm.sh --help
USAGE: bootstrapllvm.sh
  --result-dir Base result directory: /home/shkzhang/llvm/build/bootstrap
  --bootstrap-opts Compiler options used for lnt runs and stage2/3 builds.
  --cc Stage 1 C build compiler.
  --cxx Stage 1 CPP build compiler.
  -i, --ignore Build all stages, ignore test failures: 0
  --lnt-path Location of LNT to use for lnt tests: /usr/bin/lnt
  --src Directory containing LLVM sources. Default is /home/shkzhang/llvm/src/llvm
  --test-suite-path Location of the test suite to use for LNT: /home/shkzhang/llvm/test-suite
  --lnt Run LNT for all builds.
  --lnt=all Run all LNT test-suites under /home/shkzhang/llvm/test-suite.
  --no-lnt Do not run LNT tests.
  --no-lit Do not run LIT tests.
  --lld Build the lld project.
  --width Number of processors to use during build. Default is 20
  --cmake-variables Extra variables to pass to cmake.
  --debug Output configuration for run and exit.
  --ninja Use ninja to build Clang/LLVM.

Limitation:
  --bootstrap-opts can only take 1 compiler option.
```



加了`--debug`选项之后，会输出使用用什么命令行进行编译，而不会真正进行编译，可以再编译前试试。

### On recycler(自己用的，非buildbot使用的)

```shell
# DLLVM_ENABLE_EXPENSIVE_CHECKS=ON  check-asan会错
# 不要设置--lit-path，默认会用新编出来的stage /home/shkzhang/llvm/bootstrap/stage1/build/bin/llvm-lit
~/llvm_test_script/scripts/bootstrapllvm.sh --result-dir=/home/shkzhang/llvm/bootstrap --cc=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang --cxx=/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/clang++ --lnt-path=/home/shkzhang/mysandbox/bin/lnt --src=/home/shkzhang/llvm/llvm --test-suite-path=/home/shkzhang/llvm_test_script/llvm-test-suite --lnt=all --lnt --lld --width=80 --ninja --cmake-variables=-DTSAN_TEST_DEFLAKE_THRESHOLD=200 --cmake-variables=-DBUILD_SHARED_LIBS=ON 

# 使用默认的/xl_le/gsa/tlbgsa/projects/w/wyvern-environment/compilers/ppc64le/linux_leppc/clang.10.0.0.rc2/bin/clang
~/llvm_test_script/scripts/bootstrapllvm.sh --result-dir=/home/shkzhang/llvm/bootstrap --lnt-path=/home/shkzhang/mysandbox/bin/lnt --src=/home/shkzhang/llvm/llvm --test-suite-path=/home/shkzhang/llvm_test_script/llvm-test-suite --lnt=all --lnt --lld --width=80 --ninja --cmake-variables=-DTSAN_TEST_DEFLAKE_THRESHOLD=200 --cmake-variables=-DBUILD_SHARED_LIBS=ON 
```



