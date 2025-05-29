

# llvm-confg



用于查看使用llvm编译时会用到哪些库，哪些选项等，头文件等。

以下是help info

```c++
llvm-config --help
usage: llvm-config <OPTION>... [<COMPONENT>...]

Get various configuration information needed to compile programs which use
LLVM.  Typically called from 'configure' scripts.  Examples:
  llvm-config --cxxflags
  llvm-config --ldflags
  llvm-config --libs engine bcreader scalaropts

Options:
  --assertion-mode  Print assertion mode of LLVM tree (ON or OFF).
  --bindir          Directory containing LLVM executables.
  --build-mode      Print build mode of LLVM tree (e.g. Debug or Release).
  --build-system    Print the build system used to build LLVM (e.g. `cmake` or `gn`).
  --cflags          C compiler flags for files that include LLVM headers.
  --cmakedir        Directory containing LLVM CMake modules.
  --components      List of all possible components.
  --cppflags        C preprocessor flags for files that include LLVM headers.
  --cxxflags        C++ compiler flags for files that include LLVM headers.
  --has-rtti        Print whether or not LLVM was built with rtti (YES or NO).
  --help            Print a summary of llvm-config arguments.
  --host-target     Target triple used to configure LLVM.
  --ignore-libllvm  Ignore libLLVM and link component libraries instead.
  --includedir      Directory containing LLVM headers.
  --ldflags         Print Linker flags.
  --libdir          Directory containing LLVM libraries.
  --libfiles        Fully qualified library filenames for makefile depends.
  --libnames        Bare library names for in-tree builds.
  --libs            Libraries needed to link against LLVM components.
  --link-shared     Link the components as shared libraries.
  --link-static     Link the component libraries statically.
  --obj-root        Print the object root used to build LLVM.
  --prefix          Print the installation prefix.
  --shared-mode     Print how the provided components can be collectively linked (`shared` or `static`).
  --system-libs     System Libraries needed to link against LLVM components.
  --targets-built   List of all targets currently built.
  --version         Print LLVM version.
Typical components:
  all               All LLVM libraries (default).
  engine            Either a native JIT or a bitcode interpreter.
```

