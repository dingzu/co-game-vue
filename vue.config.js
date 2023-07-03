const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      // 如果请求地址以/api打头,就出触发代理机制
      // http://localhost:8080/api/login -> http://localhost:3000/api/login
      // '/api': {
      //   target: 'http://127.0.0.1:8888' // 我们要代理的真实接口地址
      // },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
    }
  }
})

