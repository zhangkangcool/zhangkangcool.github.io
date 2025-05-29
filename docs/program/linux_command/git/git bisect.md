如何用此命令：https://cloud.tencent.com/developer/article/1379508

实现细节： https://cloud.tencent.com/developer/section/1138673



# git bisect 命令教程

需要在`/hone/llvm`目录下运行命令。

```
You need to run this command from the toplevel of the working tree.
```





```shell
bad              -- mark current or given revision as bad
good             -- mark current or given revision as good
help             -- display a short usage description
log              -- show log of the current bisection
next             -- find next bisection to test and check it out
replay           -- replay a bisection log
reset            -- finish bisection search and return to the given branch (or master)
run              -- run evaluation script
skip             -- choose a nearby commit
start            -- reset bisection state and start a new bisection
terms            -- show currently used good/bad terms
visualize  view  -- show the remaining revisions in gitk
```





`git bisect`是一个很有用的命令，用来查找哪一次代码提交引入了错误。

![img](https://ask.qcloudimg.com/http-save/yehe-1634626/b24kywbmrq.png?imageView2/2/w/1620)

它的原理很简单，就是将代码提交的历史，按照两分法不断缩小定位。所谓"两分法"，就是将代码历史一分为二，确定问题出在前半部分，还是后半部分，不断执行这个过程，直到范围缩小到某一次代码提交。

本文通过一个实例，解释如何使用这个命令。下面是一个[代码库](https://github.com/bradleyboy/bisectercise)，请将它克隆到本地。

```javascript
$ git clone git@github.com:bradleyboy/bisectercise.git
$ cd bisectercise
```

这个库是一个网页`index.html`，在浏览器打开这个网页。

```javascript
$ open index.html
```

![img](https://ask.qcloudimg.com/http-save/yehe-1634626/ankbdb4ieg.png?imageView2/2/w/1620)

网页上是一个计数器，有两个按钮。点击`+`号按钮，可以看到计数器没有递增，反而递减，这说明代码有问题。

现在，就要来查找，到底哪一次代码提交，引入了错误。首先，检查一下代码提交历史。

```javascript
$ git log --pretty=oneline
```

可以看到，这个库一共有101次提交。最早的第一次提交的哈希是`4d83cf`。

`git bisect start`命令启动查错，它的格式如下。



```javascript
git bisect start [latest] [old]
git bisect start [终点] [起点]
git bisect start [BAD [GOOD...]]
```

上面代码中，"终点"是最近的提交，"起点"是更久以前的提交。它们之间的这段历史，就是差错的范围。

这个例子中，我们选择全部的代码历史。起点是第一次提交`4d83cf`，终点是最近一次的`HEAD`。当然，指定其他范围也可以。

```javascript
$ git bisect start HEAD 4d83cf
```

执行上面的命令以后，代码库就会切换到这段范围正当中的那一次提交，本例是第51次提交。

现在刷新浏览器，点击`+`按钮，发现可以正常递增。使用`git bisect good`命令，标识本次提交（第51次）没有问题。

```javascript
$ git bisect good
```

既然第51次提交没有问题，就意味着错误是在代码历史的后半段引入的。执行上面的命令，Git 就自动切换到后半段的中点（第76次提交）。

现在刷新浏览器，点击`+`按钮，发现不能正常递增。使用`git bisect bad`命令，标识本次提交（第76）有问题。

```javascript
$ git bisect bad
```

执行上面的命令以后，Git 就自动切换到第51次到第76次的中点（第63次提交）。

接下来，不断重复这个过程，直到成功找到出问题的那一次提交为止。这时，Git 会给出如下的提示。

```javascript
b47892 is the first bad commit
```

既然找到那个有问题的提交，就可以[检查代码](https://github.com/bradleyboy/bisectercise/commit/b47892adec22ee3b0330aff37cbc5e695dfb99d6)，确定具体是什么错误。

然后，使用`git bisect reset`命令，退出查错，回到最近一次的代码提交。

```javascript
$ git bisect reset
```

现在就可以开始修复错误了。



```shell
git bisect log
git bisect visualize  # 查看出错的commit-id
```





### Error

是不是bad good弄错了。

```
The merge base 531c1161b9758aa7eae1a4dd8ecf11fdf4417b29 is bad.
This means the bug has been fixed between 531c1161b9758aa7eae1a4dd8ecf11fdf4417b29 and [19d96ca63f8480ae705a377cd98c072916d33590].
```

比如latest是good, old is the bad，你想要找到变好的那个commit

```shell
git bisect start [latest] [old]
```

结果如果是好的，你应该`git bisect bad`，如果是坏的，你应该`git bisect good`。



### 有merge的情况时，是很复杂的，要多加注意

