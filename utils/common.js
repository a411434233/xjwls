import API from './api';
import Product from './product';

//授权部分
class Token {
  constructor() {
    this.aliuser_id = '';
    this.user_id = '';
    this.token = '';
    this.registChannel = '';
  }

  getToken(registChannel = '') {
    return new Promise(async res => {
      registChannel = registChannel ? registChannel : this.GetChannelCode();
      if (this.token && registChannel == '000') {
        res({
          aliuser_id: this.aliuser_id,
          user_id: this.user_id,
          token: this.token,
          registChannel: this.registChannel
        });
        return;
      }
      let { data } = my.getStorageSync({ key: 'info' });
      if (data == null) {
        data = await this.authToken(registChannel);
      } else {
        if (registChannel && data.registChannel != registChannel) data = await this.authToken(registChannel);
        this.token = data.token;
        this.user_id = data.userid;
        this.aliuser_id = data.aliUserid;
        this.registChannel = registChannel;
      }
      res({
        aliuser_id: data.aliUserid,
        user_id: data.userid,
        token: data.token,
        registChannel: data.registChannel
      });
    });
  }

  clearToken() {
    return new Promise(res => {
      this.aliuser_id = '';
      this.user_id = '';
      this.token = '';
      this.registChannel = '';
      res();
    });
  }

  authToken(registChannel = '') {
    return new Promise(async res => {
      my.getAuthCode({
        scopes: 'auth_base',
        success: async response => {
          let data = {
            authCode: response.authCode,
            registChannel: registChannel
          };
          let resp = await Post('UserInfo/PostUserRegistV1', data);
          if (resp.data.userid <= 100) {
            ShowNoneToast(resp.data.Msg);
          }
          let info = resp.data.Data;
          this.aliuser_id = info.aliUserid;
          this.user_id = info.userid;
          this.token = info.token;
          this.registChannel = registChannel;
          info.registChannel = registChannel;
          my.setStorage({ key: 'info', data: info });
          res(resp.data.Data);
        },
        fail: err => {
          ShowNoneToast(err);
          res();
        }
      });
    });
  }

  GetChannelCode() {
    if (this.registChannel) return this.registChannel;
    let registChannel = GetChannelCode();
    this.registChannel = registChannel;
    return registChannel;
  }
}

const TOKEN = new Token();

/**
 *
 * @param {*} url  请求地址
 * @param {*} data  参数
 * @param {*} user  是否需要userId,
 * @param {*} token 是否需要token
 */

function Post(url, data, user, token) {
  return HttpRequest(url, 'POST', data, user, token);
}

function Get(url, data, user, token) {
  return HttpRequest(url, 'GET', data, user, token);
}

function HttpRequest(url, method, data, user = false, token = false) {
  return new Promise(async (resolve, reject) => {
    let httpUrl = API.BASE_URL + url;
    if (user) {
      let info = await TOKEN.getToken();
      data.userId = info.user_id;
    }
    if (token) {
      let info = await TOKEN.getToken();
      data.Token = info.token;
    }
    my.request({
      url: httpUrl,
      method: method,
      data: data,
      headers: {
        'content-type': 'application/json'
      },
      success: res => {
        if (typeof resolve == 'function') {
          resolve(res);
        }
      },
      fail: err => {
        //请求错误判断
        if (err.error == 12 || err.error == 13) {
          return my.redirectTo({ url: '/pages/errPage/notWifi/notWifi' });
        }
        if (typeof reject == 'function') {
          reject(err);
        }
      }
    });
  });
}

// 异步获取缓存
function GetStorage(key) {
  return new Promise((doSuccess, doComplete) => {
    my.getStorage({
      key: key,
      success: res => {
        if (res.data) {
          return doSuccess(res.data);
        }
        doSuccess(false);
      }
    });
  });
}

//获取来源渠道
function GetChannelCode(channelCode = '') {
  // 获取来源渠道，如果页面参数里面的渠道编码为空，就从缓存中去获取
  if (channelCode) {
    channelCode = channelCode.replace('id=', '');
    SetStorage('qdmc', { qdcode: channelCode });
    return channelCode;
  }
  let res = my.getStorageSync({ key: 'qdmc' }); //同步
  if (res.data) {
    return res.data.qdcode;
  } else {
    return '000';
  }
}

//同步获取缓存
function GetStorageSync(key) {
  let res = my.getStorageSync({ key: key }); //同步
  if (res.data) return res.data;
  return '';
}

//异步写入缓存
function SetStorage(key, data) {
  return new Promise((doSuccess, doFail, doComplete) => {
    my.setStorage({
      key: key,
      data: data,
      success: res => {
        if (typeof doSuccess == 'function') {
          doSuccess(res);
        }
      },
      fail: err => {
        if (typeof doFail == 'function') {
          doFail(err);
        }
      },
      complete: res => {
        if (typeof doComplete == 'function') {
          doComplete(res);
        }
      }
    });
  });
}

/**
 *
 * @param {String} content 内容
 * @param {*} type 类型
 * @param {Number} duration  时间
 */
function ShowNoneToast(content, type = 'none', duration = 1100) {
  return new Promise(res => {
    typeof content == 'object' ? (content = JSON.stringify(content)) : content;
    my.showToast({
      content: content,
      type: type,
      duration: duration,
      success: re => {
        setTimeout(() => {
          res();
        }, duration);
      }
    });
  });
}

