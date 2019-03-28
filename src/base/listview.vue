<template>
  <scroll :data="data" class="listview" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" >
        <h2 class="list-group-title">{{group.title}}</h2>
          <ul >
            <li @click="selectItem(item)" v-for="item in group.items" class="list-group-items">
              <div class="avatar">
                <img v-lazy="item.avatar" alt="">
              </div>
              <div class="name">{{item.name}}</div>
            </li>
          </ul>
      </li>
    </ul>
    <div class="shortCutlsit" @touchstart="shortCutTouchStart" @touchmove.stop.prevent="shortCutTouchMove">
      <ul >
        <li v-for="(item,index) in shortCutList" :data-index="index" :class="{'active':currentIndex === index}">{{item}}</li>
      </ul>
    </div>
    <div class="fiexed-title" v-show="fixedTitle" ref="fixedTop">
      <h1 >{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll'
  import {getData} from 'common/js/dom'
  const LI_HEIGHT = 18
  export default{
    created(){
        this.touch={}
        this.listenScroll = true
        this.probeType = 3
        this.LiHight = []
    },
    data(){
      return {
        scrollY:-1,
        currentIndex:0,
        diff:-1,
        fixedTop:0
      }
    },
    props:{
      data:{
        type:Array,
        default:null,
      }
    },
    components:{
      Scroll
    },
    computed:{
      shortCutList(){
        return this.data.map((group)=>{
          return group.title.substr(0,1)
        })
      },
       fixedTitle(){
        if(this.scrollY >= 0){
          return ''
        }
        return this.data[this.currentIndex]?this.data[this.currentIndex].title:'';
      }
    },
    mounted(){
        
    },
    methods:{
        selectItem(item){
          this.$emit('select',item)
        },
        shortCutTouchStart(e){
          let anchorIndex = getData(e.target,'index');
          this.touch.y1 = e.touches[0].pageY;
          this.touch.anchorIndex = anchorIndex;
          this._scrollTo(anchorIndex)
        },
        shortCutTouchMove(e){
          this.touch.y2 = e.touches[0].pageY;
          let delta = (this.touch.y2 - this.touch.y1)/LI_HEIGHT|0;
          let anchorIndex = parseInt(this.touch.anchorIndex)+ delta;
          this._scrollTo(anchorIndex)
        },
        scroll(pos){
         this.scrollY = pos.y
        },
        refresh(){
          this.$refs.listview.refresh();
        },
        _LiHight(){
          let height = 0;
          this.LiHight.push(height)
          let liGroup = this.$refs.listGroup;
          for(let i=0;i<liGroup.length;i++){
            height+= liGroup[i].clientHeight
            this.LiHight.push(height)
          }
        },
        _scrollTo(index){
          if(!index && index!=0){
            return 
          }
           index = index<0?0:index>this.LiHight.length?this.LiHight.length :index;
            this.scrollY = -this.LiHight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0,300)
        }
    },
    watch:{
      data(){
        setTimeout(()=>{
          this._LiHight();
        },200)
      },
      scrollY(newY){
        const lihight = this.LiHight;
        //当 newY大于0的时候
        if(newY > 0){
          this.currentIndex = 0;
          return 
        }
        //滚动到中间部分
        for(let i =0;i<lihight.length-1;i++){
          if((-newY>=lihight[i]&&-newY<lihight[i+1])){
            this.currentIndex = i
            this.diff = lihight[i+1] + newY
            return
          }
        }
          this.currentIndex = lihight.length -2;
      },
     diff(newVal){
      const TITLE_HEIGHT = this.$refs.fixedTop.clientHeight;
      let fixedTop = (newVal>0 && newVal<TITLE_HEIGHT) ? newVal - TITLE_HEIGHT:0
      if(this.fixedTop === fixedTop){
        return 
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTop.style.transform=`translate3d(0,${fixedTop}px,0)`
     }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.listview{
  height: 24.5rem;
  overflow: hidden;
}
  ul,h2,p,li,h1{
    margin:0;
    padding: 0;
  }
  li{list-style: none;}
  .list-group-title {
    margin: 0;
    font-size: .6rem;
    text-align: left;
    padding: 1% 5%;
    color: #f4f4f4;
    background: #444;
}
 .list-group-items {
  display: flex;
  padding: 3% 5%;
 }
 .list-group-items .avatar{
  width: 2rem;
  margin-right: 5%;
 }
 .list-group-items .avatar img{
  border-radius: 100%;
 }
 .list-group-items .name{
  font-size: .6rem;
  color: #f2f2f2;
  line-height: 2rem;
 }
 .shortCutlsit {
     position: absolute;
     top: 2rem;
     right: .3rem;
 }
 .shortCutlsit ul li {
     color: #d6d6d6;
     font-size: 0.6rem;
     padding: .07rem 0;
 }
 .shortCutlsit ul li.active {
  color: #f8ba23;
 }
 .fiexed-title {
     position: fixed;
     top: 3.8rem;
     left: 0%;
     padding: 1% 5%;
     color: #f4f4f4;
     background: #444;
     width: 100%;
     max-width: 576px;
     right: 0%;
     margin: auto;
     text-align: left;
     padding: 1% .8rem;
     z-index: 9;
 }
  .fiexed-title h1 {
    font-size: .6rem;
    margin: 0;
    padding: 0;
    /* padding: 1% 5%; */
}
</style>
