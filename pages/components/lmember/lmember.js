import { NavigateToMiniService } from '../../../utils/common';
Page({
  data: {
    list: [
      {
        images: 'http://image.smjpin.cn/lmember06.png',
        name: '手造鸭舌'
      },
      {
        images: 'http://image.smjpin.cn/lmember07.png',
        name: '蜜汁腿'
      },
      {
        images: 'http://image.smjpin.cn/lmember05.png',
        name: '琵琶翅'
      }
    ]
  },
  onShow() {},
  //轻会员
  goqhy() {
    let extraData = {
      'alipay.huabei.hz-enjoy.templateId': '2020010800020903850003819525',
      'alipay.huabei.hz-enjoy.partnerId': '2088631273892854'
    };
    NavigateToMiniService('2019072365974237', 'pages/hz-enjoy/main/index', extraData);
  }
});
