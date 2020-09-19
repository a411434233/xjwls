import {api, Get, NavigateTo, Product, SetStorage} from '../../../utils/common';

Page({
  data: {
    checkFollow: false
  },
  onLoad(options) {
    if (options.id) {
      SetStorage('qdmc', { qdcode: options.id });
    }
    this.getData();
  },
  addShopCat(e) {
    let item = e.currentTarget.dataset.item;
    let p = new Product(item);
    p.addShopCart();
  },
  goodsDetail(e) {
    let item = e.currentTarget.dataset.item;
    if (typeof item != 'object') return;
    NavigateTo('/pages/components/pro_detail/pro_detail?id=' + item.ProductId);
  },
  getData() {
    Get(api.GetActiveGoods, { pageId: 14 }).then(res => {
      let list = res.data.Data;
      let obj = {};
      list.forEach(val => {
        if (obj[val.ChannelId]) {
          obj[val.ChannelId].push(val);
        } else {
          obj[val.ChannelId] = [val];
        }
      });
      let host, song;
      let list2 = [];
      let images = ['', '', '', '/images/snacks/titlelogo3.png', '/images/snacks/titlelogo4.png', '/images/snacks/titlelogo5.png', '/images/snacks/titlelogo6.png'];
      for (let key in obj) {
        if (key == 1) {
          host = obj[key];
        } else if (key == 2) {
          song = obj[key];
        } else {
          list2.push({
            name: obj[key][0].ChannelName || '',
            list: obj[key],
            img: images[key],
            showNum: 9,
            show: true
          });
        }
      }
      host.sort((a, b) => a.SalesPrice - b.SalesPrice);
      this.setData({ host, song, list2 });
    });
  },
  showMore(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.list2[index];
    item.showNum += 9;
    this.$spliceData({ list2: [index, 1, item] });
  },
  closeCb(e) {
    const { followed } = e.detail;
    this.setData({
      checkFollow: followed
    });
  },
  close() {
    this.setData({
      checkFollow: true
    });
  }
});
