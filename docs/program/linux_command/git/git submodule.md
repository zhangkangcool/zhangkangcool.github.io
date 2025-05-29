https://www.jianshu.com/p/2d74a6f41d07?u_atoken=5b7262f6-25f3-43b5-9345-e011135fc5cc&u_asession=013FeaJH5z4FUShutzhH4BjF08iy1A2FlUSSpRhPyQXJGgEMtcKDKVLn8YYO6w7cycX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K8uclpM16flIU70hl2sC9DYAt9AIvYhu5Tuzl1JEP_OamBkFo3NEHBv0PZUm6pbxQU&u_asig=05DeK0a0DKFecR--vOFG3Mvp-vj5ZLVc4CnUS_rL4cmROmoZvLEcdxSemrSIAQXe2BE_y8GR7brmSB4PsLmsVOasT_p3SiJ9k_sozmRsTrab1gRl2Y8Xrr3OLXSbGo_XaZv8mFui05Y6srRoslkFvuZw34lkhIZn84vr75PUIKrPz9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzQrnN0nVoRdz-igOIrDYgEPlBGEWiTfizbDWLLgfYc8RcYXgoUw8UHphWe030pDERu3h9VXwMyh6PgyDIVSG1W9M0Enn8a5bbqmLGLF0bVJaZLoTycCbaHWtF7OlfSpaCoor1MwY-P8MpCZxeaVzPVaQ6IyKezohWil8te5AFw7VmWspDxyAEEo4kbsryBKb9Q&u_aref=l4skD1PzbKQdvWPjtaFQaWG6lwE%3D



# 深入理解Git submodules



