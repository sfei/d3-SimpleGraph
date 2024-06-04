import path from 'path';
import url  from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default function(env) {
    env = env || {};
    env.min = env.min || env.minify ? ".min" : "";
    if(env.es6 || env.module) {
        // build for ES6 module type definition/import
        console.log("building for ES6 module exposure" + (env.min ? " (minified)" : ""));
        return {
            experiments: {
                outputModule: true,
            }, 
            mode: 'production', 
            entry: {
                'd3.simplegraph': './src/simple-graph.js'
            }, 
            output: {
                library: {type: 'module'}, 
                globalObject: 'this', 
                path:         path.resolve(__dirname), 
                filename:     `dist/[name]${env.min}.mjs`
            }, 
            module: {}, 
            externals: {
                d3: 'd3'
            }, 
            optimization: {
                concatenateModules: true, 
                minimize: !!env.min
            }
        };
    } else if(env.commonjs || env.cjs) {
        // built for CommonJS module definition/import
        console.log("building for CommonJS exposure" + (env.min ? " (minified)" : ""));
        return {
            mode: 'production', 
            entry: {
                'd3.simplegraph': './src/simple-graph.js'
            }, 
            output: {
                library: {
                    name:   'SimpleGraph', 
                    type:   'commonjs', 
                    export: 'default'
                }, 
                globalObject: 'this', 
                path:         path.resolve(__dirname), 
                filename:     `dist/[name]${env.min}.cjs`
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
                concatenateModules: true, 
                minimize: !!env.min
            }
        };
    } else if(env.umd) {
        // UMD so supports CommonJS, AMD, and global importing
        console.log("building for UMD exposure" + (env.min ? " (minified)" : ""));
        return {
            mode: 'production', 
            entry: {
                'd3.simplegraph': './src/simple-graph.js'
            }, 
            output: {
                library: {
                    name:   'SimpleGraph', 
                    type:   'umd', 
                    export: 'default'
                }, 
                globalObject: 'this', 
                path:         path.resolve(__dirname), 
                filename:     `dist/[name].umd${env.min}.js`
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
                d3: {
                    amd:       'd3', 
                    root:      'd3', 
                    commonjs:  'd3', 
                    commonjs2: 'd3'
                }
            }, 
            optimization: {
                concatenateModules: true, 
                minimize: !!env.min
            }
        };
    } else if(env.global || env.min) {
        // global type build
        console.log("Global exposure not supported (covered by UMD type exposure instead).");
        return;
        console.log("building for global exposure" + (env.min ? " (minified)" : ""));
        return {
            mode: 'production', 
            entry: {
                'd3.simplegraph': './src/simple-graph.js'
            }, 
            output: {
                library: {
                    name:   'SimpleGraph', 
                    type:   'global', 
                    export: 'default'
                }, 
                globalObject: 'this', 
                path:         path.resolve(__dirname), 
                filename:     `dist/[name]${env.min}.js`
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
                d3: "d3"
            }, 
            optimization: {
                concatenateModules: true, 
                minimize: !!env.min
            }
        };
    } else {
        console.log("Environment/exposure type not specified or unrecognized (es6|cjs|umd|min)");
    }
};