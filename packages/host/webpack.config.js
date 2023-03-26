const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('../app1/package.json').dependencies;
const apps = require('../../apps.json');
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const { merge: webpackMerge } = require('webpack-merge');
const DisableOutputWebpackPlugin = require('disable-output-webpack-plugin');
const webpackConfig = require('../../webpack.config');

const federationConfig = {
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
                port: apps.host.port,
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
