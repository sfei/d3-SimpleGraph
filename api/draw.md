# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* **Drawing data onto the graph**
  * [drawPoints](API.md#sg-draw-points)
  * [drawLines](API.md#sg-draw-lines)
  * [drawAreas](API.md#sg-draw-areas)
  * [removePoints](API.md#sg-remove-points)
  * [removeLines](API.md#sg-remove-lines)
  * [removeAreas](API.md#sg-remove-areas)
  * [removeAll](API.md#sg-remove-all)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

## Drawing data ##

After adding data, it must be explicitly drawn. As currently handled, data is reorganized and formatted before being sent to D3 to create elements. As such, data bindings are not tied to any persisting member variables of the SimpleGraph instance.

All data SVG nodes will be given the attribute `series`, which may be helpful in selecting or parsing the elements manually.

<a name="drawPoints">#</a> *sg*.**drawPoints**(*showNull*)

(Re)draw all points data on graph. Points will have class `.sg-point`. Additionally, depending on shape drawn, will have additional class of `.sg-point-sd` (square/diamond), `.sg-point-cr` (circle), `.sg-point-tu` (triangle-up), or `.sg-point-td` (triangle-down).

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>showNulls</td><td>boolean</td><td>If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not drawn.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="drawLines">#</a> *sg*.**drawAllLines**(*resolution*)

(Re)draw all lines data on graph. Lines will have class `.sg-line` or `.sg-point-line`.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>How many coordinates to calculate when drawing a line defined from a function (defaults to every 20 pixels of width if not provided and if provided enforces minimum of 2).</td>
    </tr>
  </tbody>
</table>
<a name="drawLines">#</a> *sg*.**drawLines**(*resolution*)

(Re)draw lines data on graph (excluding point-lines). Lines will have class `.sg-line`.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>How many coordinates to calculate when drawing a line defined from a function (defaults to every 20 pixels of width if not provided and if provided enforces minimum of 2).</td>
    </tr>
  </tbody>
</table>

<a name="drawPointLines">#</a> *sg*.**drawPointLines**()

(Re)draw all point-lines data on graph. Lines will have class `.sg-point-line`.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="drawAreas">#</a> *sg*.**drawAreas**()

(Re)draw all area data on graph. Areas will have class `.sg-areas`.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removePoints">#</a> *sg*.**removePoints**()

Remove all drawn points on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeLines">#</a> *sg*.**removeAllLines**()

Remove all drawn lines (including point-lines) on graph. Does not remove the underlying data.

<a name="removeLines">#</a> *sg*.**removeLines**()

Remove all drawn lines (excluding point-lines) on graph. Does not remove the underlying data.

<a name="removePointLines">#</a> *sg*.**removeLines**()

Remove all drawn point-lines on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeAreas">#</a> *sg*.**removeAreas**()

Remove all drawn areas on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeAll">#</a> *sg*.**removeAll**()

Remove all drawn data series on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.