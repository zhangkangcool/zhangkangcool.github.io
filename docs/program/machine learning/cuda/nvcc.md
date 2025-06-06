<h1 align="center">nvcc</h1>




https://wangpengcheng.github.io/2019/04/17/nvcc_learn_note/



即使编译，即程序运行时，再根据当前的GPU编译成自己计算能力动态编译成应用程序。这就可以让GPU选择想要的版本进行编译。即双compute_的组合。但这种只能保证同一代的兼容性。 注意：当GPU计算能力低于编译的虚拟框架时，JIT将失败。





总体而言，nvcc更像是qmake进行相关makefile和预处理代码的生成，调用gcc生成host二进制文件，调用cicc、ptxas、fatbinary分别生成汇编代码、机器码、静态代码。最后使用nvlink链接生成.obj文件，使用gcc link生成最终的可执行文件。





