import {
    AliPay,
    api,
    Get,
    GetChannelCode,
    getMyLocations,
    NavigateTo,
    Post,
    SetStorage,
    ShowNoneToast
} from '../../../utils/common';
import Big from 'big.js/big';

const app = getApp()
Page({
    data: {allmoney: 0, shop: 0, splice: my.canIUse('page.$spliceData'), isVCoins: false, addFlag: false},
    onLoad(query) {
        let data;
        if (typeof query.orderdata != 'string') {
            data = app.orderdata;
        } else {
            data = JSON.parse(query.orderdata);
        }
        if (query.shop) {
            let discountRecord = data.discountRecord;
            data.previewOrderView.forEach(element => {
                element.discountRecord = discountRecord;
            });
            this.setData({shop: 1});
        }
        this.setData(data);
        this.getMyAddress(data);
    },
    //选择配送地址
    setadd(e) {
        let index = e.currentTarget.dataset.index;
        if (index == 1 && this.data.SelfRaising == 0) return ShowNoneToast('该商品不支持到店自取');
        this.setData({addFlag: index == 1});
        if (index == 1) {
            this.getStoreList();
        }
    },
    onShow() {
        this.GetFreight();
    },
    //获取自提门店列表
    getStoreList() {
        let {storeInfo, storeNum, storeList} = this.data;
        if (typeof storeInfo != 'undefined') return;
        getMyLocations().then(res => {
            let [{subSaleOrder}] = this.data.previewOrderView;
            if (typeof subSaleOrder == 'undefined') return;
            let [{ProductId}] = subSaleOrder;
            Get(api.GetSelfRaisingShopConfig, {
                productId: ProductId,
                longitude: res.longitude,
                latitude: res.latitude
            }).then(resp => {
                storeList = resp.data.Data;
                storeInfo = resp.data.Data[0];
                storeNum = resp.data.Data.length - 1;
                this.setData({storeInfo, storeNum, storeList});
                SetStorage('storeInfo', storeInfo);
            });
        });
    },
    //获取邮费
    async GetFreight() {
        let {previewOrderView, addressManage} = this.data;
        if (addressManage == null) return;
        let list = JSON.parse(JSON.stringify(previewOrderView));
        let m = [];
        list.forEach(res => {
            res.subSaleOrder.forEach(val => {
                m.push({
                    ProductId: val.ProductId,
                    Qty: val.ShopingCount,
                    AddressId: addressManage.Id,
                    SkuIds: val.SkuIds
                });
            });
        });
        const res_1 = await Post(api.GetFreight, m);
        if (res_1.data.Code == -1) return ShowNoneToast(res_1.data.Msg);
        if (res_1.data.Code == 1) {
            let ilist = res_1.data.Data;
            ilist = ilist.filter(value => {
                return value.DiscountPrice > 0 || value.MailPrice > 0;
            });
            list.forEach(val_1 => {
                let item = ilist.find(a => a.DepositoryCode == val_1.DepositoryCode);
                if (item) {
                    val_1.MailPrice = item.MailPrice;
                    val_1.DiscountPrice = item.DiscountPrice;
                } else {
                    val_1.DiscountPrice = 0;
                    val_1.MailPrice = 0;
                }
            });
            previewOrderView = list;
            this.setData({previewOrderView});
            this.getAllMoney();
        }
    },
    //结算
    gopay() {
        my.showLoading({content: '加载中...'});
        this.pointData('OrderPay', '订单支付_');
        if (this.data.addressManage == null) {
            my.hideLoading();
            return ShowNoneToast('请添加收货地址');
        }
        if (this.data.shop == 1) {
            this.payOrder();
        } else {
            this.payShop();
        }
    },
    //直接购买
    payOrder() {
        try {
            let {addressManage, previewOrderView, GroupBuyId, isVCoins} = this.data;
            let [{subSaleOrder}] = previewOrderView;
            if (subSaleOrder.length && subSaleOrder) {
                subSaleOrder = subSaleOrder[0];
            }
            let RecordId = previewOrderView[0].discountRecord ? previewOrderView[0].discountRecord.RecordId : 0;
            if (typeof subSaleOrder == 'undefined') {
                return;
            }
            let query = {
                AddressId: addressManage.Id,
                AddressName: addressManage.Province,
                CategoryId: subSaleOrder.CategoryId,
                CategoryName: subSaleOrder.CategoryName,
                DepositoryCode: previewOrderView[0].DepositoryCode,
                GroupBuyId: GroupBuyId,
                ImageUrl: subSaleOrder.ImageUrl,
                IsUseVcoins: isVCoins ? 1 : 0,
                PayChannel: 1,
                SkuName: subSaleOrder.SkuName,
                SkuIds: subSaleOrder.SkuIds,
                ProductId: subSaleOrder.ProductId,
                RecordId: RecordId,
                ShopingCount: subSaleOrder.ShopingCount,
                SouceChannel: GetChannelCode()
            };
            if (this.data.addFlag) {
                query.AddressId = 0;
                query.OrderType = 2;
            }

            Post(api.PostDirectCreateOrder, query, true).then(res => {
                my.hideLoading();
                if (res.data.Code == 1) {
                    const VCoinsNum = res.data.Data.VCoinsNum;
                    let OrderCode = res.data.Data.OrderCode;
                    this.aliPay(res.data.Data.TradeNo, VCoinsNum, OrderCode);
                } else {
                    ShowNoneToast(res.data.Msg);
                }
            });
        } catch (error) {
            ShowNoneToast(`错误`);
            my.hideLoading();
            throw Error(error);
        }
        my.hideLoading();
    },
    setStore() {
        let [{subSaleOrder}] = this.data.previewOrderView;
        if (subSaleOrder.length && subSaleOrder) {
            subSaleOrder = subSaleOrder[0];
        }
        NavigateTo('/pages/components/storeList/storeList', {ProductId: subSaleOrder.ProductId});
    },
    //购物车购买
    payShop() {
        try {
            let {addressManage, previewOrderView, isVCoins} = this.data;
            let query = {
                AddressId: addressManage.Id,
                IsUseVcoins: isVCoins ? 1 : 0,
                SouceChannel: GetChannelCode(),
                shoppingOrderView: []
            };
            query.shoppingOrderView = previewOrderView.map(res => {
                let shoppingInfo = res.subSaleOrder.map(val => {
                    return {
                        ProductId: val.ProductId,
                        ShopId: val.ShopId,
                        ShopingCount: val.ShopingCount
                    };
                });
                let RecordId = res.discountRecord ? res.discountRecord.RecordId : 0;
                return {
                    BrandNanme: res.BrandNanme,
                    DepositoryCode: res.DepositoryCode,
                    HeadUrl: res.HeadUrl,
                    RecordId: RecordId,
                    shoppingInfo: shoppingInfo
                };
            });
            Post(api.PostShopCartCreateOrder2, query, true).then(res => {
                my.hideLoading();
                if (res.data.Code == 1) {
                    const VCoinsNum = res.data.Data.VCoinsNum;
                    let OrderCode = res.data.Data.OrderCode;
                    this.aliPay(res.data.Data.TradeNo, VCoinsNum, OrderCode);
                } else {
                    ShowNoneToast(res.data.Msg);
                }
            });
        } catch (error) {
            ShowNoneToast('错误');
            my.hideLoading();
            throw Error(error);
        }
        my.hideLoading();
    },
    detail() {
        NavigateTo('/pages/actives/actives?src=https://m.smjpin.cn/chihuochang/#/youdao');
    },
    aliPay(TradeNo, VCoinsNum, OrderCode) {
        AliPay(TradeNo, VCoinsNum, OrderCode);
    },
    goaddress() {
        NavigateTo('/pages/components/address/address');
    },
    //是否味币抵扣
    change(e) {
        this.setData({isVCoins: e.detail.value});
        this.getAllMoney();
    },
    //计算价格
    getAllMoney() {
        let allmoney = 0;
        let previewOrderView = this.data.previewOrderView;
        previewOrderView.forEach(res => {
            let goodsNum = 0;
            let sum = new Big(0);
            res.subSaleOrder.forEach(val => {
                let x = new Big(val.ShopingSalesPrice * 1);
                x = x.times(val.ShopingCount);
                sum = sum.plus(x);
                goodsNum += val.ShopingCount *= 1;
            });
            if (res.discountRecord != null) {
                sum = sum.minus(res.discountRecord.DiscountAmount);
            }

            //判断是否有运费
            if (res.MailPrice > 0) {
                sum = sum.plus(res.MailPrice);
            }

            //判断是否有满减
            if (res.DiscountPrice > 0) {
                sum = sum.minus(res.DiscountPrice);
            }

            res.AllOrderPrice = sum.toFixed(2);
            res.goodsNum = goodsNum;
            allmoney += sum * 1;
        });

        if (this.data.isVCoins) {
            allmoney -= this.data.VCoinsAmount / 100;
        }
        allmoney = allmoney.toFixed(2);
        this.setData({
            allmoney: allmoney,
            previewOrderView
        });
    },
    //获取地址
    getMyAddress(data) {
        let {addressManage} = data;
        if (addressManage != null) return;
        if (!my.getAddress) {
            my.alert({
                title: '提示',
                content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
            });
            return;
        }
        my.getAddress({
            success: res => {
                res = res.result;
                let data = {
                    Province: res.prov,
                    City: res.city,
                    Area: res.area,
                    Address: res.address,
                    UserName: res.fullname,
                    Tel: res.mobilePhone,
                    Status: 1,
                    IsDefault: 1
                };
                Post(api.PostAddress, data, true).then(res2 => {
                    if (res2.data.Code == 1) {
                        data.Id = res2.data.Data;
                        this.setData({addressManage: data});
                    }
                });

            },
            fail: err => {
                console.log(err);
            }
        });
    },
    //选择优惠券
    gocoupon() {
        my.navigateTo({
            url: '/pages/components/coupno/coupno'
        });
    },
    //埋点
    pointData(PageName, ClickPlace) {
        let data = {PageName: PageName, ClickPlace: ClickPlace, SoureChannel: GetChannelCode()};
        Post(api.PostStatisticSystem, data, true).then(() => {
        });
    }
});
