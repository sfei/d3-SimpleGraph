const webpack = require('webpack'), 
      path    = require('path');

module.exports = {
    mode: 'production', 
    entry: {
        'd3.simplegraph.min': "./src/simple-graph.js"
    }, 
    output: {
        library: {
            name:   'SimpleGraph', 
            type:   'umd', 
            export: 'default'
        }, 
        globalObject: 'this', 
        path:         path.resolve(__dirname), 
        filename:     '[name].js'
    }, 
    module: {
        rules: [
            {
                test:    /\.js$/,
                exclude: /(node_modules)/,
                loader:  'babel-loader', 
                options: {presets: ['@babel/preset-env']}
            }
        ]
    }, 
    externals: {
        d3: 'd3'
    }, 
    optimization: {
        minimize: true
    }
};