import { api, ShowNoneToast, GetChannelCode, Post } from './common';

/**
 * 商品模块
 */

/**
 * @class  商品类
 * @param {object} goodInfo 单个商品信息对象
 * @param {object} options 其它参数
 * @param {String} CategoryId 规格ID
 * @param {String} CategoryName 规格名
 * @param {String} ImageUrl 商品图片
 * @param {String} ShopingCount 购买数量
 * @param {String} ProductName 商品名
 */
export default class Product {
  constructor(goodInfo, options = {}) {
    if (typeof goodInfo != 'object') ShowNoneToast('没有goodInfo');
    if (!goodInfo.ProductId) ShowNoneToast('缺少商品id');
    this.ShopingCount = 1;
    this.SouceChannel = GetChannelCode();
    Object.assign(this, goodInfo);
  }
  /**
   *商品加入购物车
   */
  addShopCart() {
    return new Promise(async (success, fail) => {
      this.getProductTaste().then(async res => {
        let { CategoryId, CategoryName, ImageUrl } = res;
        let query = {
          CategoryId,
          CategoryName,
          ImageUrl,
          ShopingCount: this.ShopingCount,
          ProductId: this.ProductId,
          ProductName: this.ProductName,
          SouceChannel: this.SouceChannel
        };
        let res2 = await Post(api.PostShopCart, query, true);
        ShowNoneToast(res2.data.Msg);
        success(res2);
      });
    }).catch(err => {
      throw Error(err);
    });
  }
  /**
   * 获取商品规格
   */
  getProductTaste() {
    return new Promise((success, fail) => {
      try {
        if (!this.ProductId) {
          ShowNoneToast('缺少商品id');
          return fail(false);
        }
        Post(api.GetProductTaste4 + '?productId=' + this.ProductId).then(res => {
          if (res.data.Code == -1) return ShowNoneToast(res.data.Msg);
          let difference = res.data.Data.difference;
          if (!difference.length) return ShowNoneToast('difference为空');
          difference = difference.pop();
          success(difference);
        });
      } catch (error) {
        throw new Error('at Product.js');
      }
    });
  }
}
