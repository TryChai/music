<template>
  <div class="tab">
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
  </div>
</template>

<script>
export default {
  name: 'recommend',
  data () {
    return {
      
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .tab
    display flex
    padding 3% 0
  .tab .tag-item
    flex 1
    font-size .68rem
    color #fff
    margin 0 3%
    width 25%
  .tab span
    padding-bottom .3rem
    
  .tab .tab-link
    color #F8BA23
    border-bottom 1px solid #F8BA23

</style>
