<h1 align="center">ERROR</h1>


如果碰到以下的错误的话，应该是clang的test没开，应该设置`-DCLANG_INCLUDE_TEST=On`选项。

```shell
$ python3 /Users/ken/workspace/llvm-project/build/bin/llvm-lit clang/test/Sema/block-return-1.c
llvm-lit: /Users/ken/workspace/llvm-project/llvm/utils/lit/lit/TestingConfig.py:141: fatal: unable to parse config file '/Users/ken/workspace/llvm-project/clang/test/lit.cfg.py', traceback: Traceback (most recent call last):
  File "/Users/ken/workspace/llvm-project/llvm/utils/lit/lit/TestingConfig.py", line 130, in load_from_path
    exec(compile(data, path, 'exec'), cfg_globals, None)
  File "/Users/ken/workspace/llvm-project/clang/test/lit.cfg.py", line 25, in <module>
    config.test_format = lit.formats.ShTest(not llvm_config1.use_lit_shell)
                                                ^^^^^^^^^^^^
AttributeError: 'NoneType' object has no attribute 'use_lit_shell'
```

