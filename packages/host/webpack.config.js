const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const TerserPlugin = require('terser-webpack-plugin');
const deps = require('../app1/package.json').dependencies;
const apps = require('../../apps.json');
const _ = require('lodash');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = (_env, { mode }) => ({
    mode,
    entry: './src/index.ts',
    output: {
        publicPath: `http://localhost:${apps.host.port}/`,
        path: path.resolve(__dirname, 'dist'),
        filename: 'host.[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true,
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    devtool: mode === 'production' ? false : 'source-map',
    devServer: {
        host: 'localhost',
        allowedHosts: 'all',
        open: false,
        hot: true,
        port: apps.host.port,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: mode === 'production',
        }),
        new ModuleFederationPlugin({
            name: 'host',
            filename: 'hostRemoteEntry.js',
            remotes: {
                app1: `app1@http://localhost:${apps.app1.port}/app1RemoteEntry.js`,
                app2: `app2@http://localhost:${apps.app2.port}/app2RemoteEntry.js`,
            },
            shared: {
                ...deps,
            },
            // shared: _.omit(deps, ['antd']),
        }),
    ],
    optimization: {
        minimize: mode === 'production',
        minimizer: [new TerserPlugin()],
        chunkIds: 'named',
    },
});
