https://blog.csdn.net/jiangjiang_jian/article/details/80739278



# Python清空文件并替换内容

需要加上f.seek(0)，把文件定位到position 0，没有这句的话，文件是定位到数据最后，truncate也是从这里删除，所以感觉就是没起作用。

```python
def modify_text():
    with open('test.txt', "r+") as f:
        read_data = f.read()
        f.seek(0)
        f.truncate()   #清空文件
        f.write(read_data.replace('apple', 'android'))
```

