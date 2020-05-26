//logs.js
var util = require('../../utils/util.js')
var sta = require("../../utils/statistics.js");
Page({
  data: {
    allGoods:{},
    sumPrice:0
  },
  onLoad: function () {
  
  },
  onShow:function (){
    //sta();
    this.showAllGoods();
  },
  settlement:function (){
    wx.navigateTo({url: '/pages/settlement/index'})
  },
  jia:function (e){
    this.jiaj(e,true);
  },
  jian:function (e){
    this.jiaj(e,false);
  },
  showAllGoods:function (){
    

    var allGoods =  wx.getStorageSync('shoppingcar');
    var sumPrice = 0;
    console.log(allGoods);
    for(var i=0;i< allGoods.length;i++){
        var price = allGoods[i].price;
        var count =  allGoods[i].buycount;
        console.log(price+":"+count);
        price = util.accMul(price,count);
        sumPrice = util.accAdd(sumPrice,price);
    }

    this.setData({
      allGoods:allGoods,
      sumPrice:sumPrice
    });
  },
  toDetail:function(e){
      var id = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../detail/index?id='+id}
        )
  },
  jiaj:function (e,boo){
    var id = e.currentTarget.dataset.id;
    var s = 0;
    var allGoods = this.data.allGoods;
    for(var i=0;i<allGoods.length;i++){
        if(allGoods[i].id==id){
            if(boo){
                s = allGoods[i].buycount+1;
            }else{
                s = allGoods[i].buycount-1;
            }
            //最低值不得低于1
            if(1>s){
                allGoods.splice(i, 1);
            }else{
              console.log("haha")
              console.log(allGoods[i]);
              if (s > allGoods[i].inventory){
                allGoods[i].buycount = allGoods[i].inventory;
                wx.showToast({
                  title: '不能再多了！',
                  icon:'loading',
                  duration:500
                })
              }else{
                allGoods[i].buycount = s;
              }
                
            }
            break;
          }
    }
    wx.setStorageSync('shoppingcar', allGoods);
    this.setData({
      allGoods:allGoods
    });
    this.showAllGoods();
  }
})
