const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;
const apps = require('../../apps.json');
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const { merge: webpackMerge } = require('webpack-merge');
const DisableOutputWebpackPlugin = require('disable-output-webpack-plugin');
const webpackConfig = require('../../webpack.config');

const federationConfig = {
    name: 'app2',
    filename: 'app2RemoteEntry.js',
    exposes: {
        './App2': './src/App2',
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
                port: apps.app2.port,
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
