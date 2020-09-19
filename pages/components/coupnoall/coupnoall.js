const app = getApp();
import {api, Get, Post, Product, SetStorage, Token} from '../../../utils/common';

Page({
  data: {
    arr: ['全部', '未使用', '已使用', '已过期'],
    activeinx: 0,
    list: [],
    user_id: '', //
    qdcodeid: '' //渠道码
  },
  async onLoad(query) {
    if (query.id) {
      this.setData({
        qdcodeid: query.id
      });
      SetStorage('qdmc', { qdcode: query.id });
    }

    let info = await Token.getToken();

    Get(api.GetDiscountList, { userId: info.user_id }).then(res => {
      if (res.data.Code == -1) return;
      this.setData({
        list: res.data.Data
      });
    });

    Get(api.GetMyProductRecommend).then(res => {
      if (res.data.Code == -1) return;
      let d = res.data.Data;
      d.sort(() => Math.random() - 0.5);
      d = d.slice(0, 20);
      this.setData({ newlist: d });
    });
    let data = {
      PageName: 'coupnoall',
      ClickPlace: '天天领券',
      SoureChannel: query.id
    };
    //埋点
    Post(api.PostStatisticSystem, data, true);
  },
  goshop() {
    my.switchTab({
      url: '/pages/tabbar/index/index'
    });
  },
  //领取
  golq(e) {
    Get(api.GetDiscount, { discountId: e.currentTarget.dataset.id }, true).then(res => {
      if (res.data.Code == 1) {
        Get(api.GetDiscountList, {}, true).then(res2 => {
          this.setData({
            list: res2.data.Data
          });
        });
      }
    });
  },
  //去使用优惠券
  gobuy(e) {
    my.navigateBack({
      delta: 1
    });
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      showcoupon: true,
      discountId: e.currentTarget.dataset.discountId,
      money: e.currentTarget.dataset.money
    });
  },
  //去详情
  godetail(e) {
    my.navigateTo({
      url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
    });
  },
  gofenl(e) {
    if (e.currentTarget.dataset.id) {
      my.navigateTo({
        url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
      });
    } else {
      my.navigateBack();
    }
  },
  //加入购物车
  gocart(e) {
    let item = e.currentTarget.dataset.item;
    let p = new Product(item);
    p.addShopCart().then(() => {
      this.setData({
        buypop: false
      });
    });
  }
});
