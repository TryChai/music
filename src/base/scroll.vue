<template>
  <div ref="wrapper" :class="wrapperStyle">
     <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default{
    props:{
      probeType:{
        type:Number,
        default:1,
        },
        click:{
          type:Boolean,
          default:true
        },
        data:{
          type:Array,
          default:null,
        },
        listenScroll:{
          type:Boolean,
          default:false
        },
        pullup:{
          type:Boolean,
          default:false
        },
        beforeScroll:{
          type:Boolean,
          default:false
        },
        refreshDelay:{
          type:Number,
          default:20
        },
        wrapperStyle:{
          type:String,
          default:'wrapper'
        }
    },
    mounted(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          this._initScroll()
          },200)
      })
    },
    methods:{
      _initScroll(){
        if(!this.$refs.wrapper){
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper,{
          probeType : this.probeType,
          click : this.click
          })
        if(this.listenScroll){
          let that = this;
          //监听滚动事件  派发出去
          this.scroll.on('scroll',(pos)=>{
            that.$emit('scroll',pos)
          })
        }
        if(this.pullup){
           let that = this;
          this.scroll.on('scrollEnd',()=>{
            //将滚动到最底的事件 派发出去
            if(this.scroll.y <= (this.scroll.maxScrollY + 50) ){
              that.$emit('scrollToEnd')
            }
          })
        }
        if(this.beforeScroll){
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScroll')
          })
        }
      },
      enable(){
        this.scroll&&this.scroll.enable()
      },
      disable(){
        this.scroll&&this.scroll.disable()
      },
      refresh(){
        this.scroll&&this.scroll.refresh()
      },
      scrollTo(){
        this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)
      },
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
      }
    },
    watch:{
      data(){
        setTimeout(()=>{
           this.$nextTick(()=>{
              this.refresh()
             })
            },this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
