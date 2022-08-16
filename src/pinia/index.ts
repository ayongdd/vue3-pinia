import { defineStore } from 'pinia'

import { Names } from './store-name'

type User = {
    name:string,
    age:number
}

let result:User = {
    name:"飞机",
    age:999
}

let Login = ():Promise<User>=>{
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve({
                name:"飞机1",
                age:200
            })
        },2000)
    })
}
// 测试使用在App.vue 文件
export const useTestStore = defineStore(Names.TEST,{
    state:()=>{
        return {
            current:1,
            name:"pinia",
            user:<User>{},
        }
    },
    //computed 修饰一些值
    getters:{
        newName():string {
            return `$-${this.name}-${this.getAge}`
        },
        getAge():number {
            return this.user.age
        },
    },
    //method 可以同步和异步，提交state
    actions:{
        setCurrent(num:number) {
            this.current = num
        },
        // setUser() { //同步
        //     this.user = result
        // },
        async setUser() { //异步
           const result =  await Login()
           this.user = result
           this.setName("大飞机")
        },
        setName(name:string) {
            this.name = name
        }
    }
})
