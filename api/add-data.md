# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* **Adding and getting data**
  * [addPointData](#a-addpointdata)
  * [addPointsData](#a-addpointsdata)
  * [addPointsDataAsArray](#a-addpointsdataasarray)
  * [addLinesDataFromPoints](#a-addlinedatafrompoints)
  * [addLineDataAsCoordinates](#a-addlinedataascoordinates)
  * [addLineDataAsFunction](#a-addlinedataasfunction)
  * [addAreaAsCoordinates](API.md#sg-areaascoordinates)
  * [addAreaBetweenTwoLines](#a-addareabetweentwolines)
  * [getPointsDataBySeries](#a-getpointsdatabyseries)
  * [getPointCoordinatesBySeries](#a-getpointcoordinatesbyseries)
  * [getLinesDataBySeries](#a-getlinedatabyseries)
  * [getAreasDataBySeries](#a-getareadatabyseries)
* [Removing and updating data](./mod-data.md)
* [Drawing data onto the graph](./draw.md)
* [Color and point shape](./color.md)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

## Data in SimpleGraph ##

SimpleGraph stores data in a few simplified data models that contain both coordinate information and some metadata about the data series and parameters on drawing them. Data is split into categories of points, lines, areas, and pointlines (lines constructed as connections between a point data series), each of which are handled separately. For more information on how these data are detailed, see definitions of [pointData](./defs.md#defs-point-data), [lineData](./defs.md#defs-line-data), and [areaData](./defs.md#defs-area-data).

#### Data series ####

Data are referenced by series names. Multiple sets of data associated with the same series name are allowed. That is, adding another dataset with the same series name simply stacks them instead of replacing the original, and the same data series name may also appear as points, lines, and/or areas. 

Data are then referenced by series, which means that modifying or removing data can get tricky if you only want to affect a singular datum within the data series. 

E.g., you may add several lines of the same data series, and if added separately, you may specify a different interpolation type for each. However, to update the interpolation type, one either has to update the interpolation for the entire data series in bulk or update a specific index corresponding to the addition order of the data series. For more on this, see ["Removing and updating data"](./mod-data.md).

## Adding data ##

Note that bindings of input data to data model in SimpleGraph, and from there to D3 objects, depend on the method the data was added. This becomes important when updating data via syncing is desired (a prerequisite to animated transitions). For more on this, see [Removing and updating data](./mod-data.md#syncing-data).

Note that changes to the data will not be reflected until the data is [re]drawn. For more, see [Drawing data onto the graph](./draw.md).

#### Adding points ####

<a name="a-addpointdata" href="#a-addpointdata">#</a> *SimpleGraph*.**addPointData**(*series*, *xValue*, *yValue*[, *options*])

Add a single point data. 

Due to nature of coordinates provided as primitive types, no data binding will occur.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series this point belongs to. Will be converted to string value. Undefined and nulls will be assigned as empty string.</td>
    </tr>
    <tr>
      <td>xValue</td><td>number</td><td>The x-value.</td>
    </tr>
    <tr>
      <td>yValue</td><td>number</td><td>The y-value.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.shape</td><td>string</td><td>The shape to assign to the series. As multiple data series may be provided by this function, any series found in the provided data will be assigned to this shape (overwriting previous shape, if set to that series name). For currently accepted shapes, see <a href="./color.md#a-setpointseriesshape">`setPointSeriesShape()`</a>.</td>
    </tr>
    <tr>
      <td>options.size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, and y). Defaults to 10.</td>
    </tr>
    <tr>
      <td>options.y2Axis</td><td>boolean</td><td>If true, point is assigned to y2 axis.</td>
    </tr>
    <tr>
      <td>options.y2</td><td>boolean</td><td>Alias for `options.y2Axis`.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-addpointsdata" href="#a-addpointsdata">#</a> *SimpleGraph*.**addPointsData**(*data*, *seriesName*, *xValueName*, *yValueName*[, *options*])

Add multiple point data from an array of object literals. 

All data possible will be bound, which include the coordinates, the data series name (if `seriesName` is a key in the data), and any additional parameters bound via `additionalDataKeys`.

Note that the `seriesName` parameter first checks if this is a valid key for each object in the provided data. As a fallback it uses the provided value as-is. This may in some cases be undesirable behavior, especially if some datasets contain this key and some do not. To force the `seriesName` parameter to be used as-is, one can set `options.forceSeriesName` as true. If `seriesName` is null or undefined, the index of the item in the data array is used.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>data</td><td>object[]</td><td>The plot data as an array of objects. Use the seriesName, xValueName, and yValueName parameters to tell the function how to parse the data.</td>
    </tr>
    <tr>
      <td>seriesName</td><td>string</td><td>The key name in each data object to retrieve the data point or data series name. If it cannot find the given key in the data object, assumes the given string is the series name for all points. If it is null or undefined, uses the index position (thus all points will be of unique series). All series name values will be converted to string. Undefined and nulls will be assigned as empty string.</td>
    </tr>
    <tr>
      <td>xValueName</td><td>string</td><td>The key name in each data object to retrieve the x-value.</td>
    </tr>
    <tr>
      <td>yValueName</td><td>string</td><td>The key name in each data object to retrieve the y-value.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.forceSeriesName</td><td>boolean</td><td>If set and true, this forces the provided `seriesName` parameter to be used as the series name value for all added data.</td>
    </tr>
    <tr>
      <td>options.forceSeries</td><td>boolean</td><td>Alias for the above.</td>
    </tr>
    <tr>
      <td>options.shape</td><td>string</td><td>The shape to assign to the series. As multiple data series may be provided by this function, any series found in the provided data will be assigned to this shape (overwriting previous shape, if set to that series name). For currently accepted shapes, see <a href="./color.md#a-setpointseriesshape">`setPointSeriesShape()`</a>.</td>
    </tr>
    <tr>
      <td>options.size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data keys, if supplied). Defaults to 10.</td>
    </tr>
    <tr>
      <td>options.y2Axis</td><td>boolean</td><td>If true, points area assigned to y2 axis.</td>
    </tr>
    <tr>
      <td>options.y2</td><td>boolean</td><td>Alias for `options.y2Axis`.</td>
    </tr>
    <tr>
      <td>options.additionalDataKeys</td><td>string[]</td><td>Additional keys for data you want to store for each point.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-addpointsdataasarray" href="#a-">#</a> *SimpleGraph*.**addPointsDataAsArray**(*series*, *data*[, *options*])

Add multiple point data from an array of x,y coordinates. 

For each point, each x,y coordinate pair from the data array will be bound.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series this point belongs to. Will be converted to string value. Undefined and nulls will be assigned as empty string.</td>
    </tr>
    <tr>
      <td>data</td><td>number[][]</td><td>The plot data as an array of [x,y] arrays.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.shape</td><td>string</td><td>The shape to assign to the series. As multiple data series may be provided by this function, any series found in the provided data will be assigned to this shape (overwriting previous shape, if set to that series name). For currently accepted shapes, see <a href="./color.md#a-setpointseriesshape">`setPointSeriesShape()`</a>).</td>
    </tr>
    <tr>
      <td>options.size</td><td>number|callback</td><td>The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, and y). Defaults to 10.</td>
    </tr>
    <tr>
      <td>options.y2Axis</td><td>boolean</td><td>If true, points are assigned to y2 axis.</td>
    </tr>
    <tr>
      <td>options.y2</td><td>boolean</td><td>Alias for `options.y2Axis`.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

#### Creating point lines ####

A special type of dataset, lines created as the connections between points of the same data series, may be created as well.

<a name="a-addlinesdatafrompoints" href="#a-addlinesdatafrompoints">#</a> *SimpleGraph*.**addLinesDataFromPoints**([*forSeries**[, *options*]])

Add line data from existing point data series as lines connecting points in the same series.

Data bindings are implicit based on the point data from which each line is created. However, any styles, if provided, will be directly bound.

For overlaps (i.e. where multiple points lie on the same x-value), the default behavior is to use the mean y-value to place the line. However this can be set to a different behavior in the options.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>forSeries</td><td>string|string[]|function</td><td>To filter series on which to add connecting lines, either provide a series name, an array of series names, or a callback function which will be provided the name of the series to check. If null/undefined, draws point-lines for all point series.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>options.interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>options.handleOverlap</td><td>string</td><td>If there are 2 or more points overlapped for a given x-value, how to handle the y-value for the line. Options are "average", "mean", "median", "highest", "max", "lowest", "min". Defaults to average/mean.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

#### Adding line data ####

<a name="a-addlinedataascoordinates" href="#a-addlinedataascoordinates">#</a> *SimpleGraph*.**addLineDataAsCoordinates**(*series*, *coords*[, *options*])

Add line data as an array of coordinates.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series this point belongs to. Will be converted to string value. Undefined and nulls will be assigned as empty string.</td>
    </tr>
    <tr>
      <td>coords</td><td>number[][]</td><td>Array of x,y coordinates defining the line.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>options.interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>options.y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
    <tr>
      <td>options.y2</td><td>boolean</td><td>Alias for `options.y2Axis`.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-addlinedataasfunction" href="#a-addlinedataasfunction">#</a> *SimpleGraph*.**addLineDataAsFunction**(*series*, *lineFunction*[, *xRange*[, *options*]]]]])

Add line data as a function.

The function cannot be bound in anyway that syncs changes, as it is provided directly. However, using a function wrapper pattern can provided ability to manipulate this function outside of SimpleGraph. The `xRange` and styles, if provided, will be bound.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series this point belongs to. Will be converted to string value. Undefined and nulls will be assigned as empty string.</td>
    </tr>
    <tr>
      <td>lineFunction</td><td>function</td><td>Callback function such that function(x) returns y.</td>
    </tr>
    <tr>
      <td>xRange</td><td>number</td><td>The x-range of the line. Defaults to the min-max of the graph. If supplied will still be truncated to the min-max of the graph if it extends past.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>options.interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>options.y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
    <tr>
      <td>options.y2</td><td>boolean</td><td>Alias for `options.y2Axis`.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

#### Adding area data ####

<a name="a-addareaascoordinates" href="#a-addareaascoordinates">#</a> *SimpleGraph*.**addAreaAsCoordinates**(*series*, *areaCoordinates*[, *options*])

Add area data series as array of area coordinates.

The coordinate array and optional styles will be bound.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series this point belongs to. Will be converted to string value. Undefined and nulls will be assigned as empty string.</td>
    </tr>
    <tr>
      <td>areaCoordinates</td><td>number[][]</td><td>Array of area coordinate triplets (i.e. [x, y0, y1]).</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>options.interpolation</td><td>d3.curve</td><td>Type of interpolation for drawing the area boundaries. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>options.y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
    <tr>
      <td>options.y2</td><td>boolean</td><td>Alias for `options.y2Axis`.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-addareabetweentwolines" href="#a-addareabetweentwolines">#</a> *SimpleGraph*.**addAreaBetweenTwoLines**(*series*, *lineFunctionBottom*, *lineFunctionTop*[, *xRange*[, *options*]])

Add area data series with function pair defining bottom and top bounds of area.

The functions cannot be bound in anyway that syncs changes, as they are provided directly. However, using a function wrapper pattern can provided ability to manipulate this function outside of SimpleGraph. The `xRange` and styles, if provided, will be bound.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name of the data series this point belongs to. Will be converted to string value. Undefined and nulls will be assigned as empty string.</td>
    </tr>
    <tr>
      <td>lineFunctionBottom</td><td>function</td><td>Callback function for bottom border of the area such that function(x) returns y0.</td>
    </tr>
    <tr>
      <td>lineFunctionTop</td><td>function</td><td>Callback function for top border of the area such that function(x) returns y1.</td>
    </tr>
    <tr>
      <td>xRange</td><td>number[]|Date[]</td><td>The [min, max] x-range of the line. Defaults to the min-max of the graph. If supplied will still be truncated to the min-max of the graph if it extends past.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to set for the added data.</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style. Defaults to stroke-width=1.5.</td>
    </tr>
    <tr>
      <td>options.interpolation</td><td>d3.curve</td><td>Type of interpolation for drawing the area boundaries. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>options.y2Axis</td><td>boolean</td><td>Whether coordinates are for 2nd y-axis.</td>
    </tr>
    <tr>
      <td>options.y2</td><td>boolean</td><td>Alias for `options.y2Axis`.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

## Get data functions ##

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** The name of the shape assigned, or null, if no shape has been assigned.

<a name="a-getpointsdatanyseries" href="#a-getpointsdatanyseries">#</a> *SimpleGraph*.**getPointsDataBySeries**(*series*)

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

<a name="a-getpointcoordinatesbyseries" href="#a-getpointcoordinatesbyseries">#</a> *SimpleGraph*.**getPointCoordinatesBySeries**(*series*)

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

<a name="a-getlinesdatabyseries" href="#a-getlinesdatabyseries">#</a> *SimpleGraph*.**getLinesDataBySeries**(*series*)

Get line data series by name.

Note line data returns a copy of the underlying data object (including shallow copy of any array values). As such, any changes in the returned data should have no effect on the underlying data the in SimpleGraph instance.

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


<a name="a-getareasdatabyseries" href="#a-getareasdatabyseries">#</a> *SimpleGraph*.**getAreasDataBySeries**(*series*) 

Get area data series by name.

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

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `areaData[]` - Array of [areaData](./defs.md#defs-area-data).
