import router from '@/router/index'
import { getToken } from '@/utils/auth'
import store from '@/store'

const whiteList = ['/internal/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (/internal/.test(to.path)) {
    console.log(to.path)
    if (getToken()) {
      if (to.path === '/internal/login') {
        next({ path: '/internal' })
      } else {
        store.dispatch('GetInfo').then(res => {
          next()
        }).catch((err) => {
          console.log(err)
          router.app.$message.error('登录超时')
          store.commit('SET_UNLOGGED')
          next({ path: '/internal' })
        })
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/internal/login?redirect=${to.path}`)
      }
    }
  } else {
    next()
  }
})
