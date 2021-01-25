import request from '../../utils/request';
var PubSub = require('pubsub-js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'', //天
    month:'' , //月
    recommendList:[] , //推荐列表
    index:0       //初始化下标为0  标识点击音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userinfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:"none",
        // 跳转到登录页面
        success:()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //更新日期的状态
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    // 获取每日推荐的数据
    this.getRecommendlist()
    //订阅来自播放页面发布的消息
    PubSub.subscribe('switchType', (mag,data)=>{
      let{index,recommendList}=this.data
      if(data=='pre'){//上一首  
        index=index-1
      }else{             //下一首
        index=index+1
      }
      this.setData({
        index
      })
      let musicId=recommendList[index].id
      // console.log(musicId);
      //将musicId回传给播放页 
      PubSub.publish('musicId',musicId)
    });
  },
      // 获取每日推荐的数据
  async getRecommendlist(){
    let recommendListData=await request('/recommend/songs')
    console.log(recommendListData);
    
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
  //跳转到songDetail页面
  toSongDetail(event){
    let {index,song}=event.currentTarget.dataset
    this.setData({
      index
    })
    //路由跳转传参 支持query参数
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+song.id,
    })
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