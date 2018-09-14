// 配置API接口地址
var root = '/'
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/

function apiAxios (method, headers, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  // if (mask) {
  //   axios.interceptors.request.use((config) => {
  //     // 所有请求之前都要执行的操作
  //
  //     // 根据接口传入参数显示加载动画
  //
  //     return config
  //   }, function (err) {
  //     return Promise.reject(err)
  //   })
  // }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    headers: headers,
    withCredentials: false
  })
    .then(function (res) {
      success(res.data)
    })
    .catch(function (err) {
      let res = err.response
      if (err) {
        window.alert('api error, HTTP CODE: ' + res.status)
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, headers, params, success, failure) {
    return apiAxios('GET', headers, url, params, success, failure)
  },
  post: function (url, headers, params, success, failure) {
    return apiAxios('POST', headers, url, params, success, failure)
  },
  put: function (url, headers, params, success, failure) {
    return apiAxios('PUT', headers, url, params, success, failure)
  },
  delete: function (url, headers, params, success, failure) {
    return apiAxios('DELETE', headers, url, params, success, failure)
  },
  head: function (url, headers, params, success, failure) {
    return apiAxios('HEAD', headers, url, params, success, failure)
  },
  getHost: function () {
    return 'http://localhost:8282'
  },
  getOssHost: function () {
    return 'http://wsi.oss-cn-shanghai.aliyuncs.com'
  },
  getSignatureHost: function () {
    return 'http://test.hengdaomed.com/signature'
  },
  getHEReaderHost: function () {
    return 'http://test.hengdaomed.com:32000/wsi'
    // return 'http://192.168.1.188:9999/wsi'
  },
  getHEReaderURL: function (url) {
    return this.getHEReaderHost() + url
  },
  getBaseURL: function (url) {
    return 'https://test.hengdaomed.com/pathhub/' + url
  }
}
