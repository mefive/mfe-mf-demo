const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const deps = require('./package.json').dependencies;
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const { ModuleFederationPlugin } = require('webpack').container;
const apps = require('../../apps.json');

const federationConfig = {
    name: 'shared',
    filename: 'sharedRemoteEntry.js',
    exposes: {
        './utils': './src/utils',
    },
    shared: { ...deps },
};

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/index',
    output: {
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
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
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined,
    devServer: {
        open: false,
        hot: true,
        port: apps.shared.port,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    plugins: [new ModuleFederationPlugin(federationConfig), new FederatedTypesPlugin({ federationConfig })],
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [new TerserPlugin()],
    },
};
