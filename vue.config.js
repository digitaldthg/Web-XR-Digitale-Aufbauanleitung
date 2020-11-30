module.exports = {
  configureWebpack: {
    module: {
      rules : [
        {
          test: /\.(gltf)$/,
          use: [
            {
              loader: "gltf-webpack-loader"
            }
          ]
        },
        {
          test: /\.(bin)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        }
      ]
    },
    plugins: [
      //new MyAwesomeWebpackPlugin()
    ]
  }
}