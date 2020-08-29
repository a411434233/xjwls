import { NavigateToMiniProgram, NavigateTo, GetChannelCode, Get, Post, api, ShowNoneToast, Product, Token } from '../../../utils/common';
const app = getApp();
Page({
  data: {
    bannerArr: [{ bannerImg: '/images/icon/sigin4.png' }, { bannerImg: 'http://image.smjpin.cn/lALPD2eDMuuB57XMlM0Cxg_710_148.png' }, { bannerImg: 'http://image.smjpin.cn/activity/singin2.png' }, { bannerImg: 'http://image.smjpin.cn/sign_middle.png' }],
    showqd: false,
    tabsData: [],
    NextDayPrizeVal: 0.5,
    tabs2Index: 0,
    tabs2Data: [],
    pageIndex: 1,
    showdb: false,
    conponseList: [],
    checkFollow: false,
    isiPhoneX: false,
    list: [],
    VCoinNum: 0
  },
  async onLoad() {
    if (!Token.user_id) {
      await Token.getToken();
    }
    this.GetMyVCoins();
    this.InitDailyClockIn();
    this.GetPrizeList();
    this.getHomeRecommend();
  },
  //动态加载插件
  loadPlug() {
    return new Promise((resolve, reject) => {
      my.loadPlugin({
        plugin: '2019102468552682@*', // 指定要加载的插件id和版本号，为*则每次拉取最新版本
        success: () => {
          resolve(1);
        }
      });
    });
  },
  closeCb(e) {
    const { followed } = e.detail;
    this.setData({
      checkFollow: followed
    });
  },
  //领券
  async getCoupone(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.conponseList[index];
    if (item.ProductId) {
      NavigateTo('/pages/components/pro_detail/pro_detail?id=' + item.ProductId);
    }
  },
  singinlist() {
    NavigateTo('/pages/components/couponList/couponList');
  },
  async InitDailyClockIn() {
    let info = await Token.getToken();
    Post(api.Init, { token: info.token }).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      let data = res.data.Data;
      this.setData({
        ReClockInTimes: data.ReClockInTimes,
        PrizeType: data.PrizeType,
        ToDayPrizeVal: data.ToDayPrizeVal,
        ToDayIsClockIn: data.ToDayIsClockIn,
        TotalClockInTimes: data.TotalClockInTimes
      });
    });
  },
  getHomeRecommend() {
    return Get(api.GetSignRecGoods).then(res => {
      let d = res.data.Data;
      if (d.length) {
        d = d.sort(() => Math.random() - 0.5);
      }
      let p = d.slice(0, 10);
      this.setData({
        tabs2Data: p,
        list: d
      });
    });
  },
  async GetPrizeList() {
    let info = await Token.getToken();
    Get(api.GetPrizeConfig, { token: info.token }).then(res => {
      this.setData({
        daylistarr: res.data.Data,
        daylist: res.data.Data.splice(0, 6)
      });
    });
  },
  async GetMyVCoins() {
    let info = await Token.getToken();
    Get(api.GetMyVCoins, { userId: info.token }).then(res => {
      this.setData({
        VCoinNum: res.data.Data.VCoinNum
      });
    });
  },
  //加入购物车
  addShop(e) {
    let item = e.currentTarget.dataset.item;
    let p = new Product(item);
    p.addShopCart();
  },
  //规则
  rulers() {
    my.navigateTo({
      url: '/pages/actives/actives?src=https://m.smjpin.cn/chihuochang/#/rule'
    });
  },
  //初始化弹窗数据
  initPopdata() {
    Get(api.GetSignRecProduct, {}).then(res => {
      let products = res.data.Data;
      if (products.Tag) {
        products.Tag = products.Tag.split(',');
      }
      this.setData({
        SignRecProduct: products
      });
    });
  },
  //补卡
  pushclock: app.throttle(async function (e) {
    var now = new Date();
    var day = now.getDay();
    if (day == e.currentTarget.dataset.Week) {
      this.gosingin();
    } else if (day > e.currentTarget.dataset.Week && this.data.ReClockInTimes > 0) {
      my.showLoading({
        content: '加载中...'
      });
      let info = await Token.getToken();
      let res = await Post(api.ReSignIn, { week: e.currentTarget.dataset.Week, token: info.token });
      my.hideLoading();
      if (res.data.Code == 1) {
        day = e.currentTarget.dataset.Week - 1;
        let { PrizeType, Val } = this.data.daylist[day];
        let VCoinNum = this.data.VCoinNum;
        if (PrizeType == 1) {
          VCoinNum += parseInt(Val);
        }
        this.setData({
          VCoinNum: VCoinNum,
          ReClockInTimes: res.data.Data.ReClockInTimes,
          TotalClockInTimes: res.data.Data.TotalClockInTimes,
          NextDayPrizeVal: Val,
          NextPrizeType: PrizeType,
          ToDayIsClockIn: res.data.Data.ToDayIsClockIn,
          MinAmount: res.data.Data,
          showqd: true
        });
        //获取一周七天内每天的奖品
        this.GetPrizeList();
        this.initPopdata();
        this.InitDailyClockIn();
      } else {
        ShowNoneToast(res.data.Msg);
      }
    } else if (day > e.currentTarget.dataset.Week && this.data.ReClockInTimes <= 0) {
      ShowNoneToast('您还没有补卡机会');
    } else {
      ShowNoneToast('请选择当天打卡');
    }
  }, 2000),
  //签到
  async gosingin() {
    var now = new Date();
    var day = now.getDay() - 1;
    my.showLoading({
      content: '加载中...'
    });
    let info = await Token.getToken();
    Post(api.SignIn, { token: info.token }).then(res => {
      my.hideLoading();
      if (res.data.Code == 1) {
        let { PrizeType, Val } = this.data.daylist[day];
        let VCoinNum = this.data.VCoinNum;
        if (PrizeType == 1) {
          VCoinNum += parseInt(Val);
        }
        this.setData({
          VCoinNum: VCoinNum,
          ReClockInTimes: res.data.Data.ReClockInTimes,
          TotalClockInTimes: res.data.Data.TotalClockInTimes,
          NextDayPrizeVal: Val,
          NextPrizeType: PrizeType,
          ToDayIsClockIn: res.data.Data.ToDayIsClockIn,
          MinAmount: res.data.Data,
          showqd: true
        });
        //获取一周七天内每天的奖品
        this.GetPrizeList();
        this.initPopdata();
        this.InitDailyClockIn();
      } else {
        ShowNoneToast(res.data.Msg);
      }
    });
  },
  closeModel() {
    this.setData({ showqd: false });
  },
  onSubmit(e) {
    if (!e.detail.formId) return;
    let [url, data] = [api.SaveTemplateMessageInfo, { AliUserId: this.data.aliUserid, FormId: e.detail.formId, MessageType: 3, ProductId: e.currentTarget.dataset.id }];
    Get(url, data, true).then(res => {});
  },
  //分享补卡
  onClickShare() {
    let [url, data] = [api.DoShareGetReClockInTimes, {}];
    Get(url, data, true).then(res => {
      if (res.data.Code == 1) {
        this.setData({
          ReClockInTimes: res.data.Data.ReClockInTimes
        });
      } else {
        ShowNoneToast(res.data.Msg);
      }
    });
  },
  detail2() {
    NavigateTo('/pages/actives/actives?src=https://m.smjpin.cn/chihuochang/#/youdao');
  },
  detail() {
    if (this.data.SignRecProduct && this.data.SignRecProduct.ProductId) {
      let id = this.data.SignRecProduct.ProductId;
      let url = '/pages/components/pro_detail/pro_detail?id=' + id;
      NavigateTo(url);
    }
  },
  goodsDetail(e) {
    let item = e.currentTarget.dataset.item;
    let url = '/pages/components/pro_detail/pro_detail?id=' + item.ProductId;
    NavigateTo(url);
  },
  //最后一天打卡
  pushclock1(e) {
    if (this.data.TotalClockInTimes == 6) {
      this.gosingin();
    } else {
      ShowNoneToast('您没有签到一周哦，请继续努力');
    }
  },
  //分享
  onShareAppMessage() {
    return {
      title: '闲九味',
      desc: '打卡领红包',
      path: 'pages/components/signin/signin',
      searchTip: '闲九味'
    };
  },
  async gohl(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      NavigateTo('/pages/actives/actives?src=https://m.smjpin.cn/chihuochang/#/xjwSnacks');
    } else if (index == 1) {
      NavigateToMiniProgram('2021001102603541', 'pages/index/index');
    } else if (index == 2) {
      NavigateToMiniProgram('2018082861122674', 'pages/buyZero/buyZero?scene_id=2261');
    } else if (index == 3) {
      let p = await this.loadPlug();
      NavigateTo('dynamic-plugin://2019102468552682/index?pid=2088631273892854&appId=2019092367680987');
    }
    let qdcode = GetChannelCode();
    Post(api.PostStatisticSystem, { PageName: 'onesurpriseahl', ClickPlace: '一分惊喜换量', SoureChannel: qdcode }, true);
  },
  // 页面被拉到底部
  onReachBottom() {
    if (this.data.list.length <= 0) return;
    let list = this.data.list;
    this.$spliceData({ tabs2Data: [this.data.tabs2Data.length, 0, ...list.splice(0, 10)] });
    this.setData({ list: list });
  }
});
