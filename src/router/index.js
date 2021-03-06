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
const SingerDetail =(resolve)=>{
  import('components/singer-detail').then((module)=>{
    resolve(module)
  })
}
const Player =(resolve)=>{
  import('components/player').then((module)=>{
    resolve(module)
  })
}
const Disc =(resolve)=>{
	import('components/disc').then((module)=>{
		resolve(module)
	})
}

const Toplist = (resolve)=>{
  import ('components/toplist').then((module)=>{
    resolve(module)
  })
}
const User = (resolve)=>{
  import('components/user').then((moule)=>{
    resolve(moule)
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
      component: Recommend,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path: '/singer',
      name:'singer',
      text:'歌手',
      component: Singer,
      children:[
      	{
      		path:':id',
      		component:SingerDetail
      	}
      ]
    },
    {
      path: '/rank',
      name:'rank',
      text:'排行',
      component: Rank,
      children:[
        {
          path:':id',
          component:Toplist
        }
      ]
    },
    {
      path: '/search',
      name:'search',
      text:'搜索',
      component: Search,
      children:[
      	{
      		path:':id',
      		component:SingerDetail
      	}
      ]
    },
    {
      path:'/user',
      name:'user',
      text:'用户',
      component:User
    }
  ]
})
