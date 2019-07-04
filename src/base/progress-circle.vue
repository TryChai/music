<template>
	<div class="progress-circle" @click.stop.prevent="stopPlay">
		<!-- <svg  :width="radius" :height="radius" viewBox="0 0 200 200" version="1.1" xmls="http://www.w3.org/2000/svg">
			<circle class='progress-background' r='50' cx="50" cy="50" fill="transparent"></circle>
			<circle class="progress-bar" r='50' cx='50' cy='50' fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
		</svg> -->
		<canvas id="canvas" width="50" height="50"></canvas>
		<slot></slot>
	</div>
</template>
<script>
	export default {
		data(){
			return {
			}
		},
		props:{
			radius:{
				type:Number,
				default:100
			},
			percent:{
				type:Number,
				default:0
			}
		},
		created(){
			this.$nextTick(()=>{
				if(document.documentElement.clientWidth>400){
					this.FullinitCanvas()
				}else{
					this.initCanvas()
				}
			})
		},
		data(){
			return{
				dashArray:Math.PI*100	
			}
		},
		computed:{
			
		},
		watch: {
			percent(newPerson){
				// console.log(document.documentElement.clientWidth)
				if(document.documentElement.clientWidth>400){
					this.FullinitCanvas(newPerson)
				}else{
					this.initCanvas(newPerson)
				}
			}
		},
		methods:{
			stopPlay(){
				this.$emit('toggle')
			},
			initCanvas(percent){
				let canvas = document.getElementById('canvas');
				let ctx = canvas.getContext("2d");
				canvas.width = 47;
            	canvas.height = 50;
				let cx = canvas.width / 2;  //中心x坐标
                let cy = canvas.height / 2;  //中心y坐标
                let r = 14.5; //圆环半径
				//画背景圆
				ctx.clearRect(0,0,50,50);
				ctx.beginPath();
				//ctx.moveTo(cx + r, cy);
				ctx.lineWidth = 3;
				ctx.strokeStyle = '#998032';
				ctx.arc(cx, cy, r,0,Math.PI*2);
				ctx.stroke();
				ctx.save();
				ctx.closePath();

				//
				ctx.beginPath();
				//ctx.moveTo(cx + r, cy);
				ctx.lineWidth = 3;
				ctx.strokeStyle = '#FFCD32';
				ctx.arc(cx, cy, r,0,Math.PI*2*percent,false);
				ctx.stroke();
				ctx.save();
				ctx.closePath();
			},
			FullinitCanvas(percent){
				let canvas = document.getElementById('canvas');
				let ctx = canvas.getContext("2d");
				canvas.width = 80;
            	canvas.height = 88;
				let cx = canvas.width / 2;  //中心x坐标
                let cy = canvas.height / 2;  //中心y坐标
                let r = 26; //圆环半径
				//画背景圆
				ctx.clearRect(0,0,80,88);
				ctx.beginPath();
				//ctx.moveTo(cx + r, cy);
				ctx.lineWidth = 6;
				ctx.strokeStyle = '#998032';
				ctx.arc(cx, cy, r,0,Math.PI*2);
				ctx.stroke();
				ctx.save();
				ctx.closePath();

				//
				ctx.beginPath();
				//ctx.moveTo(cx + r, cy);
				ctx.lineWidth = 3;
				ctx.strokeStyle = '#FFCD32';
				ctx.arc(cx, cy, r,0,Math.PI*2*percent,false);
				ctx.stroke();
				ctx.save();
				ctx.closePath();
			},
			
		}
	}
</script>
<style>
	#canvas {
		position: absolute;
		top: -0.4rem;
		left: .47rem;
	}
	.progress-circle{
		position: relative;
		width: 1rem;
	}
	.progress-circle svg{
		position: absolute;
	}
	.progress-circle circle{
		stroke-width:.4rem;
		transform-origin:center;

	}
	.progress-circle .progress-background{
		transform: scale(0.9) translate3d(28px,-2px,0);
		stroke:#998032;
	}
	.progress-circle .progress-bar{
		stroke:#FFCD32;
		transform: scale(0.9) rotate(-90deg) translate3d(2px,26px,0);
	}
	@media only screen and (min-width: 600px){
		.progress-circle circle {
		    stroke-width: .25rem;
		    transform-origin: center;
		}
		.progress-circle .progress-bar{
			stroke:#FFCD32;
			transform: scale(0.9) rotate(-90deg) translate3d(0px,26px,0);
		}	
	}
</style>