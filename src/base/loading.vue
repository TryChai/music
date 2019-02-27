<template>
  <div class="loading" ref="loading">
    <div class="loading-box">
       <img src="../common/images/loading_img.gif" alt="" >
        <p>{{title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data(){
    return {}
  },
  props:{
    title:{
      type:String,
      default:'正在载入中...'
    }
  },
  mounted(){
    
  },
  methods:{
    
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .loading{
    position: fixed;
    top: 0%;
    left: 0%;
    right: 0%;
    margin: auto;
    max-width: 640px;
    width: 100%;
    bottom: 0%;
    height: 100%;
    z-index: 90;
    /*background: #333333;*/
  }
  .loading-box{
    background: rgba(0,0,0,0.6);
    width: 5rem;
    height: 5rem;
    margin: auto;
    margin-top: 63%;
}
  .loading .loading-box img {
    width: 38%;
    margin-top: 17%;
    border-radius: 0.3rem;
}
  .loading-box p {
      font-size: .6rem;
      color: #fff;
      text-align: center;
  }
</style>
