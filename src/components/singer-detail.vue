<template>
	<transition name="slide">
		<music-list :song="song" :title='title' :bgImage="bgImage"></music-list>
	</transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail}	from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import musicList from 'components/music-list'
  export default {
  	data(){
  		return {
  			song:[]
  		}
  	},
	computed:{
		title(){
			return this.singer.name
		},
		bgImage(){
			return this.singer.avatar
		},
		...mapGetters([
			'singer'
		])
	},
	components:{
		musicList
	},
	created(){
		this._getDetail()
		// console.log(this.singer)
	},
	methods:{
		_getDetail(){
			let that = this;
			if(!this.singer.id){
				this.$router.push('/singer');
				return 
			}
			getSingerDetail(this.singer.id).then(res=>{
				if(res.code == ERR_OK){
					that.song = that._normalizeSonge(res.data.list)
					console.log(that.song)
				}
			})
		},
		_normalizeSonge(song){
			let ret = []
			if(!song){
				return 
			}
			song.forEach((item)=>{
				if(item.musicData.songid && item.musicData.albummid){
					createSong(item.musicData).then((res)=>{
						if(res){
							ret.push(res)
						}
					})
				}
				
			})
			return ret
		},
	}
  }
</script>

<style>
	
	.slide-enter-active,.slide-leave-active{
		transition:all .3s ;
	}
	.slide-enter,.slide-leave-to{
		transform:translate3d(100%,0,0);
	}
</style>