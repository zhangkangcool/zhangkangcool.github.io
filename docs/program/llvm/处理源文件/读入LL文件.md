



使用parseIRFile来读入ll文件, 下列代码使用llvm9测试通过，lib和Include应该相应做修改，还有所使用的库



```c++
// g++ -std=c++17 test.cpp -o test -L/home/ken/workspace/OpenCL_Compiler/demo -lCLC -Wl,-rpath=/home/ken/workspace/OpenCL_Compiler/demo/../install/lib -I/home/ken/workspace/OpenCL_Compiler/demo/../install/include



#include <iostream>
#include <clang/Lex/PreprocessorOptions.h>
#include "clang/Driver/Options.h"
#include <clang/Frontend/TextDiagnosticBuffer.h>
#include <clang/Frontend/TextDiagnosticPrinter.h>
#include <clang/Frontend/CompilerInstance.h>
#include <clang/CodeGen/CodeGenAction.h>

#include "llvm/IR/LLVMContext.h"
#include "llvm/IR/Module.h"
#include "llvm/IRReader/IRReader.h"
#include "llvm/Support/SourceMgr.h"
#include "llvm/Support/raw_ostream.h"

#include "llvm/Option/Arg.h"
#include "llvm/Option/ArgList.h"
#include "llvm/Option/OptTable.h"

#include <LLVMSPIRVLib/LLVMSPIRVLib.h>

// #include <CL/cl.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <memory>                               

int main(int argc, char **argv) {
  if (argc < 2) {
    llvm::errs() << "Usage: " << argv[0] << " <input file>\n";
    return 1;
  }

  std::string Filename = argv[1];
  llvm::SMDiagnostic Err;
  llvm::LLVMContext Context;
  std::unique_ptr<llvm::Module> Module(parseIRFile(Filename, Err, Context));

  if (!Module) {
    Err.print(argv[0], llvm::errs());
    return 1;
  }

  // Print the module to verify that it has been loaded correctly.
  Module->dump();

  return 0;
}

```

