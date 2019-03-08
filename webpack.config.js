// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
// 'production' か 'development' を指定
const MODE = 'development';
// plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // モード値を production に設定すると最適化された状態で、development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,
  // developmentモードで有効になるdevtool: 'eval'を上書き
  devtool: 'source-map',

  // ローカル開発用環境を立ち上げる
  devServer: {
    open: true, //ブラウザを自動で開く
    openPage: 'index.html', //自動で指定したページを開く
    contentBase: path.join(__dirname, 'public'), // HTML等コンテンツのルートディレクトリ
    watchContentBase: true, //コンテンツの変更監視をする
    port: 3000, // ポート番号
  },
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: './src/ts/main.ts',

  module: {
    rules: [
      // typescript
      {
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader'
      },
      // SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              minimize: false, //圧縮するときは'true'
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  output: {
    // 出力するファイル名
    filename: 'main.js',
    // 出力先のパス（絶対パスを指定する必要がある）
    path: path.join(__dirname, 'public/js'),
    //ブラウザからバンドルにアクセスする際のパス
    publicPath: "/js/"
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: [
      '.ts', '.js'
    ]
  },
  // 使用するプラグイン
  plugins: [
    new MiniCssExtractPlugin({
      filename: '/public/css/style.css',
    })
  ]

};
