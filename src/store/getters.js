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
