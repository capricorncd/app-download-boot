/**
 * Created by Capricorncd on 2017/6/28 0028.
 */

class appDownloadBoot {

    constructor (opts: any) {
        this.opts = this.concatOptions(opts);

        // 创建meta标签，只对ios6及以上safari浏览器有效
        if (this.isIos || this.isIpad) {
            this.createIosMeta();
        }
    };

    // 合并默认配置参数与用户设置的参数
    concatOptions (opts) {
        opts = opts instanceof Object ? opts : {};
        let obj = {};

        for (let key in opts) {
            obj[key] = opts[key];
        }
        // 默认配置
        let _DEFAULT = {
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
        }
        
        for (let key1 in _DEFAULT) {
        	if (!obj[key1]) {
                opts.callback && opts.callback({
                    code: 1,
                    msg: `${key1} 未配置`
                });
        		obj[key1] = _DEFAULT[key1];
        	}
        	
        	if (_DEFAULT[key1] instanceof Object) {
            	for (let k in _DEFAULT[key1]) {
            		let val = _DEFAULT[key1][k];

            		try {
            			if (!obj[key1][k]) {
                            opts.callback && opts.callback({
                                code: 2,
                                msg: `${key1}属性${k} 未配置`
                            });
	            			obj[key1][k] = val;
	            		}
            		} catch (e) {}
            		
            	}
            }
        }
        return obj;
    }

    // 点击下载
    download () {
        let android = this.opts.android || {};
        let ios = this.opts.ios || {};

        // 尝试启动app
        if(this.isWeixin) {
            this.opts.callback && this.opts.callback({
                code: 3,
                msg: '微信浏览器'
            });
            // 进入腾讯应用宝
            // 实现应用宝二次跳转
            // 说明文档 http://wiki.open.qq.com/index.php?title=mobile/%E5%BA%94%E7%94%A8%E5%AE%9D%E5%BE%AE%E4%B8%8B%E8%BD%BD
            if (android.yyb) {
                window.location.href = android.yyb;
            } else {
                this.opts.callback && this.opts.callback({
                    code: 4,
                    msg: '腾讯应用宝推广链接未配置'
                });
            }
        }
        // 移动设备其他浏览器
        else if(this.isMobile) {
            // Android
            if(this.isAndroid) {
                this.opts.callback && this.opts.callback({
                    code: 5,
                    msg: 'andriod设备'
                });
                // 尝试启动app
                this.tryStarting(android.schema);
                // 访问apk文件，直接下载
                let timer = setTimeout(function() {
                    window.location.href = android.file;
                    clearTimeout(timer);
                }, 500);
            } else if(this.isIos || this.isIpad) {
                this.opts.callback && this.opts.callback({
                    code: 6,
                    msg: 'ios设备'
                });
                // Ios
                // 尝试启动app
                this.tryStarting(ios.schema);
                // 进入appStore
                let timer = setTimeout(function() {
                    window.location.href = ios.appstore;
                    clearTimeout(timer);
                }, 600);
            }
        }
        // pc端或其他未知设备
        else {
            this.opts.callback && this.opts.callback({
                code: 7,
                msg: '其它设备'
            });
            window.location.href = this.opts.url;
        }
    }

    // 尝试启动app
    tryStarting (schemaUrl) {
        // 创建iframe
        // 通过iframe.src尝试启动app
        if(schemaUrl){
            let iframe = document.createElement('iframe');
                iframe.style.cssText='display:none;width=0;height=0';
                iframe.src = `${schemaUrl}?url=${this.opts.url}`;
            document.body.appendChild(iframe);
            this.opts.callback && this.opts.callback({
                code: 8,
                msg: '尝试启动app: ' + iframe.src
            });
        } else {
            this.opts.callback && this.opts.callback({
                code: 9,
                msg: '未配置schema协议'
            });
        }
    }

    // 创建meta标签
    createIosMeta () {
        let appid = this.opts.ios.appid;
        let meta = document.createElement('meta');
            meta.setAttribute('name', 'apple-itunes-app');
            meta.setAttribute('content', `app-id='${appid}', affiliate-data=myAffiliateData, app-argument='${appid}'`);
        document.querySelector('head').appendChild(meta);
    }

    // 微信
    isWeixin: boolean = !!(/MicroMessenger/ig).test(navigator.userAgent);
    // QQ
    // isQQ: boolean = !!(/qq/ig).test(navigator.userAgent);
    // 移动设备
    isMobile: boolean = !!navigator.userAgent.match(/(iphone|ipod|ipad|android|ios)/ig);
    // Android Device
    isAndroid: boolean = !!navigator.userAgent.match(/android/ig);
    // IOS Device
    isIos: boolean = !!navigator.userAgent.match(/(iphone|ipod|ios)/ig);
    // Ipad Device
    isIpad: boolean = !!navigator.userAgent.match(/ipad/ig);
    // Ios9 Device
    isIos9: boolean = !!navigator.userAgent.match(/OS 9/ig);
    // Chrome 浏览器
    // isChrome: boolean = !!navigator.userAgent.match(/Chrome\/([\d.]+)/) || navigator.userAgent.match(/CriOS\/([\d.]+)/);

}