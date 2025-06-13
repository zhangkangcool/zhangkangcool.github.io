<h1 align="center">How to submit patch to Phabricator</h1>
Useful website:
https://reviews.llvm.org/D54738
https://reviews.llvm.org/D53360
http://llvm.org/docs/Phabricator.html

# Check the stype

```shell
clang-format -verbose test.c      // 输出到stdin
clang-format -i -verbose test.c   // 直接在文件上修改
```



# Create the patch

### ***Note that*** : For those new files, it may not in the patch, you must very carefully to check it. You should use git add to add the file.

- Method1

```shell
// git show can only get the lastest diff
git show HEAD -U999999 > mypatch.patch
git format-patch -U999999 @{u}
svn diff --diff-cmd=diff -x -U999999
git diff -U999999 > mypatch.patch

// you'd better use below command
git diff old_commitID new_commitID -U999999> d:/diff.txt
```



- Method2

If you have modify clang and llvm meantime, when you `git diff` clang, you can like this:

```shell
git checkout shkzhang
cp -rf clang clang_shkzhang
git checkout master
rm clang
cp -rf clang_shkzhang clang
git diff -U999999 > clang.patch
```



- Method3

You can use `git add` & `git commit`, but not use `git push`.
Then you can use git diff to get the patch.

```shell
git checkout -b temp
# modify the code on the temp
git add modify_file
git commit -m "test"
# Don't use git push
git log  # see the old_hash an new hash_id
git diff old_commitID new_commitID -U999999 > ~/diff.patch

# remove the temp
git checkout master
git branch -d temp
```



### For example

The modify is from master, and have a new file test:

If you use `git diff`, the diff path will not contain the new file.

You should use 

```shell
git add new_file
git diff master -U999999 > diff.patch
// check the diff carefully.
```



 



# Use the master compare to the branch to create the patch

```shell
git checkout master
git pull
git checkout shkzhang_2557
git merge master   // do not git push
cd llvm/clang // or cd llvm/llvm
git diff master shkzhang_2557 -U999999 > 2557.diff

```

Below patch:
```diff
Index: clang/lib/Basic/Targets/PPC.cpp
===================================================================
--- clang/lib/Basic/Targets/PPC.cpp
+++ clang/lib/Basic/Targets/PPC.cpp
```
If you use the `patch -p1 < ~/diff.patch`, you should `cd llvm/clang`.



Below patch:

```diff
diff --git a/clang/test/CodeGen/builtins-ppc.c b/clang/test/CodeGen/builtins-ppc.c
index 1f17787..1ff1b81 100644
--- a/clang/test/CodeGen/builtins-ppc.c
+++ b/clang/test/CodeGen/builtins-ppc.c
@@ -14,3 +14,16 @@ long long test_builtin_ppc_get_timebase() {
   return __builtin_ppc_get_timebase();
 }

+void test_builtin_ppc_setrnd() {
+  volatile double res;
+  volatile int x = 100;
+
+  // CHECK: call double @llvm.ppc.setrnd(i32 2)
+  res = __builtin_setrnd(2);
+
+  // CHECK: call double @llvm.ppc.setrnd(i32 100)
+  res = __builtin_setrnd(100);
+
+  // CHECK: call double @llvm.ppc.setrnd(i32 %2)
+  res = __builtin_setrnd(x);
+}
```



If you use the `patch -p2 < ~/dif.patch`, you should `cd llvm/clang`.

