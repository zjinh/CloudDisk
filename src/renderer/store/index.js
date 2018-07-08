import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'


const state ={
    Clipboard: [],
    SelectFiles:[]
};

const mutations={
    ClearClipboard(states){
        states.Clipboard=[];
    },
    ClearSelectFiles(states){
        states.SelectFiles=[];
    },
    AddOneFileToSelect(states,obj){
        states.SelectFiles=[];
        states.SelectFiles.push(obj);
    },
    AddSelectFiles(states,obj){
        states.SelectFiles.push(obj);
    },
    AddOneFilesToClipboard(states,obj){
        states.Clipboard=[];
        states.Clipboard.push(obj);
    },
    AddClipboard(states,obj){
        states.SelectFiles.push(obj);
    },
};

const actions={
    ClearClipboard : ({commit}) => commit('ClearClipboard'),
    ClearSelectFiles : ({commit}) => commit('ClearSelectFiles'),
    AddOneFileToSelect : ({commit}, param) => commit('AddOneFileToSelect',{item: param}),
    AddSelectFiles : ({commit}, param) => commit('AddSelectFiles',{item: param}),
    AddOneFilesToClipboard : ({commit}, param) => commit('AddOneFilesToClipboard',{item: param}),
    AddClipboard : ({commit}, param) => commit('AddClipboard',{item: param}),
};

const getters={
    GetSelectFiles(states){
        return states.SelectFiles;
    },
    GetClipboard(states){
        return states.Clipboard;
    }
};


Vue.use(Vuex);


export default new Vuex.Store({
    modules,
    state,
    actions,
    getters,
    mutations,
    strict: process.env.NODE_ENV !== 'production'
})