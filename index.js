const path = require('path')
const autoPrefix = require('autoprefixer')
const sortQueries = require('postcss-sort-media-queries')
const CopyPlugin = require('copy-webpack-plugin')
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin')
const CSSExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

let nextPort = 8888

const build = (options) => (env, argv) => {
    const cwd = process.cwd()
    const mode = argv.mode || 'production'
    const isDevMode = mode === 'development'
    const isAnalyzeMode = 'analyze' in argv
    const source = path.resolve(cwd, options && options.source || 'src')
    const output = path.resolve(cwd, options && options.output || 'dist')

    const commonConfig = {
        context: cwd,
        target: 'web',
        output: {
            path: output,
            publicPath: '/',
        },
        resolve: {
            modules: ['node_modules'],
            extensions: ['.js'],
            alias: {
                '@': source,
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    include: [source, ...(options && options.babelIncludes || [])],
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(scss|css)$/,
                    include: [source],
                    use: [
                        CSSExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [autoPrefix(), sortQueries()],
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                additionalData: `$env: ${mode};`,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: options && options.plugins || [],
        performance: {
            hints: isDevMode ? false : 'warning',
        },
        stats: 'normal',
        devtool: isDevMode ? 'eval' : false,
    }

    return Object.entries(options && options.entries || {}).map(
        ([entryKey, entryFile], index) => {
            const config = { ...commonConfig }
            config.output = { ...commonConfig.output }
            config.plugins = [...commonConfig.plugins]

            if (isAnalyzeMode)
                config.plugins.push(
                    new BundleAnalyzerPlugin({ analyzerPort: nextPort++ })
                )

            config.entry =
                './' + path.relative(cwd, path.resolve(source, entryFile))

            const fileExt = path.parse(entryFile).ext === '.js' ? '.js' : '.css'
            config.output.filename = entryKey + '.js'

            if (fileExt !== '.js') {
                config.plugins.push(
                    new CSSExtractPlugin({
                        filename: entryKey + '.css',
                        chunkFilename: '[id].css',
                    })
                )
                config.plugins.push(
                    new IgnoreEmitPlugin(config.output.filename)
                )
            }

            if (index === 0) {
                if (options && options.copy && options.length)
                    config.plugins.push(
                        new CopyPlugin({
                            patterns: options.copy.map(({ from, to }) => ({
                                from: path.resolve(source, from),
                                to: to && path.resolve(output, to),
                            })),
                        })
                    )

                config.devServer = {
                    https: options && options.https || false,
                    ...options && options.devServer,
                    headers: {
                        ...(options && options.cors && {
                            'Access-Control-Allow-Origin': '*',
                        }),
                        ...options && options.devServer && options.headers,
                    },
                }
            }

            return config
        }
    )
}

module.exports = { build }

