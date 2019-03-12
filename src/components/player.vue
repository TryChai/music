<template>
	<div class="player"  >
		<transition name="fullPlay" 
					@enter="enter"
					@after-enter="afterEnter"
					@leave="leave"
					@after-leave="afterLeave"
		>
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
					<div class="middle-l"> 
						<div class="die" :class="cdRotate" ref="cdwrapper">
							<img :src="currentSong.image" alt="">
						</div>
						
					</div>
					<scroll :data="currentLyric&&currentLyric.lines" ref="lyricscroll">
						<div class="middle-r">
							<div v-if="currentLyric">
								<p ref="lyricLine" v-for="(line,index) in currentLyric.lines" :class="{'cur': currentLineNum === index}">{{line.txt}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class='process'>
						<div>{{formate(currentTime)}}</div>
						<div class="probox" @click="getPro">
							<div class="pro" ref="pro" @touchstart.prevent='proOntouchStart' @touchmove.prevent="proOntouchMove" @touchend.prevent="proOntouchEnd"></div>
							<div class="prowidth" ref="prowidth"></div>
						</div>
						<div>{{formate(currentSong.duration)}}</div>
					</div>
					<div class="iconbox">
						<div :class="iconMode" @click="changeMode"></div>
						<div @click='prev' class="icon-prev" :class="Disable"></div>
						<div :class="[playIcon,Disable]" @click="toggle" ></div>
						<div @click="next" class="icon-next" :class="Disable"></div>
						<div class="icon icon-not-favorite"></div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="miniPlay" v-show="!fullPlay && miniPlay" @click="show">
				<div ref="cdmini" :class="cdRotate"><img :src="currentSong.image" alt=""></div>
				<div>
					<h1 class="name" v-html="currentSong.name"></h1>
					<h2 class="desc" v-html="currentSong.singer"></h2>
				</div>
				<progress-circle @toggle="toggle" :radius="radius" :percent="(currentTime/currentSong.duration)">
					<div :class="playIcon" class="bar"></div>
				</progress-circle>
				<div class='icon-playlist'></div>
			</div>
		</transition>
		<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime($event)" @ended="end"></audio>
	</div>
</template>
<script>
	import {mapGetters,mapMutations} from 'vuex'
	import animations from 'create-keyframe-animation'
	import progressCircle from 'base/progress-circle'
	import randomList from 'common/js/until'
	import Lyric from 'lyric-parser'
	import Scroll from 'base/scroll'
	export default {
		data(){
			return {
				songReady:false,
				currentTime:0,
				radius:64,
				currentLyric:null,
				currentLineNum:0,
				lyric:null,
			}
		},
		created(){
			this.touch = {}
		},
		mounted(){
			this.$nextTick(()=>{
				setTimeout(()=>{
			this.radius =((64/23.4375)*(document.documentElement.style.fontSize.substr(0,document.documentElement.style.fontSize.indexOf('px'))))
				},100)
			})
		},
		computed:{
			cdRotate(){
				return this.playState?'play':'play pause'
			},
			playIcon(){
				return this.playState?'icon-pause':'icon-play' 
			},
			Disable(){
				return this.songReady ? '':'disable'
			},
			iconMode(){
				return this.mode == 0 ?'icon-sequence':this.mode==1?'icon-loop':'icon-random'
			},
			...mapGetters([
				'fullPlay',
				'currentSong',
				'miniPlay',
				'playState',
				'playList',
				'currentIndex',
				'mode',
				'sequenceList'
			]),
		},
		watch:{
			currentSong(newSong,oldSong){
				if(newSong.id === oldSong.id){
					return 
				}
				this.$nextTick(()=>{
					this.$refs.audio.play();
					this.getlyric()
				})
			},
			playState(newState){
				const audio = this.$refs.audio
				this.$nextTick(()=>{
					newState?audio.play():audio.pause();
				})
			},
			currentTime(pos){
				const precent = ((pos/this.currentSong.duration *100 |0)/100)
				if(precent >=0 && !this.touch.initstate){
					let left = precent*8.9
					let width = precent*9
					this.$refs.pro.style['transform'] = `translate3d(${left}rem,0,0)`
					this.$refs.pro.style['-webkit-transform'] = `translate3d(${left}rem,0,0)`
					this.$refs.prowidth.style['width'] = `${width}rem`
				}
			}
		},
		methods:{
			close(){
				this.setFullPlay(false)
				this.setMiniPlay(true)
			},
			show(){
				this.setFullPlay(true)
			},
			getlyric(){
				this.currentSong.getlyric().then((lyric)=>{
					this.lyric = lyric
					this.currentLyric = new Lyric(lyric,this.lyricHandle)
					if(this.playState){
						this.currentLyric.play()
					}
				})
			},
			lyricHandle({lineNum,txt}){
				this.currentLineNum = lineNum
				if(lineNum>5){
					let linEl = this.$refs.lyricLine[lineNum - 5]
					this.$refs.lyricscroll.scrollToElement(linEl,1000)
				}else{
					this.$refs.lyricscroll.scrollTo(0,0,1000)
				}
			},
			toggle(){
				if(!this.songReady){
					return 
				}
				this.setPlayState(!this.playState);
				this.currentLyric.togglePlay()
			},
			prev(){
				if(!this.songReady){
					return 
				}
				let index = this.currentIndex -1
				if(index == -1){
					index = this.playList.length -1
				}
				this.setCurrentIndex(index)
				if(!this.playState){
					this.setPlayState(true)
				}
				this.songReady = false
			},
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
			next(){
				if(!this.songReady){
					return 
				}
				let index = this.currentIndex +1
				if(index == this.playList.length){
					index = 0
				}
				this.setCurrentIndex(index)
				if(!this.playState){
					this.setPlayState(true)
				}
				this.songReady = false
			},
			ready(){
				this.songReady = true
			},
			error(){
				this.songReady = true
				this.next();
			},
			updateTime(e){
				this.currentTime = e.target.currentTime

				if(e.target.currentTime>=this.currentSong.duration){
					if(this.mode == 1){
						this.$refs.audio.currentTime = 0
						this.currentLyric.seek(0)
					}else{
						this.next();
					}
				}
			},
			end(){
				if(this.mode == 1){
					this.$refs.audio.currentTime = 0
					this.currentLyric.seek(0)
				}else{
					this.next();
				}
			},
			proOntouchStart(e){
				this.touch.initstate = true
				this.touch.startX = e.touches[0].pageX
				this.touch.startLeft = parseFloat(this.$refs.prowidth.style.width.substr(0,this.$refs.prowidth.style.width.indexOf('rem')))
			},
			proOntouchMove(e){
				if(!this.touch.initstate){
					return
				}
				let fontSize = (document.documentElement.style.fontSize.substr(0,document.documentElement.style.fontSize.indexOf('px'))) 
				let delatX = parseFloat((e.touches[0].pageX - this.touch.startX)/fontSize).toFixed(2) 
				let left = Math.min(9,Math.max(0,parseFloat(parseFloat(this.touch.startLeft) +parseFloat(delatX))));
				this.$refs.pro.style['transform'] = `translate3d(${left}rem,0,0)`
				this.$refs.pro.style['-webkit-transform'] = `translate3d(${left}rem,0,0)`
				this.$refs.prowidth.style['width'] = `${left}rem`
				this.touch.left = left
			},
			proOntouchEnd(){
				this.touch.initstate = false
				this.$refs.audio.currentTime = (this.touch.left/9 * this.currentSong.duration)
				this.currentLyric.seek(this.$refs.audio.currentTime*1000)
				if(!this.playState){
					this.toggle();
				}
			},
			getPro(e){
				let fontSize = (document.documentElement.style.fontSize.substr(0,document.documentElement.style.fontSize.indexOf('px')))
				let left = e.offsetX/fontSize
				this.$refs.pro.style['transform'] = `translate3d(${left}rem,0,0)`
				this.$refs.pro.style['-webkit-transform'] = `translate3d(${left}rem,0,0)`
				this.$refs.prowidth.style['width'] = `${left}rem`
				this.$refs.audio.currentTime = (left/9 * this.currentSong.duration)
				this.currentLyric.seek(this.$refs.audio.currentTime*1000)
				if(!this.playState){
					this.toggle();
				}
			},
			formate(interval){
				let inter = interval |0
				const min = (inter /60 )|0
				const sec = this._pad(inter % 60)
				return `${min}:${sec}`
			},
			_pad(num ,n=2){
				let len = num.toString().length
				while(len < n){
					num = '0'+num
					len++
				}
				return num
			},
			enter(el,done){
				const {x,y,scale} = this.getPos();
				let animation = {
					0:{
						transform:`translate3d(${x}px,${y}px,0) scale(${scale})`,
						opacity:0.3,
					},
					60:{
						transform:`translate3d(0,0,0) scale(1.1)`,
						opacity:1,
					},
					100:{
						transform:`translate3d(0,0,0) scale(1)`,
						opacity:1,
					}
				}
				animations.registerAnimation({
					name:'move',
					animation,
					preset:{
						duration:400,
						easing:'cubic-bezier(0.8,0.18,0.8,1.32)'
					}
				})
				animations.runAnimation(this.$refs.cdwrapper,'move',done)
			},
			afterEnter(){
				animations.unregisterAnimation('move')
				this.$refs.cdwrapper.style['animation'] = ''
			},
			leave(el,done){
				this.$refs.cdwrapper.style['transition'] = 'all .4s'
				let {x,y,scale} = this.getPos();
				this.$refs.cdwrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
				this.$refs.cdwrapper.style['-webkit-transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
				this.$refs.cdwrapper.addEventListener('transitionend',done)
			},
			afterLeave(){
				this.$refs.cdwrapper.style['animation'] = ''
				this.$refs.cdwrapper.style['transform'] = ''
				this.$refs.cdwrapper.style['-webkit-transform'] = ''
			},
			getPos(){
				const cdwidth = this.$refs.cdwrapper.clientWidth
				const cdmini = this.$refs.cdmini.clientWidth
				const cdpaddingTop = this.$refs.cdwrapper.offsetTop
				const cdpaddingLeft = this.$refs.cdwrapper.offsetLeft
				const cdminipaddingLeft = this.$refs.cdmini.offsetLeft
				const scale = cdmini/cdwidth
				const x = (cdpaddingLeft-cdwidth/2)-(cdminipaddingLeft-cdmini/2)
				const y = window.innerHeight-cdpaddingTop-(cdwidth/2)-30
				return {
					x,y,scale
				}
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
		components:{
			progressCircle,
			Scroll
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
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
	    height: 20rem;
	    /* margin-top: -2.8rem; */
	    margin-bottom: 1rem;
	    overflow: hidden;
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
	    z-index: 5;
	}
	.probox .prowidth {
	    position: relative;
	    left: 0rem;
	    height: .1rem;
	    width: 0rem;
	    background: #ffcd32;
	    top: -.6rem;
	    z-index: 3;
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
	    max-width: 640px;
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
	.miniPlay div:nth-child(3) {
	    font-size: 1.4rem;
	    margin-top: 0.4rem;
	    margin-right: 1.8rem;
	    margin-left: -.8rem;
	}
	.miniPlay div:nth-child(4){
	    font-size: 1.1rem;
	    margin-top: 0.5rem;
	}
	.miniPlay div.bar{
		font-size: 1.4rem;
		/*margin-left: -0.1rem;*/
	}
	/*动画*/
	.fullPlay-enter-active,.fullPlay-leave-active{
		transition:all .4s;
	}
	.fullPlay-enter-active .bottom,.fullPlay-leave-active .bottom,
	.fullPlay-enter-active .fullplay-top,.fullPlay-leave-active .fullplay-top{
		transition:all .4s cubic-bezier(0.86,0.18,0.82,1.32);
	}
	.fullPlay-enter,.fullPlay-leave-to{
		opacity: 0;
		z-index: -1;
	}
	.fullPlay-enter .fullplay-top,.fullPlay-leave-to .fullplay-top{
	    transform:translate3d(0,-100px,0)
	}
	.fullPlay-enter .bottom,.fullPlay-leave-to .bottom{
	   	transform:translate3d(0,100px,0)
	}   
	 .mini-enter-active,.mini-leave-active{
	 	transition:all .4s;
	 }
	 .mini-enter,.mini-leave{
	 	opacity: 0;
	 }
	 .play{
	 	animation:rotate 10s linear infinite;
	 	-webkit-animation:rotate 10s linear infinite;
	 }  
	 .pause{
	 	animation-play-state:paused;
	 } 
	 @keyframes rotate{
	 	0%{
	 		transform:rotate(0deg);
	 	}
	 	100%{
	 		transform:rotate(360deg);
	 	}
	 }
	 .middle-l {
	    margin-top: -2.8rem;
	    display: none;
	}
	 .middle-r {
	    /*margin-top: 1rem;*/
	    /*margin-top: 3rem;*/
	}
	 .middle-r p {
	     font-size: 0.6rem;
	     color: #c3c3c3;
	     line-height: 1.3rem;
	 }
	 .middle-r p.cur{
	 	color: #fff;
	 }

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
</style>