<https://www.jianshu.com/p/5d3ad1a23298>



又没有提交本地的修改，然后使用 `git reset —hard` 改变了分支的内容。上一次是直接没有 `git add` ，导致修改的文件全部消失，这样即使是 git 也没有办法恢复，只能重新写一遍。这次好了一点点，使用了 `git add` ，但是还没有提交，查找了一番之后还是恢复了。记录这个过程，谨记慎重在开发用的机器上面使用 `git reset —hard` 。

## 1 使用 git commit 提交过然后被 git reset 覆盖

比如一个例子，提交的 commit 记录如下：

```bash
    * f8b87f2 (HEAD -> new_branch) test 4
    * 48bf420 (master) test 3
    * 4ec574c test 2
    * 789a460 test 1
```

这时候使用了 `git reset —hard` ，提交记录变成如下：

```bash
    * 48bf420 (HEAD -> new_branch, master) test 3
    * 4ec574c test 2
    * e19fb7e test 1
```

没有远程仓库的情况下，如何才能恢复刚才丢失的 test 4 那条 commit 呢。可以使用 `git reflog`:

```css
    48bf420 (HEAD -> new_branch, master) HEAD@{0}: reset: moving to master
    f8b87f2 HEAD@{1}: commit test 4
    48bf420 (HEAD -> new_branch, master) HEAD@{2}: checkout: moving from master to new_branch
    48bf420 HEAD@{3}: commit test 3
    4ec574c HEAD@{4}: commit test 2
    e19fb7e HEAD@{5}: commit test 1
```

可以看到每一次的操作都被记录了起来。要恢复到 test 4 的那一次提交，只需要执行：

```shell
    git reset f8b87f2
```

即可以恢复。



## 2 使用 git add 添加到了暂存区然后被 git reset 覆盖

这个时候需要恢复可以执行以下步骤：

```bash
    find .git/objects -type f | xargs ls -lt | seq 10q
```

这里的 `10q` 指的就是你最近添加的 10 条 add 的记录，根据你丢失文件的多少进行选择。然后出现的信息如下：

```undefined
    .git/objects/00/8b61d60cc4829d438e54a4073f2fdd4b62ae74
    .git/objects/f8/b87f2108add14628c664ca467d440b5b99616f
    .git/objects/d5/0d6c1c2e8494ef1fa61404325b90d8a0f32423
    .git/objects/10/8a0a5571dd613691ab0af4c3c4fc691b7e2e06
```

objects 后面的部分就是一个 add 的ID，注意要去掉 / 符号。从上到下是最新的提交到旧的提交。执行：

```undefined
    git cat-file -p 008b61d60cc4829d438e54a4073f2fdd4b62ae74 > hello
```

会将 add 中的文件重新写到新文件中，进行恢复。
此外，还有一种方法进行恢复。执行：

```undefined
    git fsck --lost-found
```

然后去到 `.git/lost-found` 目录下面可以找到自己已经丢失的文件。文件不会是原来的名字，需要自己打开去查看和对比。



## 3 甚至都没有使用 `git add` 就使用 `git reset` 覆盖了本地修改

只能重写了。

