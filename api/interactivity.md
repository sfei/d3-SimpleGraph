<a name="api-sg-functions-tooltip"></a>
## Tooltip Functions ##

<a name="api-sg-addTooltipToPoints"></a>
**`SimpleGraph.addTooltipToPoints(tooltipFunction[, options])`** : Add tooltip function to the points on the graph. Does not add tooltips to the lines connecting points, if they were added. That is handled by addTooltipToLines(). You can check the series name in the callback's returned SVG element or the class to determine type, regular lines are `.sg-plotted-line` and lines drawn from connecting points are `.sg-line`.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="./defs.md#api-sg-defs-tooltip">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
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
          </tbody>
        </table>
      </td>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addTooltipToLines"></a>
**`SimpleGraph.addTooltipToLines(tooltipFunction[, options])`** : Add tooltip function to the lines on the graph.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="./defs.md#api-sg-defs-tooltip">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
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
          </tbody>
        </table>
      </td>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-addTooltipToAreas"></a>
**`SimpleGraph.addTooltipToAreas(tooltipFunction[, options])`** : Add tooltip function to the areas on the graph.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>tooltipFunction</td><td><a href="./defs.md#api-sg-defs-tooltip">tooltipTextFunction</a></td><td>Callback function that handles the dynamic text appearing in the tooltip.</td>
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
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-functions-highlight"></a>
## Highlight Functions ##

<a name="api-sg-highlightPoints"></a>
**`SimpleGraph.highlightPoints(series[, validationCallback[, size[, fill[, stylesDict]]]])`** : Highlights points by drawing new SVG over points. Highlights a given data series, using optional `validationCallback` to filter points within data series. Note that while `size`, `fill`, and `stylesDict` are all optional, if none are supplied, the highlight will look exactly like the point and no difference will be noticeable.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
    <tr>
      <td>validationCallback</td><td>function</td><td>The callback function to validate whether to highlight given point. Passed argument of <a href="./defs.md#api-sg-defs-pointdata">point data</a> for given point. Return true to include point. If callback is null, assumes all points to be included.</td>
    </tr>
    <tr>
      <td>size</td><td>number|function</td><td>Point size or callback function to determine point size. Called in scope such that `this` will refer to the <a href="./defs.md#api-sg-defs-pointdata">point data</a>. If null, uses assigned `pointsize` for point data.</td>
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

<a name="api-sg-removeHighlightPoints"></a>
**`SimpleGraph.removeHighlightPoints()`** : Remove any highlights on points.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-removeHighlights"></a>
**`SimpleGraph.removeHighlights()`** : Remove all highlights.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.



<style>
  table { border-collapse: collapse; font-size: 0.9em; margin-left: 2.5em; }
  th { text-align: left; background-color: #bbb; }
  td h5 { margin: 0.4em 0.2em; font-size: 1.05em; font-style: italic; }
  td table { font-size: 1em; margin: 0.2em; width: 100%; }
  td table th { background-color: #d6d6d6; border-color: #ddd; }
  td table td { background-color: #fff; border-color: #ddd; }
</style>