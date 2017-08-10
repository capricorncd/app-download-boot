/**
 * Created by Capricorncd on 2017/6/28 0028.
 */
var appDownloadBoot = (function () {
    function appDownloadBoot(opts) {
        // 微信
        this.isWeixin = !!(/MicroMessenger/ig).test(navigator.userAgent);
        // QQ
        // isQQ: boolean = !!(/qq/ig).test(navigator.userAgent);
        // 移动设备
        this.isMobile = !!navigator.userAgent.match(/(iphone|ipod|ipad|android|ios)/ig);
        // Android Device
        this.isAndroid = !!navigator.userAgent.match(/android/ig);
        // IOS Device
        this.isIos = !!navigator.userAgent.match(/(iphone|ipod|ios)/ig);
        // Ipad Device
        this.isIpad = !!navigator.userAgent.match(/ipad/ig);
        // Ios9 Device
        this.isIos9 = !!navigator.userAgent.match(/OS 9/ig);
        this.opts = this.concatOptions(opts);
        // 创建meta标签，只对ios6及以上safari浏览器有效
        if (this.isIos || this.isIpad) {
            this.createIosMeta();
        }
    }
    ;
    // 合并默认配置参数与用户设置的参数
    appDownloadBoot.prototype.concatOptions = function (opts) {
        opts = opts instanceof Object ? opts : {};
        var obj = {};
        for (var key in opts) {
            obj[key] = opts[key];
        }
        // 默认配置
        var _DEFAULT = {
            android: {
                file: null,
                schema: null,
                yyb: null
            },
            ios: {
                appid: null,
                schema: null,
                appstore: null
            },
            site: null,
            url: null
        };
        for (var key1 in _DEFAULT) {
            if (!obj[key1]) {
                opts.callback && opts.callback({
                    code: 1,
                    msg: key1 + " \u672A\u914D\u7F6E"
                });
                obj[key1] = _DEFAULT[key1];
            }
            if (_DEFAULT[key1] instanceof Object) {
                for (var k in _DEFAULT[key1]) {
                    var val = _DEFAULT[key1][k];
                    try {
                        if (!obj[key1][k]) {
                            opts.callback && opts.callback({
                                code: 2,
                                msg: key1 + "\u5C5E\u6027" + k + " \u672A\u914D\u7F6E"
                            });
                            obj[key1][k] = val;
                        }
                    }
                    catch (e) { }
                }
            }
        }
        return obj;
    };
    // 点击下载
    appDownloadBoot.prototype.download = function () {
        var android = this.opts.android || {};
        var ios = this.opts.ios || {};
        // 尝试启动app
        if (this.isWeixin) {
            this.opts.callback && this.opts.callback({
                code: 3,
                msg: '微信浏览器'
            });
            // 进入腾讯应用宝
            // 实现应用宝二次跳转
            // 说明文档 http://wiki.open.qq.com/index.php?title=mobile/%E5%BA%94%E7%94%A8%E5%AE%9D%E5%BE%AE%E4%B8%8B%E8%BD%BD
            if (android.yyb) {
                window.location.href = android.yyb;
            }
            else {
                this.opts.callback && this.opts.callback({
                    code: 4,
                    msg: '腾讯应用宝推广链接未配置'
                });
            }
        }
        else if (this.isMobile) {
            // Android
            if (this.isAndroid) {
                this.opts.callback && this.opts.callback({
                    code: 5,
                    msg: 'andriod设备'
                });
                // 尝试启动app
                this.tryStarting(android.schema);
                // 访问apk文件，直接下载
                var timer_1 = setTimeout(function () {
                    window.location.href = android.file;
                    clearTimeout(timer_1);
                }, 500);
            }
            else if (this.isIos || this.isIpad) {
                this.opts.callback && this.opts.callback({
                    code: 6,
                    msg: 'ios设备'
                });
                // Ios
                // 尝试启动app
                this.tryStarting(ios.schema);
                // 进入appStore
                var timer_2 = setTimeout(function () {
                    window.location.href = ios.appstore;
                    clearTimeout(timer_2);
                }, 600);
            }
        }
        else {
            this.opts.callback && this.opts.callback({
                code: 7,
                msg: '其它设备'
            });
            window.location.href = this.opts.url;
        }
    };
    // 尝试启动app
    appDownloadBoot.prototype.tryStarting = function (schemaUrl) {
        // 创建iframe
        // 通过iframe.src尝试启动app
        if (schemaUrl) {
            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'display:none;width=0;height=0';
            iframe.src = schemaUrl + "?url=" + this.opts.url;
            document.body.appendChild(iframe);
            this.opts.callback && this.opts.callback({
                code: 8,
                msg: '尝试启动app: ' + iframe.src
            });
        }
        else {
            this.opts.callback && this.opts.callback({
                code: 9,
                msg: '未配置schema协议'
            });
        }
    };
    // 创建meta标签
    appDownloadBoot.prototype.createIosMeta = function () {
        var appid = this.opts.ios.appid;
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'apple-itunes-app');
        meta.setAttribute('content', "app-id='" + appid + "', affiliate-data=myAffiliateData, app-argument='" + appid + "'");
        document.querySelector('head').appendChild(meta);
    };
    return appDownloadBoot;
}());
