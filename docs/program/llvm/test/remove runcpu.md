I've made a shell script called *dispatchSPEC.sh* (located at `/gsa/tlbgsa/projects/x/xlbe/bebuild/SPEC2017_BINARIES/dispatchSPEC.sh` currently) that allows you to use either the simplified environment format (use XL or CLANG for last argument) or SPEC script binaries (use SPEC for last argument) to run on a dispatch machine

How to use:

```shell
./dispatchSPEC.sh <path to binaries> <dispatch machine> [base|peak] <# of copies> "<benchmarks to run>" [XL|CLANG|SPEC|SPEC_profile]

e.g. ./dispatchSPEC.sh /home/adandrea/wy1copy_all tejas base 1 "503 508" SPEC
runSpec /gsa/tlbgsa/projects/x/xlcdl/czhengsz/llvm/llvm_change_built/ tejas peak 1 "508 510 511 519 526 538 544 500 502 505 520 523 525 531 541 557" SPEC 
```



New version at same location (i.e.  `/gsa/tlbgsa/projects/x/xlbe/bebuild/SPEC2017_BINARIES/dispatchSPEC.sh`) will go one by one through your benchmarks and dispatch them separately.  Also, if you use `SPEC_profile` as the last argument it should send you back a perf.report and perf.annotate file corresponding to `perf report` and `perf annotate` on a single copy (even for full width).  Also, the log file from the run has now also been included in your results tarball

