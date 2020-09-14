const webpack = require('webpack'), 
      path    = require('path');

module.exports = {
    entry: './src/entry.js', 
    mode: 'production', 
    output: {
        library: 'SimpleGraph', 
        libraryTarget: 'umd', 
        libraryExport: 'default', 
        path: path.resolve(__dirname), 
        filename: 'd3.simplegraph.min.js'
    },
    module: {
        rules: [
            {
                test:    /\.js$/,
                exclude: /(node_modules)/,
                loader:  'babel-loader', 
                query: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    }, 
    externals: {
        d3: {
            amd: 'd3', 
            root: 'd3', 
            commonjs: 'd3', 
            commonjs2: 'd3'
        }
    }, 
    optimization: {
        concatenateModules: true, 
        minimize: false
    }
};