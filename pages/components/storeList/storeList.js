import { api, Get, getMyLocations } from '../../../utils/common';
Page({
  data: {},
  onLoad(query) {
    this.getList(query.ProductId);
  },
  getList(ProductId) {
    getMyLocations().then(res => {
      Get(api.GetSelfRaisingShopConfig, { productId: ProductId, longitude: res.longitude, latitude: res.latitude }).then(resp => {
        let storeList = resp.data.Data;
        this.setData({ storeList: storeList });
      });
    });
  }
});
