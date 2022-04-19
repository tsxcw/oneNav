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
        new HtmlWebpackPlugin({
            template: './src/view/login.html',
            filename: "login.html"
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),

    ],
    output: {
        filename: function ({runtime}) {
            return runtime + time + '.js';
        },
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        libraryExport: "default"
    },
    module: {
        rules: [
            // Extracts the compiled CSS from the SASS files defined in the entry
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'sass-loader' // 将 Sass 编译成 CSS
                    }
                ]
            },
        ]
    }
};
