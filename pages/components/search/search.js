import {ShowNoneToast} from '../../../utils/common';

Page({
  data: {
    test_data: ['小鸡腿', '鸭舌', '鸭掌', '鸡翅'],
    searchVal: '',
    hotSearchArr: [{ name: '小鸡腿' }, { name: '鸭舌' }, { name: '鸭掌' }, { name: '鸡翅' }],
    liSh: []
  },
  onShow(query) {
    let liSh = my.getStorageSync({
      key: 'lish'
    }).data;
    liSh = liSh ? liSh : [];
    this.setData({
      liSh
    });
  },
  back() {
    this.setData({
      searchVal: ''
    });
  },
  /* 获取input搜索内容 */
  getInputVal(e) {
    let val = e.detail.value;
    this.setData({
      searchVal: val
    });
  },
  delStrong() {
    my.confirm({
      title: '提示',
      content: '清空历史吗?',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: res => {
        if (res.confirm) {
          my.setStorageSync({
            key: 'lish',
            data: []
          });
          this.setData({
            liSh: []
          });
        }
      }
    });
  },
  /* 去搜索 */
  goSearch(e) {
    let { searchVal } = this.data;
    if (searchVal == '') {
      ShowNoneToast('请输入搜索内容');
    } else {
      my.navigateTo({
        url: '/pages/components/goodslist/goodslist?name=' + searchVal
      });
    }
  },
  search(e) {
    let index = e.currentTarget.dataset.index;
    let { name } = this.data.liSh[index];
    my.navigateTo({
      url: '/pages/components/goodslist/goodslist?name=' + name
    });
    this.setliSh(name);
  },
  search2(e) {
    let index = e.currentTarget.dataset.index;
    let { name } = this.data.hotSearchArr[index];
    my.navigateTo({
      url: '/pages/components/goodslist/goodslist?name=' + name
    });
    this.setliSh(name);
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
  }
});
