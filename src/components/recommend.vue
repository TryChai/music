<template>
  <div class="recommend">
    <Loading v-show="!discList.length || !recommend.length"></Loading>
    <div class="recommend-contain">
          <div v-if="recommend.length" class="slider-wrap">
              <slider>
                  <div v-for="item in recommend">
                    <a>
                        <img :src="item.picUrl" />
                    </a>
                  </div>

              </slider>
          </div>
          <div class="recommend-list">
              <div class="list-title" ref="gedan">热门歌单推荐</div>
              <scroll :data="discList" class="scroll-box" ref="scroll">
              <div>
                  <ul ref='recommendlist' class="recommendlist">
                      <li v-for="item in discList" class="item" @click.prevent="toDisc(item)">
                          <div class="icon">
                            <img width="60" height="60" @load="loadImg" v-lazy="item.imgurl" alt="">
                          </div>
                          <div class="text">
                            <h2 class="listname" v-html="item.creator.name"></h2>
                            <p class="listdesc" v-html="item.dissname"></p>
                          </div>
                      </li>
                      <li style="height:3rem;" v-if="palylistState"></li>
                  </ul>
              </div>
            </scroll>
          </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend,getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slide'
import Scroll from 'base/scroll'
import Loading from 'base/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins:[playlistMixin],
  name: 'Recommend',
  data(){
    return {
      recommend:[],
      discList:[],
      checkimg:false,
      palylistState:false,
    }
  },
  created () {

    this._getRecommend()
    this._getDiscList();
  },
  methods:{
    handlePlaylist(playlist){
      this.palylistState = playlist.length>0?true:false
    },
    toDisc(o){
      this.$router.push({
        path:`/recommend/${o.dissid}`
      })
      this.setDisc(o)
    },
    _getRecommend(){
      getRecommend().then(res=>{
        if(res.code == ERR_OK){
          this.recommend = res.data.slider;
        }
      })
    },
    loadImg(){
        this.$refs.scroll.refresh()
    },
    _getDiscList(){
      getDiscList().then(res =>{
        if(res.code === ERR_OK){
          this.discList = res.data.list
        }
      })
    },
    ...mapMutations({
      setDisc:'SET_DISC'
    })
  },
  mounted(){
    const l = window.screen.availHeight - this.$refs.gedan.offsetTop -190 ;
    document.querySelector('.scroll-box').style.height = l+'px';
    window.addEventListener('resize',()=>{
      this.$refs.scroll.refresh()
    })
  },
  components:{
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .recommend{
    margin-top:2rem;
  }
  .recommendlist{
    padding-bottom 4.5rem
  }
  .slider-wrap
    width:97%
    overflow:hidden
    margin:3% auto
    border-radius:.4rem
    position relative
  .scroll-box{
    height: 16.4rem;
    overflow: hidden;
  }
  .list-title
    font-size:.6rem
    color:#f8ba23
    padding: 0.3rem 0;

  ul li{list-style: none;}
  ul{margin: 0;padding: 0;}
  .item {
      display: flex;
      padding:.3rem 5%;
  }
  .item .icon {
      width: 21%;
      margin-right: 2%;
  }
  .item .text{
      display: flex;
      flex-direction: column;
      text-align: left;
      margin-left: 3%;
      color: #fff;
      line-height: .9rem;
      justify-content: center;
  }
  .item .text .listname{
      font-size: .56rem;
      margin: 0;
  }
  .item .text .listdesc{
      font-size: .45rem;
      margin: 0;
      color: #a1a1a1;
  }
</style>
