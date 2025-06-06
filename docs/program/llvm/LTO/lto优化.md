<h1 align="center">lto优化</h1>
http://llvm.org/docs/LinkTimeOptimization.html

https://blog.csdn.net/zhajio/article/details/79640155

https://reviews.llvm.org/D77231

# 1 No lto

```shell
[shkzhang@recycler:~/testcpp/linker/test/nolto]$ clang++ foo.cpp main.cpp -Wl,-plugin-opt=save-temps

[shkzhang@recycler:~/testcpp/linker/test/nolto]$ ls
a.out  a.out.resolution.txt  foo.cpp  main.cpp

[shkzhang@recycler:~/testcpp/linker/test/nolto]$ file a.*
a.out:                ELF 64-bit LSB executable, 64-bit PowerPC or cisco 7500, version 1 (SYSV), dynamically linked, interpreter /lib64/ld64.so.2, for GNU/Linux 3.10.0, not stripped
a.out.resolution.txt: empty
```

For some simple case, `a.out.resolution.txt` is empty.



# 2 Has lto

### 2.1 no emit-asm

### Uee `-flto  -Wl,-plugin-opt=save-temps` to get the temp files.

```shell
[shkzhang@recycler:~/testcpp/linker/test/nolto]$ clang++ foo.cpp main.cpp -Wl,-plugin-opt=save-temps -flto


[shkzhang@recycler:~/testcpp/linker/test/nolto]$ file a.*
a.out:                    ELF 64-bit LSB executable, 64-bit PowerPC or cisco 7500, version 1 (SYSV), dynamically linked, interpreter /lib64/ld64.so.2, for GNU/Linux 3.10.0, not stripped
a.out.0.0.preopt.bc:      LLVM IR bitcode
a.out.0.2.internalize.bc: LLVM IR bitcode
a.out.0.4.opt.bc:         LLVM IR bitcode
a.out.0.5.precodegen.bc:  LLVM IR bitcode
a.out.lto.o:              ELF 64-bit LSB relocatable, 64-bit PowerPC or cisco 7500, version 1 (SYSV), not stripped
a.out.resolution.txt:     ASCII text


[shkzhang@recycler:~/testcpp/linker/test/nolto]$ ls
a.out                a.out.0.2.internalize.bc  a.out.0.5.precodegen.bc  a.out.resolution.txt  main.cpp
a.out.0.0.preopt.bc  a.out.0.4.opt.bc          a.out.lto.o              foo.cpp
```



LTO merges the IR for all files being linked and optimizes them as a 
single monolithic module. 

1. preopt.b: the merged IR just after merging and before performing any LTO optimizations.
2.  internalize.bc is after performing whole program internalization. 
3. opt.bc is after the optimization pipeline,
4. precodegen.bc is immediately before native 
5. code generation.



### Get the asm

Below command is equal

`-plugin-opt=emit-asm` is qual to `--lto-emit-asm`.

```shell
clang++ foo.cpp main.cpp -Wl,-plugin-opt=save-temps -flto -Wl,-plugin-opt=emit-asm
clang++ foo.cpp main.cpp -Wl,-plugin-opt=save-temps -flto -Wl,--lto-emit-asm
```



```shell
[shkzhang@recycler:~/testcpp/linker/test/test]$ clang++ foo.cpp main.cpp -Wl,-plugin-opt=save-temps -flto -Wl,-plugin-opt=emit-asm


[shkzhang@recycler:~/testcpp/linker/test/test]$ ls
a.out                a.out.0.2.internalize.bc  a.out.0.5.precodegen.bc  a.out.resolution.txt  main.cpp
a.out.0.0.preopt.bc  a.out.0.4.opt.bc          a.out.lto.o              foo.cpp


[shkzhang@recycler:~/testcpp/linker/test/test]$ file a.*
a.out:                    assembler source, ASCII text
a.out.0.0.preopt.bc:      LLVM IR bitcode
a.out.0.2.internalize.bc: LLVM IR bitcode
a.out.0.4.opt.bc:         LLVM IR bitcode
a.out.0.5.precodegen.bc:  LLVM IR bitcode
a.out.lto.o:              assembler source, ASCII text
a.out.resolution.txt:     ASCII text
```

`a.out` and `a.out.lto.o` will be same and they are the assembly file.





在SPEC的peak中，.o文件是bitcode，可以使用下面的命令得到assembly:

```shell
 /home/shkzhang/Wrappers_SPEC_cpu2017/bin/clang++    -L/opt/at12.0//lib64 -Wl,-rpath=/opt/at12.0//lib64 -lhugetlbfs -Wl,-dynamic-linker /opt/at12.0//lib64/ld64.so.2   -mllvm -aggressive-late-full-unroll -O3 -mcpu=native -fexperimental-new-pass-manager -mllvm -enable-ppc-gen-scalar-mass -mllvm -vector-library=MASSV  -fprofile-generate  -DSPEC_LP64     FullBoard.o KoState.o Playout.o TimeControl.o UCTSearch.o GameState.o Leela.o SGFParser.o Timing.o Utils.o FastBoard.o Matcher.o SGFTree.o TTable.o Zobrist.o FastState.o GTP.o MCOTable.o Random.o SMP.o UCTNode.o                  -L/xl_le/compgpfs/builds/continuous.dev/ppc64le/ubuntu16/mass.dev.le/latest/leppc/ -lxlopt -lmass    -o a.dis -Wl,--lto-emit-asm
```

