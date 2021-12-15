const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: "production",
  entry: './src/app.ts',
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './dist')
  },
  stats: {
    children: false, // webpack打包时子模块信息设置不显示
    warnings: false // 警告不显示
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: {
          loader: 'babel-loader'
        },
        // 尽量将 loader 应用于最少数量的必要模块，因此设置include
        // 只针对该目录下的js文件进行babel处理
        include: path.join(__dirname, '../src')
      },
      {
        test: /\.ts?$/, loader: "ts-loader"
      }
    ]
  },
  resolve: {
    // modules: 告诉webpack哪些目录需要搜索去匹配解析
    modules: [path.join(__dirname, '../src/index.js'), 'node_modules'],
    // extensions: 告诉webpack这些后缀文件需要去搜索匹配
    extensions: ['.ts', '.js', '.json'],
    alias: {
      // 设置别名指向对应目录
      '@': path.join(__dirname, '../src')
    }
  },
  externals: [nodeExternals()], // 排除对node_modules里的依赖进行打包
  plugins: [
    new CleanWebpackPlugin(), // 打包前清除输出目录
    new webpack.DefinePlugin({
      // 定义环境变量，区分开发和生产环境
      // 具体详情可查看DefinePlugin文档
      'process.env.NODE_ENV':
        process.env.NODE_ENV === 'production'
          ? JSON.stringify('production')
          : JSON.stringify('development')
    })
  ],
  // node下这些选项可以使最初为Node.js环境编写的代码，在其他环境（如浏览器）中运行
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  },
  // optimization: {
  //   minimizer: [
  //     // terser-webpack-plugin插件可以压缩代码
  //     // 在webpack4版本中需要安装terser-webpack-plugin4版本
  //     // 里面是官方推荐的具体的参数，详情可查看文档
  //     new TerserPlugin({
  //       terserOptions: {
  //         warning: true,
  //         compress: {
  //           warnings: false,
  //           drop_console: false, // 取消注释console 方便有时候进行调试
  //           dead_code: true,
  //           drop_debugger: true
  //         },
  //         output: {
  //           comments: false, // 不要注释
  //           beautify: false // 不要格式，一行显示所有代码
  //         },
  //         mangle: true
  //       },
  //       parallel: true, // 使用多进程并行运行可提高构建速度，默认的并发运行数量 os.cpus().length - 1
  //       // sourceMap: false
  //     })
  //   ],
  //   // splitChunks 用来避免模块之间重复的依赖关系
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         name: 'commons',
  //         chunks: 'initial',
  //         minChunks: 3,
  //         enforce: true
  //       }
  //     }
  //   }
  // }
}