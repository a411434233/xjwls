const app = getApp();
import { api, Token, Post, Get, ShowNoneToast } from '../../../utils/common';
Page({
  data: {
    imgs1: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    imgs2: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    imgs3: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    src: '/images/icon/star2x.png',
    src1: '/images/icon/star2xh.png',
    starId1: -1,
    starId2: -1,
    starId3: -1,
    //
    detail: '',
    imgUrls: [],
    addImgText: '拍照/相册',
    canAddImg: true,
    maxAddImgNum: 4,
    i: 0,
    imgArr: [],
    content: '',
    contentpopup: false,
    user_ids: '', //
    listlength: '', //
    orderid: '', //
    listarr: [], //
    valuearr: [] //评论数组
  },
  onLoad(options) {
    this.setData({
      orderid: options.orderid
    });
    let valuearr =[];
    let imgUrls = [];
    //评价列表
    Get(api.GetProductEvaluateInfo, { orderCode: options.orderid }).then(res => {
      this.setData({
        listarr: res.data.Data[0].subOrderList
      });
      for (var i = 0; i < res.data.Data[0].subOrderList.length; i++) {
        valuearr.push('');
        imgUrls[i] = [];
      }
    });

    this.setData({
      valuearr: valuearr,
      imgUrls: imgUrls
    });
  },
  chenkpf1(e) {
    this.setData({
      starId1: e.currentTarget.dataset.ind
    });
  },
  chenkpf2(e) {
    this.setData({
      starId2: e.currentTarget.dataset.ind
    });
  },
  chenkpf3(e) {
    this.setData({
      starId3: e.currentTarget.dataset.ind
    });
  },
  inpval(e) {
    let arr  = this.data.valuearr;
    arr[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({
      valuearr: arr
    });
  },
  addImg: function (e) {
    // 上传照片
    var that = this;
    my.chooseImage({
      count: that.data.maxAddImgNum,
      success: res => {
        // console.log(res)
        that.setData({ i: 0, imgArr: res.apFilePaths });
        that.uploadImg(e.currentTarget.dataset.index);
      }
    });
  },
  uploadImg: function (index) {
    var that = this;
    var ii = that.data.i;
    if (ii < that.data.imgArr.length) {
      my.uploadFile({
        url: 'https://api.smjpin.cn/Evaluate/PostImagesImport', //自己服务器接口地址
        fileType: 'image',
        fileName: 'file',
        filePath: that.data.imgArr[that.data.i],
        formData: {
          //这里写自己服务器接口需要的额外参数
        },
        success: res => {
          var _imgUrls = that.data.imgUrls;
          _imgUrls[index].push(JSON.parse(res.data).Data); //取到包含所有图片的数组
          that.setData({ imgUrls: _imgUrls });
          _imgUrls[index].length == 0 && that.set_data(that, _imgUrls, '拍照/相册', true);
          _imgUrls[index].length > 0 && _imgUrls[index].length < that.data.maxAddImgNum && that.set_data(that, _imgUrls, '+', true);
          _imgUrls[index].length >= that.data.maxAddImgNum && that.set_data(that, _imgUrls[index].splice(0, that.data.maxAddImgNum), '+', false);
          that.setData({ i: ii + 1 });
          that.uploadImg();
        },
        fail: res => {
          // console.log('失败', res)
        }
      });
    }
  },
  delImg: function (e) {
    // 删除照片
    // console.log('e', e, this.data.imgUrls)
    var indexs = e.currentTarget.dataset.indexs;
    var index = e.currentTarget.dataset.ind;
    var _imgUrls = this.data.imgUrls;
    _imgUrls[index].splice(indexs, 1);
    // console.log('_imgUrls', _imgUrls)
    _imgUrls[index].length == 0 && this.set_data(this, _imgUrls, '拍照/相册', true);
    _imgUrls[index].length > 0 && _imgUrls[index].length < this.data.maxAddImgNum && this.set_data(this, _imgUrls, '+', true);
  },
  set_data: function (that, imgUrls, addImgText, canAddImg) {
    that.setData({
      imgUrls: imgUrls,
      addImgText: addImgText,
      canAddImg: canAddImg
    });
  },
  async tj() {
    let info = await Token.getToken();
    if (this.data.starId1 == -1 || this.data.starId2 == -1 || this.data.starId3 == -1) {
      ShowNoneToast('请对商家食品评分');
      return;
    }
    for (var i in this.data.valuearr) {
      if (this.data.valuearr[i] == '') {
        ShowNoneToast('请填写评价内容');
        return;
      }
    }
    var a = Math.ceil((this.data.starId1 + this.data.starId2 + this.data.starId3) / 3 + 1);
    var arr = [];
    this.data.listarr.forEach((el, index) => {
      var obj = {};
      obj.OrderId = this.data.orderid;
      obj.UserId = info.user_id;
      obj.ProductId = el.ProductId;
      obj.EvaluateType = 1;
      obj.StarLevel = a;
      obj.Score = a;
      obj.Label = '';
      obj.Content = this.data.valuearr[index];
      obj.evaluateImagesView = this.data.imgUrls[index];
      arr.push(obj);
    });
    //上传
    Post(api.PostOrderEvaluate, arr).then(res => {
      ShowNoneToast('感谢您的评价！');
      my.navigateBack({
        delta: 1
      });
    });
  }
});
