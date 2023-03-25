const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const TerserPlugin = require('terser-webpack-plugin');
const deps = require('./package.json').dependencies;
const _ = require('lodash');
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const apps = require('../../apps.json');

const federationConfig = {
    name: 'app1',
    filename: 'app1RemoteEntry.js',
    remotes: {
        shared: `shared@http://localhost:${apps.shared.port}/sharedRemoteEntry.js`,
    },
    exposes: {
        './App1': './src/App1',
    },
    shared: { ..._.omit(deps, '@mfe/shared') },
};

/**
 * @type {import('webpack').Configuration}
 */
module.exports = (_env, { mode }) => ({
    mode,
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'auto',
        filename: 'app1.[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: {
            keep: /@mf-types\//,
        },
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
    devtool: mode === 'development' ? 'inline-source-map' : undefined,
    devServer: {
        open: false,
        hot: true,
        port: apps.app1.port,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: mode === 'production',
        }),
        new ModuleFederationPlugin(federationConfig),
        new FederatedTypesPlugin({
            federationConfig,
            disableDownloadingRemoteTypes: mode === 'production',
        }),
    ],
    optimization: {
        minimize: mode === 'production',
        minimizer: [new TerserPlugin()],
        chunkIds: 'named',
    },
});
