//index.js
var config = require('../../config.js')
var http = require('../../utils/httpHelper.js')
var sta = require("../../utils/statistics.js");
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,  //是否自动切换
    interval: 5000, //自动切换时间
    duration: 1000,  //滑动时间
    buyCount:1 //开始默认购买数量为1
    },
    onLoad:function(options){
        var id = options.id;
        this.getGoodsList(id);
    },
    onShow:function (){
        //sta();
    },
    getGoodsList:function(id){
            var that = this;
            var data = {appid:config.APPID,id:id}
            http.httpGet("product/getproductbyid" ,data,function(res){
              if (res.statusCode == '200'){
                        var goods = res.data[0];
                        that.setData({goods:goods});
                    }
            });
    },
    buyCount:function(e){
        var id = e.currentTarget.id;
        var count = this.data.buyCount;
        if(id == "add"){
          count = (count > 0)?count+1:1;
        }else{
            count = (count>0)?count-1:0
        }
        this.setData({buyCount:count});
        
    },

  add2shoppingcar:function(e){
          var id = e.currentTarget.id;
          var count = this.data.buyCount;
          var goods = this.data.goods;
          var currentInventory = goods.inventory;//库存
          count = (count>0)?count:1;
          
          //取出购物车商品
    goods = { id: goods.id, name: goods.title, img: goods.img_urls, price: goods.price, buycount: count, inventory: goods.inventory};
          try{
                var allGoods =wx.getStorageSync('shoppingcar')
                if(allGoods == ""){
                   allGoods = []
                }
                //遍历检查购物车是否有此商品
                var hasCount = 0;
                for(var i=0;i<allGoods.length;i++){
                    var temp = allGoods[i];
                    if(temp.id == goods.id){
                      hasCount = temp.buycount;
                      allGoods.splice(i, 1);
                      break;
                    }
                }
                goods.buycount = goods.buycount + hasCount;
            if (goods.buycount<=currentInventory){
                allGoods.push(goods);
                wx.setStorageSync('shoppingcar', allGoods);
                if (id == 'add2shoppingcar') {
                  wx.showToast({
                    title: '已加入购物车',
                    icon: 'success',
                    duration: 2000
                  });
              };
               console.log('添加到购物车成功!');
               return true;
              }else{
                  console.log('购物车中商品数量超过库存');
                  wx.showToast({
                    title: '库存不足',
                    icon: 'loading',
                    duration:2000
                  });
                  return false;
               }
          }catch(m){
            console.log('添加到购物车失败!');
            return false;
          };
    },
  jump2shoppingcar:function(e){
    if (e != '') {
      wx.switchTab({
        url: '/pages/shoppingcar/index',
        success: function (res) {
          console.log('跳到购物车');
        }
      })
    }
  },
  buyNow:function(e){
    var isadd=this.add2shoppingcar(e);
    if(isadd==true){this.jump2shoppingcar(e);}
  }
})