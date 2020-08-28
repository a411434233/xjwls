const { api, Token, Post, Get, NavigateTo, ShowNoneToast } = require('../../../utils/common');
const app = getApp();
Page({
  data: {
    canIUseAuthButton: false,
    info: {},
    VCoinNum: 0,
    jremark: {},
    isiPhoneX: false,
    guangbo: []
  },
  async onLoad() {
    let info = await Token.getToken();

    //我的信息
    this.getUserInfo();
    //其它信息
    this.getMineOrderStatus();
    //我的味币
    this.getMyVCoins();

    this.GetUnEndOrder();

    this.setData({
      userId: info.user_id,
      aliUserid: info.aliuser_id,
      isiPhoneX: app.isiPhoneX
    });
  },
  async GetUnEndOrder() {
    let info = await Token.getToken();
    Get(api.GetUnEndOrder, { token: info.token }).then(res => {
      this.setData({ guangbo: res.data.Data });
    });
  },
  getUserInfo() {
    Get(api.GetUserInfo, {}, true).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      if (!res.data.Data || !res.data.Data.avatar) {
        this.setData({
          canIUseAuthButton: true
        });
      } else {
        this.setData({
          canIUseAuthButton: false,
          info: res.data.Data
        });
      }
    });
  },
  async getMyVCoins() {
    let info = await Token.getToken();
    Get(api.GetMyVCoins, { userId: info.token }).then(res => {
      if (res.data.Code == -1) return;
      this.setData({
        VCoinNum: res.data.Data.VCoinNum
      });
    });
  },
  getMineOrderStatus() {
    Get(api.GetMineOrderStatus, {}, true).then(res => {
      if (res.data.Code == -1) return;
      this.setData({
        jremark: res.data.Data
      });
    });
  },
  //信息授权
  async onGetAuthorize(res) {
    let info = await Token.getToken();
    my.getOpenUserInfo({
      fail: res => {
        this.setData({
          canIUseAuthButton: false
        });
      },
      success: res => {
        this.setData({
          canIUseAuthButton: false
        });
        var infomation = JSON.parse(res.response).response;
        let data = {
          AliUserId: info.aliuser_id,
          Avatar: infomation.avatar,
          nickName: infomation.nickName,
          Gender: infomation.gender,
          countryCode: infomation.countryCode,
          province: infomation.province,
          city: infomation.city
        };
        Post(api.PostUserUpdate, data).then(res => {
          Get(api.GetUserInfo, {}, true).then(res => {
            if (res.data.Data) {
              this.setData({
                info: res.data.Data
              });
            }
          });
        });
      }
    });
  },
  detail(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.guangbo[index];
    if (item) {
      NavigateTo('/pages/components/orderdetail/orderdetail', { OrderCode: item.OrderCode });
    }
  },
  //门店订单
  goStoreOrder() {
    NavigateTo('/pages/components/storeOrder/storeOrder');
  },
  goCurrency() {
    NavigateTo('/pages/components/sigincurrency/sigincurrency?VCoinNum=' + this.data.VCoinNum);
  },
  goMyOrder(e) {
    let url = '/pages/components/myorder/myorder?activeindex=' + e.currentTarget.dataset.ind;
    NavigateTo(url);
  },
  //客服与帮助
  goMessgae() {
    NavigateTo('/pages/components/service/service');
  },
  goMyaddress() {
    NavigateTo('/pages/components/address/address');
  },
  //去优惠券列表页
  goCoupon() {
    NavigateTo('/pages/components/coupno/coupno');
  },
  //去编辑个人信息页
  goEditinfo() {
    let url = '/pages/components/editinfo/editinfo?nackname=' + this.data.info.nickName + '&userid=' + this.data.userId;
    NavigateTo(url);
  },
  //去签到
  goSigin() {
    NavigateTo('/pages/components/signin/signin?VCoinNum=' + this.data.VCoinNum);
  },
  onPullDownRefresh() {
    this.getMineOrderStatus();
    this.getUserInfo();
    this.getMyVCoins();
    this.GetUnEndOrder();
    my.stopPullDownRefresh();
  }
});
