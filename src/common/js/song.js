import jsonp from './jsonp'
import {getLyric} from 'api/song'
import {Base64} from 'js-base64'
import {getSingerDetail}	from '../../api/singer'
import {getMusicList} from '../../api/rank'
import {getDiscSong} from '../../api/recommend'
import axios from 'axios'
import * as cache from './cache'
const guid = 7564767300
const fromtag = 66
export default class Song{
	constructor({id,mid,singer,singerMid,name,album,duration,image,url}){
		this.id = id
		this.mid = mid
		this.singer = singer
		this.singerMid = singerMid
		this.name = name
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url
	}
    getlyric(){
    	if(this.lyric){
    		return Promise.resolve(this.lyric)
    	}
    	return new Promise((resolve,reject)=>{
			getLyric(this.mid).then(res=>{
				if(res.retcode === 0){
					this.lyric = Base64.decode(res.lyric)
					resolve(this.lyric)
				}else{
					reject('no lyric')
				}
			})

    	})
	}
}
//vkey的获取
/*
 ** 实例歌曲的数组
  将歌曲的数组转化成对象

*/
export async function getSong(o,singer){
	let name = o === 's'? singer.name : o === 'r'? 'Rank-'+singer.id : o === 'd' ? 'Disc-'+singer.dissid : 'name'
	let date = await axios.get('/api/date')
	if(date.status === 200 && date.data){
		date = date.data
	}
	//在缓存种取出歌曲
	let song = cache.getSong(name)
	let idate = parseInt(cache.getTime(name+'-time')) || 0
	if(song.length >0){
		if( parseInt(date) - parseInt(idate) > 259200){
			setTimeout(()=>{
				setSongcache(o,singer,date)
			},800)
		}
		song = song.map(item=>{
			return new Song(item)
		})
	}else{
		song = await setSongcache(o,singer,date)
	}
	return song
}
async function setSongcache(o,singer,date){
	let f = o === 's' ?  getSingerDetail: o === 'r' ? getMusicList : o === 'd' ? getDiscSong : null
	let p = o === 's' ?  singer.id : o === 'r' ? singer.id : o === 'd' ? singer.dissid : null
	let res = await f(p)
		if(res.code === 0){
			let d = o === 's' ? res.data.list :  o === 'r' ? res.songlist: o === 'd'? res.cdlist[0].songlist :null
			let fc = o === 's' ? _normalizeSonge : o === 'r'?_normalizeRank :o === 'd'? __normalizeDisc:null
			let name = o === 's'? singer.name : o === 'r'? 'Rank-'+singer.id : o === 'd' ? 'Disc-'+singer.dissid : 'name'
			if(d.length >0){
				let data = await fc(d,o,singer)
				cache.setTime(name+'-time',date)
				return cache.setSong(name,data)
			}
		}
}
export async function createSong(musicData){
		let result = await axios.get('/api/getSteram',{
			params:{
				songmid:musicData.songmid,
				singerMid:musicData.singer[0].mid
			}
		})
		if(result.status === 200 &&result.data != 'null'){
			var song = new Song({
				id:musicData.songid,
				mid:musicData.songmid,
				singer:filterSinger(musicData.singer),
				singerMid:musicData.singer[0].mid,
				name:musicData.songname,
				album:musicData.albumname || '',
				duration:musicData.interval,
				image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
				url:result.data
			})
			
		}
		return song
 }
 async function _normalizeSonge(song,o,singer){
	let ret = []
	if(!song){
		return 
	}
	 ret = await sliceSong(1,song,'musicData',ret,o,singer)
	return ret
}
async function sliceSong(n,item,musicData,ret,o,singer){
	let name = o === 's'? singer.name : o === 'r'? 'Rank-'+singer.id : o === 'd' ? 'Disc-'+singer.dissid : 'name'
	let arr = []
	for(var i = (n-1)*10;i<n*10;i++){
		if(i<=item.length &&item[i]){
			arr.push(createSong(item[i][musicData]))
		}
	}
	let res = await Promise.all(arr)
	res.map(item=>{
		item && ret.push(item)
	})
	if(ret.length <= 10){
		if(n<20&&(n)*10<item.length){
			sliceSong(n+1,item,musicData,ret,o,singer)
		}
	}else{
		let itemtime = setTimeout(()=>{
			if((n)*10>1800 && ret.length>150){
				clearTimeout(itemtime)
			}else{
				sliceSong(n+1,item,musicData,ret,o,singer)
			}
		},800)
	}
	// console.log(ret)
	cache.setSong(name,ret)
	return ret
}
 async function _normalizeRank(song,o,singer){
	let ret = []
	if(!song){
		return 
	}
	ret = await sliceSong(1,song,'data',ret,o,singer)
	return ret
}
 async function __normalizeDisc(song,o,singer){
	let ret = []
	if(!song){
		return 
	}
	let arr = []
	let songlist = song.map(item=>({data:{ songid:item.id,songmid:item.mid,singer:item.singer,songname:item.name,albumname:item.album.name,itterval:item.interval,albummid:item.album.id,albummid:item.album.mid}}
	))
	ret = await sliceSong(1,songlist,'data',ret,o,singer)
	return ret
}
 export function filterSinger(singer){
 	let ret = []
 	if(!singer){
 		return ''
 	}
 	singer.forEach((s)=>{
 		ret.push(s.name)
 	})
 	return ret.join(' ')
 }
