// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
// 'production' か 'development' を指定
const MODE = 'development';
// plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AutoPrefixer = require('autoprefixer');

module.exports = {
  // モード値を production に設定すると最適化された状態で、development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,
  // developmentモードで有効になるdevtool: 'eval'を上書き
  devtool: MODE === 'development' ? 'source-map' : 'none',
  // ローカル開発用環境を立ち上げる
  devServer: {
    open: true, //ブラウザを自動で開く
    openPage: 'index.html', //自動で指定したページを開く
    contentBase: path.join(__dirname, 'public'), // HTML等、コンテンツのルートディレクトリ
    watchContentBase: true, // コンテンツの変更監視をする
    port: 3000 // ポート番号
  },
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    // main.js
    'js/main': './src/ts/main.ts',
    // scss(style.cssを出力)
    'css/style': './src/scss/style.scss'
  },
  output: {
    // 出力するファイル名
    filename: '[name].js',
    // __dirnameは webpack.config.js があるディレクトリの絶対パス
    path: path.resolve(__dirname, './public/'),
    //ブラウザからバンドルにアクセスする際のパス
    publicPath: '/'
  },
  // 最適化
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: MODE === 'development'
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      // typescript
      {
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader'
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // javascriptとしてバンドルせず css として出力する
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: MODE === 'development'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: MODE === 'development',
              plugins: [
                AutoPrefixer({
                  grid: true,
                  browsers: ['last 2 versions', 'ie >= 11', 'Android >= 4']
                })
              ]
            }
          },

          {
            loader: 'sass-loader',
            options: {
              sourceMap: MODE === 'development'
            }
          }
        ]
      }
      // scss
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         // オプションでCSS内のurl()メソッドの取り込みを禁止する
      //         url: false,
      //         // ソースマップの利用有無
      //         sourceMap: MODE === 'development'
      //       }
      //     },
      //     // PostCSSの設定
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         plugins: [
      //           AutoPrefixer({
      //             browsers: ['last 2 versions', 'ie >= 11', 'Android >= 4'],
      //             grid: true
      //           })
      //         ]
      //       }
      //     },
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //         // オプションでCSS内のurl()メソッドの取り込みを禁止する
      //         url: false,
      //         // ソースマップの利用有無
      //         sourceMap: MODE === 'development'
      //       }
      //     }
      //   ]
      // }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: ['.ts', '.js']
  },
  // cssをjsと別に出力する
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};
