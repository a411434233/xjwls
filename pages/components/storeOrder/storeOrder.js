import {AliPay, api, Get, GetStorageSync, Post, ShowNoneToast, Token} from '../../../utils/common';

Page({
  data: {
    selectIndex: 2,
    pageIndex: 1,
    pageSize: 10,
    cancelModel: false, //是否展示取消弹窗
    OrderCode: ''
  },
  onLoad() {
    let storeInfo = GetStorageSync('storeInfo');
    this.setData({ storeInfo });
  },
  onShow() {
    this.getList();
  },
  onHide() {
    this.setData({
      selectIndex: 2,
      pageIndex: 1,
      pageSize: 10
    });
  },
  async getList() {
    let info = await Token.getToken();
    Get(api.GetOrderListByUser, { pageSize: this.data.pageSize, pageIndex: 1, orderType: this.data.selectIndex, token: info.token }, true).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      this.setData({ list: res.data.Data });
    });
  },
  // 选中tap
  tapSelect(e) {
    let index = e.target.dataset.index;
    this.setData({
      selectIndex: index
    });
    this.getList();
  },
  //订单详情
  tapDetails(e) {
    my.navigateTo({
      url: '/pages/components/storeOrderDetails/storeOrderDetails?orderCode=' + e.currentTarget.dataset.id
    });
  },
  async onReachBottom() {
    // 页面被拉到底部
    let info = await Token.getToken();
    let pageIndex = this.data.pageIndex;
    pageIndex += 1;
    Get(api.GetOrderListByUser, { pageSize: this.data.pageSize, pageIndex: pageIndex, orderType: this.data.selectIndex, token: info.token }).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      let list = this.data.list.concat(res.data.Data);
      this.setData({ list, pageIndex });
    });
  },
  //付款
  async payment(e) {
    let { OrderCode, TransOrderCode } = e.currentTarget.dataset;
    Post(api.PostAliPayCreateOrder, { OrderCode, TransOrderCode }, true).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      AliPay(res.data.Data.TradeNo, 20, OrderCode, false);
    });
  },
  //取消
  async tapShowCancel(e) {
    this.setData({
      cancelModel: true,
      OrderCode: e.target.dataset.OrderCode
    });
  },
  //关闭弹窗
  tapCloseModeal() {
    this.setData({
      cancelModel: false
    });
  },
  // 删除订单
  async tapCancel(e) {
    let info = await Token.getToken();
    Post(api.DeleteOrder, { orderCode: this.data.OrderCode, token: info.token }).then(res => {
      ShowNoneToast(res.data.Msg);
      this.setData({ cancelModel: false });
      this.getList();
    });
  }
});
