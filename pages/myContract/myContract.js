var config = require('../../config.js')
var http = require('../../utils/httpHelper.js')
//index.js
//获取应用实例
var app = getApp()
//var sta = require("../../utils/statistics.js");
Page({
  data: {
    indicatorDots: false,//是否显示面板指示点
    autoplay: false,  //是否自动切换
    current:0,      //当前所在index
    interval: 0, //自动切换时间
    duration: 200,  //滑动时间
    clas:["action"]
  },
  onLoad:function(){

      var scene=wx.getLaunchOptionsSync();
      console.log(scene);
    
      var that = this;
      app.getUserInfo(function(userInfo){
          that.setData({userInfo:userInfo});
          that.getGoodsType();
      })

      // http.httpGet("product/getproductbytype",{
      //   appid: config.APPID, typeId: 9
      // },function (res){
      //   console.log("banner");
      //   console.log(res);
      //     that.setData({
      //       banner:res.data
      //     });
      // });
        //获取商品列表
      that.getGoodsList(9,function(list){
          that.setData({
            IndexList:list
          });
      });
  },
  onShow:function(){
        //sta();
        app.getAppInfo(
          function (appInfo){
                wx.setNavigationBarTitle({
                  title: appInfo.title
                })
            }
        );
        
  },
  //顶部分类栏
  getGoodsType:function(){
        var that = this;
       var data = {appid:config.APPID,userid:this.data.userInfo.id}
        var data = {name:'',sortedColumn:'liked desc'}
    http.httpGet("wedding/wedding/caselist" ,data,function(res){    // product/getproducttype
      if (res.statusCode == '200'){
              var list = res.data;
              var goodsData = new Array()
              for(var i = 0;i<list.length;i++){
                  goodsData[i]= {type:list[i].id,description:list[i].description,image_url:list[i].image_url,liked:list[i].liked,name:list[i].name,price:list[i].price,tags:list[i].tags,view:list[i].view};
              }
              that.setData({goodsData:goodsData});
             //var goodsData =
             // that.loadTabGoodsList(0);
                
            }
        });
  },
  getGoodsList:function(type,callback){
        var that = this;
        var data = {appid:config.APPID,typeId:type}
        
    http.httpGet("product/getproductbytype" ,data,function(res){
      console.log("goodlist");
      console.log(res);
      if (res.statusCode == '200' ){
                    var list = res.data;
                    typeof callback == "function" && callback(list)
                }
        });
  },
  loadTabGoodsList:function(index){
        var that = this;
        var goodsData = that.data.goodsData;
        if(goodsData[index].banner == undefined || goodsData[index].list ==undefined){
              var type = goodsData[index].type; 
              //获取推荐商品
              this.getGoodsList(type,function(list){
                    var goods = that.data.goodsData;
                    goods[index].banner = list;
                    that.setData({goodsData:goods});
              })
               //获取商品列表
              this.getGoodsList(type,function(list){
                    var goods = that.data.goodsData;
                    goods[index].list = list;
                    that.setData({goodsData:goods});
              })
        }
        
  },
  //事件处理函数
  switchs: function(e) {
    var index = e.detail.current;
    this.loadTabGoodsList(index);
    this.setData({clas:[]});

    var data = [];
    data[index] = "action";
    this.setData({clas:data });
  },
  xun:function (e){
      var index = e.target.dataset.index;
      this.setData({current:index });
      this.loadTabGoodsList(index);
  },
  todetail:function(e){
        var id = e.currentTarget.id;
        wx.navigateTo({
          url: '../detail/index?id='+id,
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  },
  //处理分页
  bindlower:function(e){
    console.log(e)
  }
  
})
