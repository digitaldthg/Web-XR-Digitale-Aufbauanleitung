module.exports = {
  
  publicPath: '/TP4/',
  chainWebpack: config => {
    config.module.rules.delete("svg");
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "./src/style/variables.scss";
        `
      }
    }
  },
  configureWebpack: {
    devServer:{
      https: true,
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            'babel-loader',
            'vue-svg-loader',
          ],
        },
        {
          test: /\.(gltf)$/,
          use: [
            {
              loader: "gltf-webpack-loader"
            }
          ]
        },
      ]
    }
  }
}