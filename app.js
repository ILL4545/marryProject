var config = require('config.js')
var http = require('./utils/httpHelper.js')
var util = require('./utils/util.js')
//app.js
App({
  globalData: {
    userInfo: null,
    useraccess: null,
    appInfo: null,
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    this.getUserInfo(null);
    this.getAppInfo(null);
    console.log(that.globalData);
  },
  //获取用户信息
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
        typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
        //调用登录接口
        wx.login({
            success: function(res) {
                if (res.code) {
                    var code = res.code;
                    //获得用户基本信息
                    wx.getUserInfo({
                        success: function (res) {
                          // console.log(res.userInfo);
                          var userInfo = res.userInfo;
                            that.globalData.userInfo = userInfo;
                          wx.setStorageSync('userInfo', that.globalData.userInfo)
                        }
                     });
                    //获取用户校验信息
                    var data = {
                      appid: config.APPID,
                      secret: config.SECTET,
                      js_code: res.code,
                      grant_type: 'authorization_code'
                    };
                    http.httpGetFullUrl("https://api.weixin.qq.com/sns/jscode2session", data, function (res) {
                      // console.log(res.data);
                      if (res.statusCode == '200') {
                        that.globalData.useraccess = res.data;
                        wx.setStorageSync('useraccess', that.globalData.useraccess)
                        typeof cb == "function" && cb(that.globalData.useraccess)
                      }
                    });
                    
                  //用户信息入库
                  var userInfo = wx.getStorageSync('userInfo');
                  var useraccess = wx.getStorageSync('useraccess');
                    var data2 = {
                      openId: useraccess.openid,
                      avatarUrl: userInfo.avatarUrl,
                      nickName: userInfo.nickName,
                      gender: userInfo.gender,
                      city: userInfo.city,
                      province: userInfo.province,
                      country: userInfo.country
                    };
                    //console.log(data2);
                  // http.httpGet("user/adduser", data2, function (res) {
                  //     if(res.statusCode==200){
                  //         http.httpGet("user/getuser",{openId:data2.openId},function(res){
                  //           if(res.statusCode==200){
                  //             console.log(res)
                  //             wx.setStorageSync('user', res.data);
                  //           }
                  //         })
                  //     }
                  //   });
                  
                } else {
                      console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    }
  },
  //获取app信息
  getAppInfo:function(cb){
    var that = this;
    if(this.globalData.appInfo){
        typeof cb == "function" && cb(this.globalData.appInfo)
    }else{
        var data = {appid:config.APPID}
      http.httpGet("wedding/wedding/getappinfo" ,data,function(res){
            console.log(res);
        if (res.statusCode == '200'){
                that.globalData.appInfo = res.data;
                typeof cb == "function" && cb(that.globalData.appInfo)
            }
        });
    }
  }
})