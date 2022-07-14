## Adding and manipulating data ##

SimpleGraph stores data in a few simplified data models that contain both coordinate information and some metadata about the data series and parameters on drawing them. For more, see defintions [pointData](./defs.md#defs-point-data), [lineData](./defs.md#defs-line-data), and [areaData](./defs.md#defs-area-data).

Note that bindings of input data to data model in SimpleGraph, and from there to D3 objects, depend on the method the data was added. E.g. adding point data via [addPointData](#addPointData)(), by nature cannot maintain data linkage as there is no object reference to bind to.

This becomes particularly important when dynamically updating data in place.

#### Adding points ####

<a name="addPointData">#</a> *sg*.**addPointData**(*series*, *xValue*, *yValue*[, *options*])

Add single point data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>xValue</td><td>number</td><td>The x-value.</td>
    </tr>
    <tr>
      <td>yValue</td><td>number</td><td>The y-value.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        Additional options defining the point data.
        <h5>Properties</h5>
        <table>
          <tr>
            <td>shape</td><td>string</td><td>The shape to assign to the series. As multiple data series may be provided by this function, any series found in the provided data will be assigned to this shape (overwriting previous shape, if set to that series name). For currently accepted shapes, see [setPointSeriesShape](#setPointSeriesShape)().</td>
          </tr>
          <tr>
            <td>size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, and y). Defaults to 10.</td>
          </tr>
          <tr>
            <td>y2Axis</td><td>boolean</td><td>If true, point is assigned to y2 axis.</td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addPointsData">#</a> *sg*.**addPointsData**(*data*, *seriesName*, *xValueName*, *yValueName*[, *options*])

Add multiple point data from an array of object literals.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>data</td><td>object[]</td><td>The plot data as an array of objects. Use the seriesName, xValueName, and yValueName parameters to tell the function how to parse the data.</td>
    </tr>
    <tr>
      <td>seriesName</td><td>string</td><td>The key name in each data object to retrieve the data point or data series name. If it cannot find the given key in the data object, assumes the given string is the series name for all points. If it is null or undefined, uses the index position (thus all points will be of unique series).</td>
    </tr>
    <tr>
      <td>xValueName</td><td>string</td><td>The key name in each data object to retrieve the x-value.</td>
    </tr>
    <tr>
      <td>yValueName</td><td>string</td><td>The key name in each data object to retrieve the y-value.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        Additional options defining the point data.
        <h5>Properties</h5>
        <table>
          <tr>
            <td>shape</td><td>string</td><td>The shape to assign to the series. As multiple data series may be provided by this function, any series found in the provided data will be assigned to this shape (overwriting previous shape, if set to that series name). For currently accepted shapes, see [setPointSeriesShape](#setPointSeriesShape)().</td>
          </tr>
          <tr>
            <td>size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.</td>
          </tr>
          <tr>
            <td>y2Axis</td><td>boolean</td><td>If true, points area assigned to y2 axis.</td>
          </tr>
          <tr>
            <td>additionalDataKeys</td><td>string[]</td><td>Additional keys for data you want to store for each point.</td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addPointsDataAsArray">#</a> *sg*.**addPointsDataAsArray**(*series*, *data*[, *options*]]])

Add multiple point data from an array of x,y coordinates.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series.</td>
    </tr>
    <tr>
      <td>data</td><td>number[][]</td><td>The plot data as an array of [x,y] arrays.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        Additional options defining the point data.
        <h5>Properties</h5>
        <table>
          <tr>
            <td>shape</td><td>string</td><td>The shape to assign to the series. As multiple data series may be provided by this function, any series found in the provided data will be assigned to this shape (overwriting previous shape, if set to that series name). For currently accepted shapes, see [setPointSeriesShape](#setPointSeriesShape)().</td>
          </tr>
          <tr>
            <td>size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, and y). Defaults to 10.</td>
          </tr>
          <tr>
            <td>y2Axis</td><td>boolean</td><td>If true, points are assigned to y2 axis.</td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


#### Adding line data ####

<a name="addLineDataAsCoordinates">#</a> *sg*.**addLineDataAsCoordinates**(*name*, *coords*[, *options*])

Add line data as an array of coordinates.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>coords</td><td>number[][]</td><td>Array of x,y coordinates defining the line.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        Additional options defining the line data.
        <h5>Properties</h5>
        <table>
          <tr>
            <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
          </tr>
          <tr>
            <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
          </tr>
          <tr>
            <td>y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addLineDataAsFunction">#</a> *sg*.**addLineDataAsFunction**(*name*, *lineFunction*[, *xRange*[, *options*]]]]])

Add line data as a function.

<table style="font-size:0.9em;">
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
      <td>xRange</td><td>number</td><td>The x-range of the line. Defaults to the min-max of the graph. If supplied will still be truncated to the min-max of the graph if it extends past.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        Additional options defining the line data.
        <h5>Properties</h5>
        <table>
          <tr>
            <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
          </tr>
          <tr>
            <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
          </tr>
          <tr>
            <td>y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addLinesDataFromPoints">#</a> *sg*.**addLinesDataFromPoints**([*forSeries**[, *options*]])

Add line data from existing point data series, as lines connecting points in the same series.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>forSeries</td><td>string|string[]|function</td><td>To filter series on which to add connecting lines, either provide a series name, an array of series names, or a callback function which will be provided the name of the series to check. If null/undefined, draws point-lines for all point series.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        Additional options defining the line data.
        <h5>Properties</h5>
        <table>
          <tr>
            <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
          </tr>
          <tr>
            <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
          </tr>
          <tr>
            <td>handleOverlap</td><td>string</td><td>If there are 2 or more points overlapped for a given x-value, how to handle the y-value for the line. Options are "average", "mean", "median", "highest", "max", "lowest", "min". Defaults to average/mean.</td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


#### Adding area data ####

<a name="addAreaBetweenTwoLines">#</a> *sg*.**addAreaBetweenTwoLines**(*name*, *lineFunctionBottom*, *lineFunctionTop*[, *style*[, *resolution*[, *interpolation*[, *xRange*[, *y2Axis*]]]]])

Add area data series with function pair defining bottom and top bounds of area.

<table style="font-size:0.9em;">
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

<a name="addAreaAsCoordinates">#</a> *sg*.**addAreaAsCoordinates**(*name*, *areaCoordinates*[, *style*[, *interpolation*[, *y2Axis*]]])

Add area data series as array of area coordinates.

<table style="font-size:0.9em;">
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


## Removing data ##

<a name="clearPointsData">#</a> *sg*.**clearPointsData**([*series*])

Remove all points data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>If provided, only removes data series matching this name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="clearLinesData">#</a> *sg*.**clearLinesData**([*series*])

Remove all lines data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>If provided, only removes data series matching this name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="clearLinesData">#</a> *sg*.**clearPointLinesData**([*series*])

Remove all lines data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>If provided, only removes data series matching this name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="clearAreasData">#</a> *sg*.**clearAreasData**([*series*])

Remove all areas data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>If provided, only removes data series matching this name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="clearAllData">#</a> *sg*.**clearAllData**([*series*])

Remove all data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>If provided, only removes data series matching this name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


## Get data functions ##

<a name="getPointSeriesShape">#</a> *sg*.**getPointSeriesShape**(*series*)

Get the shape assigned to a data series.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** The name of the shape assigned, or null, if no shape has been assigned.

<a name="getPointsDataBySeries">#</a> *sg*.**getPointsDataBySeries**(*series*)

Get point data series by name.

Note point data returns a shallow copy of the underlying data object. As such, any changes in the returned data should have no effect on the underlying data the in SimpleGraph instance.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `pointData[]` - Array of [pointData](./defs.md#defs-point-data).

<a name="getPointCoordinatesBySeries">#</a> *sg*.**getPointCoordinatesBySeries**(*series*)

Get point coordinates by data series name.

Note point data returns a shallow copy of the underlying data object. As such, any changes in the returned data should have no effect on the underlying data the in SimpleGraph instance.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `number[][]` - Array of point coordinates.

<a name="getLinesDataBySeries">#</a> *sg*.**getLinesDataBySeries**(*series*)

Get line data series by name.

Note line data returns a copy of the underlying data object (including shallow copy of any array values). As such, any changes in the returned data should have no effect on the underlying data the in SimpleGraph instance.

The one exception to the above is the style object, this is passed by reference, so changing it will update the styles on the next draw of lines data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `lineData[]` - Array of [lineData](./defs.md#defs-line-data).


<a name="getAreasDataBySeries">#</a> *sg*.**getAreasDataBySeries**(*series*) Get area data series by name.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>Name of the data series to retrieve.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `areaData[]` - Array of [areaData](./defs.md#defs-area-data).
