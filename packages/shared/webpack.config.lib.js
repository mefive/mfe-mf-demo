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
        path: path.resolve(__dirname, 'lib'),
        filename: 'main.js',
        chunkFilename: '[name].js',
        clean: true,
        library: 'shared',
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
        port: 3003,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    plugins: [],
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [new TerserPlugin()],
    },
};
