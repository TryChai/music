<template>
	<transition name='slide'>
		<music-list :title="title" :bgImage="bgImage" :song="songs"></music-list>
	</transition>
</template>

<script>
import MusicList from 'components/music-list.vue'
import {mapGetters} from 'vuex'
import {getDiscSong} from 'api/recommend'
import {createSong} from 'common/js/song'
export default{
	data(){
		return {

		}
	},
	created(){
		this._getDiscSong();
	},
	data(){
		return {
			songs:[]
		}
	},
	methods:{
		_getDiscSong(){
			if(!this.disc.dissid){
				this.$router.push('/recommend')
				return
			}
			getDiscSong(this.disc.dissid).then(res=>{
				let datalist = res.cdlist[0].songlist
				let songlist = datalist.map(item=>{
					return {songid:item.id,songmid:item.mid,singer:item.singer,songname:item.name,albumname:item.album.name,itterval:item.interval,albummid:item.album.id,albummid:item.album.mid}
				})
				this.songs = this._nomalizeSong(songlist)
			})
		},
		_nomalizeSong(list){
			let ret = []
			if(!list) retutn 
			list.forEach(musicData =>{
				if(musicData.songid && musicData.albummid){
					createSong(musicData).then((res)=>{
						if(res){
							ret.push(res)
						}
					})
				}
			})
			return ret
		}
	},
	computed:{
		title(){
			return this.disc.dissname
		},
		bgImage(){
			return this.disc.imgurl
		},
		...mapGetters(['disc'])

	},
	components:{
		MusicList
	}
}

</script>

<style scope lang="stylus" rel=stylesheet/stylus>
	.slide-enter-active,.slide-leave-active
		transition:all .3s
	.slide-enter,.slide-leave-to
		transform:translate3d(100%,0,0)
</style>