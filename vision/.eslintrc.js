/*
 * @Author: wwssaabb
 * @Date: 2021-06-10 10:34:03
 * @LastEditTime: 2021-06-10 14:51:26
 * @FilePath: \demo\echarts_demo\vision\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    /* '@vue/standard' */
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
