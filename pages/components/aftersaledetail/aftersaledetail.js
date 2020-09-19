import {api, Get} from '../../../utils/common'

Page({
  data: {
    activeIndex: 1,
    direction: 'vertical',
    detail: "",
    items: [{
      title: '退款中'
    }]
  },
  onLoad(options) {
    // 退款详情
    Get(api.GetReturnApplyInfo, { orderCode: options.orderid }).then(res => {
      this.setData({
        detail: res.data.Data.afterSaleOrder,
        items: res.data.Data.itemsList
      })
    })
  },
});
