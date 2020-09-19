import {api, Get} from '../../../utils/common';

Page({
  data: {
    evaluate: [],
    pageIndex: 1,
    pageSize: 10,
    goodsid: ""
  },
  onLoad(options) {
    Get(api.GetAllEvaluate,{productId: options.id, pageIndex: this.data.pageIndex, pageSize: this.data.pageSize}).then(res=>{
      res.data.Data.forEach((el, i) => {
        let len = el.StarLevel
        let array = []
        for (var j = 0; j < len; j++) {
          array.push(0)
        }
        el.evaluatearr = array
      })
      this.setData({
        evaluate: res.data.Data,
        goodsid: options.id
      })
    })
  },
  onReachBottom() {
    // 页面被拉到底部
    this.setData({
      pageIndex: Number(this.data.pageIndex) + 1
    })
    Get(api.GetAllEvaluate,{productId: this.data.goodsid, pageIndex: this.data.pageIndex, pageSize: this.data.pageSize}).then(res=>{
      this.setData({
        evaluate: this.data.evaluate.concat(res.data.Data)
      })
    })
  },
});
