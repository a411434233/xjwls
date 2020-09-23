import {api, Get, Post, ShowNoneToast, Token} from '../../../utils/common';

Page({
    data: {
        nackname: '',
        userid: '',
        addressdetail: ''
    },
    onLoad(options) {
        this.setData({
            nackname: options.nackname,
            userid: options.userid
        });
    },
    onShow() {
        this.getAddress();
    },
    getAddress() {
        return Get(api.GetAddressList, {}, true).then(res => {
            this.setData({
                addressdetail: res.data.Data
            });
        });
    },
    //信息授权
    async onGetAuthorize() {
        my.clearStorageSync();
        await Token.clearToken();
        let info = await Token.getToken();
        this.setData({
            userid: info.aliuser_id
        });
        my.getOpenUserInfo({
            success: async res => {
                const infomation = JSON.parse(res.response).response;
                let data = {
                    AliUserId: info.aliuser_id,
                    Avatar: infomation.avatar,
                    nickName: infomation.nickName,
                    Gender: infomation.gender,
                    countryCode: infomation.countryCode,
                    province: infomation.province,
                    city: infomation.city
                };
                await this.getAddress();
                await Post(api.PostUserUpdate, data).then(res => {
                    if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
                    this.setData({
                        nackname: infomation.nickName
                    });
                    this.getDebug(data, info);
                });
            },
            fail: err => {
                my.alert({
                    title: '提示',
                    content: '取消了授权(getOpenUserInfo)' + JSON.stringify(err),
                    buttonText: '我知道了'
                });
            }
        });
    },
    onAuthError(err) {
        my.alert({
            title: '操作结果',
            content: JSON.stringify(err),
            buttonText: '我知道了'
        });
    },
    async getDebug(user, info) {
        let Strong = my.getStorageSync({key: 'info'});
        my.getAuthCode({
            scopes: 'auth_base',
            success: async response => {
                let data = {
                    authCode: response.authCode
                };
                my.getSetting({
                    success: resa => {
                        let debugData = Object.assign({}, data, {"store": Strong}, {"shouquan": info}, {user: user}, {resa}, {Version: '1.9.7'});
                        my.setClipboard({
                            text: JSON.stringify(debugData)
                        });
                        my.alert({
                            title: '操作结果',
                            content: '成功',
                            buttonText: '我知道了'
                        });
                    },
                    fail: err => {
                        my.alert({
                            title: '提示',
                            content: JSON.stringify(err),
                            buttonText: '我知道了'
                        });
                    }
                });
            },
            fail: err => {
                my.alert({
                    title: '提示',
                    content: JSON.stringify(err),
                    buttonText: '我知道了'
                });
            }
        });
    },
    goaddress() {
        my.navigateTo({
            url: '/pages/components/address/address'
        });
    }
});
