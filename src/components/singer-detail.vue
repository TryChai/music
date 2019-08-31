<template>
	<transition name="slide">
		<keep-alive include="song">
			<music-list :song="song" :title='title' :bgImage="bgImage"></music-list>
		</keep-alive>
	</transition>
</template>

<script>
  import {mapGetters} from 'vuex'
//   import {getSingerDetail}	from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {getSong} from 'common/js/song'
  import musicList from 'components/music-list'
  import axios from 'axios'
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
	},
	methods:{
		_getDetail(){
			let that = this;
			if(!this.singer.id){
				this.$router.push('/singer');
				return 
			}
			getSong('s',this.singer).then(res=>{
				that.song = res
			})
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