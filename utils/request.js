
//data默认是一个对象 ； 因为method默认是post 要是传入post的话第三个参数就不用写了 比较简便  如果是get请求就需要写第三个参数
//为什么a是undefined呢？ 代表a没有拿到数据
import config from './config'
export default(url,data={},method="GET")=>{
 return new Promise((resolve,reject)=>{
  wx.request({
    url:config.host+url,
    method:method,
    data:data,
    header:{
      cookie:wx.getStorageSync('cookies')?(wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U=6')!==-1)):''
    },
    success:function(e){
      if(data.isLogin){
        wx.setStorage({
          data: e.cookies,
          key: 'cookies'
        })
      }
      resolve(e.data)
    },
    fail:function(e){
      reject(e)
    }
  })
 })

}