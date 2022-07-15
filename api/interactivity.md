# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* [Drawing data onto the graph](./draw.md)
* **Adding interactive features**
  * [addTooltipToPoints](API.md#sg-add-tooltip-to-points)
  * [addTooltipToLines](API.md#sg-add-tooltip-to-lines)
  * [addTooltipToAreas](API.md#sg-add-tooltip-to-areas)
  * [highlightPoints](API.md#sg-highlight-points)
  * [removeHighlightPoints](API.md#sg-remove-highlights-points)
  * [removeHighlights](API.md#sg-remove-highlights)
* [Definitions](./defs.md)

## Adding interactive features ##

#### Tooltips ####

Tooltips are attached as event listeners to the SVG objects, tied to the data, drawn on the graph. Event listeners are attached to mouse events suffixed by `.sg-tooltip`.

To create a the tooltip itself, a div is created and appended to the document body with absolute positioning to have the least conflict possible with existing HTML and CSS layouts.

<a name="addTooltipToPoints">#</a> *sg*.**addTooltipToPoints**(*tooltipFunction*[, *forSeries*[, *options*]])

Add tooltip function to points on the graph. Does not add tooltips to the lines connecting points, if they were added. That is handled by addTooltipToLines(). You can check the series name in the callback's returned SVG element or the class to determine type, regular lines are `.sg-plotted-line` and lines drawn from connecting points are `.sg-line`.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>textFunction</td><td><a href="./defs.md#tooltip-text-function">textFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip. Note this is called on `mousemove` events.</td>
    </tr>
    <tr>
      <td>forSeries</td><td>string|string[]</td><td>If provided, only applies tooltips to series matching this name (or within list of names, if array).</td>
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
              <td>offset</td><td>number[]</td><td>The x,y offset of the tooltip from the cursor (default [15,15] places the tooltip to the bottom right of the cursor).</td>
            </tr>
            <tr>
              <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the tooltip div's CSS style.</td>
            </tr>
            <tr>
              <td>mouseover</td><td>function</td><td>Callback function that will be called on `mouseover`. Provided same parameters as <a href="./defs.md#tooltip-text-function">textFunction</a>, except is not expected to return any value.</td>
            </tr>
            <tr>
              <td>mouseout</td><td>function</td><td>Callback function that will be called on `mouseout`. Provided same parameters as <a href="./defs.md#tooltip-text-function">textFunction</a>, except is not expected to return any value.</td>
            </tr>
          </tbody>
        </table>
      </td>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addTooltipToLines">#</a> *sg*.**addTooltipToLines**(*textFunction*[, *forSeries*[, *options*]])

Add tooltip function to lines on the graph.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>textFunction</td><td><a href="./defs.md#tooltip-text-function">textFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip. Note this is called on `mousemove` events.</td>
    </tr>
    <tr>
      <td>forSeries</td><td>string|string[]</td><td>If provided, only applies tooltips to series matching this name (or within list of names, if array).</td>
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
            <tr>
              <td>mouseover</td><td>function</td><td>Callback function that will be called on `mouseover`. Provided same parameters as <a href="./defs.md#tooltip-text-function">textFunction</a>, except is not expected to return any value.</td>
            </tr>
            <tr>
              <td>mouseout</td><td>function</td><td>Callback function that will be called on `mouseout`. Provided same parameters as <a href="./defs.md#tooltip-text-function">textFunction</a>, except is not expected to return any value.</td>
            </tr>
          </tbody>
        </table>
      </td>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addTooltipToAreas">#</a> *sg*.**addTooltipToAreas**(*textFunction*[, *forSeries*[, *options*]])

Add tooltip function to areas on the graph.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>forSeries</td><td>string|string[]</td><td>If provided, only applies tooltips to series matching this name (or within list of names, if array).</td>
    </tr>
    <tr>
      <td>textFunction</td><td><a href="./defs.md#tooltip-text-function">textFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip. Note this is called on `mousemove` events.</td>
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
            <tr>
              <td>mouseover</td><td>function</td><td>Callback function that will be called on `mouseover`. Provided same parameters as <a href="./defs.md#tooltip-text-function">textFunction</a>, except is not expected to return any value.</td>
            </tr>
            <tr>
              <td>mouseout</td><td>function</td><td>Callback function that will be called on `mouseout`. Provided same parameters as <a href="./defs.md#tooltip-text-function">textFunction</a>, except is not expected to return any value.</td>
            </tr>
          </tbody>
        </table>
      </td>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.


### Highlighting ###

Highlight functionality is still somewhat rough. It does not, on it's own, add any event listeners or direct interactions with user events. Instead, event handlers defined outside should call these functions dynamically to highlight/unhighlight points as needed.

<a name="highlightPoints">#</a> *sg*.**highlightPoints**(*series*[, *validationCallback*[, *size*[, *fill*[, *stylesDict*]]]])

Highlights points by drawing new SVG over points. Highlights a given data series, using optional `validationCallback` to filter points within data series. Note that while `size`, `fill`, and `stylesDict` are all optional, if none are supplied, the highlight will look exactly like the point and no difference will be noticeable.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>validationCallback</td><td>function</td><td>The callback function to validate whether to highlight given point. Passed argument of <a href="./defs.md#defs-pointdata">point data</a> for given point. Return true to include point. If callback is null, assumes all points to be included.</td>
    </tr>
    <tr>
      <td>size</td><td>number|function</td><td>Point size or callback function to determine point size. Called in scope such that `this` will refer to the <a href="./defs.md#defs-pointdata">point data</a>. If null, uses assigned `pointsize` for point data.</td>
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

<a name="removeHighlightPoints">#</a> *sg*.**removeHighlightPoints**()

Remove any highlights on points.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeHighlights">#</a> *sg*.**removeHighlights**()

Remove all highlights.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.
