import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'

export function getHotKey(){
	const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

	const data = Object.assign({},commonParams,{
		platform:'h5',
		needNewCode:1
	})
	return jsonp(url,data,options)
}
/*
	这个是搜索歌曲，歌星的接口
	这里有三个参数
	w   --keyword 关键字 需要查找的文字
	p   --page  页码 滚动加载的时候需要使用的
	c   --catZhida  是否需要歌手信息
*/
export function search(w,p,c,perpage){
	const url = '/api/search'
	const data = Object.assign({},commonParams,{
		platform: 'h5',
		needNewCode: 1,
		w: w ,
		zhidaqu: 1,
		catZhida: c?1:0,
		t: 0,
		flag: 1,
		ie: 'utf-8',
		sem: 1,
		aggr: 0,
		perpage: perpage,
		n: perpage,
		p: p,
		remoteplace: 'txt.mqq.all'
	})
	return axios.get(url,{
		params:data
	}).then(res=>{
		return Promise.resolve(res.data)
	})
}