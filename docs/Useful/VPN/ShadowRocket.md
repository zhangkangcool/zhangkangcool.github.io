<h1 align="center">ShadowRocket</h1>


## IOS设备连接v2ray

 如何使用`shadowrocket`，需使用港服账号下载该软件。



https://www.4spaces.org/how-to-use-shadowrocket/





# 配置文件（设置哪些过滤，哪些直连）

连接上VPN后，才能进行下载



https://www.4spaces.org/shadowrocket-conf/



这里是一系列好用的科学上网规则，针对[Shadowrocket](https://liguangming.com/Shadowrocket)开发，支持广告过滤。



## 黑名单过滤 + 广告

黑名单中包含了境外网站中无法访问的那些，对不确定的网站则默认直连。

- 代理：被墙的网站（GFWList）
- 直连：正常的网站
- 包含广告过滤

规则地址：

```
https://raw.githubusercontent.com/h2y/Shadowrocket-ADBlock-Rules/master/sr_top500_banlist_ad.conf
```

## 白名单过滤 + 广告

白名单中包含了境外网站中可以访问的那些，对不确定的网站则默认代理。

- 直连：top500 网站中可直连的境外网站、中国网站
- 代理：默认代理其余的所有境外网站
- 包含广告过滤

规则地址：

```
https://raw.githubusercontent.com/h2y/Shadowrocket-ADBlock-Rules/master/sr_top500_whitelist_ad.conf
```

## 黑名单过滤(推荐)

现在很多浏览器都自带了广告过滤功能，而广告过滤的规则其实较为臃肿，如果你不需要全局地过滤 App 内置广告和视频广告，可以选择这个不带广告过滤的版本。

- 代理：被墙的网站（GFWList）
- 直连：正常的网站
- 不包含广告过滤

规则地址：

https://raw.githubusercontent.com/h2y/Shadowrocket-ADBlock-Rules/master/sr_top500_banlist.conf

## 白名单过滤

现在很多浏览器都自带了广告过滤功能，而广告过滤的规则其实较为臃肿，如果你不需要全局地过滤 App 内置广告和视频广告，可以选择这个不带广告过滤的版本。

- 直连：top500 网站中可直连的境外网站、中国网站
- 代理：默认代理其余的所有境外网站
- 不包含广告过滤

规则地址：

```
https://raw.githubusercontent.com/h2y/Shadowrocket-ADBlock-Rules/master/sr_top500_whitelist.conf
```

## 国内外划分 + 广告

国内外划分，对中国网站直连，外国网站代理。包含广告过滤。国外网站总是走代理，对于某些港澳台网站，速度反而会比直连更快。

规则地址：

```
https://raw.githubusercontent.com/h2y/Shadowrocket-ADBlock-Rules/master/sr_cnip_ad.conf
```

## 国内外划分

国内外划分，对中国网站直连，外国网站代理。不包含广告过滤。国外网站总是走代理，对于某些港澳台网站，速度反而会比直连更快。

规则地址：

```
https://raw.githubusercontent.com/h2y/Shadowrocket-ADBlock-Rules/master/sr_cnip.conf
```

其他规则，请参考原文：[提供多款 Shadowrocket 规则，带广告过滤功能。用于 iOS 未越狱设备选择性地自动翻墙。](https://github.com/h2y/Shadowrocket-ADBlock-Rules)