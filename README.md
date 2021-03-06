# app-download-boot

> web网页引导app启动或下载。若有安装app则启动，未安装或启动失败（或超时）跳转至指定网页。

## 使用方法

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>App-Download-Boot by Capricorncd</title>
</head>
<body>
<header>
    <h1>NAME</h1>
    <p>App introduction or brief explanation</p>
</header>

<div class="btn-group">
    <button class="btn app-down" id="downloadBtn">Download</button>
</div>

<!--引入app-download-boot.js文件-->
<!--<script src="../dist/app-download-boot.js"></script>-->
<script src="../dist/app-download-boot.min.js"></script>
<script>
    var appDownload = new appDownloadBoot({
        android: {
            // 直接下载的文件地址
            file: 'http://kekecang.com/kekecang.apk',
            // 自定义协议，与app之间的通信（app捕获该协议做相应操作）
            // 需要Android程序员配合，教程 https://my.oschina.net/liucundong/blog/354029
            schema: 'xmq://',
            yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.gaijiawang.kekecang' // 应用宝推广链接
        },
        ios: {
            appid: "1110650922",
            // appStore
            appstore: 'https://itunes.apple.com/cn/app/ke-ke-cang/id1110650922?mt=8',
            // 自定义协议，与app之间的通信（app捕获该协议做相应操作）
            // 需要ios程序员配合，教程 http://blog.csdn.net/it_kaka/article/details/51958312
            schema: 'xmq://'
        },
        // app下载介绍页面或官网
        site: 'https://github.com/capricorncd',
        // 需要在App内打开的内容链接(app已安装时，启动App并加载此页面)
        url: 'https://github.com/capricorncd',
        // 消息回调
        callback: function (res) {
            console.log(res.code, res.msg)
        }
    });

    // 点击页面上的下载按钮，跳转或下载app
    document.getElementById('downloadBtn').onclick = function () {
        appDownload.download();
    };

</script>
</body>
</html>

```

## Options 参数

* android: `Object` 安卓系统相关配置。

>  file: `String` app文件链接地址。

>  schema: `String` 与app的通信协议，用于检验是否安装了该app或app捕获该协议做相应操作。

>  yyb: `String` 腾讯应用宝对应的app地址，当在微信中访问时，将跳转至该链接。

* ios: `Object` IOS设备，对应的相关配置。

>  appid: `Number` appid；

>  appstore: `String` apple store 对应的app下载地址；

> schema: `String`与app的通信协议，用于检验是否安装了该app或app捕获该协议做相应操作。

* site: `String` app下载介绍页面或官网地址。

* url: `String` 需要在App内打开的内容链接(app已安装时，启动App并加载此页面)或字符串。

* callback: `Function` 执行过程的消息回调，返回两个参数(code, msg)。

| code | msg |  
| -- | -- |  
| 1 | `xxx`参数未配置 |  
| 2 | `xxx`属性`prop`未配置 |  
| 3 | 启动App成功 |  
| 4 | 启动App失败 |  
| 5 | andriod设备 |  
| 6 | ios设备 |  
| 7 | 非Android/ios设备 |  
| 8 | 尝试启动app |  
| 9 | 未配置schema协议 |  


## 方法

* download() 

 app启动或下载。 若有安装app则启动，未安装或启动失败（或超时）跳转至指定网页。