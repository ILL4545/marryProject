var config = require('../../../config.js')
var http = require('../../../utils/httpHelper.js')
//index.js
//获取应用实例
var app = getApp()
var sta = require("../../../utils/statistics.js");
Page({
  data: {
      address:{}
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    that.setData({ user: wx.getStorageSync('user') });
    //添加地址
    var id = options.id;
    //修改地址时，先获取原地址填充；新增地址则不填充
    if(id != ''){
         var data = {appid:config.APPID,userId:this.data.user.id,id:id};
      http.httpGet("user/getaddressbyid" ,data,function(res){
            if(res.statusCode == '200'){
                var address = res.data;
                that.setData({address:address})
            }
         });
    }
  },
  onShow:function (){
      //sta();
  },
  addressInputOnFocus:function(e){
    var that = this;
    console.log(e.detail.value);
    if(e!=''){
      wx.chooseLocation({
        success(res) {
          console.log(res);
          var currentAddress = that.data.address;
          currentAddress.street = res.address;
          that.setData({ address: currentAddress });

        }
      })
    }
  },
  checkPhone:function(phone){
    var myreg = /^[1][0-9]{10}$/;
    if (phone.length == 0) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else if (phone.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else {
      wx.showToast({
        title: '填写正确',
        icon: 'success',
        duration: 1500
      })
    }
  },
  formSubmit: function (e){
      //提交表单
      var val = e.detail.value;
      var checkphone=this.checkPhone(val.phone);
      if(checkphone==false){
        console.log("手机号错误");
      }
      else if(this.data.address.id){
        var data = { appid: config.APPID, userId: this.data.user.id, id: this.data.address.id, name: val.name, phone: val.phone, street: val.street}
        if(data.name!=''&data.phone!=''&data.street!=''){
          http.httpGet("user/updateaddress", data, function (res) {

            if (res.statusCode == '200') {
              wx.navigateBack();
              console.log("编辑地址成功");
            } else {
              //wx.navigateBack();
              console.log("编辑地址失败");
            }
          });
        }else{
          wx.showToast({
            title: '请填完整信息',
            icon: 'none',
          })
        }
        
      }else{
        var data = { appid: config.APPID, userId: this.data.user.id, name: val.name, phone: val.phone, street: val.street};
        if (data.name != '' & data.phone != '' & data.street != '') {  
          http.httpGet("user/addadressbyuser" ,data,function(res){
                
                 if(res.statusCode == '200' ){
                        wx.navigateBack();
                        console.log("添加地址成功");
                 }else{
                        //wx.navigateBack();
                        console.log("添加地址失败");
                 }
          });
        }else{
          wx.showToast({
            title: '请填完整信息',
            icon: 'none',
          })
        }
      }
  },
  deleteAddress:function(){
     
      if((this.data.address!='')&& (this.data.address.id!='')){
            var id = this.data.address.id;
            var data = {appid:config.APPID,userId:this.data.user.id,id:id};
            console.log(data);
        http.httpGet("user/deleteaddressbyid" ,data,function(res){
                    if(res.statusCode == '200' ){
                            wx.showToast({
                                title: '删除地址成功！',
                                icon: 'success',
                                duration: 500
                            })
                            wx.navigateBack();
                            console.log("删除地址成功");
                    }else{
                            //wx.navigateBack();
                            console.log("删除地址失败");
                    }
            });
      }else{
          console.log("删除地址失败");
      }
  }
})
