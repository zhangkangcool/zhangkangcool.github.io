设置分辨率为1024 * 768，否则出现的是手机版的页面。



https://blog.csdn.net/it_LiChengwei/article/details/113861161



```js
function rewrite(current) {
    fr4me = '<frameset cols=\'*\'>\n<frame src=\'' + current + '\'/>';
    fr4me += '</frameset>';
    with (document) { write(fr4me); void (close()) };
}

// 抢购参数设置
var Recordnumber=1;
var nIntervId1;

// go2buy函数的功能在抢购按钮刷新之后立马click
function go2buy() {
  console.log("js脚本正在帮你抢购＊＊＊＊＊＊＊＊＊＊＊＊＊ 刷新" + Recordnumber + "次");
  Recordnumber++;
  D = document.getElementById("pro-operation");
	A = D.firstChild;   // D.firstChild.nextSibling;
  if (A.className == "product-button02 disabled") {
    console.log("还未开始");
  } else {
    A.click();
    clearInterval(nIntervId0);
    nIntervId1 = setInterval("Submit()", 10);
  }
  
  D = undefined;
  A = undefined;
}

// Submit()函数的功能是商品抢到后自动提交订单
function Submit() {
	Sub = document.getElementById("checkoutSubmit");
	if (Sub) {
		document.getElementById("checkoutSubmit").click();
		clearInterval(nIntervId1);
		document.getElementById("checkoutSubmit").click();
	}
  
	Sub = undefined;
}

nIntervId0 = setInterval("go2buy()", 1);
```





https://blog.csdn.net/hjacto/article/details/114384585?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-19.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-19.control

```JS

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
    nIntervId1 = setInterval("SubmitOrder()", 10);   // 安装另一个定时器
  }
  D = undefined;
  A = undefined;
}
 
function SubmitOrder() {
  Sub = document.getElementById("checkoutSubmit");
  if (Sub) {
    document.getElementById("checkoutSubmit").click();
    clearInterval(nIntervId1);
    document.getElementById("checkoutSubmit").click();
  }
  Sub = undefined;
}


nIntervId0 = setInterval("go2buy()", 1);   // 1ms调用1次go2buy
```





```JS

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





立即抢购变成test

```JS
D = document.getElementById("pro-operation");
A = D.firstChild;
// A = D.firstChild.nextSibling;
A.innerHTML = "test";
// console.log("context: " + A.value);
```



```js


var arr = document.getElementsByClassName("product-button");
arr[0].innerHTML = "zhangkang";
console.log("arr is " + arr);
console.log(arr[0].innerHTML);
```





`getElementsByClassName`返回一个类数组对象，所有查询到的元素都会封装到对象中，使用索引读取该内容。

```js
var arr = document.getElementsByClassName("product-button");
arr[0].innerHTML = "zhangkang";
console.log("arr is " + arr);
console.log("arr[0] is " + arr[0]);
console.log(arr[0].innerHTML);

```



```js
var arr = document.getElementsByClassName("product-button02 disabled");
arr[0].innerHTML = "zhangkang";
console.log("arr is " + arr);
console.log("arr[0] is " + arr[0]);
console.log(arr[0].innerHTML);

```

