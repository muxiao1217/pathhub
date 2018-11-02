import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'
import { setToken, getToken, removeToken } from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: '',
    userName: '',
    logged: false
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_LOGGED: (state) => {
      state.logged = true
    },
    SET_UNLOGGED: (state) => {
      state.logged = false
    },
    LOGOUT: (state) => {
      removeToken(state.token)
      state.token = ''
      state.userName = ''
      state.logged = false
    }
  },

  actions: {
    Login ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        api.get(api.getBaseURL('v1/login'), null, {username: username, password: userInfo.password}, res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }, err => { reject(err) })
      })
    },

    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.get(api.getBaseURL('v1/userInfo'), null, {token: getToken()}, res => {
          const data = res.data
          commit('SET_NAME', data.name)
          commit('SET_LOGGED')
          resolve(res)
        }, err => {
          commit('SET_UNLOGGED')
          reject(err)
        })
      })
    }
  }
})

export default store
