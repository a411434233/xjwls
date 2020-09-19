const app = getApp();
import {api, Get, NavigateToMiniProgram, Post, ShowNoneToast, Token} from '../../../utils/common'

Page({
  data: {
    showcollect: 0, //收藏状态
    isCollected: 0, //关注状态
    isShared: 0, //分享状态
    isShowRedPacket: 0,//红包状态
    nums: 0,//抽奖次数 
    userid: "",//用户ID  
    aliuserid: "",//阿里用户ID 
    lb: [],// 
    autoplay: true,
    circular: true,
    vertical: true,
    interval1: 4000,
    fengmian01: 'http://image.smjpin.cn/fengmian.png',
    fengmian02: 'http://image.smjpin.cn/fengmian.png',
    fengmian03: 'http://image.smjpin.cn/fengmian.png',
    popdraw: "",
    detailid: "",//商品ID
    //控制轮播属性  
  },
  async onLoad() {
    let info = await Token.getToken()
    this.setData({
      userid: info.user_id,
      aliuserid: info.aliuser_id
    })
    //初始状态  
    let query1 = {
      isCollected: 0,
      showcollect: 0,
      isShared: 0
    };
    let res1 = await Get(api.CreateAliCashBonusInfo, query1, true);

    if (res1.data.Code == 1) {
      this.setData({
        isCollected: res1.data.Data.isCollected,
        showcollect: res1.data.Data.showcollect,
        isShared: res1.data.Data.isShared
      })

      this.GetTodayLuckyDraw()

      Post(api.GetLuckyUser).then(res => {
        this.setData({
          lb: res.data.Data
        })
      })
    }

  },
  async GetTodayLuckyDraw() {
    let res2 = await Get(api.GetTodayLuckyDraw, {
    }, true);

    this.setData({
      nums: res2.data.Data.Times
    })
  },
  //收藏 
  gocollect() {
    Get(api.CreateCashBonus, {
      Channel: '001'
    }, true).then(res => {
      this.setData({
        showcollect: res.data.Data.showcollect,
      })
      //获取次数
      this.GetTodayLuckyDraw()
    })
    //获取收藏码 
    this.gocollect1()
  },
  //已收藏
  gocollect1() {
    //获取收藏码 
    Post(api.PostConstValues).then(res => {
      NavigateToMiniProgram('2018122562686742', 'pages/index/index?originAppId=2019092367680987&newUserTemplate=' + res.data.Data)
    })
  },
  onShareAppMessage() {
    // 返回自定义分享信息 
    return {
      title: '闲九味',
      desc: '休闲健康零食',
      path: 'pages/tabbar/index/index',
      searchTip: "闲九味"
    };
  },
  //关注
  guanzhu() {
    Get(api.CreateCashBonus, {
      UserId: this.data.userid,
      Channel: '002'
    }).then(res => {
      this.setData({
        isCollected: res.data.Data.isCollected
      })
      //获取次数
      this.GetTodayLuckyDraw()
    })
    this.setData({
      isCollected: 1
    })
  },
  //分享
  onClickShare() {
    if (this.data.isShared == 0) {
      Get(api.CreateCashBonus, {
        UserId: this.data.userid,
        Channel: '003'
      }).then(res => {
        this.setData({
          isShared: res.data.Data.isShared
        })
        //获取次数
        this.GetTodayLuckyDraw()
      })
    } else {
      this.setData({
        isShared: 1
      })
    }
  },
  gocashbonusmy() {
    my.navigateTo({
      url: '/pages/components/cashbonusmy/cashbonusmy'
    });
  },
  handleRedPacket1: app.throttle(function (e) {
    my.showLoading({
      content: '摇奖中...'
    });
    Get(api.GoToLuckyDraw, { UserId: this.data.userid }).then(res => {
      my.hideLoading();
      if (res.data.Code == 1) {
        this.setData({
          nums: res.data.Data.Times
        })
        if (res.data.Data.PrizeId == 20001) {
          this.setData({
            fengmian01: 'http://image.smjpin.cn/xj01.png',
            popdraw: 'http://image.smjpin.cn/xj01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 20002) {
          this.setData({
            fengmian01: 'http://image.smjpin.cn/xj03.png',
            popdraw: 'http://image.smjpin.cn/xj03.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 20003) {
          this.setData({
            fengmian01: 'http://image.smjpin.cn/xj02.png',
            popdraw: 'http://image.smjpin.cn/xj02.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 10020) {
          Get(api.GetDiscount, {
            discountId: res.data.Data.PrizeId
          }, true)
          this.setData({
            fengmian01: 'http://image.smjpin.cn/fifty01.png',
            popdraw: 'http://image.smjpin.cn/fifty01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 10028) {
          Get(api.GetDiscount, {
            discountId: res.data.Data.PrizeId
          }, true)
          this.setData({
            fengmian01: 'http://image.smjpin.cn/twinty01.png',
            popdraw: 'http://image.smjpin.cn/twinty01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        }
      } else {
        this.setData({
          fengmian01: 'http://image.smjpin.cn/fifty01.png',
          popdraw: 'http://image.smjpin.cn/fifty01.png',
          isShowRedPacket: 1,
          detailid: res.data.Data.ProductId
        })
      }
    })
  }, 3000),
  handleRedPacket2: app.throttle(function (e) {
    my.showLoading({
      content: '摇奖中...'
    });

    Get(api.GoToLuckyDraw, { UserId: this.data.userid }).then(res => {
      my.hideLoading();
      if (res.data.Code == 1) {
        this.setData({
          nums: res.data.Data.Times
        })
        if (res.data.Data.PrizeId == 20001) {
          this.setData({
            fengmian02: 'http://image.smjpin.cn/xj01.png',
            popdraw: 'http://image.smjpin.cn/xj01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 20002) {
          this.setData({
            fengmian02: 'http://image.smjpin.cn/xj03.png',
            popdraw: 'http://image.smjpin.cn/xj03.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 20003) {
          this.setData({
            fengmian02: 'http://image.smjpin.cn/xj02.png',
            popdraw: 'http://image.smjpin.cn/xj02.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 10020) {

          Get(api.GetDiscount, {
            discountId: res.data.Data.PrizeId
          }, true)
          this.setData({
            fengmian02: 'http://image.smjpin.cn/fifty01.png',
            popdraw: 'http://image.smjpin.cn/fifty01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 10028) {
          Get(api.GetDiscount, {
            discountId: res.data.Data.PrizeId
          }, true)
          this.setData({
            fengmian02: 'http://image.smjpin.cn/twinty01.png',
            popdraw: 'http://image.smjpin.cn/twinty01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        }
      } else {
        this.setData({
          fengmian02: 'http://image.smjpin.cn/fifty01.png',
          popdraw: 'http://image.smjpin.cn/fifty01.png',
          isShowRedPacket: 1,
          detailid: res.data.Data.ProductId
        })
      }
    })
  }, 3000),
  handleRedPacket3: app.throttle(function (e) {
    my.showLoading({
      content: '摇奖中...'
    });
    Get(api.GoToLuckyDraw, { UserId: this.data.userid }).then(res => {
      my.hideLoading();
      if (res.data.Code == 1) {
        this.setData({
          nums: res.data.Data.Times
        })
        if (res.data.Data.PrizeId == 20001) {
          this.setData({
            fengmian03: 'http://image.smjpin.cn/xj01.png',
            popdraw: 'http://image.smjpin.cn/xj01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 20002) {
          this.setData({
            fengmian03: 'http://image.smjpin.cn/xj03.png',
            popdraw: 'http://image.smjpin.cn/xj03.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 20003) {
          this.setData({
            fengmian03: 'http://image.smjpin.cn/xj02.png',
            popdraw: 'http://image.smjpin.cn/xj02.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 10020) {
          Get(api.GetDiscount, {
            discountId: res.data.Data.PrizeId
          }, true)
          this.setData({
            fengmian03: 'http://image.smjpin.cn/fifty01.png',
            popdraw: 'http://image.smjpin.cn/fifty01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        } else if (res.data.Data.PrizeId == 10028) {
          Get(api.GetDiscount, {
            discountId: res.data.Data.PrizeId
          }, true)
          this.setData({
            fengmian03: 'http://image.smjpin.cn/twinty01.png',
            popdraw: 'http://image.smjpin.cn/twinty01.png',
            isShowRedPacket: 1,
            detailid: res.data.Data.ProductId
          })
        }
      } else {
        this.setData({
          fengmian03: 'http://image.smjpin.cn/fifty01.png',
          popdraw: 'http://image.smjpin.cn/fifty01.png',
          isShowRedPacket: 1,
          detailid: res.data.Data.ProductId
        })
      }
    })
  }, 3000),
  goindex() {
    my.switchTab({
      url: '/pages/tabbar/index/index'
    });
  },
  closepop() {
    this.setData({
      isShowRedPacket: 0,
      fengmian01: 'http://image.smjpin.cn/fengmian.png',
      fengmian02: 'http://image.smjpin.cn/fengmian.png',
      fengmian03: 'http://image.smjpin.cn/fengmian.png',
    })
  },
  ontoast() {
    if (this.data.nums == 0) {
      ShowNoneToast('您还没有抽奖机会，请先完成下列任务。')
      return
    }
  },
  godetail() {
    if (this.data.detailid != 0) {
      my.navigateTo({
        url: "/pages/components/pro_detail/pro_detail?id=" + this.data.detailid
      })
    } else {
      this.setData({
        isShowRedPacket: 0,
        fengmian01: 'http://image.smjpin.cn/fengmian.png',
        fengmian02: 'http://image.smjpin.cn/fengmian.png',
        fengmian03: 'http://image.smjpin.cn/fengmian.png',
      })
    }
  },
  //formid 
  onSubmit(e) {

    Get(api.SaveTemplateMessageInfo, {
      AliUserId: this.data.aliuserid,
      FormId: e.detail.formId,
      MessageType: 3,
      ProductId: e.currentTarget.dataset.id
    }, true)
  }
}); 
