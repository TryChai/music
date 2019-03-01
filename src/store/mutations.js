import * as types from'./mutations-types'; 
const mutations = {
 	[types.SET_SINGER](state,singer){
 		state.singer = singer
 	},
 	[types.SET_FULL_PLAY](state,sw){
 		state.fullPlay = sw
 	},
 	[types.SET_MINI_PLAY](state,sw){
 		state.miniPlay = sw
 	},
 	[types.SET_CURRENT_INDEX](state,index){
 		state.currentIndex = index
 	},
 	[types.SET_SEQUENCE_LIST](state,list){
 		state.sequenceList = list
 	},
 	[types.SET_PLAYLIST](state,list){
 		state.playList = list
 	},
 	[types.SET_CURRENTSONG](state,index){
 		state.currentSong = state.playList[index]
 	},
 }
 export default mutations