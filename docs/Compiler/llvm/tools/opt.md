<h1 align="center">opt</h1>










```shell
opt -O3 main.ll -S -o test.ll --debug-pass-manager > opt3.log 

opt -O3 main.ll -S -o test.ll --debug-pass=Structure > opt3.log 
```





```shell
opt和llc有很多优化是相同的，可以通过llc --help-list-hidden和opt --help-list-hidden
```





```shell
opt -view-cfg test.ll # 会生成dot文件，进行展示
```

