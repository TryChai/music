import *as types from './mutations-types'
import randomList from 'common/js/until'

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