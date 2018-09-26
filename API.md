----------

# API #

----------

* <a href="#api-sg">Constructor</a>
* <a href="#api-sg-properties">Properties</a>
* <a href="#api-sg-functions-misc">Misc. Functions</a>
* <a href="#api-sg-functions-axis-grid-legend">Axis, Grid, and Legend Functions</a>
* <a href="#api-sg-functions-color-category">Color and Category Functions</a>
* <a href="#api-sg-functions-add-data">Add Data Functions</a>
* <a href="#api-sg-functions-remove-data">Remove Data Functions</a>
* <a href="#api-sg-functions-additional-data">Additional Data Functions</a>
* <a href="#api-sg-functions-draw-data">Draw Data Functions</a>
* <a href="#api-sg-functions-remove-graph">Remove From Graph Functions</a>
* <a href="#api-sg-functions-tooltips">Tooltip Functions</a>
* <a href="#api-sg-functions-highlights">Highlight Functions</a>
* <a href="#api-sg-functions-save-graph">Save Graph Functions</a>
* <a href="#api-sg-defs">Definitions</a>


<a name="api-sg"></a>
## Constructor ##

**`new SimpleGraph(options)`**

#### Options ####

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>container</td><td>string</td><td>The DOM element query/selector to the element to append the graph to. Defaults to "body".</td>
    </tr>
    <tr>
      <td>margins</td>
      <td>object</td>
      <td>
        Optional custom margins.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>left</td><td>number</td><td>Left margin. Defaults to 40.</td>
            </tr>
            <tr>
              <td>right</td><td>number</td><td>Right margin. Defaults to 40.</td>
            </tr>
            <tr>
              <td>top</td><td>number</td><td>Top margin. Defaults to 20.</td>
            </tr>
            <tr>
              <td>bottom</td><td>number</td><td>Bottom margin. Defaults to 20.</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>width</td><td>number</td><td>Total graph width (including margins). Defaults to 600.</td>
    </tr>
    <tr>
      <td>height</td><td>number</td><td>Total graph height (including margins). Defaults to 400.</td>
    </tr>
    <tr>
      <td>allowDrawBeyondGraph</td><td>boolean</td><td>Allow drawing beyond graph. If true, all data will be drawn  as supplied. If false, points beyond the x/y-axis range will not be drawn and lines/areas will be cut off where they extend past the x/y-axis ranges.</td>
    </tr>
    <tr>
      <td>colorScale</td><td>d3.scale</td><td> Optional color scale to use with data. If data series will have non-numeric identifiers, it should be a categorical or ordinal scale. Defaults to d3.scaleOrdinal(d3.schemeCategory10).</td>
    </tr>
    <tr>
      <td>styles</td><td>object</td><td>Key-value pairs of additional CSS styles to apply to SVG.</td>
    </tr>
    <tr>
      <td>axis</td>
      <td>object</td>
      <td>
        Axis properties.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Description</th>
            </tr>
            <tr>
              <td>x</td><td>X-Axis options (see <a href="#api-sg-defs-axisoptions">Axis Options</a>).</td>
            </tr>
            <tr>
              <td>y</td><td>Y-Axis options (see <a href="#api-sg-defs-axisoptions">Axis Options</a>).</td>
            </tr>
            <tr>
              <td>y2</td><td>Y2-Axis options (see <a href="#api-sg-defs-axisoptions">Axis Options</a>).</td>
            </tr>
            <tr>
              <td>styles</td>
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
      </td>
    </tr>
  </tbody>
</table>


<a name="api-sg-properties"></a>
## Properties ##

A few (but not comprehensive) list of the important variables in an initialized SimpleGraph object are below:

* `svg` - The D3 wrapper for the SVG node
* `svgGraph` - The D3 wrapper for the <g\> node in the SVG
* `x` - The x-axis (See below for details)
* `y` - The y-axis (See below for details)
* `y2` - The second y-axis (See below for details), if it exists

<a name="api-axis"></a>
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


<a name="api-sg-functions-misc"></a>
## Misc. Functions ##

<a name="api-sg-getSvgElement"></a>
**`SimpleGraph.getSvgElement()`** : Returns D3 wrapper for SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `SimpleGraph.svg`

