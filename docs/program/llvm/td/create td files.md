### 生成inc所使用的命令行可以下make.build中找到

共11个inc文件，使用了以下的命令行(On recycler)

在`llvm/build/lib/Target/***`中可以找到编译td文件时所使用的命令行。



```shell
~/llvm/build/lib/Target/PowerPC/CMakeFiles/PowerPCCommonTableGen.dir/build.make
 
  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building PPCGenAsmMatcher.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-asm-matcher -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenAsmMatcher.inc


  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building PPCGenAsmWriter.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-asm-writer -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenAsmWriter.inc
  
  
    @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building PPCGenCallingConv.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-callingconv -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenCallingConv.inc
  

  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building PPCGenDAGISel.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-dag-isel -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenDAGISel.inc
  

  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building PPCGenDisassemblerTables.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-disassembler -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenDisassemblerTables.inc


  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Building PPCGenFastISel.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-fast-isel -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenFastISel.inc


  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Building PPCGenInstrInfo.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-instr-info -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenInstrInfo.inc
  

lib/Target/PowerPC/PPCGenMCCodeEmitter.inc: /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td
  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_8) "Building PPCGenMCCodeEmitter.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-emitter -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenMCCodeEmitter.inc


lib/Target/PowerPC/PPCGenRegisterInfo.inc: /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td
  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_9) "Building PPCGenRegisterInfo.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-register-info -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenRegisterInfo.inc


  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_10) "Building PPCGenSubtargetInfo.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-subtarget -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenSubtargetInfo.inc
  

  @$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/home/shkzhang/llvm/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_11) "Building PPCGenExegesis.inc..."
  cd /home/shkzhang/llvm/build/lib/Target/PowerPC && ../../../bin/llvm-tblgen -gen-exegesis -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenExegesis.inc
```





 





### Use the tblgen tools

```shell
cd /home/ken/llvm/llvm/lib/Target/PowerPC
llvm-tblgen -print-records PPC.td -I ../../../include/ -o ~/1112_tblgen/ppc.print-records.inc

llvm-tblgen  PPC.td -I ../../../include/ -o ~/1112_tblgen/ppc.gen-instr-docs.inc --gen-instr-docs
```



`--gen-emitter`和`--gen-asm-writer`产生可读的C++代码

`gen-asm-writer`用于输出汇编

```shell
下面三个文件对应
/home/ken/llvm/build/lib/Target/PowerPC/PPCGenInstrInfo.inc
/home/ken/llvm/build/lib/Target/PowerPC/PPCGenMCCodeEmitter.inc
/home/ken/llvm/build/lib/Target/PowerPC/PPCGenAsmWriter.inc

llvm-tblgen  PPC.td -I ../../../include/ -o ~/1112_tblgen/ppc.gen-instr-info.inc --gen-instr-info
llvm-tblgen  PPC.td -I ../../../include/ -o ~/1112_tblgen/ppc.gen-emitter.inc --gen-emitter
llvm-tblgen  PPC.td -I ../../../include/ -o ~/1112_tblgen/ppc.gen-asm-writer.inc --gen-asm-writer
```





cat `ppc.gen-instr-info.inc`

```shell
1285     PPC32PICGOT = 1270,
 4248   { 1270, 2,  2,  4,  0,  0|(1ULL<<MCID::UnmodeledSideEffects), 0x0ULL, nullptr, nullptr, Operand      Info42, -1 ,nullptr },  // Inst #1270 = PPC32PICGOT
```





cat `ppc.print-record.inc` 最易读，会进行展开

```shell
127982 def PPC32PICGOT { // InstructionEncoding Instruction I PPCEmitTimePseudo NoEncode
127983   field bits<32> Inst = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0       , 0, 0, 0, 0, 0, 0, 0, 0 };
127984   field bits<32> SoftFail = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,        0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
127985   int Size = 4;
127986   string DecoderNamespace = "";
127987   list<Predicate> Predicates = [];
127988   string DecoderMethod = "";
127989   bit hasCompleteDecoder = 1;
127990   string Namespace = "PPC";
127991   dag OutOperandList = (outs gprc:$rD, gprc:$rT);
127992   dag InOperandList = (ins);
127993   string AsmString = "#PPC32PICGOT";
127994   EncodingByHwMode EncodingInfos = ?;
127995   list<dag> Pattern = [];
127996   list<Register> Uses = [];
127997   list<Register> Defs = [];
127998   int CodeSize = 0;
127999   int AddedComplexity = 0;
128000   bit isPreISelOpcode = 0;
128001   bit isReturn = 0;
128002   bit isBranch = 0;
128003   bit isEHScopeReturn = 0;
128004   bit isIndirectBranch = 0;
128005   bit isCompare = 0;
128006   bit isMoveImm = 0;
128007   bit isMoveReg = 0;
128008   bit isBitcast = 0;
128009   bit isSelect = 0;
128010   bit isBarrier = 0;
128011   bit isCall = 0;
128012   bit isAdd = 0;
128013   bit isTrap = 0;
128014   bit canFoldAsLoad = 0;
128015   bit mayLoad = ?;
128016   bit mayStore = ?;
128017   bit mayRaiseFPException = 0;
128018   bit isConvertibleToThreeAddress = 0;
128019   bit isCommutable = 0;
128020   bit isTerminator = 0;
128021   bit isReMaterializable = 0;
128022   bit isPredicable = 0;
128023   bit isUnpredicable = 0;
128024   bit hasDelaySlot = 0;
128025   bit usesCustomInserter = 0;
128026   bit hasPostISelHook = 0;
128027   bit hasCtrlDep = 0;
128028   bit isNotDuplicable = 0;
128029   bit isConvergent = 0;
128030   bit isAsCheapAsAMove = 0;
128031   bit hasExtraSrcRegAllocReq = 0;
128032   bit hasExtraDefRegAllocReq = 0;
```





