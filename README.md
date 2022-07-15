----------

# D3-SimpleGraph #

----------

D3-SimpleGraph is an abstraction of the D3 library for quickly creating and adding functionality of basic, 2-dimensional plots.

**Lawrence Sim** -- lawrences@sfei.org<br />
**San Francisco Estuary Institute** -- 2022

## License ##

This project is licensed under the GNU Lesser General Public License. See [LICENSE](LICENSE) for full details.

## Usage ##

Library is dependent on D3. Tested on D3 v7.6.1. [https://d3js.org](https://d3js.org)

Simply import `d3.simplegraph.min.js` to your application. Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation. 

If used within a webpack build, you may need to provide the 'd3' object as a global shim. E.g.:

```javascript
plugins: [
  new webpack.ProvidePlugin({d3: 'd3'})
]
```

Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation.

## API & Guide ##

* [Intro, Constructor, Properties, and Misc. Functions](api/README.md)
* [Axis, Grid, and Legend Functions](api/axis-grid-legend.md)
* [Color and Category Functions](api/color.md)
* [Add Data Functions](api/add-data.md)
* [Getting data](api/get-data2.md)
* [Removing and updating data](api/mod-data.md)
* [Drawing data onto the graph](api/draw.md)
* [Adding interactive features](api/interactivity.md)
* [Definitions](api/defs.md)

## Tutorials ##

Interactive tutorials are provided as HTML pages where one can following along by copying the code into the dev console for a live demonstration. (Will not work on github page, but clone or download repository and access there.)

1. [Adding and Drawing Data](tutorials/simplegraph-1.html). [tutorials/simplegraph-1.html]

2. [Point-lines, Grids, Legends, and Tooltips](tutorials/simplegraph-2.html). [tutorials/simplegraph-2.html]

2. [Y2 Axis, Areas, Colors, and Transitions](tutorials/simplegraph-3.html). [tutorials/simplegraph-3.html]

2. [Data Updates and Draw Updates with Transitions](tutorials/simplegraph-4.html). [tutorials/simplegraph-4.html]

## Change Log ##

* **v3.0.0**
  * Updated to be compatible with D3 v7.
  * Modularized packages and migrated to webpack for build.
  * Adding a few shape options to points.
  * *Breaking change*: Moved length add data parameters into `option`.
