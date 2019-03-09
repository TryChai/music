//引入jsonp
import { commonParams} from './config'
import axios from 'axios'

export function getLyric(songid){
	const url ='/api/getLyric'
	const data = Object.assign({},commonParams,{
		platform:'yqq',
		pcachetime:+new Date(),
		hostUin:0,
		needNewCode:0,
		format:'json',
		songmid:songid,
		g_tk:5381
	})
	return axios.get(url,{
		params:data
	}).then(res=>{
		return Promise.resolve(res.data)
	})
}