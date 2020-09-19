import {api, Get, NavigateTo} from '../../../utils/common';

Page({
  data: {
    arr: ['未使用', '已使用', '已过期'],
    activeinx: 0,
    list: [],
    money: 0,
    orderid: 0,
    show: false,
  },
  onLoad(query) {
    let data;
    if (query.money) {
      this.setData({
        money: query.money,
        orderid: query.orderId
      })
      if (query.orderId) {
        data = {
          status: this.data.activeinx + 1,
          minAmount: query.money,
          orderId: query.orderId
        }
      }
    } else {
      data = {
        status: this.data.activeinx + 1,
        minAmount: 0,
        orderId: 0
      }
    }
    Get(api.GetDiscountListV1, data, true).then(res => {
      this.setData({
        list: res.data.Data
      })
    })
  },
  tabqh(e) {
    this.setData({
      activeinx: e.currentTarget.dataset.inx
    })
    let data;

    if (e.currentTarget.dataset.inx != 0) {
      data = {
        status: e.currentTarget.dataset.inx + 1,
        minAmount: 0,
        orderid: 0
      }
    } else {
      data = {
        status: e.currentTarget.dataset.inx + 1,
        minAmount: this.data.money,
        orderid: this.data.orderid
      }
    }

    Get(api.GetDiscountListV1, data, true).then(res => {
      let list = res.data.Data;
      this.setData({ list })
    })
  },
  goshop() {
    my.navigateTo({
      url: '/pages/components/coupnoall/coupnoall'
    })
  },
  //去使用优惠券
  gobuy(e) {
    my.navigateBack({
      delta: 1
    })

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      showcoupon: true,
      discountId: e.currentTarget.dataset.discountid,
      money: e.currentTarget.dataset.money
    })
  },
  //获取优惠券数据
  GetDiscountList(minAmount, orderid) {
    let data = { status: this.data.activeinx + 1, minAmount: minAmount, orderid: orderid }
    Get(api.GetDiscountListV1, data, true).then(() => {

    })
  },
  // 去详情
  goDetail(e) {
    let pId = e.currentTarget.dataset.id
    if (this.data.activeinx != 0) return;
    if (pId) {
      NavigateTo("/pages/components/pro_detail/pro_detail?id=" + pId);
    } else {
      NavigateTo("/pages/tabbar/index/index")
    }
  }
});