function SwitchTab(url) {
  my.switchTab({
    url: url
  });
}

function RedirectTo(url) {
  my.redirectTo({
    url: url //路径可以使用相对路径或绝对路径的方式进行传递
  });
}

/**
 *
 * @param {String} url 跳转地址
 * @param {Object} query  跳转需要带的参数 可选
 */
function NavigateTo(url, query = '') {
  let str = '?';
  if (typeof query == 'object') {
    for (let key in query) {
      if (typeof query[key] == 'object') {
        str += key + '=' + JSON.stringify(query[key]) + '&';
      } else {
        str += key + '=' + query[key] + '&';
      }
    }
  }
  str = str.substr(0, str.length - 1);
  if (str == '?') return my.navigateTo({ url: url });
  my.navigateTo({ url: url + str });
}

// 跳到小程序
function NavigateToMiniProgram(appId, path) {
  return new Promise((doSuccess, doFail) => {
    my.navigateToMiniProgram({
      appId: appId,
      path: path,
      success: res => {
        if (typeof doSuccess == 'function') {
          doSuccess(res);
        }
      },
      fail: err => {
        if (typeof doFail == 'function') {
          doFail(err);
        }
      }
    });
  });
}

//跳到服务
function NavigateToMiniService(serviceId, servicePage, extraData) {
  return new Promise((doSuccess, doFail) => {
    my.navigateToMiniService({
      serviceId: serviceId,
      servicePage: servicePage,
      extraData: extraData,
      success: res => {
        if (typeof doSuccess == 'function') {
          doSuccess(res);
        }
      },
      fail: err => {
        if (typeof doFail == 'function') {
          doFail(err);
        }
      }
    });
  });
}

//生成从minNum到maxNum的随机数
function RandomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
}

/*
 * @description    根据某个字段实现对json数组的排序
 * @param   array  要排序的json数组对象
 * @param   field  排序字段（此参数必须为字符串）
 * @param   reverse 是否倒序（默认为false）
 * @return  array  返回排序后的json数组
 */
function JsonSort(array = [], field, reverse) {
  //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
  if (array.length < 2 || !field || typeof array[0] !== 'object') return array;
  //数字类型排序
  if (typeof array[0][field] === 'number') {
    array.sort(function (x, y) {
      return x[field] - y[field];
    });
  }
  //字符串类型排序
  if (typeof array[0][field] === 'string') {
    array.sort(function (x, y) {
      return x[field].localeCompare(y[field]);
    });
  }
  //倒序
  if (reverse) {
    array.reverse();
  }
  return array;
}

/**
 * @function   getMyLocations  获取当前经纬度
 */
function getMyLocations() {
  return new Promise(doSuccess => {
    if (my.getLocation) {
      my.getLocation({
        success: res => {
          doSuccess(res);
        },
        fail: err => {
          doSuccess(undefined);
          ShowNoneToast(err);
        }
      });
    } else {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
      doSuccess(undefined);
    }
  });
}

/**
 * @function AliPay  唤起支付
 * @param {String} TradeNo  订单号
 * @param {Number} VCoinsNum  付款成功后获得的味币
 * @param {Boolean} back   是否返回,默认-true
 */

function AliPay(TradeNo, VCoinsNum = 20, orderCode = '', back = true) {
  return new Promise(doSuccess => {
    my.tradePay({
      tradeNO: TradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
      success: res => {
        if (res.resultCode == 9000) {
          my.setStorage({
            key: 'qdmc',
            data: {
              qdcode: '000'
            }
          });
          my.reLaunch({
            url: '/pages/components/paySuccess/paySuccess?VCoinsNum=' + VCoinsNum + '&orderCode=' + orderCode
          });
          doSuccess();
        } else {
          if (back) {
            my.reLaunch({
              url: '/pages/components/myorder/myorder?activeindex=1'
            });
          } else {
            ShowNoneToast('您已取消付款');
          }
        }
      },
      fail: res => {
        doSuccess();
        if (back) {
          my.reLaunch({
            url: '/pages/components/myorder/myorder?activeindex=1'
          });
        } else {
          ShowNoneToast('您已取消付款');
        }
      }
    });
  });
}

function ShowLoading(msg = '') {
  my.showLoading({
    content: msg,
    delay: 200
  });
}

function HideLoading() {
  my.hideLoading();
}

// 获取手机信息
function getSysTemInfo() {
  return new Promise(resolve => {
    GetStorage('SysTem').then(res => {
      if (res) {
        return resolve(res);
      }
      my.getSystemInfo({
        success: res => {
          resolve(res);
          SetStorage('SysTem', res);
        }
      });
    });
  });
}

/*函数节流*/
function Throttle(fn, interval) {
  let enterTime = 0; //触发的时间
  const gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function () {
    const context = this;
    const backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function Debounce(fn, interval) {
  let timer;
  const gapTime = interval || 200; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    const context = this;
    const args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

export {
  Post,
  Get,
  ShowNoneToast,
  SwitchTab,
  RedirectTo,
  NavigateTo,
  NavigateToMiniProgram,
  NavigateToMiniService,
  getSysTemInfo,
  GetStorage,
  GetStorageSync,
  SetStorage,
  GetChannelCode,
  RandomNum,
  JsonSort,
  getMyLocations,
  AliPay,
  Product,
  TOKEN as Token,
  API as api,
  ShowLoading,
  HideLoading,
  Debounce,
  Throttle
};
