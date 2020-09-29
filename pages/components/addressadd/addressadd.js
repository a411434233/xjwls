import {api, Get, GetChannelCode, Post, ShowNoneToast, Token} from '../../../utils/common';
import CITY from '../../../data/city.json';

Page({
    data: {
        provinces: '请选择省市区',
        city: '',
        area: '',
        addressdetail: '',
        name: '',
        telphone: '',
        is_default: false,
        telpopup: false,
        namepopup: false,
        citypopup: false,
        addressdetailpopup: false,
        successpopup: false,
        failpopup: false,
        user_ids: '',
        id: '',
        showsave: true,
        isShowDel: false
    },
    async onLoad(options) {
        if (options.id) {
            let res = await Get(api.GetAddress, {id: options.id});
            if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
            this.setData({
                id: options.id,
                provinces: res.data.Data.Province,
                city: res.data.Data.City,
                area: res.data.Data.Area,
                addressdetail: res.data.Data.Address,
                name: res.data.Data.UserName,
                telphone: res.data.Data.Tel,
                is_default: res.data.Data.IsDefault,
                isShowDel: true
            });
        }
    },
    onShow() {
        let data = {PageName: 'addressadd', ClickPlace: '增加地址', SoureChannel: GetChannelCode()};
        Post(api.PostStatisticSystem, data, true);
    },
    city: function () {
        if (my.regionPicker) {
            my.regionPicker({
                success: res => {
                    if (res.data) {
                        this.setData({provinces: res.data[0], city: res.data[1], area: res.data[2]});
                    }
                },
                fail: err => {
                    console.log(err);
                }
            });
        } else {
            my.multiLevelSelect({
                title: '省市区选择',
                list: CITY,
                success: res => {
                    if (res.success == false) return;
                    res = res.result;
                    this.setData({provinces: res[0].name, city: res[1].name, area: res[2].name});
                }
            });
        }
        if (this.data.city == '' || this.data.addressdetail == '' || this.data.name == '' || this.data.telphone.length != 11 || this.data.telphone == '') {
            this.setData({showsave: true});
        } else {
            this.setData({showsave: false});
        }
    },
    addressdetail(e) {
        this.setData({addressdetail: e.detail.value});

        if (this.data.city == '' || this.data.addressdetail == '' || this.data.name == '' || this.data.telphone.length != 11 || this.data.telphone == '') {
            this.setData({showsave: true});
        } else {
            this.setData({showsave: false});
        }
    },
    name(e) {
        this.setData({name: e.detail.value});
        if (this.data.city == '' || this.data.addressdetail == '' || this.data.name == '' || this.data.telphone.length != 11 || this.data.telphone == '') {
            this.setData({showsave: true});
        } else {
            this.setData({showsave: false});
        }
    },
    telphone(e) {
        this.setData({telphone: e.detail.value});
        if (this.data.city == '' || this.data.addressdetail == '' || this.data.name == '' || this.data.telphone.length != 11 || this.data.telphone == '') {
            this.setData({showsave: true});
        } else {
            this.setData({showsave: false});
        }
    },
    defaulttrue() {
        this.setData({is_default: true});
    },
    defaultfalse() {
        this.setData({is_default: false});
    },
    back() {
        my.navigateBack({delta: 1});
    },
    save() {
        if (this.data.city == '') {
            ShowNoneToast('请选择地址');
            return;
        }
        if (this.data.addressdetail == '') {
            ShowNoneToast('请填写详细地址');
            return;
        }
        if (this.data.name == '') {
            ShowNoneToast('请输入姓名');
            return;
        }
        if (this.data.telphone.length != 11 || this.data.telphone == '') {
            ShowNoneToast('电话号码有误');
            return;
        }
        let defaultis;
        if (this.data.is_default == false) {
            defaultis = 0;
        } else {
            defaultis = 1;
        }
        let data = {
            Province: this.data.provinces,
            City: this.data.city,
            Area: this.data.area,
            Address: this.data.addressdetail,
            UserName: this.data.name,
            Tel: this.data.telphone,
            Status: 1,
            IsDefault: defaultis
        };
        if (this.data.id != '') {
            data.id = this.data.id;
            data.Status = 2;
        } else {
            data.Status = 1;
        }
        Post(api.PostAddress, data, true).then(res => {
            if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
            ShowNoneToast(res.data.Msg, 'success').then(() => {
                my.navigateBack();
            });
        });
    },
    switchChange(e) {
        let is_default = e.detail.value;
        this.setData({is_default});
    },
    async del() {
        let info = await Token.getToken();
        let res = await Post(api.DeleteAddress, {addressId: this.data.id, token: info.token});
        if (res.data.Code == -1) return;
        let res2 = await Get(api.GetAddressList, {}, true);
        if (res2.data.Code == -1) return;
        ShowNoneToast(res.data.Msg, 'success').then(() => {
            my.navigateBack();
        });
    }
});
