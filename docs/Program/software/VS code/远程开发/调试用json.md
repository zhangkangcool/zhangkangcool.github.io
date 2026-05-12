



```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) 远程管道调试",
            "type": "cppdbg",
            "request": "launch",
            "program": "/home/ken/workspace/llvm-project/build/bin/llc",
            "args": [
                "-debug",
                "-O3",
                "-march=riscv64",
                "-mcpu=cix-rv64",
                "-riscv-disable-post-scheduler-substitute",
                "-post-RA-scheduler",
                "-mattr=+d,+v,+zvfh",
                "/home/ken/workspace/debug/sqrt.ll"
            ],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": false,
            "pipeTransport": {
                "debuggerPath": "/usr/bin/gdb",
                "pipeProgram": "ssh",
                "pipeArgs": [
                    "你的用户名@你的服务器IP",
                    "-p", "22"  // 不是22才改
                ],
                "pipeCwd": ""
            },
            "MIMode": "gdb",
            "miDebuggerArgs": "--interpreter=mi",
            "setupCommands": [
                {
                    "description": "为 gdb 启用整齐打印",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ]
        }
    ]
}
```

