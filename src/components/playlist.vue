<template>
    <transition name='playlist'>
        <div class='playlist-box' v-show="playlistShow" @click='hide'>
            <div class='playlist' @click.stop>
                  <!-- 上面随机选择跟垃圾桶   -->
                  <div class='playlist-top' @click.stop.prevent="modeChange">
                      <div class="modebox" @click="changeMode"><i class='icon-top' :class="iconMode"></i><span>{{modeText}}</span></div>
                      <div><i class="icon-clear" @click.stop.prevent="showConfirm"></i></div>
                  </div>
                  <!-- 中间的列表 -->
                  <scroll id='middlelist' ref='middlelist' :refreshDelay="refreshDelay">
                      <transition-group name="ullsit" tag="ul">
                          <li :key="index" ref='scrollLi' v-for="(item,index) in sequenceList" @click.stop="play(item,index)">
                              <i :class='getIcon(item)' class="icon-one"></i>
                              <div class="name">{{item.name}}</div>
                              <div class="icon-right"><i @click.stop.prevent="nextPlay(item)" :class='getNext(item,index)'></i><i class=" i-left" :class="getLike(item)" @click.stop.prevent="toggleLike(item)"></i> <i @click.stop.prevent="deleteOne(item)" class="icon-delete"></i></div>
                          </li>
                      </transition-group >
                  </scroll>
                  <!-- 最后面的添加按钮 -->
                  <button class='addSong' @click.stop.prevent='addSong'><i class='icon-add'></i> 添加歌曲到列表</button>
                  <!-- 最后的关闭按钮 -->
                  <div class="closeBtn" @click.stop='hide'>关闭</div>
            </div>
            <confirm ref="confirm" content="是否清空播放列表？" confirmBtnText="清空" @confirm="emptySong"></confirm>
            <addSong ref="addSong" @needRefresh="needRefresh"></addSong>
        </div>
    </transition>
