// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
// 'production' か 'development' を指定
const MODE = 'development';
// plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  // モード値を production に設定すると最適化された状態で、development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,
  // developmentモードで有効になるdevtool: 'eval'を上書き
  devtool: 'source-map',
  // ローカル開発用環境を立ち上げる
  devServer: {
    open: true, //ブラウザを自動で開く
    openPage: 'index.html', //自動で指定したページを開く
    contentBase: path.join(__dirname, 'public'), // HTML等、コンテンツのルートディレクトリ
    watchContentBase: true, //コンテンツの変更監視をする
    port: 8080, // ポート番号
  },
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    // main.js
    'public/js/main': './src/ts/main.ts',
    // scss
    'public/css/style': './src/scss/style.scss'
  },
  output: {
    // 出力するファイル名
    filename: '[name].js',
    // 出力先のパス（絶対パスを指定する必要がある）
    path: path.resolve(__dirname, ''),
    //ブラウザからバンドルにアクセスする際のパス
    publicPath: "/js/"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          }
        }
      }),
    ],
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
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
          // PostCSS(Autoprefix)
          {
            loader: 'postcss-loader',
            options: {
              // PostCSS側でもソースマップを有効にする
              sourceMap: true,
              plugins: [
                // Autoprefixerを有効化
                // ベンダープレフィックスを自動付与する
                require('autoprefixer')({ grid: true })
              ]
            },
          }
        ],
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: [
      '.ts', '.js'
    ]
  },
  // cssをjsと別に出力する
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'public/css/style.css',
    }),
  ]

};
