<template>
	<transition name="slide">
		<div class="singer-detail"></div>
	</transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail}	from 'api/singer'
  import {ERR_OK} from 'api/config'
  export default {
	computed:{
		...mapGetters([
			'singer'
		])
	},
	created(){
		this._getDetail()
		// console.log(this.singer)
	},
	methods:{
		_getDetail(){
			if(!this.singer.id){
				this.$router.push('/singer');
				return 
			}
			getSingerDetail(this.singer.id).then(res=>{
				if(res.code == ERR_OK){
					console.log(res.data.list)
				}
			})
		}
	}
  }
</script>

<style>
	.singer-detail{
		position: fixed;
		top: 0%;
		left: 0%;
		right: 0%;
		width: 100%;
		height: 100%;
		max-width: 640px;
		z-index: 100;
		background: #222;
		margin: auto;
	}
	.slide-enter-active,.slide-leave-active{
		transition:all .3s ;
	}
	.slide-enter,.slide-leave-to{
		transform:translate3d(100%,0,0);
	}
</style>