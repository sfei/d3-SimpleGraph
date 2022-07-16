# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Adding and getting data](./add-data.md)
* **Removing and updating data**
  * [clearPointsData](#a-clearpointsdata)
  * [clearLinesData](#a-clearlinesdata)
  * [clearPointLinesData](#a-clearpointlinesdata)
  * [clearAreasData](#a-clearareasdata)
  * [clearAllData](#a-clearalldata)
  * [updatePointsData](#a-updatepointsdata)
  * [updateLinesData](#a-updatelinesdata)
  * [updateAreasData](#a-updateareasdata)
  * [syncPointsData](#a-syncpointsdata)
  * [syncLinesData](#a-synclinesdata)
  * [syncAreasData](#a-syncareasdata)
* [Drawing data onto the graph](./draw.md)
* [Color and point shape](./color.md)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

## Removing data ##

Data is removed by series names. Or, if the series name is null or undefined, it will remove all relevant data.

Note that changes to the data will not be reflected until the data is [re]drawn. For more, see [Drawing data onto the graph](./draw.md).

<a name="a-clearpointsdata" href="a-clearpointsdata">#</a> *SimpleGraph*.**clearPointsData**([*series*])

Remove points data. 

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-clearlinesdata" href="a-clearlinesdata">#</a> *SimpleGraph*.**clearLinesData**([*series*])

Remove lines data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-clearpointlinesdata" href="a-clearpointlinesdata">#</a> *SimpleGraph*.**clearPointLinesData**([*series*])

Remove lines data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>name</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-clearareasdata" href="a-clearareasdata">#</a> *SimpleGraph*.**clearAreasData**([*series*])

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
      <td>series</td><td>string</td><td>If provided, only removes data series matching this name. If null or undefined, removes all data. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-clearalldata" href="a-clearalldata">#</a> *SimpleGraph*.**clearAllData**([*series*])

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
      <td>series</td><td>string</td><td>If provided, only removes data series matching this name. If null or undefined, removes all data. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

## Data separation ##

SimpleGraph maintains separation of input data from internal data. Point, line, and area data added to a SimpleGraph instance are copied, separating the input from internal copy (though reference to original input data maintained, where possible). This is to control data-bindings to D3 objects, such that the normal process must call SimpleGraph to update actual SVG elements drawn for the data.

There are two ways of updating data. The first is a manual update via the update functions below. A secondary method is calling the syncing functions, which update the data to coincide with the data-bindings made by SimpleGraph when adding the data.

#### Data bindings ####

Binding of data is only done in a few basic ways, which are not always consistent as it depends through which route and passed parameters the data were created.

* Singular points added from [`addPointData()`](#a-addpointdata) have no data-binding, as they are provided values as primitive types in the arguments.
* Points added from a list of data objects via [`addPointsData()`](#a-addpointsdata) bind all the points to each respective object by the keys provided in that function as called when the point was originally added. Additional data may also be bound with the option `additionalDataKeys`.
* Points added from an array via [`addPointsDataAsArray()`](#a-addpointsdataasarray) bind each points coordinates to the nested array of point coordinates.
* Point lines (added via ['addLinesDataFromPoints()'](#a-addlinedatafrompoints)) are handled internally, as these are derived from points data series. As such, data bindings to the original point data is implicit with any update/sync of the points data.
* Lines defined by coordinates, added via ['addLineDataAsCoordinates()'](#a-addlinedataascoordinates), bind the line coordinates to the coordinate array provided as well as any styles with the style object if provided in the options.
* Lines defined by a function, added via ['addLineDataAsFunction()'](#a-addlinedataasfunction), bind the `xRange` parameter and the optional styles, if provided. The function itself cannot be bound.
* Areas defined by coordinates, added via [`addAreaAsCoordinates()`](#a-addareaascoordinates), bind the area coordinates to the coordinate array provided as well as any styles with the style object if provided in the options.
* Areas defined by functions, added via [`addAreaBetweenTwoLines()`](#a-addareabetweentwolines()), only bind the `xRange` and the optional styles, if provided. The functions themselves cannot be bound.

Bindings are not automatically checked or updated. Synchronization must be manually triggered via [sync functions](#sync-data-functions).

## Updating data ##

Updating data manually is somewhat tricky if there are multiple datasets attached to a data series. The data can be updated for all datasets of the same type of data series name, or the update can be specified by a specific index. 

However, figuring out what index this is may be tricky. While lines and areas are added one at a time, the function `addPointsData()` and `addPointsDataAsArray()` may be adding multiple points, with the former even potentially adding multiple points to different data series. In such a case, it may be helpful to [get the data series](./add-data.md#get-data-functions) and determine the specific index of the datum from the returned dataset.

Any updated values will change or break the corresponding data bindings.

Note that changes to the data will not be reflected until the data is [re]drawn. For more, see [Drawing data onto the graph](./draw.md).

<a name="a-updatepointsdata" href="a-updatepointsdata">#</a> *SimpleGraph*.**updatePointsData**(*series*, *index*, *update*)

Update points data. Will also sync-update point lines data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>index</td><td>number</td><td>The specific index of the datum to change. May be negative to traverse the list in reverse. Or null/undefined to apply to all data in the series.</td>
    </tr>
    <tr>
      <td>update</td><td>object</td><td>An object literal of the selected values to update.</td>
    </tr>
    <tr>
      <td>update.x</td><td>number</td><td>The updated x-coordinate. Will break any previous data binding on this.</td>
    </tr>
    <tr>
      <td>update.y</td><td>number</td><td>The updated y-coordinate. Will break any previous data binding on this.</td>
    </tr>
    <tr>
      <td>update.y2</td><td>boolean</td><td>The updated flag on whether this point is to be mapped on the y2 axis.</td>
    </tr>
    <tr>
      <td>update.size</td><td>number|callback</td><td>The updated number of callback determining the point sizes.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-updatelinesdata" href="a-updatelinesdata">#</a> *SimpleGraph*.**updateLinesData**(*series*, *index*, *update*)

Update lines data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>index</td><td>number</td><td>The specific index of the datum to change. May be negative to traverse the list in reverse. Or null/undefined to apply to all data in the series.</td>
    </tr>
    <tr>
      <td>update</td><td>object</td><td>An object literal of the selected values to update.</td>
    </tr>
    <tr>
      <td>update.lineFunction</td><td>callback</td><td>If callback for the function defining the line's shape. If the line was previously defined by coordinates, the coordinates will be erased.</td>
    </tr>
    <tr>
      <td>update.function</td><td>callback</td><td>Another alias for the above.</td>
    </tr>
    <tr>
      <td>update.coordinates</td><td>number[][]</td><td>The updated line coordinates If the line was previously defined by a function, the function will be unreferenced.</td>
    </tr>
    <tr>
      <td>update.coords</td><td>number[][]</td><td>Another alias for the above.</td>
    </tr>
    <tr>
      <td>update.interpolate</td><td>d3.curve</td><td>The updated D3 curve interpolation function.</td>
    </tr>
    <tr>
      <td>update.style</td><td>object</td><td>The updated style object. Will replace the original style dictionary and bindings.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-updateareasdata" href="a-updateareasdata">#</a> *SimpleGraph*.**updateAreasData**(*series*, *index*, *update*)

Update areas data.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>index</td><td>number</td><td>The specific index of the datum to change. May be negative to traverse the list in reverse. Or null/undefined to apply to all data in the series.</td>
    </tr>
    <tr>
      <td>update</td><td>object</td><td>An object literal of the selected values to update.</td>
    </tr>
    <tr>
      <td>update.lineFunctionTop</td><td>callback</td><td>If callback for the function defining the area's upper boundary. If the area was previously defined by coordinates, the coordinates will be erased. If the bottom boundary function is not provided, it will be assumed to be a function where the returned value is always 0.</td>
    </tr>
    <tr>
      <td>update.functionTop</td><td>callback</td><td>Another alias for the above.</td>
    </tr>
    <tr>
      <td>update.lineFunctionBottom</td><td>callback</td><td>If callback for the function defining the area's upper boundary. If the area was previously defined by coordinates, the coordinates will be erased. If the top boundary function is not provided, it will be assumed to be a function where the returned value is always 0.</td>
    </tr>
    <tr>
      <td>update.functionBottom</td><td>callback</td><td>Another alias for the above.</td>
    </tr>
    <tr>
      <td>update.coordinates</td><td>number[][]</td><td>The updated area coordinates If the area was previously defined by functions, the functions will be unreferenced.</td>
    </tr>
    <tr>
      <td>update.coords</td><td>number[][]</td><td>Another alias for the above.</td>
    </tr>
    <tr>
      <td>update.interpolate</td><td>d3.curve</td><td>The updated D3 curve interpolation function.</td>
    </tr>
    <tr>
      <td>update.style</td><td>object</td><td>The updated style object. Will replace the original style dictionary and bindings.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

## Syncing data ##

Data can also be updated by synchronizing the values to coincide with the latest values in the [data bindings](#data-bindings).

Note that changes to the data will not be reflected until the data is [re]drawn. For more, see [Drawing data onto the graph](./draw.md).

#### Sync data functions ####

<a name="a-syncpointsdata" href="a-syncpointsdata">#</a> *SimpleGraph*.**syncPointsData**()

Syncs all points data, updating all data-bound values. Will also sync-update all point lines data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-synclinesdata" href="a-synclinesdata">#</a> *SimpleGraph*.**syncLinesData**()

Syncs all lines data, updating all data-bound values.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-syncareasdata" href="a-syncareasdata">#</a> *SimpleGraph*.**syncAreasData**()

Syncs all areas data, updating all data-bound values.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

