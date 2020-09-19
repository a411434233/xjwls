import { Post, ShowNoneToast, Token, SetStorage, GetChannelCode, Product } from '../../utils/common';
Page({
  data: {
    qdcode: '',
    // src: 'https://m.smjpin.cn/chihuochang/#/xjwSnacks'
    src: ''
  },
  async onLoad(query) {
    this.webViewContext = my.createWebViewContext('web1');
    let pathId = GetChannelCode();

    if (query.id) {
      SetStorage('qdmc', { qdcode: query.id });
      pathId = query.id;
      this.setData({
        qdcode: query.id
      });
    }

    if (!query.id || this.data.qdcode == '') {
      let q = JSON.stringify(query);
      if (q.indexOf('id') >= 0) {
        let id = q.match(/[0-9]+/g);
        if (id.length) {
          SetStorage('qdmc', { qdcode: id[0] });
          this.setData({
            qdcode: id[0]
          });
          pathId = id[0];
        }
      }
    }

    let info = await Token.getToken();

    if (query.src) {
      let src = query.src;
      if (src.search(/[?]/) > -1) {
        src += '&id=' + pathId + '&queryData=' + JSON.stringify(info);
      } else {
        src += '?id=' + pathId + '&queryData=' + JSON.stringify(info);
      }
      this.setData({
        src: src
      });
    } else {
      let src = 'https://m.smjpin.cn/chihuochang/#/xjwSnacks'
      if (src.search(/[?]/) > -1) {
        src += '&id=' + pathId + '&queryData=' + JSON.stringify(info);
      } else {
        src += '?id=' + pathId + '&queryData=' + JSON.stringify(info);
      }
      this.setData({
        src: src
      })
    }
  },
  // 接收来自H5的消息
  async onMessage(e) {
    let info = await Token.getToken(this.data.qdcode);
    let data = e.detail;
    //跳转商品详情
    if (data.type == 'GoodsDetail') {
      my.navigateTo({
        url: '/pages/components/pro_detail/pro_detail?id=' + data.id
      });
    }
    //加入购物车
    if (data.type == 'addShopCat') {
      let p = new Product(data.id);
      p.addShopCart().then(() => {
        ShowNoneToast('已加入购物车');
      });
    }
    //查看购物车
    if (data.type == 'shopCat') {
      my.switchTab({
        url: '/pages/tabbar/cart/cart'
      });
    }

    //返回token
    if (data.type == 'token') {
      this.webViewContext.postMessage({ token: info });
    }

    //领券
    if (data.type == 'newpeople') {
      let url = 'Discount/ReceiveDiscount';
      Post(url, { token: info.token }).then(res => {
        ShowNoneToast(res.data.Msg);
      });
    }

    //返回首页
    if (data.type == 'backHome') {
      my.switchTab({
        url: '/pages/tabbar/index/index'
      });
    }

    //跳转页面
    if (data.type == 'navigateTo') {
      my.navigateTo({ url: data.url });
    }
  }
});
