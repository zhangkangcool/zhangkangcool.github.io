<h1 align="center">llvm option</h1>
https://llvm.comptechs.cn/docs/man/llc.html  各个选项的中文文档



## print-after-all print-before-all

- **Print IR after/before each pass**
- 針對目標函式，打印 IR 的一連串變換 (LLVM IR → DAG → Machine IR → MCInstr)，觀察何時產生問題代碼。
```shell
https://www.zhihu.com/question/67257302/answer/250858485
https://people.cs.nctu.edu.tw/~chenwj/dokuwiki/doku.php?id=llvm
```

- **using `-mllvm` to pass the option to the llvm backend through the `clang`**
- **using -mllvm -filter-print-funcs=main to filter the main function**
```shell
clang -O2 -c -mllvm -print-after-all func.c
clang -O2 -c -mllvm -print-after-all -mllvm -filter-print-funcs=main func.c
clang -mllvm -print-after-all bar.c -S -emit-llvm > log.txt 2 > &1
```

```shell
llc -print-after-all a.ll > a.log 2>&1
注意llc的默认优化级别是-O2，如果你是在O0情况下研究Pass，注意加上：
llc -O0 -print-after-all a.ll > a.log 2>&1
另外还有一个与之相对的选项是-print-before-all，在每个Pass之前的IR表示
```





##  -filter-print-funcs=main to filter the main function



## -filetype=

```shell
llc -O3 test -filetype=obj
```



# show registers name & type（for PPC）

```shell
-ppc-asm-full-reg-names  
-ppc-vsr-nums-as-vr
```

```shell
Format: lxsdx XT, RA, RB
-mattr=+vsx
-ppc-asm-full-reg-names                 -ppc-asm-full-reg-names     
-ppc-vsr-nums-as-vr
lxsdx f1, r3, r4 <--> lxsdx 1, 3, 4 <--> lxsdx vs1, r3, r4
lxsdx v2, r3, r4 <--> lxsdx 33,3, 4 <--> lxsdx vs33, r3, r4
```



```shell

-mattr=+vsx
llc -mcpu=pwr9 -mtriple=powerpc64le-unknown-unknown -enable-ppc-quad-precision -ppc-vsr-nums-as-vr -verify-machineinstrs -ppc-asm-full-reg-names f128-conv.ll
llc -mcpu=pwr9 -mtriple=powerpc64le-unknown-unknown -enable-ppc-quad-precision -verify-machineinstrs -ppc-asm-full-reg-names f128-conv.ll
llc -mcpu=pwr9 -mtriple=powerpc64le-unknown-unknown -enable-ppc-quad-precision -verify-machineinstrs  f128-conv.ll

```



##### Test case

```asm
declare i32 @llvm.experimental.vector.reduce.add.v4i32(<4 x i32> %a)

define i32 @_Z4testDv4_i(<4 x i32> %a) {
  %b = call i32 @llvm.experimental.vector.reduce.add.v4i32(<4 x i32> %a)
  ret i32 %b
}
```



`-ppc-vsr-nums-as-vr`

```asm
/xl_le/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/llc < test.ll -ppc-vsr-nums-as-vr
	.text
	.abiversion 2
	.file	"<stdin>"
	.globl	_Z4testDv4_i            # -- Begin function _Z4testDv4_i
	.p2align	4
	.type	_Z4testDv4_i,@function
_Z4testDv4_i:                           # @_Z4testDv4_i
.Lfunc_begin0:
	.cfi_startproc
# %bb.0:
	xxswapd	3, 2
	vadduwm 2, 2, 3
	xxspltw 3, 2, 2
	vadduwm 2, 2, 3
	xxswapd	0, 2
	mfvsrwz 3, 0
	blr
	.long	0
	.quad	0
.Lfunc_end0:
	.size	_Z4testDv4_i, .Lfunc_end0-.Lfunc_begin0
	.cfi_endproc
                                        # -- End function
	.section	".note.GNU-stack","",@progbits
```





`-ppc-asm-full-reg-names`

