// pages/student/homeworkDet/homeworkDet.js
Page({




  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['案例', '团队'],

    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    bnrUrl: [
      {"url": "http://tt.tccsq.com/images/bg5.jpg"},
      { "url": "http://tt.tccsq.com/images/bg7.jpg"},
      { "url": "http://tt.tccsq.com/images/bg5.jpg" },
      { "url": "http://tt.tccsq.com/images/title.jpg" },
      { "url": "http://tt.tccsq.com/images/title2.jpg" },
      { "url": "http://tt.tccsq.com/images/bg5.jpg" },
      { "url": "http://tt.tccsq.com/images/title2.jpg" },
      { "url": "http://tt.tccsq.com/images/title.jpg" },
      { "url": "http://tt.tccsq.com/images/bg7.jpg" },
    ],
    bnrUrl2: [
      { "url": "http://tt.tccsq.com/images/bg5.jpg" },
      { "url": "http://tt.tccsq.com/images/bg7.jpg" },
      { "url": "http://tt.tccsq.com/images/bg5.jpg" },
      { "url": "http://tt.tccsq.com/images/title.jpg" },
      { "url": "http://tt.tccsq.com/images/title2.jpg" },
      { "url": "http://tt.tccsq.com/images/bg5.jpg" },
    ],
    picstyle:'',
    plview:false,
    zan: 'icon-shoucang1',
    zan2: 'icon-shoucang1',
    zancount:'60',
    conversBtn:true,
    emojibox:false,
    jpbtn:0,
    emojiChar: "[咧嘴笑]-[生气]-[笑歪了]-[笑哭了]-[微笑]-[调皮]-[捂嘴]-[紧抱]-[鄙视]-[白眼]-[鬼脸]-[皱眉]-[如稀重负脸]-[大声哭泣]-[恐惧尖叫]-[汗流满面]-[脸红]-[痛苦]-[可怕]-[焦头烂额]-[红心]-[心碎]-[拍手]-[保佑]-[握手]-[魔鬼]-[幽灵]-[庆祝1]-[庆祝2]-[皇冠]",
    emoji: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    content:''
  },
  // 顶部tab
  tabClick: function (e) {
    var that = this;
    console.log("activeIndex====" + e.currentTarget.id);

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });
  },


  //点击表情显示表情盒子
  emojiShowHide: function () {
    this.setData({
      emojibox: true,
      conversBtn: false,
      jpbtn:1
    })
  },
  //点击j键盘隐藏表情盒子
  jpShowHide: function () {
    this.setData({
      emojibox: false,
      conversBtn: true,
      jpbtn: 0
    })
  },
  // 选中表情
  emojiChoose: function (e) {
    var that=this
    var index = e.target.dataset.id
    var emojiArr = that.data.emojiChar.split('-')
    
    that.setData({
      content: that.data.content + emojiArr[index]
    })
    // console.log(that.data.content)
  },
  //用户输入内容
  getontentValue: function (e) {
    this.setData({
      content: e.detail.value,
     
    })
    console.log(this.data.content)
  },
  // 输入时关闭表情盒
  getemojiboxstate: function (e) {
    this.setData({
      emojibox: false,
      jpbtn: 0

    })
  },
  setpicstyle: function () {
    var that=this
    // console.log(that.data.bnrUrl.length)
    if (that.data.bnrUrl.length <= '9'){
      that.setData({
        picstyle: 'pic',
      });
    } if (that.data.bnrUrl.length <= '4') {
      that.setData({
        picstyle: 'pic2',
      });
    } if (that.data.bnrUrl.length <= '1') {
      that.setData({
        picstyle: 'pic3',
      });
    }
   
  },
  openplview: function () {
    var that = this
    that.setData({
      plview: true,
    });
  },
  closeplview: function () {
    var that = this
    that.setData({
      plview: false,
    });
  },
  dianzan2: function () {
    var that = this
    if (that.data.zan2 == 'icon-shoucang1') {
      var zancount = parseInt(that.data.zancount) +1
      that.setData({
        zan2: 'icon-shoucang2',
        zancount: zancount
      });
     
    } else {
      var zancount = parseInt(that.data.zancount) - 1
      that.setData({
        zan2: 'icon-shoucang1',
        zancount: zancount
      });
      
    }

  },
  dianzan: function () {
    var that = this
    if (that.data.zan =='icon-shoucang1'){
      that.setData({
        zan: 'icon-shoucang2',
      });
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        image: '../../../images/icon-success.png',
        duration: 2000
      })
    }else{
      that.setData({
        zan: 'icon-shoucang1',
      });
      wx.showToast({
        title: '取消点赞',
        image:'../../../images/icon-warn.png',
        icon: 'success',
        duration: 2000
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setpicstyle();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})