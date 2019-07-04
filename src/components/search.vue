<template>
  <div>
      <search-box ref="searchbox" @query="getQuery" @clear='clear'></search-box>
      <scroll :refreshDelay="refreshDelay" :data="scrollData" id='shortCut' v-show="!query" ref='shortCut'>
        <div>
          <div class="hotKey" >
            <div class='hotKey-title'>热门搜索</div>
              <ul class='hotKey-ul'>
                <li v-for='item in hotkey' @click.prevent='selectHotKey(item.k)'>{{item.k}}</li>
              </ul>
          </div>
          <!-- 搜索历史 -->
          <div>
            <div class='searchlist-box' v-show="!query&&searchHistory.length>0">
              <p>搜索历史</p>
              <i @click.stop.prevent="confirmShow" class='icon-clear'></i>
            </div>
            <searchList  ref="searchList" @deleteOne="deleteOneHistory" v-show="!query&&searchHistory.length>0" @selectSearchItem="selectHotKey" :data='searchHistory'></searchList>
          </div>
        </div>
      </scroll>
      <div>
          <suggest @listScroll='listScroll' @select="saveSearch" v-show="query" :query='query' :page="page" :catZhid="catZhida" ref="suggest"></suggest>
      </div>
      <!-- 弹窗 -->
      <confirm ref='confirm' @confirm="deleteAllHistory" content="是否清空所有搜索历史" confirmBtnText="清空" ></confirm>
  </div>
</template>

<script>
import searchBox from 'base/search-box'
import {getHotKey} from 'api/search'
import suggest from 'components/suggest'
import {mapActions,mapGetters} from 'vuex'
import searchList from 'components/search-list'
import confirm from 'base/confirm'
import scroll from 'base/scroll'
import {playlistMixin,searchMixin} from 'common/js/mixin'
export default {
  mixins:[playlistMixin,searchMixin],
  name: 'search',
  data () {
    return {
      hotkey:[],
      page:1,
      catZhida:true,
    }
  },
  created(){
    this._getHotKey();
  },
  watch:{
   query(newQuery){
     if(!newQuery){
       setTimeout(()=>{
         this.$nextTick(()=>{
           this.$refs.shortCut.refresh()
         })
       },20)
     }
   }
  },
  computed:{
    ...mapGetters(['searchHistory','singerli']),
    scrollData(){
       return this.hotkey.concat(this.searchHistory)
    }
  },
  methods:{
    handlePlaylist(playlist){
      if(playlist.length>0){
        if(this.singerli){
          setTimeout(()=>{
            this.$nextTick(()=>{
              this.$refs.searchList.singerliShow()
              this.$refs.suggest.setsingerShow()
            })
          },30)

        }
      }
      this.$refs.shortCut.refresh()
    },
    selectHotKey(item){
      this.$refs.searchbox.addQuery(item)
    },
    saveSearch(){
        this.inserHistory(this.query)
        this.$emit('needRefresh')
    },
    confirmShow(){
      this.$refs.confirm.show()
    },
    _getHotKey(){
      getHotKey().then(res=>{
        this.hotkey = res.data.hotkey.slice(0,15)
      })
    },
    ...mapActions(['deleteAllHistory'])
  },
  components:{
    searchBox,
    suggest,
    searchList,
    confirm,
    scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#shortCut{
  height:22rem;
  overflow :hidden;
  // padding-bottom :2rem;
}
 .hotKey {
     text-align: left;
     padding: 0 .8rem;
     margin-top: .8rem;
 }
  .hotKey-title{
    color: #aaa;
    font-size: 0.56rem;
  }
  .hotKey-ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    font-size: 0.53rem;
    color: #888;
    margin-top: 0.5rem;
 }
 .hotKey-ul li{
    margin: 0.3rem .35rem;
    background: #555;
    padding: .3rem .5rem;
    border-radius: .4rem;
 }
 .searchlist-box {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem .8rem;
    font-size: .56rem;
    margin-top: .5rem;
    color: #999;
}
</style>
