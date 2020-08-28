import { api, Post, Token,Get, GetChannelCode, ShowNoneToast } from '../../utils/common';
Component({
  mixins: [],
  data: {
    showCoupone: false
  },
  props: {
    item: {},
    MinAmount: []
  },
  methods: {
    //关闭模态框
    onPopupClosequan() {
      this.setData({ showCoupone: false });
    },
    //显示模态框
    onPopupShowquan() {
      this.setData({ showCoupone: true });
    },
    //领券
    async golq(e) {
      let discountId = e.currentTarget.dataset.id;
      let info = await Token.getToken();
      Post(api.GetCoupons, { Token: info.token, DiscountId: discountId, channelCode: GetChannelCode() }).then(res => {
        ShowNoneToast(res.data.Msg);
      });
    },
    //订阅模板消息
    async onSubmit(e) {
      if (!e.detail.formId) return;
      let info = await Token.getToken();
      let data = {
        AliUserId: info.aliuser_id,
        FormId: e.detail.formId,
        MessageType: 2,
        ProductId: e.currentTarget.dataset.id
      };
      Get(api.SaveTemplateMessageInfo, data, true);
    }
  }
});
