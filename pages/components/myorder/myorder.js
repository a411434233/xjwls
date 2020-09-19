import {AliPay, api, Get, NavigateTo, Post, ShowNoneToast, Token} from '../../../utils/common';

Page({
  data: {
    arr: ['全部', '待付款', '待发货', '待收货', '待评价'],
    //0=代付款；1=已支付（待收货）；2=已发货（待收货）；3=已收货；4=交易完成；5,6,7=退款中，成功，失败
    activeinx: 0,
    list: [1],
    test_data: [1, 2, 3, 4],
    pageIndex: 1,
    pageSize: 10,
    showdb: false,
    showdbguss: false, //推荐商品
    newlist: [] //订单列表
  },
  async onLoad(options) {
    let info = await Token.getToken();
    this.setData({
      activeinx: options.activeindex || 0,
      user_id: info.user_id
    });
  },
  async onShow(e) {
    this.getData();
  },
  async getData() {
    let info = await Token.getToken();
    let { pageIndex, pageSize, activeinx, showdbguss } = this.data;
    let url = `OrderForm/GetOrderList2?userId=${info.user_id}&pageIndex=${pageIndex}&pageSize=${pageSize}&status=${activeinx}`;
    let res = await Post(url);
    if (res.data.Data.length < 10) showdbguss = true;
    this.setData({
      list: res.data.Data,
      showdbguss
    });
  },
  // 头部选项点击
  async tabqh(e) {
    let info = await Token.getToken();
    let { pageIndex, pageSize, activeinx, showdbguss } = this.data;
    activeinx = e.currentTarget.dataset.inx;
    let url = `OrderForm/GetOrderList2?userId=${info.user_id}&pageIndex=${pageIndex}&pageSize=${pageSize}&status=${activeinx}`;
    let res = await Post(url);
    this.setData({
      list: res.data.Data,
      activeinx,
      pageIndex: 1,
      showdbguss: false,
      showdb: false
    });
  },
  //去订单详情页
  goorderdetail(e) {
    NavigateTo('/pages/components/orderdetail/orderdetail?OrderCode=' + e.currentTarget.dataset.ordercode);
  },
  //去付款
  gopay(e) {
    Post(api.PostAliPayCreateOrder, { TransOrderCode: e.currentTarget.dataset.transordercode, OrderCode: e.currentTarget.dataset.ordercode }, true).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      AliPay(res.data.Data.TradeNo, 20, e.currentTarget.dataset.OrderCode, false);
    });
  },
  //退款
  gothk(e) {
    NavigateTo('/pages/components/aftersale/aftersale?status=' + e.currentTarget.dataset.status + '&orderid=' + e.currentTarget.dataset.orderid);
  },
  //去评价
  goevaluate(e) {
    my.navigateTo({
      url: '/pages/components/evaluate/evaluate?orderid=' + e.currentTarget.dataset.orderid + '&listlength=' + e.currentTarget.dataset.listlength
    });
  },
  //删除订单
  async godel(e) {
    let info = await Token.getToken();
    Post(api.DeleteOrder, { orderCode: e.currentTarget.dataset.orderid, token: info.token }).then(res => {
      ShowNoneToast(res.data.Msg);
      this.getData();
    });
  },
  //确认收货
  gosure(e) {
    Get('ReturnGoods/GetConfirmReceipt', { orderCode: e.currentTarget.dataset.orderid }).then(res => {
      ShowNoneToast(res.data.Msg);
      this.getData();
    });
  },
  // 取消售后
  goclosesh(e) {
    Post(
      'ReturnGoods/CancelRefundApply',
      {
        OrderCode: e.currentTarget.dataset.orderid
      },
      true
    ).then(res => {
      if (res.data.Code == 1) ShowNoneToast(res.data.Msg);
      this.getData();
    });
  },
  //分页
  async onReachBottom() {
    let info = await Token.getToken();
    let { pageIndex, pageSize, activeinx, showdbguss } = this.data;
    pageIndex += 1;
    let url = `OrderForm/GetOrderList2?userId=${info.user_id}&pageIndex=${pageIndex}&pageSize=${pageSize}&status=${activeinx}`;
    let res = await Post(url);
    if (!res.data.Data) {
      this.setData({
        showdb: true,
        showdbguss: true
      });
    } else {
      this.setData({ list: this.data.list.concat(res.data.Data) });
    }
  }
});
