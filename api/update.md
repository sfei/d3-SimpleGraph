## Updating data and data transitions ##

SimpleGraph maintains separation of input data from internal data. Point, line, and area data added to a SimpleGraph instance are copied, separating the input from internal copy (though reference to original input data maintained, where possible). This is to control data-bindings to D3 objects, such that the normal process must call SimpleGraph to update actual SVG elements drawn for the data.

Thus there is not automatic data-binding tied to updates of the input dataset. However, data can be updated by reference, it just requires calling the proper functions to update and redraw (or trigger a transition animation).

#### Updating point data ####

<a name="setPointSeriesShape">#</a> *sg*.**setPointSeriesShape**(*series*, *shape*)

Assign a shape to point data series by name. If null or invalid shape is supplied, at current, the drawing function defaults to 'circle'. If points are already drawn, a redraw (via [drawPoints](./draw.md#drawPoints)()) will be necessary, this does not work with transitions.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>shape</td><td>string</td><td>The name of the shape. Currently supported shapes are 'square', 'diamond', 'circle', 'triangle', 'triangle-up', and 'triangle-down'.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="updatePointsData">#</a> *sg*.**updatePointsData**()

Updates coordinates for points via reference objects and arrays, where available. To propagate changes visually, either a redraw (via [drawPoints](./draw.md#drawPoints)()) or update (via [updatePoints](#updatePoints)()) is required.

Point data added via [addPointsData](./data.md#addPointsData)() and [addPointsDataAsArray](./md.data#addPointsDataAsArray)() maintains a reference to the input object or array. These may be updated via updating the originally referenced object, then calling this function to propagate changes (it is not automatically bound). Point data added via [addPointData](./data.md#addPointData)() cannot be dynamically updated as the function only takes in immutable references. As such, do not add points via this means if updating data will be necesssary.

Any existing lines created from points (e.g. via [addLinesDataFromPoints](./data.md#addLinesDataFromPoints)()) will also be updated to reflect the change of the point series it is connected with. However, these will require a redraw (e.g. [drawPointLines](./draw.md#drawPointLines)()) or transition (e.g. [updatePointLines](./update.md#updatePointLines)()) to propagate changes.

Note that if already drawn and the shape type was updated, draw errors may result. It is best to update shapes, redraw, then update other properties, then finally call this update function.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

#### Updating line data ####

#### Updating line interpolation and styles ####

Line style dictionaries (optionally provided when adding line data) are simply passed by reference, so these are updated any time the same referenced object is updated. If the reference was lost, or not provided, it can be pulled from the get function [getLinesDataBySeries](./data.md#getLinesDataBySeries)() which returns the [lineData](./defs.md#line-data). If the style dictionary was not originally provided, the default one created and assigned for the dataset will be in the returned object.

<a name="updateLineInterpolation">#</a> *sg*.**updateLineInterpolation**(*seriesName*, *interpolation*)

Update the interpolation method for a given data series. Can't be used to update lines created from points. For that, it is necessary to recreate the lines-from-points dataset entirely via [addLinesDataFromPoints](./data.md#addLinesDataFromPoints)().

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>seriesName</td><td>string</td><td>The name of the line series of update.</td>
    </tr>
    <tr>
      <td>interpolation</td><td>d3.curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="updateLinesData">#</a> *sg*.**updateLinesData**()

Updates coordinates for lines via reference objects and arrays, where available. To propagate changes visually, either a redraw (via [drawLines](./draw.md#drawLines)()) or update (via [updateLines](#updateLines)()) is required.

Can't be used to update lines created from points. For that, [updatePointsData](#updatePointsData)() takes care of updating point-lines. However, to propagate changes visually, a call to [drawLines](./draw.md#drawLines)() or [updateLines](#updateLines)() is still required.

Lines added as a function (via [addLineDataAsFunction](./data.md#addLineDataAsFunction)()) cannot update the function reference, however, by simply wrapping the line function passed in the argument and maintaing a means of changing that functions behavior externally, the same effect can be obtained without calling even this function.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.
