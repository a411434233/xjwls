import { Post, Get, NavigateTo, NavigateToMiniService, api, Token, NavigateToMiniProgram, SetStorage, SwitchTab, ShowNoneToast, Product } from '../../../utils/common';
const app = getApp();

Page({
  data: { newlist: [],domInfo:{top:468}, pageIndex: 1, showdb: false, nowIdx: 0, titleHeight: 72, tabsIndex: 0, left: 0, sorllTabs: [], BannerConfig: undefined },
  onLoad(options) {
    this.getHomeData();
    this.getHomeRecommend();
    if (options.id) {
      SetStorage('qdmc', { qdcode: options.id });
    }
  },
  getHomeData() {
    Get(api.GetHomePageConfig).then(res => {
      res = res.data.Data;
      this.setData({ ...res, sorllTabs: [{ ChannelName: '全部', SubChannelName: '精选好物', ChannelId: 0 }, ...res.ProductSceneConfig], ...app });
    });
  },
  onReady() {
    setTimeout(() => {
      my.createSelectorQuery()
        .select('#proList_box')
        .boundingClientRect()
        .exec(ret => {
          if (ret[0]) {
            let item = ret[0];
            this.setData({ domInfo: item });
          }
        });
    }, 400);
  },
  newActive(e) {
    let index = e.currentTarget.dataset.index;
    if (index == '1') {
      NavigateTo('/pages/actives/actives?src=https://m.smjpin.cn/chihuochang/#/youdao');
    } else {
      NavigateTo('/pages/actives/actives?src=https://m.smjpin.cn/chihuochang/#/daysActivity');
    }
  },
  getHomeRecommend(item = {}) {
    let ChannelId = item.ChannelId ? item.ChannelId : 0;
    let [url, data, that] = [api.GetHomeRecommendV2, { pageIndex: 1, pageSize: 6, channelId: ChannelId }, this];
    Post(url, data).then(res => {
      res.data.Data.forEach(val => {
        if (val.Tag) {
          val.Tag = val.Tag.split(',');
        } else {
          val.Tag = [];
        }
      });
      that.setData({ newlist: res.data.Data });
    });
  },
  swiperChange(e) {
    this.setData({ nowIdx: e.detail.current });
  },
  godetail(e) {
    let url = '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id;
    if (url) {
      NavigateTo(url);
    }
  },
  golingq(e) {
    let index = e.currentTarget.dataset.index;
    let data = this.data.CenterBannerConfig[index];
    if (data.JumpType == 'NormalPage') {
      my.navigateTo({ url: '/' + data.Url });
    }
    if (data.JumpType == 'TabPage') {
      my.switchTab({ url: '/' + data.Url });
    }
    if (data.JumpType == 'Service') {
      NavigateToMiniService(data.ServiceId, data.Url, data.extraData);
    }
    if (data.JumpType == 'MiniApp') {
      NavigateToMiniProgram(data.ServiceId, data.Url);
    }
    if (data.JumpType == 'Plugin') {
      NavigateTo(data.Url);
    }
  },
  activeList(e) {
    let item = e.currentTarget.dataset.val;
    my.navigateTo({ url: '/pages/actives/actives?src=' + item });
  },
  clickActives(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.activeListDown[index];
    if (item.pageurl == '') return;
    my.navigateTo({ url: '/pages/actives/actives?src=' + item.pageurl + '&index=' + index });
  },
  async onSubmit(e) {
    if (!e.detail.formId) return;
    let info = await Token.getToken();
    let data = { AliUserId: info.aliuser_id, FormId: e.detail.formId, MessageType: 1, ProductId: e.currentTarget.dataset.id };
    Get(api.SaveTemplateMessageInfo, data, true);
  },
  addShop(e) {
    let item = e.currentTarget.dataset.item;
    if (typeof item == 'object') {
      let p = new Product(item);
      p.addShopCart();
    }
  },
  gotablist(e) {
    let { pagetype, pageurl, appId } = e.currentTarget.dataset;
    if (!pageurl) return;
    if (pagetype == 0) {
      my.navigateTo({ url: '/' + pageurl });
    } else if (pagetype == 1) {
      let id = pageurl.split('=').pop();
      app.swichQuery = id;
      my.switchTab({ url: '/' + pageurl });
    } else if (pagetype == 2) {
      NavigateToMiniProgram(appId, pageurl);
    }
  },
  async clickTab(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.tabsIndex) return;
    let item = this.data.sorllTabs[index];
    this.setData({ pageIndex: 1, tabsIndex: index, left: e.currentTarget.offsetLeft + 50 - this.data.screenWidth / 2 });
    this.getHomeRecommend(item);
  },
  search() {
    NavigateTo('/pages/components/search/search');
  },
  //顶部轮播跳转
  goBannerTop(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.BannerConfig[index];
    if (typeof item == 'object') {
      if (item.JumpType == 'NormalPage') {
        NavigateTo('/' + item.Url);
      } else {
        SwitchTab('/' + item.Url);
      }
    }
  },
  async onPullDownRefresh() {
    this.getHomeData();
    my.stopPullDownRefresh();
  },
  onReachBottom() {
    let pageIndex = Number(this.data.pageIndex) + 1;
    let { tabsIndex, sorllTabs } = this.data;
    let item = sorllTabs[tabsIndex];
    let channelId = item ? item.ChannelId : 0;
    let [url, data, that] = [api.GetHomeRecommendV2, { pageIndex: pageIndex, pageSize: 10, channelId: channelId }, this];
    Post(url, data).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      res.data.Data.forEach(val => {
        if (val.Tag) {
          val.Tag = val.Tag.split(',');
        } else {
          val.Tag = [];
        }
      });
      that.setData({ pageIndex, newlist: that.data.newlist.concat(res.data.Data), showdb: res.data.Data == '' ? true : false });
    });
  },
  onShareAppMessage() {
    return { title: '闲九味', desc: '休闲健康零食', path: 'pages/tabbar/index/index' };
  },
  onPageScroll(e) {
    if (e.scrollTop >= 400) {
      let item = this.data.domInfo||{top:468};
      if(typeof item !='object') return ;
      if (e.scrollTop >= item.top && !this.data.itemShow) {
        this.setData({ itemShow: true });
      }
      if (e.scrollTop <= item.top && this.data.itemShow) {
        this.setData({ itemShow: false });
      }
    } else if(e.scrollTop<400&&this.data.itemShow) {
      this.setData({ itemShow: false });
    }
  }
});
