var config = require('../../config.js')
var http = require('../..//utils/httpHelper.js')
//index.js
//获取应用实例
var app = getApp()
var sta = require("../../utils/statistics.js");
Page({
  data: {
    allAddress: [],//地址列表
  },
  onLoad: function () {
    var that = this;
    that.setData({user:wx.getStorageSync('user')});
    
  },
  onShow:function(){
      //sta();
      this.getAllAddressList();  
  },
  getAllAddressList:function(){
        var that = this;
    var data = { appid: config.APPID, userId: this.data.user.id};
    http.httpGet("user/getaddressbyuser" ,data,function(res){
            if(res.statusCode == '200'){
                that.setData({allAddress:res.data});
            }
        });
  },
  radioChange:function(e){
      console.log(e);
      var id = e.detail.value;
      /*var allAddress = this.data.allAddress;
      for(var i=0;i<allAddress.length;i++){
          if(id == allAddress[i].id){
              allAddress[i].checked = true;
          }else{
              allAddress[i].checked = false;
          }
      }*/
    var data = { appid: config.APPID, userId: this.data.user.id,id:id}
    console.log(data)
    http.httpGet("user/setdefaultaddress" ,data,function(res){
      console.log(res)
                 if(res.statusCode == 200){
                        console.log("设置默认地址成功");
                        wx.navigateBack({
                          delta:1,
                        });//设置完默认地址后退回前一页
                 }else{
                        console.log("设置默认地址失败");
                 }
      });
      //用户每次点选地址后，该地址将设为默认地址
  },
  addrss:function (e){
        wx.navigateTo({url:"/pages/address/addto/index?id="})
  },
  addto:function (e){
        var id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({url:"/pages/address/addto/index?id="+id})
  },
  
})
