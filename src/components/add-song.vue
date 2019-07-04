<template>
    <transition name="slide">
        <div v-show="showFlag" class="addSongBox" @click.stop.prevent>
            <div class="addSongTitle">
                <div class="text">添加歌曲到列表</div>
                <div @click.stop.prevent="hide"><i class="icon-close"></i></div>
            </div>
            <!-- 搜索框 -->
            <div class="search-box">
                <searchBox placeholder="搜索歌曲" ref="searchbox" @query="getQuery" @clear='clear'></searchBox>
            </div>
            <!-- 搜索结果 -->
            <div class="suggest" v-show="query">
                <suggest @listScroll='listScroll' @select="saveSearch"  :query='query' :page="page" :catZhida="catZhida" ref="suggest" ></suggest>
            </div>
            <div v-show="!query">
                <div>
                    <switches :switches="switches" :currentIndex="currentIndex" @selectSwitch="selectSwitch"></switches>
                </div>
                <div  class="" >
                    <Scroll :data="playHistory" ref="songlist" v-if="currentIndex === 0&&playHistory.length>0" wrapperStyle="songlist">
                        <div>
                            <song-list :songs="playHistory" @selectSong="selectSong"></song-list>
                        </div>
                    </Scroll>
                    <Scroll :refreshDelay="refreshDelay" ref="searchScroll" v-if="currentIndex === 1&&searchHistory.length>0" :data='searchHistory' wrapperStyle="songlist">
                         <searchList  ref="searchList" @deleteOne="deleteOneHistory" v-show="!query&&searchHistory.length>0" @selectSearchItem="selectHotKey" :data='searchHistory'></searchList>
                    </Scroll>
                </div>
            </div>
            <div>
                <noResult v-show="noResult" :title="noResultText"></noResult>
            </div>
            <div>
                <toast :text="text" ref="toast"></toast>
            </div>
        </div>
    </transition>
</template>

<script>
import searchBox from 'base/search-box'
import suggest from 'components/suggest'
import {searchMixin} from 'common/js/mixin'
import switches from 'base/switches'
import Scroll from 'base/scroll'
import {mapGetters,mapActions} from 'vuex'
import songList from 'components/song-list'
import Song from 'common/js/song'
import toast from 'base/toast'
import searchList from 'components/search-list'
import noResult from 'base/no-result'
export default {
    name:'add-song',
    mixins:[searchMixin],
    data(){
        return {
            showFlag:false,
            catZhida:false,
            page:1,
            switches:[
                {name:'最近播放'},
                {name:'搜索列表'}
            ],
            currentIndex:0,
            text:''
        }
    },
    methods:{
        show(){
            this.showFlag = true
            setTimeout(()=>{
                this.$nextTick(()=>{
                    if(this.currentIndex == 0){
                        this.$refs.songlist.refresh();
                    }else{
                        this.$refs.searchScroll.refresh()
                    }

                })
            },20)
        },
        hide(){
            this.showFlag = false
        },
        saveSearch(){
            // this.hide()
            this.text = '1首歌曲加入播放列表'
            this.$refs.toast.show()
            this.inserHistory(this.query)
            this.$emit('needRefresh')
        },
        selectSwitch(index){
            this.currentIndex = index
          
        },
        selectSong(item,index){
            if(index== 0){
                this.text = '该歌曲正在播放中...'
                this.$refs.toast.show()
                return
            }   
                this.text = '1首歌曲加入播放列表'
                this.$refs.toast.show()
                this.inserSong(new Song(item))
                 this.$emit('needRefresh') 
        },
        selectHotKey(item){
            this.$refs.searchbox.addQuery(item)
        },
        ...mapActions(['inserSong','deleteOneHistory',])
    },
    computed:{
        noResult(){
            if(this.currentIndex === 0){
                return !this.playHistory.length
            }else{
                return !this.searchHistory.length
            }
        },
        noResultText(){
            if(this.currentIndex === 0){
                return '你还没有播放歌曲哟~'
            }else{
                return '暂无搜索内容'
            }
        },
        ...mapGetters(['playHistory','searchHistory'])
    },
    components:{
        searchBox,
        suggest,
        switches,
        Scroll,
        songList,
        toast,
        searchList,
        noResult
    }
}
</script>

<style lang="">
    .slide-enter-active,.slide-leave-active{
        transition: all .4s
    }
    .slide-enter,.slide-leave-to{
        transform: translate3d(100%,0,0)
    }
    .addSongBox{
        position: fixed;
        top: 0%;
        left: 0%;
        right: 0%;
        bottom: 0%;
        width: 100%;
        max-width: 640px;
        z-index: 400;
        background: #222;
        margin: auto;
    }
   .addSongTitle {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        color: #f8ba23;
        font-size: .68rem;
        margin: .5rem auto;
        padding: .4rem .5rem;
    }
    .addSongTitle .text{
        flex: 4;
    }
    .search-box{
        margin-top: -2rem;
    }
    .songlist{
        height: 21rem;
        overflow: hidden;
    }
</style>
