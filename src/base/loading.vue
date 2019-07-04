<template>
  <div>
    <div class="loading" ref="loading" v-show="showFlag">
      <div class="loading-box">
        <img src="../common/images/loading_img.gif" alt="" >
          <p>{{title}}</p>
      </div>
    </div>
    <toast ref="toast" text="网络好像有点问题刷新试试"></toast>
  </div>
</template>

<script>
import toast from 'base/toast'
export default {
  name: 'loading',
  data(){
    return {
      showFlag:true
    }
  },
  props:{
    title:{
      type:String,
      default:'正在载入中...'
    }
  },
  mounted(){
    // setTimeout(()=>{
    //   this.$nextTick(()=>{
    //     if(this.$refs.loading){
    //       this.showFlag = false
    //       this.$refs.toast.show()
    //     }
    //   })
    // },5000)
  },
  methods:{
    
  },
  components:{
    toast
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
    // background: rgba(0,0,0,0.6);
    width: 5rem;
    height: 5rem;
    margin: auto;
    margin-top: 63%;
}
 .loading .loading-box img {
    width: 23%;
    margin-top: 17%;
    border-radius: 0.3rem;
    margin-bottom: 0.3rem;
}
  .loading-box p {
      font-size: 0.56rem;
      color: #d7d7d7;
      text-align: center;
  }
</style>
