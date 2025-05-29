# If you have error for below

```
/home/zhehao/programs/research/reference-chip/riscv-tools/riscv-gnu-toolchain/build/src/binutils/gas/as.c:635:5: error: ‘TARGET_ALIAS’ undeclared (first use in this function)
```
You should:
```
unset LIBRARY_PATH CPATH C_INCLUDE_PATH PKG_CONFIG_PATH CPLUS_INCLUDE_PATH INCLUDE
```
