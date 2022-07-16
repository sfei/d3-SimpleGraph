# API & Guide #

* **Constructor, properties, and misc. functions**
  * [Constructor](#constructor)
  * [Properties](#properties)
  * [getSvgElement](#a-getsvgelement)
  * [getSvgGraphic](#a-getsvggraphic)
  * [remove](#a-remove)
  * [destroy](#a-destroy)
  * [saveAsPng](#a-savegraphaspng)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* [Drawing data onto the graph](./draw.md)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

----------


## Constructor ##

Usage begins by constructing an instance of `SimpleGraph`. At the minimum, a container should be provided (or it will simply append the DOM body). Basic graph properties, such as dimensions and margins, are set here and cannot be changed.

<a name="a-simplegraph" href="#a-simplegraph">#</a>
new **SimpleGraph**(*options*)

#### Options ####

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Optional custom margins.</td>
    </tr>
    <tr>
      <td>options.container</td><td>string</td><td>The DOM element query/selector to the element to append the graph to. Defaults to "body".</td>
    </tr>
    <tr>
      <td>options.margins</td><td>object</td><td>Optional custom margins.</td>
    </tr>
    <tr>
      <td>options.margin.left</td><td>number</td><td>Left margin. Defaults to 40.</td>
    </tr>
    <tr>
      <td>options.margin.right</td><td>number</td><td>Right margin. Defaults to 40.</td>
    </tr>
    <tr>
      <td>options.margin.top</td><td>number</td><td>Top margin. Defaults to 20.</td>
    </tr>
    <tr>
      <td>options.margin.bottom</td><td>number</td><td>Bottom margin. Defaults to 20.</td>
    </tr>
    <tr>
      <td>options.width</td><td>number</td><td>Total graph width (including margins). Defaults to 600.</td>
    </tr>
    <tr>
      <td>options.height</td><td>number</td><td>Total graph height (including margins). Defaults to 400.</td>
    </tr>
    <tr>
      <td>options.allowDrawBeyondGraph</td><td>boolean</td><td>Allow drawing beyond graph. If true, all data will be drawn as supplied. If false, points beyond the x/y-axis range will not be drawn and lines/areas will be cut off where they extend past the x/y-axis ranges.</td>
    </tr>
    <tr>
      <td>options.colorScale</td><td>d3.scale</td><td> Optional color scale to use with data. If data series will have non-numeric identifiers, it should be a categorical or ordinal scale. Defaults to `d3.scaleOrdinal(d3.schemeCategory10)`.</td>
    </tr>
    <tr>
      <td>options.styles</td><td>object</td><td>Key-value pairs of additional CSS styles to apply to SVG.</td>
    </tr>
    <tr>
      <td>options.axis</td><td>object</td><td>Axis properties.</td>
    </tr>
    <tr>
      <td>options.axis.x</td><a href="./defs.md#axis-options">Axis Options</a></td><td>Object literal of x-Axis options.</td>
    </tr>
    <tr>
      <td>options.axis.y</td><a href="./defs.md#axis-options">Axis Options</a></td><td>Object literal of x-Axis options.</td>
    </tr>
    <tr>
      <td>options.axis.y2</td><a href="./defs.md#axis-options">Axis Options</a></td><td>Object literal of x-Axis options.</td>
    </tr>
    <tr>
      <td>options.axis.styles</td>
      <td>
        Optional key-value object of shared axis styles. Values filled in by default below:
        <table>
          <tr><th>Property</th><th>Default Value</th></tr>
          <tr><td>fill</td><td>"none"</td></tr>
          <tr><td>stroke-width</td><td>0.5</td></tr>
          <tr><td>stroke</td><td>"black"</td></tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>


## Properties ##

A few (but not comprehensive) list of the important variables in an initialized SimpleGraph object are below:

* `svg` - The D3 wrapper for the SVG node
* `svgGraph` - The D3 wrapper for the \<g\> node wrapping the graph (resized and positions to fit margins) in the SVG
* `x` - The x-axis (See below for details)
* `y` - The y-axis (See below for details)
* `y2` - The second y-axis (See below for details), if it exists
* `color` - The base/default [D3 color scale](https://github.com/d3/d3-scale-chromatic).
* `customColors` - A dictionary for manually specified color mappings by series names.
* `points` - A list of all points data.
* `lines` - A list of all lines data.
* `areas` - A list of all areas data.
* `pointlines` - A list of all point lines data.
* `ptSeriesShapes` - A dictionary of point shapes by series names.

#### Axis ####

* `axis` - The main D3 axis object for this axis
* `axisTwo` - For the x-axis, the D3 axis object in case the x-axis is desired to be drawn on top of the graph
* `break` - The axis breaks, if they exist
* `format` - The D3 format object for this axis's tick values
* `gridAxis` - The D3 axis object for the gridlines (as they may be drawn with different tick intervals than the axis itself)
* `isDate` - True if date values
* `isLog` - True if log-scale 
* `label` - The axis name/label
* `min` - The axis min value
* `max` - The axis max value
* `scale` - The D3 scale object for this axis

## Misc. functions ##

#### Getting elements ####

<a name="a-getsvgelement" href="#a-getsvgelement">#</a> *SimpleGraph*.**getSvgElement**()

Returns D3 wrapper for SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `sg.svg`

<a name="a-getsvggraphic" href="#a-getsvggraphic">#</a> *SimpleGraph*.**getSvgGraphic**()

Returns D3 wrapper for graphic node in SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `sg.svgGraph`

#### Remove and destroy ####

<a name="a-remove" href="#a-remove">#</a> *SimpleGraph*.**remove()**

Removes SVG node from container.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-destory" href="#a-destory">#</a> **sg.destroy()**

Removes and destroys SVG and this object. Irreversible.

#### Saving the graph ####

<a name="a-saveaspng" href="#a-saveaspng">#</a> *SimpleGraph*.**saveAsPng**(*pngName*)

Save graph as a PNG. Note, in non-Edge Internet Explorer, the [canvg library](https://github.com/canvg/canvg) is required due to security error. This library is not  packaged with SimpleGraph and simply assumed loaded into global space. If canvg object is not found, function will simply error on IE.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>pngName</td><td>string</td><td>Filename to save png as (".png" automatically appended if not already).</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.
