<template>
  <div class="wrapper">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <!--<transition name="bounce">-->
        <component :is="Component" />
      </transition>
    </router-view>


    <!--配合meta 标签实现理由动画-->
    <!--<router-view #default="{route,Component}">-->
      <!--<transition :enter-active-class="`animate__animated  ${route.meta.transition}`">-->
        <!--&lt;!&ndash;<transition name="bounce">&ndash;&gt;-->
        <!--<component :is="Component" />-->
      <!--</transition>-->
    <!--</router-view>-->

    <div class="van-loading-wrap" v-if="loading">
      <van-loading type="spinner"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { Tabbar, TabbarItem } from "vant";
  import { useStore } from 'vuex'
  import { useTestStore } from './pinia'

  export default defineComponent({
    name: "App",
    components: {
      Tabbar,
      TabbarItem,
    },
    data() {
      return {
        siginInfo:{},
      }
    },
    created() {
      const store = useStore()
      store.dispatch("indexStore/getConfigs")
      store.dispatch("indexStore/getConf")
      store.dispatch("indexStore/switchs")
      store.dispatch("indexStore/platformAction")
      this.getData()
    },
    methods:{
      async getData() {
        const store = useStore()
        let res = await store.dispatch("indexStore/signInfo")
        // if(res.code === 0) {
        //   this.siginInfo = res.data
        // }
      }
    },
    watch:{
      $route(n,o) {
        if(n.path === '/' || n.path === '/books' || n.path === '/mine') {
          this.$store.commit("chatStore/setCurrentChatNull")
       }
      }
    },
    computed: {
      platform() {
        const store = useStore()
        return store.state.indexStore.platform
      },
      signInfo() {
        const store = useStore()
        return store.state.indexStore.signInfo
      },
      loading() {
        const store = useStore()
        return store.state.indexStore.loading
      },
      showFooter() {
        if(this.$route.path === '/' ||
                this.$route.path === '/books' ||
                this.$route.path ==='/find' ||
                this.$route.path === '/explore' ||
                this.$route.path === '/mine') {
          return true
        }
        return false
      },
    }
  })
</script>
<style lang="stylus">
  .sign_span {
    width 18px
    height 18px
    border-radius 18px
    background-color red
    color #ffffff
    display inline-block
    line-height 18px
    position absolute
    text-align center
    right: -11px;
    top: -6px;
  }
</style>
