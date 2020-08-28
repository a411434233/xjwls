import { api, Get, Product } from '../../../utils/common';
Page({
  data: {},
  onLoad() {
    this.getActiveGoods();
  },
  getActiveGoods() {
    Get(api.GetActiveGoods, { pageId: 13 }).then(res => {
      res = res.data.Data;
      if (res.length) {
        this.setData({ ActiveGoodsList: res });
      }
    });
  },
  addShopCat(e) {
    let item = e.currentTarget.dataset.item;
    let p = new Product(item);
    p.addShopCart();
  }
});
