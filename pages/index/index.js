import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[] ,       //轮播图数据
    recommendList:[],     //推荐歌曲数据
    topList:[]             //排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.request({
    //   url: 'http://localhost:3000/banner',
    //   //参数
    //   data:{type:2},
    //   success:function(e){
    //     console.log(e);
    //   }
    // })
   var bannerListData=await request('/banner',{type:2}) 
   this.setData({
    bannerList:bannerListData.banners
   }) 
   var recommendListData=await request('/personalized',{limit:20})
   console.log(recommendListData);
   this.setData({
    recommendList:recommendListData.result
   })
    
   let index = 0;
   let resultArr = [];
   while (index < 5){
     let topListData = await request('/top/list', {idx: index++});
     // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
     let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3)};
     resultArr.push(topListItem);
     // 不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
     this.setData({
       topList: resultArr
     })
   }    //  // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
    //  for(let i=0;i<5;i++){
    //   let topListItem = {name: topListData[i].playlist.name, tracks: topListData[i].playlist.tracks.slice(0, 3)};
    //   resultArr.push(topListItem);
    //  }
    
    //  // 不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
    //  this.setData({
    //    topList: resultArr
    //  })

     
   },
   gotoList:function(){
     wx.navigateTo({
       url: '/pages/recommendSong/recommendSong',
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