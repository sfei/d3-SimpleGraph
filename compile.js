require('node-minify').minify({
    compressor: 'uglifyjs',
    input: './src/simple-graph.js',
    output: './d3.simplegraph.min.js',
    callback: function (err, min) {}
});