```asm
/xl_le/gsa/tlbgsa/projects/x/xlcmpbld/run/clang/main_trunk/rhel7_leppc/daily/latest/bin/llc < test.ll -ppc-asm-full-reg-names
	.text
	.abiversion 2
	.file	"<stdin>"
	.globl	_Z4testDv4_i            # -- Begin function _Z4testDv4_i
	.p2align	4
	.type	_Z4testDv4_i,@function
_Z4testDv4_i:                           # @_Z4testDv4_i
.Lfunc_begin0:
	.cfi_startproc
# %bb.0:
	xxswapd	vs35, vs34
	vadduwm v2, v2, v3
	xxspltw vs35, vs34, 2
	vadduwm v2, v2, v3
	xxswapd	vs0, vs34
	mfvsrwz r3, f0
	blr
	.long	0
	.quad	0
.Lfunc_end0:
	.size	_Z4testDv4_i, .Lfunc_end0-.Lfunc_begin0
	.cfi_endproc
                                        # -- End function
	.section	".note.GNU-stack","",@progbits
```



`-ppc-asm-full-reg-names -ppc-vsr-nums-as-vr`

```asm
lc < test.ll -ppc-asm-full-reg-names -ppc-vsr-nums-as-vr
	.text
	.abiversion 2
	.file	"<stdin>"
	.globl	_Z4testDv4_i            # -- Begin function _Z4testDv4_i
	.p2align	4
	.type	_Z4testDv4_i,@function
_Z4testDv4_i:                           # @_Z4testDv4_i
.Lfunc_begin0:
	.cfi_startproc
# %bb.0:
	xxlxor v3, v3, v3
	vsumsws v2, v2, v3
	xxswapd	vs0, v2
	mfvsrwz r3, f0
	blr
	.long	0
	.quad	0
.Lfunc_end0:
	.size	_Z4testDv4_i, .Lfunc_end0-.Lfunc_begin0
	.cfi_endproc
                                        # -- End function
```



```shell
	.text
	.abiversion 2
	.file	"test.ll"
	.globl	test                    # -- Begin function test
	.p2align	4
	.type	test,@function
test:                                   # @test
.Lfunc_begin0:
	.cfi_startproc
# %bb.0:                                # %entry
	xscmpudp cr0, f1, f2
	fmr f1, f3
	beqlr cr0
# %bb.1:                                # %entry
	fmr f1, f4
	blr
	.long	0
	.quad	0
.Lfunc_end0:
	.size	test, .Lfunc_end0-.Lfunc_begin0
	.cfi_endproc
                                        # -- End function
	.section	".note.GNU-stack","",@progbits
```



#### 注意：

吃回加了regname的asm时，`as`工具需要加上`-mregnames`选项。



# -flto

It will get llvm IR bitcode, if you want get the object file, you'd better remove the option `-flto`.

```shell
/home/shkzhang/llvm/build/bin/clang++ -c -o Playout.o -DSPEC -DNDEBUG -I. -DSPEC_AUTO_SUPPRESS_OPENMP     -O3 -m64 -mcpu=power9 -fexperimental-new-pass-manager  -fprofile-use=default.profdata -flto -Wl,-q  -Wl,-rpath=/home/shkzhang/llvm/build/lib      -DSPEC_LP64  Playout.cpp

[shkzhang@recycler:~/spec_clang_result/benchspec/CPU/541.leela_r/build/build_peak_clang_default.0000]$ file Playout.o
Playout.o: LLVM IR bitcode
```



得到的所有LLVM IR bitcode文件，先合成一个大的文件，然后编译成可执行文件。

```shell
/home/shkzhang/llvm/build/bin/clang++    -L/opt/at12.0/lib64 -Wl,-rpath=/opt/at12.0/lib64 -lhugetlbfs -Wl,-dynamic-linker /opt/at12.0/lib64/ld64.so.2    -O3 -m64 -mcpu=power9 -fexperimental-new-pass-manager  -fprofile-use=default.profdata -flto -Wl,-q  -Wl,-rpath=/home/shkzhang/llvm/build/lib       FullBoard.o KoState.o Playout.o TimeControl.o UCTSearch.o GameState.o Leela.o SGFParser.o Timing.o Utils.o FastBoard.o Matcher.o SGFTree.o TTable.o Zobrist.o FastState.o GTP.o MCOTable.o Random.o SMP.o UCTNode.o                      -o leela_r
```



------

# Target/Triple/Arch/CPU



