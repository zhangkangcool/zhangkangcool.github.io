<h1 align="center">Lnt</h1>
http://llvm.org/docs/lnt/quickstart.html
http://llvm.org/docs/lnt/tests.html



lnt is the test-suite

lit is the check-all

# Viewing Results

```shell
lnt create ~/myperfdb
lnt import ~/myperfdb SANDBOX/test-<stamp>/report.json
~myperfdb/lnt.wsgi

lnt runtest nt --sandbox ~/run/ --cc ~/work/install/bin/clang --test-suite ~/llvm-test-suite/ --make-param="RUNUNDER=taskset -c 1" --benchmarking-only --threads 1 --build-threads 16  --run-order "$1" --cflag -mcpu=pwr9  --optimize-option -O3

lnt runtest nt --sandbox /home/ken/llvm_cdl/log/ --cc /home/ken/llvm/build/bin/clang --cxx /home/ken/llvm/build/bin/clang++ --test-suite /home/ken/llvm_cdl/llvm-test-suite --make-param="RUNUNDER=taskset -c 1" --benchmarking-only --threads 1 --build-threads 16  --run-order "$1" --cflag -mcpu=pwr8  --optimize-option -O3

You should give different --run-order number

```


```shell

lnt runtest nt --sandbox /home/ken/llvm_cdl/log/ --cc /home/ken/llvm/build/bin/clang --test-suite /home/ken/llvm_cdl/llvm-test-suite --make-param="RUNUNDER=taskset -c 1" --benchmarking-only --threads 1 --build-threads 16  --run-order "$1" --cflag -mcpu=pwr8  --optimize-option -O3


lnt runtest nt --sandbox $HOME/llvm_cdl/log/ --cc $HOME/llvm/build/bin/clang --test-suite $HOME/llvm_cdl/llvm-test-suite --make-param="RUNUNDER=taskset -c 1" --benchmarking-only --threads 1 --build-threads 64  --run-order 1234 --cflag -mcpu=pwr8  --optimize-option -O3


lnt runtest nt --sandbox /home/ken/llvm_cdl/log/ --cc /home/ken/llvm/build/bin/clang --cxx /home/ken/llvm/build/bin/clang++ --test-suite /home/ken/llvm_cdl/llvm-test-suite  --benchmarking-only --threads 64 --build-threads 64  --run-order 5678 --cflag -mcpu=pwr8


lnt runtest nt --sandbox $HOME/llvm_cdl/log/ --cc $HOME/llvm/build/bin/clang --cxx $HOME/llvm/build/bin/clang++ --test-suite $HOME/llvm_cdl/llvm-test-suite  --benchmarking-only --threads 64 --build-threads 64  --run-order 5678 --cflag -mcpu=pwr8
```