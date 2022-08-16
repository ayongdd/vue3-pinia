<template>
    <div style="padding-top: 20px">
        定义全局变量 ---> {{$env}}

        <!--自定义指令 v-move-->
        <div v-move class="box" >
            <div class="header">拖动</div>
            <div>内容</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { DirectiveBinding,Directive,ref } from 'vue'

    const style = ref('red')
    //自定义指令
    const vMove:Directive = (el:HTMLElement,bingding:DirectiveBinding)=>{
        let moveElement = el.firstElementChild as HTMLDivElement
        console.log(moveElement);
        const mouseDown = (e:MouseEvent)=>{
            let X = e.clientX - el.offsetLeft
            let Y = e.clientY - el.offsetTop
            const move = (e:MouseEvent)=>{
                el.style.left = e.clientX - X +'px'
                el.style.top = e.clientY - Y +'px'
            }
            document.addEventListener("mousemove",move)
            document.addEventListener("mouseup",()=>{
                document.removeEventListener("mousemove",move)
            })
        }
        moveElement.addEventListener("mousedown",mouseDown)
    }
</script>

<style scoped lang="stylus">
    /*全局选择器*/
    :global(div) {
        color red
    }
    .div { //动态样式
        color v-bind(style)
    }
    .box {
        position absolute
        left 10px;
        top:50px;
        width 100px
        height 100px
        /*background-color red*/
        border 1px solid #ddd;
        //:deep() 样式穿透用于覆盖UI库原样式
        :deep(.header)  {
            width 100px
            height 20px
            background-color #666
        }
    }
</style>
