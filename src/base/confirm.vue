/**
    主要用来做弹窗的
 */
<template>
    <div class="confirm-box" v-show="confirmShow" @click.stop.prevent>
        <div class="confirm-content">
            <div class="confirm-animation">
                <div class="confirm-text">{{content}}</div>
                <div class='confirm-btn'>
                    <button class='confirm-btn-left' @click.stop.prevent="cancel">{{cancelBtnText}}</button>
                    <button class='confirm-btn-right' @click.stop.prevent="confirm">{{confirmBtnText}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'confirm',
    data(){
        return {
            confirmShow:false
        }
    },
    props:{
        content:{
            type:String,
            default:'是否删除'
        },
        confirmBtnText:{
            type:String,
            default:'确认'
        },
        cancelBtnText:{
            type:String,
            default:'取消'
        },
        
    },
    methods:{
        hide(){
            this.confirmShow = false
        },
        show(){
            this.confirmShow = true
        },
        cancel(){
            this.hide();
            this.$emit('cancel')
        },
        confirm(){
            this.hide();
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="">
    .confirm-box {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 90;
        top: 0%;
        left: 0%;
        max-width: 640px;
        margin: auto;
        text-align: center;
        right: 0%;
    }
    .confirm-content {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        
    }
    .confirm-animation{
        min-width: 11rem;
        min-height: 2rem;
        background: #555;
        border-radius: .3rem;
        padding-top: .8rem;
        font-size: .63rem;
        color: #868686;
        animation: show .3s ease-in-out,scale .3s ease-in-out;
    }
    .confirm-btn {
        display: flex;
        -ms-flex-pack: distribute;
        justify-content: space-around;
        margin: .8rem 0 0;
        border-top: .01rem solid #666;
    }
    .confirm-btn button {
        width: 50%;
        padding: .5rem 0;
        background: transparent;
        border: none;
        color: #888;
        outline: none;
        font-size: .63rem;
    }
    .confirm-btn-left{
       border-right: .01rem solid #666 !important;
    }
   @keyframes show {
       0%{
           opacity: 0;
       }
       100%{
           opacity: 1;
       }
   }
   @keyframes scale {
       0%{
           transform: scale(.8)
       }
       50%{
           transform: scale(1.1)
       }
       100%{
           transform: scale(1)
       }
   }
</style>