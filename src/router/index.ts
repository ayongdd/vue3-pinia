import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { getSession } from '@/common/common'

declare module 'vue-router' { //声明mete属性
  interface RouteMeta {
    title:string,
    transition:string
  }
}

const routes: Array<RouteRecordRaw> = [
  { path: '/TodoList', name: 'TodoList', component: () => import('@/views/TodoList.vue'),meta:{title:'todolist',transition:'animate__bounce'} },
  // { path: '/login', name: 'login', component: () => import('@/views/login.vue'),meta:{title:'登录',transition:'animate__bounce'} },
  // { path: '/register', name: 'register', component: () => import('@/views/register.vue'),meta:{title:'注册',transition:'animate__bounce'} },

  // { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue'),meta:{title:'首页',transition:'animate__rubberBand'}},
  //   //通讯录
  // { path: '/books', name: 'books', component: () => import('@/views/books.vue'),meta:{title:'通讯录',transition:'animate__headShake'} },
  //   //发现
  // { path: '/find', name: 'find', component: () => import('@/views/finds.vue'),meta:{title:'发现',transition:'animate__tada'} },
  //   //探索
  // { path: '/explore', name: 'explore', component: () => import('@/views/explore.vue'),meta:{title:'探索',transition:'animate__jello'} },
  // //我的
  // { path: '/mine', name: 'mine', component: () => import('@/views/mine.vue'),meta:{title:'我的',transition:'animate__heartBeat'} },

    //自定义指令
  { path: '/directive', name: 'directive', component: () => import('@/views/directive.vue') },
    //pinia插件
  { path: '/pinia', name: 'pinia', component: () => import('@/views/pinia.vue') },

]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior:(to,from,savePosition)=>{ //滚动行为 保存滚动信息
    console.log('savePosition',savePosition);
    if(savePosition) {
      return savePosition
    }else {
      return {
        top:0
      }
    }
  },
  routes
})

//路由守卫 （进入前）
const wihleList = ['/login','/register','/directive','/pinia','/TodoList'] //白名单
router.beforeEach((to, from, next) => {
  const isLogin = getSession('token') ? true :false
  if(wihleList.includes(to.path)) {
    next()
  }else {
    isLogin ? next():next('/login')
  }
})

//路由守卫 （进入后）
// router.afterEach((to,from,next)=>{})

export default router
