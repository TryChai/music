<template>
  <div class="head-img">
      <img class="logo" :src="logoimg" alt="" />
      <span class="title">music  </span>       
  </div>
</template>

<script >
export default {
  name: 'MHeader',
  data () {
    return {
     logoimg:require('../assets/logo.png')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/base"
  .head-img
    margin 3% auto

  .logo
    width 8%
    border-radius 100%
    border 1px solid #eee
    vertical-align middle

  .title
    font-size .9rem
    color #F8BA23


</style>
