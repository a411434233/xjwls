import {api, Get} from '../../../utils/common'

Page({
    data: {
        footer: [{
            text: '首页',
        }, {
            text: '刷新',
        }],
    },
    onTapLeft() {
        my.switchTab({url: "/pages/tabbar/index/index"})
    },
    onTapRight() {
        Get(api.GetHomePageConfig).then(() => {
            this.onTapLeft()
        })
    },
});
