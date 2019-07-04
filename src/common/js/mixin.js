import {mapGetters,mapMutations,mapActions} from 'vuex'
import randomList from 'common/js/until'


export const playlistMixin = {
	computed:{
		...mapGetters([
			'playList'
		])
	},
	mounted(){
		this.handlePlaylist(this.playList)
	},
	activated(){
		this.handlePlaylist(this.playList)
	},
	watch:{
		playList(newVal){
			this.handlePlaylist(newVal)
		}
	},
	methods:{
		handlePlaylist(){
			throw new Error('component must implement handlePlaylist method')
		}
	}
}

export const playmodeMixin = {
	computed: {
		iconMode(){
			return this.mode == 0 ?'icon-sequence':this.mode==1?'icon-loop':'icon-random'
		},
		...mapGetters([
			'mode',
			'sequenceList'
		]),
	},
	methods: {
		changeMode(){
			const mode = (this.mode + 1)%3
			this.setMode(mode)
			let list = null
			const sequencelist = this.sequenceList
			if(this.mode === 2){
				list = randomList(this.sequenceList)
			}else{
				list = sequencelist
			}
			this.resetCurrentIndex(list)
			this.setPlaylist(list)
		},
		resetCurrentIndex(list){
			let index = list.findIndex((item)=>{
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		...mapMutations({
			setFullPlay:'SET_FULL_PLAY',
			setMiniPlay:'SET_MINI_PLAY',
			setPlayState:'SET_PLAY_STATE',
			setCurrentIndex:'SET_CURRENT_INDEX',
			setMode:'SET_PLAY_MODE',
			setPlaylist:'SET_PLAYLIST'
		}),
	},
	
}

export const searchMixin = {
	data(){
		return {
			query:'',
			refreshDelay:120
		}
	},
	methods: {
		clear(){
			this.$refs.suggest.clear();
		  },
		  getQuery(query){
			this.query = query
		  },
		  saveSearch(){
			this.inserHistory(this.query)
		  },
		  listScroll(){
			this.$refs.searchbox.blur();
		  },
		  ...mapActions(['inserHistory','deleteOneHistory'])
	},
}

export const likeMixin = {
	computed:{
		...mapGetters([
			'likeList'
		])
	},
	methods: {
		toggleLike(song){
			if(this.isLike(song)){
				this.deleteLikeList(song)
			}else{
				this.inserLikeList(song)
			}
		},
		getLike(song){
			if(this.isLike(song)){
				return 'icon-active icon-favorite'
			}
			return 'icon-not-favorite'
		},
		isLike(song){
			let index = this.likeList.findIndex(item=>{
				return item.id === song.id
			})
			return index > -1
		},
		...mapActions([
			'inserLikeList',
			'deleteLikeList'
		])
	},
}