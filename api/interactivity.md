# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* [Drawing data onto the graph](./draw.md)
* **Adding interactive features**
  * [addTooltipToPoints](#a-add-tooltiptopoints)
  * [addTooltipToLines](#a-addtooltiptolines)
  * [addTooltipToAreas](#a-addtooltiptoareas)
  * [highlightPoints](#a-highlightpoints)
  * [highlightLines](#a-highlightlines)
  * [highlightAreas](#a-highlightareas)
  * [removeHighlightPoints](#a-removehighlightpoints)
  * [removeHighlightLines](#a-removehighlightlines)
  * [removeHighlightAreass](#a-removehighlightareas)
  * [removeHighlights](#a-removehighlights)
* [Definitions](./defs.md)

## Adding tooltips ##

Tooltips are attached as event listeners to the SVG elements drawn on the graph. Event listeners are attached to mouse events suffixed by `.sg-tooltip`.

To create the tooltip itself, a div is created and appended to the document body with absolute positioning to have the least conflict possible with existing HTML and CSS layouts.

Most of the tooltip functionality is handled via the supplied [tooltipTextFunction](./defs.md#tooltip-text-function) callback, which is passed the data, mouse position, and svg elements, and is expected to return the HTML filling the tooltip itself. The callback is called for every mousemove event over elements of the data type.

To remove tooltip functionality, simply redraw the elements on the graph. As the event listeners are attached to the SVG elements

<a name="a-addtooltiptopoints" href="a-">#</a> *SimpleGraph*.**addTooltipToPoints**(*tooltipFunction*[, *options*])

Add tooltip function to points on the graph. Does not add tooltips to the point-lines. (For point-lines, use [`addTooltipToLines()`](#a-addtooltipstolines).)

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="./defs.md#tooltip-text-function">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to apply to tooltips.</td>
    </tr>
    <tr>
      <td>options.series</td><td>string|string[]</td><td>If provided, only effects data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
    <tr>
      <td>options.offset</td><td>number[]</td><td>The x,y offset of the tooltip from the cursor (default of `[10,-15]` places the tooltip to the bottom right of the cursor).</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the tooltip div's CSS style.</td>
    </tr>
    <tr>
      <td>options.mouseover</td><td>function</td><td>Callback function that will be called on `mouseover`. Provided same parameters as <a href="./defs.md#tooltip-text-function">tooltipTextFunction</a>, except is not expected to return any value.</td>
    </tr>
    <tr>
      <td>options.mouseout</td><td>function</td><td>Callback function that will be called on `mouseout`. Provided same parameters as <a href="./defs.md#tooltip-text-function">tooltipTextFunction</a>, except is not expected to return any value.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addTooltipToLines" href="a-">#</a> *SimpleGraph*.**addTooltipToLines**(*textFunction*[, *options*])

Add tooltip function to lines (including point-lines) on the graph.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="./defs.md#tooltip-text-function">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to apply to tooltips.</td>
    </tr>
    <tr>
      <td>options.series</td><td>string|string[]</td><td>If provided, only effects data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
    <tr>
      <td>options.offset</td><td>number[]</td><td>The x,y offset of the tooltip from the cursor (default of `[10,-15]` places the tooltip to the bottom right of the cursor).</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the tooltip div's CSS style.</td>
    </tr>
    <tr>
      <td>options.mouseover</td><td>function</td><td>Callback function that will be called on `mouseover`. Provided same parameters as <a href="./defs.md#tooltip-text-function">tooltipTextFunction</a>, except is not expected to return any value.</td>
    </tr>
    <tr>
      <td>options.mouseout</td><td>function</td><td>Callback function that will be called on `mouseout`. Provided same parameters as <a href="./defs.md#tooltip-text-function">tooltipTextFunction</a>, except is not expected to return any value.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="addTooltipToAreas" href="a-">#</a> *SimpleGraph*.**addTooltipToAreas**(*textFunction*[, *options*])

Add tooltip function to areas on the graph.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="./defs.md#tooltip-text-function">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
    </tr>
    <tr>
      <td>options</td><td>object</td><td>Additional options to apply to tooltips.</td>
    </tr>
    <tr>
      <td>options.series</td><td>string|string[]</td><td>If provided, only effects data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
    <tr>
      <td>options.offset</td><td>number[]</td><td>The x,y offset of the tooltip from the cursor (default of `[10,-15]` places the tooltip to the bottom right of the cursor).</td>
    </tr>
    <tr>
      <td>options.style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the tooltip div's CSS style.</td>
    </tr>
    <tr>
      <td>options.mouseover</td><td>function</td><td>Callback function that will be called on `mouseover`. Provided same parameters as <a href="./defs.md#tooltip-text-function">tooltipTextFunction</a>, except is not expected to return any value.</td>
    </tr>
    <tr>
      <td>options.mouseout</td><td>function</td><td>Callback function that will be called on `mouseout`. Provided same parameters as <a href="./defs.md#tooltip-text-function">tooltipTextFunction</a>, except is not expected to return any value.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

## Highlighting ##

Highlight functionality is still somewhat rough. It does not, on it's own, add any event listeners or direct interactions with user events. Instead, event handlers defined outside should call these functions dynamically to highlight/unhighlight elements as needed.

The original SVG element tied to the highlighted data is given the class `sg-highlight-hide`, which hides the SVG by setting the element's inline style to `opacity:0` (thus still preserving mouse events). The highlight itself is a clone of that SVG (or two) with the highlight effects applied.

<a name="a-highlightpoints" href="a-highlightpoints">#</a> *SimpleGraph*.**highlightPoints**(*options*)

Highlights points by drawing a new SVG over highlighted points. By default, the highlight style enlarges the points, but this can be overwritten via the options.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only effects data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
    <tr>
      <td>filter</td><td>function</td><td>The callback function to validate whether to highlight given point. Passed argument of <a href="./defs.md#defs-pointdata">point data</a> for given point and the SVG element. Return true to include the point for highlighting. If callback is undefined or null, assumes all points to be included.</td>
    </tr>
    <tr>
      <td>size</td><td>number|function</td><td>Point size or callback function to determine point size. Called in scope such that `this` will refer to the <a href="./defs.md#defs-pointdata">point data</a>. If null, uses assigned `pointsize` for point data.</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Optional key-value dictionary of styles to apply to SVG.</td>
    </tr>
  </tbody>
</table>

<a name="a-highlightlines" href="a-highlightlines">#</a> *SimpleGraph*.**highlightLines**(*options*)

Highlights lines by drawing new SVGs over highlighted lines. By default, the highlight is to add a brightened and blurred background to the line (with a new copy of the line drawn over to have the effect of the blur behind).

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only effects data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
    <tr>
      <td>filter</td><td>function</td><td>The callback function to validate whether to highlight given line. Passed argument of <a href="./defs.md#defs-linedata">line data</a> for given line and the SVG element. Return true to include the line for highlighting. If callback is undefined or null, assumes all points to be included.</td>
    </tr>
    <tr>
      <td>noblur</td><td>boolean</td><td>If true, does not add the blur effect.</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Optional key-value dictionary of styles to apply to SVG. Styles are added to the overdrawn line.</td>
    </tr>
    <tr>
      <td>blurstyle</td><td>object</td><td>Optional key-value dictionary of styles to apply to SVG. Styles are added to the blur effect.</td>
    </tr>
  </tbody>
</table>

<a name="a-highlightareas" href="a-highlightareas">#</a> *SimpleGraph*.**highlightAreas**(*options*)

Highlights areas by drawing new SVGs over highlighted areas. By default, the highlight is to set the opacity to 1 and add a black outline.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string|string[]</td><td>If provided, only effects data series matching this name. May also be an array to remove multiple data series at once.</td>
    </tr>
    <tr>
      <td>filter</td><td>function</td><td>The callback function to validate whether to highlight given line. Passed argument of <a href="./defs.md#defs-linedata">line data</a> for given line and the SVG element. Return true to include the line for highlighting. If callback is undefined or null, assumes all points to be included.</td>
    </tr>
    <tr>
      <td>nooutline</td><td>boolean</td><td>If true, does not add the outline.</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Optional key-value dictionary of styles to apply to SVG. Styles are added to the overdrawn line.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removehighlightpoints" href="a-removehighlightpoints">#</a> *SimpleGraph*.**removeHighlightPoints**()

Remove any highlights on points.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removehighlightlines" href="a-removehighlightlines">#</a> *SimpleGraph*.**removeHighlightLines**()

Remove any highlights on points.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removehighlightareas" href="a-removehighlightareas">#</a> *SimpleGraph*.**removeHighlightAreas**()

Remove any highlights on points.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removehighlights" href="a-">#</a> *SimpleGraph*.**removeHighlights**()

Remove all highlight effects.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.
