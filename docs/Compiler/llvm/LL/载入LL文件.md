



```c++
#include "llvm/IR/LLVMContext.h"
#include "llvm/IR/Module.h"
#include "llvm/IRReader/IRReader.h"
#include "llvm/Support/SourceMgr.h"
#include "llvm/Support/raw_ostream.h"
#include <memory>

 std::unique_ptr<llvm::Module> loadModuleFromFile(const std::string& filename) {
  // 创建 LLVMContext
  llvm::LLVMContext context;

  // 用于存储诊断信息
  llvm::SMDiagnostic error;

  // 解析 .ll 文件并返回 Module
  std::unique_ptr<llvm::Module> module = llvm::parseIRFile(filename, error, context);

  // 检查是否成功加载
  if (!module) {
    llvm::errs() << "Error loading file '" << filename << "':\n";
    error.print("loadModule", llvm::errs());
    return nullptr;
  }

  // 输出成功信息（可选）
  llvm::outs() << "Successfully loaded module: " << module->getName() << "\n";

  return module;
}

int main() {
  // 指定要加载的 .ll 文件
  std::string filename = "input.ll";

  // 调用函数加载 Module
  std::unique_ptr<llvm::Module> module = loadModuleFromFile(filename);

  if (module) {
    // 成功加载，可以进一步操作 module
    module->print(llvm::outs(), nullptr); // 打印到标准输出，验证内容
  }

  return 0;
}
```

