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
      state.userName = name
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
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
        api.post(api.getBaseURL('v1/login'), null, {username: username, password: userInfo.password}, res => {
          console.log(res)
          setToken(res.data.token)
          commit('SET_TOKEN', res.data.token)
          resolve()
        }, err => {
          reject(err)
        })
      })
    },

    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.post(api.getBaseURL('v1/token/user'), null, {token: getToken()}, res => {
          console.log(res)
          commit('SET_NAME', res.data.username)
          commit('SET_USERID', res.data.id)
          commit('SET_TOKEN', getToken())
          commit('SET_LOGGED')
          resolve(res)
        }, err => {
          commit('LOGOUT')
          console.log(err)
          reject(err)
        })
      })
    }
  }
})

export default store
