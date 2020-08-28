Page({
  data: {},
  onLoad() {
    my.getSystemInfo({
      success: res => {
        this.setData({ titleBarHeight: res.titleBarHeight, statusBarHeight: res.statusBarHeight });
      }
    });
  }
});
