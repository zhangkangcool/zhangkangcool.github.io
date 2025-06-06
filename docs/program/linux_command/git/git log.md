<h1 align="center">git log</h1>
# 1 git reflog

该命令可以查看最近所有的HEAD变化，一般用于恢复。查看git reset的用法md



# 2 git log查看两次commit之间的commit

https://blog.csdn.net/robertsong2004/article/details/46893211



```shell
git log --pretty=oneline tagA...tagB // 中间是3个句号
如：
git log --pretty=oneline efb9e45d6bc5dda4d3131701df24cf764e99d544...3ecab8e4555aee0b4aa10c413696a67f55948c39
3ecab8e4555aee0b4aa10c413696a67f55948c39 Reapply r372285 "GlobalISel: Don't materialize immarg arguments to intrinsics"
e0900f285bb532790ed494df901f87c5c8b904da [MCA] Improved cost computation for loop carried dependencies in the bottleneck analysis.
7cb60fb00f545dae7e161d8b7c24d674d7d008f9 Make appendCallNB lambda mutable
7decdbf2db8fcf78233f40195f6d5c5b7c396224 X86: Add missing test for vshli SimplifyDemandedBitsForTargetNode

从tagA到tagB排序，从上往下。最好tagA是最新的，tagB是比较老的 
```



显示分支合并情况等信息

```shell
git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph cf6aafa47c3771e4f353bfbdeb8157347b305339...19d96ca63f8480ae705a377cd98c072916d33590
```





If you just wanted commits reachable from tagB but not tagA:

```shell
git log --pretty=oneline tagA..tagB    
```

或

```shell
git log --pretty=oneline ^tagA tagB
```



# 3 git log查看记录信息

默认git log 出来的格式并不是特别直观，很多时候想要更简便的输出更多或者更少的信息，这里列出几个git log的format。
可以根据自己的需要定制。

git log命令可一接受一个--pretty选项，来确定输出的格式.

比如 ：

如果我们只想输出hash.

```shell
git log --pretty=format:"%h %an %s %cd" 
这里的时间可以自己进行定制
```

详细 命令 ：

