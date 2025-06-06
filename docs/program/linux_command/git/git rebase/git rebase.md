<h1 align="center">git rebase</h1>






```
git rebase
```



如果有冲突，解决完冲突后，使用

```
git add conflict_file
git rebase --continue
```



冲突文件也是会自动合并的，不过合并冲突的地方，会使用--head等标记，重点对这些地方进行选择修改。