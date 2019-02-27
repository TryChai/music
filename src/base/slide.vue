<template>
  <div class="slide" ref="slider">
      <div class="slide-group" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots" >
          <span class="dot" v-for="(item,index) in Dot" :class="{active :currentIndex === index} "></span>
      </div>
  </div>
</template>

<script>
import {hasClass,addClass} from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
  name: 'Slider',
  data(){
    return{
        Dot:[],
        currentIndex:0,
    }
  },
  props:{
    loop:{
      type:Boolean,
      default:true
    },
    autoPlay:{
      type:Boolean,
      default:true
    },
    interval:{
      type:Number,
      default:4000
    }
  },
  mounted(){
    setTimeout(()=>{
        this._setSliderWidth();
        this._initDot();
        this._initSilder();
        if(this.autoPlay){
          this._play();
        }
    },20)
    window.addEventListener('resize',()=>{
      if(!this.slider){
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh();
    })
  },
  methods:{
    _setSliderWidth(isRize){
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for(let i = 0;i<this.children.length;i++){
          let child = this.children[i]
          addClass(child,'slider-item')
          child.style.width = sliderWidth +'px'
          width += sliderWidth
        }
        if(this.loop&&!isRize){
          width += 2*sliderWidth
        }
        this.$refs.sliderGroup.style.width = width+'px'
    },
    _initSilder(){
        this.slider = new BScroll(this.$refs.slider,{
          scrollX:true,
          scrollY:false,
          momentnum:false,
          snap:true,
          snapLoop:this.loop,
          snapThreshold:0.3,
          snapSpeed:400,
          click:true
        })
        this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX;
          if(this.loop){
            pageIndex -=1;
          }
          this.currentIndex = pageIndex
          if(this.autoPlay){
            clearTimeout(this.timer)
            this._play();
          }
        })
        this.slider.on('touchend',()=>{
        	if(this.autoPlay){
        		this._play();
        	}
        })
        this.slider.on('beforeScrollStart',()=>{
        	if(this.autoPlay){
	            clearTimeout(this.timer)
	          }
        })
    },
    _play(){
      let pageIndex = this.currentIndex+1
      if(this.loop){
        pageIndex +=1
      }
       this.timer = setTimeout(()=>{
           this.slider.goToPage(pageIndex,0,400)
       },this.interval)
    },
    _initDot(){
        this.Dot = new Array(this.children.length)
    }
  },
  destroyed(){
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide
      min-height:1px
      .slide-group
        position:relative
        overflow:hidden
        white-space:nowrap
        .slider-item
          float:left
          box-sizing:border-box
          overflow:hidden
          text-align:center
          a
            display:block
            width:100%
            overflow:hidden
            text-decoration:none
          img
            display:block
            width:100%
    .dots
      position absolute
      bottom 2%
      left  0%
      right 0%
      margin auto
      .dot
        display inline-block
        width .3rem
        height .3rem
        border-radius 100%
        background #f1f1f1
        margin-right 2%
        &.active
          width 1rem
          border-radius .2rem


</style>
