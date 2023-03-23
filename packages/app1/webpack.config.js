const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const TerserPlugin = require('terser-webpack-plugin');
const deps = require('./package.json').dependencies;

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        chunkFilename: '[name].js',
        clean: true,
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
            app1: path.resolve(__dirname, 'node_modules/app1/dist/remoteEntry.js'),
        },
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined,
    devServer: {
        open: false,
        hot: true,
        port: 3001,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // minify: process.env.NODE_ENV === 'production',
            minify: false,
        }),
        new ModuleFederationPlugin({
            name: 'app1',
            filename: 'app1RemoteEntry.js',
            exposes: {
                './App1': './src/App1',
            },
            shared: { ...deps },
        }),
    ],
    optimization: {
        // minimize: process.env.NODE_ENV === 'production',
        minimize: false,
        minimizer: [new TerserPlugin()],
    },
};
