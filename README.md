----------

# D3-SimpleGraph #

----------

D3-SimpleGraph is an abstraction of the D3 library for quickly creating and adding functionality of basic, 2-dimensional plots.

**Lindsey Sim** -- lindseys@sfei.org<br />
**San Francisco Estuary Institute** -- 2024

## License ##

This project is licensed under the GNU Lesser General Public License. See [LICENSE](LICENSE) for full details.

## Usage ##

Library is dependent on [D3](https://d3js.org). Tested on v7.

Distributables are provided as ES6, CommonJS, and UMD (which can be imported in AMD, CommonJS, and global/vanilla environments) under the folder `dist\` in both minified and un-minified formats. These distributables are babel transpiled for backwards compatibility and are not bundled with `d3`. The `d3` library must be resolvable in your project's node modules, provided in the global/scoped namespace, and/or shimmed into the build process as necessary depending on how SimpleGraph is imported into your project.

The source may also be imported (ES6 module definition only) from `src\simple-graph.js`.

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

#### v3.1.2 ####
  * UTC format fix for axis ticks.

#### v3.1.1 ####
  * More robust scale comparisons via in `sg.axis` via functional detections.

#### v3.1.0 ####
  * Updated build libraries.
  * Fix import issue in `sg.axis` module instantiation.
  * Updated exports/distributables for various import methods.

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