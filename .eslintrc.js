module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    /**
     * 自定义规则配置
     *   key:规则代号 value：具体的限定方式
     * 具体限定方式：
     *   "off" or 0 关闭规则
     *   "warn" or 1 将规则视为警告，不退出程序
     *   "error" or 2 将规则视为错误并退出程序
    **/
  }
}
