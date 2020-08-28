
import { Post, api, Get } from '../../../utils/common';
Page({
  data: {
    detail: "",//
  },
  onLoad() {
    Get(api.GetDiscountList, {
      status: 1,
      minAmount: 0
    }, true).then(res => {
      this.setData({
        detail: res.data.Data
      })
    })
  },
});
