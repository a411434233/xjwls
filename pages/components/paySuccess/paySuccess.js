import {api, NavigateTo, Post, SwitchTab, Token} from '../../../utils/common';

Page({
    data: {
        show: my.canIUse('life-follow'),
        newlist: [],
        list: [],
        VCoinsNum: ''
    },
    onLoad(options) {
        this.setData({
            orderCode: options.orderCode,
            VCoinsNum: options.VCoinsNum
        });
    },
    detayl() {
        my.reLaunch({url: '/pages/actives/actives?src=' + 'https://m.smjpin.cn/chihuochang/#/newpeople'});
    },
    //去详情
    godetail(e) {
        my.navigateTo({
            url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
        });
    },
    gofenl() {
        my.switchTab({
            url: '/pages/tabbar/sorta/sorta'
        });
    },
    gohome() {
        SwitchTab('/pages/tabbar/index/index');
    },
    gomine() {
        NavigateTo('/pages/components/myorder/myorder?activeindex=2');
    },
    async linqu(e) {
        let index = e.currentTarget.dataset.index;
        let info = await Token.getToken();
        Post(api.Receive, {
            token: info.token,
            orderCode: this.data.orderCode,
            CodeType: index
        }).then(res => {
            my.alert({
                title: '提示',
                content: res.data.Msg,
                buttonText: '确定',
                success: () => {
                    if (res.data.Code == 1) {
                        NavigateTo('/pages/actives/actives?src=https://m.smjpin.cn/chihuochang/#/myPrize');
                    }
                }
            });
        });
    }
});
