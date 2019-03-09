const playMode ={
	sequence:0,
	loop:1,
	random:2
}
const state ={
	singer:{},
	sequenceList:{},
	playList:{},
	currentIndex:0,
	playState:false,
	fullPlay:false,
	miniPlay:false,
	currentSong:{},
	mode:playMode.sequence,
}
export default state