import {api, Get, GetStorage, JsonSort, NavigateTo, Post, Product} from '../../../utils/common';

const app = getApp();
Page({
    data: {
        left: 0,
        activeTab: 0,
        currIndex: 0,
        sortIndex: 0,
        screenWidth: 375,
        Categorys: [],
        productsLeft: [],
        subtabname: 'all',
        shopNum: '0',
        sort: true,
        className: '',
        price_title: '价格',
        productList: []
    },
    async onLoad() {
        this.setData({screenWidth: app.screenWidth || 375});
        await this.getAllCategory();
    },
    async onShow() {
        if (app.swichQuery) this.setIndex();
    },
    getAllCategory() {
        let [url, data, that] = [api.getAllCategory, {}, this];
        return Get(url, data).then(async res => {
            if (!res.data.Data) return;
            that.setData({Categorys: res.data.Data});
            if (app.swichQuery) return this.setIndex(res.data.Data);
            that.getProductListId(res.data.Data[0].CategoryId);
        });
    },
    getProductListId(categoryId) {
        if (!categoryId) return;
        let [url, data, that] = [api.getProductsByCategoryId, {categoryId: categoryId}, this];
        Get(url, data).then(res => {
            let list = res.data.Data;
            if (!res.data.Data) return;
            let productList = list[0].productList;
            let productsLeft = list.map(val => {
                return {CategoryName: val.title};
            });

            that.setData({list: list, productList, productsLeft});
        });
    },
    //横向选项卡
    SerchProducts(e) {
        let index = e.currentTarget.dataset.index;
        let {CategoryId} = this.data.Categorys[index];
        this.setData({currIndex: index, left: e.currentTarget.offsetLeft - this.data.screenWidth / 2, activeTab: 0});
        this.getProductListId(CategoryId);
    },
    //纵向选项卡
    handleChange(e) {
        let index = e.currentTarget.dataset.index;
        let {productList} = this.data.list[index];
        this.setData({activeTab: index, productList});
    },
    setIndex(tabs = []) {
        tabs = tabs.length ? tabs : this.data.Categorys;
        if (!tabs.length) return;
        let index = tabs.findIndex(val => val.CategoryId == app.swichQuery);
        this.getProductListId(tabs[index].CategoryId);
        app.swichQuery = '';
        this.setData({currIndex: index, activeTab: 0});
    },
    //分类排序
    sortDeal(e) {
        let index = e.currentTarget.dataset.index;
        let productList = this.data.productList;
        let field = 'Hot';
        if (index == 0) field = 'Hot';
        if (index == 1) field = 'SaleCount';
        if (index == 2) field = 'SalesPrice';
        let arr = JsonSort(productList, field, index != 2 ? true : !this.data.sort);
        this.setData({sortIndex: index, productList: arr, sort: !this.data.sort});
    },
    //加入购物车
    gocart(e) {
        let item = e.currentTarget.dataset.item;
        let p = new Product(item);
        p.addShopCart();
    },
    goShoppingCart() {
        NavigateTo('/pages/tabbar/cart/cart');
    },
    godetail(e) {
        let pro_detail = '/pages/components/pro_detail/pro_detail?id=' + e.currentTarget.dataset.id;
        NavigateTo(pro_detail);
    },
    bPoint() {
        GetStorage('qdmc').then(res => {
            if (res.success == true) {
                let [PageName, ClickPlace, SoureChannel] = ['sort', '分类', res.data.qdcode];
                let [url, data, that] = [api.PostStatisticSystem, {
                    PageName: PageName,
                    ClickPlace: ClickPlace,
                    SoureChannel: SoureChannel
                }, this];
                Post(url, data, true);
            }
        });
    },
    iniShopnum() {
        let [url, data, that] = [api.GetMyShopCartProTotalNum, {}, this];
        Get(url, data, true).then(res => {
            that.setData({shopNum: res.data.Data});
        });
    }
});
