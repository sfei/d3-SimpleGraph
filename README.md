----------

# D3-SimpleGraph #

----------

D3-Simple-Graph is an abstraction of the D3 library for quickly creating and adding functionality of basic, 2-dimensional plots.

**Lawrence Sim** -- lawrences@sfei.org  
**San Francisco Estuary Institute** -- 2020

## License ##

This project is licensed under the GNU Lesser General Public License (v3.0). See LICENSE file for full details.

## Usage ##

* [D3-SimpleGraph API](./api)


Library is dependant on D3. Tested on D3 v6.1.1. [https://d3js.org](https://d3js.org)

Simply import `d3.simplegraph.min.js` to your application. Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation. 

If used within a webpack build, you may need to provide the 'd3' object as a global shim. E.g.:

```javascript
plugins: [
  new webpack.ProvidePlugin({d3: 'd3'})
]
```

## Tutorials ##

Tutorials are provided as HTML pages where one can following along by copying the code into the dev console for a live demonstration.

1. [Basic usage and introduction](tutorials/simplegraph-1.html). [tutorials/simplegraph-1.html]

2. [Advanced functionality](tutorials/simplegraph-2.html). [tutorials/simplegraph-2.html]

## Change Log ##

* **v3.0.0**
  * Updated to be compatible with D3 v6.
  * Modularized packages and migrated to webpack for build.
  * Adding a few shape options to points.
  * *Breaking change*: Moved length add data parameters into `option`.
