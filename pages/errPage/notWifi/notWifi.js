import {api, Get} from '../../../utils/common'

Page({
    data: {
        footer: [{
            text: '首页',
        }, {
            text: '刷新',
        }],
    },
    onTapLeft(e) {
        my.switchTab({url: "/pages/tabbar/index/index"})
    },
    onTapRight(e) {
        Get(api.GetHomePageConfig).then(res => {
            this.onTapLeft()
        })
    },
});
