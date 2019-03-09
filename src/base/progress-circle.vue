<template>
	<div class="progress-circle" @click.stop.prevent="stopPlay">
		<svg  :width="radius" :height="radius" viewBox="0 0 200 200" version="1.1" xmls="http://www.w3.org/2000/svg">
			<circle class='progress-background' r='50' cx="50" cy="50" fill="transparent"></circle>
			<circle class="progress-bar" r='50' cx='50' cy='50' fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
		</svg>
		<slot></slot>
	</div>
</template>
<script>
	export default {
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
		data(){
			return{
				dashArray:Math.PI*100	
			}
		},
		computed:{
			dashOffset(){
				return (1-this.percent)*this.dashArray
			}
		},
		methods:{
			stopPlay(){
				this.$emit('toggle')
			}
		}
	}
</script>
<style>
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