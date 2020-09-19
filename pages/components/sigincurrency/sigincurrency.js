import {api, Get} from '../../../utils/common'

Page({
  data: {
    pageIndex: 1,
    pageSize: 6,
    list: [],//
    VCoinNum: "",//
  },
  onLoad(options) {
    this.setData({
      VCoinNum: options.VCoinNum
    })
    this.getVCoinsList();
  },
  getVCoinsList: function () {
    let [url, data, that] = [api.GetVCoinsList, {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }, this];
    Get(url, data, true).then(res => {
      that.setData({
        list: that.data.pageIndex == 1 ? res.data.Data : that.data.list.concat(res.data.Data)
      })
    })
  },
  onReachBottom() {
    // 页面被拉到底部
    this.setData({
      pageIndex: Number(this.data.pageIndex) + 1
    })
    this.getVCoinsList();
  },
});
