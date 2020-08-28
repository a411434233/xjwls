import { Get, api, Post, ShowNoneToast, Token, GetcouPones, NavigateTo } from '../../../utils/common';
Page({
  data: { pageIndex: 1, pageSize: 10, more: false },
  onLoad() {
    this.getlist();
  },
  getlist() {
    let { pageIndex, pageSize } = this.data;
    Get(api.GetAllDiscountList, { pageIndex, pageSize }).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      this.setData({ list: res.data.Data });
    });
  },
  onReachBottom() {
    let pageIndex = Number(this.data.pageIndex) + 1;
    let { pageSize } = this.data;
    Get(api.GetAllDiscountList, { pageIndex, pageSize }).then(res => {
      if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
      if (!res.data.Data) {
        return this.setData({ more: true });
      }
      this.setData({ list: [...this.data.list, ...res.data.Data], pageIndex });
    });
  },
  async getCoupone(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.list[index];
    if(item.ProductId){
      NavigateTo("/pages/components/pro_detail/pro_detail?id="+item.ProductId)
    }
  }
});
