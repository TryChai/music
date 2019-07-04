//引入jsonp
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getToplist(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
	let data = Object.assign({},commonParams,{
		platform:'h5',
		needNewCode:1
	})
	return jsonp(url,data,options)
}

export function getMusicList(topid){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
	const data = Object.assign({},commonParams,{
		topid,
		page:'detail',
		type:'top',
		tpl:3,
		platform: 'h5',
		needNewCode: 1,
	})
	return jsonp(url,data,options)
}