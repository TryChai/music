<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <loading v-show="!singers.length>0"></loading>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerlist} from 'api/singer'
  import {ERR_OK} from 'api/config'
  const Hot_Name="热门"
  const Hot_Singer_Size = 10
  import ListView from 'base/listview'
  import {mapMutations} from 'vuex'
  import Loading from 'base/loading'
export default {
  name: 'singer',
  data () {
    return {
      singers:[],
    }
  },
  activated(){
    this._getSingerlist();
  },
  methods:{
    

    selectSinger(singer){
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      this.setSinger(singer)
      // this.$store.commit('SET_SINGER',singer)
    },
    _getSingerlist(){
      getSingerlist().then((res)=>{
        if(res.code == ERR_OK){
          this.singers = this._normalSingerlist(res.data.list)
        }
      })
    },
    _normalSingerlist(list){
      let hot={
          title:Hot_Name,
          items:[]
        }
      let map={}
      list.map((x,y)=>{
        if(y<Hot_Singer_Size){
         hot.items.push({
              id:x.Fsinger_mid,
              name:x.Fsinger_name,
              avatar:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${x.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        const key = x.Findex
        if(!map[key]){
          map[key] = {
            title:key,
            items:[]
          }
        }
          map[key].items.push({
                id:x.Fsinger_mid,
                name:x.Fsinger_name,
                avatar:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${x.Fsinger_mid}.jpg?max_age=2592000`
            })
      })
     let ret = [],lut = [];
     lut.push(hot)
    for(var item in map){
      if(item.match(/[a-zA-Z]/)){
         ret.push(map[item])
      }
    }
     ret.sort((a,b)=>{
        return a.title.charCodeAt(0)-b.title.charCodeAt(0);
     })
      return lut.concat(ret)
     
    },
     ...mapMutations({
        setSinger:'SET_SINGER'
    }),
  },
  components:{
    ListView,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer{
  width: 100%;
  max-width: 640px;
  margin: auto;
  margin-top: 2rem;
  position: relative;
}
</style>
