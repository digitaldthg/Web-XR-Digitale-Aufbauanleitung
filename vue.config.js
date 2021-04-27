module.exports = {
  
  publicPath: '/TP4/',
  chainWebpack: config => {
    config.module.rules.delete("svg");
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