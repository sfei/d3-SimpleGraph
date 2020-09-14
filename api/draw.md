## Drawing data ##

After adding data, it must be explicitly drawn. As currently handled, data is reorganized and formatted before being sent to D3 to create elements. As such, data bindings are not tied to any persisting member variables of the SimpleGraph instance.

All data SVG nodes will be given the attribute `series`, which may be helpful in selecting or parsing the elements manually.

<a name="drawPoints">#</a> *sg*.**drawPoints**()

(Re)draw all points data on graph. Points will have class `.sg-point`. Additionally, depending on shape drawn, will have additional class of `.sg-point-sd` (square/diamond), `.sg-point-cr` (circle), `.sg-point-tu` (triangle-up), or `.sg-point-td` (triangle-down).

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="drawLines">#</a> *sg*.**drawLines**()

(Re)draw all points data on graph. Lines will have class `.sg-line` or `.sg-plotted-line`.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="drawAreas">#</a> *sg*.**drawAreas**()

(Re)draw all area data on graph. Areas will have class `.plotted-areas`.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removePoints">#</a> *sg*.**removePoints**()

Remove all drawn points on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeLines">#</a> *sg*.**removeLines**()

Remove all drawn lines on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeAreas">#</a> *sg*.**removeAreas**()

Remove all drawn areas on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeAll">#</a> *sg*.**removeAll**()

Remove all drawn data series on graph. Does not remove the underlying data.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.