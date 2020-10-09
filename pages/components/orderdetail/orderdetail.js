import {AliPay, api, Get, NavigateTo, Post, ShowNoneToast, SwitchTab, Token} from '../../../utils/common';

Page({
    data: {
        detail: '',
        time: '',
        orderid: '', //订单id
        times: '', //定时器名称
        status: '', //状态
        // wuliuxx: "",//物流
        address: '', //地址
        ShipCompany: '', //
        ShipOrderId: '', //
        https: '' //
    },
    onLoad(options) {
        Get(api.GetOrderParticulars, {
            orderCode: options.OrderCode
        }).then(res => {
            let data = res.data.Data;
            if (data.UserId == 0 && data.previewOrderView.length == 0) {
                my.alert({
                    title: '提示',
                    content: '订单已失效',
                    buttonText: '确定',
                    success: () => {
                        SwitchTab('/pages/tabbar/index/index');
                    }
                });
                return;
            }
            this.setData({
                address: data.addressManage,
                detail: data.previewOrderView[0],
                status: data.previewOrderView[0].Status,
                ShipCompany: data.ShipCompany,
                ShipOrderId: data.ShipOrderId,
                order: data
            });
            let shenyu = data.previewOrderView[0].CloseTime * 1;
            shenyu -= new Date().getTime();
            shenyu = parseInt(shenyu / 1000);
            this.TimeClock(shenyu);
        });
    },
    //倒计时
    TimeClock: function (shenyu) {
        if (shenyu <= 0) return;

        shenyu = parseInt(shenyu - 1);

        let shengyuD = parseInt(shenyu / 60 / 60 / 24);

        let shengyuH = parseInt((shenyu / 60 / 60) % 24);

        let shengyuM = parseInt((shenyu / 60) % 60);

        let S = parseInt(shenyu % 60);

        const time = shengyuD > 0 ? shengyuD + '天' : '' + shengyuH > 0 ? shengyuH + '时' : '' + shengyuM + '分' + S + '秒';
        this.setData({
            time: time
        });
        setTimeout(() => {
            return this.TimeClock(shenyu);
        }, 1000);
    },
    goshop() {
        my.switchTab({
            url: '/pages/tabbar/index/index'
        });
    },
    //去支付
    gopay(e) {
        Post(api.PostAliPayCreateOrder, {
            TransOrderCode: e.currentTarget.dataset.TransOrderCode,
            OrderCode: e.currentTarget.dataset.OrderCode
        }, true).then(res => {
            if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
            AliPay(res.data.Data.TradeNo, 20, e.currentTarget.dataset.OrderCode, false);
        });
    },
    //物流
    golog(e) {
        my.navigateTo({
            url: `/pages/components/logisDetail/logisDetail?orderid=${e.currentTarget.dataset.orderid}`
        });
    },
    //确认收货
    gosure(e) {
        Get(api.GetConfirmReceipt, {orderCode: e.currentTarget.dataset.orderid}).then(res => {
            if (res.data.Code == 1) {
                my.navigateBack();
            }
        });
    },
    //去评价
    goevaluate(e) {
        my.navigateTo({
            url: `/pages/components/evaluate/evaluate?orderid=${e.currentTarget.dataset.orderid}`
        });
    },
    //去删除
    async godel(e) {
        let info = await Token.getToken();
        Post(api.DeleteOrder, {orderCode: e.currentTarget.dataset.orderid, token: info.token}).then(res => {
            if (res.data.Code == 1) {
                my.navigateBack();
            }
        });
    },
    gothk(e) {
        my.navigateTo({
            url: `/pages/components/aftersale/aftersale?status=${e.currentTarget.dataset.status}&orderid=${e.currentTarget.dataset.orderid}`
        });
    },
    copydan(e) {
        my.setClipboard({
            text: e.currentTarget.dataset.ShipOrderId, // 剪贴板数据
            success: () => {
                my.alert({
                    content: '复制成功！'
                });
            }
        });
    }
});
