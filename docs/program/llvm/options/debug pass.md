http://llvm.org/docs/Passes.html

## time-passes

Get the time for every pass

```
opt sum.bc -time-passes -domtree -instcount -o sum-tmp.bc

===-------------------------------------------------------------------------===
                      ... Pass execution timing report ...
===-------------------------------------------------------------------------===
  Total Execution Time: 0.0001 seconds (0.0001 wall clock)

   ---User Time---   --User+System--   ---Wall Time---  --- Name ---
   0.0001 ( 90.4%)   0.0001 ( 90.4%)   0.0001 ( 91.0%)  Bitcode Writer
   0.0000 (  5.1%)   0.0000 (  5.1%)   0.0000 (  4.8%)  Module Verifier
   0.0000 (  2.9%)   0.0000 (  2.9%)   0.0000 (  3.0%)  Dominator Tree Construction
   0.0000 (  1.5%)   0.0000 (  1.5%)   0.0000 (  1.2%)  Counts the various types of Instructions
   0.0001 (100.0%)   0.0001 (100.0%)   0.0001 (100.0%)  Total

===-------------------------------------------------------------------------===
                                LLVM IR Parsing
===-------------------------------------------------------------------------===
  Total Execution Time: 0.0002 seconds (0.0002 wall clock)

   ---User Time---   --User+System--   ---Wall Time---  --- Name ---
   0.0002 (100.0%)   0.0002 (100.0%)   0.0002 (100.0%)  Parse IR
   0.0002 (100.0%)   0.0002 (100.0%)   0.0002 (100.0%)  Total

```

## stats

```
$ opt sum.bc -mem2reg -instcount -o sum-tmp.bc -stats
===----------------------------------------------------------------------
---===
... Statistics Collected ...
===----------------------------------------------------------------------
---===
1 instcount - Number of Add insts
1 instcount - Number of Ret insts
1 instcount - Number of basic blocks
2 instcount - Number of instructions (of all types)
1 instcount - Number of non-external functions
2 mem2reg - Number of alloca's promoted
2 mem2reg - Number of alloca's promoted with a single store
```

Or you can use `stats` in clang

```
clang -Xclang -print-stats -emit-llvm -O1 sum.c -c -o sum-O1.bc
```

## -debug-pass=Structure

print the pass the mem2reg will use.

```
opt sum-O0.ll -debug-pass=Structure -mem2reg -S -o sum-O1.ll

Pass Arguments:  -targetlibinfo -tti -targetpassconfig -assumption-cache-tracker -domtree -mem2reg -verify -print-module
Target Library Information
Target Transform Information
Target Pass Configuration
Assumption Cache Tracker
  ModulePass Manager
    FunctionPass Manager
      Dominator Tree Construction
      Promote Memory to Register
      Module Verifier
    Print Module IR

```

