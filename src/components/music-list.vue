<template>
	<div class="music-list">
		<div class='top' ref="top">
			<div class="back" @click="back"><img src="../common/images/back.png" alt=""></div>
			<div class="title" v-html="title"></div>
		</div>
		<div class='bgImage' :style="bgStyle" ref='bgImage'></div>
		<loading v-show="!song.length>0"></loading>
		<div class="playBtn" v-show="song.length>0" @click="randomPlayAction">
			<div class="icon">
				<img src="../common/images/video.png" alt="">
			</div>
			<p>随机播放全部</p>
		</div>
		<div class="bg-layer" ref="Bglayer"></div>
		<div class="songList">
			<scroll @scroll="scroll" :data="song" :probeType="probeType" :listen-scroll="listenScroll" >
				<div class="song-list-wrapper">
					<song-list :songs="song" @selectSong="selectSong"></song-list>
				</div>
			</scroll>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
	import Scroll from 'base/scroll'
	import SongList from 'components/song-list'
	import Loading from 'base/loading'
	import {mapActions} from 'vuex'
	export default{
		data(){
			return {
				scrollY:0,
				bgImageHeight:0,
				topHeight:0,
			}
		},
		props:{
			bgImage:{
				type:String,
				default:''
			},
			song:{
				type:Array,
				default:[]
			},
			title:{
				type:String,
				default:''
			}
		},
		computed:{
			bgStyle(){
				return `background:url(${this.bgImage}) no-repeat top/100%`
			}
		},
		created(){
			this.probeType=3
			this.listenScroll = true
		},
		methods:{
			selectSong(song,index){
				// console.log(this.song)
				this.selectPlay({
				  list:this.song,
				  index,
				})
			},
			randomPlayAction(){
				this.randomPlay({
					list:this.song
				})
			},
			back(){
				this.$router.push({
					path:'/singer'
				})
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			...mapActions([
				'selectPlay',
				'randomPlay'
			])
		},
		mounted(){
			this.bgImageHeight = this.$refs.bgImage.clientHeight;
			this.topHeight = this.$refs.top.clientHeight+this.$refs.top.offsetTop+10;
		},
		watch:{
			scrollY(newY){
				let translateY = -Math.min(-newY,this.bgImageHeight-this.topHeight);
				let zIndex = 0,scale ;
				const precent = Math.abs(newY/this.bgImageHeight)
				if(newY > 0){
					scale = 1+precent
					zIndex = 10
				}
				if(newY <(translateY) ){
					zIndex = 10;
					this.$refs.bgImage.style['height'] = this.topHeight+'px';
				} else{
					zIndex = 0;
					this.$refs.bgImage.style['height'] = '11rem';
				}
				this.$refs.bgImage.style['z-index'] = zIndex;
				this.$refs.Bglayer.style['transform'] = `translate3d(0,${translateY}px,0)`;
				this.$refs.Bglayer.style['-webkit-transform'] = `translate3d(0,${translateY}px,0)`;
				this.$refs.bgImage.style['transform'] = `scale(${scale})`;
				this.$refs.bgImage.style['-webkit-transform'] = `scale(${scale})`;
			}
		},
		components:{
			Scroll,
			SongList,
			Loading
		}
	}
</script>

<style>
	.top {
	    display: flex;
	    margin-top: 0.6rem;
	    padding: 0 .6rem;
	    position: fixed;
	    z-index: 11;
	}
	.playBtn {
	    position: absolute;
	    top: 8rem;
	    left: 0%;
	    right: 0%;
	    width: 5.3rem;
	    padding: 0.05rem .4rem;
	    /* max-width: 640px; */
	    padding-top: .1rem;
	    margin: auto;
	    border: 1px solid #f8ba23;
	    display: -webkit-box;
	    display: -ms-flexbox;
	    border-radius: 1rem;
	    display: flex;
	    text-align: center;
	}
	.playBtn .icon{
	    width: 1rem;
	    margin-right: .2rem;
	}
	.playBtn p {
	    font-size: .65rem;
	    line-height: 1rem;
	    color: #f8ba23;
	}
	.back{
		width: 1rem;
	}
	.title{
	    color: #f8ba23;
	    width: 14rem;
	    font-size: .7rem;
	    line-height: 1.1rem;
	}
	.bgImage{
		width: 100%;
		height: 11rem;
		position: absolute;
		top: 0%;
		left: 0%;
	}
	.songList {
	    position: absolute;
	    top: 11rem;
	    left: 0%;
	    z-index: 4;
	}
	.bg-layer {
	    height: 100%;
	    background: #222;
	    position: absolute;
	    top: 10.7rem;
	    left: 0;
	    z-index: 0;
	    width: 100%;
	}
	.music-list{
		position: fixed;
		top: 0%;
		left: 0%;
		right: 0%;
		width: 100%;
		height: 100%;
		max-width: 640px;
		z-index: 10;
		background: #222;
		margin: auto;
	}
</style>