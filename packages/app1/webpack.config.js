const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
const _ = require('lodash');
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const apps = require('../../apps.json');
const { merge: webpackMerge } = require('webpack-merge');
const webpackConfig = require('../../webpack.config');
const DisableOutputWebpackPlugin = require('disable-output-webpack-plugin');

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
                port: apps.app1.port,
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
