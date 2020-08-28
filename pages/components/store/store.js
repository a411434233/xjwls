import { Product, NavigateTo, Get, api, Token } from '../../../utils/common';
Page({
  data: {
    pageIndex: 1,
    info: {},
    titleBarHeight: null
  },
  addShop(e) {
    let item = e.currentTarget.dataset.item;
    let p = new Product(item);
    p.addShopCart();
  },
  async onSubmit(e) {
    if (!e.detail.formId) return;
    let info = await Token.getToken();
    let data = { AliUserId: info.aliuser_id, FormId: e.detail.formId, MessageType: 1, ProductId: e.currentTarget.dataset.id };
    Get(api.SaveTemplateMessageInfo, data, true).then(res => {});
  },
  godetail(e) {
    let id = e.currentTarget.dataset.id;
    NavigateTo('/pages/components/pro_detail/pro_detail?id=' + id);
  },
  search() {
    NavigateTo('/pages/components/search/search');
  },
  async onLoad(query) {
    my.getSystemInfo({
      success: res => {
        this.setData({ titleBarHeight: res.titleBarHeight, statusBarHeight: res.statusBarHeight });
      }
    });
    let ProductId = query.ProductId;
    let storeInfo = await Get(api.GetBrandInfo, { productId: ProductId });
    storeInfo = storeInfo.data.Data;
    let res = await Get(api.GetProductsByBrandId, { brandId: storeInfo.BrandId, pageSize: 10, pageIndex: 1 });
    this.setData({
      list: res.data.Data,
      info: storeInfo
    });
  },
  onReachBottom() {
    // 页面被拉到底部
    let info = this.data.info;
    if (!info.BrandId) return;
    let pageIndex = this.data.pageIndex;
    pageIndex += 1;
    Get(api.GetProductsByBrandId, { brandId: info.BrandId, pageSize: 10, pageIndex: pageIndex }).then(res => {
      let list = this.data.list.concat(res.data.Data);
      this.setData({
        list: list,
        pageIndex
      });
    });
  }
});
