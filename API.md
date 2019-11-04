# API #

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

#### Axis Properties ####

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

Color schemas/scales are build on top of a [d3.scaleOrdinal](https://github.com/d3/d3-scale#ordinal-scales), tying the data series name to a color value. The data series name does not discriminate by data type (e.g. a point data series or line data series with the same name should have the same color). Additionally, SimpleGraph maintains a dictionary of color overrides which can be set or removed via **setSeriesColor()** or **removeSeriesColor()**.

<a name="sg-get-color-series-by-name" href="#sg-get-color-series-by-name">#</a> *sg*.**getColorBySeriesName**(*name*[, *create*])

Get the color or style related to a data series. Attempts to return the style first, but failing that will return the color string. Note that colors will not be assigned to a data series until drawn, thus data series that do exist but haven't been drawn yet may not return a color.

* `series` (*string*) The series name.
* `create` (*boolean*) If true, creates color if color is not yet assigned. If false or left undefined, color is only returned if one has been assigned to the data series name.

&nbsp; &nbsp;**Returns:** Color value, or null.

<a name="sg-reset-color-scale" href="#sg-reset-color-scale">#</a> *sg*.**resetColorScale**(*colorScale*)

Reset domain on color scale, or replace with provided.

* `colorScale` (*[d3.scaleOrdinal](https://github.com/d3/d3-scale#ordinal-scales)*) Color scale to replace with or null. See [d3.scale.chromoatic](https://github.com/d3/d3-scale-chromatic) for preset options.

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

Data series are separately defined and stores as points, lines, or areas. All functions are additive -- that is, they never replace an existing data series, only add to it.

<a name="sg-add-point-data" href="#sg-add-point-data">#</a> *sg*.**addPointData**(*name*, *xValue*, *yValue*[, *size*[, *y2Axis*[, *showNulls*]]])

Add a single point data.

* `name` (*number*) The name of the data series this point belongs to.
* `xValue` (*number*) The x-value.
* `yValue` (*number*) The y-value.
* `size` (*number*|*callback*) The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.
* `y2Axis` (*boolean*) If true, point is assigned to y2 axis.
* `showNulls` (*boolean*) If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-add-points-data" href="#sg-add-points-data">#</a> *sg*.**addPointsData**(*data*, *dataPointName*, *xValueName*, *yValueName*[, *additionalDataKeys*[, *size*[, *y2Axis*[, *showNulls*]]]])

Add multiple point data from an array of object literals. Use of *dataPointName* means the data series name for each point can be determined at each point, meaning you can add points to multiple, different data series at once with this function.

* `data` (*object[]*) The plot data as an array of objects. Use the dataPointName, xValueName, and yValueName parameters to tell the function how to parse the data.
* `dataPointName` (*string*) The key name in each data object to retrieve the data point or data series name and label. If it cannot find the given key in the data object, assumes the given string is the series name for all points. If it is null or undefined, uses the index position (thus all points will be of unique series).
* `xValueName` (*string*) The key name in each data object to retrieve the x-value.
* `yValueName` (*string*) The key name in each data object to retrieve the y-value.
* `additionalDataKeys` (*string[]*) Additional keys for data you want to store for each point.
* `size` (*number|callback*) The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.
* `y2Axis` (*boolean*) If true, point is assigned to y2 axis.
* `showNulls` (*boolean*) If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-add-points-data-as-array" href="#sg-add-points-data-as-array">#</a> *sg*.**addPointsDataAsArray**(*name*, *data*[, *size*[, *y2Axis*[, *showNulls*]]])

Add multiple point data from an array of x,y coordinates.

* `name` (*number*) The name of the data series.
* `data` (number[][]) The plot data as an array of [x,y] pairs.
* `size` (*number*|*callback*) The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.
* `y2Axis` (*boolean*) If true, point is assigned to y2 axis.
* `showNulls` (*boolean*) If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-add-line-data-as-coordinates" href="#sg-add-line-data-as-coordinates">#</a> *sg*.**addLineDataAsCoordinates**(*name*, *lineCoordinates*[, *style*[, *interpolation*[, *y2Axis*]]])

Add line data as an array of coordinates.

* `name` (*string*) The name of the data series.
* `lineCoordinates` (*number[][]*)  Array of x,y coordinates.
* `style` (*object*) Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to `{'stroke-width': 1.5}`.
* `interpolation` (*[d3.curve](https://github.com/d3/d3-shape#curves)*) Type of interpolation for line curve.
* `y2Axis` (*boolean*) Whether coordinates are for 2nd y-axis.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-add-line-data-as-function" href="#sg-add-line-data-as-function">#</a> *sg*.**addLineDataAsFunction**(*name*, *lineFunction*[, *style*[, *resolution*[, *interpolation*[, *xRange*[, *y2Axis*]]]]])

Add line data as a function.

* `name` (*string*) The name of the data series.
* `lineFunction` (*callback*) Callback function such that `lineFunction(x)` returns y value.
* `style` (*object*) Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to `{'stroke-width': 1.5}`.
* `resolution` (*number*) Resolution of the curve (that is, how spaced out on x-axis each caluclated vertex is), given as pixel width. Defaults to every 20 pixels of x-width and enforced minimum of 2.
* `interpolation` (*[d3.curve](https://github.com/d3/d3-shape#curves)*) Type of interpolation for line curve.</a>
* `xRange` (*number[]*|*Date[]*) 
* `y2Axis` (*boolean*) Whether coordinates are for 2nd y-axis.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-" href="#sg-">#</a> *sg*.**addLinesDataFromPoints**([*style*[, *interpolation*[, *handleOverlap*]]])

Create line data from coordinates in all currently existing point series.

* `style` (*object*) Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to `{'stroke-width': 1.5}`.
* `interpolation` (*[d3.curve](https://github.com/d3/d3-shape#curves)*) Type of interpolation for line curve.
* `handleOverlap` (*string*) If there are 2 or more points overlapped for a given x-value, how to handle the y-value for the line. Options are "average", "median", "highest", and "lowest".

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-" href="#sg-">#</a> *sg*.**addAreaBetweenTwoLines**(*name*, *lineFunctionBottom*, *lineFunctionTop*[, *style*[, *resolution*[, *interpolation*[, *xRange*[, *y2Axis*]]]]])

Add area data series with function pair defining bottom and top bounds of area.

* `name` (*string*) The name of the data series.
* `lineFunctionBottom` (*callback*) Callback function for bottom border of the area such that `lineFunctionBottom(x)` returns y0 value.
* `lineFunctionTop` (*callback*) Callback function for top border of the area such that `lineFunctionTop(x)` returns y1 value.
* `style` (*object*) Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to `{fill: "#ccc"}`.
* `resolution` (*number*) Resolution of the curve (that is, how spaced out on x-axis each caluclated vertex is), given as pixel width. Defaults to every 20 pixels of x-width and enforced minimum of 2.
* `interpolation` (*[d3.curve](https://github.com/d3/d3-shape#curves)*) Type of interpolation for line curve.
* `xRange` (*number[]*|*Date[]*)  The [min, max] x-range of the line. Defaults to the min-max of the graph. If supplied will still be truncated to the min-max of the graph if it extends past.
* `y2Axis` (*boolean*) Whether coordinates are for 2nd y-axis.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-" href="#sg-">#</a> *sg*.**addAreaAsCoordinates**(*name*, *areaCoordinates*[, *style*[, *resolution*[, *interpolation*[, *y2Axis*]]]])

* `name` (*string*) The name of the data series.
* `areaCoordinates` (*number[][]*)  Array of area coordinate triplets (i.e. [x, y0, y1]).
* `style` (*object*) Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to `{fill: "#ccc"}`.
* `interpolation` (*[d3.curve](https://github.com/d3/d3-shape#curves)*) Type of interpolation for line curve.
* `xRange` (*number[]*|*Date[]*)  The [min, max] x-range of the line. Defaults to the min-max of the graph. If supplied will still be truncated to the min-max of the graph if it extends past.
* `y2Axis` (*boolean*) Whether coordinates are for 2nd y-axis.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Remove Data Functions ##

<a name="sg-clear-points-data" href="#sg-clear-points-data">#</a> *sg*.**clearPointsData**()

Remove all points data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-clear-lines-data" href="#sg-clear-lines-data">#</a> *sg*.**clearLinesData**()

Remove all lines data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-clear-areas-data" href="#sg-clear-areas-data">#</a> *sg*.**clearAreasData**()

Remove all areas data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-clear-all-data" href="#sg-clear-all-data">#</a> *sg*.**clearAllData**()

Remove all data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Additional Data Functions ##

<a name="sg-get-points-data-by-series" href="#sg-get-points-data-by-series">#</a> *sg*.**getPointsDataBySeries**(*seriesName*)

* `seriesName` (*string*) Name of the data series to retrieve.

&nbsp; &nbsp;**Returns:** `pointData[]` - Array of [pointData](#api-sg-defs-pointdata).

<a name="sg-get-point-coordinates-by-series" href="#sg-get-point-coordinates-by-series">#</a> *sg*.**getPointCoordinatesBySeries**(*seriesName*)

* `seriesName` (*string*) Name of the data series to retrieve.

&nbsp; &nbsp;**Returns:** `number[][]` - Array of point coordinates.

<a name="sg-get-line-data-by-series" href="#sg-get-line-data-by-series">#</a> *sg*.**getLinesDataBySeries**(*seriesName*)

* `seriesName` (*string*) Name of the data series to retrieve.

&nbsp; &nbsp;**Returns:** `lineData[]` - Array of [lineData](#api-sg-defs-linedata).

<a name="sg-get-area-data-by-series" href="#sg-get-area-data-by-series">#</a> *sg*.**getAreasDataBySeries**(*seriesName*)

* `seriesName` (*string*) Name of the data series to retrieve.

&nbsp; &nbsp;**Returns:** `areaData[]` - Array of [areaData](#api-sg-defs-areadata).


## Draw Data Functions ##

Added data is not drawn until one of the applicable draw functions below is called for it.

<a name="sg-draw-points" href="#sg-draw-points">#</a> *sg*.**drawPoints**()

(Re)draw all points data on graph. Points will have class `.sg-point`.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-draw-lines" href="#sg-draw-lines">#</a> *sg*.**drawLines**()

(Re)draw all points data on graph. Lines will have class `.sg-line` or `.sg-plotted-line`.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-draw-areas" href="#sg-draw-areas">#</a> *sg*.**drawAreas**()

(Re)draw all area data on graph. Areas will have class `.plotted-areas`.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Remove From Graph Functions ##

<a name="sg-remove-points" href="#sg-remove-points">#</a> *sg*.**removePoints**()

Remove all drawn points on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-remove-lines" href="#sg-remove-lines">#</a> *sg*.**removeLines**()

Remove all drawn lines on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-remove-areas" href="#sg-remove-areas">#</a> *sg*.**removeAreas**()

Remove all drawn areas on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-remove-all" href="#sg-remove-all">#</a> *sg*.**removeAll**()

Remove all drawn data series on graph. Does not remove the underlying data.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Tooltip Functions ##

Tooltips are added as mouse event listeners on the SVG objects. Which means that tooltip functionality is only added to those items which are currently drawn, and removing from graph or redrawing will remove the tooltip functionality to the affected items. This means, removing tooltip functionality is simply a matter of redrawing and that tooltip functionality has to be readded on redraw (or simply add tooltip functionality last).

<a name="sg-add-tooltip-to-points" href="#sg-add-tooltip-to-points">#</a> *sg*.**addTooltipToPoints**(*tooltipTextFunction*[, *options*])

Add tooltip function to the points on the graph. Does not add tooltips to the lines connecting points, if they were added. That is handled by addTooltipToLines(). You can check the series name in the callback's returned SVG element or the class to determine type, regular lines are `.sg-plotted-line` and lines drawn from connecting points are `.sg-line`.

* `tooltipFunction` (*[tooltipTextFunction](#tooltip-text-function)*) Callback function that handles the dynamic text appearing in the tooltip.
* `options` (*object*) 
* `options.offset` (*number[]*) The x,y offset of the tooltip from the cursor (default [10,-15] places the tooltip to the bottom right of the cursor).
* `options.style` (*object*) Object literal of key-value pairs that will be applied as the tooltip div's CSS style.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-add-tooltip-to-lines" href="#sg-add-tooltip-to-lines">#</a> *sg*.**addTooltipToLines**(*tooltipTextFunction*[, *options*])

Add tooltip function to the lines on the graph.

* `tooltipFunction` (*[tooltipTextFunction](#tooltip-text-function)*) Callback function that handles the dynamic text appearing in the tooltip.
* `options` (*object*) 
* `options.offset` (*number[]*) The x,y offset of the tooltip from the cursor (default [10,-15] places the tooltip to the bottom right of the cursor).
* `options.style` (*object*) Object literal of key-value pairs that will be applied as the tooltip div's CSS style.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-add-tooltip-to-areas" href="#sg-add-tooltip-to-areas">#</a> *sg*.**addTooltipToAreas**(*tooltipTextFunction*[, *options*])

Add tooltip function to the areas on the graph.

* `tooltipFunction` (*[tooltipTextFunction](#tooltip-text-function)*) Callback function that handles the dynamic text appearing in the tooltip.
* `options` (*object*) 
* `options.offset` (*number[]*) The x,y offset of the tooltip from the cursor (default [10,-15] places the tooltip to the bottom right of the cursor).
* `options.style` (*object*) Object literal of key-value pairs that will be applied as the tooltip div's CSS style.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Highlight Functions ##

<a name="sg-highlight-points" href="#sg-highlight-points">#</a> *sg*.**highlightPoints**(*series*[, *validationCallback*[, *size*[, *fill*[, *stylesDict*]]]])

Highlights points by drawing new SVG over points. Highlights a given data series, using optional `validationCallback` to filter points within data series. Note that while `size`, `fill`, and `stylesDict` are all optional, if none are supplied, the highlight will look exactly like the point and no difference will be noticeable.

* `series` (*string*) The name of the data series.
* `validationCallback` (*callback*) The callback function to validate whether to highlight given point. Passed argument of [point data](#point-data) for given point. Return true to include point. If callback is null, assumes all points to be included.
* `size` (*number*|*callback*) Point size or callback function to determine point size. Called in scope such that `this` will refer to the [point data](#point-data). If null, uses assigned `pointsize` for point data.
* `fill` (*string*) Fill value. If null, uses same as for data series.
* `stylesDict` (*object*) Optional key-value dictionary of styles to apply to SVG.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-remove-highlight-points" href="#sg-remove-highlight-points">#</a> *sg*.**removeHighlightPoints**()

Remove any highlights on points.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="sg-remove-highlights" href="#sg-remove-highlights">#</a> *sg*.**removeHighlights**()

Remove all highlights.

&nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-save-graph"></a>
## Save Graph Functions ##

<a name="sg-save-as-png" href="#sg-save-as-png">#</a> *sg*.**saveAsPng**(*pngName*)

Save graph as a PNG. Note, in non-Edge Internet Explorer, the [canvg library](https://github.com/canvg/canvg) is required due to security error. This library is not  packaged with SimpleGraph and simply assumed loaded into global space. If canvg object is not found, function will simply error on IE.

* `pngName` (*string*) Default name to save png (".png" automatically appended if not already).

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
