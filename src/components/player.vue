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
				<div class="middle" @touchstart.prevent='middleTouchStart' @touchmove.prevent='middleTouchMove' @touchend.prevent='middleTouchEnd'>
					<div class="middle-l" ref="msleft"> 
						<div class="die" :class="cdRotate" ref="cdwrapper">
							<img :src="currentSong.image" alt="">
						</div>
						<div class='lysrictxt'>{{lysrictxt}}</div>
					</div>
					<div class="middle-scroll" ref='mscroll'> 
						<scroll :data="currentLyric&&currentLyric.lines" ref="lyricscroll">
							<div class="middle-r">
								<div v-if="currentLyric">
									<p ref="lyricLine" v-for="(line,index) in currentLyric.lines" :class="{'cur': currentLineNum === index}">{{line.txt}}</p>
								</div>
							</div>
						</scroll>
					</div>
					<div class="dot">
						<span :class="{active:currentstateDot === 'cd'}"></span>
						<span :class="{active:currentstateDot === 'lyric'}"></span>
					</div>
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
					<div class="iconbox" @click.stop="setModeText">
						<div :class="iconMode" @click="changeMode"></div>
						<div @click.stop.prevent='prev' class="icon-prev" :class="Disable"></div>
						<div :class="[playIcon,Disable]" @click.stop.prevent="toggle" ></div>
						<div @click.stop.prevent="next" class="icon-next" :class="Disable"></div>
						<div class="icon" :class="getLike(currentSong)" @click.stop.prevent="toggleLike(currentSong)"></div>
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
				<div class='icon-playlist' @click.stop.prevent ="playlistShow"></div>
			</div>
		</transition>
		<toast :text="text" :delay="delay" ref="toast"></toast>
		<playlist ref="playlist"></playlist>
		<audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime($event)" @ended="end"></audio>
	</div>
