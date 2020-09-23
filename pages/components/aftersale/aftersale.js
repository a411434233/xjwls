import {api, Get, Post, ShowNoneToast} from '../../../utils/common';

Page({
    data: {
        listyy: ['多拍/拍错/不想要', '其他'],
        active: 0,
        popshow: false,
        yuanyin: '选择退款原因',
        yuanyin1: '',
        imgUrls: [],
        status: '',
        orderid: '',
        orderlist: [],
        shuoming: '',
        wuliu: '',
        detail: '',
        addImgText: '拍照/相册',
        canAddImg: true,
        maxAddImgNum: 4,
        i: 0,
        imgArr: []
    },
    onLoad(options) {
        this.setData({status: options.status, orderid: options.orderid});
        Get(api.GetReceiptProducts, {orderCode: this.data.orderid}).then(res => {
            this.setData({orderlist: res.data.Data});
        });
    },
    tabqh(e) {
        this.setData({active: e.currentTarget.dataset.index, yuanyin1: e.currentTarget.dataset.val});
    },
    showpop() {
        this.setData({popshow: true, yuanyin1: '多拍/拍错/不想要'});
    },
    closepop() {
        this.setData({popshow: false});
    },
    surepop() {
        this.setData({popshow: false, yuanyin: this.data.yuanyin1});
    },
    shuominginp(e) {
        this.setData({shuoming: e.detail.value});
    },
    wuliuinp(e) {
        this.setData({wuliu: e.detail.value});
    },
    addImg: function () {
        const that = this;
        my.chooseImage({
            count: that.data.maxAddImgNum,
            success: res => {
                that.setData({i: 0, imgArr: res.apFilePaths});
                that.uploadImg();
            }
        });
    },
    uploadImg: function () {
        const that = this;
        const ii = that.data.i;
        if (ii < that.data.imgArr.length) {
            my.uploadFile({
                url: api.BASE_URL + api.PostImagesImport,
                fileType: 'image',
                fileName: 'file',
                filePath: that.data.imgArr[that.data.i],
                formData: {},
                success: res => {
                    const _imgUrls = that.data.imgUrls;
                    _imgUrls.push(JSON.parse(res.data).Data);
                    that.setData({imgUrls: _imgUrls});
                    _imgUrls.length == 0 && that.set_data(that, _imgUrls, '拍照/相册', true);
                    _imgUrls.length > 0 && _imgUrls.length < that.data.maxAddImgNum && that.set_data(that, _imgUrls, '+', true);
                    _imgUrls.length >= that.data.maxAddImgNum && that.set_data(that, _imgUrls.splice(0, that.data.maxAddImgNum), '+', false);
                    that.setData({i: ii + 1});
                    that.uploadImg();
                }
            });
        }
    },
    delImg: function (e) {
        const index = e.currentTarget.dataset.index;
        const _imgUrls = this.data.imgUrls;
        _imgUrls.splice(index, 1);
        _imgUrls.length == 0 && this.set_data(this, _imgUrls, '拍照/相册', true);
        _imgUrls.length > 0 && _imgUrls.length < this.data.maxAddImgNum && this.set_data(this, _imgUrls, '+', true);
    },
    set_data: function (that, imgUrls, addImgText, canAddImg) {
        that.setData({imgUrls: imgUrls, addImgText: addImgText, canAddImg: canAddImg});
    },
    tj() {
        if (this.data.yuanyin == '' || this.data.yuanyin == '选择退款原因') {
            ShowNoneToast('请选择退款原因');
            return;
        }
        if (this.data.shuoming == '') {
            ShowNoneToast('请填写退款说明');
            return;
        }
        if (this.data.status == 1) {
            let data = {
                OrderId: this.data.orderid,
                AfterType: 1,
                RefundReason: this.data.yuanyin,
                RefundExplain: this.data.shuoming
            };
            Post(api.PostReceiptApply, data).then(res => {
                if (res.data.Code == 1) {
                    my.navigateTo({url: '/pages/components/aftersaledetail/aftersaledetail?orderid=' + this.data.orderid});
                }
            });
        } else {
            if (this.data.wuliu == '') {
                ShowNoneToast('请填写物流单号');
                return;
            }
            let data = {
                OrderId: this.data.orderid,
                AfterType: 2,
                RefundReason: this.data.yuanyin,
                RefundExplain: this.data.shuoming,
                RefundShipId: this.data.wuliu,
                refundImagesView: this.data.imgUrls.join(',')
            };
            Post(api.PostReceiptApply, data).then(res => {
                if (res.data.Code == 1) {
                    my.navigateTo({url: '/pages/components/aftersaledetail/aftersaledetail?orderid=' + this.data.orderid});
                }
            });
        }
    }
});
