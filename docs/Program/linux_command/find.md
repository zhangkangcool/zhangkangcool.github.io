<h1 align="center">find</h1>




```shell
# 查找名为 test.txt 的文件，排除 /home/ken 目录
sudo find / -path "/home/ken" -prune -o -name "test.txt" -print
sudo find / \( -path "/home" -o -path "/data" \) -prune -o -name cl_version.h
```



- `\( -path "/home" -o -path "/data" \)`：使用括号（需用反斜杠`\`转义，因为在 shell 中括号有特殊含义）将两个路径条件组合起来，`-o`表示逻辑或，即表示路径为`/home`或者`/data`的目录。
- `-prune`：对前面匹配到的`/home`和`/data`目录进行剪枝操作，也就是跳过这些目录及其子目录，不进行进一步的查找。
- `-o`：逻辑或操作符，用于连接排除条件和查找条件。
- `-name "your_file_name"`：指定要查找的文件名，你要把`your_file_name`替换成实际要查找的文件名。
- `-print`：打印符合条件的文件路径。



