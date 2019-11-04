----------

# API #

----------

**[Constructor](#constructor)**  
**[Properties](#properties)**  
**[Misc. Functions](#misc-functions)**  
&nbsp; &nbsp; *[getSvgElement](#sg-get-svg-element)*  
&nbsp; &nbsp; *[getSvgGraphic](#sg-get-svg-graphic)*  
&nbsp; &nbsp; *[remove](#sg-remove)*  
&nbsp; &nbsp; *[destroy](#sg-destroy)*  
**[Axis, Grid, and Legend Functions](axis-grid-and-legend-functions)**  
**[Color and Category Functions](#color-and-category-functions)**  
**[Add Data Functions](#add-data-functions)**  
**[Remove Data Functions]("#remove-data-functions)**  
**[Additional Data Functions](#additional-data-functions)**  
**[Draw Data Functions](#draw-data-functions)**  
**[Remove From Graph Functions](#remove-from-graph-functions)**  
**[Tooltip Functions](#tooltip-functions)**  
**[Highlight Functions](#highlight-functions)**  
**[Save Graph Functions](#save-graph-functions)**  
**[Definitions](#definitions)**  
&nbsp; &nbsp; [Axis options](#axis-options)  
&nbsp; &nbsp; [Point data](#point-data)  
&nbsp; &nbsp; [Line data](#line-data)  
&nbsp; &nbsp; [Area data](#area-data)  
&nbsp; &nbsp; [Tooltip text function](#tooltip-text-function)  


## Constructor ##

<a name="new-simplegraph" href="#new-simplegraph">#</a> new **SimpleGraph**(*options*)

Construct SimpleGraph instance. *Options* are all completely optional, but recognized parameters include:

* `container` (*string*) The DOM element query/selector to the element to append the graph to. Defaults to "body".
* `margins` (*object*) Custom margins. Given with keys of *top*, *left*, *bottom*, and/or *right* and values being the numeric pixel size. Defaults to top/bottom margins of 20 and left/right margins of 40.
* `width` (*number*) Total graph width (including margins). Defaults to 600.
* `height` (*number*) Total graph height (including margins). Defaults to 400.
* `allowDrawBeyondGraph` (*boolean*) Allow drawing beyond graph. If true, all data will be drawn as supplied. If false, points beyond the x/y-axis range will not be drawn and lines/areas will be cut off where they extend past the x/y-axis ranges.
* `colorScale` (*d3.scale*) Optional color scale to use with data. If data series will have non-numeric identifiers, it should be a categorical or ordinal scale. Defaults to d3.scaleOrdinal(d3.schemeCategory10).
* `styles` (*object*) Key-value pairs of additional CSS styles to apply to SVG.
* `axis` (*object*)
* `axis.x` (*object*) X-axis properties (see [Axis Options](#axis-options)).
* `axis.y` (*object*) Y-axis properties (see [Axis Options](#axis-options)).
* `axis.y2` (*object*) Y2-axis properties (see [Axis Options](#axis-options)).
* `axis.styles` (*object*) Optional key-value object of shared axis styles. Defaults to `{fill: 'none', 'stroke-width': 0.5, stroke: 'black'}`


## Properties ##

A few (but not comprehensive) list of the important variables in an initialized SimpleGraph object are below:

* `svg` - The D3 wrapper for the SVG node
* `svgGraph` - The D3 wrapper for the `<g>` node in the SVG
* `x` - The x-axis (See below for details)
* `y` - The y-axis (See below for details)
* `y2` - The second y-axis (See below for details), if it exists

#### Axis ####

* `[x|y|y2].axis` - The main D3 axis object for this axis
* `x.axisTwo` - For the x-axis, the D3 axis object in case the x-axis is desired to be drawn on top of the graph
* `[x|y|y2].break` - The axis breaks, if they exist
* `[x|y|y2].format` - The D3 format object for this axis's tick values
* `[x|y|y2].gridAxis` - The D3 axis object for the gridlines (as they may be drawn with different tick intervals than the axis itself)
* `[x|y|y2].isDate` - True if date values
* `[x|y|y2].isLog` - True if log-scale 
* `[x|y|y2].label` - The axis name/label
* `[x|y|y2].min` - The axis min value
* `[x|y|y2].max` - The axis max value
* `[x|y|y2].scale` - The D3 scale object for this axis


## Misc. Functions ##

<a name="sg-get-svg-element" href="#sg-get-svg-element">#</a> *sg*.**getSvgElement**()

Returns D3 wrapper for SVG node.

&nbsp; &nbsp;**Returns:** `sg.svg`

<a name="sg-get-svg-graphic" href="#sg-get-svg-graphic">#</a> *sg*.**getSvgGraphic**()

Returns D3 wrapper for graphic node in SVG node.

&nbsp; &nbsp;**Returns:** `sg.svgGraph`

<a name="sg-remove" href="#sg-remove">#</a> *sg*.**remove**()

Removes SVG node from container.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-destroy" href="#sg-destroy">#</a> *sg*.**destroy**()

Removes and destroys SVG and this object. Irreversible.


## Axis, Grid, and Legend Functions ##

<a name="sg-axis-options" href="#sg-axis-options">#</a> *sg*.**resetAxisOptions**([*options*])

Redefine axis options. As calling this will invalidate anything drawn on the graph, all data is cleared from the graph on calling this.

* `options.x` (*object*) X-axis properties (see [Axis Options](#axis-options)).
* `options.y` (*object*) Y-axis properties (see [Axis Options](#axis-options)).
* `options.y2` (*object*) Y2-axis properties (see [Axis Options](#axis-options)).
* `options.styles` (*object*) Optional key-value object of shared axis styles. Defaults to `{fill: 'none', 'stroke-width': 0.5, stroke: 'black'}`

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-draw-axes" href="#sg-draw-axes">#</a> *sg*.**drawAxes**([*labelPosition*[, *xAxisPosition*[, *axisLabelMargin*]]])

Redraws the axes on the graph.

* `labelPosition` (*string*) Keywords for the label positions on each axis. Keywords include 'inside' or 'outside' for the position of both axis labels either inside or outside of the axis lines; 'center' to center both axis labels along parallel of respective axis; 'left' or 'right' to determine placement of x-axis label along axis parallel; 'top' or 'bottom' to determine placement of y-axis label along axis parallel. Keywords are assigned in the order they are read. Thus a call of "center top" would first center both labels, then move the y-axis label to the top. Defaults to "outside center".
* `xAxisPosition` (*string*) Placement option of the x-axis, allowing you to draw the x-axis line and labels on top or bottom. Defaults to "bottom".
* `axisLabelMargin` (*number*) Labels are automatically placed at a margin determined not to overlap with the tick marks. However you may specify and additional margin here.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-" href="#sg-">#</a> *sg*.**drawGrid**(**)

Draw grid. If grid already exists, redraws it.

* `style` (*object*) Optional key-value object of grid styles. Defaults to `{opacity: 0.4, stroke: "#555", 'stroke-width': 0.3}`.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-remove-grid" href="#sg-remove-grid">#</a> *sg*.**removeGrid**()

Removes grid.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-draw-legend" href="#sg-draw-legend">#</a> *sg*.**drawLegend**(*position*[, *anchor*[, *bgstyle*[, *itemsPerColumn*[, *rowHeight*[, *exclude*]]]]])

Draw the legend onto the graph. If legend already exists, will redraw it.

* `position` (*number[]*) X-y coordinate position from top-left corner of SVG.
* `anchor` (*string*) Optional anchor for the coordinate x-position (left, middle, or right). Defaults "left".
* `bgstyle` (*number*) Optional styles for the legend. These are SVG style attributes with the exception of support for padding.
* `itemsPerColumn` (*object*) Optional limit on items per column. On reaching this number, a new column will be started to the right. If set to 0 or less, all will be put in single column. Note that if the next column exceeds the right margin of the graph, placement errors will result.
* `rowHeight` (*number*) The height per row. Default of 24 is set to best fit size of text and icons in legend (the second which is currently uncustomizable) so use care if decreasing row height.
* `exclude` (*number*) The height per row. Default of 24 is set to best fit size of text and icons in legend (the second which is currently uncustomizable) so use care if decreasing row height.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Color/Category Functions ##

<a name="sg-get-color-series-by-name" href="#sg-get-color-series-by-name">#</a> *sg*.**getColorBySeriesName**(*name*, *create*)

Get the color or style related to a data series. Attempts to return the style first, but failing that will return the color string. Note that colors will not be assigned to a data series until drawn, thus data series that do exist but haven't been drawn yet may not return a color.

* `series` (*string*) The series name.
* `create` (*boolean*) If true, creates color in colorScale if color is not yet assigned. If false or left undefined, color is only returned if one has been assigned to the data series name.

&nbsp; &nbsp;**Returns:** Color value, or null.

<a name="sg-reset-color-scale" href="#sg-reset-color-scale">#</a> *sg*.**resetColorScale**(*colorScale*)

Reset domain on color scale, or replace with provided.

* `colorScale` (*d3.colorScale*) Color scale to replace with or null.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-set-series-color" href="#sg-set-series-color">#</a> *sg*.**setSeriesColor**(*series*, *color*)

Sets a custom color (overriding the color scale) for a given series name.

* `series` (*string*) The series name.
* `color` (*string*) The color value.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-set-remove-color" href="#sg-remove-series-color">#</a> *sg*.**removeSeriesColor**(*series*)

Remove custom color for series name.

* `series` (*string*) The series name.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Add Data Functions ##

<a name="api-sg-addPointData"></a>
**`SimpleGraph.addPointData(name, xValue, yValue[, size[, y2Axis[, showNulls]]])`** : Add single point data.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>xValue</td><td>number</td><td>The x-value.</td>
    </tr>
    <tr>
      <td>yValue</td><td>number</td><td>The y-value.</td>
    </tr>
    <tr>
      <td>size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.</td>
    </tr>
    <tr>
      <td>y2Axis</td><td>boolean</td><td>If true, point is assigned to y2 axis.</td>
    </tr>
    <tr>
      <td>showNulls</td><td>boolean</td><td>If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addPointsData"></a>
**`SimpleGraph.addPointsData(data, dataPointName, xValueName, yValueName[, additionalDataKeys[, size[, y2Axis[, showNulls]]]])`** : Add multiple point data from an array of object literals.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>data</td><td>object[]</td><td>The plot data as an array of objects. Use the dataPointName, xValueName, and yValueName parameters to tell the function how to parse the data.</td>
    </tr>
    <tr>
      <td>dataPointName</td><td>string</td><td>The key name in each data object to retrieve the data point or data series name and label. If it cannot find the given key in the data object, assumes the given string is the series name for all points. If it is null or undefined, uses the index position (thus all points will be of unique series).</td>
    </tr>
    <tr>
      <td>xValueName</td><td>string</td><td>The key name in each data object to retrieve the x-value.</td>
    </tr>
    <tr>
      <td>yValueName</td><td>string</td><td>The key name in each data object to retrieve the y-value.</td>
    </tr>
    <tr>
      <td>additionalDataKeys</td><td>string[]</td><td>Additional keys for data you want to store for each point.</td>
    </tr>
    <tr>
      <td>size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.</td>
    </tr>
    <tr>
      <td>y2Axis</td><td>boolean</td><td>If true, point is assigned to y2 axis.</td>
    </tr>
    <tr>
      <td>showNulls</td><td>boolean</td><td>If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addPointsDataAsArray"></a>
**`SimpleGraph.addPointsDataAsArray(name, data[, size[, y2Axis[, showNulls]]])`** : Add multiple point data from an array of x,y coordinates.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>data</td><td>number[][]</td><td>The plot data as an array of [x,y] arrays.</td>
    </tr>
    <tr>
      <td>size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.</td>
    </tr>
    <tr>
      <td>y2Axis</td><td>boolean</td><td>If true, point is assigned to y2 axis.</td>
    </tr>
    <tr>
      <td>showNulls</td><td>boolean</td><td>If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addLineDataAsCoordinates"></a>
**`SimpleGraph.addLineDataAsCoordinates(name, lineCoordinates[, style[, interpolation[, y2Axis]]])`** : Add line data as an array of coordinates.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>lineCoordinates</td><td>number[][]</td><td>Array of x,y coordinates.</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addLineDataAsFunction"></a>
**`SimpleGraph.addLineDataAsFunction(name, lineFunction[, style[, resolution[, interpolation[, xRange[, y2Axis]]]]])`** : Add line data as a function.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>lineFunction</td><td>function</td><td>Callback function such that function(x) returns y.</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>How many coordinates to calculate when drawing the line (defaults to every 20 pixels of width if not provided and if provided enforces minimum of 2).</td>
    </tr>
    <tr>
      <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>xRange</td><td>number</td><td>The x-range of the line. Defaults to the min-max of the graph. If supplied will still be truncated to the min-max of the graph if it extends past.</td>
    </tr>
    <tr>
      <td>y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addLinesDataFromPoints"></a>
**`SimpleGraph.addLinesDataFromPoints([style[, interpolation[, handleOverlap]]])`** : Add line data from coordinates.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>handleOverlap</td><td>string</td><td>If there are 2 or more points overlapped for a given x-value, how to handle the y-value for the line. Options are "average", "median", "highest", and "lowest".</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addAreaBetweenTwoLines"></a>
**`SimpleGraph.addAreaBetweenTwoLines(name, lineFunctionBottom, lineFunctionTop[, style[, resolution[, interpolation[, xRange[, y2Axis]]]]])`** : Add area data series with function pair defining bottom and top bounds of area.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>lineFunctionBottom</td><td>function</td><td>Callback function for bottom border of the area such that function(x) returns y0.</td>
    </tr>
    <tr>
      <td>lineFunctionTop</td><td>function</td><td>Callback function for top border of the area such that function(x) returns y1.</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to fill="#ccc".</td>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>How many coordinates to calculate when drawing the line (defaults to every 20 pixels of width if not provided and if provided enforces minimum of 2).</td>
    </tr>
    <tr>
      <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>xRange</td><td>number[]|Date[]</td><td>The [min, max] x-range of the line. Defaults to the min-max of the graph. If supplied will still be truncated to the min-max of the graph if it extends past.</td>
    </tr>
    <tr>
      <td>y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addAreaAsCoordinates"></a>

**`SimpleGraph.addAreaAsCoordinates(name, areaCoordinates[, style[, interpolation[, y2Axis]]])`** : Add area data series as array of area coordinates.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>areaCoordinates</td><td>number[][]</td><td>Array of area coordinate triplets (i.e. [x, y0, y1]).</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to fill="#ccc".</td>
    </tr>
    <tr>
      <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-remove-data"></a>
## Remove Data Functions ##

<a name="api-sg-clearPointsData"></a>
**`SimpleGraph.clearPointsData()`** : Remove all points data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-clearLinesData"></a>
**`SimpleGraph.clearLinesData()`** : Remove all lines data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-clearAreasData"></a>
**`SimpleGraph.clearAreasData()`** : Remove all areas data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-clearAllData"></a>
**`SimpleGraph.clearAllData()`** : Remove all data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-additional-data"></a>
## Additional Data Functions ##

<a name="api-sg-getPointsDataBySeries"></a>
**`SimpleGraph.getPointsDataBySeries(seriesName)`** : Get point data series by name.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>seriesName</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** `pointData[]` - Array of [pointData](#api-sg-defs-pointdata).

<a name="api-sg-getPointCoordinatesBySeries"></a>
**`SimpleGraph.getPointCoordinatesBySeries(seriesName)`** : Get point coordinates by data series name.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>seriesName</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** `number[][]` - Array of point coordinates.

<a name="api-sg-getLinesDataBySeries"></a>
**`SimpleGraph.getLinesDataBySeries(seriesName)`** : Get line data series by name.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>seriesName</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** `lineData[]` - Array of [lineData](#api-sg-defs-linedata).


<a name="api-sg-getAreasDataBySeries"></a>
**`SimpleGraph.getAreasDataBySeries(seriesName)`** : Get area data series by name.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>seriesName</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** `areaData[]` - Array of [areaData](#api-sg-defs-areadata).


<a name="api-sg-functions-draw-data"></a>
## Draw Data Functions ##

<a name="api-sg-drawPoints"></a>
**`SimpleGraph.drawPoints()`** : (Re)draw all points data on graph. Points will have class `.sg-point`.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-drawLines"></a>
**`SimpleGraph.drawLines()`** : (Re)draw all points data on graph. Lines will have class `.sg-line` or `.sg-plotted-line`.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-drawAreas"></a>
**`SimpleGraph.drawAreas()`** : (Re)draw all area data on graph. Areas will have class `.plotted-areas`.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-remove-graph"></a>
## Remove From Graph Functions ##

<a name="api-sg-removePoints"></a>
**`SimpleGraph.removePoints()`** : Remove all drawn points on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeLines"></a>
**`SimpleGraph.removeLines()`** : Remove all drawn lines on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeAreas"></a>
**`SimpleGraph.removeAreas()`** : Remove all drawn areas on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeAll"></a>
**`SimpleGraph.removeAll()`** : Remove all drawn data series on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-tooltip"></a>
## Tooltip Functions ##

<a name="api-sg-addTooltipToPoints"></a>
**`SimpleGraph.addTooltipToPoints(tooltipFunction[, options])`** : Add tooltip function to the points on the graph. Does not add tooltips to the lines connecting points, if they were added. That is handled by addTooltipToLines(). You can check the series name in the callback's returned SVG element or the class to determine type, regular lines are `.sg-plotted-line` and lines drawn from connecting points are `.sg-line`.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="#api-sg-defs-tooltip">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>offset</td><td>number[]</td><td>The x,y offset of the tooltip from the cursor (default [10,-15] places the tooltip to the bottom right of the cursor).</td>
            </tr>
            <tr>
              <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the tooltip div's CSS style.</td>
            </tr>
          </tbody>
        </table>
      </td>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addTooltipToLines"></a>
**`SimpleGraph.addTooltipToLines(tooltipFunction[, options])`** : Add tooltip function to the lines on the graph.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="#api-sg-defs-tooltip">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>offset</td><td>number[]</td><td>The x,y offset of the tooltip from the cursor (default [10,-15] places the tooltip to the bottom right of the cursor).</td>
            </tr>
            <tr>
              <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the tooltip div's CSS style.</td>
            </tr>
          </tbody>
        </table>
      </td>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addTooltipToAreas"></a>
**`SimpleGraph.addTooltipToAreas(tooltipFunction[, options])`** : Add tooltip function to the areas on the graph.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="#api-sg-defs-tooltip">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>offset</td><td>number[]</td><td>The x,y offset of the tooltip from the cursor (default [10,-15] places the tooltip to the bottom right of the cursor).</td>
            </tr>
            <tr>
              <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the tooltip div's CSS style.</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-functions-highlight"></a>
## Highlight Functions ##

<a name="api-sg-highlightPoints"></a>
**`SimpleGraph.highlightPoints(series[, validationCallback[, size[, fill[, stylesDict]]]])`** : Highlights points by drawing new SVG over points. Highlights a given data series, using optional `validationCallback` to filter points within data series. Note that while `size`, `fill`, and `stylesDict` are all optional, if none are supplied, the highlight will look exactly like the point and no difference will be noticeable.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>validationCallback</td><td>function</td><td>The callback function to validate whether to highlight given point. Passed argument of <a href="#api-sg-defs-pointdata">point data</a> for given point. Return true to include point. If callback is null, assumes all points to be included.</td>
    </tr>
    <tr>
      <td>size</td><td>number|function</td><td>Point size or callback function to determine point size. Called in scope such that `this` will refer to the <a href="#api-sg-defs-pointdata">point data</a>. If null, uses assigned `pointsize` for point data.</td>
    </tr>
    <tr>
      <td>fill</td><td>string</td><td>Fill value. If null, uses same as for data series.</td>
    </tr>
    <tr>
      <td>stylesDict</td><td>object</td><td>Optional key-value dictionary of styles to apply to SVG.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeHighlightPoints"></a>
**`SimpleGraph.removeHighlightPoints()`** : Remove any highlights on points.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeHighlights"></a>
**`SimpleGraph.removeHighlights()`** : Remove all highlights.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-save-graph"></a>
## Save Graph Functions ##

<a name="api-sg-saveAsPng"></a>
**`SimpleGraph.saveAsPng(pngName)`** : Save graph as a PNG. Note, in non-Edge Internet Explorer, the [canvg library](https://github.com/canvg/canvg) is required due to security error. This library is not  packaged with SimpleGraph and simply assumed loaded into global space. If canvg object is not found, function will simply error on IE.
<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>pngName</td><td>string</td><td>Default name to save png (".png" automatically appended if not already).</td>
    </tr>
  </tbody>
</table>
&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Definitions ##

#### Axis options ####
<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>break</td>
      <td>object</td>
      <td>
        Optional. Places an x-axis break.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>domain</td><td>number[]</td><td>Places an axis break across this range.</td>
            </tr>
            <tr>
              <td>rangegap</td><td>number</td><td>The pixel width to draw for this axis break.</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>format</td><td>string</td><td>String formatter for tick labels. Defaults to ".0f" if numeric scale or "%Y-%m-%d" if date scale.</td>
    </tr>
    <tr>
      <td>grid</td>
      <td>object</td>
      <td>
        Optional. Specify ticks for grid differently than axis bar/label.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>ticks</td><td>number</td><td>Tick intervals for grid. (See ticks).</td>
            </tr>
            <tr>
              <td>tickValues</td><td>number[]</td><td>Tick values for grid. (See tickValues).</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>label</td><td>string</td><td>Axis name/label.</td>
    </tr>
    <tr>
      <td>logBase</td><td>number</td><td>Optional base number if using logarithmic scale. Defaults to 10.</td>
    </tr>
    <tr>
      <td>max</td><td>number</td><td>Maximum value of axis. Defaults to 100.</td>
    </tr>
    <tr>
      <td>min</td><td>number</td><td>Minimum value of axis. Defaults to 0.</td>
    </tr>
    <tr>
      <td>scale</td><td>d3.scale</td><td>Optional class for scale type. Must be D3 scale class. Defaults to d3.scaleLinear.</td>
    </tr>
    <tr>
      <td>ticks</td><td>number</td><td>Optional. Number of evenly spaced tick intervals on axis to create (due to nature of axis, may not always create exactly this amount but will attempt to).</td>
    </tr>
    <tr>
      <td>tickValues</td><td>number[]</td><td>Optional. Specific values on axis to create tick marks on (this will take priority over `ticks` if both are supplied).</td>
    </tr>
  </tbody>
</table>

#### Point data ####
<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>x</td><td>number|Date</td><td>The x-value.</td>
    </tr>
    <tr>
      <td>y</td><td>number</td><td>The y-value.</td>
    </tr>
    <tr>
      <td>y2</td><td>boolean</td><td>If true, the y-value correlates to the y2 axis.</td>
    </tr>
    <tr>
      <td>pointsize</td><td>number|function</td><td>The symbol size. May be a number, a callback function, or null.</td>
    </tr>
  </tbody>
</table>

#### Line data ####
<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>lineFunction</td><td>function</td><td>Callback functions defining the line such that f(x)=y. Null if line is defined from coordinates.</td>
    </tr>
    <tr>
      <td>coords</td><td>number[][]</td><td>Array of line coordinates [x, y] or null if line is defined from function.</td>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>How many coordinates to calculate when drawing the line. Null if line is defined from coordinates.</td>
    </tr>
    <tr>
      <td>xRange</td><td>number[]</td><td>The [min, max] x-range of the line. Null if line is defined from coordinates.</td>
    </tr>
    <tr>
      <td>y2</td><td>boolean</td><td>If true, the y-value correlates to the y2 axis.</td>
    </tr>
    <tr>
      <td>interpolate</td><td>d3.Curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>style</td><td>object[]</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style.</td>
    </tr>
  </tbody>
</table>

#### Area data ####
<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>areaFunctions</td><td>function[]</td><td>Array of bottom and top callback functions defining the area such that f(x)=y. Null if area is defined from coordinates.</td>
    </tr>
    <tr>
      <td>coords</td><td>number[][]</td><td>Array of area coordinate triplets [x, y0, y1] or null if area is defined from functions.</td>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>How many coordinates to calculate when drawing the line. Null if area is defined from coordinates.</td>
    </tr>
    <tr>
      <td>xRange</td><td>number[]</td><td>The [min, max] x-range of the line. Null if area is defined from coordinates.</td>
    </tr>
    <tr>
      <td>y2</td><td>boolean</td><td>If true, the y-value correlates to the y2 axis.</td>
    </tr>
    <tr>
      <td>style</td><td>object[]</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style.</td>
    </tr>
    <tr>
      <td>interpolate</td><td>d3.Curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
  </tbody>
</table>

#### Tooltip text function ####
Handles the text appearing in the tooltip. Expected to return text/html. The following parameters are passed to provided to pull relevant data. 
<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>data</td><td>object</td><td>The data object bound to the hovered SVG element. See above definitions for point data, line data, or area data, as relevant.</td>
    </tr>
    <tr>
      <td>position</td><td>number[]</td><td>The x,y relative mouse position on the parent SVG.</td>
    </tr>
    <tr>
      <td>svgs</td><td>SVGElement[]</td><td>Array of the SVG elements in the layer selected(or null).</td>
    </tr>
    <tr>
      <td>index</td><td>number</td><td>Index of selected element in array above such that svgs[index] gives the specific SVG element.</td>
    </tr>
  </tbody>
</table>