- **-mtriple**=traget triple

  使用指定的字符串覆盖输入文件中指定的目标三元组。

  

- **-march**=arch(大的架构)

  指定要为其生成程序集的体系结构，覆盖输入文件中编码的目标。有关有效体系结构的列表，请参阅`llc -help`输出。默认情况下，这是从目标三元组推断或自动检测到当前架构。

  以下是可用于march的参数

  ```asm
  llc --version
    
  LLVM (http://llvm.org/):
    LLVM version 12.0.0git
    Optimized build with assertions.
    Default target: x86_64-unknown-linux-gnu
    Host CPU: icelake-client
  
    Registered Targets:
      aarch64    - AArch64 (little endian)
      aarch64_32 - AArch64 (little endian ILP32)
      aarch64_be - AArch64 (big endian)
      amdgcn     - AMD GCN GPUs
      arm        - ARM
      arm64      - ARM64 (little endian)
      arm64_32   - ARM64 (little endian ILP32)
      armeb      - ARM (big endian)
      avr        - Atmel AVR Microcontroller
      bpf        - BPF (host endian)
      bpfeb      - BPF (big endian)
      bpfel      - BPF (little endian)
      hexagon    - Hexagon
      lanai      - Lanai
      mips       - MIPS (32-bit big endian)
      mips64     - MIPS (64-bit big endian)
      mips64el   - MIPS (64-bit little endian)
      mipsel     - MIPS (32-bit little endian)
      msp430     - MSP430 [experimental]
      nvptx      - NVIDIA PTX 32-bit
      nvptx64    - NVIDIA PTX 64-bit
      ppc32      - PowerPC 32
      ppc64      - PowerPC 64
      ppc64le    - PowerPC 64 LE
      r600       - AMD GPUs HD2XXX-HD6XXX
      riscv32    - 32-bit RISC-V
      riscv64    - 64-bit RISC-V
      sparc      - Sparc
      sparcel    - Sparc LE
      sparcv9    - Sparc V9
      systemz    - SystemZ
      thumb      - Thumb
      thumbeb    - Thumb (big endian)
      wasm32     - WebAssembly 32-bit
      wasm64     - WebAssembly 64-bit
      x86        - 32-bit X86: Pentium-Pro and above
      x86-64     - 64-bit X86: EM64T and AMD64
      xcore      - XCore
  
  ```

  

