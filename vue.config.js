const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 스프링부트 서버 주소
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
})