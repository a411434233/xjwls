import {api, Get} from '../../../utils/common';

Page({
  data: {
    pageIndex: 1,
    pageSize: 10,
    list: [],
    showdb: false
  },
  onShow() {
    let data = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    };
    Get(api.GetCollectList, data, true).then(res => {
      this.setData({
        list: res.data.Data
      });
    });
  },
  onReachBottom() {
    // 页面被拉到底部
    this.setData({
      pageIndex: Number(this.data.pageIndex) + 1
    });
    let data = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    };
    Get(api.GetCollectList, data, true).then(res => {
      if (res.data.Data == '') {
        this.setData({
          showdb: true
        });
      }
      this.setData({
        list: this.data.list.concat(res.data.Data)
      });
    });
  },
  godetail(e) {
    my.navigateTo({
      url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
    });
  }
});