- **-mcpu**=cpuname（某个架构下指定CPU）

  在当前体系结构中指定特定芯片以生成代码。默认情况下，这是从目标三元组推断出来的，并自动检测到当前架构。有关可用CPU的列表，请使用

  ```c++
  llc -march=ppc64le -mcpu=help   // 需先指定march
  
  Available CPUs for this target:
  
    440     - Select the 440 processor.
    450     - Select the 450 processor.
    601     - Select the 601 processor.
    602     - Select the 602 processor.
    603     - Select the 603 processor.
    603e    - Select the 603e processor.
    603ev   - Select the 603ev processor.
    604     - Select the 604 processor.
    604e    - Select the 604e processor.
    620     - Select the 620 processor.
    7400    - Select the 7400 processor.
    7450    - Select the 7450 processor.
    750     - Select the 750 processor.
    970     - Select the 970 processor.
    a2      - Select the a2 processor.
    e500    - Select the e500 processor.
    e500mc  - Select the e500mc processor.
    e5500   - Select the e5500 processor.
    future  - Select the future processor.
    g3      - Select the g3 processor.
    g4      - Select the g4 processor.
    g4+     - Select the g4+ processor.
    g5      - Select the g5 processor.
    generic - Select the generic processor.
    ppc     - Select the ppc processor.
    ppc32   - Select the ppc32 processor.
    ppc64   - Select the ppc64 processor.
    ppc64le - Select the ppc64le processor.
    pwr10   - Select the pwr10 processor.
    pwr3    - Select the pwr3 processor.
    pwr4    - Select the pwr4 processor.
    pwr5    - Select the pwr5 processor.
    pwr5x   - Select the pwr5x processor.
    pwr6    - Select the pwr6 processor.
    pwr6x   - Select the pwr6x processor.
    pwr7    - Select the pwr7 processor.
    pwr8    - Select the pwr8 processor.
    pwr9    - Select the pwr9 processor.
  ```

  

  **-mattr**=a1,+a2,-a3,…

  覆盖或控制目标的特定属性，例如是否启用SIMD操作。默认属性集由当前CPU设置。有关可用属性的列表，请使用：

  ```shell
  llc -march=ppc64le -mattr=help   // 需先指令march
  
  Available features for this target:
  
    64bit                          - Enable 64-bit instructions.
    64bitregs                      - Enable 64-bit registers usage for ppc32 [beta].
    allow-unaligned-fp-access      - CPU does not trap on unaligned FP access.
    altivec                        - Enable Altivec instructions.
    booke                          - Enable Book E instructions.
    bpermd                         - Enable the bpermd instruction.
    cmpb                           - Enable the cmpb instruction.
    crbits                         - Use condition-register bits individually.
    crypto                         - Enable POWER8 Crypto instructions.
    direct-move                    - Enable Power8 direct move instructions.
    e500                           - Enable E500/E500mc instructions.
    extdiv                         - Enable extended divide instructions.
    fcpsgn                         - Enable the fcpsgn instruction.
    float128                       - Enable the __float128 data type for IEEE-754R Binary128..
    fpcvt                          - Enable fc[ft]* (unsigned and single-precision) and lfiwzx instructions.
    fprnd                          - Enable the fri[mnpz] instructions.
    fpu                            - Enable classic FPU instructions.
    fre                            - Enable the fre instruction.
    fres                           - Enable the fres instruction.
    frsqrte                        - Enable the frsqrte instruction.
    frsqrtes                       - Enable the frsqrtes instruction.
    fsqrt                          - Enable the fsqrt instruction.
    fuse-addi-load                 - Power8 Addi-Load fusion.
    fuse-addis-load                - Power8 Addis-Load fusion.
    fuse-store                     - Target supports store clustering.
    fusion                         - Target supports instruction fusion.
    hard-float                     - Enable floating-point instructions.
    htm                            - Enable Hardware Transactional Memory instructions.
    icbt                           - Enable icbt instruction.
    invariant-function-descriptors - Assume function descriptors are invariant.
    isa-v30-instructions           - Enable instructions in ISA 3.0..
    isa-v31-instructions           - Enable instructions in ISA 3.1..
    isel                           - Enable the isel instruction.
    ldbrx                          - Enable the ldbrx instruction.
    lfiwax                         - Enable the lfiwax instruction.
    longcall                       - Always use indirect calls.
    mfocrf                         - Enable the MFOCRF instruction.
    mma                            - Enable MMA instructions.
    msync                          - Has only the msync instruction instead of sync.
    paired-vector-memops           - 32Byte load and store instructions.
    partword-atomics               - Enable l[bh]arx and st[bh]cx..
    pcrelative-memops              - Enable PC relative Memory Ops.
    popcntd                        - Enable the popcnt[dw] instructions.
    power10-vector                 - Enable POWER10 vector instructions.
    power8-altivec                 - Enable POWER8 Altivec instructions.
    power8-vector                  - Enable POWER8 vector instructions.
    power9-altivec                 - Enable POWER9 Altivec instructions.
    power9-vector                  - Enable POWER9 vector instructions.
    ppc-postra-sched               - Use PowerPC post-RA scheduling strategy.
    ppc-prera-sched                - Use PowerPC pre-RA scheduling strategy.
    ppc4xx                         - Enable PPC 4xx instructions.
    ppc6xx                         - Enable PPC 6xx instructions.
    predictable-select-expensive   - Prefer likely predicted branches over selects.
    prefix-instrs                  - Enable prefixed instructions.
    recipprec                      - Assume higher precision reciprocal estimates.
    secure-plt                     - Enable secure plt mode.
    slow-popcntd                   - Has slow popcnt[dw] instructions.
    spe                            - Enable SPE instructions.
    stfiwx                         - Enable the stfiwx instruction.
    two-const-nr                   - Requires two constant Newton-Raphson computation.
    vectors-use-two-units          - Vectors use two units.
    vsx                            - Enable VSX instructions.
  
  Use +feature to enable a feature, or -feature to disable it.
  For example, llc -mcpu=mycpu -mattr=+feature1,-feature2
  
  ```



