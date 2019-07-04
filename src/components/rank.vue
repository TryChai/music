<template>
  <div>
    <Loading v-if="topList.length <1"></Loading>
    <scroll :data="topList" class="topList" ref='topList'>
      <ul class="rankListUl">
        <li v-for="item in topList" :key="item.id" @click.prevent="selectItem(item)">
            <div class="liLeft">
              <img v-lazy="item.picUrl" alt="">
            </div>
            <div class="liRight">
              <p v-for="(song ,index) in item.songList" :key="index"> <span>{{index+1}}</span><span>{{song.songname}} - {{song.singername}}</span></p>
             
            </div>
        </li>
        <li style="height:2.8rem;background:transparent" v-if="singerli"></li>
      </ul>
    </scroll>
   <router-view></router-view>
  </div>
</template>

<script>
import {getToplist} from 'api/rank'
import scroll from 'base/scroll'
import Loading from 'base/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations,mapGetters} from 'vuex'
export default {
  mixins:[playlistMixin],
  name: 'rank',
  data () {
    return {
      topList:[]
    }
  },
  created(){
    this._getTopList()
  },
  computed:{
    ...mapGetters(['singerli'])
  },
  methods:{
    handlePlaylist(playlist){
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.$refs.topList.refresh()
        })
      },50)
    },
    selectItem(item){
      this.$router.push({path:`/rank/${item.id}`})
      this.setTopList(item)
    },
    _getTopList(){
      getToplist().then(res=>{
        // console.log(res.data.topList)
        this.topList = res.data.topList
      })
    },
    ...mapMutations({
      setsingerLi:'SET_SINGER_LI',
      setTopList:'SET_TOP_LIST'
    })
  },
  components:{
    scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .topList{height: 26rem;overflow: hidden;}
  .rankListUl{padding:0 5%;margin-top: 13%;width: 100%;box-sizing:border-box;padding-bottom: 2.3rem;}
  .rankListUl li{display: flex;background: #444;margin-top: 4%;}
  .rankListUl li .liLeft{flex:1;    border: 1px solid #666;}
  .rankListUl li .liLeft img{display: block}
  .rankListUl li .liRight {-webkit-box-flex: 3;-ms-flex: 3;flex: 3;text-align: left;-webkit-box-sizing: border-box;box-sizing: border-box;padding-left: 3%;color: #ccb;display: flex;flex-direction: column;justify-content: center;
  }
  .rankListUl li .liRight p{font-size: 0.6rem;padding: 0.14rem 0;white-space: nowrap;overflow: hidden;width: 10rem;text-overflow: ellipsis;}
  .rankListUl li .liRight p span:first-child{margin-right: .5rem;}
  @media screen and (min-width: 640px){
     .topList{height: 24rem;overflow: hidden;}
     .rankListUl{padding:0 5%;margin-top: 13%;width: 100%;box-sizing:border-box;padding-bottom: 6rem;}
  }
</style>
