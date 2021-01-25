
// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },
  //获取用户输入的手机号和密码
  handleInput:function(e){
    // console.log(e);
    let type=e.currentTarget.id;
    let value=e.detail.value

    this.setData({
      [type]:value
    })
  },
  //验证手机号密码
  login:async function(){
    let{phone,password}=this.data //相当于let phone=this.data.phone ,     password同理
    //判断phone是否为空
    if(!phone){
      wx.showToast({
        title: '请输入手机号码',
        icon:'none'
      })
      return; //这个都没通过后面也没必要执行了
    }
    //接下来判断手机号合不合法  第一位1 第二位3-9 后9位任意
    let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon:'none'
      })
      return;
    }
    //接下来判断密码  这里只判断了是否为空
    if(!password){
      wx.showToast({
        title: '请输入密码',
        icon:'none'
      })
      return;
    }
    result=''
    let result= await request('/login/cellphone',{phone,password,isLogin:true})
    console.log(result);
    if(result.code===200){
      wx.showToast({
        title: '登录成功',
      })
    wx.switchTab({
      url: '/pages/personal/personal',
    })
    wx.setStorageSync('userinfo', JSON.stringify(result.profile))
    }else{
      wx.showToast({
        title: '输入错误 请重新输入',
        icon:'none'
      })
    }

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
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