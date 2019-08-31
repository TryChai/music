<template>
	<transition name='slide'>
		<music-list :title="title" :bgImage="bgImage" :song="songs"></music-list>
	</transition>
</template>

<script>
import MusicList from 'components/music-list.vue'
import {mapGetters} from 'vuex'
import {getDiscSong} from 'api/recommend'
import {getSong} from 'common/js/song'
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
			let that = this
			if(!this.disc.dissid){
				this.$router.push('/recommend')
				return
			}
			getSong('d',this.disc).then(res=>{
				that.songs = res
			})
		},
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