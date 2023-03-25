const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const TerserPlugin = require('terser-webpack-plugin');
const deps = require('./package.json').dependencies;
const apps = require('../../apps.json');
const { FederatedTypesPlugin } = require('@module-federation/typescript');

const federationConfig = {
    name: 'app2',
    filename: 'app2RemoteEntry.js',
    exposes: {
        './App2': './src/App2',
    },
    shared: { ...deps },
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
        filename: 'app2.[contenthash].js',
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
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    devtool: mode === 'development' ? 'inline-source-map' : undefined,
    devServer: {
        open: false,
        hot: true,
        port: apps.app2.port,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new ModuleFederationPlugin(federationConfig),
        new FederatedTypesPlugin({
            federationConfig,
            disableDownloadingRemoteTypes: mode === 'production',
            disableTypeCompilation: false,
        }),
    ],
    optimization: {
        minimize: mode === 'production',
        minimizer: [new TerserPlugin()],
        chunkIds: 'named',
    },
});
