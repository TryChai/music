<template>
	<div class='song-list'>
		<ul>
			<li v-for="(song,index) in songs" class="item" @click="selectSong(song,index)">
				<div class="content">
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
			}
		},
		methods:{
			getSong(song){
				return `${song.singer} - ${song.album}`
			},
			selectSong(song,index){
				this.$emit('selectSong',song,index)
			},
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
	.content {
	    color: #f2f2f2;
	    padding: .3rem 1.5rem;
	    text-align: left;
	}
	.content ul{
		padding-top: .3rem;
	}
	.name {
	    font-size: .6rem;
	    padding: .2rem 0;
	}
	.des{
	    font-size: .6rem;
	    color: #aaa;
	}
</style>