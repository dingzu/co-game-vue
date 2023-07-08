const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      '/pusher' : {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace('/pusher/auth', "/api/pusher/auth") 
      },
      'http://localhost:8080/pusher/auth': {
        target: 'http://localhost:3008/api/pusher/auth',
        changeOrigin: true
      }
    }
  }
})