</template>
<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import scroll from 'base/scroll'
import confirm from 'base/confirm'
import {playmodeMixin,likeMixin} from 'common/js/mixin'
import addSong from 'components/add-song'
export default {
    name:'playlist',
    mixins:[playmodeMixin,likeMixin],
    data(){
        return {
            playlistShow:false,
            refreshDelay:300
        }
    },
    computed:{
        ...mapGetters(['sequenceList','currentSong','mode','playList']),
        modeText(){
           return this.mode == 0 ?'顺序播放':this.mode==1?'单曲循环':'随机播放'
        }
    },
    methods:{
        showConfirm(){
            this.$refs.confirm.show()
        },
        show(){
            this.playlistShow = true
            setTimeout(()=>{
                this.$nextTick(()=>{
                    this.$refs.middlelist.refresh()
                    this.scrollToCurrentSong(this.currentSong)
                })
            },20)
        },
        addSong(){
            this.$refs.addSong.show();
        },
        needRefresh(){
            setTimeout(()=>{
                this.$nextTick(()=>{
                    this.$refs.middlelist.refresh()
                    this.scrollToCurrentSong(this.currentSong)
                })
            },200)
        },
        modeChange(){
            setTimeout(()=>{
                this.$nextTick(()=>{
                    this.$refs.middlelist.refresh()
                    this.scrollToCurrentSong(this.currentSong)
                })
            },200)
        },
        emptySong(){
            this.hide();
            this.emptySonglist();
        },
        hide(){
            this.playlistShow = false
        },
        getNext(item,index){
            let _index = this.sequenceList.findIndex((song)=>{return song.id === this.currentSong.id})
            if(this.mode !=2 && item.id!==this.currentSong.id && _index+1!=index){
                return 'icon-next'
            }
            return ''
        },
        getIcon(item){
            if(this.currentSong.id === item.id){
                return 'icon-play'
            }
            return ''
        },
        deleteOne(item){
            this.deleteOneSong(item)
            if(!this.sequenceList.length){
                this.hide()
            }
        },
        play(item,index){
            if(this.mode == 2){
                index = this.playList.findIndex((song)=>{
                    return song.id === item.id
                })
            }
           this.setCurrentIndex(index)
           this.setPlayState(true)
        },
        scrollToCurrentSong(current){
            let index = this.sequenceList.findIndex((song)=>{
                return song.id === current.id
            })
            this.$refs.middlelist.scrollToElement(this.$refs.scrollLi[index-1],300)
        },
        ...mapMutations({
            setCurrentIndex:'SET_CURRENT_INDEX',
            setPlayState:'SET_PLAY_STATE',
        }),
        ...mapActions([
            'deleteOneSong',
            'nextPlay',
            'emptySonglist'
        ])
    },
    watch:{
        currentSong(newSong,oldSong){
            if(this.playlistShow && newSong.id !== oldSong.id){
                setTimeout(()=>{
                    this.$nextTick(()=>{
                        this.scrollToCurrentSong(newSong)
                    })
                },20)
            }
        }
    },
    components:{
        scroll,
        confirm,
        addSong
        
    }
}
</script>
<style lang="">
    .playlist-enter-active,.playlist-leave-active{
        transition: all .4s cubic-bezier(0.455, 0.03, 0.515, 0.955)
    }
    .playlist-enter,.playlist-leave-to{
        transform: translate3d(0,100%,0)
    }
    .ullsit-enter-active,.ullsit-leave-active{
        transition: all .2s cubic-bezier(0.445, 0.05, 0.55, 0.95)
    }
    .ullsit-enter,.ullsit-leave-to{
      opacity: 0;
      transform: translate3d(0,-50%,0)
    }
    .modebox{
        color: #f8ba23;
        display: flex;
    }
    .modebox .icon-top{
        font-size: 1rem;
        margin-right: .4rem;
    }
    .modebox span {
        font-size: .66rem;
        line-height: 1rem;
    }
    .playlist-box{
        position: fixed;
        top: 0%;
        left: 0%;
        right: 0%;
        margin: auto !important;
        z-index: 200;
        max-width: 640px;
        width: 100%;
        height: 100%;
        background: transparent;
    }
    .playlist {
        width: 100%;
        position: absolute;
        bottom: 0%;
        left: 0%;
        right: 0%;
        width: 100%;
        max-width: 640px;
        margin: auto;
        min-height: 8rem;
        /* max-height: 15rem; */
        background: #333;
        overflow: hidden;
        -webkit-animation: show .3s ease-in-out;
        animation: show .3s ease-in-out;
    }
    @keyframes show{
        0%{
            transform: translate3d(0,100%,0);
            opacity: 0;
        }
        100%{
            transform:translate3d(0,0%,0);
            opacity: 1;
        }
    }
    .playlist-top {
        display: flex;
        justify-content: space-between;
        color: #777;
        font-size: .65rem;
        padding: .3rem .9rem;
        margin: .3rem 0;
    }
   #middlelist {
        max-height: 12rem;
        overflow: hidden;
        height: auto;
    }
    /*#middlelist
    .middlelist ul */
   #middlelist ul li {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        color: #777;
        font-size: .56rem;
        padding: .1rem .8rem .1rem 1.3rem;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        position: relative;
    }
   #middlelist ul li .i-left{
        margin-right: .3rem;
    }
   #middlelist ul li .icon-next{margin-right:.45rem;font-size: .68rem;color: #f8ba23;}
   #middlelist ul li .icon-one{
        position: absolute;
        left: .4rem;
        color: #f8ba23;
        top: 0.29rem;
    }
    #middlelist ul li .name {
        width: 10rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
   #middlelist ul li .icon-delete {
        color: #f8ba23;
    }
    #middlelist ul li .icon-right{
        margin-top: .2rem;
    }
    .addSong {
        background: transparent;
        border: 1px solid #777;
        outline: none;
        color: #777;
        margin: auto;
        width: -webkit-fit-content;
        width: -moz-fit-content;
        width: fit-content;
        padding: .3rem 1rem;
        border-radius: 1rem;
        margin-top: .8rem;
        /* height: 1rem; */
        font-size: .6rem;
        margin-bottom: 2.5rem;
    } 
  .addSong .icon-add{
        font-size: .5rem;
        margin-right: .1rem;
    }
    .closeBtn {
        background: #111;
        font-size: .6rem;
        color: #999;
        padding: .54rem 0;
        position: absolute;
        bottom: 0%;
        width: 100%;
        left: 0%;
        right: 0%;
        margin: auto;
        letter-spacing: .1rem;
        text-indent: .1rem;
    }
    .icon-active{
		color:#f34444 !important;
	}
</style>