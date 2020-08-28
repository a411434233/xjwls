const app = getApp();

import { api, Post, Get, Token, NavigateToMiniProgram, NavigateTo } from '../../../../utils/common';

Page({
  data: {
    show: my.canIUse('life-follow'),
    collectid: '',
    list: [],
    listone: []
  },

  async onLoad() {
    //获取商品收藏码
    Post(api.PostConstValues).then(res => {
      this.setData({
        collectid: res.data.Data
      });
    });

    Post(api.GetASurprisesV4).then(res => {
      this.setData({
        list: res.data.Data.aSurpriseViewList1
      });
    });
    this.loadPlug();
  },
  //动态加载插件
  loadPlug() {
    return new Promise(res => {
      my.loadPlugin({
        plugin: '2019102468552682@*', // 指定要加载的插件id和版本号，为*则每次拉取最新版本
        success: () => {
          res();
        }
      });
    });
  },
  goindex() {
    my.switchTab({
      url: '/pages/tabbar/index/index'
    });
  }, //
  godetail(e) {
    my.navigateTo({
      url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
    });
  },
  gocollect() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200205000002269307');
    my.getStorage({
      key: 'qdmc',
      success: res => {
        // console.log(res)
        if (res.success == true) {
          this.PostStatisticSystem(res);
        }
      }
    });
  },
  gocollectf() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200401000002396198');
    my.getStorage({
      key: 'qdmc',
      success: res => {
        // console.log(res)
        if (res.success == true) {
          this.PostStatisticSystem(res);
        }
      }
    });
  },
  gohl() {
    NavigateTo('dynamic-plugin://2019102468552682/index?pid=2088631273892854&appId=2019092367680987');
    my.getStorage({
      key: 'qdmc',
      success: res => {
        if (res.success == true) {
          this.PostStatisticSystem(res);
        }
      }
    });
  },
  gorings() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200401000002395261');
    my.getStorage({
      key: 'qdmc',
      success: res => {
        // console.log(res)
        if (res.success == true) {
          this.PostStatisticSystem(res);
        }
      }
    });
  },
  golq(e) {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=' + e.currentTarget.dataset.DiscountId);
  },
  golqs(e) {
    if (e.currentTarget.dataset.DiscountId != null) {
      NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=' + e.currentTarget.dataset.DiscountId);
    } else {
      my.navigateTo({
        url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
      });
    }
  },
  //formid
  async onSubmit(e) {
    let info = await Token.getToken();
    Get(
      api.SaveTemplateMessageInfo,
      {
        AliUserId: info.aliuser_id,
        FormId: e.detail.formId,
        MessageType: 3,
        ProductId: e.currentTarget.dataset.id
      },
      true
    );
  },
  gocollectsjx() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200311000002344236').then(res => {
      my.getStorage({
        key: 'qdmc',
        success: res => {
          // console.log(res)
          if (res.success == true) {
            this.PostStatisticSystem(res);
          }
        }
      });
    });
  },
  //埋点
  PostStatisticSystem(res) {
    Post(
      api.PostStatisticSystem,
      {
        PageName: 'onesurprise',
        ClickPlace: '数据线',
        SoureChannel: res.data.qdcode
      },
      true
    );
  },
  gocollectsjxcopy() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200224000002301061').then(res => {
      my.getStorage({
        key: 'qdmc',
        success: res => {
          // console.log(res)
          if (res.success == true) {
            this.PostStatisticSystem(res);
          }
        }
      });
    });
  },
  gocollectsjk() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200224000002300088').then(res => {
      my.getStorage({
        key: 'qdmc',
        success: res => {
          // console.log(res)
          if (res.success == true) {
            this.PostStatisticSystem(res);
          }
        }
      });
    });
  },
  gocollectzj() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200227000002309584').then(res => {
      my.getStorage({
        key: 'qdmc',
        success: res => {
          // console.log(res)
          if (res.success == true) {
            this.PostStatisticSystem(res);
          }
        }
      });
    });
  },
  //抽奖
  goluck() {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=KP20200302000002317087');
  },
  goxjh(e) {
    NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092467813194&newUserTemplate=' + e.currentTarget.dataset.kpid);
  }
});
