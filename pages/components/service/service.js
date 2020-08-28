import {serviceData} from '../../../data/serviceJson'
Page({
  data: {
    serviceData: [
      {
        sertitleData: "物流配送问题（查不到物流、修改地址）",
        serConData: [{
          name: "1、怎么查询不到物流？", ask: "自您收到商品48小时内，如符合以下条件，我们将提供退换货服务",
          askcContent: [
            { cont: "1）	商品无损坏、无缺失、不影响第二次销售" },
            { cont: "1）	商品无损坏、无缺失、不影响第二次销售" },
            { cont: "1）	商品无损坏、无缺失、不影响第二次销售" }
          ],
        }]
      },
    ],
    activeKey: ["item1", "item2", "item3", "item4", "item5", "item6"]
  },
  onLoad() {
    this.setData({
      serviceData
    })
  },
});