<a name="api-sg-getSvgGraphic"></a>
**`SimpleGraph.getSvgGraphic()`** : Returns D3 wrapper for graphic node in SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `SimpleGraph.svgGraph`

<a name="api-sg-remove"></a>
**`SimpleGraph.remove()`** : Removes SVG node from container.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-destory"></a>
**`SimpleGraph.destroy()`** : Removes and destroys SVG and this object. Irreversible.


<a name="api-sg-functions-axis-grid-legend"></a>
## Axis, Grid, and Legend Functions ##

<a name="api-sg-resetAxisOptions"></a>
**`SimpleGraph.resetAxisOptions(axisOptions)`** : Redefine axis options. As calling this will invalidate anything drawn on the graph, all data is cleared from the graph on calling this.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>axisOptions</td>
      <td>object</td>
      <td>
        Map of axis options by axis name.
        <h5>Properties</h5>
        <table>
          <tr><th>Name</th><th>Description</th></tr>
          <tr><td>x</td><td>Literal of x-Axis options (see <a href="#api-sg-defs-axisoptions">Axis Options</a>).</td></tr>
          <tr><td>y</td><td>Literal of y-Axis options (see <a href="#api-sg-defs-axisoptions">Axis Options</a>).</td></tr>
          <tr><td>y2</td><td>Optional literal of y2-Axis options (see <a href="#api-sg-defs-axisoptions">Axis Options</a>).</td></tr>
          <tr>
            <td>styles</td>
            <td>
              Optional key-value object of shared axis styles. Defaults to fill="none", stroke="black", and stroke-width=0.5.
            </td>
          </tr>
        </table>   
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-drawAxes"></a>
**`SimpleGraph.drawAxes([labelPosition[, xAxisPosition[, axisLabelMargin]]])`** : Redraws the axes on the graph.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>labelPosition</td><td>string</td><td>Keywords for the label positions on each axis. Keywords include 'inside' or 'outside' for the position of both axis labels either inside or outside of the axis lines; 'center' to center both axis labels along parallel of respective axis; 'left' or 'right' to determine placement of x-axis label along axis parallel; 'top' or 'bottom' to determine placement of y-axis label along axis parallel. Keywords are assigned in the order they are read. Thus a call of "center top" would first center both labels, then move the y-axis label to the top. Defaults to "outside center".</td>
    </tr>
    <tr>
      <td>xAxisPosition</td><td>string</td><td>Placement option of the x-axis, allowing you to draw the x-axis line and labels on top or bottom. Defaults to "bottom".</td>
    </tr>
    <tr>
      <td>axisLabelMargin</td><td>number</td><td>Labels are automatically placed at a margin determined not to overlap  with the tick marks. However you may specify and additional margin here.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-drawGrid"></a>
**`SimpleGraph.drawGrid([style])`** : Draw grid. If grid already exists, redraws it.

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

<a name="api-sg-removeGrid"></a>
**`SimpleGraph.removeGrid()`** : Remove grid.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-drawLegend"></a>
**`SimpleGraph.drawLegend(position[, anchor[, bgstyle[, itemsPerColumn[, rowHeight[, exclude]]]]])`** : Draw the legend onto the graph. If legend already exists, will redraw it.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>position</td><td>number[]</td><td>x,y coordinate position from top-left corner of SVG.</td>
    </tr>
    <tr>
      <td>anchor</td><td>string</td><td>Optional anchor for the coordinate x-position (left, middle, or right). Defaults "left".</td>
    </tr>
    <tr>
      <td>bgstyle</td><td>object</td><td>Optional styles for the legend. These are SVG style attributes with the exception of support for padding.</td>
    </tr>
    <tr>
      <td>itemsPerColumn</td><td>number</td><td>Optional limit on items per column. On reaching this number, a new column will be started to the right. If set to 0 or less, all will be put in single column. Note that if the next column exceeds the right margin of the graph, placement errors will result.</td>
    </tr>
    <tr>
      <td>rowHeight</td><td>number</td><td>The height per row. Default of 24 is set to best fit size of text and icons in legend (the second which is currently uncustomizable) so use care if decreasing row height.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-color-category"></a>
