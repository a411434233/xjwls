import { Post, Get, GetChannelCode, api, Token, NavigateTo, NavigateToMiniProgram } from '../../../utils/common';
const app = getApp();
Page({
  data: {
    listarr: [],
    userid: '',
    collectshow: true, //
    id: '', //
    https: '', //
    detail: '', //
    qdcode: ''
  },
  async onLoad(options) {
    let qdcode = GetChannelCode(options.id);
    let info = await Token.getToken(qdcode);
    Get(api.GetDiscounts, { discountId: options.couponid, channelCode: qdcode }).then(res => {
      this.setData({
        detail: res.data.Data
      });
    });

    Post(api.GetPrizes, { discountId: options.couponid }).then(res => {
      this.setData({
        listarr: res.data.Data
      });
    });

    this.setData({
      qdcode: qdcode,
      userid: info.user_id,
      aliuser_id: info.aliuser_id
    });
  },
  //领取
  golingqu(e) {
    let id = e.currentTarget.dataset.ProductId;
    let qdcode = this.data.qdcode;
    Get(api.GetDiscount, {
      userId: this.data.userid,
      discountId: e.currentTarget.dataset.DiscountId,
      channelCode: qdcode
    }).then(res => {
      this.setData({
        collectshow: false
      });
      //统计
      Post(api.PostStatisticSystem, {
        UserId: this.data.userid,
        PageName: 'collectcouponfifty',
        ClickPlace: '首充50元优惠券',
        SoureChannel: qdcode
      });
      NavigateTo('/pages/components/pro_detail/pro_detail?id=' + id);
    });
  },
  //使用
  gouse(e) {
    if (e.currentTarget.dataset.Type == 1) {
      if (e.currentTarget.dataset.ProductType == 2) {
        my.navigateTo({
          url: '/pages/components/prodetail/prodetail?id=' + e.currentTarget.dataset.ProductId
        });
      } else {
        my.navigateTo({
          url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.ProductId
        });
      }
    } else {
      my.navigateTo({
        url: '/pages/components/prodetailelse/prodetailelse?id=' + e.currentTarget.dataset.ProductId
      });
    }
  },
  //收藏
  gosc(e) {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=' + e.currentTarget.dataset.kpid);
  },
  //formid
  onSubmit(e) {
    Get(api.SaveTemplateMessageInfo, {
      UserId: this.data.userid,
      AliUserId: this.data.aliuser_id,
      FormId: e.detail.formId,
      MessageType: 3,
      ProductId: e.currentTarget.dataset.id
    });
  }
});