`ppc.gen-instr-docs.inc`

```shell
llvm-tblgen  PPC.td -I ../../../include/ -o ~/1112_tblgen/ppc.gen-instr-docs.inc --gen-instr-docs
15203 PPC32PICGOT
15204 ===========
15205
15206 Assembly string: ``#PPC32PICGOT``
15207
15208 Flags: ``hasSideEffects``, ``isCodeGenOnly``, ``hasNoSchedulingInfo``
15209
15210 * DEF ``gprc:$rD``
15211
15212 * DEF ``gprc:$rT``
```



比较指令可用`ppc.gen-instr-info.inc`和`ppc.gen-instr-docs.inc`

```shell
llvm-tblgen -gen-instr-info -I /home/shkzhang/llvm/llvm/lib/Target/PowerPC -I /home/shkzhang/llvm/llvm/include -I /home/shkzhang/llvm/llvm/lib/Target /home/shkzhang/llvm/llvm/lib/Target/PowerPC/PPC.td --write-if-changed -o /home/shkzhang/llvm/build/lib/Target/PowerPC/PPCGenInstrInfo.inc
```



各种编译生成的inc文件可在以下目录看到

```shell
ls /home/ken/llvm/build/lib/Target/PowerPC/*.inc
PPCGenAsmMatcher.inc   PPCGenDAGISel.inc             PPCGenFastISel.inc       PPCGenRegisterInfo.inc
PPCGenAsmWriter.inc    PPCGenDisassemblerTables.inc  PPCGenInstrInfo.inc      PPCGenSubtargetInfo.inc
PPCGenCallingConv.inc  PPCGenExegesis.inc            PPCGenMCCodeEmitter.inc
```





## 用脚本产生各种inc文件

产生td, inc, json等格式的脚本`genRecord.sh`，将该脚本放置于`~/workspace/OpenCL_Compiler/llvm/lib/Target/RISCV`。

```shell
set -x
export LLVM_HOME=/home/ken/workspace/OpenCL_Compiler
export PATH=$LLVM_HOME/build/bin:$PATH
export INCLUDE_PATH=$LLVM_HOME/llvm/include
export ARCH_TD=RISCV.td

# 清理之前的记录
if [ -d "Records" ]; then
    rm -rf Records
fi

mkdir Records

# 当前时间
current_time=$(date +'%Y%m%d_%H%M%S')

# 打印所有类和记录到标准输出
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --print-records > Records/printRecords_$current_time.td

# 导出 JSON 格式数据指令
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --dump-json > Records/DumpJson_$current_time.json

# 生成指令说明文档
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-instr-docs > Records/InstrDocs_$current_time.rst




# 打印扩展集以测试 DAG 表达式。（没有）
# llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --print-sets > Records/printSets_$current_time.td

# 以下是参考~/llvm/build/lib/Target/PowerPC/CMakeFiles/PowerPCCommonTableGen.dir/build.make
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-asm-matcher > Records/AsmMatcher_$current_time.inc
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-asm-writer > Records/AsmWriter_$current_time.inc
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-dag-isel > Records/DagIsel_$current_time.inc           # 生成 DAG（有向无环图）指令选择器。可能还没写
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-disassembler > Records/Disassembler_$current_time.inc
# llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-fast-isel > Records/FastIsel_$current_time.inc       # 某些架构报错，如RISCV
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-instr-info > Records/InstrInfo_$current_time.inc       # 生成指令描述
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-emitter > Records/CodeEmitter_$current_time.inc        # 生成机器代码生成器
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-register-info > Records/RegisterInfo_$current_time.inc
llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-subtarget > Records/Subtarget_$current_time.inc
# llvm-tblgen ${ARCH_TD} -I ${INCLUDE_PATH} --gen-exegesis > Records/Exegesis_$current_time.inc        # 某些架构报错，如RISCV

```





