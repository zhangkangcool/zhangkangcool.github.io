



你仓库的实现：正是 lazy 风格——clBuildProgram 会把 SPIR‑V → VIR（并设置 binarySize），但 clfLoadAndLinkVIRShader（在 clCreateKernel 内）才会基于 kernel name 调用 vscLoadKernel/vscLinkKernel 等生成最终可执行表示（见仓库 vscLoadKernel / vscSaveShaderToBinary 等 API 的存在与调用点。



目前在clCreateKernel中真正将SPIRV编译成二进制。