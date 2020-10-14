//导出模块

const api = {
    //生产地址
    BASE_URL: 'https://api.smjpin.cn/',
    // 开发地址
    // BASE_URL: 'https://apitest.smjpin.cn/',

    //首页轮播
    GetBannerConfig: '/Home/GetBannerConfig',
    //首页icon
    GetChannelConfig: 'Home/GetChannelConfig',
    //首页tabbar
    GetIndexChannelConfig: '/ActiveGoods/GetIndexChannelConfig',
    //首页商品列表
    GetHomeRecommendV2: 'Home/GetHomeRecommendV2',
    //首页轮播点击
    SaveTemplateMessageInfo: 'TemplateMessage/SaveTemplateMessageInfo',

    GetTodayLowPrice: 'Home/GetTodayLowPrice',
    //
    GetHomePageConfig: 'Home/GetHomePageConfig',

    // ------------------购物车接口(cart.axml)-------------------------
    //购物车列表
    GetShopCartList: 'ShoppingT/GetShopCartList',
    //删除商品
    DeleteShopCart: 'ShoppingT/DeleteShopCart',
    //生成支付订单PostShopCart
    PostShopCartLoadOrderInfo: 'OrderForm/PostShopCartLoadOrderInfo',
    //清空失效商品
    GetClearLoseShop: 'ShoppingT/GetClearLoseShop',
    //商品加入购物车
    GetProductTaste4: 'Commodity/GetProductTaste4',
    //购物车商品数量
    GetMyShopCartProTotalNum: 'ShoppingT/GetMyShopCartProTotalNum',
    //购物车底部推荐商品
    GetMyProductRecommend: 'Commodity/GetMyProductRecommend',
    //加入购物车
    AddShopCart: 'ShoppingT/AddShopCart',
    //操作购物车数量
    ModifyQty: 'ShoppingT/ModifyQty',
    //支付
    PostAliPayCreateOrder: 'PayOrder/PostAliPayCreateOrder',

    // -----------------------------minea.axml 个人中心----------------
    GetUserInfo: 'UserInfo/GetUserInfo',

    GetMineOrderStatus: 'OrderForm/GetMineOrderStatus',
    //
    GetMyVCoins: 'DailyClockIn/GetMyVCoins',

    //信息授权
    PostUserUpdate: 'UserInfo/PostUserUpdate',

    // -----------------------------sorta.axml ----------------
    //埋点
    PostStatisticSystem: 'StatisticSystem/PostStatisticSystem',

    getAllCategory: 'Category/getAllCategory',

    getProductsByCategoryId: 'Category/getProductsByCategoryId',

    GetProductCategoryListV2: 'Category/GetProductCategoryListV2',

    // -----------------------------activity.axml ----------------

    GetProductTaste2: 'Commodity/GetProductTaste2',

    // -----------------------------address.axml 地址模块 ----------------
    //获取地址列表
    GetAddressList: 'Address/GetAddressList',
    //删除地址
    DeleteAddress: 'Address/DeleteAddress',
    //获取地址详情
    GetAddress: 'Address/GetAddress',
    //新增地址||修改地址
    PostAddress: 'Address/PostAddress',

    // -----------------------------aftersale.axml 订单模块----------------
    //订单信息
    GetReceiptProducts: 'ReturnGoods/GetReceiptProducts',
    //退货退款
    PostReceiptApply: 'ReturnGoods/PostReceiptApply',

    // 退款详情
    GetReturnApplyInfo: 'ReturnGoods/GetReturnApplyInfo',
    //支付订单
    PostDirectCreateOrder: 'OrderForm/PostDirectCreateOrder',

    //订单支付2
    PostShopCartCreateOrder2: 'OrderForm/PostShopCartCreateOrder2',

    // 超值换购产品
    GetAddedPurchaseProductInfo: 'Commodity/GetAddedPurchaseProductInfo',

    // ----------------------------- 上传图片模块----------------
    //上传图片
    PostImagesImport: ' Evaluate/PostImagesImport',

    // ----------------------------- cashbonus.axml----------------

    CreateAliCashBonusInfo: 'CashBonus/CreateAliCashBonusInfo',

    //获取次数
    GetTodayLuckyDraw: 'CashBonus/GetTodayLuckyDraw',
    //中奖用户
    GetLuckyUser: 'CashBonus/GetLuckyUser',
    //
    CreateCashBonus: 'CashBonus/CreateCashBonus',
    //获取收藏码
    PostConstValues: 'CashBonus/PostConstValues',
    //
    GoToLuckyDraw: 'CashBonus/GoToLuckyDraw',
    //
    GetDiscount: 'Discount/GetDiscount',
    //
    GetMyRecord: 'CashBonus/GetMyRecord',

    Receive: '/ActiveGoods/Receive',
    // ----------------------------- 签到----------------

    GetASurprisesV3: 'CashBonus/GetASurprisesV3',

    GetPrizes2: 'Discount/GetPrizes2',

    GetVCoinsExchangePrizes: 'DailyClockIn/GetVCoinsExchangePrizes',

    GetPrizeConfig: 'DailyClockIn/GetPrizeConfig',

    Init: 'DailyClockIn/Init',

    SignIn: 'DailyClockIn/SignIn',

    ReSignIn: 'DailyClockIn/ReSignIn',

    InitV2: 'DailyClockIn/InitV2',

    DoVCoinsExchangePrizes: 'DailyClockIn/DoVCoinsExchangePrizes',

    DoShareGetReClockInTimes: 'DailyClockIn/DoShareGetReClockInTimes',

    GetUrl: 'StatisticSystem/GetUrl',

    GetSignRecProduct: 'Commodity/GetSignRecProduct',

    GetCoupons: 'Discount/GetCoupons',

    GetNotice: 'Home/GetNotice',

    //获取邮费
    GetFreight: 'OrderForm/GetFreight',

    //1元品数据
    GetSignRecGoods: 'ActiveGoods/GetSignRecGoods',

    // ----------------------------------------不常用----------------------------------------
    GetProductMarketingTab: 'Home/GetProductMarketingTab',

    GetProductMarketingList: 'Home/GetProductMarketingList',
    // ----------------------------------------其它----------------------------------------
    GetVCoinsList: 'VCoins/GetVCoinsList',

    TodayMadRob: 'Commodity/TodayMadRob',

    GetProductInfo2: 'Commodity/GetProductInfo2',

    GetUserCollect2: 'UserInfo/GetUserCollect2',

    GetInternalActivitiesInfo: 'Discount/GetInternalActivitiesInfo',

    GetProductDiscount: 'Commodity/GetProductDiscount',

    PostCollectProduct: 'UserInfo/PostCollectProduct',

    PostDirectLoadOrderInfo: 'OrderForm/PostDirectLoadOrderInfo',

    GetDiscounts: 'Discount/GetDiscounts',

    GetPrizes: 'Discount/GetPrizes',

    PostUserRegistV1: 'UserInfo/PostUserRegistV1',

    GetCollectList: 'UserInfo/GetCollectList',

    GetProductsBydptCode: 'Commodity/GetProductsBydptCode',

    GetDiscountList: 'Discount/GetDiscountList',

    CreateAliCashBonusInfoV2: 'CashBonus/CreateAliCashBonusInfoV2',

    GetTodayLuckyDrawV2: 'CashBonus/GetTodayLuckyDrawV2',

    CreateCashBonusV2: 'CashBonus/CreateCashBonusV2',

    GoToLuckyDrawV2: 'CashBonus/GoToLuckyDrawV2',

    GetMyRecordV2: 'CashBonus/GetMyRecordV2',

    GetASurprisesV4: 'CashBonus/GetASurprisesV4',

    GetDiscountListV1: 'Discount/GetDiscountListV1',

    PostOrderEvaluate: 'Evaluate/PostOrderEvaluate',

    GetCommodityInfo: 'Home/GetCommodityInfo',

    GetOrderParticulars: 'OrderForm/GetOrderParticulars',

    GetProductEvaluateInfo: 'Evaluate/GetProductEvaluateInfo',

    GetShipTrayRecord: 'OrderForm/GetShipTrayRecord',

    GetAllEvaluate: 'Commodity/GetAllEvaluate',

    GetConfirmReceipt: 'ReturnGoods/GetConfirmReceipt',

    DeleteOrder: 'OrderForm/DeleteOrder',
    //签到底部商品列表
    GetSiginProducts: 'ActiveGoods/GetSiginProducts',

    GetDiscountsByRand: 'Discount/GetDiscountsByRand',

    GetAllDiscountList: 'Discount/GetAllDiscountList',

    //根据经纬度获取配送门店列表
    GetSelfRaisingShopConfig: 'SelfRaising/GetSelfRaisingShopConfig',
    //订单列表
    GetOrderListByUser: 'SelfRaising/GetOrderListByUser',

    //订单详情
    GetOrderInfo: 'SelfRaising/GetOrderInfo',
    //商品详情页积分宝接口
    GetRebateInfo: 'Commodity/GetRebateInfo',
    //获取门店
    GetBrandInfo: 'Commodity/GetBrandInfo',

    //获取门店下的商品列表
    GetProductsByBrandId: 'Commodity/GetProductsByBrandId',

    //个人中心订单状态展示
    GetUnEndOrder: 'orderform/GetUnEndOrder',

    //满减金额获取
    GetDiscountPrice: 'OrderForm/GetDiscountPrice',
    //
    GetActiveGoods: 'ActiveGoods/GetActiveGoods',
    //根据规格返回价格
    GetSkuInfo: 'OrderForm/GetSkuInfo'
};

export default api;
