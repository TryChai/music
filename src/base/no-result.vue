<template>
    <div>
        <div class='no-result-img'><img src="../assets/no-result@2x.png" alt=""> </div>  
        <p class='no-result-title'>{{title}}</p>
    </div>
</template>

<script>
export default {
    name:'np-result',
    props:{
        title:{
            type:String,
            default:'没有搜到数据，换个词试试'
        }
    },
}
</script>
<style>
    .no-result-img {
        width: 5rem;
        margin: 5rem auto .9rem;
    }
    .no-result-title {
        font-size: .56rem;
        color: #555;
        text-align: center;
        width: 100%;
    }
</style>
