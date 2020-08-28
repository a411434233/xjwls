const app = getApp();
import { api, Get } from '../../../utils/common';
Page({
  data: {
    tabs: [
      {
        title: '优惠券'
      },
      {
        title: '现金红包'
      }
    ],
    activeTab: 0,
    list: []
  },
  onLoad() {
    //中奖用户
    Get(api.GetMyRecordV2, { PrizeType: 1 }, true).then(res => {
      this.setData({
        list: res.data.Data
      });
    });
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index
    });
    Get(api.GetMyRecordV2, { PrizeType: index + 1 }, true).then(res => {
      this.setData({
        list: res.data.Data
      });
    });
  },
  godetail(e) {
    // console.log(e)
    if (e.currentTarget.dataset.id) {
      my.navigateTo({
        url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
      });
    }
  }
});
