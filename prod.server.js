var express = require('express')

var config = require('./config/index')

const axios = require('axios')
const app = express()

app.get('/api/getDiscList',(req,res)=>{
    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url,{
      headers:{
        referer:`https://c.y.qq.com`,
        host:'c.y.qq.com'
      },
      params:req.query
    }).then((response)=>{
      // console.log(req.headers)
      // console.log(response.data)
      res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
  })
  app.get('/api/getDiscSong',(req,res)=>{
    let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    axios.get(url,{
      headers:{
        referer:`https://y.qq.com/n/yqq/playsquare/${req.query.disstid}.html`,
        host:'c.y.qq.com'
      },
      params:req.query
    }).then(resp=>{
      console.log(req.query)
      res.json(resp.data)
    }).catch(e=>{console.log(e)})
  })
  //获取搜索的内容
  app.get('/api/search',(req,res)=>{
    let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    axios.get(url,{
      headers:{
        referer:`https://y.qq.com/m/index.html`,
        host:'c.y.qq.com'
      },
      params:req.query
    }).then(resp=>{
      console.log(resp)
      res.json(resp.data)
    }).catch(e=>{console.log(e)})
  })
  //获取歌词
  app.get('/api/getLyric',(req,res)=>{
    var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    axios.get(url,{
      headers:{
        referer:'https://c.y.qq.com/',
        host:'c.y.qq.com'
      },
      params:req.query
    }).then((response)=>{
      var ret = response.data
      if(typeof ret === 'string'){
        var reg = /^\w+\(({[^()+]})\)$/
        var matches = ret.match(reg)
        if(matches){
          ret = JSON.parse(matches[1])
        }
      }
      res.json(ret)
    }).catch((e)=>{
        console.log(e)
    })
  })

  app.use(express.static('./dist'))

  let port = process.env.PORT || config.build.port
  module.exports = app.listen(port,(error)=>{
    if(error){
        console.log(error)
        return
    }
    console.log('listening http://localhost:'+port)
  })