</template>
<script>
	import {mapGetters,mapMutations,mapActions} from 'vuex'
	import animations from 'create-keyframe-animation'
	import progressCircle from 'base/progress-circle'
	import Lyric from 'lyric-parser'
	import Scroll from 'base/scroll'
	import playlist from 'components/playlist'
	import {playmodeMixin,likeMixin} from 'common/js/mixin'
	import axios from 'axios'
	import toast from 'base/toast'
	import {clearStorage} from 'common/js/cache'
	export default {
		mixins:[playmodeMixin,likeMixin],
		data(){
			return {
				songReady:false,
				currentTime:0,
				radius:64,
				currentLyric:null,
				currentLineNum:0,
				lyric:null,
				currentstateDot:'cd',
				lysrictxt:'',
				text:'',
				delay:800
			}
		},
		created(){
			this.touch = {},
			this.touches={}
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
			...mapGetters([
				'fullPlay',
				'currentSong',
				'miniPlay',
				'playState',
				'playList',
				'currentIndex',
				'sequenceList',
			]),
		},
		watch:{
			currentSong(newSong,oldSong){
				if(!newSong.id || newSong.id === oldSong.id){
					return 
				}
				clearInterval(this.timer)
				this.timer = setTimeout(()=>{
					this.$nextTick(()=>{
						this.$refs.audio.play();
						this.$refs.audio.currentTime = 0
						this.currentLineNum = 0
						this.currentTime = 0
						this.getlyric();
						if(this.currentLyric){
							this.currentLyric.stop()
						}
						this.$refs.lyricscroll.refresh()
					})
				},1000)
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
			playlistShow(){
				this.$refs.playlist.show()
			},
			getlyric(){
				this.currentSong.getlyric().then((lyric)=>{
					if(this.currentSong.lyric != lyric){
						return
					}
					this.lyric = lyric
					this.currentLyric = new Lyric(lyric,this.lyricHandle)
					if(this.playState){
						this.currentLyric.play()
					}
				}).catch(()=>{
					this.currentLyric = null
					this.lysrictxt = '找不到歌词'
					this.currentLineNum = 0
				})
			},
			setModeText(){
				if(this.mode == 0){
					this.text = '顺序播放'
				}else if(this.mode == 1){
					this.text = '单曲循环'
				}else {
					this.text = '随机播放'
				}
				this.$refs.toast.show();
			},
			middleTouchStart(e){
				this.touches.initaval = true
				this.touches.touchX = e.touches[0].pageX
				this.touches.touchY = e.touches[0].pageY
			},
			middleTouchMove(e){
				if(!this.touches.initaval){
				   return
				}
				let delatX = e.touches[0].pageX - this.touches.touchX
				let delatY = e.touches[0].pageY - this.touches.touchY
				if(Math.abs(delatY) > Math.abs(delatX)){
					return
				}
				let left = this.currentstateDot === 'cd'?0: -window.innerWidth
				// const width = delatX < 0 ? Math.min(0,left+delatX) :Math.max(-window.innerWidth,left+delatX)
				const offsetwidth = Math.min(0,Math.max(-window.innerWidth,left+delatX))
				this.touches.percent = Math.abs(offsetwidth/window.innerWidth)
				this.$refs.mscroll.style['transform'] = `translate3d(${offsetwidth}px,0,0)`
				this.$refs.mscroll.style['-webkit-transform'] = `translate3d(${offsetwidth}px,0,0)`
				this.$refs.mscroll.style['transitionDuration'] = '0ms'
				this.$refs.mscroll.style['transitionDuration'] = '0ms'
				this.$refs.msleft.style['transitionDuration'] = '0ms'
				this.$refs.msleft.style['-webkit-transitionDuration'] = '0ms'
				this.$refs.msleft.style['opacity'] = 1-this.touches.percent
			},
			middleTouchEnd(){
				let offsetwidth,opacity
				if(this.currentstateDot === 'cd'){
					if(this.touches.percent >0.2){
						offsetwidth = -window.innerWidth
						this.currentstateDot = 'lyric'
						opacity = 0
					}else{
						offsetwidth = 0
						opacity = 1
					}
				}else{
					if(this.touches.percent <0.9){
						offsetwidth = 0
						this.currentstateDot = 'cd'
						opacity = 1
					}else{
						offsetwidth = -window.innerWidth
						opacity = 0
					}
				}
				this.$refs.mscroll.style['transform'] = `translate3d(${offsetwidth}px,0,0)`
				this.$refs.mscroll.style['-webkit-transform'] = `translate3d(${offsetwidth}px,0,0)`
				this.$refs.mscroll.style['transitionDuration'] = '300ms'
				this.$refs.mscroll.style['-webkit-transitionDuration'] = '300ms'
				this.$refs.msleft.style['opacity'] = opacity
				this.touches.initaval = false
			},
			lyricHandle({lineNum,txt}){
				this.currentLineNum = lineNum
				if(lineNum>5){
					let linEl = this.$refs.lyricLine[lineNum - 5]
					this.$refs.lyricscroll&&this.$refs.lyricscroll.scrollToElement(linEl,1000)
				}else{
					this.$refs.lyricscroll.scrollTo(0,0,1000)
				}
				this.lysrictxt = txt
			},
			toggle(){
				if(!this.songReady){
					return 
				}
				this.setPlayState(!this.playState);
				if(this.currentLyric){
					this.currentLyric.togglePlay()
				}
			},
			prev(){
				if(!this.songReady){
					return 
				}
				if(this.playList.length==1){
					this.loop()
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
			next(){
				if(!this.songReady){
					return 
				}
				if(this.playList.length==1){
					this.loop()
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
				this.inserPlayHistory(this.currentSong)
			},
			error(){
				this.songReady = true
				this.text = '该资源有问题 无法播放请选择其他音乐'
				this.$refs.toast.show();
				this.toggle();
				clearStorage();
				window.location.reload();
				if(this.currentSong.songmid&&this.currentSong.singerMid){
					let result = axios.get('/api/getSteram',{
						params:{
							songmid:this.currentSong.songmid,
							singerMid:this.currentSong.singerMid
						}
					})
					this.currentSong.url = result.data
				}
			},
			updateTime(e){
				this.currentTime = e.target.currentTime
				if(e.target.currentTime>=this.currentSong.duration){
					if(this.mode == 1){
						this.$refs.audio.currentTime = 0
						if(this.currentLyric){
							this.currentLyric.seek(0)
						}
					}else{
						this.next();
					}
				}
			},
			loop(){
				this.$refs.audio.currentTime = 0
				if(this.currentLyric){
					this.currentLyric.seek(0)
				}
			},
			end(){
				if(this.mode == 1){
					this.$refs.audio.currentTime = 0
					if(this.currentLyric){
						this.currentLyric.seek(0)
					}
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
				if(this.currentLyric){
					this.currentLyric.seek(this.$refs.audio.currentTime*1000)
				}
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
			}),
			...mapActions([
				'inserPlayHistory',
			])
		},
		components:{
			progressCircle,
			Scroll,
			playlist,
			toast
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	img{
		pointer-events:none;
	}
	
	.lysrictxt {
	    margin-top: 2.5rem;
	    font-size: 0.56rem;
	    color: #ddd;
	    line-height: 1rem;
	    padding: 0 .6rem;
	}
	.fullPlay{
		position: fixed;
		top: 0%;
		width: 100%;
		max-width: 640px;
		left: 0%;
		right: 0%;
		margin:auto;
		height: 100%;
		z-index: 700;
		background: #222;
	}
	.middle {
	    height: 21rem;
	    overflow: hidden;
	    position: relative;
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
	.fullplay-top{display: flex;padding: 0 .5rem;margin-top: .4rem;height: 2.6rem;}
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
		font-size: 0.73rem;
		width: 13rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align:center;
	}
	.fullplay-top .text .desc{
		width: 13rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align:center;
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
		font-size: .58rem !important;
		margin-top: .3rem;
		width: 8rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.miniPlay div:nth-child(2) .desc {
		color: #a3a3a3;
		font-size: 0.5rem;
		margin-top: 0.4rem;
	}
	.miniPlay div:nth-child(3) {
	    font-size: 1.4rem;
	    margin-top: 0.4rem;
	    margin-right: 1.8rem;
	    margin-left: -.8rem;
	}
	.miniPlay div:nth-child(4) {
		font-size: 1.1rem;
		margin-top: 0.5rem;
		position: relative;
		z-index: 5;
		padding: 0 .2rem;
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
	     /*display: none;*/
	     height: 20rem;
	 }
	 .middle-r {
	    /*margin-top: 1rem;*/
	    /*margin-top: 3rem;*/
	}
	.middle-scroll {
	    height: 19.5rem;
	    overflow: hidden;
	    position: absolute;
	    right: -100%;
	    top: 0%;
	    width: 100%;
	}
	 .middle-r p {
	     font-size: 0.6rem;
	     color: #c3c3c3;
	     line-height: 1.3rem;
	 }
	 .middle-r p.cur{
	 	color: #ffcd32;
	 }
	.dot{
		position: absolute;
		bottom: 1%;
		left: 0%;
		right: 0%;
		margin:auto;

	}
	.dot span{
		display: inline-block;
		width: .3rem;
		height: .3rem;
		border-radius: 100%;
		background: #aaa;
	}
	.dot span.active{
		width: 1rem;
		border-radius: .6rem;
		background: #fff;
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
	 .icon-active{
		color:#f34444 !important;
	}
</style>