# example

```c++
#include <stdio.h>
#include <stdlib.h>
#include <CL/opencl.h>

// OpenCL 内核代码 - 向量加法
const char *kernelSource = 
"__kernel void vector_add(__global const float *A,    \n"
"                         __global const float *B,    \n"
"                         __global float *C,          \n"
"                         const unsigned int n)       \n"
"{                                                    \n"
"    int i = get_global_id(0);                       \n"
"    if (i < n) {                                    \n"
"        C[i] = A[i] + B[i];                         \n"
"    }                                               \n"
"}                                                    \n";

#define VECTOR_SIZE 1024

int main(void) {
    // 主机端数据
    float *h_A = (float*)malloc(sizeof(float) * VECTOR_SIZE);
    float *h_B = (float*)malloc(sizeof(float) * VECTOR_SIZE);
    float *h_C = (float*)malloc(sizeof(float) * VECTOR_SIZE);
    
    // 初始化输入向量
    printf("初始化向量数据...\n");
    for(int i = 0; i < VECTOR_SIZE; i++) {
        h_A[i] = (float)i;
        h_B[i] = (float)(i * 2);
    }
    
    // OpenCL 变量
    cl_platform_id platform_id = NULL;
    cl_device_id device_id = NULL;
    cl_context context = NULL;
    cl_command_queue command_queue = NULL;
    cl_mem d_A = NULL;
    cl_mem d_B = NULL;
    cl_mem d_C = NULL;
    cl_program program = NULL;
    cl_kernel kernel = NULL;
    cl_uint ret_num_devices;
    cl_uint ret_num_platforms;
    cl_int ret;
    
    // 1. 获取平台
    ret = clGetPlatformIDs(1, &platform_id, &ret_num_platforms);
    if (ret != CL_SUCCESS) {
        printf("错误: 获取平台失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("找到 %d 个 OpenCL 平台\n", ret_num_platforms);
    
    // 获取平台名称
    char platform_name[128];
    clGetPlatformInfo(platform_id, CL_PLATFORM_NAME, sizeof(platform_name), platform_name, NULL);
    printf("平台名称: %s\n", platform_name);
    
    char platform_version[128];
    clGetPlatformInfo(platform_id, CL_PLATFORM_VERSION, sizeof(platform_version), platform_version, NULL);
    printf("平台版本: %s\n", platform_version);
    
    // 2. 获取设备
    ret = clGetDeviceIDs(platform_id, CL_DEVICE_TYPE_DEFAULT, 1, &device_id, &ret_num_devices);
    if (ret != CL_SUCCESS) {
        printf("错误: 获取设备失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("找到 %d 个 OpenCL 设备\n", ret_num_devices);
    
    // 获取设备名称
    char device_name[128];
    clGetDeviceInfo(device_id, CL_DEVICE_NAME, sizeof(device_name), device_name, NULL);
    printf("设备名称: %s\n", device_name);
    
    // 3. 创建上下文
    context = clCreateContext(NULL, 1, &device_id, NULL, NULL, &ret);
    if (ret != CL_SUCCESS) {
        printf("错误: 创建上下文失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("OpenCL 上下文创建成功\n");
    
    // 4. 创建命令队列
    command_queue = clCreateCommandQueueWithProperties(context, device_id, NULL, &ret);
    if (ret != CL_SUCCESS) {
        // 尝试使用旧版 API (OpenCL 1.x)
        command_queue = clCreateCommandQueue(context, device_id, 0, &ret);
    }
    if (ret != CL_SUCCESS) {
        printf("错误: 创建命令队列失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("命令队列创建成功\n");
    
    // 5. 创建缓冲区对象
    d_A = clCreateBuffer(context, CL_MEM_READ_ONLY, 
                         VECTOR_SIZE * sizeof(float), NULL, &ret);
    if (ret != CL_SUCCESS) {
        printf("错误: 创建缓冲区 A 失败! 错误代码: %d\n", ret);
        return -1;
    }
    
    d_B = clCreateBuffer(context, CL_MEM_READ_ONLY,
                         VECTOR_SIZE * sizeof(float), NULL, &ret);
    if (ret != CL_SUCCESS) {
        printf("错误: 创建缓冲区 B 失败! 错误代码: %d\n", ret);
        return -1;
    }
    
    d_C = clCreateBuffer(context, CL_MEM_WRITE_ONLY,
                         VECTOR_SIZE * sizeof(float), NULL, &ret);
    if (ret != CL_SUCCESS) {
        printf("错误: 创建缓冲区 C 失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("设备缓冲区创建成功\n");
    
    // 6. 将数据传输到设备
    ret = clEnqueueWriteBuffer(command_queue, d_A, CL_TRUE, 0,
                               VECTOR_SIZE * sizeof(float), h_A, 0, NULL, NULL);
    ret |= clEnqueueWriteBuffer(command_queue, d_B, CL_TRUE, 0,
                                VECTOR_SIZE * sizeof(float), h_B, 0, NULL, NULL);
    if (ret != CL_SUCCESS) {
        printf("错误: 数据传输到设备失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("数据已传输到设备\n");
    
    // 7. 创建程序对象
    program = clCreateProgramWithSource(context, 1, &kernelSource, NULL, &ret);
    if (ret != CL_SUCCESS) {
        printf("错误: 创建程序对象失败! 错误代码: %d\n", ret);
        return -1;
    }
    
    // 8. 编译程序
    ret = clBuildProgram(program, 1, &device_id, NULL, NULL, NULL);
    if (ret != CL_SUCCESS) {
        printf("错误: 编译程序失败! 错误代码: %d\n", ret);
        
        // 获取编译日志
        size_t log_size;
        clGetProgramBuildInfo(program, device_id, CL_PROGRAM_BUILD_LOG, 0, NULL, &log_size);
        char *log = (char*)malloc(log_size);
        clGetProgramBuildInfo(program, device_id, CL_PROGRAM_BUILD_LOG, log_size, log, NULL);
        printf("编译日志:\n%s\n", log);
        free(log);
        return -1;
    }
    printf("内核程序编译成功\n");
    
    // 9. 创建内核对象
    kernel = clCreateKernel(program, "vector_add", &ret);
    if (ret != CL_SUCCESS) {
        printf("错误: 创建内核失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("内核对象创建成功\n");
    
    // 10. 设置内核参数
    unsigned int vector_size = VECTOR_SIZE;
    ret = clSetKernelArg(kernel, 0, sizeof(cl_mem), (void *)&d_A);
    ret |= clSetKernelArg(kernel, 1, sizeof(cl_mem), (void *)&d_B);
    ret |= clSetKernelArg(kernel, 2, sizeof(cl_mem), (void *)&d_C);
    ret |= clSetKernelArg(kernel, 3, sizeof(unsigned int), (void *)&vector_size);
    if (ret != CL_SUCCESS) {
        printf("错误: 设置内核参数失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("内核参数设置成功\n");
    
    // 11. 执行内核
    size_t global_work_size = VECTOR_SIZE;
    size_t local_work_size = 64;  // 工作组大小
    
    printf("执行内核计算...\n");
    ret = clEnqueueNDRangeKernel(command_queue, kernel, 1, NULL,
                                 &global_work_size, &local_work_size, 0, NULL, NULL);
    if (ret != CL_SUCCESS) {
        printf("错误: 执行内核失败! 错误代码: %d\n", ret);
        return -1;
    }
    
    // 12. 读取结果
    ret = clEnqueueReadBuffer(command_queue, d_C, CL_TRUE, 0,
                              VECTOR_SIZE * sizeof(float), h_C, 0, NULL, NULL);
    if (ret != CL_SUCCESS) {
        printf("错误: 读取结果失败! 错误代码: %d\n", ret);
        return -1;
    }
    printf("结果已从设备读取\n");
    
    // 13. 验证结果
    printf("\n验证结果...\n");
    int errors = 0;
    for(int i = 0; i < VECTOR_SIZE; i++) {
        float expected = h_A[i] + h_B[i];
        if (h_C[i] != expected) {
            if (errors < 10) {  // 只打印前10个错误
                printf("错误 [%d]: 期望 %.2f, 实际 %.2f\n", i, expected, h_C[i]);
            }
            errors++;
        }
    }
    
    if (errors == 0) {
        printf("✓ 验证成功! 所有 %d 个元素计算正确\n", VECTOR_SIZE);
        printf("\n示例结果 (前10个元素):\n");
        for(int i = 0; i < 10; i++) {
            printf("  %.2f + %.2f = %.2f\n", h_A[i], h_B[i], h_C[i]);
        }
    } else {
        printf("✗ 验证失败! 发现 %d 个错误\n", errors);
    }
    
    // 14. 清理资源
    clFlush(command_queue);
    clFinish(command_queue);
    clReleaseKernel(kernel);
    clReleaseProgram(program);
    clReleaseMemObject(d_A);
    clReleaseMemObject(d_B);
    clReleaseMemObject(d_C);
    clReleaseCommandQueue(command_queue);
    clReleaseContext(context);
    
    free(h_A);
    free(h_B);
    free(h_C);
    
    printf("\n程序执行完毕!\n");
    return 0;
}
```

