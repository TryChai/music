<template>
    <div>
        <scroll v-show='searchlist.length>0' :beforeScroll="beforeScroll" @beforeScroll='listScroll'  :data="searchlist" id="searchlist" :pullup="pullup" @scrollToEnd="scrollToEnd" ref="suggest">
            <ul class='searchListUl'>
                <li @click.stop.prevent="selectItem(item)" v-for="item in searchlist" :key="Math.random()">
                    <div class='icon-left'><i :class='getIcon(item)'></i></div>
                    <div class='text-right' v-html="getText(item)"></div>
                </li>
                <li v-show='setsinger' style="height:3rem"></li>
                <div class='nomore' v-show='nomore'>没有更多数据了</div>  
            </ul>
        </scroll>
        <div>
            <loading v-show='loading'></loading>
        </div>
        <div>
            <Noresult v-show="searchlist.length<=0 &&noresult"></Noresult>
        </div>
        <div>
            <toast text="该歌曲正在播放中..." ref="toast"></toast>
        </div>
        <router-view v-if="catZhida"></router-view>
    </div>
</template>

<script>
import {search} from 'api/search'
import {createSong} from 'common/js/song'
import loading from 'base/loading'
import scroll from 'base/scroll'
import {mapMutations,mapActions, mapGetters} from 'vuex'
import Noresult from 'base/no-result'
import toast from 'base/toast'
const TYPE_SINGER = 'Singer'
const perpage = 30
export default {
    name:'suggest',
    data(){
        return{
            searchlist:[],
            nomore:false,
            loading:false,
            pullup:true,
            hasMore:true,
            page:1,
            noresult:false,
            setsinger:false,
            beforeScroll:true,
        }
    },
    props:{
        query:{
            type:String,
            default:'',
        },
        catZhida:{
            type:Boolean,
            default:true
        },
        
    },
    watch:{
        query(){
            this._search()
        }
    },
    computed: {
        ...mapGetters(['singerli','currentSong'])
    },
    methods:{
        listScroll(){
            this.$emit('listScroll')
        },
        setsingerShow(){
            this.setsinger=true
            this.$refs.suggest.refresh()
        },
        refresh(){
            this.setsinger=false
            this.$refs.suggest.refresh()
        },
        _search(){
            if(this.query){
                this.searchlist = []
                this.loading = true
                this.hasMore = true
                this.noresult = false
                this.page = 1
                this.$refs.suggest.scrollTo(0,0)
                search(this.query,this.page,this.catZhida,perpage).then(res=>{
                    let ress = JSON.parse(res.substring(9,res.length-1))
                    let rst = ress.data
                    if(rst.song.list.length>0){
                        this.searchlist = []
                        this._nomailizeSearch(rst).then(res=>{
                           this.searchlist = res
                           this.loading = false
                           this._hasMore(rst.song);
                        })
                    }else{
                        this.searchlist = []
                        this.loading = false
                         this.nomore = true

                    }
                })
            }
        },
        scrollToEnd(){
            let that = this
            this.noresult = false
            if(!this.hasMore) return
            this.page++
            this.loading = true
            search(this.query,this.page,this.catZhida,perpage).then(res=>{
                let ress = JSON.parse(res.substring(9,res.length-1))
                let rst = ress.data
                this._nomailizeSearch(rst).then(res=>{
                    this.searchlist = this.searchlist.concat(res)
                    this.loading = false
                    this._hasMore(rst.song);
                    if(rst.song.length <= 0){
                        this.nomore = true
                    }
                })
            })
        },
        _hasMore(data){
            if(!data.list.length || (data.curnum + data.curpage*perpage) >= data.totalnum){
                this.hasMore = false
            }
        },
        selectItem(item){
            if(item.type === TYPE_SINGER ){
                let singer = {
                    id:item.singermid,
                    name:item.singername,
                    avatar:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.jpg?max_age=2592000`
                }
                this.$router.push({path:`/search/${singer.id}`})
                this.setSinger(singer)
            }else{
                // console.log(this.currentSong)
                if(item.id === this.currentSong.id){
                    this.$refs.toast.show()
                    return 
                }
                this.setsinger = true
                this.inserSong(item)
            }
            this.$emit('select')

        },
        clear(){
            this.searchlist = []
            this.nomore = false
        },
        getIcon(item){
            if(item.type === TYPE_SINGER){
                return 'icon-mine'
            }
             return 'icon-music'
        },
        getText(item){
            if(item.type === TYPE_SINGER){
                return item.singername
            }
            return `${item.name} - ${item.singer}`
        },
       async _nomailizeSearch(res){
            let ret = []
            if(this.catZhida&&res.zhida.singerid){
                ret.push({...res.zhida,...{type:TYPE_SINGER}})
            }
            if(res.song){
               return await this.getSong(res.song.list).then(res=>{
                    ret = ret.concat(res)
                    return ret
                })
            }
            // return ret
        },
         async getSong(list){
             let rets = []
            for(let item of list){
                if(item.songmid&&item.songmid!='0' && item.albumid){
                    await createSong(item).then(res=>{
                        if(res){
                            rets.push(res)
                            }
                        })
                }
            }
            return rets
        },
        ...mapMutations({
            setSinger:'SET_SINGER',
            setsingerli:'SET_SINGER_LI'
        }),
        ...mapActions([
            'inserSong'
        ])
    },
    components:{
        loading,
        scroll,
        Noresult,
        toast
    }
}
</script>

<style >
#searchlist{
    height: 23rem;
    overflow: hidden;
}
.searchListUl{
    margin-top: .4rem;
    padding-bottom: 1rem;
}
.searchListUl li {
    display: flex;
    padding: 0.28rem .8rem;
    font-size: .6rem;
    color: #555;
    width: 97%;
    margin: auto;
    box-sizing: border-box;
}
.icon-left{
    margin-right: .5rem;
    margin-top: .2rem;
}
.text-right {
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    padding: .2rem 0;
}
.nomore {
    font-size: .58rem;
    color: #666;
    margin-top: 1rem;
}
@media screen and (min-width: 640px){
    .searchlist{
        height: 13rem;
        overflow: hidden;
    }
}
</style>