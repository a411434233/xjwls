import { api, Get, Product, NavigateTo, Token } from '../../utils/common';
Component({
  mixins: [],
  data: {},
  props: {
    item: {
      ProductName: '',
      DiscountAmount: 0,
      SalesPrice: 0,
      Tag: [],
      Remark: '',
      ImageUrl: '',
      ProductId: ''
    }
  },
  methods: {
    addShop(e) {
      let item = e.currentTarget.dataset.item;
      let p = new Product(item);
      p.addShopCart();
    },
    godetail(e) {
      let id = e.currentTarget.dataset.id;
      NavigateTo('/pages/components/pro_detail/pro_detail', { id: id });
    },
    async onSubmit(e) {
      if (!e.detail.formId) return;
      let info = await Token.getToken();
      let data = { AliUserId: info.aliuser_id, FormId: e.detail.formId, MessageType: 1, ProductId: e.currentTarget.dataset.id };
      Get(api.SaveTemplateMessageInfo, data, true);
    }
  }
});
