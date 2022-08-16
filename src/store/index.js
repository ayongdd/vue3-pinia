import { createStore } from 'vuex'

import indexStore from './modules/index_store'
import userStore from './modules/user_store'
import chatStore from './modules/chat_store'
import createPersistedState from "vuex-persistedstate";
export default createStore({
    modules: {
        indexStore,
        userStore,
        chatStore
    },
    plugins: [createPersistedState({
        storage: window.localStorage
        // storage: window.sessionStorage
    })],
})
