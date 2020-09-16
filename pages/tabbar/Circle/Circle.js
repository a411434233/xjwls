Page({
    data: {
        show: 0
    },
    onShow() {
        if (this.data.show == 0) {
            my.ap.navigateToAlipayPage({
                path: 'alipays://platformapi/startapp?appId=20000943&path=homepage&groupId=8e8466ea310e4e4b7389285409100000&sourceId=mini-program&source=2019092367680987',
                success: res => {
                    this.setData({show: 1});
                },
                fail: err => {
                    my.switchTab({
                        url: '/pages/tabbar/index/index'
                    });
                }
            });
            this.setData({show: 1});
        } else {
            this.setData({show: 0});
            my.switchTab({
                url: '/pages/tabbar/index/index'
            });
        }
    },
});
