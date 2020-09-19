import {api, Get, GetChannelCode, Post, ShowNoneToast} from '../../../utils/common';

Page({
    data: {
        addressdetail: '',
        user_ids: '' //
    },
    async onShow() {
        let res = await Get(api.GetAddressList, {}, true);
        if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
        this.setData({addressdetail: res.data.Data});
        let code = GetChannelCode();
        let data = {
            PageName: 'address',
            ClickPlace: '地址',
            SoureChannel: code
        };
        Post(api.PostStatisticSystem, data, true);
    },
    goaddressadd() {
        my.navigateTo({
            url: '/pages/components/addressadd/addressadd'
        });
    },
    async del(e) {
        await Get(api.PostAddressDel, {id: e.currentTarget.dataset.id});
        Get(api.GetAddressList, {}, true).then(res => {
            if (res.data.Code == 1) {
                this.setData({
                    addressdetail: res.data.Data
                });
            } else {
                this.setData({
                    addressdetail: ''
                });
            }
        });
    },
    edit(e) {
        my.navigateTo({
            url: '/pages/components/addressadd/addressadd?id=' + e.currentTarget.dataset.id
        });
    },
    goback(e) {
        my.navigateBack({
            delta: 1
        });
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            showaddress: false,
            cityprovince: e.currentTarget.dataset.province,
            addressManage: {
                Province: e.currentTarget.dataset.province,
                City: e.currentTarget.dataset.city,
                Area: e.currentTarget.dataset.area,
                Address: e.currentTarget.dataset.address,
                UserName: e.currentTarget.dataset.name,
                Tel: e.currentTarget.dataset.telephone,
                Id: e.currentTarget.dataset.id
            }
        });
    }
});
