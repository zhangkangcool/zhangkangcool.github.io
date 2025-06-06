<h1 align="center">Use clang in vscode</h1>


https://code.visualstudio.com/docs/cpp/config-clang-mac

https://code.visualstudio.com/docs/editor/variables-reference



https://www.jianshu.com/p/2d10b3c5bcbe

https://www.cnblogs.com/love-study-chase/p/11962064.html

## 1 tasks.json

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build with Clang",
            "type": "shell",
            "command": "clang++",
            "args": [
                "-std=c++17",
                "-stdlib=libc++",
                "'${file}'",
                "-o",
                "'${fileBasenameNoExtension}'",
                "--debug"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```



## 2 launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(lldb) Launch",
            "type": "cppdbg",
            "request": "launch",
            "program": "${fileDirname}/${fileBasenameNoExtension}",
            "args": [],
            "stopAtEntry": true,
            "cwd": "${workspaceFolder}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "lldb",
            "preLaunchTask": "Build with Clang",
        }
    ]
}
```





## 3 c_cpp_properties.json

```json
{
    "configurations": [
        {
            "name": "Mac",
            "includePath": [
                "${workspaceFolder}/**",
                "/usr/local/include",
                "/Users/ken/llvm/llvm/include",
                "/Users/ken/llvm/build/include",
                "/Users/ken/llvm/clang/include",
                "/Users/ken/llvm/build/tools/clang/include",
                "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include/c++/v1",
                "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include",
                "/Users/ken/llvm/build/lib/clang/10.0.0/include"
            ],
            "defines": [],
            "macFrameworkPath": [
                "/System/Library/Frameworks",
                "/Library/Frameworks"
            ],
            "compilerPath": "/Users/ken/llvm/build/bin/clang",
            "cStandard": "c11",
            "cppStandard": "c++17",
            "intelliSenseMode": "clang-x64"
        }
    ],
    "version": 4
}
```



[⇧⌘B]是编译程序，[⇧⌘R]是运行程序，如果安装了插件『Code Runner』可以直接运行程序



### 最好安装`Code Runner`扩展

https://www.sohu.com/a/296509369_791833

setting中替换gcc为clang

