import { api, Post, ShowNoneToast, Product } from '../../../utils/common';
Page({
  data: {
    arr: ['综合', '销量', '新品', '价格'],
    activeinx: 0,
    showp1: true,
    showp2: true,
    pageIndex: 1,
    pageSize: 10,
    list: [],
    name: '',
    showdb: false,
    condition: 1 //状态 1综合 2销量 3新品 45价格
  },
  onLoad(options) {
    this.setData({
      name: options.name
    });
    Post(api.GetCommodityInfo, {
      name: this.data.name,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      condition: this.data.condition
    }).then(res => {
      if (res.data.Data && res.data.Data.length > 0) {
        this.setliSh(options.name);
      }
      this.setData({
        list: res.data.Data
      });
    });
  },
  setliSh(value) {
    value = value ? value : this.data.searchVal;
    let lishi = my.getStorageSync({
      key: 'lish'
    });
    if (lishi.data) {
      lishi = lishi.data;
      let index = lishi.findIndex(val => val.name == value);
      if (index == -1) {
        lishi.push({ name: value, num: 1 });
      } else {
        lishi[index].num += 1;
      }
    } else {
      lishi = [];
      lishi.push({ name: value, num: 1 });
    }
    lishi.sort((a, b) => b.num - a.num);
    my.setStorageSync({
      key: 'lish',
      data: lishi
    });
  },
  onReachBottom() {
    this.setData({
      pageIndex: Number(this.data.pageIndex) + 1
    });
    Post(api.GetCommodityInfo, {
      name: this.data.name,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      condition: this.data.condition
    }).then(res => {
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
  tabqh(e) {
    this.setData({
      activeinx: e.currentTarget.dataset.inx,
      pageIndex: 1
    });
    let query = {
      name: this.data.name,
      pageIndex: 1,
      pageSize: this.data.pageSize,
      condition: 2
    };
    if (this.data.activeinx == 0) {
      this.setData({
        condition: 1,
        showp1: true,
        showp2: true
      });
      query.condition = 1;
    } else if (this.data.activeinx == 1) {
      this.setData({
        condition: 2,
        showp1: true,
        showp2: true
      });
      query.condition = 2;
    } else if (this.data.activeinx == 2) {
      this.setData({
        condition: 3,
        showp1: true,
        showp2: true
      });
      query.condition = 3;
    }

    if (this.data.activeinx == 3) {
      if (this.data.showp1 == true && this.data.showp2 == true) {
        this.setData({
          showp1: false,
          showp2: true,
          condition: 5
        });
        query.condition = 5;
      } else if (this.data.showp1 == true && this.data.showp2 == false) {
        this.setData({
          showp1: false,
          showp2: true,
          condition: 5
        });
        query.condition = 5;
      } else if (this.data.showp1 == false && this.data.showp2 == true) {
        this.setData({
          showp1: true,
          showp2: false,
          condition: 4
        });
        query.condition = 4;
      }
    }
    Post(api.GetCommodityInfo, query).then(res => {
      this.setData({
        list: res.data.Data
      });
    });
  },
  godetail(e) {
    my.navigateTo({
      url: '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id
    });
  },
  //加入购物车
  gocart(e) {
    let item = e.currentTarget.dataset.item;
    let p = new Product(item);
    p.addShopCart().then(() => {
      this.setData({
        buypop: false
      });
    });
  }
});
