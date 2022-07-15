# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* [Drawing data onto the graph](./draw.md)
* [Adding interactive features](./interactivity.md)
* **Definitions**
  * [Axis options](API.md#axis-options)
  * [Point data](API.md#point-data)
  * [Line data](API.md#line-data)
  * [Area data](API.md#area-data)
  * [Tooltip text function](API.md#tooltip-text-function)

## Definitions ##

#### Axis Options ####

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>break</td>
      <td>object</td>
      <td>
        Optional. Places an x-axis break.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>domain</td><td>number[]</td><td>Places an axis break across this range.</td>
            </tr>
            <tr>
              <td>rangegap</td><td>number</td><td>The pixel width to draw for this axis break.</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>format</td><td>string</td><td>String formatter for tick labels. Defaults to ".0f" if numeric scale or "%Y-%m-%d" if date scale.</td>
    </tr>
    <tr>
      <td>grid</td>
      <td>object</td>
      <td>
        Optional. Specify ticks for grid differently than axis bar/label.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>ticks</td><td>number</td><td>Tick intervals for grid. (See ticks).</td>
            </tr>
            <tr>
              <td>tickValues</td><td>number[]</td><td>Tick values for grid. (See tickValues).</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>label</td><td>string</td><td>Axis name/label.</td>
    </tr>
    <tr>
      <td>logBase</td><td>number</td><td>Optional base number if using logarithmic scale. Defaults to 10.</td>
    </tr>
    <tr>
      <td>max</td><td>number</td><td>Maximum value of axis. Defaults to 100.</td>
    </tr>
    <tr>
      <td>min</td><td>number</td><td>Minimum value of axis. Defaults to 0.</td>
    </tr>
    <tr>
      <td>scale</td><td>d3.scale</td><td>Optional class for scale type. Must be D3 scale class. Defaults to d3.scaleLinear.</td>
    </tr>
    <tr>
      <td>ticks</td><td>number</td><td>Optional. Number of evenly spaced tick intervals on axis to create (due to nature of axis, may not always create exactly this amount but will attempt to).</td>
    </tr>
    <tr>
      <td>tickValues</td><td>number[]</td><td>Optional. Specific values on axis to create tick marks on (this will take priority over `ticks` if both are supplied).</td>
    </tr>
  </tbody>
</table>

#### Point Data ####

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>x</td><td>number|Date</td><td>The x-value.</td>
    </tr>
    <tr>
      <td>y</td><td>number</td><td>The y-value.</td>
    </tr>
    <tr>
      <td>y2</td><td>boolean</td><td>If true, the y-value correlates to the y2 axis.</td>
    </tr>
    <tr>
      <td>size</td><td>number|function</td><td>The symbol size. May be a number, a callback function, or null.</td>
    </tr>
  </tbody>
</table>

#### Line Data ####

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>lineFunction</td><td>function</td><td>Callback functions defining the line such that f(x)=y. Null if line is defined from coordinates.</td>
    </tr>
    <tr>
      <td>coords</td><td>number[][]</td><td>Array of line coordinates [x, y] or null if line is defined from function.</td>
    </tr>
    <tr>
      <td>xRange</td><td>number[]</td><td>The [min, max] x-range of the line. Null if line is defined from coordinates.</td>
    </tr>
    <tr>
      <td>y2</td><td>boolean</td><td>If true, the y-value correlates to the y2 axis.</td>
    </tr>
    <tr>
      <td>interpolate</td><td>d3.Curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style.</td>
    </tr>
  </tbody>
</table>


#### Area Data ####

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series this point belongs to.</td>
    </tr>
    <tr>
      <td>functions</td><td>function[]</td><td>Array of bottom and top callback functions defining the area such that f(x)=y. Null if area is defined from coordinates.</td>
    </tr>
    <tr>
      <td>coords</td><td>number[][]</td><td>Array of area coordinate triplets [x, y0, y1] or null if area is defined from functions.</td>
    </tr>
    <tr>
      <td>xRange</td><td>number[]</td><td>The [min, max] x-range of the line. Null if area is defined from coordinates.</td>
    </tr>
    <tr>
      <td>y2</td><td>boolean</td><td>If true, the y-value correlates to the y2 axis.</td>
    </tr>
    <tr>
      <td>style</td><td>object</td><td>Object literal of key-value pairs that will be applied as the resulting SVG element's CSS style.</td>
    </tr>
    <tr>
      <td>interpolate</td><td>d3.Curve</td><td>Type of interpolation for line curve. See <a href="https://github.com/d3/d3-shape#curves" target="_blank">D3 Curve Factories</a></td>
    </tr>
  </tbody>
</table>

#### Tooltip Text Function ####

Handles the text appearing in the tooltip. Expected to return text/html. The following parameters are passed to provided to pull relevant data. 

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>data</td><td>object</td><td>The data object bound to the hovered SVG element. See above definitions for point data, line data, or area data, as relevant.</td>
    </tr>
    <tr>
      <td>position</td><td>number[]</td><td>The x,y relative mouse position on the g-node for the graph (e.g. [0,0] would be the top-right corner of the graph [x-min, y-max], in pixels).</td>
    </tr>
    <tr>
      <td>svgs</td><td>SVGElement[]</td><td>Array of the SVG elements in the layer selected (or null).</td>
    </tr>
    <tr>
      <td>index</td><td>number</td><td>Index of selected element in array above such that svgs[index] gives the specific SVG element.</td>
    </tr>
  </tbody>
</table>
