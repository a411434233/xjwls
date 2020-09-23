import {api, Get} from '../../../utils/common';

Page({
    data: {},
    onLoad(options) {
        my.showLoading({
            content: '获取中...'
        });
        Get(api.GetShipTrayRecord, {orderId: options.orderid}).then(res => {
            my.hideLoading();
            this.setData({
                wuliuDetail: res.data.Data.data.Result.WaybillProcessInfo,
                name: res.data.Data.name,
                no: res.data.Data.shipId,
            })
        })
    },
});
