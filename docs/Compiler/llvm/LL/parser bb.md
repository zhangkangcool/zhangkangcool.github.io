<h1 align="center">parser bb</h1>


`llvm/lib/AsmParser/LLParser.cpp`

```c++
bool LLParser::ParseBasicBlock(PerFunctionState &PFS) {
  // If this basic block starts out with a name, remember it.
  std::string Name;
  int NameID = -1;
  LocTy NameLoc = Lex.getLoc();
  if (Lex.getKind() == lltok::LabelStr) {
    Name = Lex.getStrVal();
    Lex.Lex();
  } else if (Lex.getKind() == lltok::LabelID) {
    NameID = Lex.getUIntVal();
    Lex.Lex();
  }

  BasicBlock *BB = PFS.DefineBB(Name, NameID, NameLoc);
  if (!BB)
    return true;

  std::string NameStr;

  // Parse the instructions in this block until we get a terminator.
  Instruction *Inst;
  do {
    // This instruction may have three possibilities for a name: a) none
    // specified, b) name specified "%foo =", c) number specified: "%4 =".
    LocTy NameLoc = Lex.getLoc();
    int NameID = -1;
    NameStr = "";

    if (Lex.getKind() == lltok::LocalVarID) {
      NameID = Lex.getUIntVal();
      Lex.Lex();
      if (ParseToken(lltok::equal, "expected '=' after instruction id"))
        return true;
    } else if (Lex.getKind() == lltok::LocalVar) {
      NameStr = Lex.getStrVal();
      Lex.Lex();
      if (ParseToken(lltok::equal, "expected '=' after instruction name"))
        return true;
    }

    switch (ParseInstruction(Inst, BB, PFS)) {
    default: llvm_unreachable("Unknown ParseInstruction result!");
    case InstError: return true;
    case InstNormal:
      BB->getInstList().push_back(Inst);

      // With a normal result, we check to see if the instruction is followed by
      // a comma and metadata.
      if (EatIfPresent(lltok::comma))
        if (ParseInstructionMetadata(*Inst))
          return true;
      break;
    case InstExtraComma:
      BB->getInstList().push_back(Inst);

      // If the instruction parser ate an extra comma at the end of it, it
      // *must* be followed by metadata.
      if (ParseInstructionMetadata(*Inst))
        return true;
      break;
    }

    // Set the name on the instruction.
    if (PFS.SetInstName(NameID, NameStr, NameLoc, Inst)) return true;
  } while (!Inst->isTerminator());

  return false;
}
```





Terminal instruction



#### `llvm/include/llvm/IR/Instruction.def`

```c++
// Terminator Instructions - These instructions are used to terminate a basic
// block of the program.   Every basic block must end with one of these
// instructions for it to be a well formed basic block.
//
 FIRST_TERM_INST  ( 1)
HANDLE_TERM_INST  ( 1, Ret           , ReturnInst)
HANDLE_TERM_INST  ( 2, Br            , BranchInst)
HANDLE_TERM_INST  ( 3, Switch        , SwitchInst)
HANDLE_TERM_INST  ( 4, IndirectBr    , IndirectBrInst)
HANDLE_TERM_INST  ( 5, Invoke        , InvokeInst)
HANDLE_TERM_INST  ( 6, Resume        , ResumeInst)
HANDLE_TERM_INST  ( 7, Unreachable   , UnreachableInst)
HANDLE_TERM_INST  ( 8, CleanupRet    , CleanupReturnInst)
HANDLE_TERM_INST  ( 9, CatchRet      , CatchReturnInst)
HANDLE_TERM_INST  (10, CatchSwitch   , CatchSwitchInst)
HANDLE_TERM_INST  (11, CallBr        , CallBrInst) // A call-site terminator
  LAST_TERM_INST  (11)

```



#### `llvm/include/llvm/IR/Instruction.h`

```c++
  static inline bool isTerminator(unsigned OpCode) {
    return OpCode >= TermOpsBegin && OpCode < TermOpsEnd;
  }
```



```c++
  enum TermOps {       // These terminate basic blocks
#define  FIRST_TERM_INST(N)             TermOpsBegin = N,
#define HANDLE_TERM_INST(N, OPC, CLASS) OPC = N,
#define   LAST_TERM_INST(N)             TermOpsEnd = N+1
#include "llvm/IR/Instruction.def"
  }
```







Below case is right, it will be 2 BB.

```shell
define dso_local signext i32 @main() {
entry:
  %0 = alloca i32, align 4
  store i32 70, i32* %0, align 4
  ret i32 0
  store i32 84, i32* %0, align 4
  ret i32 0
}


declare void @llvm.debugtrap()
```

