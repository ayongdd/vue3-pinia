<template>
    <div>
        <!--菠萝插件替换vuex-->
        {{Test.current}} -- {{Test.name}}

        <button @click="checkedHandle">change</button>
        <button @click="changes">change1</button>
        <hr/>

        <div>
            <p>action-user:{{Test.user}}</p>
            <p>action-name:{{Test.name}}</p>
            <hr/>

            <p>getters:{{Test.newName}}</p>
            <hr>
            <button @click="change2">change2</button>
            <button @click="reset">reset</button>
        </div>

    </div>
</template>

<script lang="ts" setup>
    import { useTestStore } from '../pinia'
    import { storeToRefs } from 'pinia'
    const Test = useTestStore()

    console.log(Test.name);

    const change2 = ()=>{ //同步改变
        Test.setUser()
    }

    const reset = ()=>{ //还原值
        Test.$reset()
    }

    Test.$onAction((arg)=>{ //监听state值的变化,捕获error
        console.log(arg);
        arg.after(()=>{
            console.log(arg);
        })
    },true)

    Test.$subscribe((arg,state)=>{ //监听state值的变化
        console.log('===>',arg);
        console.log('====>',state);
    })
    //pinia 解构出来的值不具有响应式
    // const { current,name } = Test

    //转化成响应式
    const { current,name } = storeToRefs(Test)
    const changes = ()=>{
        current.value ++
    }


    // 改变pinia state值的五种方法
    // 1.
    // const checkedHandle = ()=>{
    //     Test.current++
    // }

    //2.
    // const checkedHandle = ()=>{
    //     Test.$patch({
    //         current:888,
    //         name:'哈哈'
    //     })
    // }

    //3.
    // const checkedHandle = ()=>{
    //     Test.$patch((state)=>{
    //         state.current = 999
    //         state.name = "菠萝"
    //     })
    // }

    //4. 不常用
    // const checkedHandle = ()=>{
    //     Test.$state = {
    //         current:9999,
    //         name:"菠萝1"
    //     }
    // }

    //5.
    const checkedHandle = ()=>{
        Test.setCurrent(567)
    }
</script>

<style scoped>

</style>
