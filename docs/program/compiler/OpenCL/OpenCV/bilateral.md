<h1 align="center">bilateral</h1>






`bilateral_filter.dispatch.cpp`中 

```c++
     ocl::Kernel k(kernelName.c_str(), ocl::imgproc::bilateral_oclsrc,
            format("-D radius=%d -D maxk=%d -D cn=%d -D int_t=%s -D uint_t=uint%s -D convert_int_t=%s"
            " -D uchar_t=%s -D float_t=%s -D convert_float_t=%s -D convert_uchar_t=%s -D gauss_color_coeff=(float)%f",
            radius, maxk, cn, ocl::typeToStr(CV_32SC(cn)), cnstr.c_str(),
            ocl::convertTypeStr(CV_8U, CV_32S, cn, cvt[0], sizeof(cvt[0])),
            ocl::typeToStr(type), ocl::typeToStr(CV_32FC(cn)),
            ocl::convertTypeStr(CV_32S, CV_32F, cn, cvt[1], sizeof(cvt[1])),
            ocl::convertTypeStr(CV_32F, CV_8U, cn, cvt[2], sizeof(cvt[2])), gauss_color_coeff));
    if (k.empty())
        return false;

    Mat mspace_weight(1, d * d, CV_32FC1, space_weight);
    Mat mspace_ofs(1, d * d, CV_32SC1, space_ofs);
    UMat ucolor_weight, uspace_weight, uspace_ofs;

    mspace_weight.copyTo(uspace_weight);
    mspace_ofs.copyTo(uspace_ofs);

    k.args(ocl::KernelArg::ReadOnlyNoSize(temp), ocl::KernelArg::WriteOnly(dst),
           ocl::KernelArg::PtrReadOnly(uspace_weight),
           ocl::KernelArg::PtrReadOnly(uspace_ofs));

    size_t globalsize[2] = { (size_t)dst.cols / sizeDiv, (size_t)dst.rows };
    return k.run(2, globalsize, NULL, false);
```





bilateral_oclsrcs是一个编译时从`./opencv-4.9.0/modules/imgproc/src/opencl/bilateral.cl`读取的字符串。在buiild目录下才有。

`ocl.cpp`中

```
bool Kernel::create() 等函数进行编译
```



最终会调用到这里的createKernel

```c++
struct Kernel::Impl
{
    Impl(const char* kname, const Program& prog) :
        refcount(1), handle(NULL), isInProgress(false), isAsyncRun(false), nu(0)
    {    
        cl_program ph = (cl_program)prog.ptr();
        cl_int retval = 0; 
        name = kname;
        if (ph) 
        {
            handle = clCreateKernel(ph, kname, &retval);                                                                                                                                                           
            CV_OCL_DBG_CHECK_RESULT(retval, cv::format("clCreateKernel('%s')", kname).c_str());
        }
        for( int i = 0; i < MAX_ARRS; i++ )
            u[i] = 0; 
        haveTempDstUMats = false;
        haveTempSrcUMats = false;
    }    

```



ocl.cpp中的`programSoruce`来实现编译。

```c++
///////////////////////////////////////// ProgramSource ///////////////////////////////////////////////

struct ProgramSource::Impl
{
    IMPLEMENT_REFCOUNTABLE();

    enum KIND {
        PROGRAM_SOURCE_CODE = 0, 
        PROGRAM_BINARIES,
        PROGRAM_SPIR,
        PROGRAM_SPIRV
    } kind_;

    Impl(const String& src) 
    {    
        init(PROGRAM_SOURCE_CODE, cv::String(), cv::String());
        initFromSource(src, cv::String());
    }    
    Impl(const String& module, const String& name, const String& codeStr, const String& codeHash)
    {    
        init(PROGRAM_SOURCE_CODE, module, name);
        initFromSource(codeStr, codeHash);
    }    


internal::ProgramEntry::operator ProgramSource&() const                                                                                                                                                            
{
    if (this->pProgramSource == NULL)
    {
        cv::AutoLock lock(cv::getInitializationMutex());
        if (this->pProgramSource == NULL)
        {
            ProgramSource ps = ProgramSource::Impl::fromSourceWithStaticLifetime(this->module, this->name, this->programCode, this->programHash, cv::String());
            ProgramSource* ptr = new ProgramSource(ps);
            const_cast<ProgramEntry*>(this)->pProgramSource = ptr;
        }
    }
    return *this->pProgramSource;
}


```





