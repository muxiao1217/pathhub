'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  BASE_API: '"https://test.hengdaomed.com"',
  OSS_URL: '"http://wsi.oss-cn-shanghai.aliyuncs.com"'
})
