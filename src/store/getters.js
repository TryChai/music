export const singer = state=> state.singer
export const fullPlay = state=> state.fullPlay
export const miniPlay = state=> state.miniPlay
export const currentIndex = state=> state.currentIndex
export const sequenceList = state=> state.sequenceList
export const currentSong = state=>{
	return state.playList[state.currentIndex] || {}
} 
export const mode = state => state.mode
export const playList = state=> state.playList
export const playState = state=>state.playState
export const singerli = state=>state.singerli
export const disc = state=>state.disc
export const topList = state => state.topList
export const searchHistory = state=> state.searchHistory
export const playHistory = state=>state.playHistory
export const likeList = state=>state.likeList
