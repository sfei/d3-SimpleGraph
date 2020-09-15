## Axis, grid, and legend functions ##

#### Axis and grid ####

There are three fixed axes available: the mandatory x and y axes, and an optional y2 axis. Axes are handled as a dictionary of [axis options](./defs.md#axis-options), to be enacted once drawing the axis.

<a name="resetAxisOptions">#</a> *sg*.**resetAxisOptions**(*axisOptions*)

Redefine axis options. As calling this will invalidate anything drawn on the graph, all data is cleared from the graph on calling this.

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>axisOptions</td>
      <td>object</td>
      <td>
        Map of axis options by axis name.
        <h5>Properties</h5>
        <table>
          <tr><th>Name</th><th>Description</th></tr>
          <tr><td>x</td><td>Literal of x-Axis options (see <a href="./defs.md#axis-options">Axis Options</a>).</td></tr>
          <tr><td>y</td><td>Literal of y-Axis options (see <a href="./defs.md#axis-options">Axis Options</a>).</td></tr>
          <tr><td>y2</td><td>Optional literal of y2-Axis options (see <a href="./defs.md#axis-options">Axis Options</a>).</td></tr>
          <tr>
            <td>styles</td>
            <td>
              Optional key-value object of shared axis styles. Defaults to `fill="none"`, `stroke="black"`, and `'stroke-width'=0.5`.
            </td>
          </tr>
        </table>   
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="drawAxes">#</a> *sg*.**drawAxes**([*labelPosition*[, *xAxisPosition*[, *axisLabelMargin*]]])

Redraws the axes on the graph.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>labelPosition</td><td>string</td><td>Keywords for the label positions on each axis. Keywords include 'inside' or 'outside' for the position of both axis labels either inside or outside of the axis lines; 'center' to center both axis labels along parallel of respective axis; 'left' or 'right' to determine placement of x-axis label along axis parallel; 'top' or 'bottom' to determine placement of y-axis label along axis parallel. Keywords are assigned in the order they are read. Thus a call of "center top" would first center both labels, then move the y-axis label to the top. Defaults to "outside center".</td>
    </tr>
    <tr>
      <td>xAxisPosition</td><td>string</td><td>Placement option of the x-axis, allowing you to draw the x-axis line and labels on top or bottom. Defaults to "bottom".</td>
    </tr>
    <tr>
      <td>axisLabelMargin</td><td>number</td><td>Labels are automatically placed at a margin determined not to overlap  with the tick marks. However you may specify and additional margin here.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="drawGrid">#</a> *sg*.**drawGrid**([*style*])

Draw grid. If grid already exists, redraws it.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Optional key-value object of grid styles. Defaults to opacity=0.4, stroke="#555", and stroke-width=0.3.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeGrid">#</a> *sg*.**removeGrid**()

Removes grid.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

#### Legend ####

<a name="drawLegend">#</a> *sg*.**drawLegend**(*position*[, *options*])`**

Draw the legend onto the graph. If legend already exists, will redraw it.

<table>
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>position</td><td>number[]</td><td>x,y coordinate position from top-left corner of SVG.</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object</td>
      <td>
        Additional options for the legend.
        <h5>Properties</h5>
        <table>
          <tr>
            <td>anchor</td><td>string</td><td>Optional anchor for the coordinate x-position (left, middle, or right). Defaults "left".</td>
          </tr>
          <tr>
            <td>bgstyle</td><td>object</td><td>Optional styles for the legend. These are SVG style attributes with the exception of support for padding.</td>
          </tr>
          <tr>
            <td>itemsPerColumn</td><td>number</td><td>Optional limit on items per column. On reaching this number, a new column will be started to the right. If set to 0 or less, all will be put in single column. Note that if the next column exceeds the right margin of the graph, placement errors will result.</td>
          </tr>
          <tr>
            <td>rowHeight</td><td>number</td><td>The height per row. Default of 24 is set to best fit size of text and icons in legend (the second which is currently uncustomizable) so use care if decreasing row height.</td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.
