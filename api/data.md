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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `pointData[]` - Array of [pointData](./defs.md#api-sg-defs-pointdata).

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `lineData[]` - Array of [lineData](./defs.md#api-sg-defs-linedata).


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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `areaData[]` - Array of [areaData](./defs.md#api-sg-defs-areadata).


<style>
  table { border-collapse: collapse; font-size: 0.9em; margin-left: 2.5em; }
  th { text-align: left; background-color: #bbb; }
  td h5 { margin: 0.4em 0.2em; font-size: 1.05em; font-style: italic; }
  td table { font-size: 1em; margin: 0.2em; width: 100%; }
  td table th { background-color: #d6d6d6; border-color: #ddd; }
  td table td { background-color: #fff; border-color: #ddd; }
</style>