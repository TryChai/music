<template>
	<div>
		<!-- 输入框 -->
		<div class="searchbox">
			<span class="icon icon-search"></span>
			<input ref="query" v-model="query" type="text" :placeholder="placeholder" >
			<span @click.stop.prevent="clear()" v-show="query" class="icon icon-dismiss"></span>
		</div>	
	</div>
</template>

<script>
import {TimeoutQuery} from 'common/js/until.js'
export default {
	name:'searchbox',
	data(){
		return {
			query:'',
		}
	},
	props:{
		placeholder:{
			type:String,
			default:'搜索歌曲，歌手'
		}
	},
	methods:{
		addQuery(o){
			this.query = o
		},
		clear(){
			this.query = ''
			this.$emit('clear')
		},
		blur(){
			this.$refs.query.blur()
		}
	},
	created(){
		// this.$watch('query',(newQuery)=>{
		// 	this.$emit('query',newQuery)
		// })
		this.$watch('query',TimeoutQuery((newQuery) => {
			this.$emit('query',newQuery)
		},500))
	}
}

</script>

<style>
	.searchbox {
		height: 1.6rem;
		width: 92%;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		margin: auto;
		margin-top: 2.5rem;
		background: #333;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		border-radius: .3rem;
	}
	.icon-search {
		color: #000;
		font-size: 1rem;
		margin-top: .4rem;
		margin-left: .3rem;
		margin-right: .2rem;
	}
	.searchbox input {
	    background: transparent;
	    outline: none;
	    font-size: .55rem;
	    width: 12rem;
	    color: #bbb;
	}
	.searchbox input::-webkit-input-placeholder{
		font-size: .55rem !important;
	}
	.icon-dismiss {
		color: #000;
		font-size: .6rem;
		margin-top: .6rem;
		margin-right: .1rem;
	}
</style>