const path = require('path');
const webpack = require('webpack');

module.exports = {
    name: 'gugudan-setting',
    mode: 'development', // 실서비스: production
    devtool: 'eval',    //hidden-soruce-app
    resolve: {
        extensions: ['.js', '.jsx'],
    },

    entry: {
        app: ['./client'],
    },  //입력

    module: {
        rules: [{
            test: /\.jsx?/,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['@babel/preset-env',{
                        targets: {
                            browsers: ['>5% in KR'],    //, 'last 2 chrome versions'
                        },
                    }],
                    ['@babel/preset-react']],
                plugins: [],
            },
        }],
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true }),
    ],

    output: {
        // 현재폴더 + dist
        path: path.join(__dirname, 'dist'),
        filename: 'app.js',
    },  //출력
};