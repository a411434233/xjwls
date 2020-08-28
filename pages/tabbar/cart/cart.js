import {Post, Get, ShowNoneToast, api, Product, NavigateTo, Throttle,} from '../../../utils/common';
Page({
  data: { suclist: [], ActiveGoodsList: [], errlist: [], selcetall: false, selcethalf: [], allmoney: 0, allnum: 0, newlist: [], isAdded: false, shopnum: 0, isLeft: 0 },
  onShow() {
    this.getShopCartList();
    this.getMyProductRecommend();
    // app.iniShopnum();
  },
  async getShopCartList() {
    let res = await Get(api.GetShopCartList, {}, true);
    if (res.data.Code == -1) return this.setData({ suclist: [], errlist: [] });
    if (res.data.Code == 1) {
      res = res.data.Data;
      for (let item of res.allShopCartList) {
        item.checked = false;
        item.shopCartList.forEach(val => (val.checked = false));
      }
      this.setData({ suclist: res.allShopCartList, errlist: res.loseShopCartList });
    }
    this.watchData();
    this.getActiveGoods();
  },
  getActiveGoods() {
    Get(api.GetActiveGoods, { pageId: 13 }).then(res => {
      res = res.data.Data;
      if (res.length) {
        this.setData({ ActiveGoodsList: res.slice(0, 2) });
      }
    });
  },
  setStore(e) {
    let storeindex = e.currentTarget.dataset.storeindex;
    let checked = e.detail.value;
    let suclist = JSON.parse(JSON.stringify(this.data.suclist));
    suclist[storeindex].checked = checked;
    suclist[storeindex].shopCartList.forEach(res => (res.checked = checked));
    this.setData({ suclist });
    this.watchData();
  },
  setItem(e) {
    let { storeindex, index } = e.currentTarget.dataset;
    let checked = e.detail.value;
    let suclist = JSON.parse(JSON.stringify(this.data.suclist));
    suclist[storeindex].shopCartList[index].checked = checked;
    this.setData({ suclist });
    this.watchData();
  },
  allselect(e) {
    let { selcetall } = this.data;
    let suclist = JSON.parse(JSON.stringify(this.data.suclist));
    for (let item of suclist) {
      item.checked = !selcetall;
      item.shopCartList.forEach(val => (val.checked = !selcetall));
    }
    this.setData({ suclist, selcetall: !selcetall });
    this.getSumPrice();
  },
  reduce(e) {
    let { storeindex, index } = e.currentTarget.dataset;
    let suclist = JSON.parse(JSON.stringify(this.data.suclist));
    if (suclist[storeindex].shopCartList[index].ShopingCount <= 1) return;
    let { ProductId, CategoryId } = suclist[storeindex].shopCartList[index];
    Post(api.PostShopCartCount, { ProductId, CategoryId, IsAddSub: 2 }, true).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      suclist[storeindex].shopCartList[index].ShopingCount -= 1;
      this.setData({ suclist });
      this.watchData();
    });
  },
  plus(e) {
    let { storeindex, index } = e.currentTarget.dataset;
    let suclist = JSON.parse(JSON.stringify(this.data.suclist));
    let { ProductId, CategoryId } = suclist[storeindex].shopCartList[index];
    Post(api.PostShopCartCount, { ProductId: ProductId, CategoryId, IsAddSub: 1 }, true).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      suclist[storeindex].shopCartList[index].ShopingCount += 1;
      this.setData({ suclist });
      this.watchData();
    });
  },
  getSumPrice() {
    let Sum = 0;
    let suclist = JSON.parse(JSON.stringify(this.data.suclist));
    for (let item of suclist) {
      item.shopCartList.forEach(res => {
        Sum += res.checked ? (res.ShopingSalesPrice * res.ShopingCount).toFixed(2) * 1 : 0;
      });
    }
    this.setData({ allmoney: Sum.toFixed(2) });
  },
  watchData(e) {
    let proList = JSON.parse(JSON.stringify(this.data.suclist));
    for (let item of proList) {
      let arr = item.shopCartList.filter(res => res.checked);
      item.checked = arr.length == item.shopCartList.length;
    }
    let selcetall = proList.every(res => res.checked);
    this.setData({ suclist: proList, selcetall });
    this.getSumPrice();
  },
  async del(e) {
    my.showLoading({ content: '正在加载' });
    let res = await Get(api.GetDeleteShopCart, { shopId: e.currentTarget.dataset.id });
    if (res.data.Code == 1) {
      await this.getShopCartList();
      let { isLeft } = this.data;
      this.setData({ isLeft: (isLeft += 1) });
    } else {
      ShowNoneToast(res.data.Msg);
    }
    my.hideLoading();
  },
  //结算
  async gobuyorder() {
    var orderlistobj = {};
    let { suclist } = this.data;
    orderlistobj.shoppingOrderView = [];
    suclist.forEach(res => {
      let shoppingInfo = res.shopCartList
        .filter(val => val.checked)
        .map(value => {
          return { ShopId: value.ShopId, ProductId: value.ProductId, ShopingCount: value.ShopingCount };
        });
      if (shoppingInfo.length > 0) {
        orderlistobj.shoppingOrderView.push({ BrandNanme: res.BrandNanme, DepositoryCode: res.DepositoryCode, HeadUrl: res.HeadUrl, shoppingInfo });
      }
    });
    if (orderlistobj.shoppingOrderView.length == 0) return ShowNoneToast('您还没有选择宝贝哦~');
    let res = await Post(api.PostShopCartLoadOrderInfo, orderlistobj, true);
    if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
    my.navigateTo({ url: '/pages/components/buyorder/buyorder?orderdata=' + JSON.stringify(res.data.Data) });
  },
  godetail(e) {
    if (e.currentTarget.dataset.producttype == 2) {
      my.navigateTo({ url: '/pages/components/prodetail/prodetail?id=' + e.currentTarget.dataset.id });
    } else {
      my.navigateTo({ url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id });
    }
  },
  delall() {
    var losearr = [];
    for (var i in this.data.errlist) {
      losearr.push(this.data.errlist[i].ShopId);
    }
    Get(api.GetClearLoseShop, { shopIdStr: losearr.join(',') }).then(res => {
      if (res.data.Code == 1) {
        this.onShow();
      }
    });
  },
  //去凑单
  choudan() {
    NavigateTo('/pages/components/pieceTogether/pieceTogether');
  },
  //加入购物车
 async addShop(e) {
    let item = e.currentTarget.dataset.item;
    let p = new Product(item);
    p.addShopCart().then(()=>{
      this.getShopCartList();
    })
  },
  goshop() {
    my.switchTab({ url: '/pages/tabbar/index/index' });

  },
  async goToPayOrder() {
    if (this.data.allmoney <= 0) return ShowNoneToast('您还没有选择宝贝哦~');
    this.gobuyorder();
  },
  getMyProductRecommend: function () {
    Get(api.GetMyProductRecommend, {}, true).then(res => {
      let d = res.data.Data;
      d.sort(() => Math.random() - 0.5);
      d = d.slice(0, 20);
      this.setData({ newlist: d });
    });
  },
  onPullDownRefresh(){
    this.getShopCartList()
    my.stopPullDownRefresh()
  }
});
