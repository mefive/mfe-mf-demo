const path = require('path');
const deps = require('./package.json').dependencies;
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const { ModuleFederationPlugin } = require('webpack').container;
const apps = require('../../apps.json');
const { merge: webpackMerge } = require('webpack-merge');
const DisableOutputWebpackPlugin = require('disable-output-webpack-plugin');
const webpackConfig = require('../../webpack.config');

const federationConfig = {
    name: 'shared',
    filename: 'sharedRemoteEntry.js',
    exposes: {
        './utils': './src/utils',
    },
    shared: { ...deps },
};

module.exports = (_env, { mode }) => {
    return [
        // 构建 app
        webpackMerge(webpackConfig(mode), {
            name: 'app',
            output: {
                path: path.resolve(__dirname, 'dist'),
            },
            plugins: [
                new ModuleFederationPlugin(federationConfig),
                new FederatedTypesPlugin({
                    federationConfig,
                    disableDownloadingRemoteTypes: true,
                    disableTypeCompilation: false,
                }),
            ],
            devServer: {
                port: apps.shared.port,
            },
        }),

        // 下载 d.ts
        webpackMerge(webpackConfig(mode), {
            name: 'types',
            output: {
                path: path.resolve(__dirname, 'dist'),
                clean: false,
            },
            plugins: [
                new DisableOutputWebpackPlugin(),
                new ModuleFederationPlugin(federationConfig),
                new FederatedTypesPlugin({
                    federationConfig,
                    disableDownloadingRemoteTypes: false,
                    disableTypeCompilation: true,
                }),
            ],
        }),
    ];
};
