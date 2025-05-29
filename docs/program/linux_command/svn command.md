

https://github.ibm.com/cdl-compiler/llvm/wiki/How-to-check-in-LLVM-Phabricator-patch

https://llvm.org/docs/GettingStarted.html#checkout-via-svn-deprecated

# 1. Discard local modify
`svn revert filename`


# How to Code Reviews with Phabricator
* http://llvm.org/docs/Phabricator.html

# How to apply permission?

  1. Follow the below link to apply for an account.
     * http://llvm.org/docs/DeveloperPolicy.html#obtaining-commit-access  
     * tips: Chris email is clattner@llvm.org 



# SVN way

## account and password

```shell
认证领域: <https://llvm.org:443> LLVM Subversion repository
“zhangkang”的密码:

-----------------------------------------------------------------------
注意!  你的密码，对于认证域:

   <https://llvm.org:443> LLVM Subversion repository

只能明文保存在磁盘上!  如果可能的话，请考虑配置你的系统，让 Subversion
可以保存加密后的密码。请参阅文档以获得详细信息。

你可以通过在“/home/shkzhang/.subversion/servers”中设置选项“store-plaintext-passwords”为“yes”或“no”，
来避免再次出现此警告。
-----------------------------------------------------------------------
保存未加密的密码(yes/no)?no
正在发送       lib/Target/PowerPC/PPCISelLowering.cpp
正在增加       test/CodeGen/PowerPC/loop-align.ll
传输文件数据..
提交后的版本为 363495。
```

zhangkang(m3s*q___)

询问保存密码时，最好选择否。pcom023未保存密码，最好使用此机器提交代码。

## Try a test commit

1. svn co https://zhangkang@llvm.org/svn/llvm-project/llvm/trunk llvm  

   svn co https://zhangkang@llvm.org/svn/llvm-project/cfe/trunk/ clang

    最好使用匿名下载并不要保存密码，这样更安全。

   ```bash
   svn co https://llvm.org/svn/llvm-project/llvm/trunk llvm  
   
   svn co https://llvm.org/svn/llvm-project/cfe/trunk/ clang
   ```

   ```shell
   .bashrc
   export SVN_EDITOR=vim
   ```

   

2. vim CREDITS.TXT(Add some of your information to this file)  

3. svn up & svn st && svn diff CREDITS.TXT(View edits)  

4. svn ci -m "add myself to the CREDITS.TXT” 
   `NOTICE`: svn ci will get a dialog to edit the comment.

   

   Check the stype

   ```shell
   clang-format -verbose test.c      // 输出到stdin
   clang-format -i -verbose test.c   // 直接在文件上修改
   ```

   

## Try a real commit
1. Download the code that has been accepted from Phabricator,The command looks like the following
```
wget https://reviews.llvm.org/******/D53358.diff
wget https://reviews.llvm.org/file/data/ybddgs7v2zgjigttn6fq/PHID-FILE-m2lannggh4c2qngi7g6l/D54738.diff
```
2. patch up  
    The command looks like 
```
cd llvm
patch -p1 < D53358.diff
```
  `We need to be very careful here, the parameter -p1 tells the patch tool,  
        please ignore the first level directory of the path in the patch.  
        the parameter -p2 function is to ignore the first 2 levels of the   
        directory and so on.`  
   tips: Generally speaking, we don't need to create a folder. if you create a folder,
   something may be wrong.

3. svn st && svn diff  
4. Verify  
   For example, use the most basic "make check-llvm -j64” on e1v machine.
5. svn add

   You should add all the files marked as "?"， notice those files marked as `M`is not needed add which is different git.
6. svn ci   
          After using this command, a dialog will pop up and we need to clear the contents.   
          Then add our own submission information. We can use the command "svn log |less"  
          to see how others write it.  
          tips: The following information "Differential revision: https://reviews.llvm.org/D53346"   
                   in the added information can link this commit with the review code of the   
                   Phabricator, and the commit will close the corresponding review code on the Phabricator. 

`NOTICE`: When you use `svn ci`, after you exit and save(ws), the changeset will be submitted. 
If you want discard it, you should use exit force(q!).  

Below is a example comment:
```
[PowerPC] Fix inconsistent ImmMustBeMultipleOf for same instruction

Summary:
There are 4 instructions which have Inconsistent ImmMustBeMultipleOf in the
function PPCInstrInfo::instrHasImmForm, they are LFS, LFD, STFS, STFD.
These four instructions should set the ImmMustBeMultipleOf to 1 instead of 4.

Reviewed By: steven.zhang

Differential Revision: https://reviews.llvm.org/D54738
```
## How to revert the error commit.

#### Notice: The test case must add `-mtriple powerpc64-unknown-linux-gnu`.

#### Notice: The test case must add `// REQUIRES: powerpc-registered-target`, if this case is not in the PowerPC directory.

```
svn log | less // to check your commit number
svn merge -r347532:347530 https://zhangkang@llvm.org/svn/llvm-project/llvm/trunk
// the r347532 is your commit number, and 347530 is last commit number.
svn diff // check the diff to confirm it's you commit.
svn ci
```
Then you should write the reason why you should revert your commit.



### If your code modify the clang and llvm, you may need submit llvm first.

