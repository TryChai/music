<template>
	<div class="player"  >
		<div v-show="fullPlay" class='fullPlay'>
			<div class="background">
				<img :src="currentSong.image" alt="">
			</div>
			<div class="fullplay-top">
				<div class="icon-back" @click="close"></div>
				<div class="text">
					<h1 class="name" v-html="currentSong.name"></h1>
					<h2 class="desc" v-html="currentSong.singer"></h2>
				</div>
			</div>
			<div class="middle">
				<div class="die">
					<img :src="currentSong.image" alt="">
				</div>
			</div>
			<div class="bottom">
				<div class='process'>
					<div>0:00</div>
					<div class="probox">
						<div class="pro"></div>
						<div class="prowidth"></div>
					</div>
					<div>04:30</div>
				</div>
				<div class="iconbox">
					<div class="icon-sequence"></div>
					<div class="icon-prev"></div>
					<div class="icon-play"></div>
					<div class="icon-next"></div>
					<div class="icon icon-not-favorite"></div>
				</div>
			</div>
			
		</div>
		<div class="miniPlay" v-show="!fullPlay && miniPlay" @click="show">
			<div><img :src="currentSong.image" alt=""></div>
			<div>
				<h1 class="name" v-html="currentSong.name"></h1>
				<h2 class="desc" v-html="currentSong.singer"></h2>
			</div>
			<div class='icon-play'></div>
			<div class='icon-playlist'></div>
		</div>
	</div>
</template>
<script>
	import {mapGetters,mapMutations} from 'vuex'
	export default {
		data(){
			return {
			}
		},
		created(){

		},
		computed:{
			...mapGetters([
				'fullPlay',
				'currentSong',
				'miniPlay'
			]),
		},
		methods:{
			close(){
				this.setFullPlay(false)
				this.setMiniPlay(true)
			},
			show(){
				this.setFullPlay(true)
			},
			...mapMutations({
				setFullPlay:'SET_FULL_PLAY',
				setMiniPlay:'SET_MINI_PLAY',
			}),
			
		},
	}
</script>
<style >
	.fullPlay{
		position: fixed;
		top: 0%;
		width: 100%;
		max-width: 640px;
		left: 0%;
		right: 0%;
		margin:auto;
		height: 100%;
		z-index: 20;
		background: #222;
	}
	.middle {
	    height: 19rem;
	    margin-top: -2.8rem;
	    margin-bottom: 1rem;
	}
	.probox {
		width: 12rem;
	    position: relative;
	    top: .2rem;
	    height: .1rem;
	    margin:0 .2rem;
	    background: rgba(0,0,0,0.3);
	}
	.probox .pro {
	    position: relative;
	    top: -0.23rem;
	    left: 0rem;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    width: .6rem;
	    height: .6rem;
	    border: 3px solid #fff;
	    border-radius: 50%;
	    background: #ffcd32;
	}
	.probox .prowidth {
	    position: relative;
	    left: 0rem;
	    height: .1rem;
	    width: 0rem;
	    background: #ffcd32;
	    top: -.6rem;
	}
	.process {
	    display: flex;
	    color: #fff;
	    padding: 0 2rem;
	    font-size: .56rem;
	}
	.die{
	    margin: auto;
	    margin-top: 4rem;
	    width: 12rem;
	    border: .3rem solid rgba(255,255,255,0.1);
	    border-radius: 100%;
	}
	.die img{
	    border-radius: 100%;
	}
	.background{
	    filter: blur(20px);
	    -webkit-filter: blur(20px);
	    position: absolute;
	    z-index: -1;
	    width: 100%;
	    height: 100%;
	    top: 0%;
	    left: 0%;
	    right: 0%;
	    margin: auto;
	}
	.background img{
		height: 100%;
	}
	.iconbox {
		display: flex;
		padding: 0 1rem;
	    justify-content: space-around;
	    margin-top: 1em;
	}
	.iconbox div{
		color: #ffcd32;
		font-size: 1.4rem;
	}
	.iconbox div:nth-child(3){
		font-size: 1.8rem;
    	margin-top: -.23rem;
	}
	.fullplay-top{display: flex;padding: 0 .5rem;}
	.icon-back {
	    font-size: 0.95rem;
	    color: rgb(255, 205, 50);
	    -webkit-transform: rotate(-90deg);
	    transform: rotate(-90deg);
	    margin-left: 1.5rem;
	    margin-top: -0.8rem;
	}
	.fullplay-top .text {
	    color: #fff;
	    font-size: 0.65rem;
	    line-height: 1rem;
	    width: 12.3rem;
	    margin-top: 0.3rem;
	    margin-left: -1rem;
	    white-space: nowrap;
	}
	.fullplay-top .text .name {
	    font-size: .73rem;
	}
	h1,h2,p,div,ul,li{
		margin:0;
		padding:0;
	}
	li{list-style:none;}
	@media only screen and (min-width: 600px){
		.middle{
			height: 15rem;
		}
		.fullplay-top .text {
		    color: #fff;
		    font-size: 0.56rem;
		    line-height: .9rem;
		    width: 13rem;
		    margin-top: 0.5rem;
		    margin-left: -1rem;
		}
		.fullplay-top .text .name {
		    font-size: .7rem;
		}
	}
	.miniPlay {
	    position: fixed;
	    bottom: 0%;
	    left: 0%;
	    height: 2rem;
	    background: #333;
	    z-index: 120;
	    display: flex;
	    width: 100%;
	    right: 0%;
	    margin: auto;
	    padding: .5rem 0;
	    color: rgba(255,205,49,0.5);
	}
	.miniPlay div:nth-child(1){
	    width: 2rem;
	    border-radius: 100%;
	    margin-left: 1rem;
	}
	.miniPlay div:nth-child(1) img{
		border-radius: 100%;
	}
	.miniPlay div:nth-child(2) {
	    font-size: .7rem;
	    margin-left: .8rem;
	    margin-right: 0rem;
	    text-align: left;
	    width: 7.4rem;
	    padding-right: 1rem;
	    white-space: nowrap;
	}
	.miniPlay div:nth-child(2) .name{
	    color: #fff;
	}
	.miniPlay div:nth-child(2) .desc{
	    color: #a3a3a3;
	    font-size: .4rem;
	    margin-top: .2rem;
	}
	.miniPlay div:nth-child(3){
	    font-size: 1.4rem;
	    margin-top: .4rem;
	    margin-right: .8rem;
	}
	.miniPlay div:nth-child(4){
	    font-size: 1.1rem;
	    margin-top: 0.5rem;
	}
</style>