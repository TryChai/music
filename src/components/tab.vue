<template>
  <div class="tab" >
      <router-link tag="div" class="tag-item" :to="item.path" v-for="(item,index) in routerlist" @click.native="navclick(item.path)" :key="Math.random()">
        <span :class="[currentpath == item.path ?'tab-link':'']">{{item.text}}</span>
      </router-link>
  </div>
</template>

<script>
export default {
  name: 'tab',
  data () {
    return {
      routerlist:[],
      currentpath:'',
    }
  },
  computed:{
    name(){
      return $route.params
    }
  },
  mounted(){
    let roterl = this.$router.options.routes;
    roterl = roterl.slice(1,5)
    this.routerlist = roterl;
    this.$router.afterEach((to,from)=>{
      this.currentpath = to.path;
    })
  },
  methods:{
    navclick(o){
      this.currentpath = o;
    },
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .tab{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      padding: .5rem 0;
      position: fixed;
      width: 100%;
      top: 2rem;
      left: 0%;
      z-index: 10;
      max-width: 640px;
      right: 0%;
      margin: auto;
      background: #222;
  }
  .tab .tag-item
    flex 1
    font-size .6rem
    color #fff
    margin 0 3%
    width 25%
  .tab span
    padding-bottom .3rem
    
  .tab .tab-link
    color #F8BA23
    border-bottom 1px solid #F8BA23

</style>
