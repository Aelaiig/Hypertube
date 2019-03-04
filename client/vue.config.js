module.exports = {
  devServer: {
    port: 8080,
    proxy: process.env.VUE_APP_URI,
    disableHostCheck: true,
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader'
        }
      ]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/css/variables.scss";`
      }
    }
  }
}