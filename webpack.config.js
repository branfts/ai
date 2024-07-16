// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'

function getUsers(dirPath) {
    return fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.html'))
        .map(file => file.match(/(.+)\.html/)[1])
}
function generateHtmlPlugins() {
    const users = getUsers(path.join(__dirname, 'src', 'u'))

    return users.map(user => {
        return new HtmlWebpackPlugin({
            filename: `u/${user}.html`, // Output filename (e.g., u/username.html)
            template: path.resolve(__dirname, 'src', 'u', `${user}.html`), // Template path for the user directory
            chunks: ['main'], // Chunks to include (corresponds to entry key)
            inject: true,
        })
    })
}
const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: false,
        host: 'localhost',
        static: {
            directory: path.resolve(__dirname, 'dist'), // Serve static files from 'dist'
            publicPath: '/',
        },
        watchFiles: ['src/**/*.html'], // Watch HTML files for changes
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        ...generateHtmlPlugins(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public', to: 'public' }, // Copy static assets to 'dist/public'
            ],
        }),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
}

module.exports = () => {
    if (isProduction) {
        config.mode = 'production'
    } else {
        config.mode = 'development'
    }
    return config
}