[DeepNoMind](https://www.jianshu.com/u/f1a9c3ae8d22)关注

0.5142021.10.04 09:57:10字数 3,336阅读 12,732

> *DRY原则是程序世界的基本原则之一，我们每个人在工作中都不可避免的会复用别人的代码，有可能是某个开源项目，也有可能是公司里其他团队提供的模块。Git是最流行的现代化代码版本控制工具，为了支持模块的复用，Git引入了submodule的概念，通过这篇文章，你会理解什么是git submodule以及在项目中如何应用。原文：Understanding and Working with Submodules in Git[1]*

**大部分现代软件项目都需要依赖于他人的工作，当别人已经实现了一个很好的解决方案，就不需要再浪费时间再去实现一遍。因此很多项目都会以库或模块的形式使用第三方代码。**

Git是世界上最流行的版本控制系统，它提供了一种优雅、健壮的方式管理这些依赖关系。Git的“submodule”概念允许我们引用和管理第三方库，同时保持与我们自己的代码清晰的隔离。

在本文中，您将了解到为什么Git中的submodule能起作用、它的底层逻辑是什么以及它是如何工作的。

# 保持代码独立

为了弄清楚为什么Git的submodule很有价值，让我们先看一个没有submodule的例子。当我们需要引用第三方代码（比如开源库）的时候，最简单的办法是从GitHub下载代码，然后将其保存到自己的项目中。虽然这么做可以很快解决问题，但这么做非常丑陋，原因如下：

- 通过强制将第三方代码复制到项目中，我们可以有效的将多个项目混合到一个项目中，而我们自己的项目和别人的项目（库）之间的界限开始变得模糊。
- 每当我们需要更新库代码时（也许是因为它的维护者提供了一个很棒的新特性或修复了一个讨厌的bug），我们都必须再次下载、复制和粘贴，这很快就变成了一个乏味的过程。

软件开发中“将不同的东西分开”的一般规则是有原因的。当然，在自己的项目中管理第三方代码也需要这样，而Git submodule的概念正是针对这些情况而设计的。

当然，submodule并不是解决这类问题的唯一方法，我们还可以使用许多现代语言和框架提供的各种“包管理器”系统，选择哪种依赖管理方法并没有绝对的对错之分。

不过，Git的submodule体系架构有以下几个优点：

- Submodule提供一致、可靠的接口，和语言或框架无关。当我们使用多种技术时，每种技术可能都有自己的包管理器和自己的一组规则和命令，而Submodule总是可以以相同的方式工作。
- 不是每段代码都可以通过包管理器复用，有时候我们只想在两个项目之间共享自己的代码，在这种情况下，submodule可以提供最简单的工作流。

# Git Submodule到底是什么

Git中的submodule实际上只是标准的Git repository。并没有什么花哨的创新，就只是我们现在都很熟悉的Git repository而已。这也是submodule的一项优势：它们十分健壮、方便直接，因为从技术角度来说，没有任何新东西在里面，并且经过了大量现场测试的考验。

使Git repository成为submodule的唯一原因是它被放在了另一个父Git repository中。

除此之外，Git submodule仍然是一个功能完整的repository：我们可以执行所有常规的Git操作——从修改文件，一直到commit、pull和push，在submodule中都可以实现。

# 添加一个Submodule

让我们举一个典型的例子，假设我们想要向项目中添加一个第三方库，在我们获取任何代码之前，需要先创建一个单独的文件夹，作为第三方库存储的路径：



```ruby
$ mkdir lib
$ cd lib
```

现在，我们准备将一些第三方代码以submodule的方式注入到项目中，下面假设我们需要一个小小的“时区转换器”JavaScript库：



```csharp
$ git submodule add https://github.com/spencermountain/spacetime.git
```

当我们运行这个命令时，Git开始将repository作为submodule克隆到我们的项目中:



```bash
Cloning into 'carparts-website/lib/spacetime'...
remote: Enumerating objects: 7768, done.
remote: Counting objects: 100% (1066/1066), done.
remote: Compressing objects: 100% (445/445), done.
remote: Total 7768 (delta 615), reused 975 (delta 588), pack-reused 6702
Receiving objects: 100% (7768/7768), 4.02 MiB | 7.78 MiB/s, done.
Resolving deltas: 100% (5159/5159), done.
```

看一下工作区文件夹，我们可以看到库文件实际上已经加到项目里了。

![img](https://upload-images.jianshu.io/upload_images/15825758-b69d6c9370aee440.png?imageMogr2/auto-orient/strip|imageView2/2/w/660/format/webp)

你可能会问：“那有什么区别呢？”。毕竟，第三方库的文件都在这里，就像我们复制粘贴它们一样。关键的区别在于它们包含在自己的Git repository中！如果我们只是下载一些文件，将它们扔到我们的项目中，然后提交它们——就像我们项目中的其他文件一样——它们将成为同一个Git repository的一部分。然而，submodule可以确保库文件不会“泄漏”到主项目的repository中。

让我们看看还发生了什么：在主项目的根文件夹中创建了一个新的`.gitmodules`文件，下面是这个文件的内容：



```csharp
[submodule "lib/spacetime"]
  path = lib/spacetime
  url = https://github.com/spencermountain/spacetime.git
```

这个`.gitmodules`文件是Git用来跟踪项目中的submodule的几个配置之一，另一个是`.git/config`，它的结尾被添加了下面的配置：



```csharp
[submodule "lib/spacetime"]
  url = https://github.com/spencermountain/spacetime.git
  active = true
```

最后，Git还在内部的`.git/modules`文件夹中保存了每个子模块的`.git`仓库的副本。

你不需要记住所有这些技术细节。可以看到，Git submodule的内部维护是相当复杂的，因此请记住：**千万不要手工修改Git子模块的配置！**如果你想移动、删除或以其他方式操作子模块，请不要手动尝试。要么使用适当的Git命令，要么使用像“Tower”[2]这样的Git桌面GUI，它们会处理这些细节。

![img](https://upload-images.jianshu.io/upload_images/15825758-5bdcf14a780c7129.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

现在我们已经添加了子模块，让我们看看主项目的状态：



```cpp
$ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
  new file:   .gitmodules
  new file:   lib/spacetime
```

如您所见，Git将添加submodule视为与其他任何更改一样的更改。因此，我们必须像其他任何更改一样提交此次更改：



```ruby
$ git commit -m "Add timezone converter library as a submodule"
```

# 克隆一个含有submodule的项目

在上面的示例中，我们向现有的Git repository添加了一个新的submodule。但是，反过来，当我们需要克隆一个已经包含submodule的仓库时，又会怎么样呢？

如果我们执行普通的`git clone <remote-URL>`，将会下载主项目，但任何submodule文件夹都是空的！这再次生动的证明了submodle文件是独立的，不包含在它们的父仓库中。

在这种情况下，要在克隆了父仓库之后填充submodule，可以简单地执行`git submodule update --init --recursive`。不过更好的方法是在调用`git clone`时直接添加`--recurse-submodules`选项。

# 使用特定版本

在普通的Git仓库中，我们通过使用`git checkout <branchname>`或者在Git 2.23引入的`git switch <branchname>`，告诉git当前活动的分支是什么。当在这个分支上进行新的提交时，HEAD指针会自动移动到最近的提交。理解这一点很重要——因为Git submodule的工作方式不太一样！

在submodule中，我们总是签出一个特定的版本——而不是一个分支！即使在submodule中执行`git checkout main`这样的命令，在后台，也只会把该分支上当前最新的提交记录下来，而不会改变分支本身的内容。

这并不是系统错误，而是有意设计的。考虑一下：当我们引用第三方库时，希望完全控制在主项目中使用的确切代码。当库的维护者发布一个新版本（这当然很好），我们不一定希望这个新版本立马被应用到项目中，因为我们还不知道这些新的更改是否会破坏我们的项目！

如果想知道项目中的子模块使用的是什么版本，可以在主项目中查看以下信息：



```ruby
$ git submodule status
   ea703a7d557efd90ccae894db96368d750be93b6 lib/spacetime (6.16.3)
```

上面显示了`lib/spacetime`子模块当前签出的版本，它还告诉我们这个版本是基于一个名为“6.16.3”的tag。在Git中处理submodule时，经常会使用tag。

要是我们希望submodule使用tag为“6.14.0”的旧版本。首先，我们必须更改目录，以便在子模块的上下文中执行Git命令。然后，我们可以基于tag执行git checkout：



```ruby
$ cd lib/spacetime/
$ git checkout 6.14.0
Previous HEAD position was ea703a7 Merge pull request #301 from spencermountain/dev
HEAD is now at 7f78d50 Merge pull request #268 from spencermountain/dev
```

如果我们回到主项目，再次执行`git submodule status`，我们会看到：



```ruby
$ cd ../..
$ git submodule status
+7f78d50156ae1205aa50675ddede81a61a45fade lib/spacetime (6.14.0)
```

仔细看一下输出：SHA-1哈希值前面的小`+`符号告诉我们，submodule的版本与当前存储在父仓库中的版本不同。由于我们刚刚更改了已签出的版本，因此这是正常的。

在主项目中调用`git status`也会告诉我们这个事实：



```rust
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  modified:   lib/spacetime (new commits)
```

可以看到，Git认为移动submodule的指针和其他变化一样：如果我们保存这个改动，就必须提交到仓库里：



```ruby
$ git commit -m "Changed checked out revision in submodule"
$ git push
```

# 更新Git Submodule

在上面的步骤中，是我们移动了submodule指针：我们选择签出一个不同的修订，提交它，并将它推送到团队的远程仓库中。但如果我们的一个同事更改了submodule的修订——可能是因为子模块发布了一个有趣的新版本，而我们决定在项目中使用它（当然是在彻底测试之后……）。

我们在主项目中做一个简单的`git pull`——我们可能会经常这么做——从共享远程仓库中获得新的更改：



```rust
$ git pull
From https://github.com/gntr/git-crash-course
   d86f6e0..055333e  main       -> origin/main
Updating d86f6e0..055333e
Fast-forward
   lib/spacetime | 2 +-
   1 file changed, 1 insertion(+), 1 deletion(-)
```

倒数第二行表示子模块中的某些内容已被更改，让我们仔细看看：



```ruby
$ git submodule status
+7f78d50156ae1205aa50675ddede81a61a45fade lib/spacetime (6.14.0)
```

我相信你还记得那个小`+`号：它表示submodule指针被移动了！要将本地签出的版本更新为我们的团队成员选择的“官方”版本，可以运行`update`命令：



```csharp
$ git submodule update lib/spacetime 
Submodule path 'lib/spacetime': checked out '5e3d70a88180879ae0222b6929551c41c3e5309e'
```

好了！我们签出了主项目仓库中记录的submodule版本！

# 在工作中使用Git Submodule

我们已经介绍了使用Git submodule的基本概念，其他工作流程是相当标准的。

例如，**检查子模块中新的更改**的工作方式与其他任何Git repository类似：在submodule repository中运行`git fetch`命令，如果你确实想要使用这些更新，可能会接着执行类似`git pull origin main`的命令。

如果是自己管理的内部代码库，那也可能需要**在子模块中进行更改**。可以像处理任何其他Git仓库一样处理submodule：可以进行更改、提交更改、推送更改等等。

# 使用Git的全部功能

在表面简单的命令下面，Git提供了很强大的功能。但是它的许多高级工具——比如Git submodule——并不为人所知。这么多开发人员错过了很多强大的东西，这真是太遗憾了！

如果你想深入了解其他一些先进的Git技术，强烈推荐一个免费短视频合集：“Advanced Git Kit”[3]，你可以学到Reflog、Interactive Rebase、Cherry-Picking，甚至分支策略等主题。

祝你成为一个更好的开发者！

> **References:**
> [1] [https://www.sitepoint.com/git-submodules-introduction/](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.sitepoint.com%2Fgit-submodules-introduction%2F)
> [2] [https://www.git-tower.com/?utm_source=sitepoint&utm_medium=guestpost&utm_campaign=git-submodules](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.git-tower.com%2F%3Futm_source%3Dsitepoint%26utm_medium%3Dguestpost%26utm_campaign%3Dgit-submodules)
> [3] [https://www.git-tower.com/learn/git/advanced-git-kit?utm_source=sitepoint&utm_medium=guestpost&utm_campaign=git-submodules](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.git-tower.com%2Flearn%2Fgit%2Fadvanced-git-kit%3Futm_source%3Dsitepoint%26utm_medium%3Dguestpost%26utm_campaign%3Dgit-submodules)