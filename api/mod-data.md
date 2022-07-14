# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and getting data](./add-data.md)
* **Removing and updating data**
* [Drawing data onto the graph](./draw.md)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

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

## Data binding ##

Binding of data is only done in a few simplistic ways, which are not always consistent.

**Points**

* Singular points added from [`addPointData()`](#a-addpointdata) have no data-binding, as they are provided values as primitive types in the arguments.
* Points added from a list of data objects via [`addPointsData()`](#a-addpointsdata) bind all the points to each respective object by the keys provided in that function as called when the point was originally added. Additional data may also be bound with the option `additionalDataKeys`.
* Points added from an array via [`addPointsDataAsArray()`](#a-addpointsdataasarray) bind each points coordinates to the nested array of point coordinates.

**Lines**

* Lines defined by coordinates, added via ['addLineDataAsCoordinates()'](#a-addlinedataascoordinates), bind the line coordinates to the coordinate array provided as well as any styles with the style object if provided in the options.
* Lines defined by a function, added via ['addLineDataAsFunction()'](#a-addlinedataasfunction), bind the `xRange` parameter and the optional styles, if provided. The function itself cannot be bound.

**Point-lines**

* Point lines (added via ['addLinesDataFromPoints()'](#a-addlinedatafrompoints)) are handled internally, as these are derived from points data series. As such, data bindings to the original point data is implicit with any update/sync of the points data.

**Areas**

* Areas defined by coordinates, added via [`addAreaAsCoordinates()`](#a-addareaascoordinates), bind the area coordinates to the coordinate array provided as well as any styles with the style object if provided in the options.
* Areas defined by functions, added via [`addAreaBetweenTwoLines()`](#a-addareabetweentwolines()), only bind the `xRange` and the optional styles, if provided. The functions themselves cannot be bound.

Bindings are not automatically checked or updated. Synchronization must be manually triggered via sync functions.