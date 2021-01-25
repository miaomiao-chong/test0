var PubSub = require('pubsub-js');
// pages/songDetail/songDetail.js
import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp()
Page({
  data: {
    isPlay: false, //标识是否在播放
    song: { //渲染页面用的
      title: '',
      singer: '',
      coverImg: ''
    },
    musicId: '', //音乐的id
    musicPlay: { //播放音乐用的
      musicTitle: '',
      musicUrl: ''
    },
    sliderDetail:{
      duration:'',
      currentTime:'',
      percent:''
    }
  },
  music: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接收路由跳转的query参数
    // console.log(options.musicId);
    let musicId = options.musicId
    this.setData({
      musicId
    })
    // 判断之前的音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == musicId) {
      // 修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }
    this.getMusicInfo(musicId) //
    this.getMusicDetail(musicId) //这两个是用来获取song和musicPlay里面的东西的
    // 订阅来自推荐页面的音乐id  因为自动切换到下一曲也要用到订阅 那个只是局限于点击以后的
    PubSub.subscribe('musicId',(msg,musicId)=>{
      this.setData({
        musicId
      })
        this.getMusicInfo(musicId) //
        this.getMusicDetail(musicId)
       PubSub.unsubscribe('musicId')
    })
  },
  //获取音乐详情功能函数
  async getMusicInfo(id) {
    let songData = await request('/song/detail', {
      ids: id
    })
    this.setData({
      'song.singer': songData.songs[0].ar[0].name,
      'song.title': songData.songs[0].name,
      'song.coverImg': songData.songs[0].al.picUrl,
      'musicPlay.musicTitle': songData.songs[0].name
    })
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  // 点击播放或暂停
  handleMusicPlay() {
    if (this.data.isPlay == true) {
      this.setData({
        isPlay: false
      })
      this.musicPlay()
      console.log('handleMusic里面执行musicPlay 状态改为false');
    } else {
      this.setData({
        isPlay: true
      })
      this.musicPlay()
      console.log('handleMusic里面执行musicPlay 状态改为true');
    }
  },
  //获取音乐src
  async getMusicDetail(musicId) {
    //获取链接
    let link = await request('/song/url', {
      id: musicId
    })
    this.setData({
      'musicPlay.musicUrl': link.data[0].url
    })
    console.log("获取了一次地址");
      this.musicPlay()
  },
  // 音乐播放功能
  musicPlay: function () {
    this.music = wx.getBackgroundAudioManager(),
      //监听播放暂停停止
      this.music.onPlay(() => {
        // console.log('播放');
        this.changePlayState(true)
        //全局
        appInstance.globalData.musicId = this.data.musicId
        console.log("musicPlay里面音乐播放");
        
      }),
      this.music.onPause(() => {
        // console.log('暂停');})
        this.changePlayState(false)
        console.log("musicPlay里面音乐暂停");
      })
    this.music.onStop(() => {
      this.changePlayState(false)
      console.log("musicPlay里面音乐停止");
      
    })
    this.music.onTimeUpdate(()=>{
      this.setData({
        'sliderDetail.duration':this.formatTime(this.music.duration),
        'sliderDetail.currentTime':this.formatTime(this.music.currentTime),
        'sliderDetail.percent':this.music.currentTime/this.music.duration*100,
        duration:this.music.duration
      })
     this.music.onEnded(()=>{
      console.log("播放完了");
      PubSub.publish('switchType','next');

     })
    
    })
    this.music.src = this.data.musicPlay.musicUrl
    this.music.title = this.data.musicPlay.musicTitle
    if(this.data.isPlay){
      this.music.play()
    }else{
      this.music.pause()
    }
    //slider
   
  },
  // 修改播放状态
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    // 全局状态
    appInstance.globalData.isMusicPlay = isPlay
  },
  handleChange(event) {
    // this.changePlayState(false)
    let type = event.currentTarget.id
    console.log("点击了"+type);
    this.music.stop()
    // 订阅来自推荐页面的音乐id  （放在onload里面了）
    // 发送消息给推荐页面    
    PubSub.publish('switchType',type);
  },
  sliderChange:function(e){
    // this.music.pause()
    console.log(e.detail.value);
    this.music.seek(e.detail.value*this.data.duration/100)
  },
   formatTime:function(time){
    var minute=Math.floor(time/60)%60
    var second=Math.floor(time)%60
    return ((minute>10?minute:'0'+minute)+":"+(second>10?second:'0'+second))
  }

})