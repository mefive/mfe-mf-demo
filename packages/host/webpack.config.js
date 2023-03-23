const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const TerserPlugin = require('terser-webpack-plugin');
const deps = require('../app1/package.json').dependencies;

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/index.ts',
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        chunkFilename: '[name].js',
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
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    devServer: {
        host: 'localhost',
        allowedHosts: 'all',
        open: false,
        hot: true,
        port: 3000,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // minify: process.env.NODE_ENV === 'production',
            minify: false,
        }),
        new ModuleFederationPlugin({
            name: 'host',
            filename: 'hostRemoteEntry.js',
            remotes: {
                app1: 'app1@http://localhost:3001/app1RemoteEntry.js',
                app2: 'app2@http://localhost:3002/app2RemoteEntry.js',
            },
            shared: {
                ...deps,
            },
        }),
    ],
    optimization: {
        // minimize: process.env.NODE_ENV === 'production',
        minimize: false,
        minimizer: [new TerserPlugin()],
    },
};
