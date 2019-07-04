import jsonp from './jsonp'
import {getLyric} from 'api/song'
import {Base64} from 'js-base64'
export default class Song{
	constructor({id,mid,singer,name,album,duration,image,url}){
		this.id = id
		this.mid = mid
		this.singer = singer
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

// 获取歌曲的vkey
export function getSongVkey(songmid) {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
    const data = Object.assign({}, {
        callback: 'musicJsonCallback',
        loginUin: 3051522991,
        format: 'jsonp',
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 3051522991,
        guid: 5931742855,
        songmid: songmid,
        filename: `C400${songmid}.m4a`
    })
 
    return jsonp(url, data)
}
/*
 ** 实例歌曲的数组
  将歌曲的数组转化成对象

*/
 export function createSong(musicData){
 	return getSongVkey(musicData.songmid).then(res=>{
		 if(res){
			 if(res.code === 0 && res.data.items[0].vkey !== ''){
			 	return new Song({
			 		id:musicData.songid,
			 		mid:musicData.songmid,
			 		singer:filterSinger(musicData.singer),
			 		name:musicData.songname,
			 		album:musicData.albumname || '',
			 		duration:musicData.interval,
			 		image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
			 		url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${res.data.items[0].vkey}`
			 	})
	 		}
 		}
 	})
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
