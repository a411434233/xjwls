import {
    api,
    Debounce,
    Get,
    GetChannelCode,
    getSysTemInfo,
    NavigateTo,
    Post,
    Product,
    SetStorage,
    ShowNoneToast,
    SwitchTab,
    Token
} from '../../../utils/common';

Page({
    data: {
        shopModel: false,
        showCoupone: false,
        goodsNum: 1,
        ispay: '',
        user_id: '',
        guige: '',
        specifications: [],
        difference: {},
        id: '',
        jfbData: {}, //集分宝数据,
        pageIndex: 0,
        scrollTop: 0,
        current: 0,
        myadd: {}
    },
    async onLoad(options) {
        getSysTemInfo().then(res => {
            this.setData({statusBarHeight: res.statusBarHeight, titleBarHeight: res.titleBarHeight});
        });
        await Token.getToken().then(res => {
            this.setData({user_id: res.user_id});
        });
        await this.getproInfo(options.id);
        this.getProductsBydptCode(options.id);
        this.GetBrandInfo(options.id);
        this.getProductDiscount(options.id);
        this.getAddress();

        this.setData({id: options.id});
        if (options.qdcode) {
            await SetStorage('qdmc', {qdcode: options.qdcode});
        }
        setTimeout(() => {
            this.getShopNum();
            this.pointData(['proInfo', '商品详情_' + options.id]);
        }, 1200);
    },
    getMyadd() {
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
                        this.setData({myadd: data});
                    }
                });
            },
            fail: err => {
                console.log(err);
            }
        });
    },
    getAddress() {
        Get(api.GetAddressList, {}, true).then(res => {
            if (res.data.Data) {
                this.setData({myadd: res.data.Data[0]});
            }
        });
    },
    bannerChange(e) {
        let current = e.detail.current;
        this.setData({current: current});
    },
    onPageTab(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({pageIndex: index});
        let arr = ['#pageTop', '#store', '#storeDetail'];
        this.getDombyId(arr[index]).then(res => {
            let t = res.top - this.data.statusBarHeight - this.data.titleBarHeight;
            t = this.data.scrollTop + t;
            if (index == 0) t = 0;
            my.pageScrollTo({
                scrollTop: t,
                duration: 300
            });
        });
    },
    GetBrandInfo(productId) {
        Get(api.GetBrandInfo, {productId: productId}).then(res => {
            this.setData({storeInfo: res.data.Data});
        });
        this.getjfb(); //获取积分宝数据
    },
    //获取锚点位置
    getDombyId(id) {
        return new Promise((res, rej) => {
            my.createSelectorQuery()
                .select(id)
                .boundingClientRect()
                .exec(ret => {
                    if (ret[0]) {
                        return res(ret[0]);
                    }
                    rej();
                });
        });
    },
    //获取当前购物车商品数量
    getShopNum() {
        const app = getApp();
        app.iniShopnum().then(res => {
            this.setData({shopNum: res.data.Data});
        });
    },
    //获取集分宝数据
    async getjfb() {
        let info = await Token.getToken();
        let {id} = this.data;
        let params = {
            productId: id, //产品id
            token: info.token //token
        };
        Get(api.GetRebateInfo, params).then(res => {
            if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
            if (res.data.Data == null) return;
            let p = 1 - res.data.Data.RebateRate;
            let SalesPrice = this.data.SalesPrice;
            p = (SalesPrice * p).toFixed(2);
            p = p.toString().split('.');
            this.setData({fanliPrice: p, jfbData: res.data.Data || {}});
        });
    },
    //获取商品信息
    getproInfo(productId) {
        return Post(api.GetProductInfo2 + '?productId=' + productId).then(res => {
            if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
            this.setData(res.data.Data);
        });
    },
    //获取规格
    getProductTaste(productId) {
        return Post(api.GetProductTaste4 + '?productId=' + productId).then(async res => {
            let info = res.data.Data;
            if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
            info.difference = info.difference.pop();
            for (let val of info.specifications) {
                val.item.forEach((a, idx) => {
                    a.isChecked = !idx;
                });
            }
            let data = await this.getguige(info.specifications);
            this.GetSkuInfo(data.SkuIds); //计算价格
            this.setData(info);
        });
    },
    // 推荐商品
    getProductsBydptCode: function (productId) {
        Get(api.GetProductsBydptCode, {productId: productId}).then(res => {
            this.setData({recProductList: res.data.Data});
        });
    },
    //获取优惠券
    getProductDiscount(productId) {
        Get(api.GetProductDiscount, {productId: productId}).then(res => {
            if (res.data.Code == -1)
                return this.setData({
                    DiscountAmount: '',
                    MinAmount: []
                });
            if (res.data.Data.length <= 0) return;
            let DiscountAmount = res.data.Data[0].DiscountAmount || 0;
            res.data.Data = res.data.Data.filter(val => {
                return val.SendType && val.SendType != 2;
            });
            if (res.data.Data.length > 0) {
                this.initGocoup(res.data.Data[0].DiscountId);
            }
            this.setData({
                DiscountAmount,
                MinAmount: res.data.Data
            });
        });
    },
    //领券
    async golq(e) {
        let discountId = e.currentTarget.dataset.id;
        let info = await Token.getToken();
        Post(api.GetCoupons, {Token: info.token, DiscountId: discountId, channelCode: GetChannelCode()}).then(res => {
            ShowNoneToast(res.data.Msg);
        });
    },
    //进入详情页开始领券
    async initGocoup(discountId) {
        let info = await Token.getToken();
        this.pointData(['GetCoupons', '详情页领券_' + this.data.ProductId + '_' + discountId]);
        let channelCode = GetChannelCode();
        let options = {
            url: api.GetCoupons,
            data: {
                Token: info.token,
                DiscountId: discountId,
                channelCode: channelCode
            },
        }
        Post(options.url, options.data).then(res => {
            let code = res.data.Code;
            if (code == 1 || code == -2) {
                this.setData({
                    isShowdis: true
                });
            } else {
                this.setData({
                    isShowdis: false
                });
            }
        });
    },
    //进入店铺
    intoStore() {
        let {ProductId} = this.data;
        NavigateTo('/pages/components/store/store?ProductId=' + ProductId);
    },
    //唤起分享
    share() {
        my.showSharePanel();
    },
    //获取商品信息
    async getAddQuery() {
        let guige = (await this.getguige()) || {};
        let {ProductId, goodsNum, ProductName, difference} = this.data;
        let channelCode = GetChannelCode();
        if (typeof guige != 'object') return;
        if (guige.SkuName == 'undefined') return;
        if (!guige) return;
        if (typeof difference != 'object') return;
        if (!difference) return;
        let data = {
            productId: ProductId,
            ProductName: ProductName,
            ShopingCount: goodsNum,
            CategoryId: guige.CategoryId,
            CategoryName: guige.CategoryName,
            SkuIds: guige.SkuIds,
            SkuName: guige.SkuName,
            ImageUrl: difference.ImageUrl,
            SouceChannel: channelCode
        };
        return data || false;
    },
    //加入购物车
    async addShopCat() {
        let gui = this.data.guige.split(',');
        let arr = gui.filter(item => !item);
        if (arr.length > 0 || gui.length - arr.length < this.data.specifications.length) return ShowNoneToast('请选择规格');
        let data = await this.getAddQuery();
        Post(api.AddShopCart, data, false, true).then(res => {
            if (res.data.Code == 1) {
                this.setData({shopModel: false});
                ShowNoneToast(res.data.Msg, '', 800);
                this.getShopNum();
            } else {
                ShowNoneToast(res.data.Msg);
            }
        });
    },
    //立即购买
    async pay() {
        this.pointData(['buyProOne', '购买_' + this.data.ProductId]);
        let gui = this.data.guige.split(',');
        let arr = gui.filter(item => !item);
        if (arr.length > 0 || gui.length - arr.length < this.data.specifications.length) return ShowNoneToast('请选择规格');
        let data = await this.getAddQuery();
        if (data == false) return;
        if (typeof data != 'object') return;
        Post(api.PostDirectLoadOrderInfo, data, true).then(res => {
            if (res.data.Code == 1) {
                this.setData({shopModel: false});
                if (res.data.Data == null) return;
                let query = {
                    orderdata: JSON.stringify(res.data.Data),
                    activetype: 0,
                    ProductType: this.data.ProductType,
                    numbers: this.data.goodsNum,
                    shop: 1
                };
                NavigateTo('/pages/components/buyorder/buyorder', query);
            } else {
                ShowNoneToast(res.data.Msg);
            }
        });
    },
    //选择规格
    async setLabel(e) {
        let {idx, index} = e.currentTarget.dataset;
        let specifications = JSON.parse(JSON.stringify(this.data.specifications));
        specifications[index].item.forEach((res, index) => {
            res.isChecked = idx == index ? !res.isChecked : false;
        });
        this.getguige(specifications).then(res => {
            this.GetSkuInfo(res.SkuIds);
        });
        this.setData({specifications});
    },
    //根据规格查询价格
    GetSkuInfo(SkuIds) {
        return Get(api.GetSkuInfo, {productId: this.data.ProductId, skuIds: SkuIds}).then(res => {
            if (res.data.Code == -1) {
                ShowNoneToast(res.data.Msg);
                return;
            }
            if (res.data.Data != null) {
                let difference = this.data.difference;
                difference.SalesPrice = res.data.Data.SkuPrice;
                difference.ImageUrl = res.data.Data.ProImageUrl;
                difference.Nums = res.data.Data.StockNum;
                this.setData({difference: difference});
            }
        });
    },
    //获取规格
    getguige(guige = []) {
        return new Promise(async (resolve) => {
            let {specifications} = this.data;
            guige = guige.length ? guige : specifications;
            if (guige && !guige.length) return {};
            if (typeof guige != 'object') return {};
            let p = guige.map(res => {
                return res.item.filter(val => val.isChecked).pop();
            });
            let SkuName = p.map(val => (val || '').CategoryName || '').join(',');
            let SkuIds = p.map(value => (value || '').CategoryId || '').join(',');
            let difference = this.data.difference;
            this.setData({
                guige: SkuName == ',' ? '' : SkuName
            });
            let filter = p.filter(item => typeof item != 'object');
            if (filter.length > 0) return;
            resolve({
                SkuIds: SkuIds,
                SkuName: SkuName,
                CategoryId: difference.CategoryId,
                CategoryName: difference.CategoryName
            });
        });
    },
    //推荐商品详情页
    goodsDetail(e) {
        let index = e.currentTarget.dataset.index;
        let {ProductId} = this.data.recProductList[index];
        NavigateTo('/pages/components/pro_detail/pro_detail', {id: ProductId});
    },
    addtuijian(e) {
        let index = e.currentTarget.dataset.index;
        let item = this.data.recProductList[index];
        let p = new Product(item);
        p.addShopCart();
    },
    //预览详情图
    showImages() {
        let imagesList = this.data.DetailImagesView.map(res => res.ImageUrl);
        my.previewImage({
            current: 0,
            urls: imagesList
        });
    },
    closeShopmodel() {
        this.setData({shopModel: false});
    },
    async addShop(e) {
        if (this.data.guige == '') {
            await this.getProductTaste(this.data.ProductId);
        }
        let ispay = e.currentTarget.dataset.ispay;
        this.setData({shopModel: true, ispay});
    },
    quanpoup(ref) {
        this.quanp = ref;
    },
    lingquan() {
        this.quanp.onPopupShowquan();
    },
    addNum() {
        let goodsNum = this.data.goodsNum;
        goodsNum += 1;
        this.setData({goodsNum});
    },
    eddNum() {
        let goodsNum = this.data.goodsNum;
        if (goodsNum <= 1) return;
        goodsNum -= 1;
        this.setData({goodsNum});
    },
    goShopCart() {
        SwitchTab('/pages/tabbar/cart/cart');
    },
    goHome() {
        SwitchTab('/pages/tabbar/index/index');
    },
    getMyAddress() {
        NavigateTo('/pages/components/address/address');
    },
    // 锚点
    pointData([PageName, ClickPlace]) {
        let url = api.PostStatisticSystem;
        let data = {PageName: PageName, ClickPlace: ClickPlace, SoureChannel: GetChannelCode()};
        Post(url, data, true).then(() => {
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
    },
    onShareAppMessage() {
        return {
            title: this.data.ProductName,
            desc: this.data.Remark,
            imageUrl: this.data.difference.ImageUrl,
            bgImgUrl: this.data.difference.ImageUrl,
            path: '/pages/components/pro_detail/pro_detail?id=' + this.data.ProductId
        };
    },
    onPageScroll: Debounce(function (e) {
        let res = e[0];
        this.setData({scrollTop: res.scrollTop});
    }, 100)
});
