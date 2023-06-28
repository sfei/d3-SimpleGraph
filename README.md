----------

# D3-SimpleGraph #

----------

D3-SimpleGraph is an abstraction of the D3 library for quickly creating and adding functionality of basic, 2-dimensional plots.

**Lawrence Sim** -- lawrences@sfei.org<br />
**San Francisco Estuary Institute** -- 2023

## License ##

This project is licensed under the GNU Lesser General Public License. See [LICENSE](LICENSE) for full details.

## Usage ##

Library is dependent on [D3](https://d3js.org). Tested on v7.

Simply import `d3.simplegraph.min.js` to your application. Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or a regular script import. 

As a regular script import, it is assumed that the global var `d3` has been set. This can be locally or through a CDN before loading the d3-SimpleGraph library. E.g.:

```html
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
```

If used within a webpack build, you may need to provide the 'd3' object as a global shim. E.g.:

```javascript
plugins: [
  new webpack.ProvidePlugin({d3: 'd3'})
]
```

## API & Guide ##

* [Constructor, properties, and misc. functions](api/README.md)
* [Axis, grid, and legend](api/axis-grid-legend.md)
* [Adding and getting data](api/add-data.md)
* [Removing and updating data](api/mod-data.md)
* [Drawing data onto the graph](api/draw.md)
* [Color and point shape](api/color.md)
* [Adding interactive features](api/interactivity.md)
* [Definitions](api/defs.md)

## Tutorials ##

Interactive tutorials are provided as HTML pages where one can following along by copying the code into the dev console for a live demonstration. (Will not work on github page, but clone or download repository and access there.)

1. [Adding and Drawing Data](tutorials/simplegraph-1.html). [tutorials/simplegraph-1.html]

2. [Point-lines, Grids, Legends, and Tooltips](tutorials/simplegraph-2.html). [tutorials/simplegraph-2.html]

2. [Y2 Axis, Areas, Colors, and Transitions](tutorials/simplegraph-3.html). [tutorials/simplegraph-3.html]

2. [Data Updates and Draw Updates with Transitions](tutorials/simplegraph-4.html). [tutorials/simplegraph-4.html]

## Change Log ##

#### v3.0.0 ####
  * Modularized packages.
  * Migrated to webpack for build.
  * Updated to be compatible with D3 v7.
  * Complete revision of readme and tutorials.
  * **New functionality**
    * Added a few more shape options to points.
    * Data-bindings and data updates organized. Adds functionality for modifying/changing data added to SimpleGraph.
    * Added transitions to draw functions, which allow fade-in effect.
    * Added draw-update functions, with options to animate data changes with transitions.
    * Highlight functionality.
  * **Breaking changes**
    * Constructor simplified to single `options` parameter.
    * Drawing legend, several parameters moved to `options` object to simplify.
    * Drawing legend, `exclude` parameter behavior has changed.
    * Adding data, several parameters moved to `options` object to simplify.
    * Adding points, `showNulls` parameter moved to be specified on drawing.
    * Adding areas and lines, `resolution` parameter moved to be specified on drawing.