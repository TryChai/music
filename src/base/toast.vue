<template>
    <div id="toast" v-show="showFlag" @click.stop.prevent="hide">
        <div class="toast-content">{{text}}</div>
        <span></span>
    </div>
</template>

<script>
export default {
    name:'toast',
    data() {
        return {
            showFlag:false,
            timer:null,
        }
    },
    props:{
        text:{
            type:String,
            default:''
        },
        delay:{
            type:Number,
            default:1500
        }
    },
    methods: {
        show(){
            this.showFlag = true
            if( this.timer ){
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(()=>{
                this.$nextTick(()=>{
                    this.hide()
                })
            },this.delay)
        },
        hide(){
            this.showFlag = false
        }
    },
}
</script>
<style lang="">
    #toast{
        position: fixed;
        top: 0%;
        bottom: 0%;
        left: 0%;
        right: 0%;
        margin: auto;
        width: 100%;
        height: 100%;
        max-width: 640px;
        background: transparent;
        font-size: 0;
        z-index: 900;
    }
    .toast-content {
        background: #666;
        font-size: .56rem;
        padding: .35rem 1rem;
        border-radius: .2rem;
        color: #c8c8c8;
        display: inline-block;
        vertical-align: middle;
        margin: auto;
        animation: show .2s ease-in-out;
    }
    @keyframes show{
        0%{
            opacity: 0;
            transform: scale(.8)
        }
        50%{
          transform: scale(1.1)  
        }
        100%{
            opacity: 1;
            transform: scale(1) 
        }
    }
    #toast span{
        display: inline-block;
        vertical-align: middle;
        height:100%;
    }
</style>