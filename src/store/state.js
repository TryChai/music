import {loadSearch,loadPlay,loadLike} from 'common/js/cache'
const playMode ={
	sequence:0,
	loop:1,
	random:2
}
const state ={
	singer:[],
	sequenceList:[],
	playList:[],
	currentIndex:0,
	playState:false,
	fullPlay:false,
	miniPlay:false,
	currentSong:[],
	mode:playMode.sequence,
	singerli:false,
	disc:[],
	topList:[],
	searchHistory:loadSearch(),
	playHistory:loadPlay(),
	likeList:loadLike(),
}
export default state