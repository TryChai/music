<template>
    <transition name="slide" >
        <div class="user">
            <div class="user-top">
                <div class="user-back" @click.stop="back"><i class="icon-back"></i></div>
                <div class="switches">
                     <switches :switches="switches" :currentIndex="currentIndex" @selectSwitch="selectSwitch"></switches>
                </div>
               
            </div>
            <div class="random" @click.stop="random">
                <i class="icon-play"></i>
                <div>随机播放全部</div>
            </div>
            <div class="list" >
                <Scroll :data="likeList" v-if="currentIndex === 0&&likeList.length>0" :wrapperStyle="wrapperStyle" ref="likeList">
                    <SongList :songs="likeList" @selectSong="selectSong"></SongList>
                </Scroll>
                <Scroll :data="playHistory" v-if="currentIndex === 1&&playHistory.length>0" :wrapperStyle="wrapperStyle" ref="playHistory">
                    <SongList :songs="playHistory" @selectSong="selectSong"></SongList>
                </Scroll>
            </div>
            <toast :text="text" ref="toast"></toast>
            <noResult v-if="noResultShow" :title="noResultText"></noResult>
        </div>    
    </transition>
</template>

<script>
import switches from 'base/switches'
import Scroll from 'base/scroll'
import {mapGetters,mapActions} from 'vuex'
import SongList from 'components/song-list'
import toast from 'base/toast'
import Song from 'common/js/song'
import noResult from 'base/no-result'
export default {
    name:'user',
    data(){
        return {
            switches:[
                {name:'我喜欢的'},
                {name:'最近播放'}
            ],
            currentIndex:0,
            wrapperStyle:'listwrapper',
            text:''
        }
    },
    methods: {
        back(){
            this.$router.go(-1)
        },
        selectSwitch(index){
            this.currentIndex = index
            setTimeout(()=>{
                 this.$refs.likeList&&this.$refs.likeList.scrollTo(0,0)
                this.$refs.playHistory&&this.$refs.playHistory.scrollTo(0,0)
            },30)
           
        },
        selectSong(item){
            if(this.currentSong.id === item.id){
                this.text="该歌曲正在播放种..."
                this.$refs.toast.show()
                return
            }
            this.text="1首歌曲成功加入播放列表"
            this.$refs.toast.show()
            this.inserSong(new Song(item))
        },
        random(){
            let list = this.currentIndex === 0 ? this.likeList : this.playHistory
            if(!list||list.length === 0){
                return
            }
            list = list.map(item=>{
                return new Song(item)
            })
            this.randomPlay({
                list
            })
            // this.$router.go(-1)
            // this.showFlag = false
        },
        ...mapActions([
            'inserSong',
            'randomPlay'
        ])
    },
    computed: {
        noResultShow(){
            if(this.currentIndex === 0){
                return !this.likeList.length
            }else{
                return !this.playHistory.length
            }
        },
        noResultText(){
            if(this.currentIndex === 0){
                return '暂无收藏歌曲'
            }else{
                return '你还没听过歌曲'
            }
        },
        ...mapGetters(['likeList','playHistory','currentSong'])
    },
    components:{
        switches,
        Scroll,
        SongList,
        toast,
        noResult
    }
}
</script>

<style lang="">
    .slide-enter-active,.slide-leave-active{
        transition:all .2s
    }
    .slide-enter,.slide-leave-to{
        transform: translate3d(100%,0,0)
    }
    .user{
        position: fixed;
        top: 0%;
        left: 0%;
        bottom: 0%;
        height: 100%;
        width: 100%;
        max-width: 640px;
        right: 0%;
        margin: auto;
        background: #222;
        z-index: 500;
    }
    .user-top{
        display: flex;
    }
    .user-back {
        color: #f8ba23;
        margin-top: 1.3rem;
        margin-left: .5rem;
        font-size: .9rem;
        margin-top: 2rem;
        position: relative;
    }
    .switches {
        flex: 3;
        margin-left: -1rem;
        max-width: 15rem;
    }
    .list {
        /* height: 25rem;
        overflow: hidden; */
    }
    .listwrapper{
        height: 23rem;
        overflow: hidden;
    }
    .random {
        display: flex;
        color: #777;
        font-size: .58rem;
        width: 5rem;
        text-align: center;
        margin: auto;
        border-radius: 1.3rem;
        border: .05rem solid #777;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        padding: .4rem .3rem;
        margin-bottom: .6rem;
    }
    .random i {
        margin-right: .3rem;
        font-size: .6rem;
    }
</style>