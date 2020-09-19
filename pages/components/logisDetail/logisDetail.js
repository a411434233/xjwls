import {Get} from '../../../utils/common';

Page({
  data: {
    isReady: false
  },
  async  onLoad(options) {
    await this.logisData(options.orderid);
    my.loadPlugin({
      plugin: '2021001155688526@*', // 指定要加载的插件id和版本号，为*则每次拉取最新版本
      success: () => {
        this.setData({ isReady: true }); // 插件已加载，可以渲染插件组件了
      }
    });
  },
  logisData(orderCode) {
    let url = 'OrderForm/GetWayBill?orderCode=' + orderCode;
    return Get(url).then(res => {
      let data = res.data.Data;
      if (res.data.Code == 1) {
        this.setData({
          DeviceType: data.DeviceType,
          LogisticsCode: data.LogisticsCode,
          TradeNo: data.TradeNo,
          WaybillNo: data.WaybillNo
        });
      }
    });
  }
});
