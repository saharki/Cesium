var path = require('path');
var autoPrefixer = require('autoprefixer-core');
var HtmlPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var config = {
    entry: {
        app: ['./src/js/main.jsx']
    },
    module: {
        unknownContextCritical: false, // ignore Cesium related warnings
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: [/src/]
            },
            {
                test: /\.jsx$/,
                loaders: ['babel-loader']
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(svg)$/,
                loader: 'file-loader'
            }
        ]
    },
    output: {
        filename: '[name].js',
        hash: false
    },
    postcss: [autoPrefixer()],
    plugins: [
        new HtmlPlugin({
            title: 'React Cesium',
            template: 'src/index.html',
            inject: 'true',
            chunks: ['app']
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

config.entry.app.unshift('webpack/hot/only-dev-server');
config.devtool = 'eval';
config.devServer = {
    port: 8080,
    info: false,
    historyApiFallback: true,
    host: 'localhost',
    contentBase: './public',
    hot: true
};

config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
);
config.module.loaders.push(
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader?importLoaders=1!postcss-loader'
    }
);

module.exports = config;
