'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const express = require('express')
const axios = require('axios')
const app = express()
var apiRoutes = express.Router()
app.use('/api',apiRoutes)

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app){

      app.get('/api/date',(req,res)=>{
        let date = new Date().getTime()
        res.json(date)
      })
      app.get('/api/getSteram',(req,res)=>{
        let {songmid,singerMid} = req.query
        var url = `https://i.y.qq.com/v8/playsong.html?songmid=${songmid}`
        axios.get(url,{
          headers:{
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-encoding":"gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "max-age=0",
            "cookie": "pgv_pvid=7564767300; ts_uid=3377360137; ts_uid=3377360137; pgv_pvi=2139269120; RK=xKxQTpoNZ5; ptcz=2c0890f5668ebe1cbe60c5c27c0bbbbe62ba3d15ab3e974494de48105f1689e8; ts_refer=localhost/; tvfe_boss_uuid=dbbf8295ecdae651; o_cookie=173560554; pgv_info=ssid=s9175463820; pgv_si=s6281262080; userAction=1; yq_playschange=0; yq_playdata=; player_exist=1; qqmusic_fromtag=66; yqq_stat=0; yplayer_open=1; yq_index=0; ts_refer=ADTAGnewyqq.singer; ts_last=i.y.qq.com/v8/playsong.html",
            "referer": `http://i.y.qq.com/n2/m/share/details/singer.html?ADTAG=newyqq.singer&source=ydetail&singerMid=${singerMid}`,
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1" ,
          }
        }).then(response=>{
          let data = response.data
          let frist = data.indexOf('<audio ') || ''
          let last = data.indexOf('</audio') || ''
          let str
          (frist&&last)&& (str = data.substr(frist,last-frist))
          let fristm = str.indexOf('src=') || ''
          let lastm = str.indexOf('autoplay') || ''
          var stream
          (fristm&&lastm)&& (stream = str.substr(fristm+5,lastm-fristm-7))
          if(stream){
            res.json(stream)
          }else{
            res.json('null')
          }
        }).catch(e=>console.log(e))
      })
      app.get('/api/getDiscList',(req,res)=>{
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url,{
          headers:{
            referer:`https://c.y.qq.com`,
            host:'c.y.qq.com'
          },
          params:req.query
        }).then((response)=>{
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
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    disableHostCheck:false,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
