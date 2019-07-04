import *as types from './mutations-types'
import randomList from 'common/js/until'
import {saveHistory,deleteOne,deleteHistory,inSerplayHistory,inserLike,deleteLike} from 'common/js/cache'

function findIndex(arr,song){
	let _arr = arr
	return _arr.findIndex((item)=>{
		return item.id === song.id
	})
}
export const selectPlay = function({commit,state},{list,index}){
	commit(types.SET_SEQUENCE_LIST,list)
	if(state.mode == 2){
		let randomlist = randomList(list)
		let _index = findIndex(randomlist,list[index])
		commit(types.SET_CURRENT_INDEX,_index)
		commit(types.SET_PLAYLIST,randomlist)
		commit(types.SET_CURRENTSONG,_index)
	}else{
		commit(types.SET_PLAYLIST,list)
		commit(types.SET_CURRENT_INDEX,index)
		commit(types.SET_CURRENTSONG,index)
	}
	commit(types.SET_FULL_PLAY,true)
	commit(types.SET_PLAY_STATE,true)
	commit(types.SET_SINGER_LI,true)
}

export const inserSong =function({commit,state},song){
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	let currentSong = playList[currentIndex]
	let mode = state.mode
	//查找之前的列表是否有那首歌
	let fpIndex = findIndex(playList,song)
	if(fpIndex === currentIndex){
		return
	}
	if(playList.length >0){
		currentIndex++
	}

	//将点的那首歌放入列表
	playList.splice(currentIndex,0,song)
	//判断是否之前就有那首歌 然后 把之前那首歌给删除
	if(fpIndex>-1){
		if(currentIndex < fpIndex){
			playList.splice(fpIndex+1,1)
		}else{
			playList.splice(fpIndex,1)
			currentIndex--
			// console.log('currentIndex +'+currentIndex+' fpIndex+'+findIndex(playList,song))
		}
	}
	if(mode == 2){
		let fsIndex = findIndex(sequenceList,song)
		let currentSIndex = findIndex(sequenceList,currentSong)
		sequenceList.splice(currentSIndex,0,song)
		if(fsIndex>-1){
			if(currentSIndex <fsIndex){
				sequenceList.splice(fsIndex+1,1)
			}else{
				sequenceList.splice(fsIndex,1)
			}
		}
	}else{
		sequenceList = playList.slice()
		
	}
	commit(types.SET_PLAYLIST,playList)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	commit(types.SET_FULL_PLAY,true)
	commit(types.SET_PLAY_STATE,true)
	commit(types.SET_SINGER_LI,true)
}

export const randomPlay = function({commit},{list}){
	commit(types.SET_SEQUENCE_LIST,list)
	let randomlist = randomList(list)
	commit(types.SET_PLAYLIST,randomlist)
	commit(types.SET_PLAY_MODE,2)
	commit(types.SET_CURRENTSONG,0)
	commit(types.SET_FULL_PLAY,true)
	commit(types.SET_PLAY_STATE,true)
}

//用来设置 历史记录的
export const inserHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTOEY,saveHistory(query))
}

//用来删除本地数据的
export const deleteOneHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTOEY,deleteOne(query))
}
//用来删除所有本地数据的
export const deleteAllHistory = function({commit}){
	commit(types.SET_SEARCH_HISTOEY,deleteHistory())
}

//用来删除一条播放列表的数据
export const deleteOneSong = function({commit,state},song){
	let playList = state.playList.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex
	let fpIndex = playList.findIndex((item)=>{return item.id === song.id})
	let fsIndex = sequenceList.findIndex((item)=>{return item.id === song.id})

	//删除那条歌曲的信息
	playList.splice(fpIndex,1)
	sequenceList.splice(fsIndex,1)

	if(currentIndex>fpIndex || currentIndex == playList.length){
		currentIndex--
	}
	commit(types.SET_PLAYLIST,playList)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	if(!playList.length){
		currentIndex = 0
		commit(types.SET_PLAY_STATE,false)
		commit(types.SET_MINI_PLAY,false)
	}else{
		commit(types.SET_PLAY_STATE,true)
	}
	commit(types.SET_CURRENT_INDEX,currentIndex)
}

//下一首播放 将播放列表顺序重新排
export const nextPlay = function({commit,state},song){
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex

	let fpIndex = playList.findIndex((item)=>{return item.id === song.id})
	let fsIndex = sequenceList.findIndex((item)=>{return item.id === song.id})

	if(fpIndex>-1){
		if(currentIndex > fpIndex){
			playList.splice(fpIndex,1)
			currentIndex--
		}else{
			playList.splice(fpIndex,1)
		}
	}
	sequenceList.splice(fsIndex,1)

	playList.splice(currentIndex+1,0,song)
	sequenceList.splice(currentIndex+1,0,song)

	commit(types.SET_PLAYLIST,playList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_PLAY_STATE,true)

}

export const emptySonglist = function({commit}){
	commit(types.SET_PLAYLIST,[])
	commit(types.SET_SEQUENCE_LIST,[])
	commit(types.SET_CURRENT_INDEX,-1)
	commit(types.SET_MINI_PLAY,false)
}

export const inserPlayHistory = function({commit},song){
	commit(types.SET_PLAY_HISTORY,inSerplayHistory(song))
}

export const inserLikeList = function({commit},song){
	commit(types.SET_LIKE_LIST,inserLike(song))
}
export const deleteLikeList = function ({commit},song){
	commit(types.SET_LIKE_LIST,deleteLike(song))
}