

CLMath/source/opencv-4.2.0-org/opencv-4.2.0/modules/imgproc/src/opencl/morph.cl

```c++
#ifdef DOUBLE_SUPPORT
#ifdef cl_amd_fp64
...
```





在 `source/opencv-4.2.0-org/opencv-4.2.0/build/modules/imgproc/opencl_kernels_imgproc.cpp`中，该文件其实由上述`morph_debug.cl`生成。

```c++
struct cv::ocl::internal::ProgramEntry morph_oclsrc={moduleName, "morph",
"#ifdef DOUBLE_SUPPORT\n"
"#ifdef cl_amd_fp64\n"
...
}
```



在`morph.dispatch.cpp`中，可以看到该函数morph_debug_oclsrc的使用

```c++
    std::vector<ocl::Kernel> kernels(iterations);
    for (int i = 0; i < iterations; i++) 
    {
        int current_op = iterations == i + 1 ? actual_op : op;
        String buildOptions = format("-D RADIUSX=%d -D RADIUSY=%d -D LSIZE0=%d -D LSIZE1=%d -D %s%s"
                                     " -D PROCESS_ELEMS=%s -D T=%s -D DEPTH_%d -D cn=%d -D T1=%s"
                                     " -D convertToWT=%s -D convertToT=%s -D ST=%s%s",
                                     anchor.x, anchor.y, (int)localThreads[0], (int)localThreads[1], op2str[op],
                                     doubleSupport ? " -D DOUBLE_SUPPORT" : "", processing.c_str(),
                                     ocl::typeToStr(type), depth, cn, ocl::typeToStr(depth),
                                     ocl::convertTypeStr(depth, wdepth, cn, cvt[0]),
                                     ocl::convertTypeStr(wdepth, depth, cn, cvt[1]),
                                     ocl::typeToStr(CV_MAKE_TYPE(depth, scalarcn)),
                                     current_op == op ? "" : cv::format(" -D %s", op2str[current_op]).c_str());

#if 0  // 这段是自己加的代码，从morph_debug.cl读入文件，覆盖morph_oclsrc.programCode中原来的源码内容。
        printf("buildOptions:%s", buildOptions);
        
        // 从文件中读取 opencl 代码
        // 文件路径
        std::string filePath = "/home/ken/workspace/CLMath/source/opencv-4.2.0-org/opencv-4.2.0/modules/imgproc/src/opencl/morph_debug.cl";
        // 打开文件
        std::ifstream clFile(filePath.c_str());
        // 检查文件是否成功打开
        if (!clFile.is_open())
        {
            std::cerr << "文件打开失败:" << filePath << std::endl;
        }
        // 使用字符串读取文件内容
        std::ostringstream contentStream;
        contentStream << clFile.rdbuf();
        std::string content = contentStream.str();
        char* fileContent = new char[content.length()+1];
        std::strcpy(fileContent, content.c_str());

        ocl::imgproc::morph_oclsrc.programCode = fileContent;

        // 关闭文件
        clFile.close();
#endif  // 新加的代码结束    

        kernels[i].create("morph", ocl::imgproc::morph_oclsrc, buildOptions);
        if (kernels[i].empty())
            return false;
    }

```

