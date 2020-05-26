//logs.js
var config = require('../../config.js')
var http = require('../../utils/httpHelper.js')
var util = require('../../utils/util.js')
var pay = require('../../utils/pay.js')
//var sta = require("../../utils/statistics.js");
//获取应用实例
var app = getApp()
Page({
  data: {
    allGoods:{},
    sumPrice:0,
    address:''
  },
  onLoad: function () {
        var that = this;
        that.setData({ user: wx.getStorageSync('user') });
  },
  onShow:function (){
   //sta();
    var allGoods =  wx.getStorageSync('shoppingcar');
    var sumPrice = 0;
    for(var i=0;i< allGoods.length;i++){
        var price = allGoods[i].price;
        var count =  allGoods[i].buycount;
        price = util.accMul(price,count);
        allGoods[i].pay = price;
        sumPrice = util.accAdd(sumPrice,price);
    }
    this.setData({ allGoods:allGoods, sumPrice:sumPrice });
    this.getDefaultAddress();
  },
  getInventoryList: function (ids) {
    var data = { appid: config.APPID, id: ids };
    var inventorys = new Map();
    http.httpGet("product/getproductbyid", data, function (res) {
      if (res.statusCode == '200') {
        var shoppingcargoods = res.data;
        for(var i=0;i<shoppingcargoods.length;i++){
          inventorys.set(shoppingcargoods[i].id,shoppingcargoods[i].inventory);
        }
        return inventorys;
      }
    });
  },
  getDefaultAddress:function(){
        //获取地址
        var that = this;
        var data = {appid:config.APPID,userId:this.data.user.id};
        http.httpGet("user/getdefaultaddress" ,data,function(res){
            if(res.statusCode == '200' ){
                var allAddress = res.data;
                var address = '';
                for(var i=0;i<allAddress.length;i++){
                    if( allAddress[i].isFirst == 1){
                        address = allAddress[i];
                        break;
                    }
                }
                if(address == '' && allAddress.length > 0){
                    address = allAddress[0];
                }
                that.setData({address:address});
            }
        });
  },
  //开始结算
  settlement: function () {
    var that = this;
    //检查地址是否为空
    if (this.data.address == "") {
      wx.showModal({
        title: '提示',
        content: '请您先添加邮寄地址！',
        success: function (res) {
          if (res.confirm) {
            that.toAddress();
          }
          return;
        }
      })
    }
    //继续生成订单
    var addressId = this.data.address.id;
    var allGoods = this.data.allGoods;
    var productIds = '', productNames = '', productImgs = '', numbers = '';
    allGoods.forEach(function (goods) {
      if (productIds == '') {
        productIds = goods.id;
        productNames = goods.name;
        productImgs = goods.img;
        numbers = goods.buycount;
      } else {
        productIds = productIds + ',' + goods.id;
        productNames = productNames + ',' + goods.name;
        productImgs = productImgs + ',' + goods.img;
        numbers = numbers + ',' + goods.buycount;
      }
    });
    // var inventorys = this.getInventoryList(productIds);
    // console.log(inventorys);
    wx.showToast({
      title: '正在下单...',
      icon: 'loading',
      duration: 2000
    });
    var data = {
      appid: config.APPID,
      userId: this.data.user.id,
      price: this.data.sumPrice,
      discountPrice: this.data.sumPrice,
      payPrice: this.data.sumPrice,
      productIds: productIds,
      productNames: productNames,
      productImgs: productImgs,
      status: 0,
      addressId: addressId,
      numbers: numbers
    };
    this.creatOrder(data,
      function (orderid) {
        if (orderid != '') {
          try {
            wx.setStorageSync('shoppingcar', '');
          } catch (e) {
            console.log('清空购物车失败');
          }
          console.log('下单成功，订单号为' + orderid);
          wx.redirectTo({ url: '/pages/order/index' });
          console.log(new Date().getTime());
          //此处写支付
          wx.requestPayment({
            'timeStamp': '',
            'nonceStr': '',
            'package': '',
            'signType': 'MD5',
            'paySign': '',
            'success': function (res) {
              paysuccess(data.appid,data.userId,orderid);
            },
            'fail': function (res) {
              console.log(res);
            }
          })


        }
      });
  },
  //生成订单
  creatOrder: function (data,callback){  
        http.httpGet("order/addorder" ,data,function(res){
          console.log("注意");
          console.log(data);
            if(res.statusCode == '200' ){
                //订单创建成功
                 typeof callback == "function" && callback(res.data)
            }else{
                //订单创建失败
                 typeof callback == "function" && callback('')
            }  
        })
  },
  //支付流程
  payOrderSuccess:function(orderid,status,callback){
        var data = {appid:config.APPID,
                        id:orderid,
                        status:status
                    };
    http.httpGet("order/updateorderstatus" ,data,function(res){
            if(res.statusCode == '200'){
                //订单支付成功
                 typeof callback == "function" && callback(res.data)
            }else{
                //订单支付失败
                 typeof callback == "function" && callback('')
            }  
        })
  },
  toAddress:function(){
      wx.navigateTo({url: '/pages/address/index'})
  },
  
})