` src_->sourceAddr`中存的是cl C源代码，`ocl.cpp`中的以下代码对程序进行编译，断电和替换打到这里。

```c++
    bool buildFromSources(const Context& ctx, const ProgramSource::Impl* src_, String& errmsg)
    {    
        CV_Assert(src_);
        CV_Assert(src_->kind_ == ProgramSource::Impl::PROGRAM_SOURCE_CODE);
        CV_Assert(handle == NULL);
        CV_INSTRUMENT_REGION_OPENCL_COMPILE(cv::format("Build OpenCL program: %s/%s %s options: %s",                                                                                                               
                sourceModule_.c_str(), sourceName_.c_str(),
                src_->sourceHash_.c_str(), buildflags.c_str()).c_str());

        CV_LOG_VERBOSE(NULL, 0, "Compile... " << sourceModule_.c_str() << "/" << sourceName_.c_str());

        const char* srcptr = src_->sourceAddr_ ? ((const char*)src_->sourceAddr_) : src_->codeStr_.c_str();
        size_t srclen = src_->sourceAddr_ ? src_->sourceSize_ : src_->codeStr_.size();
        CV_Assert(srcptr != NULL);
        CV_Assert(srclen > 0);

        cl_int retval = 0; 

        handle = clCreateProgramWithSource((cl_context)ctx.ptr(), 1, &srcptr, &srclen, &retval);   // 对源码程序进行编译
        CV_OCL_DBG_CHECK_RESULT(retval, "clCreateProgramWithSource");
        CV_Assert(handle || retval != CL_SUCCESS);
        if (handle && retval == CL_SUCCESS)
        {
            size_t n = ctx.ndevices();
            AutoBuffer<cl_device_id, 4> deviceListBuf(n + 1);
            cl_device_id* deviceList = deviceListBuf.data();
            for (size_t i = 0; i < n; i++) 
            {
                deviceList[i] = (cl_device_id)(ctx.device(i).ptr());
            }

            retval = clBuildProgram(handle, (cl_uint)n, deviceList, buildflags.c_str(), 0, 0);
            CV_OCL_TRACE_CHECK_RESULT(/*don't throw: retval*/CL_SUCCESS, cv::format("clBuildProgram(source: %s)", buildflags.c_str()).c_str());

```





OpenCV中可能有一套空实现，所以原来编译时不报错，但运行时需要设置libOpenCL.so，`clCreateProgramWithIL`不在这些实现中，因为其由2.1引入，而`clCreateProgramWithSource`由于1.2引入。可以通过所有`clCreateProgramWithSource`函数，大概知道原理。

```c++
opencl_fn5(OPENCL_FN_clCreateProgramWithSource, cl_program, (cl_context p1, cl_uint p2, const char** p3, const size_t* p4, cl_int* p5))
cl_program (CL_API_CALL*clCreateProgramWithSource)(cl_context, cl_uint, const char**, const size_t*, cl_int*) =
        OPENCL_FN_clCreateProgramWithSource_switch_fn;
static const struct DynamicFnEntry clCreateProgramWithSource_definition = { "clCreateProgramWithSource", (void**)&clCreateProgramWithSource};
```



```c++
#undef clCreateProgramWithSource
#define clCreateProgramWithSource clCreateProgramWithSource_fn
inline cl_program clCreateProgramWithSource(cl_context p0, cl_uint p1, const char** p2, const size_t* p3, cl_int* p4) { return clCreateProgramWithSource_pfn(p0, p1, p2, p3, p4); }
```

