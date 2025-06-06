<h1 align="center">Option use in code</h1>
### Example1

有些选项不是`llc`的选项，这点要注意

```cpp
static cl::opt<bool> DisablePartialLibcallInlining("disable-partial-libcall-inlining",
    cl::Hidden, cl::desc("Disable Partial Libcall Inlining"));
```

`llc test.c -disable-partial-libcall-inlining`



### Example2

```shell
#ifndef NDEBUG
// Command line option to debug partial-inlining. The default is none:
static cl::opt<bool> TracePartialInlining("trace-partial-inlining",
                                          cl::init(false), cl::Hidden,
                                          cl::desc("Trace partial inlining."));
#endif

```

You can use `llc test.ll -trace-partial-inlinin`

