import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

import state from './Trees/state'
import actions from './Trees/actions'
import * as getters from './Trees/getters'
import mutations from './Trees/mutations'

Vue.use(Vuex);


export default new Vuex.Store({
    modules,
    state,
    actions,
    getters,
    mutations,
    strict: process.env.NODE_ENV !== 'production'
})