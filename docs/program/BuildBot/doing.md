

merge失败后，调用某个sh，然后开启另一个merge



```
Good, 下一步先做个实验: 如果build的摸一个step里面我想改got版本能不能做到？

或者不一定是要改got,但是要验证一下：
比如像wyvern_dev的mergebot, merge了got，但是发现conflict，那我们可以调用脚本做minimalist merge和conflict resolution, 和后续，但这样了之后我们实际的merge就不是bulidbot刚起来的got.
那下一个build会如何？
```







```
[bbadmin@khamsin1:~/test_repo/hello-world]$ patch -p1 < ../0502_fix.patch
git add test.txt
git commit
```



search `merge-base`