- %H: commit hash
- %h: 缩短的commit hash
- %T: tree hash
- %t: 缩短的 tree hash
- %P: parent hashes
- %p: 缩短的 parent hashes
- %an: 作者名字
- %aN: mailmap的作者名字 (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))
- %ae: 作者邮箱
- %aE: 作者邮箱 (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))
- %ad: 日期 (--date= 制定的格式)
- %aD: 日期, RFC2822格式
- %ar: 日期, 相对格式(1 day ago)
- %at: 日期, UNIX timestamp
- %ai: 日期, ISO 8601 格式
- %cn: 提交者名字
- %cN: 提交者名字 (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))
- %ce: 提交者 email
- %cE: 提交者 email (.mailmap对应，详情参照[git-shortlog(1)](http://linux.die.net/man/1/git-shortlog)或者[git-blame(1)](http://linux.die.net/man/1/git-blame))
- %cd: 提交日期 (--date= 制定的格式)
- %cD: 提交日期, RFC2822格式
- %cr: 提交日期, 相对格式(1 day ago)
- %ct: 提交日期, UNIX timestamp
- %ci: 提交日期, ISO 8601 格式
- %d: ref名称
- %e: encoding
- %s: commit信息标题
- %f: sanitized subject line, suitable for a filename
- %b: commit信息内容
- %N: commit notes
- %gD: reflog selector, e.g., refs/stash@{1}
- %gd: shortened reflog selector, e.g., stash@{1}
- %gs: reflog subject
- %Cred: 切换到红色
- %Cgreen: 切换到绿色
- %Cblue: 切换到蓝色
- %Creset: 重设颜色
- %C(...): 制定颜色, as described in color.branch.* config option
- %m: left, right or boundary mark
- %n: 换行
- %%: a raw %
- %x00: print a byte from a hex code
- %w([[,[,]]]): switch line wrapping, like the -w option of git-shortlog(1)
  

#### merge时所使用的命令，查看分支的合并情况

```shell
git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph

git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph latest...last

查看两个之间的情况
git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph cf6aafa47c3771e4f353bfbdeb8157347b305339...19d96ca63f8480ae705a377cd98c072916d33590
```



```shell
[shkzhang@recycler:~/llvm]$ git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph

*   d61cf5585b0\ 2019-12-30 (HEAD -> wyvern_dev, origin/wyvern_dev, origin/wyehia/merge_d1b51c5de7a0)\ merge d1b51c5de7a0b7a7d81c3b520614a139eb0160d2 into wyvern_dev\ [Wael Yehia]
|\
| * d1b51c5de7a\ 2019-12-28\ [PowerPC] Modify the hasSideEffects of some VSX instructions from 1 to 0\ [Kang Zhang]
* | 776b5fbc5c6\ 2019-12-30\ Revert "Merge 'd1b51c5de7a0b7a7d81c3b520614a139eb0160d2' " (#979)\ [GitHub Enterprise]
* | 0408d2385a7\ 2019-12-30\ Merge 'd1b51c5de7a0b7a7d81c3b520614a139eb0160d2' into shkzhang_wyvern_dev_D71391_conflict\ [GitHub Enterprise]
* |   b5659428406\ 2019-12-28\ Merge commit 'a3f896481329f64aac845e03cfda8f1154ce6079' into wyvern_dev\ [xlcit]
|\ \
| |/
| * a3f89648132\ 2019-12-27\ [TargetLowering] Update comment to reference the correct compiler-rt function the code is based on. NFC\ [Craig Topper]
| * f83a8efe879\ 2019-12-27\ [mlir] Merge the successor operand count into BlockOperand.\ [River Riddle]
| * 0bc7665d988\ 2019-12-27\ [ADT] Fix FoldingSet documentation typos\ [Brian Gesiak]
| * 044cc919f4b\ 2019-12-27\ Delete setjmp_undefined_for_msvc workaround after llvm.setjmp was removed\ [Fangrui Song]
| * f7910496c83\ 2019-12-27\ [Intrinsic] Delete tablegen rules of llvm.{sig,}{setjmp,longjmp}\ [Fangrui Song]
| * 22f34c7f34a\ 2019-12-27\ lld: Remove explicit copy ops from AssociatedIterator, relying on implicit operators\ [David Blaikie]
| * c51b45e32ef\ 2019-12-27\ DebugInfo: Fix rangesBaseAddress DICompileUnit bitcode serialization/deserialization\ [David Blaikie]
| * a33cab0f06e\ 2019-12-27\ AMDGPU: Adjust test so it will work with GlobalISel\ [Matt Arsenault]
| * dce7a362bed\ 2019-12-27\ [ELF] Improve the condition to create .interp\ [Fangrui Song]
| * 33a1b3d8fce\ 2019-12-27\ [sanitizer] Link Sanitizer-x86_64-Test-Nolibc with -static\ [Fangrui Song]
| * 5ce2ca524e9\ 2019-12-27\ AMDGPU/GlobalISel: Use SReg_32 for readfirstlane constraining\ [Matt Arsenault]
| * e9775bb5d81\ 2019-08-17\ Hexagon: Fix missing tablegen mode comment\ [Matt Arsenault]
| * e29ae3799ba\ 2019-12-27\ TII: Fix using Register for a subregister index argument\ [Matt Arsenault]
| * 9acd9544db9\ 2019-12-27\ AMDGPU: Use Register\ [Matt Arsenault]
| * b30d87a90ba\ 2019-12-27\ [mlir][spirv] Add basic definitions for supporting availability\ [Lei Zhang]
| * c3dbd782f1e\ 2019-12-27\ Revert "[ELF] Improve the condition to create .interp"\ [Reid Kleckner]
| * 1d891a32cf4\ 2019-12-27\ Support powerpc and sparc when building without init_array.\ [Sterling Augustine]
* |   2eacb31febe\ 2019-12-27\ Merge commit 'e8c5600de8b43b2ac22a5aab6ce51e3810f8a4a6' into wyvern_dev\ [xlcit]
|\ \
| |/
| * e8c5600de8b\ 2019-12-27\ [PowerPC][LoopVectorize]Add floating point reg usage test\ [Jinsong Ji]
| * 596012b2567\ 2019-12-27\ [mlir][spirv] Update docs regarding how to define new ops and types\ [Lei Zhang]
| * d8018233d1e\ 2019-12-27\ Revert "CWG2352: Allow qualification conversions during reference binding."\ [David Blaikie]
| * c3d3569d4ca\ 2019-12-25\ [mlir] Convert std.and/std.or ops to spv.LogicalAnd/spv.LogicalOr\ [MaheshRavishankar]
| * ef7a659c21f\ 2019-12-27\ Reland "[msan] Intercept qsort, qsort_r."\ [Reid Kleckner]
| * 8fcce5ac73d\ 2019-12-27\ Revert "[msan] Intercept qsort, qsort_r."\ [Reid Kleckner]
| * 3213ce966b6\ 2019-12-27\ TailDuplication: Clear NoPHIs property\ [Matt Arsenault]
| * 780d30660e9\ 2019-12-27\ [VFS] Don't run symlink test on Windows, it may pass or fail\ [Reid Kleckner]
| * 84afd9c5368\ 2019-12-27\ [compiler-rt] [netbsd] Add support for versioned statvfs interceptors\ [Kamil Rytarowski]
| * b35c585a9a8\ 2019-12-27\ [ConstantRange] Respect destination bitwidth for cast results.\ [Florian Hahn]
| * 752220ea266\ 2019-12-27\ [OpenCL] Fixed printing of __private in AMDGPU test\ [Anastasia Stulova]
| * 134ef0fb4b9\ 2019-12-19\ [OpenCL] Fix inconsistency between opencl and c11 atomic fetch max/min\ [Yaxun (Sam) Liu]
| * dc2c9b0fcf2\ 2019-12-27\ [Matrix] Propagate and use shape info for binary operators.\ [Florian Hahn]
| * f0722333dd1\ 2019-12-18\ Allow newlines in AST Matchers in clang-query files\ [Stephen Kelly]
| * 2abda66848e\ 2019-12-27\ [NFC][DA] Remove duplicate code in checkSrcSubscript and checkDstSubscript\ [Danilo Carvalho Grael]
```



#### 查看父commit,本commit的上一个commit

一般用于merge

```shell
git checkout master
git log --pretty=%P -n 1 f09d54ed2a75b62960b35258136435d7c8d418e1
294f37561ab155e363be0fca5fa43528d8b29d18
```





### 4. git log --author

```shell
git log --author="zhang kang"
```

