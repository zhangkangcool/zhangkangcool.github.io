<h1 align="center">Opt level</h1>
## With version 3.8 the passes are as follow:

https://stackoverflow.com/questions/15548023/clang-optimization-levels
http://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O1

- #### baseline (-O0): default

opt sets : -targetlibinfo -tti -verify
clang adds : -mdisable-fp-elim -mrelax-all

- #### －O1 is based on -O0

  opt adds: -globalopt -demanded-bits -branch-prob -inferattrs -ipsccp -dse -loop-simplify -scoped-noalias -barrier -adce -deadargelim -memdep -licm -globals-aa -rpo-functionattrs -basiccg -loop-idiom -forceattrs -mem2reg -simplifycfg -early-cse -instcombine -sccp -loop-unswitch -loop-vectorize -tailcallelim -functionattrs -loop-accesses -memcpyopt -loop-deletion -reassociate -strip-dead-prototypes -loops -basicaa -correlated-propagation -lcssa -domtree -always-inline -aa -block-freq -float2int -lower-expect -sroa -loop-unroll -alignment-from-assumptions -lazy-value-info -prune-eh -jump-threading -loop-rotate -indvars -bdce -scalar-evolution -tbaa -assumption-cache-tracker
  clang adds : -momit-leaf-frame-pointer
  clang drops : -mdisable-fp-elim -mrelax-all

- #### -O2 is based on -O1

opt adds: -elim-avail-extern -mldst-motion -slp-vectorizer -gvn -inline -globaldce -constmerge
opt drops: -always-inline
clang adds: -vectorize-loops -vectorize-slp

- #### -O3 is based on -O2

opt adds: -argpromotion
-Ofast is based on -O3, valid in clang but not in opt

clang adds: -fno-signed-zeros -freciprocal-math -ffp-contract=fast -menable-unsafe-fp-math -menable-no-nans -menable-no-infs

- #### -Os is the same as -O2

- #### -Oz is based on -Os

opt drops: -slp-vectorizer
clang drops: -vectorize-loops

```
–Ox flags: Specify which optimization level to use. -O0 means "no optimization":
this level compiles the fastest and generates the most debuggable code. -O2 is a
moderate level of optimization which enables most optimizations. -Os is like -O2
with extra optimizations to reduce code size. -Oz is like -Os (and thus -O2), but
reduces code size further. -O3 is like -O2, except that it enables optimizations that
take longer to perform or that may generate larger code (in an attempt to make the
program run faster). On supported platforms, -O4 enables link-time optimization;
object files are stored in the LLVM bitcode file format and whole program
optimization is done at link time. -O1 is somewhere between -O0 and -O2.
```



```shell


    -O0 Means “no optimization”: this level compiles the fastest and generates the most debuggable code.

    -O1 Somewhere between -O0 and -O2.

    -O2 Moderate level of optimization which enables most optimizations.

    -O3 Like -O2, except that it enables optimizations that take longer to perform or that may generate larger code (in an attempt to make the program run faster).

    -Ofast Enables all the optimizations from -O3 along with other aggressive optimizations that may violate strict compliance with language standards.

    -Os Like -O2 with extra optimizations to reduce code size.

    -Oz Like -Os (and thus -O2), but reduces code size further.

    -Og Like -O1. In future versions, this option might disable different optimizations in order to improve debuggability.

    -O Equivalent to -O2.

    -O4 and higher

        Currently equivalent to -O3


```

`gcc -O` is equal `gcc -O1`. 

# How to use

the `opt` is defaut use the ll file or bc file. And the output is bc file. If you want to the output is ll file, you should use the `-S`.
```
opt -O3 sum.ll -o sum.O3.ll
opt -O3 sum.ll -o sum.O3.ll -S
```





```asm

  --O0                                               - Optimization level 0. Similar to clang -O0
  --O1                                               - Optimization level 1. Similar to clang -O1
  --O2                                               - Optimization level 2. Similar to clang -O2
  --O3                                               - Optimization level 3. Similar to clang -O3
  --Os                                               - Like -O2 with extra optimizations for size. Similar to clang -Os
  --Oz                                               - Like -Os but reduces code size further. Similar to clang -Oz
  -S                                                 - Write output as LLVM assembly
```

