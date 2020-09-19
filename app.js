if (!my.canIUse('plugin') && !my.isIDE) {
    my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
}
import {api, Get, getSysTemInfo, SetStorage} from './utils/common';

App({
    onLaunch() {
        getSysTemInfo().then(res => {
            let sysTem = res;
            if (sysTem.statusBarHeight >= 30) this.isiPhoneX = true;
            this.screenWidth = sysTem.screenWidth;
            this.titleHeight = sysTem.statusBarHeight + sysTem.titleBarHeight;
        });
    },
    //获取全局参数
    onShow(options) {
        if (options.query && options.query.id) {
            SetStorage('qdmc', {qdcode: options.query.id});
        }
    },
    throttle(fn, gapTime) {
        //防止多次点击跳转
        if (gapTime == null || gapTime == undefined) {
            gapTime = 1500;
        }
        let _lastTime = null;
        // 返回新的函数
        return function () {
            let _nowTime = +new Date();
            if (_nowTime - _lastTime > gapTime || !_lastTime) {
                //fn()如果直接调用，this指向会发生改变，所以用apply将this和参数传给原函数
                fn.apply(this, arguments); //将this和参数传给原函数
                _lastTime = _nowTime;
            }
        };
    },
    iniShopnum() {
        return Get(api.GetMyShopCartProTotalNum, {}, true).then(res => {
            if (!res.data.Data) return;
            return Promise.resolve(res);
        });
    },
    orderdata: {},
    swichQuery: '',
    isiPhoneX: false
});
