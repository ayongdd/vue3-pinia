import { createApp,toRaw } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import 'animate.css';
import './assets/css/base.css'
import './assets/css/main.styl'
import BaseComponents from './components/base'
// import BaseDirective from './directive'
import { createPinia,PiniaPluginContext } from 'pinia' //pinia替代vuex

import { Checkbox,
    CheckboxGroup,
    Button,Popover,
    Popup,IndexBar,
    IndexAnchor,RadioGroup,
    Radio,Cell, CellGroup,
    Calendar,Uploader,
    Field,
    Swipe, SwipeItem,
    ImagePreview,
    Image as VanImage,
    PasswordInput,
    NumberKeyboard,
    Switch,
    ActionSheet,
    Dialog,
    List,
    Loading
} from 'vant';

const app = createApp(App)

app.use(Checkbox)
    .use(CheckboxGroup)
    .use(Button)
    .use(Popover)
    .use(Popup)
    .use(IndexBar)
    .use(IndexAnchor)
    .use(Radio)
    .use(RadioGroup)
    .use(Cell)
    .use(CellGroup)
    .use(Calendar)
    .use(Uploader)
    .use(Field)
    .use(Swipe)
    .use(SwipeItem)
    .use(ImagePreview)
    .use(VanImage)
    .use(PasswordInput)
    .use(NumberKeyboard)
    .use(Switch)
    .use(ActionSheet)
    .use(Dialog)
    .use(List)
    .use(Loading)
app.use(BaseComponents)
// app.use(BaseDirective)

//实现pinia持久化存储
type Options = {
    key?:string
}
const _piniaKey:string = "morenkey"
const setStorage = (key:string,value:any)=>{
    localStorage.setItem(key,JSON.stringify(value))
}
const getStorage = (key:string)=>{
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string):{}
}
const piniaPlugin = (options:Options)=>{
    // console.log('context',context);
    return (context:PiniaPluginContext)=>{
        const {store} = context
        const data = getStorage(`${options?.key ??_piniaKey}-${store.$id}`)
        store.$subscribe((arg,state)=>{
            setStorage(`${options?.key ?? _piniaKey}-${store.$id}`,toRaw(store.$state))
        })
        console.log(data);
        return {
            ...data
        }
    }
}

const stores = createPinia()
stores.use(piniaPlugin({
    key:"pinia"
}))
app.use(stores)

// vue3设置全局变量
app.config.globalProperties.$env = "dev"

app.use(store).use(router).mount('#app')
