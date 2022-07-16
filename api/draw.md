# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* **Drawing data onto the graph**
  * [drawPoints](#a-drawpoints)
  * [drawLines](#a-drawlines)
  * [drawPointLines](#a-drawpointlines)
  * [drawAllLines](#a-drawalllines)
  * [drawAreas](#a-drawareas)
  * [drawUpdatePoints](#a-drawupdatepoints)
  * [drawUpdateLines](#a-drawupdatelines)
  * [drawUpdateAreas](#a-drawupdateareas)
  * [removePoints](#a-removepoints)
  * [removeLines](#a-removelines)
  * [removeAreas](#a-removeareas)
  * [removeAll](#a-removeall)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

## Drawing data ##

To visualize changes after adding or updating data, draw functions must be called explicitly. Draws must be called for each type of data separately (points, lines, areas, and point-lines). As such, the call-order will determine which type of data is drawn over the other.

There are two methods of drawing. The simple draw functions will erase and redraw all elements on the graph. A simple fade-in transition can be applied. Update draws (next section), will keep existing elements on the graph, instead animating their changes to align with the state of the data.

All data SVG nodes will be given the attribute `series` with the data series name, which may be helpful in selecting or parsing the elements manually.

<a name="a-drawpoints" href="#a-drawpoints">#</a> *SimpleGraph*.**drawPoints**([*showNull*[, *transition*]])

(Re)draw all points data on graph. Points will have class `.sg-point`. Additionally, depending on shape drawn, will have additional class of `.sg-point-sd` (square/diamond), `.sg-point-cr` (circle), `.sg-point-tu` (triangle-up), or `.sg-point-td` (triangle-down).

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>showNulls</td><td>boolean</td><td>If true, shows data with undefined/null y-values as y=0. If false, undefined/null y-values are not drawn.</td>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawlines" href="#a-">#</a> *SimpleGraph*.**drawLines**([*resolution*[, *transition*]])

(Re)draw lines data on graph (excluding point-lines). Lines will have class `.sg-line`.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>For lines defined as functions, determines the resolution (as evenly spaced horizontal sampling points across the graph) in which to draw the line. Defaults to 20 and a minimum of 2 is enforced.</td>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawpointlines" href="#a-">#</a> *SimpleGraph*.**drawPointLines**([*transition*])

(Re)draw all point-lines data on graph. Lines will have class `.sg-point-line`.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawalllines" href="#a-">#</a> *SimpleGraph*.**drawAllLines**([*resolution*[, *transition*]])

(Re)draw all lines data on graph. Lines will have class `.sg-line` or `.sg-point-line`.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>For lines defined as functions, determines the resolution (as evenly spaced horizontal sampling points across the graph) in which to draw the line. Defaults to 20 and a minimum of 2 is enforced.</td>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawareas" href="#a-drawareas">#</a> *SimpleGraph*.**drawAreas**([*resolution*[, *transition*]])

(Re)draw all area data on graph. Areas will have class `.sg-areas`.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>For areas defined as functions, determines the resolution (as evenly spaced horizontal sampling points across the graph) in which to draw the area boundaries. Defaults to 20 and a minimum of 2 is enforced.</td>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

## Updating drawn data ##

Update draws can be called in tandem with transitions to animate changes to the graph. New data will be faded in and existing data that was updated (for updating data, see [Removing and updating data](./mod-data.md)) will be animated to change to the new position and styles.

As existing data is kept and transitioned while new data is drawn on top, this may have odd effects on the resulting layer order if mixed.

At current, data that no longer exists is simply removed without a transition.

<a name="a-drawupdatepoints" href="#a-drawupdatepoints">#</a> *SimpleGraph*.**drawUpdatePoints**([*showNull*[, *transition*]])

Draw-update points on the graph (which will also draw-update any existing point lines).

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>showNulls</td><td>boolean</td><td>If true, shows data with undefined/null y-values as y=0. If false, undefined/null y-values are not drawn.</td>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawupdatelines" href="#a-drawupdatelines">#</a> *SimpleGraph*.**drawUpdateLines**([*resolution*[, *transition*]])

Draw-update lines on the graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-drawupdateareas" href="#adrawupdateareas-">#</a> *SimpleGraph*.**drawUpdateAreas**([*resolution*[, *transition*]])

Draw-update areas on the graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>resolution</td><td>number</td><td>For areas defined as functions, determines the resolution (as evenly spaced horizontal sampling points across the graph) in which to draw the area boundaries. Defaults to 20 and a minimum of 2 is enforced.</td>
    </tr>
    <tr>
      <td>transition</td><td>object</td><td>Optional transition options. Can just supply a truthy value or an empty object to use defaults.</td>
    </tr>
    <tr>
      <td>transition.duration</td><td>number</td><td>Transition duration in milliseconds. Defaults to 200.</td>
    </tr>
    <tr>
      <td>transition.ease</td><td>d3.ease</td><td><a href="https://github.com/d3/d3-ease" target="_blank">D3 easing function</a> for transition. Defaults to d3.easePolyOut.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

## Removing drawn data ##

The remove functions remove the drawn elements on the graph (using class selections). 

The remove functions do not remove the underlying data. For actually removing the data itself, see the clear data functions in [Removing and updating data](./mod-data.md).

<a name="a-removepoints" href="#a-removepoints">#</a> *SimpleGraph*.**removePoints**([*series*])

Remove drawn points on graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removelines" href="#a-removelines">#</a> *SimpleGraph*.**removeLines**([*series*])

Remove drawn lines (excluding point-lines) on graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removepointlines" href="#a-removepointlines">#</a> *SimpleGraph*.**removePointsLines**([*series*])

Remove drawn point-lines on graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removealllines" href="#a-removealllines">#</a> *SimpleGraph*.**removeAllLines**([*series*])

Remove drawn lines (including point-lines) on graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removeareas" href="#a-removeareas">#</a> *SimpleGraph*.**removeAreas**([*series*])

Remove drawn areas on graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removeall" href="#a-removeall">#</a> *SimpleGraph*.**removeAll**([*series*])

Remove drawn data series on graph.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only removes data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.
