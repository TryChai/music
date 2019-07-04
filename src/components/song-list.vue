<template>
	<div class='song-list'>
		<ul>
			<li v-for="(song,index) in songs" class="item" @click="selectSong(song,index)" :key="Math.random()">
				<div :class="getClass(index)" v-show="rank">{{getText(index)}}</div>
				<div :class="rank?'content_rank':'content'">
					<h2 class="name">{{song.name}}</h2>
					<p class="des">{{getSong(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		props:{
			songs:{
				type:Array,
				default:[]
			},
			rank:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			getSong(song){
				return `${song.singer} - ${song.album}`
			},
			selectSong(song,index){
				this.$emit('selectSong',song,index)
			},
			getClass(o){
				if(o<=2){
					return `left_text icon${o+1}`
				}
				return 'left_text'
			},
			getText(o){
				if(o>2){
					return o
				}
			}
		}
	}
</script>
<style>
	h1,h2,p,div,ul,li{
		margin:0;
		padding:0;
	}
	li{list-style:none;}
	.wrapper {
	    height: 17.5rem;
	    /* overflow: hidden; */
	}
	.item{display:flex;}
	.left_text {
	    width: 1.3rem;
	    color: #f8ba23;
	    margin-left: 6%;
	    line-height: 2.3rem;
	    font-size: 1.2rem;
	    margin-right: -.5rem;
	}
	.icon1{
		background: url(../assets/first@2x.png) center/100% auto no-repeat;
	}
	.icon2{
		background: url(../assets/second@2x.png) center/100% auto no-repeat;
	}
	.icon3{
		background: url(../assets/third@2x.png) center/100% auto no-repeat;
	}
	.content_rank {
	    color: #f2f2f2;
	    padding: .3rem 1.5rem;
	    text-align: left;
	    width: 10.5rem;
	}
	.content {
	    color: #f2f2f2;
	    padding: .3rem 1.5rem;
	    text-align: left;
	}
	.content ul{
		padding-top: .3rem;
	}
	.name {
	    font-size: .56rem;
	    padding: .2rem 0;
		white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    padding-top: .2rem;
		width: 13rem;
		text-align: left;
	}
	.des {
	    font-size: .56rem;
	    color: #aaa;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    padding-top: .2rem;
		width: 13rem;
	}
</style>