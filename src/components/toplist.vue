<template>
	<transition name='slide'>
		<music-list :title="title" :bgImage="bgImage" :song="songs" :rank="rank"></music-list>
	</transition>
</template>

<script>
import musicList from 'components/music-list.vue'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {getSong} from 'common/js/song'
export default{
	name:'toplist',
	data(){
		return {
			songs:[],
			rank:true,
		}
	},
	created(){
		this._getMusicList();
	},
	methods:{
		_getMusicList(){
			let that = this
			if(!this.topList.id){
				this.$router.push({path:'/rank'})
				return 
			}
			getSong('r',this.topList).then(res=>{
				that.songs = res
			})
		},
	},
	computed:{
		title(){
			return this.topList.topTitle
		},
		bgImage(){
			if(this.songs.length){
				return this.songs[0].image
			}
			return ''
		},
		...mapGetters(['topList'])
	},
	components:{
		musicList
	}
}
</script>

<style scope lang="stylus" rel=stylesheet/stylus>
	.slide-enter-active,.slide-leave-active
		transition:all .3s
	.slide-enter,.slide-leave-to
		transfrom : translate3d(0,100%,0)

</style>