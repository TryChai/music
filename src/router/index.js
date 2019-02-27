import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const Recommend =(resolve)=>{
	import('components/recommend').then((module)=>{
		resolve(module)
	})
}
const Singer =(resolve)=>{
	import('components/singer').then((module)=>{
		resolve(module)
	})
}
const Rank =(resolve)=>{
	import('components/rank').then((module)=>{
		resolve(module)
	})
}
const Search =(resolve)=>{
	import('components/search').then((module)=>{
		resolve(module)
	})
}
const SearchDetail =(resolve)=>{
	import('components/singer-detail').then((module)=>{
		resolve(module)
	})
}

export default new Router({
  routes: [
  	{
  		path:'/',
  		redirect:'/recommend'
  	},
    {
      path: '/recommend',
      name:'recommend',
      text:'推荐',
      component: Recommend
    },
    {
      path: '/singer',
      name:'singer',
      text:'歌手',
      component: Singer,
      children:[
      	{
      		path:':id',
      		component:SearchDetail
      	}
      ]
    },
    {
      path: '/rank',
      name:'rank',
      text:'排行',
      component: Rank
    },
    {
      path: '/search',
      name:'search',
      text:'搜索',
      component: Search
    }
  ]
})
