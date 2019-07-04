<template>
    <div>
        <transition-group class="searchlist-Ul" tag="ul" name="slide">
            <li :key="item" v-for="item in data" @click="select(item)">
                <div>{{item}}</div>
                <div @click.stop.prevent='deleteOne(item)' class='icon-r'><i class="icon-delete"></i></div>
            </li>
            <li :key="Math.random()" style="height:2.5rem;" v-show="singerli"></li>
        </transition-group>
    </div>
</template>

<script>
export default {
    name:'',
    data(){
        return {
            singerli:false
        }
    },
    methods:{
        select(item){
            this.$emit('selectSearchItem',item)
        },
        deleteOne(item){
            this.$emit('deleteOne',item)
        },
        singerliShow(){
            this.singerli = true
        }
    },
    props:{
        data:{
            type:Array,
            default:[]
        }
    }
}
</script>
<style lang="">
    .slide-enter-active,.slide-leave-active{
        transition: all .2s
    }
    .slide-enter,.slide-leave-to{
        opacity: 0;
        transform: translate3d(0,-50%,0)
    }
    .searchlist-Ul{
        padding-bottom: .5rem;
    }
    .searchlist-Ul li {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        font-size: .56rem;
        padding: .3rem .8rem;
        color: #999;
    }
    .icon-r{
        font-size: .46rem;
        margin-right: .13rem;
    }
</style>

