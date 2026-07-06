



```js

var Recordnumber = 1;
var nIntervId1;
function go2buy() {
  console.log("js脚本正在帮你抢购＊＊＊＊＊＊＊＊＊＊＊＊＊ 刷新" + Recordnumber + "次");
  Recordnumber++;
  D = document.getElementById("pro-operation");
  A = D.firstChild;
  if (A.className == "product-button02 disabled") {
    console.log("还未开始");
  } else {
    A.click();
    clearInterval(nIntervId0);    // 清楚排队计时器
    
  }
  D = undefined;
  A = undefined;
}



nIntervId0 = setInterval("go2buy()", 1);   // 1ms调用1次go2buy
```



```js

var Recordnumber = 1;
var nIntervId1;
function go2buy() {
  console.log("js脚本正在帮你抢购＊＊＊＊＊＊＊＊＊＊＊＊＊ 刷新" + Recordnumber + "次");
  Recordnumber++;
  D = document.getElementById("pro-operation");
  A = D.firstChild;
  if (A.className == "product-button02 disabled") {
    console.log("还未开始");
  } else {
    A.click();
    clearInterval(nIntervId0);    // 清楚排队计时器
    
  }
  D = undefined;
  A = undefined;
}



nIntervId0 = setInterval("go2buy()", 1);   // 1ms调用1次go2buy
```

