

# 准备工作

#### 1. clang-format

```
下载clang-format（编译llvm时会在build/bin目录下生成，需加入PATH） 和 clang-format.py（llvm源代码中已提供）

clang-format.py在下面的位置，没有的话，需要自行生成
cp ~/workspace/llvm/clang/tools/clang-format/clang-format.py  ~/software/clang-format/clang-format.py
```





python2目前还没有这个问题，python3按ctrl-I的话，可能会报错，TypeError: the JSON object must be str, not 'bytes'
此时，修改

```diff
diff --git a/clang/tools/clang-format/clang-format.py b/clang/tools/clang-format/clang-format.py
index 76fedb64814..e51a3700663 100644
--- a/clang/tools/clang-format/clang-format.py
+++ b/clang/tools/clang-format/clang-format.py
@@ -134,7 +134,7 @@ def main():
     )
   else:
     header, content = stdout.split(b'\n', 1)
-    header = json.loads(header)
+    header = json.loads(header.decode('utf-8'))
     # Strip off the trailing newline (added above).
     # This maintains trailing empty lines present in the buffer if
     # the -lines specification requests them to remain unchanged.

```



#### 2. vim中启用clang-format

```shell

"""""""""""""""""""""""""""""""""""""""""""""""
" Seting clang-format
"""""""""""""""""""""""""""""""""""""""""""""""
if has('python')
  map <C-I> :pyf ~/software/clang-format/clang-format.py<cr>
  imap <C-I> <c-o>:pyf ~/softwware/clang-format/clang-format.py<cr>  " insert mode tab
elseif has('python3')
  map <C-I> :py3f ~/software/clang-format/clang-format.py<cr>
  imap <C-I> <c-o>:py3f ~/software/clang-format//clang-format.py<cr>
endif

function FormatOnSave()
  let l:formatdiff = 1 " or let l:lines="all"
  if has('python')
    pyf ~/software/clang-format/clang-format.py
  elseif has('python3')
    py3f ~/software/clang-format/clang-format.py
  endif
endfunction

autocmd BufWritePre *.h,*.hpp,*.c,*.cc,*.cpp call FormatOnSave()

" Haven't use below func
function FormatWholeFile()
  let l:lines="all"
  if has('python')
    pyf ~/software/clang-format/clang-format.py
  elseif has('python3')
    py3f ~/software/clang-format/clang-format.py
   endif
endfunction

" can't work: map <F5>: call FormatWholeFile()<cr>
```

