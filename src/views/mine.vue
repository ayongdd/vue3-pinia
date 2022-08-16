<template>
    <div class="mine">
        <div class="top_wrap">
            我的

            <div class="my_info_wrap flex" @click="goRouter('/info')">
                <div class="my_info_left flex">
                    <img :src="myInfo.avatar" alt="" v-if="myInfo.avatar">
                    <img src="@/assets/images/member.png" alt="" v-else>

                    <div class="center_content">
                        <p>{{myInfo.nick}}</p>
                        <p>账号：{{myInfo.account}}</p>
                    </div>
                </div>

                <i class="iconfontyyy">&#xe629;</i>
            </div>
        </div>

        <div class="mine_wrap" style="margin-top: 50px;margin-bottom: 20px">
            <div class="c_item flex" @click="goRouter('/wallet')">
                <div class="_left flex">
                    <i class="iconfontyyy icon">&#xe6b1;</i>
                    <span>我的钱包</span>
                </div>
                <i class="iconfontyyy">&#xe629;</i>
            </div>
            <div class="c_item flex" @click="goRouter('/signIn')">
                <div class="_left flex">
                    <i class="iconfontyyy icon">&#xe61d;</i>
                    <span>签到</span>
                </div>
                <div>
                    <span style="color: #666" v-if="signInfo.issign == 1">今天已签到</span>
                    <span style="color: #666" v-if="signInfo.issign == 0">今天签到可得{{signInfo.gold_count}}积分 <span class="isSign"></span></span>
                    <i class="iconfontyyy">&#xe629;</i>
                </div>
            </div>
        </div>



        <div class="mine_wrap">
            <div class="c_item flex" @click="goRouter('/setting')">
                <div class="_left flex">
                    <i class="iconfontyyy icon">&#xe60b;</i>
                    <span>设置</span>
                </div>
                <i class="iconfontyyy">&#xe629;</i>
            </div>
            <div class="c_item flex" @click="goRouter('/revise_pwd')">
                <div class="_left flex">
                    <i class="iconfontyyy icon">&#xe7b7;</i>
                    <span>修改密码</span>
                </div>
                <i class="iconfontyyy">&#xe629;</i>
            </div>

            <div class="c_item flex" @click="goRouter('/report')">
                <div class="_left flex">
                    <i class="iconfontyyy icon">&#xe613;</i>
                    <span>投诉举报</span>
                </div>
                <i class="iconfontyyy">&#xe629;</i>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
    import router from '@/router'
    import { ref,computed } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()
    const myInfo = ref(store.getters["chatStore/myInfo"])
    const signInfo = computed(()=>store.state.indexStore.signInfo)
    const goRouter = (name)=>{
        router.push(name)
    }
</script>

<style scoped lang="stylus">
   .mine {
       .top_wrap {
           background-color #409eff
           color #ffffff
           padding 20px
           height 95px
           position relative
           font-size 20px
           .my_info_wrap {
               position absolute
               background-color #ffffff
               width 94%
               bottom -30px
               left 3%
               color #333
               padding 8px 15px
               border-radius 5px
               justify-content space-between
               align-items center
               border:1px solid #eee
               >i {
                   font-size 20px
                   color #999
               }
               .my_info_left {
                   align-items center
                   .center_content {
                       font-size 16px
                       color #999
                       >p:first-child {
                           font-size 18px
                           font-weight bold
                           color #333
                           margin-bottom 10px
                       }
                   }
                   >img {
                       width 50px
                       height 50px
                       border-radius 5px
                       margin-right 20px
                   }
               }
           }
       }

       .c_item {
           background-color #ffffff
           margin 0 auto
           padding 10px 15px
           align-items center
           justify-content space-between
           font-size 16px
           ._left {
               align-items center
           }
           .icon {
               font-size 24px
               margin-right 10px
           }
           .isSign {
               display inline-block
               width 10px
               height 10px
               border-radius 10px
               background-color red;
               margin 0 4px
           }
       }
       .my_wallet {
           margin-top 50px
           margin-bottom 20px
           border-radius 5px
           border:1px solid #eeeeee
           width 94%
       }
       .mine_wrap {
           width 94%
           margin 0 auto
           border-radius 5px
           overflow hidden
           padding 5px 15px
           background-color #ffffff
           border:1px solid #eeeeee
           .c_item {
               border-bottom 1px solid #eee
               padding 10px 0
               &:last-child {
                   border-bottom none
               }
           }

       }
   }
</style>
