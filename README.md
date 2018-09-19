----------

# D3-Simple-Graph #

----------

D3-Simple-Graph is an abstraction of the D3 library for quickly creating and adding functionality of basic, 2-dimensional plots.

**Lawrence Sim** -- lawrences@sfei.org  
**San Francisco Estuary Institute** -- 2018

## License ##

This project is licensed under the GNU Lesser General Public License. See LICENSE file for full details.

## Usage ##

D3 v4 is required for this library to work. [https://d3js.org](https://d3js.org)

Simply import `d3.simplegraph.min.js` to your application.

Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation.

[See tutorials for details on using D3 Simple Graph](./tutorials/TUTORIALS.md).

&nbsp;


&nbsp;

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

## Constructor ##
<a name="api-sg"></a>

### <span style="font-weight:normal">new</span> SimpleGraph<span style="font-weight:normal">(options)</span> ###

* `options` - Key-value object of initialization options.

<style>
table { border-collapse: collapse; font-size: 0.9em; }
th { text-align: left; }
td h5 { margin: 0.4em 0.2em; font-size: 1.05em; font-style: italic; }
td table { font-size: 1em; margin: 0.2em; }
td table th { background-color: #eee; border-color: #ddd; }
td table td { background-color: #fff; border-color: #ddd; }
</style>

<table style="margin-left:60px;">
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
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>x</td><td>object</td><td>X-Axis options. See <a href="#api-sg-resetAxisOptions">SimpleGraph.resetAxisOptions</a> for axis options.</td>
            </tr>
            <tr>
              <td>y</td><td>object</td><td>Y-Axis options. See <a href="#api-sg-resetAxisOptions">SimpleGraph.resetAxisOptions</a> for axis options.</td>
            </tr>
            <tr>
              <td>y2</td><td>object</td><td>Y2-Axis options. See <a href="#api-sg-resetAxisOptions">SimpleGraph.resetAxisOptions</a> for axis options.</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>



## Properties ##
<a name="api-sg-properties"></a>

A few (but not comprehensive) list of the important variables in an initialized SimpleGraph object are below:

* `svg` - The D3 wrapper for the SVG node
* `svgGraph` - The D3 wrapper for the <g\> node in the SVG
* `x` - The x-axis (See below for details)
* `y` - The y-axis (See below for details)
* `y2` - The second y-axis (See below for details), if it exists

#### Axis ####
<a name="api-axis"></a>

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




## Misc. Functions ##
<a name="api-sg-functions-misc"></a>

### <span style="font-weight:normal">SimpleGraph.</span>getSvgElement</span><span style="font-weight:normal">()</span> ###
<a name="api-sg-getSvgElement"></a>

Returns D3 wrapper for SVG node.

### <span style="font-weight:normal">SimpleGraph.</span>getSvgGraphic</span><span style="font-weight:normal">()</span> ###
<a name="api-sg-getSvgGraphic"></a>

Returns D3 wrapper for graphic node in SVG node.

### <span style="font-weight:normal">SimpleGraph.</span>remove</span><span style="font-weight:normal">()</span> ###
<a name="api-sg-remove"></a>

Removes SVG node from container.

### <span style="font-weight:normal">SimpleGraph.</span>destroy<span style="font-weight:normal">()</span> ###
<a name="api-sg-destory"></a>

Removes and destroys SVG and this object. Irreversible.



## Axis, Grid, and Legend Functions ##
<a name="api-sg-functions-axis-grid-legend"></a>

#### <span style="font-weight:normal">SimpleGraph.</span>resetAxisOptions<span style="font-weight:normal">(axisOptions)</span> ####
<a name="api-sg-resetAxisOptions"></a>

Redefine axis options. As calling this will invalidate anything drawn on the graph, all data is cleared from the graph on calling this.

* `styles` - Optional key-value object of shared axis styles. Values filled in by default below:

<table style="margin-left:60px;border-collapse:collapse;font-size:0.9em;">
  <tr><th>Name</th><th>Description</th></tr>
  <tr><td>fill</td><td>Defaults to "none".</td></tr>
  <tr><td>stroke-width</td><td>Defaults to 0.5.</td></tr>
  <tr><td>stroke</td><td>Defaults to "black".</td></tr>
</table>

* `axisOptions` - Set of key-value objects for axis properties.

<table style="margin-left:60px;border-collapse:collapse;font-size:0.9em;">
  <tr><th>Name</th><th>Description</th></tr>
  <tr><td>x</td><td>Literal of x-Axis options (see below).</td></tr>
  <tr><td>y</td><td>Literal of y-Axis options (see below).</td></tr>
  <tr><td>y2</td><td>Optional literal of y2-Axis options (see below).</td></tr>
</table>

<table style="margin-left:60px;border-collapse:collapse;font-size:0.9em;">
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

### <span style="font-weight:normal">SimpleGraph.</span>drawAxes<span style="font-weight:normal">(labelPosition, xAxisPosition, axisLabelMargin)</span> ###
<a name="api-sg-drawAxes"></a>

Redraws the axes on the graph.

* `labelPosition` - Keywords for the label positions on each axis. Keywords include 'inside' or 'outside' for the position of both axis labels either inside or outside of the axis lines; 'center' to center both axis labels along parallel of respective axis; 'left' or 'right' to determine placement of x-axis label along axis parallel; 'top' or 'bottom' to determine placement of y-axis label along axis parallel. Keywords are assigned in the order they are read. Thus a call of "center top" would first center both labels, then move the y-axis label to the top. Defaults to "outside center".
* `xAxisPosition` - Placement option of the x-axis, allowing you to draw the x-axis line and labels on top or bottom. Defaults to "bottom".
* `axisLabelMargin` - Labels are automatically placed at a margin determined not to overlap  with the tick marks. However you may specify and additional margin here.

### <span style="font-weight:normal">SimpleGraph.</span>drawGrid<span style="font-weight:normal">(style)</span> ###
<a name="api-sg-drawGrid"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removeGrid<span style="font-weight:normal">()</span> ###
<a name="api-sg-removeGrid"></a>

### <span style="font-weight:normal">SimpleGraph.</span>drawLegend<span style="font-weight:normal">(position, anchor, bgstyle, itemsPerColumn, rowHeight, exclude)</span> ###
<a name="api-sg-drawLegend"></a>



## Color/Category Functions ##
<a name="api-sg-functions-color-category"></a>

### <span style="font-weight:normal">SimpleGraph.</span>getColorBySeriesName<span style="font-weight:normal">(name, create)</span> ###
<a name="api-sg-getColorBySeriesName"></a>

### <span style="font-weight:normal">SimpleGraph.</span>resetColorScale<span style="font-weight:normal">(colorScale)</span> ###
<a name="api-sg-resetColorScale"></a>

### <span style="font-weight:normal">SimpleGraph.</span>setSeriesColor<span style="font-weight:normal">(series, color)</span> ###
<a name="api-sg-setSeriesColor"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removeSeriesColor<span style="font-weight:normal">(series)</span> ###
<a name="api-sg-removeSeriesColor"></a>



## Add Data Functions ##
<a name="api-sg-functions-add-data"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addPointData<span style="font-weight:normal">(name, xValue, yValue, size, y2Axis, showNulls)</span> ###
<a name="api-sg-addPointData"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addPointsData<span style="font-weight:normal">(data, dataPointName, xValueName, yValueName, additionalDataKeys, size, y2Axis, showNulls)</span> ###
<a name="api-sg-addPointsData"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addPointsDataAsArray<span style="font-weight:normal">(name, data, size, y2Axis, showNulls)</span> ###
<a name="api-sg-addPointsDataAsArray"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addLineDataAsCoordinates<span style="font-weight:normal">(name, lineCoordinates, style, interpolation, y2Axis)</span> ###
<a name="api-sg-addLineDataAsCoordinates"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addLineDataAsFunction<span style="font-weight:normal">(name, lineFunction, style, resolution, interpolation, xRange, y2Axis)</span> ###
<a name="api-sg-addLineDataAsFunction"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addLinesDataFromPoints<span style="font-weight:normal">(style, interpolation, handleOverlap)</span> ###
<a name="api-sg-addLinesDataFromPoints"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addAreaBetweenTwoLines<span style="font-weight:normal">(name, lineFunctionBottom, lineFunctionTop, style, resolution, interpolation, xRange, y2Axis)</span> ###
<a name="api-sg-addAreaBetweenTwoLines"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addAreaAsCoordinates<span style="font-weight:normal">(name, areaCoordinates, style, interpolation, y2Axis)</span> ###
<a name="api-sg-addAreaAsCoordinates"></a>



## Remove Data Functions ##
<a name="api-sg-functions-remove-data"></a>

### <span style="font-weight:normal">SimpleGraph.</span>clearPointsData<span style="font-weight:normal">()</span> ###
<a name="api-sg-clearPointsData"></a>

### <span style="font-weight:normal">SimpleGraph.</span>clearLinesData<span style="font-weight:normal">()</span> ###
<a name="api-sg-clearLinesData"></a>

### <span style="font-weight:normal">SimpleGraph.</span>clearAreasData<span style="font-weight:normal">()</span> ###
<a name="api-sg-clearAreasData"></a>

### <span style="font-weight:normal">SimpleGraph.</span>clearAllData<span style="font-weight:normal">()</span> ###
<a name="api-sg-clearAllData"></a>



## Additional Data Functions ##
<a name="api-sg-functions-additional-data"></a>

### <span style="font-weight:normal">SimpleGraph.</span>getPointsDataBySeries<span style="font-weight:normal">(seriesName)</span> ###
<a name="api-sg-getPointsDataBySeries"></a>

### <span style="font-weight:normal">SimpleGraph.</span>getPointCoordinatesBySeries<span style="font-weight:normal">(seriesName)</span> ###
<a name="api-sg-getPointCoordinatesBySeries"></a>

### <span style="font-weight:normal">SimpleGraph.</span>getLinesDataBySeries<span style="font-weight:normal">(seriesName)</span> ###
<a name="api-sg-getLinesDataBySeries"></a>

### <span style="font-weight:normal">SimpleGraph.</span>getAreasDataBySeries<span style="font-weight:normal">(seriesName)</span> ###
<a name="api-sg-getAreasDataBySeries"></a>



## Draw Data Functions ##
<a name="api-sg-functions-draw-data"></a>

### <span style="font-weight:normal">SimpleGraph.</span>drawPoints<span style="font-weight:normal">()</span> ###
<a name="api-sg-drawPoints"></a>

### <span style="font-weight:normal">SimpleGraph.</span>drawLines<span style="font-weight:normal">()</span> ###
<a name="api-sg-drawLines"></a>

### <span style="font-weight:normal">SimpleGraph.</span>drawAreas<span style="font-weight:normal">()</span> ###
<a name="api-sg-drawAreas"></a>

### <span style="font-weight:normal">SimpleGraph.</span>drawPoints<span style="font-weight:normal">()</span> ###
<a name="api-sg-drawPoints"></a>



## Remove From Graph Functions ##
<a name="api-sg-functions-remove-graph"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removePoints<span style="font-weight:normal">()</span> ###
<a name="api-sg-removePoints"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removeLines<span style="font-weight:normal">()</span> ###
<a name="api-sg-removeLines"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removeAreas<span style="font-weight:normal">()</span> ###
<a name="api-sg-removeAreas"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removeAll<span style="font-weight:normal">()</span> ###
<a name="api-sg-removeAll"></a>



## Tooltip Functions ##
<a name="api-sg-functions-tooltip"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addTooltipToPoints<span style="font-weight:normal">(tooltipFunction, options)</span> ###
<a name="api-sg-addTooltipToPoints"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addTooltipToLines<span style="font-weight:normal">(tooltipFunction, options)</span> ###
<a name="api-sg-addTooltipToLines"></a>

### <span style="font-weight:normal">SimpleGraph.</span>addTooltipToAreas<span style="font-weight:normal">(tooltipFunction, options)</span> ###
<a name="api-sg-addTooltipToAreas"></a>



## Highlight Functions ##
<a name="api-sg-functions-highlight"></a>

### <span style="font-weight:normal">SimpleGraph.</span>highlightPoints<span style="font-weight:normal">(series, validationCallback, size, fill, stylesDict)</span> ###
<a name="api-sg-highlightPoints"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removeHighlightPoints<span style="font-weight:normal">()</span> ###
<a name="api-sg-removeHighlightPoints"></a>

### <span style="font-weight:normal">SimpleGraph.</span>removeHighlights<span style="font-weight:normal">()</span> ###
<a name="api-sg-removeHighlights"></a>



## Save Graph Functions ##
<a name="api-sg-functions-save-graph"></a>

### <span style="font-weight:normal">SimpleGraph.</span>saveAsPng<span style="font-weight:normal">(pngName)</span> ###
<a name="api-sg-saveAsPng"></a>