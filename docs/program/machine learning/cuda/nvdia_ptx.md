<h1 align="center">nvdia_ptx</h1>






















## [How to get the assembly code of a CUDA kernel?](https://stackoverflow.com/questions/20482686/how-to-get-the-assembly-code-of-a-cuda-kernel)

https://stackoverflow.com/questions/20482686/how-to-get-the-assembly-code-of-a-cuda-kernel

```asm
# kernel.cu -> ptx
nvcc -ptx -o kernel.ptx kernel.cu
```

 

https://docs.nvidia.com/cuda/cuda-binary-utilities/index.html#axzz36AnCbaAh

```asm
cuobjdump
nvdisasm
```





```shell
nvcc ptx.ptx --cubin

--cubin --fatbin --device-c --device-link
```



