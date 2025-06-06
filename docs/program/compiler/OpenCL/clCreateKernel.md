<h1 align="center">clCreateKernel</h1>






`clCreateKernel` 是 OpenCL（Open Computing Language）中的一个重要函数，其作用是从程序对象里创建一个内核对象。OpenCL 是一种用于并行计算的开放标准，可让你在多种异构平台（像 CPU、GPU、FPGA 等）上执行代码。



```c
cl_kernel clCreateKernel(
    cl_program program,
    const char *kernel_name,
    cl_int *errcode_ret
);
```



### 参数解释

- `program`：一个已经构建好的 OpenCL 程序对象。使用三个clCreateProgramWith系列函数创建。
- `kernel_name`：要创建内核的名称，它必须和 OpenCL 程序源文件里定义的内核函数名一致。
- `errcode_ret`：用于返回错误码的指针，若不需要该信息，可将其设为 `NULL`。

```c++
#include <stdio.h>
#include <stdlib.h>
#include <CL/cl.h>

#define ARRAY_SIZE 1024

// OpenCL kernel source code
const char *kernelSource =
    "__kernel void simple_kernel(__global int *input, __global int *output) {\n"
    "    int gid = get_global_id(0);\n"
    "    output[gid] = input[gid] * 2;\n"
    "}\n";

int main() {
    cl_platform_id platform_id = NULL;
    cl_device_id device_id = NULL;
    cl_uint ret_num_devices;
    cl_uint ret_num_platforms;
    cl_int ret;

    // Get platform and device information
    ret = clGetPlatformIDs(1, &platform_id, &ret_num_platforms);
    ret = clGetDeviceIDs(platform_id, CL_DEVICE_TYPE_DEFAULT, 1, &device_id, &ret_num_devices);

    // Create an OpenCL context
    cl_context context = clCreateContext(NULL, 1, &device_id, NULL, NULL, &ret);

    // Create a command queue
    cl_command_queue command_queue = clCreateCommandQueue(context, device_id, 0, &ret);

    // Create memory buffers on the device for the input and output arrays
    int *input = (int *)malloc(ARRAY_SIZE * sizeof(int));
    int *output = (int *)malloc(ARRAY_SIZE * sizeof(int));
    for (int i = 0; i < ARRAY_SIZE; i++) {
        input[i] = i;
    }
    cl_mem input_buffer = clCreateBuffer(context, CL_MEM_READ_ONLY, ARRAY_SIZE * sizeof(int), NULL, &ret);
    cl_mem output_buffer = clCreateBuffer(context, CL_MEM_WRITE_ONLY, ARRAY_SIZE * sizeof(int), NULL, &ret);

    // Copy the input array to the input buffer
    ret = clEnqueueWriteBuffer(command_queue, input_buffer, CL_TRUE, 0, ARRAY_SIZE * sizeof(int), input, 0, NULL, NULL);

    // Create a program from the kernel source code
    cl_program program = clCreateProgramWithSource(context, 1, (const char **)&kernelSource, NULL, &ret);

    // Build the program
    ret = clBuildProgram(program, 1, &device_id, NULL, NULL, NULL);

    // Create the OpenCL kernel
    cl_kernel kernel = clCreateKernel(program, "simple_kernel", &ret);
    if (ret != CL_SUCCESS) {
        printf("Error creating kernel: %d\n", ret);
        return -1;
    }

    // Set the arguments of the kernel
    ret = clSetKernelArg(kernel, 0, sizeof(cl_mem), (void *)&input_buffer);
    ret = clSetKernelArg(kernel, 1, sizeof(cl_mem), (void *)&output_buffer);

    // Execute the OpenCL kernel on the list
    size_t global_item_size = ARRAY_SIZE;
    size_t local_item_size = 64;
    ret = clEnqueueNDRangeKernel(command_queue, kernel, 1, NULL, &global_item_size, &local_item_size, 0, NULL, NULL);

    // Read the memory buffer C on the device to the local variable C
    ret = clEnqueueReadBuffer(command_queue, output_buffer, CL_TRUE, 0, ARRAY_SIZE * sizeof(int), output, 0, NULL, NULL);

    // Display the result
    for (int i = 0; i < ARRAY_SIZE; i++) {
        printf("output[%d] = %d\n", i, output[i]);
    }

    // Clean up
    ret = clFlush(command_queue);
    ret = clFinish(command_queue);
    ret = clReleaseKernel(kernel);
    ret = clReleaseProgram(program);
    ret = clReleaseMemObject(input_buffer);
    ret = clReleaseMemObject(output_buffer);
    ret = clReleaseCommandQueue(command_queue);
    ret = clReleaseContext(context);
    free(input);
    free(output);

    return 0;
}    
```



