# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* **Axis, grid, and legend**
  * [resetAxisOptions](#a-resetaxisoptions)
  * [drawAxes](#a-drawaxes)
  * [drawGrid](#a-drawgrid)
  * [removeGrid](#a-removegrid)
  * [drawLegend](#a-drawlegend)
  * [removeLegend](#a-removelegend)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* [Drawing data onto the graph](./draw.md)
* [Color and point shape](./color.md)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

## Axis, grid, and legend functions ##

#### Axis and grid ####

There are three fixed axes available: the mandatory x and y axes, and an optional y2 axis. Axes are handled as a dictionary of [axis options](./defs.md#axis-options), to be enacted once drawing the axis. You may also potentially manually access the axis objects within the SimpleGraph instance's [axis properties](./README.md#axis).

<a name="a-resetaxisoptions" href="#a-resetaxisoptions">#</a> *SimpleGraph*.**resetAxisOptions**(*axisOptions*)

Redefine axis options. As calling this will invalidate anything drawn on the graph, all data is cleared from the graph on calling this.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>axisOptions</td><td>object</td><td>Map of axis options by axis name.</td>
    </tr>
    <tr>
      <td>axisOptions.x</td><td><a href="./defs.md#axis-options">Axis Options</a></td><td>Object literal of x-Axis options.</td>
    </tr>
    <tr>
      <td>axisOptions.y</td><td><a href="./defs.md#axis-options">Axis Options</a></td><td>Object literal of y-Axis options.</td>
    </tr>
    <tr>
      <td>axisOptions.y2</td><td><a href="./defs.md#axis-options">Axis Options</a></td><td>Object literal of y2-Axis options.</td>
    </tr>
    <tr>
      <td>axisOptions.styles</td><td>object</td><td>Optional key-value object of shared axis styles. Defaults to `fill="none"`, `stroke="black"`, and `'stroke-width'=0.5`.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawaxes" href="a-drawaxes">#</a> *SimpleGraph*.**drawAxes**([*labelPosition*[, *xAxisPosition*[, *axisLabelMargin*]]])

Redraws the axes on the graph. Often useful for redrawing the axes on top of any objects on the graph.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>labelPosition</td><td>string</td><td>Keywords for the label positions on each axis. Keywords include 'inside' or 'outside' for the position of both axis labels either inside or outside relative to graph area; 'center' to center both axis labels along parallel of respective axis; 'left' or 'right' to determine placement of x-axis label along axis parallel; 'top' or 'bottom' to determine placement of y-axis label along axis parallel. Where applicable, axis name can be prefixed with hyphen (e.g. 'x-inside' or 'y2-outside' or 'y-bottom'). Keywords are assigned in the order they are read. Thus a call of "center top" would first center both labels, then move the y-axis label to the top. Defaults to "outside center".</td>
    </tr>
    <tr>
      <td>xAxisPosition</td><td>string</td><td>Placement option of the x-axis, allowing you to draw the x-axis line and labels on top or bottom. Defaults to "bottom".</td>
    </tr>
    <tr>
      <td>axisLabelMargin</td><td>number</td><td>Labels are automatically placed at a margin determined not to overlap with the tick marks. However you may specify and additional margin here.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawgrid" href="a-drawgrid">#</a> *SimpleGraph*.**drawGrid**([*style*])

Draws a grid. If grid already exists, redraws it. Grid spacing is determined by axis ticks.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Optional key-value object of grid styles. Defaults to opacity=0.4, stroke="#555", and stroke-width=0.3.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removegrid" href="a-removegrid">#</a> *SimpleGraph*.**removeGrid**()

Removes the grid.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

#### Legend ####

Legends are handled fairly automatically, with all data series present (even if not yet drawn on the graph) automatically added to the legend. Simply define where to place it along with some optional formatting parameters.

<a name="a-drawlegend" href="a-drawlegend">#</a> *SimpleGraph*.**drawLegend**(*position*[, *options*])

Draw the legend onto the graph. If legend already exists, will redraw it.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>position</td><td>number[]</td><td>x,y coordinate position from top-left corner of SVG.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options for the legend.</td>
    </tr>
    <tr>
      <td>options.anchor</td><td>string</td><td>Optional anchor for the coordinate x-position (left, middle, or right). Defaults "left".</td>
    </tr>
    <tr>
      <td>options.bgstyle</td><td>object</td><td>Optional styles for the legend. These are SVG style attributes with the exception of support for padding.</td>
    </tr>
    <tr>
      <td>options.itemsPerColumn</td><td>number</td><td>Optional limit on items per column. On reaching this number, a new column will be started to the right. If set to 0 or less, all will be put in single column. Note that if the next column exceeds the right margin of the graph, placement errors will result.</td>
    </tr>
    <tr>
      <td>options.rowHeight</td><td>number</td><td>Optional height per row. Default of 24 is set to best fit size of text and icons in legend (the second which is currently uncustomizable) so use care if decreasing row height.</td>
    </tr>
    <tr>
      <td>options.exclude</td><td>string[]</td><td>Can optionally name data series to exclude from adding to the legend. Provided as list or whitespace-separated string of data series names (though list is preferred as data series names may include spaces). Case sensitive and remove any matching data series by name from all types of data (points, lines, and areas).<br /><br />Additionally, suffix a "::shape" to specify only for a specific shape. E.g. the value "scores::points" would exclude any dataseries named "scores" of points type, but not for lines or areas. A value of "::points" would exclude all points data.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removelegend" href="a-removelegend">#</a> *SimpleGraph*.**removeLegend**()

Removes the legend.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.
