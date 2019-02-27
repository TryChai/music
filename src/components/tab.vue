<template>
  <!-- <div class="tab">
      <router-link tag="div" class="tag-item" to="/recommend">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link tag="div" class="tag-item" to="/singer">
        <span>歌手</span>
      </router-link>
      <router-link tag="div" class="tag-item" to="/rank">
        <span>排行</span>
      </router-link>
      <router-link tag="div" class="tag-item" to="/search">
        <span>搜索</span>
      </router-link>
  </div> -->
  <div class="tab" >
      <router-link tag="div" class="tag-item" :to="item.path" v-for="item in routerlist" @click.native="navclick(item.path)" >
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
    roterl.shift();
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
      z-index: 99;
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