## Color/Category Functions ##

<a name="api-sg-getColorBySeriesName"></a>
**`SimpleGraph.getColorBySeriesName(name, create)`** : Get the color or style related to a data series. Attempts to return the style first, but failing that will return the color string. Note that colors will not be assigned to a data series until drawn, thus data series that do exist but haven't been drawn yet may not return a color.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name.</td>
    </tr>
    <tr>
      <td>create</td><td>boolean</td><td>If true, creates color in colorScale if color is not yet assigned. If false or left undefined, color is only returned if one has been assigned to the data series name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Color value, or null.

<a name="api-sg-resetColorScale"></a>
**`SimpleGraph.resetColorScale(colorScale)`** : Reset domain on color scale, or replace with provided.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>colorScale</td><td>d3.colorScale</td><td>olor scale to replace with or null.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-setSeriesColor"></a>
**`SimpleGraph.setSeriesColor(series, color)`** : Sets a custom color (overriding the color scale) for a given series name.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name.</td>
    </tr>
    <tr>
      <td>color</td><td>string</td><td>The color value.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeSeriesColor"></a>
**`SimpleGraph.removeSeriesColor(series)`** : Remove custom color for series name.

<table>
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-add-data"></a>
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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-remove-data"></a>
## Remove Data Functions ##

<a name="api-sg-clearPointsData"></a>
**`SimpleGraph.clearPointsData()`** : Remove all points data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-clearLinesData"></a>
**`SimpleGraph.clearLinesData()`** : Remove all lines data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-clearAreasData"></a>
**`SimpleGraph.clearAreasData()`** : Remove all areas data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-clearAllData"></a>
**`SimpleGraph.clearAllData()`** : Remove all data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `pointData[]` - Array of [pointData](#api-sg-defs-pointdata).

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `number[][]` - Array of point coordinates.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `lineData[]` - Array of [lineData](#api-sg-defs-linedata).


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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `areaData[]` - Array of [areaData](#api-sg-defs-areadata).


<a name="api-sg-functions-draw-data"></a>
## Draw Data Functions ##

<a name="api-sg-drawPoints"></a>
**`SimpleGraph.drawPoints()`** : (Re)draw all points data on graph. Points will have class `.sg-point`.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-drawLines"></a>
**`SimpleGraph.drawLines()`** : (Re)draw all points data on graph. Lines will have class `.sg-line` or `.sg-plotted-line`.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-drawAreas"></a>
**`SimpleGraph.drawAreas()`** : (Re)draw all area data on graph. Areas will have class `.plotted-areas`.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-functions-remove-graph"></a>
## Remove From Graph Functions ##

<a name="api-sg-removePoints"></a>
**`SimpleGraph.removePoints()`** : Remove all drawn points on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeLines"></a>
**`SimpleGraph.removeLines()`** : Remove all drawn lines on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeAreas"></a>
**`SimpleGraph.removeAreas()`** : Remove all drawn areas on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeAll"></a>
**`SimpleGraph.removeAll()`** : Remove all drawn data series on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeHighlightPoints"></a>
**`SimpleGraph.removeHighlightPoints()`** : Remove any highlights on points.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeHighlights"></a>
**`SimpleGraph.removeHighlights()`** : Remove all highlights.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


<a name="api-sg-defs"></a>
## Definitions ##

<a name="api-sg-defs-axisoptions"></a>
#### Axis Options ####

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

<a name="api-sg-defs-pointdata"></a>
#### Point Data ####

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

<a name="api-sg-defs-linedata"></a>
#### Line Data ####

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


<a name="api-sg-defs-areadata"></a>
#### Area Data ####

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

<a name="api-sg-defs-tooltip"></a>
#### Tooltip Text Function ####
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



<style>
  table { border-collapse: collapse; font-size: 0.9em; margin-left: 2.5em; }
  th { text-align: left; background-color: #bbb; }
  td h5 { margin: 0.4em 0.2em; font-size: 1.05em; font-style: italic; }
  td table { font-size: 1em; margin: 0.2em; width: 100%; }
  td table th { background-color: #d6d6d6; border-color: #ddd; }
  td table td { background-color: #fff; border-color: #ddd; }
</style>