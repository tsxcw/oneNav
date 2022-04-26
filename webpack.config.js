const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let time = new Date().getTime()
module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: `[name]${time}.css`
        }),

    ],
    output: {
        filename: function ({runtime}) {
            return runtime + time + '.js';
        },
        assetModuleFilename: '[hash][ext][query]',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        libraryExport: "default"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'sass-loader', // 将 Sass 编译成 CSS
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    name: '[hash:10].[ext]', // 图片重命名
                    esModule: false
                }
            },
            {
                test: /\.jsx$/i,
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-react']
                }
            }
        ]
    }
};
