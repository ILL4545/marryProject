//index.js
var config = require('../../config.js')
var http = require('../../utils/httpHelper.js')
var pay = require('../../utils/pay.js')
//var sta = require("../../utils/statistics.js");
//获取应用实例
var app = getApp()
Page({
  data: {
    orderList:[],
  },
 onLoad: function () {
    var that = this;
   that.setData({ user: wx.getStorageSync('user') });
   
  },
  onShow:function(){
    //sta();
      this.getlist();
  },
  getlist:function(){
    var that = this;
    var data = {appid:config.APPID,userId:this.data.user.id/*,page:'',pageSize:'',order:'id'*/}
    http.httpGet("order/getorderlistbyuser" ,data,function(res){
            if(res.statusCode == '200'){
                 var orderList = res.data;
                 that.setData({orderList:orderList});
            }
    });
  },
  pay:function(e){

      
      //支付成功订单
      var orderid = e.target.id;
     //此处写支付
      wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
        paysuccess(data.appid, data.userId, orderid);
      },
      'fail': function (res) {
        console.log(res);
      }
      })
      
    
  },
  cancelOrder:function (e){
     
    //取消订单
     var orderid = e.target.id;
     this.updateOrderInfo(orderid,4);
    wx.showToast({
      title: '取消订单成功!',
      icon: 'success',
      duration: 1000
    });
     
    
  },
  updateOrderInfo:function(orderid,status,callback){
            var that = this;
            var data = {appid:config.APPID,userid:this.data.user.id,status:status,id:orderid}
            http.httpGet("order/updateorderstatus" ,data,function(res){
                    if(res.statusCode == '200' ){
                        var orderList = that.data.orderList;
                        for(var i= 0 ;i<orderList.length;i++){
                              if(orderList[i].id == orderid){
                                  orderList[i].status = status;
                                  break;
                              }
                        };
                        that.setData({orderList:orderList});
                        that.onShow();//刷新显示
                    }
            });
  }
})
