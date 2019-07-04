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
 	[types.SET_PLAY_STATE](state,sw){
 		state.playState = sw
 	},
 	[types.SET_PLAY_MODE](state,n){
 		state.mode = n
 	},
 	[types.SET_SINGER_LI](state,b){
 		state.singerli = b
 	},
 	[types.SET_DISC](state,disc){
 		state.disc = disc
 	},
 	[types.SET_TOP_LIST](state,topList){
 		state.topList = topList
	 },
	 [types.SET_SEARCH_HISTOEY](state,history){
		 state.searchHistory = history
	 },
	 [types.SET_PLAY_HISTORY](state,history){
		 state.playHistory = history
	 },
	 [types.SET_LIKE_LIST](state,likelist){
		 state.likeList = likelist
	 }
 }
 export default mutations