// pages/search/search.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'' , //placeholder内容
    hotList:[]     ,//热搜榜数据
    searchContent:'' ,//用户输入的字符串
    searchList:[],  //搜索到的模糊数据
    historyList:[]  //历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()         //初始化数据  
    this.getSearchHistoryStorage()  //取出缓存数据（搜索历史）
  },
  //初始化内容
  async getInitData(){
    let placeholderData = await request('/search/default'); //搜索框
    let hotListData=await request("/search/hot/detail")   //热歌榜数据
    this.setData({
      placeholder:placeholderData.data.realkeyword,
      hotList:hotListData.data
    })
  },
  //获取本地历史记录
  getSearchHistoryStorage(){
    let historyList=wx.getStorageSync('searchHistory')
    if(historyList){
      this.setData({
        historyList
      })
    }
  },
  //监听input输入
   issend:false,  //节流用
   handleInputChange(event){
    console.log(event.detail.value);
    this.setData({
      searchContent:event.detail.value.trim()
    })
    if(this.issend){
      return; 
    }
    this.searchList()
    this.issend=true
    setTimeout(async() => {
      this.issend=false
    }, 300);
  },
  //请求搜索的数据
  async searchList(){
    if(!this.data.searchContent){
      this.setData({
        searchList:[]
      })
      return;
    }
    let searchListData=await request('/search',{keywords:this.data.searchContent,limit:10})
    this.setData({
      searchList:searchListData.result.songs
    })
    //将搜索的关键字放到历史记录里面
    let{searchContent,historyList}=this.data
    if(historyList.indexOf(searchContent) !== -1){ //以前存在
       //以前存在就删掉对应的下标对应的信息并添加信息到第一个
      historyList.splice(historyList.indexOf(searchContent),1)
      historyList.unshift(searchContent)
    }else{    //以前不存在
      historyList.unshift(searchContent)
    }
    wx.setStorageSync('searchHistory', historyList)
    this.getSearchHistoryStorage()
  },
  //清空搜索内容（那个x号）
  clearSearchContent(){
    this.setData({
      searchContent:'',
      searchList:[]       //搜索数组置空
    })
  },
  //删除搜索历史记录
  deleteSearchHistory(){
    let that=this
    wx.showModal({
      content: '你确定要删除吗',
      success (res) {
        if (res.confirm) {
          // 清空数组
          that.setData({
            historyList:[]
          })
          // 清除缓存
          wx.removeStorageSync('searchHistory')
        }
      }
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