import {loadBC} from 'miniapp-bc-user';

Page({
  data: {
    shopCard: false,
    guess: false,
    showComponent: false,
    pluginOptions: {
      refpid: 'mm_24945026_1639050448_110361600206'
    },
    pluginOptionsg: {
      refpid: 'mm_24945026_1639050448_110361600206',
      pageSize: 6, // 每页个数，默认 10
      maxPageNum: 10 // 最大页数，不设置时请求接口所有数据
    }
  },
  onLoad() {
    my.loadPlugin({
      plugin: '2021001157622718@*', // 指定要加载的插件id和版本号，为*则每次拉取最新版本
      success: () => {
        this.setData({ shopCard: true }); // 插件已加载，可以渲染插件组件了
      }
    });

    my.loadPlugin({
      plugin: '2021001131694653@*', // 指定要加载的插件id和版本号，为*则每次拉取最新版本
      success: () => {
        this.setData({ guess: true }); // 插件已加载，可以渲染插件组件了
      }
    });
  },
  async onReady() {
    try {
      await loadBC();
      this.setData({ showComponent: true });
    } catch (e) {}
  },
  bcError(err) {
    console.log('err:', err);
  },
  onReachBottom() {
    this.setData({
      loadMoreTime: (this.data.loadMoreTime || 0) + 1
    });
  }
});
