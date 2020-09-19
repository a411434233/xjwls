import {AliPay, api, Get, GetStorageSync, NavigateTo, Post, ShowNoneToast, Token} from '../../../utils/common';

Page({
  data: {
    isHidePart: false,
    codeUrl: '',
    cancelModel: false, //是否展示取消弹窗
    isDelivery: true, //是否为配送订单,
    orderCode: ''
  },
  onLoad(query) {
    this.getOrderData(query.orderCode);
    let storeInfo = GetStorageSync('storeInfo');
    this.setData({ storeInfo });
  },
  async getOrderData(orderCode) {
    let info = await Token.getToken();
    //获取清单列表
    orderCode = orderCode ? orderCode : this.data.orderCode;
    Get(api.GetOrderInfo, { orderCode: orderCode, token: info.token }).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      let data = res.data.Data;
      let codeUrl = 'https://apiisv001.smjpin.cn/qrcode/getqrcode?ordercode=' + orderCode + '&businessCode=' + Token.appId;
      this.setData({ ...data, isDelivery: data.OrderType == '2' ? true : false, orderCode, codeUrl });
    });
  },
  showCode() {
    my.previewImage({
      current: 0,
      urls: [this.data.codeUrl]
    });
  },
  goStore() {
    my.openLocation({
      longitude: this.data.Longitude,
      latitude: this.data.Latitude,
      name: this.data.ShopName,
      address: this.data.ShopAddress
    });
  },
  pickSale() {
    let { ShopOrderProductList } = this.data;
    if (ShopOrderProductList && ShopOrderProductList.length) {
      NavigateTo('/pages/components/storeList/storeList?ProductId=' + ShopOrderProductList[0].ProductId);
    }
  },
  //再买一单
  async tapBuyAgain() {
    let appid = await Token.getAppId();
    Get(api.RepeatCreateOrder, {
      orderCode: this.data.orderCode,
      businessCode: appid
    }).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      my.reLaunch({
        url: '/pages/tabbar/index/index'
      });
    });
  },
  //付款
  async payment() {
    Post(api.PostAliPayCreateOrder, { TransOrderCode: this.data.TransOrderCode, OrderCode: this.data.orderCode }, true).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      AliPay(res.data.Data.TradeNo, 20, this.data.OrderCode, false);
    });
  },
  //取消订单
  tapCancelOrder() {
    this.setData({
      cancelModel: true
    });
  },
  // 删除订单
  async tapCancel() {
    let info = await Token.getToken();
    Post(api.DeleteOrder, { orderCode: this.data.orderCode, token: info.token }).then(res => {
      ShowNoneToast(res.data.Msg);
      this.setData({ cancelModel: false });
    });
  },
  //关闭弹窗
  tapCloseModeal() {
    this.setData({
      cancelModel: false
    });
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getOrderData(this.data.orderCode);
    my.stopPullDownRefresh();
  }
});
