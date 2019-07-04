<template>
    <div>
        <ul class="switchesUl">
            <li v-for="(item,index) in switches" :class="{'active':currentIndex === index}" @click.stop.prevent="selectSwitch(index)">
                <span>{{item.name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:'switches',
    data(){
        return {

        }
    },
    props:{
        switches:{
            type:Array,
            default:[]
        },
        currentIndex:{
            type:Number,
            default:0
        }
    },
    methods: {
        selectSwitch(index){
            this.$emit('selectSwitch',index)
        }
    },
}
</script>
<style lang="">
    .switchesUl {
        display: flex;
        flex-wrap: nowrap;
        border: .05rem solid #666;
        width: 62%;
        margin: .9rem auto;
        border-radius: .2rem;
    }
    .switchesUl li {
        color: #777;
        font-size: .55rem;
        width: 50%;
        flex-wrap: nowrap;
        padding: .5rem 0;
        background: #363636;
    }
    .switchesUl li.active{
        background: #222;
        color: #d2d2d2;
    }
    .switchesUl li:nth-child(1){
        border-radius: .2rem 0 0 .2rem;
    }
    .switchesUl li:last-child{
         border-radius:0 .2rem .2rem 0;
    }
</style>