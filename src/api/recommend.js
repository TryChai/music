//引入jsonp
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getRecommend(){
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	const data = Object.assign({},commonParams,{
		platform:'h5',
		uin:0,
		needNewCode:1
	})
	return jsonp(url,data,options)
}

export function getDiscList(){
	const url ='/api/getDiscList'
	const data = Object.assign({},commonParams,{
		platform:'yqq',
		hostUin:0,
		sin:0,
		ein:29,
		sortId:5,
		needNewCode:0,
		categoryId:10000000,
		rnd:Math.random(),
		format:'json'
	})
	return axios.get(url,{
		params:data
	}).then(res=>{
		return Promise.resolve(res.data)
	})
}

export function getDiscSong(disstid){
	const url = 'api/getDiscSong'
	const data = Object.assign({},commonParams,{
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		new_format: 1,
		disstid: disstid,
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		format: 'json',
		inCharset: 'utf8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'yqq.json',
		needNewCode: 0,
	})
	return axios.get(url,{
		params:data
	}).then(res=>{
		return Promise.resolve(res.data)
	})
}