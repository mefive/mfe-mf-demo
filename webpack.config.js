const TerserPlugin = require('terser-webpack-plugin');

/**
 * @type {(mode: 'development' | 'production') => import('webpack').Configuration & { devServer?: any }}
 */
module.exports = mode => ({
    name: 'build',
    mode,
    entry: './src/index.ts',
    output: {
        publicPath: 'auto',
        filename: 'main.[contenthash].js',
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
        historyApiFallback: true,
    },
    plugins: [],
    optimization: {
        minimize: mode === 'production',
        minimizer: [new TerserPlugin()],
        chunkIds: 'named',
    },
});
